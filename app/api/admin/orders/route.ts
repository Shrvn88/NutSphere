import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Get all orders (admin)
export async function GET(request: Request) {
  try {
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return Response.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { data: orders, error } = await supabase
      .from('orders')
      .select(
        `
        id,
        order_number,
        user_id,
        total_amount,
        status,
        payment_status,
        created_at,
        profiles:user_id (
          full_name,
          email:user_id (
            email
          )
        )
      `
      )
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(orders)
  } catch (error) {
    console.error('GET /api/admin/orders error:', error)
    return Response.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// Update order status (admin)
export async function PUT(request: Request) {
  try {
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

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return Response.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Check if admin
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profile?.role !== 'admin') {
      return Response.json({ error: 'Not authorized' }, { status: 403 })
    }

    const { orderId, status } = await request.json()

    const { data: updatedOrder, error } = await supabase
      .from('orders')
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq('id', orderId)
      .select()
      .single()

    if (error) throw error

    return Response.json(updatedOrder)
  } catch (error) {
    console.error('PUT /api/admin/orders error:', error)
    return Response.json(
      { error: 'Failed to update order' },
      { status: 500 }
    )
  }
}

