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
        <Spinner className="w-6 h-6 text-purple-500" />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4">Popular Searches</h2>
      {searches.length === 0 ? (
        <Card className="p-8 text-center bg-slate-800 border-blue-400">
          <p className="text-slate-400">No popular searches yet</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
          {searches.map((search) => (
            <Card
              key={search.id}
              className="p-4 bg-slate-800 border-blue-400 hover:border-b-blue-400 transition-all text-center cursor-pointer group"
              onClick={() => router.push(`/dashboard?q=${encodeURIComponent(search.query)}`)}
            >
              <p className="font-semibold text-white mb-2 capitalize group-hover:text-blue-400 transition-colors">
                {search.query}
              </p>
              {typeof search.total_photos === "number" && (
                <p className="text-xs text-slate-500">{search.total_photos} photos</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
