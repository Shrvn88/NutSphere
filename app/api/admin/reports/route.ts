import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
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
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    return NextResponse.json(
      { error: 'Access denied. Admin role required' },
      { status: 403 }
    )
  }

  const url = new URL(request.url)
  const days = parseInt(url.searchParams.get('days') || '30')

  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  try {
    // Get total revenue and order count
    const { data: orders } = await supabase
      .from('orders')
      .select('id, total_amount, created_at')
      .gte('created_at', startDate.toISOString())
      .eq('payment_status', 'paid')

    const totalRevenue =
      orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0
    const totalOrders = orders?.length || 0

    // Get daily sales data
    const salesDataMap = new Map<string, { revenue: number; orders: number }>()

    orders?.forEach((order) => {
      const date = new Date(order.created_at)
        .toISOString()
        .split('T')[0]

      if (!salesDataMap.has(date)) {
        salesDataMap.set(date, { revenue: 0, orders: 0 })
      }

      const dayData = salesDataMap.get(date)!
      dayData.revenue += order.total_amount
      dayData.orders += 1
    })

    const salesData = Array.from(salesDataMap.entries())
      .map(([date, data]) => ({
        date,
        ...data,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

    // Get order IDs for the time range
    const orderIds = orders?.map(o => o.id) || []

    // Get top products by revenue (only from orders in the time range)
    // Note: product_name is stored directly in order_items as a snapshot
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select('quantity, unit_price, product_name')
      .in('order_id', orderIds.length > 0 ? orderIds : ['00000000-0000-0000-0000-000000000000'])

    console.log('Order items query result:', orderItems?.length, 'items, error:', itemsError)

    const productMap = new Map<
      string,
      { name: string; sold: number; revenue: number }
    >()

    orderItems?.forEach((item: any) => {
      const productName = item.product_name
      
      // Skip items without product name
      if (!productName) {
        console.log('Skipping item without product name:', item)
        return
      }

      if (!productMap.has(productName)) {
        productMap.set(productName, { name: productName, sold: 0, revenue: 0 })
      }

      const productData = productMap.get(productName)!
      productData.sold += item.quantity || 0
      productData.revenue += (item.unit_price || 0) * (item.quantity || 0)
    })

    const topProducts = Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10)

    // Get most ordered product (by quantity)
    const mostOrderedProduct = Array.from(productMap.values())
      .sort((a, b) => b.sold - a.sold)[0] || null

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      salesData,
      topProducts,
      mostOrderedProduct,
    })
  } catch (error) {
    console.error('Reports error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch report data' },
      { status: 500 }
    )
  }
}

