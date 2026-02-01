import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'
import { createAPIRoute } from '@/lib/utils/api-wrapper'
import { RATE_LIMITS } from '@/lib/utils/rate-limit'
import { validationError, authError } from '@/lib/utils/error-handler'
import { isValidEmail, sanitizeInput } from '@/lib/utils/security'

async function loginHandler(request: NextRequest) {
  const body = await request.json()
  const { email, password } = body

  // Validation
  if (!email || !password) {
    throw validationError('Email and password are required')
  }

  // Sanitize and validate email
  const sanitizedEmail = sanitizeInput(email.toLowerCase())
  if (!isValidEmail(sanitizedEmail)) {
    throw validationError('Invalid email format', 'email')
  }

  const response = NextResponse.json({ success: true })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )
  
  const { error } = await supabase.auth.signInWithPassword({
    email: sanitizedEmail,
    password,
  })

  if (error) {
    throw authError(error.message)
  }

  return response
}

// Apply rate limiting (5 requests per 15 minutes)
export const POST = createAPIRoute(loginHandler, {
  rateLimit: RATE_LIMITS.AUTH
})
