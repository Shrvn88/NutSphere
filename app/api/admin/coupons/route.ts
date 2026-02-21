import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Get all coupons (admin)
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

    const { data: coupons, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(coupons)
  } catch (error) {
    console.error('GET /api/admin/coupons error:', error)
    return Response.json(
      { error: 'Failed to fetch coupons' },
      { status: 500 }
    )
  }
}

// Create new coupon (admin)
export async function POST(request: Request) {
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

    const {
      code,
      description,
      discountType,
      discountValue,
      minOrderAmount,
      maxUses,
      validFrom,
      validUntil,
    } = await request.json()

    const { data: coupon, error } = await supabase
      .from('coupons')
      .insert({
        code: code.toUpperCase(),
        description,
        discount_type: discountType,
        discount_value: Number.parseFloat(discountValue),
        min_order_amount: Number.parseFloat(minOrderAmount) || 0,
        max_uses: maxUses || null,
        valid_from: validFrom,
        valid_until: validUntil,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return Response.json(coupon, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/coupons error:', error)
    return Response.json(
      { error: 'Failed to create coupon' },
      { status: 500 }
    )
  }
}

