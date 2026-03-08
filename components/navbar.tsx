"use client"

import Link from "next/link"
import { useState } from "react"
import { Search, User, LogOut, Menu, X } from "lucide-react"

interface NavbarProps {
  user?: {
    name?: string
    email?: string
    image?: string
  } | null
  onLogout?: () => void
  onLogin?: () => void
}

export default function Navbar({ user, onLogout, onLogin }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      // Navigate to search results or trigger search
      window.location.href = `/dashboard?search=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <nav className="victorian-navbar">
      {/* Top ornate border */}
      <div className="victorian-navbar-top-border" />
      
      <div className="victorian-navbar-content">
        {/* Logo/Brand Section */}
        <div className="victorian-navbar-brand">
          <Link href="/" className="victorian-navbar-logo">
            <span className="victorian-heading">Image Search</span>
            <span className="victorian-navbar-subtitle">Victorian Edition</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="victorian-navbar-desktop">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="victorian-navbar-search">
            <div className="victorian-input victorian-search-input">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for images..."
                className="victorian-search-field"
              />
              <button type="submit" className="victorian-search-button">
                <Search size={18} />
              </button>
            </div>
          </form>

          {/* Navigation Links */}
          <div className="victorian-navbar-links">
            <Link href="/dashboard" className="victorian-nav-link">
              Dashboard
            </Link>
            <Link href="/dashboard?view=history" className="victorian-nav-link">
              History
            </Link>
            <Link href="/dashboard?view=top" className="victorian-nav-link">
              Top Searches
            </Link>
          </div>

          {/* User Section */}
          <div className="victorian-navbar-user">
            {user ? (
              <>
                <div className="victorian-user-info">
                  {user.image && (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="victorian-user-avatar"
                    />
                  )}
                  <div className="victorian-user-details">
                    <span className="victorian-user-name">
                      {user.name || "User"}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="victorian-button victorian-button-small"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button
                onClick={onLogin}
                className="victorian-button"
              >
                <User size={16} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="victorian-mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="victorian-navbar-mobile">
          <form onSubmit={handleSearch} className="victorian-navbar-search-mobile">
            <div className="victorian-input">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search images..."
                className="victorian-search-field"
              />
              <button type="submit" className="victorian-search-button">
                <Search size={18} />
              </button>
            </div>
          </form>
          
          <div className="victorian-mobile-links">
            <Link href="/dashboard" className="victorian-mobile-link">
              Dashboard
            </Link>
            <Link href="/dashboard?view=history" className="victorian-mobile-link">
              History
            </Link>
            <Link href="/dashboard?view=top" className="victorian-mobile-link">
              Top Searches
            </Link>
            
            {user ? (
              <>
                <div className="victorian-mobile-user">
                  {user.image && (
                    <img src={user.image} alt={user.name || "User"} className="victorian-user-avatar" />
                  )}
                  <span className="victorian-user-name">{user.name || user.email || "User"}</span>
                </div>
                <button onClick={onLogout} className="victorian-button victorian-button-mobile">
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <button onClick={onLogin} className="victorian-button victorian-button-mobile">
                <User size={16} />
                <span>Login</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Bottom ornate border */}
      <div className="victorian-navbar-bottom-border" />

      <style jsx>{`
        .victorian-navbar {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: 64px;
          background: linear-gradient(180deg, var(--victorian-burgundy) 0%, #5a252b 100%);
          border-top: 2px solid var(--victorian-gold);
          border-bottom: 2px solid var(--victorian-gold);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
          z-index: 1000;
        }

        .victorian-navbar-top-border,
        .victorian-navbar-bottom-border {
          height: 3px;
          background: linear-gradient(
            90deg,
            var(--victorian-gold) 0%,
            var(--victorian-bronze) 25%,
            var(--victorian-gold) 50%,
            var(--victorian-bronze) 75%,
            var(--victorian-gold) 100%
          );
        }

        .victorian-navbar-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
          padding: 0 24px;
          max-width: 1400px;
          margin: 0 auto;
        }

        .victorian-navbar-brand {
          flex-shrink: 0;
        }

        .victorian-navbar-logo {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: var(--victorian-cream);
          transition: all 0.3s ease;
        }

        .victorian-navbar-logo:hover {
          text-shadow: 0 0 10px var(--victorian-gold);
        }

        .victorian-navbar-subtitle {
          font-size: 10px;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: var(--victorian-gold);
          margin-top: 2px;
        }

        .victorian-navbar-desktop {
          display: flex;
          align-items: center;
          gap: 24px;
          flex: 1;
          margin-left: 40px;
        }

        .victorian-navbar-search {
          flex: 1;
          max-width: 400px;
        }

        .victorian-search-input {
          display: flex;
          align-items: center;
          background: rgba(255, 249, 240, 0.1);
          border: 1px solid var(--victorian-gold);
          border-radius: 4px;
          padding: 0;
          transition: all 0.3s ease;
        }

        .victorian-search-input:focus-within {
          background: rgba(255, 249, 240, 0.15);
          border-color: var(--victorian-gold);
          box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
        }

        .victorian-search-field {
          flex: 1;
          background: transparent;
          border: none;
          padding: 8px 12px;
          color: var(--victorian-cream);
          font-family: var(--font-lato);
          font-size: 14px;
        }

        .victorian-search-field::placeholder {
          color: rgba(255, 249, 240, 0.6);
        }

        .victorian-search-field:focus {
          outline: none;
        }

        .victorian-search-button {
          background: var(--victorian-gold);
          border: none;
          padding: 8px 12px;
          cursor: pointer;
          color: var(--victorian-burgundy);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .victorian-search-button:hover {
          background: var(--victorian-cream);
          transform: scale(1.05);
        }

        .victorian-navbar-links {
          display: flex;
          gap: 8px;
        }

        .victorian-nav-link {
          color: var(--victorian-cream);
          text-decoration: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-family: var(--font-lato);
          font-size: 14px;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .victorian-nav-link::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(212, 175, 55, 0.2),
            transparent
          );
          transition: left 0.5s ease;
        }

        .victorian-nav-link:hover {
          color: var(--victorian-gold);
          background: rgba(212, 175, 55, 0.1);
        }

        .victorian-nav-link:hover::before {
          left: 100%;
        }

        .victorian-navbar-user {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .victorian-user-info {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px;
          background: rgba(255, 249, 240, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 4px;
        }

        .victorian-user-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 2px solid var(--victorian-gold);
        }

        .victorian-user-details {
          display: flex;
          flex-direction: column;
        }

        .victorian-user-name {
          color: var(--victorian-cream);
          font-family: var(--font-lato);
          font-size: 13px;
          font-weight: 500;
          white-space: nowrap;
        }

        .victorian-mobile-toggle {
          display: none;
          background: transparent;
          border: 1px solid var(--victorian-gold);
          color: var(--victorian-gold);
          padding: 8px;
          cursor: pointer;
          border-radius: 4px;
          transition: all 0.3s ease;
        }

        .victorian-mobile-toggle:hover {
          background: var(--victorian-gold);
          color: var(--victorian-burgundy);
        }

        .victorian-navbar-mobile {
          display: none;
          position: absolute;
          top: 64px;
          left: 0;
          right: 0;
          background: linear-gradient(180deg, var(--victorian-burgundy) 0%, #5a252b 100%);
          border-bottom: 2px solid var(--victorian-gold);
          padding: 16px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
        }

        .victorian-navbar-search-mobile {
          margin-bottom: 16px;
        }

        .victorian-mobile-links {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .victorian-mobile-link {
          color: var(--victorian-cream);
          text-decoration: none;
          padding: 12px 16px;
          border-radius: 4px;
          font-family: var(--font-lato);
          font-size: 15px;
          font-weight: 500;
          transition: all 0.3s ease;
        }

        .victorian-mobile-link:hover {
          color: var(--victorian-gold);
          background: rgba(212, 175, 55, 0.1);
        }

        .victorian-mobile-user {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          margin-bottom: 8px;
          background: rgba(255, 249, 240, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 4px;
        }

        .victorian-button-mobile {
          width: 100%;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .victorian-navbar-desktop {
            display: none;
          }

          .victorian-mobile-toggle {
            display: flex;
          }

          .victorian-navbar-mobile {
            display: block;
          }

          .victorian-navbar-content {
            padding: 0 16px;
          }
        }
      `}</style>
    </nav>
  )
}
