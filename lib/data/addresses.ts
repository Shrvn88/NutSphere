'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAddress(formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const addressData = {
      user_id: user.id,
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      address_line1: formData.get('address_line1') as string,
      address_line2: (formData.get('address_line2') as string) || null,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postal_code: formData.get('postal_code') as string,
      country: formData.get('country') as string,
      is_default: formData.get('is_default') === 'on',
    }

    // If setting as default, unset other defaults first
    if (addressData.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
    }

    const { error } = await supabase
      .from('addresses')
      .insert(addressData)

    if (error) {
      console.error('Failed to create address:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/profile/addresses')
    revalidatePath('/checkout')
    
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function updateAddress(addressId: string, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const addressData = {
      full_name: formData.get('full_name') as string,
      phone: formData.get('phone') as string,
      address_line1: formData.get('address_line1') as string,
      address_line2: (formData.get('address_line2') as string) || null,
      city: formData.get('city') as string,
      state: formData.get('state') as string,
      postal_code: formData.get('postal_code') as string,
      country: formData.get('country') as string,
      is_default: formData.get('is_default') === 'on',
    }

    // If setting as default, unset other defaults first
    if (addressData.is_default) {
      await supabase
        .from('addresses')
        .update({ is_default: false })
        .eq('user_id', user.id)
        .neq('id', addressId)
    }

    const { error } = await supabase
      .from('addresses')
      .update(addressData)
      .eq('id', addressId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to update address:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/profile/addresses')
    revalidatePath('/checkout')
    
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function deleteAddress(addressId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('addresses')
      .delete()
      .eq('id', addressId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to delete address:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/profile/addresses')
    revalidatePath('/checkout')
    
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

export async function setDefaultAddress(addressId: string) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { success: false, error: 'Not authenticated' }
    }

    // Unset all defaults
    await supabase
      .from('addresses')
      .update({ is_default: false })
      .eq('user_id', user.id)

    // Set new default
    const { error } = await supabase
      .from('addresses')
      .update({ is_default: true })
      .eq('id', addressId)
      .eq('user_id', user.id)

    if (error) {
      console.error('Failed to set default address:', error)
      return { success: false, error: error.message }
    }

    revalidatePath('/profile/addresses')
    revalidatePath('/checkout')
    
    return { success: true }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

