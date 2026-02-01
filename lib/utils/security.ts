/**
 * Security utilities and headers
 */

/**
 * Get security headers for production
 */
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent XSS attacks
    'X-Content-Type-Options': 'nosniff',
    // Prevent clickjacking
    'X-Frame-Options': 'DENY',
    // Enable XSS protection
    'X-XSS-Protection': '1; mode=block',
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    // Permissions policy
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  }
}

/**
 * Get CORS headers
 */
export function getCORSHeaders(origin?: string): Record<string, string> {
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || []
  const isAllowed = origin && allowedOrigins.includes(origin)
  
  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : '',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  }
}

/**
 * Sanitize string input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove < and >
    .trim()
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate phone number (Indian format)
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\D/g, ''))
}

/**
 * Validate postal code (Indian format)
 */
export function isValidPostalCode(code: string): boolean {
  const postalRegex = /^[1-9]\d{5}$/
  return postalRegex.test(code)
}

/**
 * Generate secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const randomValues = new Uint8Array(length)
  
  if (typeof window !== 'undefined') {
    window.crypto.getRandomValues(randomValues)
  } else {
    require('crypto').randomBytes(length).forEach((byte: number, i: number) => {
      randomValues[i] = byte
    })
  }
  
  randomValues.forEach(value => {
    result += chars[value % chars.length]
  })
  
  return result
}

/**
 * Check if request is from valid IP
 * For production, implement actual IP filtering
 */
export function isValidIP(ip: string): boolean {
  // Add IP blacklist/whitelist logic here
  return true
}

/**
 * Rate limit by IP address
 */
export function getClientIP(headers: Headers): string {
  return (
    headers.get('x-forwarded-for')?.split(',')[0] ||
    headers.get('x-real-ip') ||
    'unknown'
  )
}
