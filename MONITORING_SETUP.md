# Performance Monitoring Configuration

This file configures monitoring tools for production. Integrate with your preferred monitoring service.

## Recommended Services

### Error Tracking
- **Sentry**: https://sentry.io
  ```bash
  npm install @sentry/nextjs
  ```
  
### Performance Monitoring  
- **Vercel Analytics**: Built-in with Vercel deployment
- **Google Analytics**: For user behavior tracking

### Logging
- **LogRocket**: Session replay and logging
- **DataDog**: Infrastructure monitoring

## Setup Instructions

### 1. Sentry Integration (Recommended)

```bash
# Install
npm install @sentry/nextjs

# Initialize
npx @sentry/wizard@latest -i nextjs

# Configure in sentry.client.config.ts
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 1.0,
  environment: process.env.NODE_ENV,
})
```

### 2. Vercel Analytics

```tsx
// Add to app/layout.tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

### 3. Custom Logging Hook

Our logger utility is already set up in `lib/utils/logger.ts`. To send logs to external service:

```typescript
// lib/utils/logger.ts - Update production logging
if (!this.isDevelopment) {
  // Send to Sentry
  Sentry.captureException(error, { extra: context })
  
  // Or send to custom endpoint
  fetch('/api/log', {
    method: 'POST',
    body: JSON.stringify({ level, message, context })
  })
}
```

## Environment Variables

Add these to your production environment:

```env
# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
SENTRY_ORG=your_org
SENTRY_PROJECT=your_project

# Analytics (if using custom)
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## What's Already Implemented

✅ Performance timing with `PerformanceTimer`
✅ Error logging with `logger.error()`
✅ Request logging with `logger.logRequest()`
✅ User action tracking with `logger.logUserAction()`
✅ Global error boundary in `components/ErrorBoundary.tsx`
✅ API error handling in `lib/utils/error-handler.ts`

## Next Steps

1. Choose monitoring service (Sentry recommended)
2. Install and configure
3. Update logger.ts to send production logs
4. Test error reporting
5. Set up alerts for critical errors
