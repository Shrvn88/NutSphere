'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { cache } from 'react'
import type { Database } from '@/types/database.types'

type CartItem = Database['public']['Tables']['cart_items']['Row'] & {
  products: Database['public']['Tables']['products']['Row']
}

export interface CartItemDisplay extends CartItem {
  subtotal: number
  discounted_price: number
}

export interface CartSummary {
  items: CartItemDisplay[]
  subtotal: number
  discount: number
  total: number
  itemCount: number
}

/**
 * Get or create session ID for guest users
 */
async function getSessionId(): Promise<string | null> {
  const cookieStore = await cookies()
  return cookieStore.get('cart_session_id')?.value ?? null
}

async function ensureSessionId(): Promise<string> {
  const cookieStore = await cookies()
  let sessionId = cookieStore.get('cart_session_id')?.value

  if (!sessionId) {
    sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(7)}`
    cookieStore.set('cart_session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    })
  }

  return sessionId
}

/**
 * Get current user's cart items with product details
 * Calculates prices server-side to prevent manipulation
 */
export const getCart = cache(async (): Promise<CartSummary> => {
  const supabase = await createClient()
  
  // Get user or session
  const { data: { user } } = await supabase.auth.getUser()
  const sessionId = user ? null : await getSessionId()
  
  // Build query
  let query = supabase
    .from('cart_items')
    .select('*, products(*)')
    .order('created_at', { ascending: false })
  
  if (user) {
    query = query.eq('user_id', user.id)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  }
  
  const { data: items, error } = await query
  
  if (error) {
    console.error('Error fetching cart:', error)
    return {
      items: [],
      subtotal: 0,
      discount: 0,
      total: 0,
      itemCount: 0,
    }
  }
  
  // Calculate prices server-side
  const cartItems: CartItemDisplay[] = (items || []).map(item => {
    const product = item.products
    const discountedPrice = Math.round(
      product.price * (100 - product.discount_percentage) / 100
    )
    const subtotal = discountedPrice * item.quantity
    
    return {
      ...item,
      discounted_price: discountedPrice,
      subtotal,
    }
  })
  
  const subtotal = cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  const originalTotal = cartItems.reduce((sum, item) => 
    sum + (item.products.price * item.quantity), 0
  )
  const discount = originalTotal - subtotal
  
  return {
    items: cartItems,
    subtotal,
    discount,
    total: subtotal,
    itemCount: cartItems.reduce((sum, item) => sum + item.quantity, 0),
  }
})

/**
 * Add item to cart or update quantity if exists
 * Server-side validation ensures prices cannot be manipulated
 */
export async function addToCart(
  productId: string,
  quantity: number = 1,
  variantId?: string
): Promise<{ success: boolean; error?: string }> {
  if (quantity < 1) {
    return { success: false, error: 'Quantity must be at least 1' }
  }
  
  const supabase = await createClient()
  
  // Verify product exists and is active
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('id, stock_quantity, is_active')
    .eq('id', productId)
    .single()
  
  if (productError || !product?.is_active) {
    return { success: false, error: 'Product not found or unavailable' }
  }

  // If variant is specified, check variant stock instead
  let stockToCheck = product.stock_quantity
  if (variantId) {
    const { data: variant, error: variantError } = await supabase
      .from('product_variants')
      .select('id, stock_quantity, is_active')
      .eq('id', variantId)
      .single()

    if (variantError || !variant?.is_active) {
      return { success: false, error: 'Variant not found or unavailable' }
    }
    stockToCheck = variant.stock_quantity
  }
  
  if (stockToCheck < quantity) {
    return { success: false, error: 'Not enough stock available' }
  }
  
  // Get user or session
  const { data: { user } } = await supabase.auth.getUser()
  const sessionId = user ? null : await ensureSessionId()
  
  // Check if item already in cart (with same variant)
  let existingQuery = supabase
    .from('cart_items')
    .select('*')
    .eq('product_id', productId)
  
  // Match variant_id (null or specific value)
  if (variantId) {
    existingQuery = existingQuery.eq('variant_id', variantId)
  } else {
    existingQuery = existingQuery.is('variant_id', null)
  }
  
  if (user) {
    existingQuery = existingQuery.eq('user_id', user.id)
  } else if (sessionId) {
    existingQuery = existingQuery.eq('session_id', sessionId)
  }
  
  const { data: existing } = await existingQuery.maybeSingle()
  
  if (existing) {
    // Update existing item
    const newQuantity = existing.quantity + quantity
    
    if (stockToCheck < newQuantity) {
      return { success: false, error: 'Not enough stock available' }
    }
    
    const { error: updateError } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', existing.id)
    
    if (updateError) {
      console.error('Error updating cart:', updateError)
      return { success: false, error: 'Failed to update cart' }
    }
  } else {
    // Insert new item
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert({
        product_id: productId,
        quantity,
        user_id: user?.id || null,
        session_id: sessionId,
      })
    
    if (insertError) {
      console.error('Error adding to cart:', insertError)
      return { success: false, error: 'Failed to add to cart' }
    }
  }
  
  return { success: true }
}

/**
 * Update cart item quantity
 */
export async function updateCartItemQuantity(
  cartItemId: string,
  quantity: number
): Promise<{ success: boolean; error?: string }> {
  if (quantity < 1) {
    return { success: false, error: 'Quantity must be at least 1' }
  }
  
  const supabase = await createClient()
  
  // Get cart item with product
  const { data: cartItem, error: fetchError } = await supabase
    .from('cart_items')
    .select('*, products(stock_quantity)')
    .eq('id', cartItemId)
    .single()
  
  if (fetchError || !cartItem) {
    return { success: false, error: 'Cart item not found' }
  }
  
  if (cartItem.products.stock_quantity < quantity) {
    return { success: false, error: 'Not enough stock available' }
  }
  
  const { error: updateError } = await supabase
    .from('cart_items')
    .update({ quantity })
    .eq('id', cartItemId)
  
  if (updateError) {
    console.error('Error updating quantity:', updateError)
    return { success: false, error: 'Failed to update quantity' }
  }
  
  return { success: true }
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  cartItemId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('cart_items')
    .delete()
    .eq('id', cartItemId)
  
  if (error) {
    console.error('Error removing from cart:', error)
    return { success: false, error: 'Failed to remove item' }
  }
  
  return { success: true }
}

/**
 * Clear entire cart
 */
export async function clearCart(): Promise<{ success: boolean; error?: string }> {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  const sessionId = user ? null : await getSessionId()

  if (!user && !sessionId) {
    return { success: true }
  }
  
  let query = supabase.from('cart_items').delete()
  
  if (user) {
    query = query.eq('user_id', user.id)
  } else if (sessionId) {
    query = query.eq('session_id', sessionId)
  }
  
  const { error } = await query
  
  if (error) {
    console.error('Error clearing cart:', error)
    return { success: false, error: 'Failed to clear cart' }
  }
  
  return { success: true }
}

/**
 * Merge guest cart with user cart on login
 */
export async function mergeGuestCart(userId: string): Promise<void> {
  const supabase = await createClient()
  const sessionId = await getSessionId()

  if (!sessionId) return
  
  // Get guest cart items
  const { data: guestItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('session_id', sessionId)

  if (!guestItems || guestItems.length === 0) return
  
  // Get user's existing cart items
  const { data: userItems } = await supabase
    .from('cart_items')
    .select('*')
    .eq('user_id', userId)
  
  for (const guestItem of guestItems) {
    const existingUserItem = userItems?.find(
      item => item.product_id === guestItem.product_id
    )
    
    if (existingUserItem) {
      // Merge quantities
      await supabase
        .from('cart_items')
        .update({
          quantity: existingUserItem.quantity + guestItem.quantity
        })
        .eq('id', existingUserItem.id)
      
      // Delete guest item
      await supabase
        .from('cart_items')
        .delete()
        .eq('id', guestItem.id)
    } else {
      // Transfer guest item to user
      await supabase
        .from('cart_items')
        .update({
          user_id: userId,
          session_id: null,
        })
        .eq('id', guestItem.id)
    }
  }
}

