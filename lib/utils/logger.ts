/**
 * Centralized logging utility
 * In production, integrate with services like Sentry, LogRocket, etc.
 */

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

interface LogContext {
  [key: string]: unknown
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development'

  private formatMessage(level: LogLevel, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString()
    const contextStr = context ? ` ${JSON.stringify(context)}` : ''
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${contextStr}`
  }

  debug(message: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.debug(this.formatMessage(LogLevel.DEBUG, message, context))
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage(LogLevel.INFO, message, context))
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage(LogLevel.WARN, message, context))
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const fullContext = {
      ...context,
      error: error instanceof Error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
      } : error,
    }
    
    console.error(this.formatMessage(LogLevel.ERROR, message, fullContext))
    
    // In production, send to error tracking service
    if (!this.isDevelopment) {
      // TODO: Send to Sentry, LogRocket, etc.
      // Example: Sentry.captureException(error, { extra: context })
    }
  }

  /**
   * Log API request
   */
  logRequest(method: string, url: string, statusCode: number, duration: number): void {
    const message = `${method} ${url} - ${statusCode} - ${duration}ms`
    
    if (statusCode >= 500) {
      this.error(message)
    } else if (statusCode >= 400) {
      this.warn(message)
    } else {
      this.info(message)
    }
  }

  /**
   * Log performance metric
   */
  logPerformance(name: string, duration: number, context?: LogContext): void {
    this.info(`Performance: ${name} took ${duration}ms`, context)
    
    // In production, send to analytics
    if (!this.isDevelopment) {
      // TODO: Send to analytics service
      // Example: analytics.track('performance', { name, duration, ...context })
    }
  }

  /**
   * Log user action
   */
  logUserAction(action: string, userId?: string, context?: LogContext): void {
    this.info(`User action: ${action}`, { userId, ...context })
    
    // In production, send to analytics
    if (!this.isDevelopment) {
      // TODO: Send to analytics service
      // Example: analytics.track(action, { userId, ...context })
    }
  }
}

// Export singleton instance
export const logger = new Logger()

/**
 * Performance timing utility
 */
export class PerformanceTimer {
  private startTime: number
  private name: string

  constructor(name: string) {
    this.name = name
    this.startTime = Date.now()
  }

  end(context?: LogContext): number {
    const duration = Date.now() - this.startTime
    logger.logPerformance(this.name, duration, context)
    return duration
  }
}

/**
 * Measure async function execution time
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>,
  context?: LogContext
): Promise<T> {
  const timer = new PerformanceTimer(name)
  try {
    const result = await fn()
    timer.end(context)
    return result
  } catch (error) {
    timer.end({ ...context, error: true })
    throw error
  }
}

