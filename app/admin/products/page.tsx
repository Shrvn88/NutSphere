import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'
import DeleteProductForm from './delete-product-form'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin - Product Management | E-Commerce Store',
  description: 'Manage products and inventory',
}

export default async function AdminProductsPage() {
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

  // Check if admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/')
  }

  // Get products
  const { data: products } = await supabase
    .from('products')
    .select(
      `
      id,
      name,
      price,
      discount_percentage,
      stock_quantity,
      sku,
      is_active,
      categories (
        name
      )
    `
    )
    .order('created_at', { ascending: false })

  async function deleteProduct(formData: FormData) {
    'use server'
    try {
      const rawId = formData.get('productId')
      if (typeof rawId !== 'string' || !rawId) {
        throw new Error('Invalid product ID')
      }
      const productId = rawId

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

      const { data: { user } } = await actionSupabase.auth.getUser()
      if (!user) {
        throw new Error('Not authenticated')
      }

      const { data: actionProfile } = await actionSupabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (actionProfile?.role !== 'admin') {
        throw new Error('Not authorized')
      }

      const { error } = await actionSupabase.from('products').delete().eq('id', productId)
      
      if (error) {
        throw new Error(`Failed to delete product: ${error.message}`)
      }

      // Revalidate the products page to refresh the list
      revalidatePath('/admin/products')
    } catch (error) {
      console.error('Delete product error:', error)
      throw error
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin/dashboard"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <Link
              href="/admin/products/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              + Add Product
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    SKU
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {(products || []).map((product: any) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.sku || '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{product.price}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.stock_quantity < 10
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {product.stock_quantity} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.categories?.name || '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          product.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {product.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Edit
                      </Link>
                      <DeleteProductForm productId={product.id} deleteProduct={deleteProduct} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {(products || []).length === 0 && (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-500">No products found</p>
              <Link
                href="/admin/products/new"
                className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
              >
                Create your first product →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
