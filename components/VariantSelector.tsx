'use client'

import { useState, useEffect } from 'react'
import type { ProductVariant } from '@/types'

// Re-export for backwards compatibility
export type { ProductVariant } from '@/types'

interface VariantSelectorProps {
  variants: ProductVariant[]
  onVariantChange: (variant: ProductVariant) => void
  disabled?: boolean
}

export default function VariantSelector({ variants, onVariantChange, disabled }: VariantSelectorProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)

  useEffect(() => {
    // Select default variant on mount
    const defaultVariant = variants.find(v => v.is_default) || variants[0]
    if (defaultVariant) {
      setSelectedVariant(defaultVariant)
      onVariantChange(defaultVariant)
    }
  }, [variants]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSelect = (variant: ProductVariant) => {
    setSelectedVariant(variant)
    onVariantChange(variant)
  }

  if (variants.length === 0) return null

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">
        Select Weight
      </label>
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => {
          const isSelected = selectedVariant?.id === variant.id
          const isOutOfStock = variant.stock_quantity <= 0
          const discount = variant.compare_at_price && variant.compare_at_price > variant.price
            ? Math.round(((variant.compare_at_price - variant.price) / variant.compare_at_price) * 100)
            : null

          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => handleSelect(variant)}
              disabled={disabled || isOutOfStock}
              className={`relative px-4 py-3 rounded-xl border-2 transition-all ${
                isSelected
                  ? 'border-green-600 bg-green-50 ring-2 ring-green-200'
                  : isOutOfStock
                    ? 'border-gray-200 bg-gray-100 cursor-not-allowed opacity-60'
                    : 'border-gray-200 hover:border-green-400 hover:bg-green-50'
              }`}
            >
              {/* Discount Badge */}
              {discount && !isOutOfStock && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full font-medium">
                  -{discount}%
                </span>
              )}

              <div className="text-center">
                <div className={`font-semibold ${isSelected ? 'text-green-700' : 'text-gray-900'}`}>
                  {variant.name}
                </div>
                <div className="mt-1 flex items-center justify-center gap-2">
                  <span className={`font-bold ${isSelected ? 'text-green-600' : 'text-gray-900'}`}>
                    ₹{variant.price.toFixed(0)}
                  </span>
                  {variant.compare_at_price && variant.compare_at_price > variant.price && (
                    <span className="text-sm text-gray-400 line-through">
                      ₹{variant.compare_at_price.toFixed(0)}
                    </span>
                  )}
                </div>
                {isOutOfStock && (
                  <div className="text-xs text-red-500 mt-1">Out of Stock</div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

