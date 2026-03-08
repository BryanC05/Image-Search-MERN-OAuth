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
            : `/api/search?q=${encodeURIComponent(query)}&page=${page}`;
        const method = page === 1 ? "POST" : "GET";
        const body =
          page === 1 ? JSON.stringify({ term: query }) : undefined;

        const response = await fetch(url, {
          method: method,
          headers: page === 1 ? { "Content-Type": "application/json" } : {},
          body: body,
        });
        const data = await response.json();

        if (page === 1) {
          setImages(data.results || []);
          setResultCount(
            typeof data.count === "number"
              ? data.count
              : data.results?.length || 0,
          );
          setTotalPages(data.total_pages || 1);
          router.push(`/dashboard?q=${encodeURIComponent(query)}`, {
            scroll: false,
          });
        } else {
          const newImages = (data.results || []).filter(
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
    <main className="victorian-dashboard-bg min-h-screen pb-20">
      {/* Victorian Header */}
      <header className="bg-[var(--victorian-burgundy)] border-b-2 border-[var(--victorian-gold)] sticky top-0 z-50 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="victorian-heading text-3xl text-[var(--victorian-gold)] drop-shadow-md">
              Image Search
            </h1>
            <span className="text-[var(--victorian-antique-white)] font-lato text-sm opacity-80">
              Victorian Edition
            </span>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowHistory(!showHistory);
                if (!showHistory) {
                  router.push("/dashboard", { scroll: false });
                }
              }}
              className="font-lato text-[var(--victorian-burgundy)] border-2 border-[var(--victorian-gold)] hover:bg-[var(--victorian-gold)] hover:text-[var(--victorian-burgundy)] bg-transparent transition-all duration-300"
            >
              {showHistory ? "Back to Search" : "View History"}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="font-lato text-[var(--victorian-burgundy)] border-2 border-[var(--victorian-gold)] hover:bg-[var(--victorian-gold)] hover:text-[var(--victorian-burgundy)] bg-transparent transition-all duration-300"
            >
              Logout
            </Button>
          </div>
        </div>
        {/* Gold accent strip */}
        <div className="h-1 bg-gradient-to-r from-[var(--victorian-gold)] via-[var(--victorian-burgundy)] to-[var(--victorian-gold)]" />
      </header>

      <div className="victorian-content-container">
        {!showHistory && (
          <div className="mb-8 victorian-panel">
            <TopSearches />
          </div>
        )}

        {showHistory ? (
          <div className="space-y-8">
            <SearchHistory />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Victorian Search Bar */}
            <div className="victorian-search-wrapper">
              <form onSubmit={handleFormSubmit} className="flex gap-3">
                <Input
                  type="text"
                  placeholder="Search for vintage images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 victorian-input font-lato text-[var(--victorian-charcoal)] placeholder:text-[var(--victorian-bronze)]"
                />
                <Button
                  type="submit"
                  disabled={loading}
                  className="victorian-button-primary font-lato"
                >
                  {loading ? <Spinner className="w-4 h-4" /> : "Search"}
                </Button>
              </form>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="victorian-loading">
                <div className="victorian-spinner" />
              </div>
            )}

            {/* Results */}
            {!loading && images.length > 0 && (
              <>
                {/* Results Header with Divider */}
                <div className="victorian-divider">
                  <div className="flex items-center justify-between w-full max-w-4xl mx-auto">
                    <p className="font-lato text-[var(--victorian-charcoal)] text-lg">
                      Results for{" "}
                      <span className="victorian-heading text-[var(--victorian-burgundy)]">
                        "{searchQuery}"
                      </span>
                      {typeof resultCount === "number" && (
                        <span className="victorian-badge ml-3">
                          {resultCount} total
                        </span>
                      )}
                    </p>
                    {selectedImages.size > 0 && (
                      <div className="flex items-center gap-3">
                        <p className="font-lato text-[var(--victorian-bronze)]" aria-live="polite">
                          Selected: <span className="victorian-heading text-[var(--victorian-burgundy)]">{selectedImages.size}</span> image{selectedImages.size === 1 ? "" : "s"}
                        </p>
                        <Button
                          onClick={handleSaveSearch}
                          className="victorian-button-primary flex items-center gap-2 font-lato"
                        >
                          <SaveIcon className="w-4 h-4" />
                          Save Selection
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Grid */}
                <div className="victorian-grid-container">
                  <ImageGrid
                    images={images}
                    selectedImages={selectedImages}
                    onImageToggle={handleImageToggle}
                  />
                </div>

                {/* Load More Button */}
                {!loadingMore && currentPage < totalPages && (
                  <div className="flex justify-center mt-8">
                    <Button
                      onClick={handleLoadMore}
                      variant="outline"
                      className="victorian-button-primary px-10 font-lato"
                    >
                      See More
                    </Button>
                  </div>
                )}

                {/* Loading More Indicator */}
                {loadingMore && (
                  <div className="flex justify-center py-6">
                    <div className="victorian-spinner" style={{ width: '48px', height: '48px' }} />
                  </div>
                )}

                {/* Recent Searches Panel */}
                {recentSearches.length > 0 && (
                  <div className="victorian-panel">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="victorian-heading text-2xl text-[var(--victorian-burgundy)]">
                        Recent Searches
                      </h3>
                      <div className="h-[2px] flex-1 ml-4 bg-gradient-to-r from-[var(--victorian-gold)] to-transparent" />
                    </div>
                    <ul className="space-y-2">
                      {recentSearches.slice(0, 10).map((s: any) => (
                        <li key={s._id} className="victorian-list-item flex items-center justify-between">
                          <span className="font-lato text-[var(--victorian-charcoal)] capitalize">{s.query}</span>
                          <span className="font-lato text-[var(--victorian-bronze)] text-sm">
                            {new Date(s.createdAt).toLocaleString()}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="victorian-accent-strip" />
                  </div>
                )}

              </>
            )}

            {/* Empty States */}
            {!loading && images.length === 0 && searchQuery && (
              <div className="victorian-empty-state victorian-panel">
                <div className="victorian-empty-state-icon">🔍</div>
                <p className="victorian-empty-state-text victorian-heading">
                  No images found for "{searchQuery}"
                </p>
                <p className="victorian-empty-state-subtext font-lato">
                  Try a different search term to discover vintage treasures
                </p>
              </div>
            )}

            {!loading && images.length === 0 && !searchQuery && !showHistory && (
              <div className="victorian-empty-state victorian-panel">
                <div className="victorian-empty-state-icon">📚</div>
                <p className="victorian-empty-state-text victorian-heading">
                  Welcome to Victorian Image Search
                </p>
                <p className="victorian-empty-state-subtext font-lato">
                  Enter a search term above to discover elegant vintage imagery
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Victorian Scroll to Top Button */}
      {showScrollTop && !showHistory && (
        <div className="victorian-scroll-top" onClick={scrollToTop} role="button" aria-label="Scroll to top">
          <ArrowUp className="w-6 h-6" />
        </div>
      )}
    </main>
  );
}
