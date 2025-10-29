import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getUserSearches, clearUserSearches } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = new ObjectId(session.userId as string)
    const searches = await getUserSearches(userId)
    return NextResponse.json({ searches })
  } catch (error) {
    console.error("History error:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"

export async function DELETE(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = new ObjectId(session.userId as string)
    await clearUserSearches(userId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Clear history error:", error)
    return NextResponse.json({ error: "Failed to clear history" }, { status: 500 })
  }
}

