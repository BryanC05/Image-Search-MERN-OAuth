import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import session from "express-session"
import passport from "passport"
import path from "path"
import { fileURLToPath } from "url"
import authRoutes from "./routes/auth.js"
import searchRoutes from "./routes/search.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
  }),
)
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  }),
)

// Passport initialization
app.use(passport.initialize())
app.use(passport.session())

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/image-search")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err))

// Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running" })
})

// Auth routes (will be added in next step)
app.get("/api/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json(req.user)
  } else {
    res.status(401).json({ message: "Not authenticated" })
  }
})

app.get("/api/auth/logout", (req, res) => {
  req.logout((err) => {
    if (err) return res.status(500).json({ message: "Logout failed" })
    res.json({ message: "Logged out successfully" })
  })
})

app.use("/api/auth", authRoutes)
app.use("/api/search", searchRoutes)

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
