"use client"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import Navbar from "./components/Navbar"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import "./App.css"

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/auth/user", {
          withCredentials: true,
        })
        setUser(response.data)
      } catch (error) {
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return <div className="loading">Loading...</div>
  }

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/dashboard" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
