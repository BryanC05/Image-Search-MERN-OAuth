import { NextResponse } from "next/server"
import { getTopSearches } from "@/lib/models"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Math.max(1, Math.min(50, parseInt(limitParam))) : 5
    const topSearches = await getTopSearches(limit)
    return NextResponse.json({ topSearches })
  } catch (error) {
    console.error("Top searches error:", error)
    return NextResponse.json({ error: "Failed to fetch top searches" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"

