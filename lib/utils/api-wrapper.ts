import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, getRateLimitHeaders, type RateLimitConfig } from './rate-limit'
import { formatErrorResponse, logError, rateLimitError } from './error-handler'
import { getClientIP, getSecurityHeaders } from './security'
import { logger, PerformanceTimer } from './logger'

type RouteHandler = (
  request: NextRequest,
  context?: { params: any }
) => Promise<Response> | Response

interface APIRouteOptions {
  rateLimit?: RateLimitConfig
  requireAuth?: boolean
  requireAdmin?: boolean
}

/**
 * Wrapper for API routes with security, rate limiting, and error handling
 */
export function createAPIRoute(
  handler: RouteHandler,
  options: APIRouteOptions = {}
): RouteHandler {
  return async (request: NextRequest, context?: { params: any }) => {
    const timer = new PerformanceTimer(`API ${request.method} ${request.nextUrl.pathname}`)
    
    try {
      // Apply security headers
      const securityHeaders = getSecurityHeaders()
      
      // Rate limiting
      if (options.rateLimit) {
        const clientIP = getClientIP(request.headers)
        const identifier = `${clientIP}:${request.nextUrl.pathname}`
        
        const rateLimitResult = checkRateLimit(identifier, options.rateLimit)
        const rateLimitHeaders = getRateLimitHeaders(rateLimitResult)
        
        if (!rateLimitResult.success) {
          logger.warn('Rate limit exceeded', {
            ip: clientIP,
            path: request.nextUrl.pathname,
            remaining: rateLimitResult.remaining
          })
          
          const error = rateLimitError(rateLimitResult.resetTime)
          const errorResponse = formatErrorResponse(error)
          
          return NextResponse.json(errorResponse, {
            status: 429,
            headers: {
              ...securityHeaders,
              ...rateLimitHeaders,
              'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString()
            }
          })
        }
        
        // Add rate limit headers to response
        Object.assign(securityHeaders, rateLimitHeaders)
      }
      
      // Execute handler
      const response = await handler(request, context)
      
      // Add security headers to response
      Object.entries(securityHeaders).forEach(([key, value]) => {
        response.headers.set(key, value)
      })
      
      // Log successful request
      const duration = timer.end()
      logger.logRequest(
        request.method,
        request.nextUrl.pathname,
        response.status,
        duration
      )
      
      return response
    } catch (error) {
      // Log error
      logError(error, {
        method: request.method,
        path: request.nextUrl.pathname,
        ip: getClientIP(request.headers)
      })
      
      timer.end({ error: true })
      
      // Format error response
      const errorResponse = formatErrorResponse(error)
      return NextResponse.json(errorResponse, {
        status: errorResponse.statusCode,
        headers: getSecurityHeaders()
      })
    }
  }
}

/**
 * Handle OPTIONS request for CORS
 */
export function handleOptions(request: NextRequest): Response {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
