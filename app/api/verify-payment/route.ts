import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyRazorpaySignature } from '@/lib/razorpay'

/**
 * Verify Razorpay payment and update order status
 * This endpoint is called after successful payment on the frontend
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      order_id 
    } = body

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !order_id) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Verify signature
    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    )

    if (!isValid) {
      console.error('Invalid Razorpay signature', {
        razorpay_order_id,
        razorpay_payment_id,
      })
      
      // Update order as failed
      const adminSupabase = createAdminClient()
      await adminSupabase
        .from('orders')
        .update({ 
          payment_status: 'failed',
          updated_at: new Date().toISOString(),
        })
        .eq('id', order_id)

      return NextResponse.json(
        { success: false, error: 'Invalid payment signature' },
        { status: 400 }
      )
    }

    // Update order with payment details
    const adminSupabase = createAdminClient()
    const { data: order, error } = await adminSupabase
      .from('orders')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        payment_status: 'paid',
        status: 'confirmed',
        confirmed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', order_id)
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single()

    if (error || !order) {
      console.error('Error updating order:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to update order' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Payment verified successfully',
      order: {
        id: order.id,
        order_number: order.order_number,
        payment_status: order.payment_status,
        status: order.status,
      },
    })
  } catch (error) {
    console.error('Error in payment verification:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
