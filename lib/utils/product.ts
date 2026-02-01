import { Product, ProductDisplay } from '@/types'

/**
 * Calculate discounted price for a product
 */
export function getDiscountedPrice(price: number, discountPercentage: number): number {
  return Math.round((price * (100 - discountPercentage)) / 100 * 100) / 100
}

/**
 * Calculate discount amount
 */
export function getDiscountAmount(price: number, discountPercentage: number): number {
  return Math.round((price * discountPercentage) / 100 * 100) / 100
}

/**
 * Check if product is in stock
 */
export function isInStock(stockQuantity: number): boolean {
  return stockQuantity > 0
}

/**
 * Get primary image from product images array
 */
export function getPrimaryImage(images: string[]): string | null {
  return images.length > 0 ? images[0] : null
}

/**
 * Transform Product to ProductDisplay with computed fields
 */
export function toProductDisplay(product: Product): ProductDisplay {
  return {
    ...product,
    discounted_price: getDiscountedPrice(product.price, product.discount_percentage),
    discount_amount: getDiscountAmount(product.price, product.discount_percentage),
    in_stock: isInStock(product.stock_quantity),
    primary_image: getPrimaryImage(product.images),
  }
}

/**
 * Format price for display (INR)
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

/**
 * Get Supabase Storage public URL for product image
 */
export function getProductImageUrl(imagePath: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  if (!supabaseUrl) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not defined')
  }
  return `${supabaseUrl}/storage/v1/object/public/product-images/${imagePath}`
}

/**
 * Get stock status label
 */
export function getStockStatusLabel(stockQuantity: number): string {
  if (stockQuantity === 0) return 'Out of Stock'
  if (stockQuantity < 10) return 'Low Stock'
  return 'In Stock'
}

/**
 * Get stock status color for UI
 */
export function getStockStatusColor(stockQuantity: number): 'red' | 'yellow' | 'green' {
  if (stockQuantity === 0) return 'red'
  if (stockQuantity < 10) return 'yellow'
  return 'green'
}
