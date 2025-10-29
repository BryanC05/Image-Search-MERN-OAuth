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
            title={`${search.count ?? search.total} searches`}
          >
            <span className="tag-text">{search.query}</span>
            <span className="search-count">{search.count ?? search.total}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default TopSearches
