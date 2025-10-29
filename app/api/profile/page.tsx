// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; //
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; //
import { Spinner } from "@/components/ui/spinner"; //
import { getSession } from "@/lib/auth"; // We need a client-side way to get session or pass it

// Define interfaces for the data structures
interface UserSession {
  userId: string;
  email?: string;
  name?: string;
  oauthProvider?: "google" | "facebook" | "github"; // Based on lib/models.ts
  // Add avatar if available in session
}

interface SavedImage {
  id: string;
  url: string;
  description?: string;
  query: string;
  savedAt: string; // Date comes as string from JSON
}

interface HistoryItem {
   _id: string;
   query: string;
   imageCount: number;
   createdAt: string;
}

// Helper function to capitalize provider names
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserSession | null>(null);
  const [savedImages, setSavedImages] = useState<SavedImage[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch session data (client-side - needs an API route or pass data)
        // Creating a simple API route for session is recommended
        const sessionRes = await fetch("/api/auth/session"); // Example API route
        if (sessionRes.ok) {
           const sessionData = await sessionRes.json();
           setUser(sessionData); // Assuming API returns { userId, email, name, oauthProvider }
        } else {
            // Handle unauthorized - redirect to login
             router.push("/login");
             return;
        }


        // Fetch saved images
        const savedImagesRes = await fetch("/api/profile/saved-images"); //
        if (savedImagesRes.ok) {
          const savedImagesData = await savedImagesRes.json();
          setSavedImages(savedImagesData.savedImages || []); //
        }

        // Fetch history
        const historyRes = await fetch("/api/history"); //
        if (historyRes.ok) {
          const historyData = await historyRes.json();
          setHistory(historyData.searches || []); //
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
         // Redirect to login on error, maybe specific error handling needed
         router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" }); //
    } catch (e) { /* no-op */ }
    router.push("/login");
  };

  const handleHistoryClick = (item: HistoryItem) => {
     router.push(`/dashboard?q=${encodeURIComponent(item.query)}`);
  }

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Spinner className="w-12 h-12 text-purple-500" /> 
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
       {/* Header */}
       <header className="bg-slate-800/50 border-b border-purple-500/20 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
             <h1 className="text-2xl font-bold text-white">My Profile</h1>
             <div className="flex gap-2">
                 <Button
                    variant="outline"
                    onClick={() => router.push('/dashboard')}
                    className="text-white border-purple-500/50 hover:bg-purple-500/10"
                 >
                    Back to Search
                 </Button>
                <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-white border-purple-500/50 hover:bg-purple-500/10 bg-transparent"
                >
                    Logout
                </Button>
             </div>
          </div>
       </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Account Info */}
        <Card className="bg-slate-800 border-purple-500/20"> 
          <CardHeader> 
            <CardTitle className="text-white flex items-center gap-4"> 
              <Avatar> 
                {/* Add AvatarImage if you store user avatar URL in session */}
                 <AvatarImage src="/placeholder-user.jpg" alt={user.name || 'User'} /> 
                <AvatarFallback>{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</AvatarFallback> 
              </Avatar>
              {user.name || "User"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-slate-300 space-y-2"> 
            {user.email && <p>Email: {user.email}</p>}
            {user.oauthProvider && <p>Signed in with: {capitalize(user.oauthProvider)}</p>}
          </CardContent>
        </Card>

        {/* Saved Images */}
        <Card className="bg-slate-800 border-purple-500/20"> 
          <CardHeader> 
            <CardTitle className="text-white">Saved Images ({savedImages.length})</CardTitle> 
          </CardHeader>
          <CardContent> 
            {savedImages.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedImages.map((image) => (
                  <div key={image.id} className="group relative overflow-hidden rounded-md aspect-square">
                    <img
                      src={image.url}
                      alt={image.description || `Saved image from query: ${image.query}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      loading="lazy"
                    />
                     <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                         <p className="text-xs text-white truncate" title={image.description || 'No description'}>{image.description || 'No description'}</p>
                         <p className="text-xs text-slate-300 truncate" title={`From search: ${image.query}`}>Search: {image.query}</p>
                     </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-400 text-center py-4">You haven't saved any images yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Search History */}
        <Card className="bg-slate-800 border-purple-500/20"> 
          <CardHeader> 
            <CardTitle className="text-white">Search History</CardTitle> 
          </CardHeader>
          <CardContent> 
            {history.length > 0 ? (
              <ul className="space-y-2">
                {history.map((item) => (
                  <li key={item._id} className="flex justify-between items-center p-2 rounded hover:bg-slate-700/50 cursor-pointer" onClick={() => handleHistoryClick(item)}>
                    <span className="text-slate-300 capitalize">{item.query}</span>
                    <span className="text-xs text-slate-500">
                      {item.imageCount} images • {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-slate-400 text-center py-4">No search history yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

// You might need an API route like this to fetch session details client-side
// app/api/auth/session/route.ts
/*
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { getDatabase } from "@/lib/db";
import { ObjectId } from "mongodb";

export async function GET() {
  const session = await getSession(); //
  if (!session?.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
     const db = await getDatabase();
     const usersCollection = db.collection("users"); //
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
     return NextResponse.json({ error: "Failed to fetch session details" }, { status: 500 });
  }
}

export const dynamic = "force-dynamic";
*/