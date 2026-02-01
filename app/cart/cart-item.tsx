'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import { updateCartItemQuantity, removeFromCart } from '@/lib/data/cart'
import { formatPrice } from '@/lib/utils/product'
import type { CartItemDisplay } from '@/lib/data/cart'

interface CartItemProps {
  item: CartItemDisplay
}

export default function CartItem({ item }: Readonly<CartItemProps>) {
  const router = useRouter()
  const [quantity, setQuantity] = useState(item.quantity)
  const [loading, setLoading] = useState(false)
  const [removing, setRemoving] = useState(false)
  
  const handleQuantityChange = async (newQuantity: number) => {
    setLoading(true)
    setQuantity(newQuantity)
    
    const result = await updateCartItemQuantity(item.id, newQuantity)
    
    if (!result.success) {
      // Revert on error
      setQuantity(item.quantity)
      alert(result.error || 'Failed to update quantity')
    }
    
    router.refresh()
    setLoading(false)
  }
  
  const handleRemove = async () => {
    if (!confirm('Remove this item from cart?')) return
    
    setRemoving(true)
    const result = await removeFromCart(item.id)
    
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Failed to remove item')
      setRemoving(false)
    }
  }
  
  const product = item.products
  const discountedPrice = Math.round(product.price * (100 - product.discount_percentage) / 100)
  
  return (
    <div className={`bg-white rounded-lg shadow-sm p-6 ${removing ? 'opacity-50' : ''}`}>
      <div className="flex gap-4">
        {/* Product Image */}
        <Link href={`/products/${product.slug}`} className="flex-shrink-0">
          <img
            src={product.images?.[0] || '/placeholder-product.jpg'}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
        </Link>
        
        {/* Product Details */}
        <div className="flex-grow">
          <div className="flex justify-between">
            <div>
              <Link
                href={`/products/${product.slug}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600"
              >
                {product.name}
              </Link>
              
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  {formatPrice(discountedPrice)}
                </span>
                {product.discount_percentage > 0 && (
                  <>
                    <span className="text-sm text-gray-500 line-through">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-sm text-green-600 font-semibold">
                      {product.discount_percentage}% OFF
                    </span>
                  </>
                )}
              </div>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={removing}
              className="text-red-600 hover:text-red-700 disabled:opacity-50"
              aria-label="Remove item"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
          
          {/* Quantity Selector */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label htmlFor={`qty-${item.id}`} className="text-sm text-gray-600">
                Quantity:
              </label>
              <select
                id={`qty-${item.id}`}
                value={quantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                disabled={loading || removing}
                className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 disabled:opacity-50"
              >
                {Array.from({ length: Math.min(product.stock_quantity, 10) }, (_, i) => i + 1).map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            {/* Item Subtotal */}
            <div className="text-right">
              <p className="text-sm text-gray-600">Subtotal</p>
              <p className="text-xl font-bold text-gray-900">
                {formatPrice(item.subtotal)}
              </p>
            </div>
          </div>
          
          {/* Stock Warning */}
          {product.stock_quantity < 10 && (
            <p className="mt-2 text-sm text-orange-600">
              Only {product.stock_quantity} left in stock
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
