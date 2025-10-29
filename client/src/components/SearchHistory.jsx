"use client"

import "./SearchHistory.css"

function SearchHistory({ history, onSelectHistory }) {
  return (
    <div className="search-history">
      <h3>Search History</h3>
      {history.length === 0 ? (
        <p className="no-history">No search history yet</p>
      ) : (
        <div className="history-list">
          {history.map((item) => (
            <div key={item._id} className="history-item" onClick={() => onSelectHistory(item)}>
              <div className="history-query">{item.query}</div>
              <div className="history-meta">
                <span className="history-count">{item.results.length} images</span>
                <span className="history-date">{new Date(item.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchHistory
