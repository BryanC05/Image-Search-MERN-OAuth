"use client"

import { useMemo, useState } from "react"

interface ImageGridProps {
  images: any[]
  selectedImages: Set<string>
  onImageToggle: (imageId: string) => void
}

export default function ImageGrid({ images, selectedImages, onImageToggle }: ImageGridProps) {
  const [hoveredImageId, setHoveredImageId] = useState<string | null>(null)
  
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
    <>
      <style jsx>{`
        .victorian-image-grid {
          display: grid;
          grid-template-columns: repeat(1, 1fr);
          gap: 2rem;
          padding: 1rem;
        }
        
        @media (min-width: 768px) {
          .victorian-image-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (min-width: 1024px) {
          .victorian-image-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        
        @media (min-width: 1280px) {
          .victorian-image-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
        
        .victorian-image-card {
          position: relative;
          background: var(--victorian-cream);
          border: 3px solid var(--victorian-gold);
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(92, 67, 47, 0.3);
        }
        
        .victorian-image-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          border: 2px solid transparent;
          border-radius: 8px;
          background: linear-gradient(135deg, var(--victorian-gold) 0%, transparent 20%, transparent 80%, var(--victorian-gold) 100%);
          pointer-events: none;
          z-index: 2;
          opacity: 0.6;
        }
        
        .victorian-image-card::after {
          content: '';
          position: absolute;
          top: 4px;
          left: 4px;
          right: 4px;
          bottom: 4px;
          border: 1px solid var(--victorian-bronze);
          border-radius: 4px;
          pointer-events: none;
          z-index: 1;
          opacity: 0.4;
        }
        
        .victorian-image-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 12px 30px rgba(114, 47, 55, 0.4), 0 0 20px rgba(212, 175, 55, 0.3);
          border-color: var(--victorian-gold);
        }
        
        .victorian-image-card:hover::before {
          opacity: 1;
          background: linear-gradient(135deg, var(--victorian-gold) 0%, transparent 15%, transparent 85%, var(--victorian-gold) 100%);
          animation: shimmer 2s infinite;
        }
        
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .corner-accent {
          position: absolute;
          width: 20px;
          height: 20px;
          z-index: 3;
          pointer-events: none;
        }
        
        .corner-accent::before,
        .corner-accent::after {
          content: '';
          position: absolute;
          background: var(--victorian-gold);
        }
        
        .corner-accent.top-left {
          top: 0;
          left: 0;
        }
        
        .corner-accent.top-left::before {
          width: 12px;
          height: 2px;
          top: 0;
          left: 0;
        }
        
        .corner-accent.top-left::after {
          width: 2px;
          height: 12px;
          top: 0;
          left: 0;
        }
        
        .corner-accent.top-right {
          top: 0;
          right: 0;
        }
        
        .corner-accent.top-right::before {
          width: 12px;
          height: 2px;
          top: 0;
          right: 0;
        }
        
        .corner-accent.top-right::after {
          width: 2px;
          height: 12px;
          top: 0;
          right: 0;
        }
        
        .corner-accent.bottom-left {
          bottom: 0;
          left: 0;
        }
        
        .corner-accent.bottom-left::before {
          width: 12px;
          height: 2px;
          bottom: 0;
          left: 0;
        }
        
        .corner-accent.bottom-left::after {
          width: 2px;
          height: 12px;
          bottom: 0;
          left: 0;
        }
        
        .corner-accent.bottom-right {
          bottom: 0;
          right: 0;
        }
        
        .corner-accent.bottom-right::before {
          width: 12px;
          height: 2px;
          bottom: 0;
          right: 0;
        }
        
        .corner-accent.bottom-right::after {
          width: 2px;
          height: 12px;
          bottom: 0;
          right: 0;
        }
        
        .victorian-image-wrapper {
          position: relative;
          height: 280px;
          overflow: hidden;
        }
        
        .victorian-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          filter: sepia(0.6) contrast(1.1) brightness(0.95);
          transition: filter 0.5s ease, transform 0.5s ease;
        }
        
        .victorian-image-card:hover .victorian-image {
          filter: sepia(0) contrast(1) brightness(1);
          transform: scale(1.05);
        }
        
        .victorian-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, 
            transparent 0%, 
            transparent 40%, 
            rgba(114, 47, 55, 0.85) 100%
          );
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          padding: 1.25rem;
          opacity: 0;
          transition: opacity 0.4s ease;
          z-index: 4;
        }
        
        .victorian-image-card:hover .victorian-overlay {
          opacity: 1;
        }
        
        .victorian-checkbox-wrapper {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 5;
        }
        
        .victorian-checkbox {
          width: 28px;
          height: 28px;
          border: 2px solid var(--victorian-gold);
          background: var(--victorian-cream);
          border-radius: 4px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        
        .victorian-checkbox:hover {
          border-color: var(--victorian-burgundy);
          background: var(--victorian-gold);
          transform: scale(1.1);
        }
        
        .victorian-checkbox.checked {
          background: linear-gradient(135deg, var(--victorian-burgundy), var(--victorian-deep-purple));
          border-color: var(--victorian-gold);
        }
        
        .victorian-checkbox.checked::after {
          content: '✓';
          color: var(--victorian-gold);
          font-size: 18px;
          font-weight: bold;
          font-family: 'Playfair Display', serif;
        }
        
        .victorian-image-info {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .victorian-image-title {
          font-family: 'Playfair Display', serif;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--victorian-gold);
          line-clamp: 2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .victorian-image-author {
          font-family: 'Lato', sans-serif;
          font-size: 0.85rem;
          color: var(--victorian-antique-white);
          font-style: italic;
        }
        
        .victorian-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .victorian-action-btn {
          flex: 1;
          padding: 0.5rem 1rem;
          border: 1px solid var(--victorian-gold);
          background: transparent;
          color: var(--victorian-gold);
          font-family: 'Lato', sans-serif;
          font-size: 0.85rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }
        
        .victorian-action-btn:hover {
          background: var(--victorian-gold);
          color: var(--victorian-burgundy);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.4);
        }
        
        .victorian-skeleton {
          background: linear-gradient(90deg, 
            var(--victorian-cream) 0%, 
            var(--victorian-gold) 50%, 
            var(--victorian-cream) 100%
          );
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
          border-radius: 8px;
        }
        
        @keyframes skeleton-shimmer {
          0% { background-position: 100% 0; }
          100% { background-position: -100% 0; }
        }
        
        .victorian-info-panel {
          padding: 1rem;
          background: linear-gradient(135deg, var(--victorian-cream), #f5ebe0);
          border-top: 2px solid var(--victorian-bronze);
        }
        
        .victorian-desc {
          font-family: 'Lato', sans-serif;
          font-size: 0.9rem;
          color: var(--victorian-charcoal);
          line-clamp: 2;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin-bottom: 0.5rem;
        }
        
        .victorian-byline {
          font-family: 'Playfair Display', serif;
          font-size: 0.95rem;
          color: var(--victorian-bronze);
          font-style: italic;
        }
      `}</style>
      
      <div className="victorian-image-grid">
        {uniqueImages.map((image) => (
          <div
            key={image.id}
            className="victorian-image-card"
            onClick={() => onImageToggle(image.id)}
            onMouseEnter={() => setHoveredImageId(image.id)}
            onMouseLeave={() => setHoveredImageId(null)}
          >
            {/* Ornate corner accents */}
            <div className="corner-accent top-left" />
            <div className="corner-accent top-right" />
            <div className="corner-accent bottom-left" />
            <div className="corner-accent bottom-right" />
            
            {/* Image wrapper with sepia filter */}
            <div className="victorian-image-wrapper">
              <img
                src={image.urls?.regular || "/placeholder.svg"}
                alt={image.alt_description || "Victorian artwork"}
                className="victorian-image"
              />
              
              {/* Victorian checkbox */}
              <div className="victorian-checkbox-wrapper" onClick={(e) => e.stopPropagation()}>
                <div
                  className={`victorian-checkbox ${selectedImages.has(image.id) ? 'checked' : ''}`}
                  onClick={() => onImageToggle(image.id)}
                  role="checkbox"
                  aria-checked={selectedImages.has(image.id)}
                />
              </div>
              
              {/* Hover overlay with burgundy gradient */}
              <div className="victorian-overlay">
                <div className="victorian-image-info">
                  <h3 className="victorian-image-title">
                    {image.alt_description || "Untitled Masterpiece"}
                  </h3>
                  <p className="victorian-image-author">
                    by {image.user?.name || "Unknown Artist"}
                  </p>
                  
                  <div className="victorian-actions">
                    <button className="victorian-action-btn" onClick={(e) => e.stopPropagation()}>
                      <span>👁</span>
                      <span>View</span>
                    </button>
                    <button className="victorian-action-btn" onClick={(e) => e.stopPropagation()}>
                      <span>⬇</span>
                      <span>Save</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Info panel with Victorian styling */}
            <div className="victorian-info-panel">
              <p className="victorian-desc">
                {image.alt_description || "An exquisite vintage composition"}
              </p>
              <p className="victorian-byline">
                by {image.user?.name || "Unknown Artist"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
