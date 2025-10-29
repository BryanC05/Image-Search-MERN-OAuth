"use client"

import "./TopSearches.css"

function TopSearches({ searches, onSearch }) {
  return (
    <div className="top-searches">
      <h3>Popular Searches</h3>
      <div className="searches-list">
        {searches.map((search) => (
          <button
            key={search._id}
            className="search-tag"
            onClick={() => onSearch(search.query)}
            title={`${search.count} searches`}
          >
            <span className="tag-text">{search.query}</span>
            <span className="search-count">{search.count}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TopSearches
