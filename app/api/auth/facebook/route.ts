import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateUser } from "@/lib/models"
import { createSession } from "@/lib/auth"

export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const clientId = process.env.FACEBOOK_APP_ID || ""
  const clientSecret = process.env.FACEBOOK_APP_SECRET || ""
  const redirectUri = `${baseUrl}/api/auth/facebook`

  if (!code) {
    if (!clientId) {
      return NextResponse.json({ error: "Facebook OAuth is not configured" }, { status: 500 })
    }

    const facebookAuthUrl = new URL("https://www.facebook.com/v18.0/dialog/oauth")
    facebookAuthUrl.searchParams.set("client_id", clientId)
    facebookAuthUrl.searchParams.set("redirect_uri", redirectUri)
    facebookAuthUrl.searchParams.set("response_type", "code")
    facebookAuthUrl.searchParams.set("scope", "email,public_profile")

    return NextResponse.redirect(facebookAuthUrl)
  }

  try {
    const params = new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code,
    })

    const tokenResponse = await fetch(`https://graph.facebook.com/v18.0/oauth/access_token?${params}`)
    const tokenData = await tokenResponse.json()
    if (!tokenResponse.ok || !tokenData.access_token) {
      throw new Error(`Facebook token exchange failed: ${JSON.stringify(tokenData)}`)
    }

    // Get user info
    const userResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email&access_token=${tokenData.access_token}`,
    )

    const userData = await userResponse.json()
    if (!userResponse.ok || !userData.id || !userData.name) {
      throw new Error(`Facebook user lookup failed: ${JSON.stringify(userData)}`)
    }
    const email = userData.email || `${userData.id}@facebook.local`

    // Find or create user and set session cookie in this response context
    const user = await findOrCreateUser(
      email,
      userData.name,
      userData.id,
      "facebook",
    )
    await createSession(user._id!.toString())

    return NextResponse.redirect(`${baseUrl}/dashboard`)
  } catch (error) {
    console.error("Facebook OAuth error:", error)
    return NextResponse.redirect(`${baseUrl}/login?error=oauth_failed`)
  }
}
