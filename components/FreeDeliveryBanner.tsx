'use client'

import { useEffect, useState } from 'react'

export default function FreeDeliveryBanner() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div 
      className={`relative bg-gradient-to-r from-green-600 via-green-500 to-green-600 text-white py-2 sm:py-3 px-3 sm:px-4 shadow-md overflow-hidden transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-100'}`}
    >
      <div className="relative max-w-7xl mx-auto flex items-center gap-3">
        {/* Static Icon */}
        <svg className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
        
        {/* Scrolling Text Container */}
        <div className="flex-1 overflow-hidden relative">
          <div className="animate-marquee whitespace-nowrap inline-block">
            <span className="text-xs sm:text-sm md:text-base font-semibold mx-4">
              🎉 Free Delivery Across India on All Orders | Enjoy Complimentary Shipping Anywhere in India
            </span>
            <span className="text-xs sm:text-sm md:text-base font-semibold mx-4">
              🎉 Free Delivery Across India on All Orders | Enjoy Complimentary Shipping Anywhere in India
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}
