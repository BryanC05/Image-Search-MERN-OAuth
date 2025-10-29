import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
// Removed unused saveSearch import
// Removed unused ObjectId import

const UNSPLASH_ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q");
    const page = searchParams.get("page") || "1"; // Get page from query params

    if (!query) {
      return NextResponse.json({ error: "Query required" }, { status: 400 });
    }

    if (!UNSPLASH_ACCESS_KEY) {
      return NextResponse.json({ error: "Unsplash API key not configured" }, { status: 500 });
    }

    // Use page parameter in the Unsplash API call
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=20&order_by=relevant`,
      {
        headers: {
          Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

// Keep the POST function as is for initial search and saving history
export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { term } = await request.json();
    const userId = new (await import("mongodb")).ObjectId(session.userId as string); // Dynamically import ObjectId
    const { saveSearch } = await import("@/lib/models"); // Dynamically import saveSearch


    if (!term) {
      return NextResponse.json({ error: "term is required" }, { status: 400 });
    }

    if (!UNSPLASH_ACCESS_KEY) {
      return NextResponse.json({ error: "Unsplash API key not configured" }, { status: 500 });
    }

    // Call Unsplash for the first page
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(term)}&page=1&per_page=20&order_by=relevant`,
      {
        headers: { Authorization: `Client-ID ${UNSPLASH_ACCESS_KEY}` },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    // Persist the search minimal record
    await saveSearch(userId, term, data.total || data.results?.length || 0, []);

    return NextResponse.json({
      term,
      count: data.total || data.results?.length || 0,
      total_pages: data.total_pages || 1, // Add total pages to the response
      results: data.results || [],
    });
  } catch (error) {
    console.error("Save search error:", error);
    return NextResponse.json({ error: "Failed to save search" }, { status: 500 });
  }
}