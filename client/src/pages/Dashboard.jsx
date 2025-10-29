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
  const [currentSearchId, setCurrentSearchId] = useState(null)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    fetchTopSearches()
    fetchSearchHistory()
  }, [])

  const fetchTopSearches = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/search/top-searches")
      setTopSearches(response.data)
    } catch (error) {
      console.error("Failed to fetch top searches:", error)
    }
  }

  const fetchSearchHistory = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/search/history", {
        withCredentials: true,
      })
      setSearchHistory(response.data)
    } catch (error) {
      console.error("Failed to fetch search history:", error)
    }
  }

  const handleSearch = async (query) => {
    setLoading(true)
    setCurrentQuery(query)
    setShowHistory(false)
    try {
      const response = await axios.post("http://localhost:5000/api/search/images", { query }, { withCredentials: true })
      setImages(response.data.results)
      setSelectedImages([])
      // Refresh history after search
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

  const handleSaveSelection = async () => {
    if (!currentSearchId || selectedImages.length === 0) return

    try {
      await axios.post(
        "http://localhost:5000/api/search/save-selection",
        { searchId: currentSearchId, selectedImages },
        { withCredentials: true },
      )
      alert("Selection saved successfully!")
    } catch (error) {
      console.error("Failed to save selection:", error)
    }
  }

  const handleHistoryClick = (historyItem) => {
    setCurrentQuery(historyItem.query)
    setImages(historyItem.results)
    setSelectedImages(historyItem.selectedImages || [])
    setCurrentSearchId(historyItem._id)
    setShowHistory(false)
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
              <span className="selected-count">{selectedImages.length} selected</span>
              {selectedImages.length > 0 && (
                <button className="save-btn" onClick={handleSaveSelection}>
                  Save Selection
                </button>
              )}
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
