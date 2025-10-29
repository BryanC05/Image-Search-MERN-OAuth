"use client"

import { useState } from "react"
import "./SearchBar.css"

function SearchBar({ onSearch }) {
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  return (
    <form className={`search-bar ${isFocused ? "focused" : ""}`} onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Search for images..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="search-input"
      />
      <button type="submit" className="search-btn">
        <span>Search</span>
      </button>
    </form>
  )
}

export default SearchBar
