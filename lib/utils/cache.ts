/**
 * Caching utilities and configurations
 */

/**
 * Cache configurations for different data types
 */
export const CACHE_TIMES = {
  // Static content
  STATIC: 60 * 60 * 24 * 7, // 7 days
  // Product data
  PRODUCTS: 60 * 60, // 1 hour
  // Category data
  CATEGORIES: 60 * 60 * 2, // 2 hours
  // User data
  USER: 60 * 5, // 5 minutes
  // Cart data
  CART: 0, // No cache
  // Order data
  ORDERS: 60, // 1 minute
  // Search results
  SEARCH: 60 * 30, // 30 minutes
} as const

/**
 * Get cache control header for response
 */
export function getCacheHeader(seconds: number, type: 'public' | 'private' = 'public'): string {
  if (seconds === 0) {
    return 'no-store, must-revalidate'
  }
  
  return `${type}, max-age=${seconds}, s-maxage=${seconds}, stale-while-revalidate=${seconds * 2}`
}

/**
 * Revalidation tags for Next.js cache
 */
export const CACHE_TAGS = {
  PRODUCTS: 'products',
  PRODUCT: (id: string) => `product-${id}`,
  CATEGORIES: 'categories',
  CATEGORY: (slug: string) => `category-${slug}`,
  USER: (id: string) => `user-${id}`,
  ORDERS: 'orders',
  ORDER: (id: string) => `order-${id}`,
} as const

/**
 * Simple in-memory cache with TTL
 * For production, use Redis or similar
 */
class MemoryCache {
  private cache = new Map<string, { value: any; expires: number }>()

  set(key: string, value: any, ttl: number): void {
    const expires = Date.now() + ttl * 1000
    this.cache.set(key, { value, expires })
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key)
    if (!item) return null

    if (item.expires < Date.now()) {
      this.cache.delete(key)
      return null
    }

    return item.value as T
  }

  delete(key: string): void {
    this.cache.delete(key)
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean expired entries
  cleanup(): void {
    const now = Date.now()
    for (const [key, item] of this.cache.entries()) {
      if (item.expires < now) {
        this.cache.delete(key)
      }
    }
  }
}

// Singleton instance
export const memoryCache = new MemoryCache()

// Cleanup every 5 minutes
if (typeof window === 'undefined') {
  setInterval(() => {
    memoryCache.cleanup()
  }, 5 * 60 * 1000)
}

/**
 * Memoize async function with cache
 */
export function memoize<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  keyGenerator: (...args: Parameters<T>) => string,
  ttl: number
): T {
  return (async (...args: Parameters<T>) => {
    const key = keyGenerator(...args)
    
    // Check cache
    const cached = memoryCache.get(key)
    if (cached !== null) {
      return cached
    }

    // Execute and cache
    const result = await fn(...args)
    memoryCache.set(key, result, ttl)
    return result
  }) as T
}
