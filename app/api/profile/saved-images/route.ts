// app/api/profile/saved-images/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

// Define an interface for the structure of saved image details
interface SavedImageDetail {
  id: string;
  url: string;
  description?: string;
  query: string; // Add the query context
  searchId: string; // Add the original search ID
  savedAt: Date; // Keep track of when the search was made
}

export async function GET(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = new ObjectId(session.userId as string);
    const db = await getDatabase();
    const searchesCollection = db.collection("searches"); // Assumes collection name is 'searches'

    // Fetch searches that have selectedImages
    const userSearches = await searchesCollection.find({
      userId: userId,
      selectedImages: { $exists: true, $not: { $size: 0 } } // Find searches with non-empty selectedImages array
    }).sort({ createdAt: -1 }).toArray();

    let savedImagesDetails: SavedImageDetail[] = [];

    // Temporary map to avoid duplicate images if saved across multiple searches
    const imageMap = new Map<string, SavedImageDetail>();

    // This part requires accessing the full Search model structure, which isn't directly in db.ts
    // We assume the structure based on previous context/code.
    // If your Search model in server/models/Search.js is different, adjust accordingly.
    // NOTE: The Search model defined in `lib/models.ts` does not contain the `results` array
    // with image details. The one in `server/models/Search.js` does.
    // This backend code assumes a structure like `server/models/Search.js`.
    // We need to fetch the results array from the database to get image details.
    for (const search of userSearches) {
      if (search.selectedImages && search.results) { // Check if results array exists
        const selectedIds = new Set(search.selectedImages);
        search.results.forEach((imageResult: any) => {
          if (selectedIds.has(imageResult.id) && !imageMap.has(imageResult.id)) {
             imageMap.set(imageResult.id, {
                id: imageResult.id,
                url: imageResult.url,
                description: imageResult.description || imageResult.alt_description, // Use description or alt_description
                query: search.query, // Include the search query context
                searchId: search._id.toString(), // Include the search ID
                savedAt: search.createdAt // Use the search creation date
             });
          }
        });
      }
    }

    savedImagesDetails = Array.from(imageMap.values());

    // Sort by the original search date, newest first
    savedImagesDetails.sort((a, b) => b.savedAt.getTime() - a.savedAt.getTime());


    return NextResponse.json({ savedImages: savedImagesDetails });

  } catch (error) {
    console.error("Failed to fetch saved images:", error);
    return NextResponse.json({ error: "Failed to fetch saved images" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";