import express from "express"
import axios from "axios"
import Search from "../models/Search.js"
import TopSearch from "../models/TopSearch.js"

const router = express.Router()

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next()
  } else {
    res.status(401).json({ message: "Not authenticated" })
  }
}

// SECURITY FIX: Input Validation Helper
const validateSearchInput = (query, page) => {
  const errors = []
  
  if (!query || typeof query !== 'string') {
    errors.push('Query parameter is required and must be a string')
  } else if (query.length < 2) {
    errors.push('Query must be at least 2 characters long')
  } else if (query.length > 100) {
    errors.push('Query cannot exceed 100 characters')
  }
  
  if (page && (isNaN(page) || page < 1 || page > 100)) {
    errors.push('Page must be between 1 and 100')
  }
  
  return errors
}

// SECURITY FIX: Sanitize query string
const sanitizeQuery = (query) => {
  return query
    .trim()
    .replace(/[<>"'`]/g, '')
    .slice(0, 100)
}

// Search images - with input validation
router.post("/images", isAuthenticated, async (req, res) => {
  try {
    const { query, page = 1 } = req.body
    
    // Validate input
    const validationErrors = validateSearchInput(query, page)
    if (validationErrors.length > 0) {
      return res.status(400).json({ 
        message: 'Validation failed',
        errors: validationErrors 
      })
    }
    
    // Sanitize query
    const sanitizedQuery = sanitizeQuery(query)
    const sanitizedPage = Math.max(1, Math.min(parseInt(page), 100))

    // Call Unsplash API
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query: sanitizedQuery,
        page: sanitizedPage,
        per_page: 20,
        client_id: process.env.UNSPLASH_ACCESS_KEY,
      },
      timeout: 10000,
    })

    // Update top searches
    const topSearch = await TopSearch.findOne({ query: sanitizedQuery })
    if (topSearch) {
      topSearch.count += 1
      topSearch.lastSearched = new Date()
      await topSearch.save()
    } else {
      await TopSearch.create({ query: sanitizedQuery, count: 1 })
    }

    // Save search to database
    const search = new Search({
      userId: req.user._id,
      query: sanitizedQuery,
      results: response.data.results.map((img) => ({
        id: img.id,
        url: img.urls.regular,
        description: img.description || img.alt_description,
        likes: img.likes,
        downloads: img.downloads,
      })),
    })
    await search.save()

    res.json({
      results: response.data.results.map((img) => ({
        id: img.id,
        url: img.urls.regular,
        description: img.description || img.alt_description,
        likes: img.likes,
        downloads: img.downloads,
      })),
      total: response.data.total,
    })
  } catch (error) {
    console.error("Search error:", error.message)
    res.status(500).json({ 
      message: "Search failed",
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    })
  }
})

// Save selected images - with validation
router.post("/save-selection", isAuthenticated, async (req, res) => {
  try {
    const { searchId, selectedImages } = req.body
    
    // Validate searchId
    if (!searchId || typeof searchId !== 'string') {
      return res.status(400).json({ message: 'Invalid search ID' })
    }
    
    // Validate selectedImages is an array with reasonable size
    if (!Array.isArray(selectedImages)) {
      return res.status(400).json({ message: 'selectedImages must be an array' })
    }
    
    if (selectedImages.length > 50) {
      return res.status(400).json({ message: 'Cannot select more than 50 images' })
    }

    const search = await Search.findByIdAndUpdate(
      searchId, 
      { selectedImages }, 
      { new: true, runValidators: true }
    )
    
    if (!search) {
      return res.status(404).json({ message: 'Search not found' })
    }

    res.json({ message: "Selection saved", search })
  } catch (error) {
    console.error("Save selection error:", error.message)
    res.status(500).json({ 
      message: "Failed to save selection",
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    })
  }
})

// Get top searches
router.get("/top-searches", async (req, res) => {
  try {
    const topSearches = await TopSearch.find()
      .sort({ count: -1 })
      .limit(10)
      .select('query count lastSearched')
    res.json(topSearches)
  } catch (error) {
    console.error("Top searches error:", error.message)
    res.status(500).json({ 
      message: "Failed to fetch top searches",
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    })
  }
})

// Get search by ID - with validation
router.get("/:searchId", isAuthenticated, async (req, res) => {
  try {
    const { searchId } = req.params
    
    // Validate searchId format
    if (!searchId || !/^[0-9a-fA-F]{24}$/.test(searchId)) {
      return res.status(400).json({ message: 'Invalid search ID format' })
    }
    
    const search = await Search.findById(searchId)
    if (!search) {
      return res.status(404).json({ message: "Search not found" })
    }
    
    // Verify ownership
    if (search.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Access denied" })
    }
    
    res.json(search)
  } catch (error) {
    console.error("Get search error:", error.message)
    res.status(500).json({ 
      message: "Failed to fetch search",
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    })
  }
})

// Get user search history - with pagination
router.get("/history", isAuthenticated, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = Math.min(parseInt(req.query.limit) || 20, 50)
    
    const history = await Search.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip((page - 1) * limit)
      .select('query createdAt results')
    
    const total = await Search.countDocuments({ userId: req.user._id })
    
    res.json({
      history,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      }
    })
  } catch (error) {
    console.error("Search history error:", error.message)
    res.status(500).json({ 
      message: "Failed to fetch history",
      error: process.env.NODE_ENV === 'production' ? undefined : error.message
    })
  }
})

export default router
