'use client'

import { useEffect, useState } from 'react'

export default function FreeDeliveryCard() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div 
      className={`relative bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 shadow-sm overflow-hidden group hover:shadow-lg transition-all duration-500 hover:scale-105 ${mounted ? 'opacity-100' : 'opacity-100'}`}
    >
      <div className="relative flex items-start gap-4">
        <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:rotate-12 transition-transform duration-300">
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-green-600 transition-colors">
            Free Delivery Across India
          </h3>
          <p className="text-sm text-gray-600">Enjoy complimentary shipping on all orders, anywhere in India</p>
        </div>
      </div>
    </div>
  )
}

