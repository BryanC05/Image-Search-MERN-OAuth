"use client";

import type React from "react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import SearchHistory from "@/components/search-history";
import TopSearches from "@/components/top-searches";
import ImageGrid from "@/components/image-grid";
import { useRouter, useSearchParams } from "next/navigation";
import { SaveIcon, ArrowUp } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [images, setImages] = useState<any[]>([]);
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [resultCount, setResultCount] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showHistory, setShowHistory] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [recentSearches, setRecentSearches] = useState<any[]>([]);

  const handleSearch = useCallback(
    async (query: string, page = 1) => {
      if (!query.trim()) return;

      if (page === 1) {
        setLoading(true);
        setImages([]);
        setSelectedImages(new Set());
        setResultCount(null);
      } else {
        setLoadingMore(true);
      }
      setCurrentPage(page);
      setSearchQuery(query);

      try {
        const url =
          page === 1
            ? `/api/search`
            : `/api/search?q=${encodeURIComponent(query)}&page=${page}`; //
        const method = page === 1 ? "POST" : "GET"; //
        const body =
          page === 1 ? JSON.stringify({ term: query }) : undefined; //

        const response = await fetch(url, {
          method: method,
          headers: page === 1 ? { "Content-Type": "application/json" } : {},
          body: body,
        });
        const data = await response.json();

        if (page === 1) {
          setImages(data.results || []); //
          setResultCount(
            typeof data.count === "number"
              ? data.count
              : data.results?.length || 0, //
          );
          setTotalPages(data.total_pages || 1); //
          router.push(`/dashboard?q=${encodeURIComponent(query)}`, {
            scroll: false,
          });
        } else {
          const newImages = (data.results || []).filter( //
            (newImg: any) =>
              !images.some((existingImg) => existingImg.id === newImg.id),
          );
          setImages((prevImages) => [...prevImages, ...newImages]);
        }
        setShowHistory(false);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        if (page === 1) {
          setLoading(false);
        } else {
          setLoadingMore(false);
        }
      }
    },
    [router, images],
  );

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery, 1);
  };

  const handleLoadMore = () => {
    if (!loadingMore && currentPage < totalPages) {
      handleSearch(searchQuery, currentPage + 1);
    }
  };

  useEffect(() => {
    const q = searchParams.get("q");
    if (q && q !== searchQuery) {
      handleSearch(q, 1);
    } else if (!q && images.length > 0) {
      setSearchQuery("");
      setImages([]);
      setSelectedImages(new Set());
      setResultCount(null);
      setCurrentPage(1);
      setTotalPages(1);
    }
  }, [searchParams]);

  useEffect(() => {
    const onScroll = () => {
      if (typeof window !== "undefined") {
        setShowScrollTop(window.scrollY > 400);
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const res = await fetch("/api/history");
        const data = await res.json();
        setRecentSearches(Array.isArray(data.searches) ? data.searches : []);
      } catch (_) {}
    };
    fetchRecent();
  }, []);

  const handleImageToggle = (imageId: string) => {
    const newSelected = new Set(selectedImages);
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId);
    } else {
      newSelected.add(imageId);
    }
    setSelectedImages(newSelected);
  };

  const handleSaveSearch = async () => {
    if (!searchQuery.trim() || selectedImages.size === 0) return;

    try {
      await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          term: searchQuery,
           selectedImages: Array.from(selectedImages),
        }),
      });
      setSelectedImages(new Set()); 
      setShowHistory(true); 
      alert("Selection saved!"); 
    } catch (error) {
      console.error("Failed to save selection:", error);
      alert("Failed to save selection.");
    }
  };


  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (e) {}
    router.push("/login");
  };

  return (
    <main className="min-h-screen bg-primary pb-20"> 
      <header className="bg-secondary border-b border-accent-10 sticky top-0 z-50"> 
        <div className="container mx-auto px-4 py-4 flex items-center justify-between"> 
          <h1 className="text-2xl font-bold text-accent">Image Search</h1> 
          <div className="flex gap-2"> 
            <Button
              variant="outline"
              onClick={() => {
                setShowHistory(!showHistory);
                if (!showHistory) {
                  router.push("/dashboard", { scroll: false });
                }
              }}
              className="text-accent border-accent-40 hover:bg-secondary-70 bg-transparent"
            > 
              {showHistory ? "Back to Search" : "View History"} 
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-accent border-accent-40 hover:bg-secondary-70 bg-transparent"
            > 
              Logout 
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8"> 
        
        {!showHistory && (
          <div className="mb-8"> 
            <TopSearches /> 
          </div>
        )}

        {showHistory ? (
          <div className="space-y-8"> 
            <SearchHistory /> 
          </div>
        ) : (
          <div className="space-y-8"> 
            
            <Card className="p-6 bg-secondary border-accent-10"> 
              <form onSubmit={handleFormSubmit} className="flex gap-2"> 
                <Input
                  type="text"
                  placeholder="Search for images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-primary border-accent-40 text-accent placeholder:text-accent-60"
                /> 
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-accent hover:bg-accent-90 text-primary"
                > 
                  {loading ? <Spinner className="w-4 h-4" /> : "Search"} 
                </Button>
              </form>
            </Card>

            
            {loading && (
              <div className="flex justify-center py-12"> 
                <Spinner className="w-8 h-8 text-accent" /> 
              </div>
            )}

            
            {!loading && images.length > 0 && (
              <>
                
                <div className="flex items-center justify-between"> 
                  <p className="text-accent-80"> 
                    Results for{" "} 
                    <span className="text-accent font-semibold"> 
                      {searchQuery} 
                    </span>
                    {typeof resultCount === "number" && (
                      <> [{resultCount}] total results</>
                    )} 
                  </p>
                  {selectedImages.size > 0 && (
                    <p className="text-accent-80" aria-live="polite"> 
                      Selected: {selectedImages.size} image{selectedImages.size === 1 ? "" : "s"} 
                    </p>
                  )}
                </div>

                
                <ImageGrid
                  images={images}
                  selectedImages={selectedImages}
                  onImageToggle={handleImageToggle}
                /> 

                
                {!loadingMore && currentPage < totalPages && (
                  <div className="flex justify-center mt-6"> 
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      className="text-accent border-accent-40 hover:bg-secondary-70 bg-transparent px-8"
                    > 
                      See More 
                    </Button>
                  </div>
                )}

                
                {loadingMore && (
                  <div className="flex justify-center py-6"> 
                    <Spinner className="w-6 h-6 text-accent" /> 
                  </div>
                )}

                {recentSearches.length > 0 && (
                  <Card className="mt-8 p-4 bg-secondary border-accent-10">
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-accent">Recent Searches</h3>
                    </div>
                    <ul className="divide-y divide-accent-10">
                      {recentSearches.slice(0, 10).map((s: any) => (
                        <li key={s._id} className="py-2 flex items-center justify-between">
                          <span className="text-accent-80 capitalize">{s.query}</span>
                          <span className="text-accent-60 text-sm">{new Date(s.createdAt).toLocaleString()}</span>
                        </li>
                      ))}
                    </ul>
                  </Card>
                )}

              </>
            )}

            {!loading && images.length === 0 && searchQuery && (
              <div className="text-center py-12"> 
                <p className="text-accent-60"> 
                  No images found for "{searchQuery}". Try a different search. 
                </p>
              </div>
            )}

            {!loading && images.length === 0 && !searchQuery && !showHistory && (
              <div className="text-center py-12"> 
                <p className="text-accent-60"> 
                  Enter a search term above to find images. 
                </p>
              </div>
            )}
          </div>
        )}
      </div>
      {showScrollTop && !showHistory && (
        <div className="fixed bottom-6 right-6 z-40">
          <Button
            onClick={scrollToTop}
            className="bg-secondary hover:bg-secondary-70 text-accent rounded-full shadow-lg p-3 h-auto"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </Button>
        </div>
      )}
    </main>
  );
}