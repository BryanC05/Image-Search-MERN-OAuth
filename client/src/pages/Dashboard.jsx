"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import SearchBar from "../components/SearchBar"
import ImageGrid from "../components/ImageGrid"
import TopSearches from "../components/TopSearches"
import SearchHistory from "../components/SearchHistory"
import "./Dashboard.css"

function Dashboard({ user }) {
  const [images, setImages] = useState([])
  const [topSearches, setTopSearches] = useState([])
  const [searchHistory, setSearchHistory] = useState([])
  const [selectedImages, setSelectedImages] = useState([])
  const [loading, setLoading] = useState(false)
  const [currentQuery, setCurrentQuery] = useState("")
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetchTopSearches()
    fetchSearchHistory()
  }, [])

  const fetchTopSearches = async () => {
    try {
      const response = await axios.get("/api/top-searches")
      setTopSearches(response.data?.topSearches || response.data || [])
    } catch (error) {
      console.error("Failed to fetch top searches:", error)
    }
  }

  const fetchSearchHistory = async () => {
    try {
      const response = await axios.get("/api/history")
      setSearchHistory(response.data?.searches || response.data || [])
    } catch (error) {
      console.error("Failed to fetch search history:", error)
    }
  }

  const handleSearch = async (query) => {
    setLoading(true)
    setCurrentQuery(query)
    setShowHistory(false)
    try {
      const response = await axios.post("/api/search", { term: query })
      const raw = response.data?.results || []
      const normalized = raw.map((it) => ({
        id: it.id,
        url: it.urls?.regular || it.urls?.small || it.url,
        description: it.alt_description || it.description || "",
        likes: typeof it.likes === "number" ? it.likes : 0,
        downloads: typeof it.downloads === "number" ? it.downloads : 0,
      }))
      setImages(normalized)
      setSelectedImages([])
      fetchSearchHistory()
      fetchTopSearches()
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageSelect = (imageId) => {
    setSelectedImages((prev) => (prev.includes(imageId) ? prev.filter((id) => id !== imageId) : [...prev, imageId]))
  }

  const handleHistoryClick = (historyItem) => {
    setCurrentQuery(historyItem.query)
    const normalized = (historyItem.results || []).map((it) => ({
      id: it.id,
      url: it.urls?.regular || it.urls?.small || it.url,
      description: it.alt_description || it.description || "",
      likes: typeof it.likes === "number" ? it.likes : 0,
      downloads: typeof it.downloads === "number" ? it.downloads : 0,
    }))
    setImages(normalized)
    setSelectedImages(historyItem.selectedImages || [])
    setShowHistory(false)
  }

  if (!user) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h2>Please log in to search and view history.</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Find Your Perfect Image</h2>
        <SearchBar onSearch={handleSearch} />
        <button className="history-toggle" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide History" : "View History"}
        </button>
      </div>

      {showHistory && <SearchHistory history={searchHistory} onSelectHistory={handleHistoryClick} />}

      {topSearches.length > 0 && !currentQuery && !showHistory && (
        <TopSearches searches={topSearches} onSearch={handleSearch} />
      )}

      {loading && <div className="loading">Searching...</div>}

      {images.length > 0 && (
        <div className="results-section">
          <div className="results-header">
            <div>
              <h3>Results for "{currentQuery}"</h3>
            </div>
            <div className="results-actions">
              <span className="selected-count">Selected: {selectedImages.length} images</span>
            </div>
          </div>
          <ImageGrid images={images} selectedImages={selectedImages} onSelectImage={handleImageSelect} />
        </div>
      )}

      {!loading && images.length === 0 && currentQuery && (
        <div className="no-results">No images found for "{currentQuery}"</div>
      )}
    </div>
  )
}

export default Dashboard
