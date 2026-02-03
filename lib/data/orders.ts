'use server'

import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { getCart, clearCart } from '@/lib/data/cart'
import { createRazorpayOrder, createRefund } from '@/lib/razorpay'
import { sendOrderConfirmationEmail } from '@/lib/email/notifications'
import type { Database } from '@/types/database.types'

type OrderInsert = Database['public']['Tables']['orders']['Insert']
type OrderItemInsert = Database['public']['Tables']['order_items']['Insert']

export interface CheckoutData {
  customerName: string
  customerEmail: string
  customerPhone: string
  shippingAddress: {
    line1: string
    line2?: string
    city: string
    state: string
    postalCode: string
    country: string
  }
  paymentMethod?: string
  notes?: string
}

/**
 * Create order from current cart
 * Uses admin client to bypass RLS for order creation
 */
export async function createOrder(checkoutData: CheckoutData): Promise<{
  success: boolean
  orderId?: string
  orderNumber?: string
  razorpayOrderId?: string
  amount?: number
  currency?: string
  error?: string
}> {
  const supabase = await createClient()
  const adminSupabase = createAdminClient()
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get cart items
  const cart = await getCart()
  
  if (cart.items.length === 0) {
    return { success: false, error: 'Cart is empty' }
  }
  
  // Validate stock availability for all items
  for (const item of cart.items) {
    const { data: product } = await adminSupabase
      .from('products')
      .select('stock_quantity, is_active')
      .eq('id', item.product_id)
      .single()
    
    if (!product?.is_active) {
      return { 
        success: false, 
        error: `Product ${item.products.name} is no longer available` 
      }
    }
    
    if (product.stock_quantity < item.quantity) {
      return { 
        success: false, 
        error: `Insufficient stock for ${item.products.name}. Only ${product.stock_quantity} available.` 
      }
    }
  }
  
  // Calculate totals (GST is included in product prices)
  const subtotal = cart.subtotal
  const discountAmount = cart.discount
  // COD: ₹49 delivery charge, Online: FREE delivery
  const shippingCost = checkoutData.paymentMethod === 'cod' ? 49 : 0
  const taxAmount = 0 // GST is included in product prices
  const totalAmount = subtotal + shippingCost
  
  // Generate order number
  const { data: orderNumberResult } = await adminSupabase
    .rpc('generate_order_number')
  
  if (!orderNumberResult) {
    return { success: false, error: 'Failed to generate order number' }
  }

  // Create Razorpay order only for online payments
  let razorpayOrderId: string | null = null
  
  if (checkoutData.paymentMethod === 'razorpay') {
    const razorpayResult = await createRazorpayOrder(
      Math.round(totalAmount * 100), // Convert rupees to paisa for Razorpay
      orderNumberResult,
      'INR',
      {
        customer_name: checkoutData.customerName,
        customer_email: checkoutData.customerEmail,
      }
    )

    if (!razorpayResult.success) {
      return { 
        success: false, 
        error: razorpayResult.error || 'Failed to create Razorpay order' 
      }
    }
    
    razorpayOrderId = razorpayResult.orderId
  }
  
  // Create order data
  const orderData: OrderInsert = {
    order_number: orderNumberResult,
    razorpay_order_id: razorpayOrderId,
    user_id: user?.id || null,
    customer_name: checkoutData.customerName,
    customer_email: checkoutData.customerEmail,
    customer_phone: checkoutData.customerPhone,
    shipping_address_line1: checkoutData.shippingAddress.line1,
    shipping_address_line2: checkoutData.shippingAddress.line2 || null,
    shipping_city: checkoutData.shippingAddress.city,
    shipping_state: checkoutData.shippingAddress.state,
    shipping_postal_code: checkoutData.shippingAddress.postalCode,
    shipping_country: checkoutData.shippingAddress.country,
    subtotal,
    discount_amount: discountAmount,
    shipping_cost: shippingCost,
    tax_amount: taxAmount,
    total_amount: totalAmount,
    payment_method: checkoutData.paymentMethod || null,
    customer_notes: checkoutData.notes || null,
    status: 'pending',
    payment_status: 'pending',
  }
  
  // Use admin client to create order (bypasses RLS)
  const { data: order, error: orderError } = await adminSupabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()
  
  if (orderError || !order) {
    console.error('Error creating order:', orderError)
    return { success: false, error: 'Failed to create order' }
  }
  
  // Create order items
  const orderItems: OrderItemInsert[] = cart.items.map(item => ({
    order_id: order.id,
    product_id: item.product_id,
    product_name: item.products.name,
    product_slug: item.products.slug,
    product_image: item.products.images?.[0] || null,
    unit_price: item.products.price,
    discount_percentage: item.products.discount_percentage,
    discounted_price: item.discounted_price,
    quantity: item.quantity,
    line_total: item.subtotal,
  }))
  
  const { error: itemsError } = await adminSupabase
    .from('order_items')
    .insert(orderItems)
  
  if (itemsError) {
    console.error('Error creating order items:', itemsError)
    // Rollback: delete the order
    await adminSupabase.from('orders').delete().eq('id', order.id)
    return { success: false, error: 'Failed to create order items' }
  }
  
  // Update product stock
  for (const item of cart.items) {
    const { error: stockError } = await adminSupabase
      .from('products')
      .update({ 
        stock_quantity: item.products.stock_quantity - item.quantity 
      })
      .eq('id', item.product_id)
    
    if (stockError) {
      console.error('Error updating stock:', stockError)
      // Continue anyway - stock can be adjusted manually
    }
  }
  
  // Clear cart
  await clearCart()
  
  // Send order confirmation email (don't block on email failure)
  sendOrderConfirmationEmail({
    customerName: checkoutData.customerName,
    customerEmail: checkoutData.customerEmail,
    orderNumber: order.order_number,
    orderDate: new Date(order.created_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }),
    totalAmount: totalAmount,
    items: orderItems.map(item => ({
      name: item.product_name,
      quantity: item.quantity,
      price: item.line_total,
    })),
    shippingAddress: {
      line1: checkoutData.shippingAddress.line1,
      line2: checkoutData.shippingAddress.line2,
      city: checkoutData.shippingAddress.city,
      state: checkoutData.shippingAddress.state,
      postalCode: checkoutData.shippingAddress.postalCode,
      country: checkoutData.shippingAddress.country,
    },
  }).catch(error => {
    // Log error but don't fail the order
    console.error('Failed to send confirmation email:', error)
  })
  
  return {
    success: true,
    orderId: order.id,
    orderNumber: order.order_number,
    razorpayOrderId: razorpayOrderId || undefined,
    amount: totalAmount,
    currency: 'INR',
  }
}

/**
 * Get order details by ID
 */
export async function getOrder(orderId: string) {
  const supabase = await createClient()
  
  const { data: order, error } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', orderId)
    .single()
  
  if (error) {
    console.error('Error fetching order:', error)
    return null
  }
  
  return order
}

/**
 * Get user's order history
 */
export async function getUserOrders() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return []
  }
  
  const { data: orders, error } = await supabase
    .from('orders')
    .select('id, order_number, created_at, total_amount, status, payment_status')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  
  if (error) {
    console.error('Error fetching orders:', error)
    return []
  }
  
  return orders || []
}

/**
 * Process refund for an order
 * Admin-only function to refund a paid order
 */
export async function refundOrder(orderId: string, reason?: string): Promise<{
  success: boolean
  refundId?: string
  error?: string
}> {
  const adminSupabase = createAdminClient()
  
  // Get order details
  const { data: order, error: orderError } = await adminSupabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()
  
  if (orderError || !order) {
    return { success: false, error: 'Order not found' }
  }
  
  // Check if already refunded
  if (order.payment_status === 'refunded') {
    return { success: false, error: 'Order is already refunded' }
  }
  
  // Check if order is paid
  if (order.payment_status !== 'paid') {
    return { success: false, error: 'Order is not paid or payment is pending' }
  }
  
  // Check if payment ID exists
  if (!order.razorpay_payment_id) {
    return { success: false, error: 'No payment ID found for this order' }
  }
  
  // Create refund via Razorpay
  const refundResult = await createRefund(
    order.razorpay_payment_id,
    undefined, // Full refund
    { reason: reason || 'Order cancelled', order_id: orderId }
  )
  
  if (!refundResult.success) {
    return { 
      success: false, 
      error: refundResult.error || 'Failed to create refund' 
    }
  }
  
  // Update order status
  const { error: updateError } = await adminSupabase
    .from('orders')
    .update({
      payment_status: 'refunded',
      status: 'cancelled',
      updated_at: new Date().toISOString(),
      admin_notes: `Refunded: ${reason || 'Order cancelled'}. Refund ID: ${refundResult.refundId}`,
    })
    .eq('id', orderId)
  
  if (updateError) {
    console.error('Error updating order after refund:', updateError)
    return { 
      success: false, 
      error: 'Refund created but failed to update order status' 
    }
  }
  
  // Restore stock
  const { data: orderItems } = await adminSupabase
    .from('order_items')
    .select('product_id, quantity')
    .eq('order_id', orderId)
  
  if (orderItems) {
    for (const item of orderItems) {
      await adminSupabase.rpc('increment_stock', {
        product_id: item.product_id,
        amount: item.quantity,
      })
    }
  }
  
  return {
    success: true,
    refundId: refundResult.refundId,
  }
}

/**
 * Update order tracking information and send email notification
 * Admin-only function to add tracking details to an order
 */
export async function updateOrderTracking(
  orderId: string,
  courierName: string,
  trackingId: string,
  trackingUrl?: string
): Promise<{
  success: boolean
  error?: string
}> {
  const adminSupabase = createAdminClient()
  
  // Get order details
  const { data: order, error: orderError } = await adminSupabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single()
  
  if (orderError || !order) {
    return { success: false, error: 'Order not found' }
  }
  
  // Update order with tracking info and status to shipped
  const { error: updateError } = await adminSupabase
    .from('orders')
    .update({
      courier_name: courierName,
      tracking_id: trackingId,
      tracking_url: trackingUrl || null,
      status: 'shipped',
      updated_at: new Date().toISOString(),
    })
    .eq('id', orderId)
  
  if (updateError) {
    console.error('Error updating order tracking:', updateError)
    return { success: false, error: 'Failed to update tracking information' }
  }
  
  // Send shipment email notification (don't block on email failure)
  const { sendOrderShippedEmail } = await import('@/lib/email/notifications')
  sendOrderShippedEmail({
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    orderNumber: order.order_number,
    courierName,
    trackingId,
    trackingUrl,
  }).catch(error => {
    console.error('Failed to send shipment email:', error)
  })
  
  return { success: true }
}
