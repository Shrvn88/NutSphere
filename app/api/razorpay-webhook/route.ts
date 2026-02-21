import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { verifyWebhookSignature } from '@/lib/razorpay'

/**
 * Handle Razorpay webhooks
 * This endpoint receives payment status updates from Razorpay
 * Configure this URL in Razorpay Dashboard: Settings -> Webhooks
 * URL format: https://yourdomain.com/api/razorpay-webhook
 */
export async function POST(request: NextRequest) {
  try {
    // Get webhook secret from environment
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) {
      console.error('Razorpay webhook secret not configured')
      return NextResponse.json(
        { success: false, error: 'Webhook not configured' },
        { status: 500 }
      )
    }

    // Get signature from headers
    const signature = request.headers.get('x-razorpay-signature')
    if (!signature) {
      return NextResponse.json(
        { success: false, error: 'Missing signature' },
        { status: 400 }
      )
    }

    // Get raw body for signature verification
    const rawBody = await request.text()
    
    // Verify webhook signature
    const isValid = verifyWebhookSignature(rawBody, signature, webhookSecret)
    if (!isValid) {
      console.error('Invalid webhook signature')
      return NextResponse.json(
        { success: false, error: 'Invalid signature' },
        { status: 400 }
      )
    }

    // Parse the webhook payload
    const payload = JSON.parse(rawBody)
    const event = payload.event
    const paymentEntity = payload.payload?.payment?.entity

    console.log('Razorpay webhook received:', event)

    // Handle different webhook events
    const adminSupabase = createAdminClient()

    switch (event) {
      case 'payment.authorized':
      case 'payment.captured': {
        // Payment successful
        if (paymentEntity) {
          const { data: order } = await adminSupabase
            .from('orders')
            .update({
              razorpay_payment_id: paymentEntity.id,
              payment_status: 'paid',
              status: 'confirmed',
              confirmed_at: new Date().toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', paymentEntity.order_id)
            .select()
            .single()

          console.log('Payment successful, order updated:', order?.order_number)
        }
        break
      }

      case 'payment.failed': {
        // Payment failed
        if (paymentEntity) {
          await adminSupabase
            .from('orders')
            .update({
              payment_status: 'failed',
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_order_id', paymentEntity.order_id)

          console.log('Payment failed for order:', paymentEntity.order_id)
        }
        break
      }

      case 'refund.created':
      case 'refund.processed': {
        // Refund processed
        const refundEntity = payload.payload?.refund?.entity
        if (refundEntity) {
          await adminSupabase
            .from('orders')
            .update({
              payment_status: 'refunded',
              updated_at: new Date().toISOString(),
            })
            .eq('razorpay_payment_id', refundEntity.payment_id)

          console.log('Refund processed for payment:', refundEntity.payment_id)
        }
        break
      }

      default:
        console.log('Unhandled webhook event:', event)
    }

    return NextResponse.json({ success: true, received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}

