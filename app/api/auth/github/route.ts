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
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/github`,
      }),
    })

    const tokenData = await tokenResponse.json()

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()

    // Get email if not in user data
    let email = userData.email
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
      const emails = await emailResponse.json()
      email = emails.find((e: any) => e.primary)?.email || emails[0]?.email
    }

    // Find or create user and set session cookie in this response context
    const user = await findOrCreateUser(
      email,
      userData.name || userData.login,
      userData.id.toString(),
      "github",
    )
    await createSession(user._id!.toString())

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/dashboard`)
  } catch (error) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login?error=oauth_failed`)
  }
}
