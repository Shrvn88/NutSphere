import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Get all CMS pages (admin)
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

    const { data: pages, error } = await supabase
      .from('cms_pages')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return Response.json(pages)
  } catch (error) {
    console.error('GET /api/admin/pages error:', error)
    return Response.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    )
  }
}

// Create new page (admin)
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
      slug,
      title,
      content,
      description,
      metaDescription,
      metaKeywords,
      isPublished,
    } = await request.json()

    const { data: page, error } = await supabase
      .from('cms_pages')
      .insert({
        slug: slug.toLowerCase().trim().split(/\s+/).join('-'),
        title,
        content,
        description,
        meta_description: metaDescription,
        meta_keywords: metaKeywords,
        is_published: isPublished ?? true,
        created_by: user.id,
      })
      .select()
      .single()

    if (error) throw error

    return Response.json(page, { status: 201 })
  } catch (error) {
    console.error('POST /api/admin/pages error:', error)
    return Response.json(
      { error: 'Failed to create page' },
      { status: 500 }
    )
  }
}
