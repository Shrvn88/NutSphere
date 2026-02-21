import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Admin only - Get dashboard analytics
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

    // Get analytics data
    const { data: orders } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at')

    const { data: products } = await supabase
      .from('products')
      .select('id, stock_quantity, price')

    const { data: users } = await supabase
      .from('profiles')
      .select('id')

    // Calculate metrics
    const totalRevenue = (orders || []).reduce(
      (sum, order) => sum + (order.total_amount || 0),
      0
    )

    const totalOrders = (orders || []).length
    const totalProducts = (products || []).length
    const totalUsers = (users || []).length
    const lowStockProducts = (products || []).filter(
      (p) => p.stock_quantity < 10
    ).length

    // Recent orders
    const recentOrders = (orders || [])
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5)

    return Response.json({
      metrics: {
        totalRevenue,
        totalOrders,
        totalProducts,
        totalUsers,
        lowStockProducts,
      },
      recentOrders,
    })
  } catch (error) {
    console.error('GET /api/admin/analytics error:', error)
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

