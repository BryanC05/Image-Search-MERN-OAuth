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
        <Spinner className="w-8 h-8 text-accent" />
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
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-accent">Search History</h2>
        {searches.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-accent border-accent-40 hover:bg-secondary-70 bg-transparent"
            onClick={clearHistory}
          >
            Clear History
          </Button>
        )}
      </div>
      {searches.length === 0 ? (
        <Card className="p-8 text-center bg-secondary border-accent-10">
          <p className="text-accent-60">No search history yet. Start searching!</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {searches.map((search) => (
            <Card
              key={search._id}
              className="p-4 bg-secondary border-accent-10 hover:border-accent-40 transition-all"
            >
              <h3 className="font-semibold text-accent mb-2 capitalize">{search.query}</h3>
              <p className="text-sm text-accent-60 mb-3">
                {search.imageCount} images • {new Date(search.createdAt).toLocaleString()}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-accent border-accent-40 hover:bg-secondary-70 bg-transparent"
                onClick={() => {
                  const selected = (search.selectedImages || []).join(",")
                  const url = selected
                    ? `/dashboard?q=${encodeURIComponent(search.query)}&selected=${encodeURIComponent(selected)}`
                    : `/dashboard?q=${encodeURIComponent(search.query)}`
                  router.push(url)
                }}
              >
                View Results
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
