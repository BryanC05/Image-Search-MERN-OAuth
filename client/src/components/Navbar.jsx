"use client"

import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import "./Navbar.css"

function Navbar({ user, setUser }) {
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:5000/api/auth/logout", {
        withCredentials: true,
      })
      setUser(null)
      navigate("/login")
    } catch (error) {
      console.error("Logout failed:", error)
    }
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo">
          <h1>ImageSearch</h1>
        </div>
        {user && (
          <div className="navbar-user">
            <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="user-avatar" />
            <span className="user-name">{user.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
