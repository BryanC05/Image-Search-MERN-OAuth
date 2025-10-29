import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateUser } from "@/lib/models"
import { createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const state = searchParams.get("state")

  if (!code) {
    return NextResponse.json({ error: "No authorization code" }, { status: 400 })
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || "",
        client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
        redirect_uri: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/google`,
        grant_type: "authorization_code",
      }),
    })

    const tokenData = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()

    // Find or create user and set session cookie in this response context
    const user = await findOrCreateUser(
      userData.email,
      userData.name,
      userData.id,
      "google",
    )
    await createSession(user._id!.toString())

    // Redirect to dashboard
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard`)
  } catch (error) {
    console.error("Google OAuth error:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=oauth_failed`)
  }
}
