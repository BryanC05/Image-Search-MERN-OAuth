"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"

interface TopSearch {
  id: string
  query: string
  slug?: string
  total_photos?: number
}

interface TopSearchesProps {
  limit?: number
}

export default function TopSearches({ limit = 5 }: TopSearchesProps) {
  const [searches, setSearches] = useState<TopSearch[]>([])
  const [loading, setLoading] = useState(true)
  const [hoveredId, setHoveredId] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchTopSearches = async () => {
      try {
        const response = await fetch(`/api/search/top?limit=${encodeURIComponent(String(limit))}`)
        const data = await response.json()
        setSearches(data.topSearches || [])
      } catch (error) {
        console.error("Failed to fetch top searches:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTopSearches()
  }, [limit])

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-12 h-12 rounded-full border-4 border-[var(--victorian-gold)] border-t-[var(--victorian-burgundy)] animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-8 bg-gradient-to-b from-[var(--victorian-cream)] via-[var(--victorian-antique-white)] to-[var(--victorian-cream)] min-h-screen">
      {/* Victorian Page Header */}
      <div className="text-center mb-8">
        <h2 className="victorian-heading text-4xl text-[var(--victorian-burgundy)] mb-4">
          Popular Searches
        </h2>
        {/* Ornate Divider with Fleuron */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--victorian-gold)] to-transparent" />
          <span className="text-[var(--victorian-gold)] text-xl">❧</span>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[var(--victorian-gold)] to-transparent" />
        </div>
      </div>

      {searches.length === 0 ? (
        <Card className="p-12 text-center border-[3px] border-[var(--victorian-gold)] bg-[var(--victorian-cream)] shadow-xl mx-auto max-w-md relative"
          style={{
            borderRadius: '16px',
            boxShadow: '0 20px 60px rgba(114, 47, 55, 0.3)'
          }}
        >
          {/* Corner flourishes */}
          {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
            <div
              key={corner}
              className={`absolute w-8 h-8 border-[var(--victorian-gold)] pointer-events-none ${
                corner === 'top-left' ? 'top-0 left-0 border-t-[3px] border-l-[3px] rounded-tl-xl' :
                corner === 'top-right' ? 'top-0 right-0 border-t-[3px] border-r-[3px] rounded-tr-xl' :
                corner === 'bottom-left' ? 'bottom-0 left-0 border-b-[3px] border-l-[3px] rounded-bl-xl' :
                'bottom-0 right-0 border-b-[3px] border-r-[3px] rounded-br-xl'
              }`}
            />
          ))}
          
          <p className="text-[var(--victorian-bronze)] text-lg font-lato">
            No popular searches yet
          </p>
          <p className="text-[var(--victorian-bronze)] text-sm mt-2 font-lato italic">
            Begin your quest for vintage imagery!
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {searches.map((search) => (
            <div
              key={search.id}
              className="relative"
              onMouseEnter={() => setHoveredId(search.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              {/* Victorian Badge Card */}
              <Card
                className="p-4 border-[2px] border-[var(--victorian-gold)] cursor-pointer text-center relative overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, var(--victorian-burgundy) 0%, var(--victorian-deep-purple) 100%)',
                  borderRadius: '12px',
                  boxShadow: hoveredId === search.id 
                    ? '0 12px 40px rgba(218, 165, 32, 0.5), 0 0 20px rgba(218, 165, 32, 0.3)' 
                    : '0 8px 30px rgba(114, 47, 55, 0.4)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  transform: hoveredId === search.id ? 'translateY(-8px)' : 'translateY(0)'
                }}
                onClick={() => router.push(`/dashboard?q=${encodeURIComponent(search.query)}`)}
              >
                {/* Shimmer overlay on hover */}
                {hoveredId === search.id && (
                  <div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--victorian-gold)] to-transparent opacity-10 pointer-events-none"
                    style={{
                      animation: 'shimmer 0.7s ease-in-out infinite',
                      backgroundSize: '200% 100%'
                    }}
                  />
                )}

                {/* Decorative corner accents */}
                {['top-left', 'top-right', 'bottom-left', 'bottom-right'].map((corner) => (
                  <div
                    key={corner}
                    className={`absolute w-4 h-4 border-[var(--victorian-gold)] border-opacity-60 pointer-events-none ${
                      corner === 'top-left' ? 'top-1 left-1 border-t border-l rounded-tl' :
                      corner === 'top-right' ? 'top-1 right-1 border-t border-r rounded-tr' :
                      corner === 'bottom-left' ? 'bottom-1 left-1 border-b border-l rounded-bl' :
                      'bottom-1 right-1 border-b border-r rounded-br'
                    }`}
                  />
                ))}
                
                {/* Search query with Playfair Display */}
                <p className="font-playfair-display text-[var(--victorian-antique-white)] mb-2 text-lg font-semibold capitalize relative z-10">
                  {search.query}
                </p>
                
                {/* Photo count with gold accent */}
                {typeof search.total_photos === "number" && (
                  <p className="text-xs text-[var(--victorian-antique-white)] relative z-10 flex items-center justify-center gap-1">
                    <svg className="w-3 h-3 text-[var(--victorian-gold)]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <span>{search.total_photos} photos</span>
                  </p>
                )}
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Victorian Accent Strip */}
      <div className="flex justify-center mt-8">
        <div className="h-1 w-32 bg-gradient-to-r from-[var(--victorian-gold)] via-[var(--victorian-burgundy)] to-[var(--victorian-gold)] rounded-full" />
      </div>
    </div>
  )
}
