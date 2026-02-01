import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { sendOrderDeliveredEmail } from '@/lib/email/notifications'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    const { orderId } = await params
    const body = await request.json()

    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    // Get current user
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Validate status
    const validOrderStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']
    if (body.status && !validOrderStatuses.includes(body.status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 })
    }

    // Validate payment_status
    const validPaymentStatuses = ['pending', 'paid', 'failed', 'refunded']
    if (body.payment_status && !validPaymentStatuses.includes(body.payment_status)) {
      return NextResponse.json({ error: 'Invalid payment status' }, { status: 400 })
    }

    // Build update data
    const updateData: Record<string, any> = {
      updated_at: new Date().toISOString(),
    }

    if (body.status !== undefined) {
      updateData.status = body.status
    }

    if (body.payment_status !== undefined) {
      updateData.payment_status = body.payment_status
    }

    if (body.tracking_id !== undefined) {
      updateData.tracking_id = body.tracking_id
    }

    if (body.tracking_url !== undefined) {
      updateData.tracking_url = body.tracking_url
    }

    if (body.admin_notes !== undefined) {
      updateData.admin_notes = body.admin_notes
    }

    // Update order
    const { data: order, error } = await supabase
      .from('orders')
      .update(updateData)
      .eq('id', orderId)
      .select()
      .single()

    if (error) {
      console.error('Error updating order:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Send delivery confirmation email if order status changed to delivered
    if (body.status === 'delivered' && order) {
      sendOrderDeliveredEmail(
        order.customer_name,
        order.customer_email,
        order.order_number
      ).catch(error => {
        console.error('Failed to send delivery confirmation email:', error)
      })
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    console.error('Error in order update:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    )
  }
}
