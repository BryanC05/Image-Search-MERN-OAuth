// app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth"; //
import { getDatabase } from "@/lib/db"; //
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession(); //
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // --- Start Validation ---
  if (typeof session.userId !== 'string' || !ObjectId.isValid(session.userId)) {
      console.error("Invalid session.userId format:", session.userId);
      return NextResponse.json({ error: "Invalid session data" }, { status: 500 });
  }
  // --- End Validation ---

  try {
     const db = await getDatabase(); //
     const usersCollection = db.collection("users"); //

     // Now it's safe to create ObjectId
     const user = await usersCollection.findOne({ _id: new ObjectId(session.userId) });

     if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
     }

     // Return only necessary, non-sensitive info
     return NextResponse.json({
        userId: user._id.toString(),
        name: user.name, //
        email: user.email, //
        oauthProvider: user.oauthProvider, //
        // avatar: user.avatar // Optionally include avatar if stored
     });

  } catch (error) {
     console.error("Session fetch error:", error);
      // Check for specific ObjectId errors during DB operation if needed
     if (error instanceof Error && error.message.includes("Argument passed in must be a string")) {
        return NextResponse.json({ error: "Internal Server Error: Invalid ID format during DB query" }, { status: 500 });
    }
     return NextResponse.json({ error: "Failed to fetch session details" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";