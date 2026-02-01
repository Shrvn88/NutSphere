import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import ProductForm from '../../product-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Edit Product | E-Commerce Store',
  description: 'Edit product details',
}

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ productId: string }>
}) {
  const { productId } = await params
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
    redirect('/auth/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Only show main categories: Nuts and Seeds
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .in('slug', ['nuts', 'seeds'])
    .order('name', { ascending: true })

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .single()

  if (!product) {
    redirect('/admin/products')
  }

  // Fetch existing variants for this product
  const { data: existingVariants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .order('display_order', { ascending: true })

  // Map database variants to Variant interface for the form
  const formVariants = (existingVariants || []).map(v => ({
    id: v.id,
    name: v.name,
    weight_grams: v.weight_grams || 0,
    price: v.price,
    compare_at_price: v.compare_at_price || undefined,
    sku: v.sku || undefined,
    stock_quantity: v.stock_quantity,
    is_default: v.is_default,
    is_active: v.is_active,
    display_order: v.display_order,
  }))

  async function updateProduct(formData: FormData) {
    'use server'
    try {
      const name = ((formData.get('name') as string) ?? '').trim()
      const categoryId = ((formData.get('category_id') as string) ?? '')
      const price = Number(formData.get('price') || 0)
      const discount = Number(formData.get('discount_percentage') || 0)
      const stock = Number(formData.get('stock_quantity') || 0)
      const weight = formData.get('weight_grams')
        ? Number(formData.get('weight_grams'))
        : null
      const sku = ((formData.get('sku') as string) ?? '').trim()
      const description = ((formData.get('description') as string) ?? '').trim()
      const isActive = formData.get('is_active') === 'on'
      const imagesRaw = ((formData.get('images') as string) ?? '').trim()
      const images = imagesRaw
        ? imagesRaw.split(',').map((img) => img.trim()).filter(Boolean)
        : []
      
      // Parse variants
      const variantsRaw = formData.get('variants') as string
      let variants: any[] = []
      if (variantsRaw) {
        try {
          variants = JSON.parse(variantsRaw)
        } catch (e) {
          console.error('Failed to parse variants:', e)
        }
      }

      // Validation
      if (!name || !categoryId || !price) {
        throw new Error('Product name, category, and price are required')
      }

      if (price <= 0) {
        throw new Error('Price must be greater than 0')
      }

      if (discount < 0 || discount > 100) {
        throw new Error('Discount must be between 0 and 100')
      }

      if (stock < 0) {
        throw new Error('Stock quantity cannot be negative')
      }

      const slug = name
        .toLowerCase()
        .trim()
        .split(/\s+/)
        .join('-')

      const actionCookieStore = await cookies()
      const actionSupabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          cookies: {
            getAll() {
              return actionCookieStore.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                actionCookieStore.set(name, value, options)
              )
            },
          },
        }
      )

      const { data: { user: actionUser } } = await actionSupabase.auth.getUser()
      if (!actionUser) {
        throw new Error('Not authenticated')
      }

      const { data: actionProfile } = await actionSupabase
        .from('profiles')
        .select('role')
        .eq('id', actionUser.id)
        .single()

      if (actionProfile?.role !== 'admin') {
        throw new Error('Not authorized')
      }

      const { error } = await actionSupabase
        .from('products')
        .update({
          name,
          slug,
          category_id: categoryId,
          price,
          discount_percentage: discount,
          stock_quantity: stock,
          weight_grams: weight,
          is_active: isActive,
          description: description || null,
          images,
          sku: sku || null,
        } as any)
        .eq('id', productId)

      if (error) {
        throw new Error(`Failed to update product: ${error.message}`)
      }

      // Handle variants - delete existing and insert new ones
      // First delete existing variants
      await actionSupabase
        .from('product_variants')
        .delete()
        .eq('product_id', productId)

      // Insert new variants if any
      if (variants.length > 0) {
        const variantsToInsert = variants.map((v: any, index: number) => ({
          product_id: productId,
          name: v.name,
          weight_grams: v.weight_grams || null,
          price: v.price,
          compare_at_price: v.compare_at_price || null,
          sku: v.sku || null,
          stock_quantity: v.stock_quantity || 0,
          is_default: v.is_default || false,
          is_active: v.is_active !== false,
          display_order: index,
        }))

        const { error: variantsError } = await actionSupabase
          .from('product_variants')
          .insert(variantsToInsert)

        if (variantsError) {
          console.error('Failed to update variants:', variantsError)
          throw new Error(`Failed to update variants: ${variantsError.message}`)
        }
      }

      // Revalidate both the products list and the product detail pages
      revalidatePath('/admin/products')
      revalidatePath(`/products/${product.slug}`)
      redirect('/admin/products')
    } catch (error) {
      console.error('Update product error:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 mb-2">
            <Link
              href="/admin/dashboard"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              ← Dashboard
            </Link>
            <span className="text-gray-400">/</span>
            <Link
              href="/admin/products"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              Products
            </Link>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProductForm 
          product={product} 
          categories={categories || []} 
          variants={formVariants}
          onSubmit={updateProduct} 
          isEdit 
        />
      </div>
    </div>
  )
}
