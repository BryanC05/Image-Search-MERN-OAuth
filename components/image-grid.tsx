"use client"

import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useMemo } from "react"

interface ImageGridProps {
  images: any[]
  selectedImages: Set<string>
  onImageToggle: (imageId: string) => void
}

export default function ImageGrid({ images, selectedImages, onImageToggle }: ImageGridProps) {
  const uniqueImages = useMemo(() => {
    const seen = new Set<string>()
    return images.filter((img) => {
      if (!img?.id) return false
      if (seen.has(img.id)) return false
      seen.add(img.id)
      return true
    })
  }, [images])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {uniqueImages.map((image) => (
        <Card
          key={image.id}
          className="overflow-hidden bg-secondary border-accent-10 hover:border-accent-40 transition-all cursor-pointer group"
          onClick={() => onImageToggle(image.id)}
        >
          <div className="relative">
            <img
              src={image.urls?.regular || "/placeholder.svg"}
              alt={image.alt_description || "Search result"}
              className="w-full h-48 object-cover group-hover:opacity-75 transition-opacity"
            />
            <div className="absolute top-2 right-2 bg-primary-80 rounded-lg p-2">
              <Checkbox
                checked={selectedImages.has(image.id)}
                onChange={() => onImageToggle(image.id)}
                className="w-5 h-5"
              />
            </div>
          </div>
          <div className="p-3">
            <p className="text-sm text-accent-80 line-clamp-2">{image.alt_description || "Untitled"}</p>
            <p className="text-xs text-accent-60 mt-1">by {image.user?.name || "Unknown"}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}
