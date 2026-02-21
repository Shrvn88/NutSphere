/**
 * Rate limiting utility using in-memory store
 * For production with multiple instances, use Redis or similar
 */

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (store[key].resetTime < now) {
      delete store[key]
    }
  })
}, 5 * 60 * 1000)

export interface RateLimitConfig {
  interval: number // Time window in milliseconds
  maxRequests: number // Maximum requests per interval
}

export interface RateLimitResult {
  success: boolean
  remaining: number
  resetTime: number
  limit: number
}

/**
 * Check if a request should be rate limited
 * @param identifier - Unique identifier (IP, user ID, etc.)
 * @param config - Rate limit configuration
 * @returns Rate limit result with remaining requests and reset time
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now()
  const key = identifier
  
  // Initialize or get existing entry
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + config.interval
    }
  }
  
  const entry = store[key]
  entry.count++
  
  const remaining = Math.max(0, config.maxRequests - entry.count)
  const success = entry.count <= config.maxRequests
  
  return {
    success,
    remaining,
    resetTime: entry.resetTime,
    limit: config.maxRequests
  }
}

/**
 * Get rate limit headers for response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': new Date(result.resetTime).toISOString(),
  }
}

/**
 * Preset rate limit configurations
 */
export const RATE_LIMITS = {
  // Auth endpoints - stricter limits
  AUTH: {
    interval: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5
  },
  // API endpoints - moderate limits
  API: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 60
  },
  // Public endpoints - generous limits
  PUBLIC: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 120
  },
  // Admin endpoints - higher limits
  ADMIN: {
    interval: 60 * 1000, // 1 minute
    maxRequests: 120
  }
} as const

