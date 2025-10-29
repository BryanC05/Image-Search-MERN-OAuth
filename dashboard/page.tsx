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
import { SaveIcon } from "lucide-react"; // Import an icon (optional)

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
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
    const q = searchParams.get("q"); //
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
    if (!searchQuery.trim() || selectedImages.size === 0) return; //

    try {
      // Logic assumes POST saves the search context including selected images
      await fetch("/api/search", { //
        method: "POST", //
        headers: { "Content-Type": "application/json" }, //
        body: JSON.stringify({ //
          term: searchQuery, //
          // Assuming backend handles updating selected images based on this POST
           selectedImages: Array.from(selectedImages), // Include selected images
        }),
      });
      setSelectedImages(new Set()); // Clear selection after saving
      setShowHistory(true); // Navigate to history view
      alert("Selection saved!"); // Provide user feedback
    } catch (error) {
      console.error("Failed to save selection:", error); //
      alert("Failed to save selection.");
    }
  };


  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" }); //
    } catch (e) {
      // no-op
    }
    router.push("/login"); //
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pb-20"> {/* Add padding-bottom */}
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-purple-500/20 sticky top-0 z-50"> {/* */}
        <div className="container mx-auto px-4 py-4 flex items-center justify-between"> {/* */}
          <h1 className="text-2xl font-bold text-white">Image Search</h1> {/* */}
          <div className="flex gap-2"> {/* */}
            <Button
              variant="outline"
              onClick={() => {
                setShowHistory(!showHistory);
                if (!showHistory) {
                  router.push("/dashboard", { scroll: false });
                }
              }}
              className="text-white border-purple-500/50 hover:bg-purple-500/10"
            > {/* */}
              {showHistory ? "Back to Search" : "View History"} {/* */}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="text-white border-purple-500/50 hover:bg-purple-500/10 bg-transparent"
            > {/* */}
              Logout {/* */}
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8"> {/* */}
        {/* Top Searches banner */}
        {!showHistory && (
          <div className="mb-8"> {/* */}
            <TopSearches /> {/* */}
          </div>
        )}

        {showHistory ? (
          <div className="space-y-8"> {/* */}
            <SearchHistory /> {/* */}
          </div>
        ) : (
          <div className="space-y-8"> {/* */}
            {/* Search Bar */}
            <Card className="p-6 bg-slate-800 border-purple-500/20"> {/* */}
              <form onSubmit={handleFormSubmit} className="flex gap-2"> {/* */}
                <Input
                  type="text"
                  placeholder="Search for images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-slate-700 border-purple-500/30 text-white placeholder:text-slate-400"
                /> {/* */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-purple-600 hover:bg-purple-700 text-white"
                > {/* */}
                  {loading ? <Spinner className="w-4 h-4" /> : "Search"} {/* */}
                </Button>
              </form>
            </Card>

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12"> {/* */}
                <Spinner className="w-8 h-8 text-purple-500" /> {/* */}
              </div>
            )}

            {/* Results Section */}
            {!loading && images.length > 0 && (
              <>
                {/* Search summary & multi-select counter */}
                <div className="flex items-center justify-between"> {/* */}
                  <p className="text-slate-300"> {/* */}
                    Results for{" "} {/* */}
                    <span className="text-white font-semibold"> {/* */}
                      {searchQuery} {/* */}
                    </span>
                    {typeof resultCount === "number" && (
                      <> — ~{resultCount} total results</>
                    )} {/* */}
                  </p>
                  <p className="text-slate-300"> {/* */}
                    Selected: {selectedImages.size} images {/* */}
                  </p>
                </div>

                {/* Image Grid */}
                <ImageGrid
                  images={images}
                  selectedImages={selectedImages}
                  onImageToggle={handleImageToggle}
                /> {/* */}

                {/* See More Button */}
                {!loadingMore && currentPage < totalPages && (
                  <div className="flex justify-center mt-6"> {/* */}
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      className="text-purple-400 border-purple-500/50 hover:bg-purple-500/10 bg-transparent px-8"
                    > {/* */}
                      See More {/* */}
                    </Button>
                  </div>
                )}

                {/* Loading More Spinner */}
                {loadingMore && (
                  <div className="flex justify-center py-6"> {/* */}
                    <Spinner className="w-6 h-6 text-purple-500" /> {/* */}
                  </div>
                )}

                {/* Removed the original Save Selection button location */}
                {/*
                    {selectedImages.size > 0 && (
                      <div className="flex justify-center mt-6">
                        <Button onClick={handleSaveSearch} className="bg-green-600 hover:bg-green-700 text-white px-8">
                          Save {selectedImages.size} Selected Image{selectedImages.size !== 1 ? "s" : ""}
                        </Button>
                      </div>
                    )}
                 */}
              </>
            )}

            {/* Empty State */}
            {!loading && images.length === 0 && searchQuery && (
              <div className="text-center py-12"> {/* */}
                <p className="text-slate-400"> {/* */}
                  No images found for "{searchQuery}". Try a different search. {/* */}
                </p>
              </div>
            )}

            {/* Initial State (before any search) */}
            {!loading && images.length === 0 && !searchQuery && !showHistory && (
              <div className="text-center py-12"> {/* */}
                <p className="text-slate-400"> {/* */}
                  Enter a search term above to find images. {/* */}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

       {/* Floating Save Button */}
       {selectedImages.size > 0 && !showHistory && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            onClick={handleSaveSearch}
            className="bg-green-600 hover:bg-green-700 text-white rounded-full shadow-lg p-4 h-auto" // Style as a Floating Action Button (FAB)
            aria-label={`Save ${selectedImages.size} image${selectedImages.size !== 1 ? 's' : ''}`}
          >
            <SaveIcon className="w-6 h-6 mr-2" />
            <span>Save ({selectedImages.size})</span>
          </Button>
        </div>
      )}
    </main>
  );
}