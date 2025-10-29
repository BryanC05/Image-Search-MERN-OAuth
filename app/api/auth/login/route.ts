import { type NextRequest, NextResponse } from "next/server"
import { findOrCreateUser } from "@/lib/models"
import { createSession } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, name, oauthId, oauthProvider } = await request.json()

    const user = await findOrCreateUser(email, name, oauthId, oauthProvider)
    await createSession(user._id!.toString())

    return NextResponse.json({ success: true, userId: user._id })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
