import { NextResponse } from "next/server"

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = searchParams.get("limit")
    const perPage = limitParam ? Math.max(1, Math.min(30, parseInt(limitParam))) : 5

    if (!UNSPLASH_ACCESS_KEY) {
      return NextResponse.json({ error: "Unsplash API key not configured" }, { status: 500 })
    }

    // Use Unsplash Topics as a proxy for trending/popular searches
    const response = await fetch(
      `https://api.unsplash.com/topics?per_page=${perPage}&order_by=featured`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
        cache: "no-store",
      },
    )

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`)
    }

    const topics = await response.json()
    const topSearches = (Array.isArray(topics) ? topics : []).map((t: any) => ({
      id: t.id,
      query: t.title,
      slug: t.slug,
      total_photos: t.total_photos,
    }))

    return NextResponse.json({ topSearches })
  } catch (error) {
    console.error("Top searches error:", error)
    return NextResponse.json({ error: "Failed to fetch top searches" }, { status: 500 })
  }
}

export const dynamic = "force-dynamic"

