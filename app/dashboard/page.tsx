"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import SearchHistory from "@/components/search-history"
import TopSearches from "@/components/top-searches"
import ImageGrid from "@/components/image-grid"
import { useRouter, useSearchParams } from "next/navigation"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState("")
  const [images, setImages] = useState<any[]>([])
  const [selectedImages, setSelectedImages] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)
  const [resultCount, setResultCount] = useState<number | null>(null)
  const [showHistory, setShowHistory] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setLoading(true)
    setSelectedImages(new Set())

    try {
      const response = await fetch(`/api/search`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ term: searchQuery }),
      })
      const data = await response.json()
      setImages(data.results || [])
      setResultCount(typeof data.count === "number" ? data.count : (data.results?.length || 0))
    } catch (error) {
      console.error("Search failed:", error)
    } finally {
      setLoading(false)
    }
  }

  // Run a search if a query param (?q=...) is present
  useEffect(() => {
    const q = searchParams.get("q") || ""
    const selectedParam = searchParams.get("selected") || ""
    const selectedIds = selectedParam ? new Set(selectedParam.split(",")) : new Set<string>()
    if (q && q !== searchQuery) {
      setSearchQuery(q)
      // Trigger search without needing form submit
      ;(async () => {
        setLoading(true)
        setSelectedImages(new Set())
        try {
          const response = await fetch(`/api/search`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ term: q }),
          })
          const data = await response.json()
          setImages(data.results || [])
          setResultCount(typeof data.count === "number" ? data.count : (data.results?.length || 0))
          if (selectedIds.size > 0) {
            // Only keep selections that exist in current results
            const resultIds = new Set((data.results || []).map((r: any) => r.id))
            const filtered = Array.from(selectedIds).filter((id) => resultIds.has(id))
            setSelectedImages(new Set(filtered))
          }
          setShowHistory(false)
        } catch (error) {
          console.error("Search failed:", error)
        } finally {
          setLoading(false)
        }
      })()
    } else if (!q) {
      // When landing on dashboard without a query, ensure UI is reset
      if (searchQuery || images.length > 0 || selectedImages.size > 0 || resultCount !== null) {
        setSearchQuery("")
        setImages([])
        setSelectedImages(new Set())
        setResultCount(null)
        setShowHistory(false)
      }
    }
  }, [searchParams])

  const handleImageToggle = (imageId: string) => {
    const newSelected = new Set(selectedImages)
    if (newSelected.has(imageId)) {
      newSelected.delete(imageId)
    } else {
      newSelected.add(imageId)
    }
    setSelectedImages(newSelected)
  }

  const handleSaveSearch = async () => {
    if (!searchQuery.trim() || selectedImages.size === 0) return

    try {
      await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: searchQuery,
          imageCount: images.length,
          selectedImages: Array.from(selectedImages),
        }),
      })

      setSelectedImages(new Set())
      setShowHistory(true)
    } catch (error) {
      console.error("Failed to save search:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch (e) {
      // no-op
    }
    router.push("/login")
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-slate-800/50 border-b border-purple-500/20 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Image Search</h1>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                if (showHistory) {
                  setSearchQuery("")
                  setImages([])
                  setSelectedImages(new Set())
                  setResultCount(null)
                }
                setShowHistory(!showHistory)
              }}
              className="text-white border-purple-500/50 hover:bg-purple-500/10"
            >
              {showHistory ? "Back to Search" : "View History"}
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

      <div className="container mx-auto px-4 py-8">
        {/* Top Searches banner */}
        <div className="mb-8">
          <TopSearches />
        </div>
        {showHistory ? (
          <div className="space-y-8">
            <SearchHistory />
          </div>
        ) : (
          <div className="space-y-8">
            {/* Search Bar */}
            <Card className="p-6 bg-slate-800 border-purple-500/20">
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Search for images..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-slate-700 border-purple-500/30 text-white placeholder:text-slate-400"
                />
                <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white">
                  {loading ? <Spinner className="w-4 h-4" /> : "Search"}
                </Button>
              </form>
            </Card>

            {/* Search summary & multi-select counter */}
            {images.length > 0 && (
              <div className="flex items-center justify-between">
                <p className="text-slate-300">
                  You searched for <span className="text-white font-semibold">{searchQuery}</span>
                  {typeof resultCount === "number" && (
                    <> — {resultCount} results</>
                  )}
                </p>
                <p className="text-slate-300">Selected: {selectedImages.size} images</p>
              </div>
            )}

            {/* Image Grid */}
            {images.length > 0 && (
              <>
                <ImageGrid images={images} selectedImages={selectedImages} onImageToggle={handleImageToggle} />

                {selectedImages.size > 0 && (
                  <div className="flex justify-center">
                    <Button onClick={handleSaveSearch} className="bg-green-600 hover:bg-green-700 text-white px-8">
                      Save {selectedImages.size} Selected Image{selectedImages.size !== 1 ? "s" : ""}
                    </Button>
                  </div>
                )}
              </>
            )}

            {/* Loading State */}
            {loading && (
              <div className="flex justify-center py-12">
                <Spinner className="w-8 h-8 text-purple-500" />
              </div>
            )}

            {/* Empty State */}
            {!loading && images.length === 0 && searchQuery && (
              <div className="text-center py-12">
                <p className="text-slate-400">No images found. Try a different search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
