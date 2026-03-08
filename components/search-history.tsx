"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

interface Search {
  _id: string
  query: string
  imageCount: number
  createdAt: string
  selectedImages?: string[]
}

export default function SearchHistory() {
  const [searches, setSearches] = useState<Search[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("/api/history")
        const data = await response.json()
        setSearches(data.searches || [])
      } catch (error) {
        console.error("Failed to fetch history:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-victorian-gold/30 rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-victorian-burgundy border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  const clearHistory = async () => {
    if (!confirm("Clear your entire search history?")) return
    try {
      await fetch("/api/history", { method: "DELETE" })
      setSearches([])
    } catch (e) {
      console.error("Failed to clear history:", e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-victorian-cream via-victorian-antique-white to-victorian-cream p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="mb-8 relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-4xl victorian-heading text-victorian-burgundy">
              Search History
            </h2>
            {searches.length > 0 && (
              <Button
                onClick={clearHistory}
                className="relative overflow-hidden px-6 py-3 bg-gradient-to-r from-victorian-burgundy to-victorian-deep-purple text-victorian-antique-white font-lato border-2 border-victorian-gold hover:border-victorian-gold/80 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                style={{
                  boxShadow: '0 4px 15px rgba(114, 47, 55, 0.3)',
                }}
              >
                <span className="relative z-10">Clear History</span>
                <div className="absolute inset-0 bg-gradient-to-r from-victorian-gold/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </Button>
            )}
          </div>

          {/* Ornate Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full bg-gradient-to-r from-transparent via-victorian-gold to-transparent h-px"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-gradient-to-r from-victorian-cream via-victorian-gold to-victorian-cream px-4">
                <span className="text-victorian-gold text-xl">❧</span>
              </div>
            </div>
          </div>
        </div>

        {searches.length === 0 ? (
          /* Empty State */
          <Card className="p-12 text-center bg-victorian-cream border-3 border-victorian-gold shadow-xl relative overflow-hidden"
            style={{
              boxShadow: '0 20px 60px rgba(114, 47, 55, 0.15), inset 0 0 40px rgba(212, 175, 55, 0.05)',
            }}
          >
            {/* Corner Flourishes */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-victorian-gold rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-victorian-gold rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-victorian-gold rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-victorian-gold rounded-br-3xl"></div>

            <div className="relative z-10">
              <p className="text-2xl victorian-heading text-victorian-burgundy mb-2">
                No Search History Yet
              </p>
              <p className="text-victorian-bronze font-lato">
                Begin your quest for vintage imagery!
              </p>
            </div>
          </Card>
        ) : (
          {/* History Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searches.map((search) => (
              <Card
                key={search._id}
                onMouseEnter={() => setHoveredId(search._id)}
                onMouseLeave={() => setHoveredId(null)}
                className="p-5 bg-victorian-cream border-2 border-victorian-gold hover:border-victorian-gold/80 transition-all duration-400 relative overflow-hidden group cursor-pointer"
                style={{
                  boxShadow: hoveredId
                    ? '0 12px 40px rgba(114, 47, 55, 0.2), 0 0 30px rgba(212, 175, 55, 0.15)'
                    : '0 8px 25px rgba(114, 47, 55, 0.1), 0 0 20px rgba(212, 175, 55, 0.08)',
                  transform: hoveredId ? 'translateY(-6px)' : 'translateY(0)',
                }}
              >
                {/* Left Gold Border Accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-victorian-gold via-victorian-burgundy to-victorian-gold opacity-80"></div>

                {/* Corner Flourishes */}
                <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-victorian-gold/60 rounded-tl-xl"></div>
                <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-victorian-gold/60 rounded-tr-xl"></div>
                <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-victorian-gold/60 rounded-bl-xl"></div>
                <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-victorian-gold/60 rounded-br-xl"></div>

                {/* Shimmer Effect on Hover */}
                <div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-victorian-gold/10 to-transparent pointer-events-none transition-transform duration-700"
                  style={{
                    transform: hoveredId ? 'translateX(100%)' : 'translateX(-100%)',
                  }}
                ></div>

                <div className="relative z-10">
                  {/* Query Title */}
                  <h3 className="font-playfair-display text-xl font-semibold text-victorian-burgundy mb-3 capitalize truncate pr-2">
                    {search.query}
                  </h3>

                  {/* Metadata */}
                  <div className="mb-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-sm text-victorian-bronze font-lato">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {search.imageCount} images
                    </span>
                    <span className="text-victorian-gold">•</span>
                    <span className="text-sm text-victorian-bronze font-lato">
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(search.createdAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Victorian Button */}
                  <Button
                    onClick={() => {
                      const selected = (search.selectedImages || []).join(",")
                      const url = selected
                        ? `/dashboard?q=${encodeURIComponent(search.query)}&selected=${encodeURIComponent(selected)}`
                        : `/dashboard?q=${encodeURIComponent(search.query)}`
                      router.push(url)
                    }}
                    className="w-full relative overflow-hidden px-6 py-3 bg-gradient-to-r from-victorian-burgundy to-victorian-deep-purple text-victorian-antique-white font-lato border-2 border-victorian-gold hover:border-victorian-gold/80 transition-all duration-300 group/btn"
                    style={{
                      boxShadow: '0 4px 15px rgba(114, 47, 55, 0.3)',
                    }}
                  >
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4 transition-transform group-hover/btn:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      View Results
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-victorian-gold/20 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Bottom Accent Strip */}
        {searches.length > 0 && (
          <div className="mt-12 flex justify-center">
            <div className="h-1 w-64 bg-gradient-to-r from-victorian-gold via-victorian-burgundy to-victorian-gold rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
}
