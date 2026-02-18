import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateUser } from "@/lib/models"
import { createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const clientId = process.env.GITHUB_CLIENT_ID || ""
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || ""
  const redirectUri = `${baseUrl}/api/auth/github`

  if (!code) {
    if (!clientId) {
      return NextResponse.json({ error: "GitHub OAuth is not configured" }, { status: 500 })
    }

    const githubAuthUrl = new URL("https://github.com/login/oauth/authorize")
    githubAuthUrl.searchParams.set("client_id", clientId)
    githubAuthUrl.searchParams.set("redirect_uri", redirectUri)
    githubAuthUrl.searchParams.set("scope", "read:user user:email")

    return NextResponse.redirect(githubAuthUrl)
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    })

    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(`GitHub token exchange failed: ${JSON.stringify(tokenData)}`)
    }

    // Get user info
    const userResponse = await fetch("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const userData = await userResponse.json()
    if (!userResponse.ok || !userData.id) {
      throw new Error(`GitHub user lookup failed: ${JSON.stringify(userData)}`)
    }

    // Get email if not in user data
    let email = userData.email
    if (!email) {
      const emailResponse = await fetch("https://api.github.com/user/emails", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      })
      const emails = await emailResponse.json()
      email = emails.find((e: any) => e.primary)?.email || emails[0]?.email
    }
    email = email || `${userData.id}@github.local`

    // Find or create user and set session cookie in this response context
    const user = await findOrCreateUser(
      email,
      userData.name || userData.login,
      userData.id.toString(),
      "github",
    )
    await createSession(user._id!.toString())

    return NextResponse.redirect(`${baseUrl}/dashboard`)
  } catch (error) {
    console.error("GitHub OAuth error:", error)
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`)
  }
}
