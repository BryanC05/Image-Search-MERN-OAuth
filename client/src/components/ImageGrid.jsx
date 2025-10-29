"use client"

import "./ImageGrid.css"

function ImageGrid({ images, selectedImages, onSelectImage }) {
  return (
    <div className="image-grid">
      {images.map((image) => (
        <div
          key={image.id}
          className={`image-card ${selectedImages.includes(image.id) ? "selected" : ""}`}
          onClick={() => onSelectImage(image.id)}
        >
          <img src={image.url || "/placeholder.svg"} alt={image.description} />
          <div className="image-overlay">
            <div className="image-info">
              <p className="image-description">{image.description}</p>
              <div className="image-stats">
                <span className="stat-item">
                  <span className="stat-icon">❤️</span>
                  {image.likes}
                </span>
                <span className="stat-item">
                  <span className="stat-icon">⬇️</span>
                  {image.downloads}
                </span>
              </div>
            </div>
            <div className="checkbox">
              <input
                type="checkbox"
                checked={selectedImages.includes(image.id)}
                onChange={() => onSelectImage(image.id)}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ImageGrid
