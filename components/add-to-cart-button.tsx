'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { addToCart } from '@/lib/data/cart'

interface AddToCartButtonProps {
  productId: string
  variantId?: string
  stockQuantity: number
  isActive: boolean
  variantName?: string
}

export default function AddToCartButton({
  productId,
  variantId,
  stockQuantity,
  isActive,
  variantName,
}: Readonly<AddToCartButtonProps>) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  
  const handleAddToCart = async () => {
    setLoading(true)
    setMessage(null)
    
    const result = await addToCart(productId, quantity, variantId)
    
    if (result.success) {
      const variantText = variantName ? ` (${variantName})` : ''
      setMessage({ type: 'success', text: `Added to cart!${variantText}` })
      router.refresh() // Refresh to update cart count
      setTimeout(() => setMessage(null), 3000)
    } else {
      setMessage({ type: 'error', text: result.error || 'Failed to add to cart' })
    }
    
    setLoading(false)
  }
  
  if (!isActive || stockQuantity === 0) {
    return (
      <div className="text-center py-4">
        <span className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-500 rounded-xl font-semibold">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
          </svg>
          Out of Stock
        </span>
      </div>
    )
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <label htmlFor="quantity" className="font-medium">
          Quantity:
        </label>
        <select
          id="quantity"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
          disabled={loading}
        >
          {Array.from({ length: Math.min(stockQuantity, 10) }, (_, i) => i + 1).map(num => (
            <option key={num} value={num}>{num}</option>
          ))}
        </select>
        <span className="text-sm text-gray-600">
          {stockQuantity} available
        </span>
      </div>
      
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Adding...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Add to Cart {variantName ? `(${variantName})` : ''}
          </>
        )}
      </button>
      
      {message && (
        <div
          className={`p-3 rounded-lg ${
            message.type === 'success'
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}
        >
          {message.text}
        </div>
      )}
    </div>
  )
}
