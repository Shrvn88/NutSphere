'use server'

import { createClient } from '@/lib/supabase/server'

export async function updateProfile(data: {
  fullName: string
  phone?: string
}): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { success: false, error: 'Not authenticated' }
  }

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: data.fullName,
      phone: data.phone || null,
      updated_at: new Date().toISOString(),
    })
    .eq('id', user.id)

  if (error) {
    console.error('Error updating profile:', error)
    return { success: false, error: 'Failed to update profile' }
  }

  return { success: true }
}
