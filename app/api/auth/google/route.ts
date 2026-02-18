import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateUser } from "@/lib/models"
import { createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const clientId = process.env.GOOGLE_CLIENT_ID || ""
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || ""
  const redirectUri = `${baseUrl}/api/auth/google`

  if (!code) {
    if (!clientId) {
      return NextResponse.json({ error: "Google OAuth is not configured" }, { status: 500 })
    }

    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
    googleAuthUrl.searchParams.set("client_id", clientId)
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri)
    googleAuthUrl.searchParams.set("response_type", "code")
    googleAuthUrl.searchParams.set("scope", "openid email profile")
    googleAuthUrl.searchParams.set("access_type", "offline")
    googleAuthUrl.searchParams.set("prompt", "consent")

    return NextResponse.redirect(googleAuthUrl)
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(`Google token exchange failed: ${JSON.stringify(tokenData)}`)
    }

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()
    if (!userResponse.ok || !userData.id || !userData.email) {
      throw new Error(`Google user lookup failed: ${JSON.stringify(userData)}`)
    }

    // Find or create user and set session cookie in this response context
    const user = await findOrCreateUser(
      userData.email,
      userData.name,
      userData.id,
      "google",
    )
    await createSession(user._id!.toString())

    // Redirect to dashboard
    return NextResponse.redirect(`${baseUrl}/dashboard`)
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`)
  }
}
