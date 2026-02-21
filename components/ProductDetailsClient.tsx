'use client'

import { useState } from 'react'
import VariantSelector from './VariantSelector'
import AddToCartButton from './add-to-cart-button'
import { formatPrice } from '@/lib/utils/product'
import type { ProductVariant } from '@/types'

interface ProductDetailsClientProps {
  productId: string
  productName: string
  basePrice: number
  baseDiscountedPrice: number
  discountPercentage: number
  stockQuantity: number
  isActive: boolean
  weightGrams: number | null
  variants: ProductVariant[]
}

export default function ProductDetailsClient({
  productId,
  productName,
  basePrice,
  baseDiscountedPrice,
  discountPercentage,
  stockQuantity: baseStockQuantity,
  isActive,
  weightGrams,
  variants,
}: ProductDetailsClientProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  
  // Use variant values if selected, otherwise use base product values
  const currentPrice = selectedVariant ? selectedVariant.price : basePrice
  const currentComparePrice = selectedVariant?.compare_at_price || (discountPercentage > 0 ? basePrice : null)
  const currentDiscountedPrice = selectedVariant ? selectedVariant.price : baseDiscountedPrice
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : baseStockQuantity
  const currentWeight = selectedVariant?.name || (weightGrams ? `${weightGrams}g` : null)
  
  // Calculate discount percentage for variant
  const currentDiscountPercentage = currentComparePrice && currentComparePrice > currentPrice
    ? Math.round(((currentComparePrice - currentPrice) / currentComparePrice) * 100)
    : discountPercentage

  const discountAmount = currentComparePrice ? currentComparePrice - currentPrice : 0

  const handleVariantChange = (variant: ProductVariant) => {
    setSelectedVariant(variant)
  }

  const stockColor = currentStock > 10 ? 'green' : currentStock > 0 ? 'yellow' : 'red'
  const stockColorClass = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  }[stockColor]

  const getStockLabel = (qty: number) => {
    if (qty === 0) return 'Out of Stock'
    if (qty <= 5) return `Only ${qty} left`
    if (qty <= 10) return 'Low Stock'
    return 'In Stock'
  }

  return (
    <div className="space-y-6">
      {/* Variant Selector */}
      {variants.length > 0 && (
        <VariantSelector
          variants={variants}
          onVariantChange={handleVariantChange}
        />
      )}

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-gray-900">
          {formatPrice(currentDiscountedPrice)}
        </span>
        {currentComparePrice && currentComparePrice > currentPrice && (
          <>
            <span className="text-2xl text-gray-500 line-through">
              {formatPrice(currentComparePrice)}
            </span>
            <span className="text-lg text-green-600 font-semibold">
              Save {formatPrice(discountAmount)}
            </span>
          </>
        )}
      </div>

      {/* Current Weight/Variant Display */}
      {currentWeight && !variants.length && (
        <div className="text-sm text-gray-600">
          <span className="font-medium">Weight:</span> {currentWeight}
        </div>
      )}

      {/* Stock Status */}
      <div>
        <span className={`inline-block px-4 py-2 rounded-lg text-sm font-medium ${stockColorClass}`}>
          {getStockLabel(currentStock)}
        </span>
        {currentStock > 0 && currentStock < 10 && (
          <p className="mt-2 text-sm text-orange-600">
            Hurry! Only {currentStock} left in stock!
          </p>
        )}
      </div>

      {/* Action Buttons */}
      <div className="pt-2">
        <AddToCartButton 
          productId={productId}
          variantId={selectedVariant?.id}
          stockQuantity={currentStock}
          isActive={isActive}
          variantName={selectedVariant?.name}
        />
      </div>
    </div>
  )
}

