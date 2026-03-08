import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import mongoose from "mongoose"
import session from "express-session"
import passport from "passport"
import path from "path"
import https from "https"
import { fileURLToPath } from "url"
import helmet from "helmet"
import rateLimit from "express-rate-limit"
import mongoSanitize from "express-mongo-sanitize"
import xss from "xss-clean"
import authRoutes from "./routes/auth.js"
import searchRoutes from "./routes/search.js"

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Configure global HTTPS/TLS settings
https.globalAgent.options.secureProtocol = 'TLS_method'
https.globalAgent.options.minVersion = 'TLSv1.2'
https.globalAgent.options.ciphers = 'HIGH:!aNULL:!MD5:!RC4:!PSK:!SRP:!DSS:!CAMELLIA'

const app = express()

// SECURITY FIX #1: HTTP Security Headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https://images.unsplash.com"],
      connectSrc: ["'self'", "https://api.unsplash.com"],
    },
  },
  crossOriginEmbedderPolicy: false,
}))

// SECURITY FIX #2: Rate Limiting to prevent brute force attacks
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { error: 'Too many authentication attempts, please try again later.' },
})
app.use('/api/auth/', authLimiter)

// SECURITY FIX #3: Proper CORS Configuration
const allowedOrigins = process.env.CLIENT_URL?.split(',') || ['http://localhost:3000']
app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true)
    if (allowedOrigins.indexOf(origin) !== -1 || origin.includes('localhost')) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// SECURITY FIX #4: Request Size Limits
app.use(express.json({ limit: '10kb' }))
app.use(express.urlencoded({ extended: true, limit: '10kb' }))

// SECURITY FIX #5: Session Configuration - No hardcoded fallback
if (!process.env.SESSION_SECRET) {
  console.error('ERROR: SESSION_SECRET environment variable is not set!')
  process.exit(1)
}
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    },
  }),
)

// SECURITY FIX #6: CSRF Protection
import csrf from 'csurf'
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  },
})

app.use((req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next()
  }
  csrfProtection(req, res, next)
})

// SECURITY FIX #7: MongoDB Sanitization
app.use(mongoSanitize({
  replaceWith: '_',
}))

// SECURITY FIX #8: XSS Protection
app.use(xss())

app.use(passport.initialize())
app.use(passport.session())

mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/image-search", {
    ssl: true,
    tls: true,
    tlsAllowInvalidCertificates: process.env.NODE_ENV !== 'production',
    tlsAllowInvalidHostnames: process.env.NODE_ENV !== 'production',
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    maxPoolSize: 50,
    maxIdleTimeMS: 30000,
    tlsInsecure: false,
    minVersion: 'TLS1_2',
    tlsCAFile: process.env.CA_CERT_PATH,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message)
    process.exit(1)
  })

app.get("/api/health", (req, res) => {
  res.json({ status: "Server is running", timestamp: new Date().toISOString() })
})

app.get("/api/auth/user", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar,
    })
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

// SECURITY FIX #9: Global Error Handler - No stack traces in production
app.use((err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    path: req.path,
    method: req.method,
  })
  
  res.status(err.status || 500).json({
    message: process.env.NODE_ENV === 'production' 
      ? 'An internal error occurred' 
      : err.message,
  })
})

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`)
})
