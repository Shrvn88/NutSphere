import { createClient } from '@/lib/supabase/server'
import { AuthUser, UserRole } from '@/types'
import { cache } from 'react'

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, email, full_name, role')
    .eq('id', user.id)
    .single()
  
  if (error || !profile) {
    return null
  }

  return {
    id: profile.id,
    email: profile.email,
    role: profile.role as UserRole,
    full_name: profile.full_name,
  } as AuthUser
})

export async function isAdmin(): Promise<boolean> {
  const user = await getCurrentUser()
  return user?.role === 'admin'
}

export async function isAuthenticated(): Promise<boolean> {
  const user = await getCurrentUser()
  return user !== null
}

export async function requireAuth(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user) throw new Error('Unauthorized')
  return user
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser()
  if (!user || user?.role !== 'admin') {
    throw new Error('Forbidden: Admin access required')
  }
  return user
}