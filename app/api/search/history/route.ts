import { type NextRequest, NextResponse } from "next/server"
import { getSession } from "@/lib/auth"
import { getUserSearches, getTopSearches } from "@/lib/models"
import { ObjectId } from "mongodb"

export async function GET(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = new ObjectId(session.userId as string)
    const searches = await getUserSearches(userId)
    const topSearches = await getTopSearches(5)

    return NextResponse.json({ searches, topSearches })
  } catch (error) {
    console.error("History error:", error)
    return NextResponse.json({ error: "Failed to fetch history" }, { status: 500 })
  }
}
