'use client'

import { useState } from 'react'

interface ProductImageGalleryProps {
  images: string[]
  productName: string
  discountPercentage: number
}

export default function ProductImageGallery({ images, productName, discountPercentage }: ProductImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleThumbnailClick = (index: number) => {
    setCurrentImageIndex(index)
  }

  if (images.length === 0) {
    return (
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
        <span className="text-9xl text-gray-300">🥜</span>
      </div>
    )
  }

  return (
    <div>
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <img
          src={images[currentImageIndex]}
          alt={`${productName} - Image ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
          loading="eager"
        />
        
        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-lg text-lg font-bold shadow-lg">
            {discountPercentage}% OFF
          </div>
        )}

        {/* Navigation Arrows (only show if multiple images) */}
        {images.length > 1 && (
          <>
            {/* Previous Button */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Previous image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Next Button */}
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Next image"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
              {currentImageIndex + 1} / {images.length}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
