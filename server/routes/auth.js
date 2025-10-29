import express from "express"
import passport from "passport"

const router = express.Router()

// Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }))
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  res.redirect(process.env.CLIENT_URL || "http://localhost:3000")
})

// Facebook OAuth
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }))
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), (req, res) => {
  res.redirect(process.env.CLIENT_URL || "http://localhost:3000")
})

// GitHub OAuth
router.get("/github", passport.authenticate("github", { scope: ["user:email"] }))
router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), (req, res) => {
  res.redirect(process.env.CLIENT_URL || "http://localhost:3000")
})

export default router
