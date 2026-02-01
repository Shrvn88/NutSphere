/**
 * Centralized error handling utilities
 */

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string
  ) {
    super(message)
    this.name = 'APIError'
  }
}

export interface ErrorResponse {
  success: false
  error: string
  code?: string
  statusCode: number
}

/**
 * Format error for API response
 */
export function formatErrorResponse(error: unknown): ErrorResponse {
  // Handle APIError instances
  if (error instanceof APIError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
      statusCode: error.statusCode
    }
  }
  
  // Handle standard Error instances
  if (error instanceof Error) {
    // Don't expose internal errors in production
    const message = process.env.NODE_ENV === 'production' 
      ? 'An unexpected error occurred'
      : error.message
    
    return {
      success: false,
      error: message,
      statusCode: 500
    }
  }
  
  // Handle unknown errors
  return {
    success: false,
    error: 'An unexpected error occurred',
    statusCode: 500
  }
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: Record<string, unknown>) {
  const timestamp = new Date().toISOString()
  const errorInfo = {
    timestamp,
    error: error instanceof Error ? {
      name: error.name,
      message: error.message,
      stack: error.stack
    } : error,
    context
  }
  
  // In production, this would send to monitoring service
  console.error('[ERROR]', JSON.stringify(errorInfo, null, 2))
}

/**
 * Validation error helper
 */
export function validationError(message: string, field?: string): APIError {
  const error = new APIError(message, 400, 'VALIDATION_ERROR')
  if (field) {
    error.message = `${field}: ${message}`
  }
  return error
}

/**
 * Authentication error helper
 */
export function authError(message: string = 'Authentication required'): APIError {
  return new APIError(message, 401, 'AUTH_ERROR')
}

/**
 * Authorization error helper
 */
export function forbiddenError(message: string = 'Access denied'): APIError {
  return new APIError(message, 403, 'FORBIDDEN')
}

/**
 * Not found error helper
 */
export function notFoundError(resource: string = 'Resource'): APIError {
  return new APIError(`${resource} not found`, 404, 'NOT_FOUND')
}

/**
 * Rate limit error helper
 */
export function rateLimitError(resetTime: number): APIError {
  const error = new APIError(
    'Too many requests. Please try again later.',
    429,
    'RATE_LIMIT'
  )
  // Store reset time for header generation
  ;(error as any).resetTime = resetTime
  return error
}
