import Razorpay from 'razorpay'
import crypto from 'node:crypto'

// Initialize Razorpay instance
// This should only be used on the server-side
export function getRazorpayInstance() {
  if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay credentials not configured')
  }

  return new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  })
}

/**
 * Create a Razorpay order
 * @param amount - Amount in paisa (smallest currency unit)
 * @param currency - Currency code (default: INR)
 * @param receipt - Unique receipt ID for the order
 * @param notes - Additional notes/metadata
 */
export async function createRazorpayOrder(
  amount: number,
  receipt: string,
  currency: string = 'INR',
  notes?: Record<string, string>
): Promise<
  | { success: true; orderId: string; amount: number; currency: string }
  | { success: false; error: string }
> {
  const razorpay = getRazorpayInstance()

  try {
    const order = await razorpay.orders.create({
      amount, // Amount in paisa
      currency,
      receipt,
      notes,
    })

    return {
      success: true,
      orderId: order.id,
      amount: typeof order.amount === 'string' ? parseInt(order.amount, 10) : order.amount,
      currency: order.currency,
    }
  } catch (error) {
    console.error('Error creating Razorpay order:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Verify Razorpay payment signature
 * This ensures the payment was actually made and not tampered with
 */
export function verifyRazorpaySignature(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  razorpaySignature: string
): boolean {
  if (!process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay key secret not configured')
  }

  try {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`
    const generated_signature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest('hex')

    return generated_signature === razorpaySignature
  } catch (error) {
    console.error('Error verifying Razorpay signature:', error)
    return false
  }
}

/**
 * Verify webhook signature from Razorpay
 * This ensures the webhook is authentic and from Razorpay
 */
export function verifyWebhookSignature(
  webhookBody: string,
  webhookSignature: string,
  webhookSecret: string
): boolean {
  try {
    const expectedSignature = crypto
      .createHmac('sha256', webhookSecret)
      .update(webhookBody)
      .digest('hex')

    return expectedSignature === webhookSignature
  } catch (error) {
    console.error('Error verifying webhook signature:', error)
    return false
  }
}

/**
 * Fetch payment details from Razorpay
 */
export async function fetchPaymentDetails(paymentId: string) {
  const razorpay = getRazorpayInstance()

  try {
    const payment = await razorpay.payments.fetch(paymentId)
    return {
      success: true,
      payment,
    }
  } catch (error) {
    console.error('Error fetching payment details:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Create a refund for a payment
 * @param paymentId - Razorpay payment ID
 * @param amount - Amount to refund in paisa (optional, full refund if not specified)
 * @param notes - Additional notes for the refund
 */
export async function createRefund(
  paymentId: string,
  amount?: number,
  notes?: Record<string, string>
) {
  const razorpay = getRazorpayInstance()

  try {
    const refund = await razorpay.payments.refund(paymentId, {
      amount,
      notes,
    })

    return {
      success: true,
      refundId: refund.id,
      amount: refund.amount,
      status: refund.status,
    }
  } catch (error) {
    console.error('Error creating refund:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

