import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateUser } from "@/lib/models"
import { createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.json({ error: "No authorization code" }, { status: 400 })
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://graph.facebook.com/v18.0/oauth/access_token", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    const params = new URLSearchParams({
      client_id: process.env.FACEBOOK_APP_ID || "",
      client_secret: process.env.FACEBOOK_APP_SECRET || "",
      redirect_uri: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/facebook`,
      code,
    })

    const tokenData = await (await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${params}`)).json()

    // Get user info
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`,
    )

    const userData = await userResponse.json()

    // Find or create user and set session cookie in this response context
    const user = await findOrCreateUser(
      userData.email,
      userData.name,
      userData.id,
      "facebook",
    )
    await createSession(user._id!.toString())

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard`)
  } catch (error) {
    console.error("Facebook OAuth error:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=oauth_failed`)
  }
}
