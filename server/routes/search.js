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

// Search images
router.post("/images", isAuthenticated, async (req, res) => {
  try {
    const { query, page = 1 } = req.body

    // Call Unsplash API
    const response = await axios.get("https://api.unsplash.com/search/photos", {
      params: {
        query,
        page,
        per_page: 20,
        client_id: process.env.UNSPLASH_ACCESS_KEY,
      },
    })

    // Update top searches
    const topSearch = await TopSearch.findOne({ query })
    if (topSearch) {
      topSearch.count += 1
      topSearch.lastSearched = new Date()
      await topSearch.save()
    } else {
      await TopSearch.create({ query, count: 1 })
    }

    // Save search to database
    const search = new Search({
      userId: req.user._id,
      query,
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
    console.error("Search error:", error)
    res.status(500).json({ message: "Search failed" })
  }
})

// Save selected images
router.post("/save-selection", isAuthenticated, async (req, res) => {
  try {
    const { searchId, selectedImages } = req.body

    const search = await Search.findByIdAndUpdate(searchId, { selectedImages }, { new: true })

    res.json({ message: "Selection saved", search })
  } catch (error) {
    res.status(500).json({ message: "Failed to save selection" })
  }
})

// Get top searches
router.get("/top-searches", async (req, res) => {
  try {
    const topSearches = await TopSearch.find().sort({ count: -1 }).limit(10)
    res.json(topSearches)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch top searches" })
  }
})

// Get search by ID
router.get("/:searchId", isAuthenticated, async (req, res) => {
  try {
    const search = await Search.findById(req.params.searchId)
    if (!search) {
      return res.status(404).json({ message: "Search not found" })
    }
    res.json(search)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch search" })
  }
})

// Get user search history
router.get("/history", isAuthenticated, async (req, res) => {
  try {
    const searches = await Search.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(20)
    res.json(searches)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch search history" })
  }
})

export default router
