'use client'

import React, { useState, useRef, useEffect } from 'react'

interface SearchBarProps {
  onSearch: (query: string) => void
  placeholder?: string
  size?: 'small' | 'medium' | 'large'
  showRecentSearches?: boolean
  recentSearches?: string[]
}

export default function SearchBar({
  onSearch,
  placeholder = 'Search images...',
  size = 'large',
  showRecentSearches = false,
  recentSearches = []
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const [showRecent, setShowRecent] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Close recent searches when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRecent(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
      setShowRecent(false)
    }
  }

  const handleClear = () => {
    setQuery('')
  }

  const handleRecentClick = (recentQuery: string) => {
    setQuery(recentQuery)
    onSearch(recentQuery)
    setShowRecent(false)
  }

  const sizeClasses = {
    small: 'max-w-md',
    medium: 'max-w-2xl',
    large: 'max-w-4xl'
  }

  const inputHeight = {
    small: 'h-10',
    medium: 'h-12',
    large: 'h-14'
  }

  return (
    <div 
      ref={searchRef}
      className={`w-full ${sizeClasses[size]} mx-auto relative`}
    >
      {/* Decorative corner flourish - top left */}
      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[var(--victorian-gold)] rounded-tl-lg" />
      
      {/* Decorative corner flourish - top right */}
      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[var(--victorian-gold)] rounded-tr-lg" />
      
      {/* Decorative corner flourish - bottom left */}
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[var(--victorian-gold)] rounded-bl-lg" />
      
      {/* Decorative corner flourish - bottom right */}
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[var(--victorian-gold)] rounded-br-lg" />

      <form onSubmit={handleSearch} className="relative">
        {/* Sepia-toned background with ornate border */}
        <div className={`
          flex items-center
          bg-[var(--victorian-cream)]
          border-2 border-[var(--victorian-gold)]
          rounded-lg
          shadow-lg
          transition-all duration-300
          ${isFocused ? 'shadow-[0_0_20px_var(--victorian-gold)]' : ''}
       `}>
          
          {/* Search Icon with shimmer effect */}
          <div className="pl-4 pr-3">
            <svg
              className={`
                w-6 h-6 text-[var(--victorian-burgundy)]
                transition-all duration-300
                ${isFocused ? 'animate-pulse' : ''}
              `}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Search Input */}
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              setIsFocused(true)
              if (showRecentSearches && recentSearches.length > 0) {
                setShowRecent(true)
              }
            }}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={`
              flex-1 bg-transparent
              text-[var(--victorian-charcoal)]
              placeholder-[var(--victorian-bronze)]
              font-lato
              ${inputHeight[size]}
              text-lg
              focus:outline-none
              victorian-input
            `}
          />

          {/* Clear Button */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="p-2 mr-2 text-[var(--victorian-bronze)] hover:text-[var(--victorian-burgundy)] transition-colors duration-200"
              aria-label="Clear search"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}

          {/* Advanced Search Toggle */}
          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`
              p-2 mr-2
              text-[var(--victorian-bronze)]
              hover:text-[var(--victorian-gold)]
              transition-all duration-200
              ${showFilters ? 'text-[var(--victorian-gold)]' : ''}
            `}
            aria-label="Toggle advanced search"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 4a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </button>

          {/* Search Button */}
          <button
            type="submit"
            className={`
              victorian-button
              ${inputHeight[size]}
              px-6
              mr-2
              rounded-md
              font-playfair
              font-semibold
              transition-all duration-300
            `}
          >
            Search
          </button>
        </div>

        {/* Gold gradient accent strip */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[var(--victorian-gold)] via-[var(--victorian-bronze)] to-[var(--victorian-gold)] rounded-b-lg" />
      </form>

      {/* Recent Searches Dropdown */}
      {showRecent && showRecentSearches && recentSearches.length > 0 && (
        <div className={`
          absolute top-full left-0 right-0 mt-2
          bg-[var(--victorian-cream)]
          border-2 border-[var(--victorian-gold)]
          rounded-lg
          shadow-xl
          z-50
          max-h-64
          overflow-y-auto
        `}>
          <div className="p-3 border-b border-[var(--victorian-gold)] bg-gradient-to-r from-[var(--victorian-burgundy)] to-[var(--victorian-purple)]">
            <h4 className="victorian-heading text-sm text-[var(--victorian-antique-white)]">
              Recent Searches
            </h4>
          </div>
          <ul className="py-2">
            {recentSearches.map((search, index) => (
              <li key={index}>
                <button
                  onClick={() => handleRecentClick(search)}
                  className="
                    w-full px-4 py-2
                    text-left
                    text-[var(--victorian-charcoal)]
                    font-lato
                    hover:bg-[var(--victorian-gold)]
                    hover:text-[var(--victorian-burgundy)]
                    transition-all duration-200
                    flex items-center
                    gap-3
                  "
                >
                  <svg className="w-4 h-4 text-[var(--victorian-bronze)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  {search}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className={`
          absolute top-full left-0 right-0 mt-2
          bg-[var(--victorian-cream)]
          border-2 border-[var(--victorian-gold)]
          rounded-lg
          shadow-xl
          z-50
          p-4
        `}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="victorian-heading text-xs text-[var(--victorian-burgundy)] block mb-2">
                Image Type
              </label>
              <select className="w-full victorian-input p-2 text-sm">
                <option value="">All Types</option>
                <option value="photo">Photo</option>
                <option value="illustration">Illustration</option>
                <option value="painting">Painting</option>
              </select>
            </div>
            <div>
              <label className="victorian-heading text-xs text-[var(--victorian-burgundy)] block mb-2">
                Orientation
              </label>
              <select className="w-full victorian-input p-2 text-sm">
                <option value="">All</option>
                <option value="landscape">Landscape</option>
                <option value="portrait">Portrait</option>
                <option value="square">Square</option>
              </select>
            </div>
            <div>
              <label className="victorian-heading text-xs text-[var(--victorian-burgundy)] block mb-2">
                Color
              </label>
              <select className="w-full victorian-input p-2 text-sm">
                <option value="">Any Color</option>
                <option value="burgundy">Burgundy</option>
                <option value="gold">Gold</option>
                <option value="cream">Cream</option>
                <option value="charcoal">Charcoal</option>
              </select>
            </div>
            <div>
              <label className="victorian-heading text-xs text-[var(--victorian-burgundy)] block mb-2">
                Size
              </label>
              <select className="w-full victorian-input p-2 text-sm">
                <option value="">Any Size</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(false)}
              className="victorian-button px-4 py-2 text-sm"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => {
                handleSearch()
                setShowFilters(false)
              }}
              className="victorian-button px-4 py-2 text-sm bg-[var(--victorian-gold)] text-[var(--victorian-burgundy)]"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
