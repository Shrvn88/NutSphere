import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import OrderUpdateForm from './order-update-form'
import InvoiceDownloadButton from './invoice-download-button'

export const metadata: Metadata = {
  title: 'Admin - Order Details | E-Commerce Store',
  description: 'View and manage order details',
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ orderId: string }>
}) {
  const { orderId } = await params
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

  // Get order details
  const { data: order } = await supabase
    .from('orders')
    .select(
      `
      id,
      order_number,
      user_id,
      total_amount,
      subtotal,
      payment_status,
      payment_method,
      status,
      tracking_id,
      tracking_url,
      admin_notes,
      created_at,
      updated_at,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address_line1,
      shipping_address_line2,
      shipping_city,
      shipping_state,
      shipping_postal_code,
      shipping_country,
      order_items (
        id,
        quantity,
        unit_price,
        product_name,
        products (
          id,
          name,
          slug,
          images
        )
      )
    `
    )
    .eq('id', orderId)
    .single()

  if (!order) {
    redirect('/admin/orders-list')
  }

  // Customer info is now directly on the order
  const customer = {
    full_name: order.customer_name,
    email: order.customer_email,
    phone_number: order.customer_phone,
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
      processing: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      shipped: 'bg-purple-100 text-purple-800 border-purple-200',
      delivered: 'bg-green-100 text-green-800 border-green-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      paid: 'bg-green-100 text-green-800 border-green-200',
      failed: 'bg-red-100 text-red-800 border-red-200',
      refunded: 'bg-purple-100 text-purple-800 border-purple-200',
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-4 mb-2">
                <Link
                  href="/admin/dashboard"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Dashboard
                </Link>
                <span className="text-gray-400">/</span>
                <Link
                  href="/admin/orders-list"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Orders
                </Link>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{order.order_number}</h1>
              <p className="text-gray-600 mt-1">Placed on {formatDate(order.created_at)}</p>
            </div>
            <div className="flex items-center gap-3">
              <InvoiceDownloadButton orderId={orderId} orderNumber={order.order_number} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Status Overview */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-gray-600 mb-2">Order Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-gray-600 mb-2">Payment Status</p>
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border ${getPaymentStatusColor(order.payment_status)}`}>
                    {order.payment_status.charAt(0).toUpperCase() + order.payment_status.slice(1)}
                  </span>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm text-gray-600 mb-2">Payment Method</p>
                  <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-gray-100 text-gray-800 border border-gray-200">
                    {order.payment_method === 'cod' ? 'Cash on Delivery' : order.payment_method === 'razorpay' ? 'Online Payment' : order.payment_method || 'N/A'}
                  </span>
                </div>
              </div>
              
              {/* Tracking Info Display */}
              {order.tracking_id && (
                <div className="mt-6 pt-6 border-t">
                  <p className="text-sm text-gray-600 mb-2">Tracking Information</p>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-lg font-semibold text-gray-900">{order.tracking_id}</span>
                    {order.tracking_url && (
                      <a
                        href={order.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Track Package →
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b">
                <h2 className="text-xl font-bold text-gray-900">Order Items ({order.order_items?.length || 0})</h2>
              </div>
              <div className="divide-y">
                {order.order_items?.map((item: any) => (
                  <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      {item.products?.images?.[0] ? (
                        <img
                          src={item.products.images[0]}
                          alt={item.products?.name || item.product_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <Link
                        href={`/products/${item.products?.slug || '#'}`}
                        className="font-medium text-gray-900 hover:text-blue-600"
                      >
                        {item.products?.name || item.product_name}
                      </Link>
                      <p className="text-sm text-gray-600 mt-1">
                        ₹{item.unit_price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.quantity * item.unit_price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-6 py-4 bg-gray-50 border-t">
                <div className="flex justify-between items-center text-lg font-bold text-gray-900">
                  <span>Total Amount</span>
                  <span>₹{order.total_amount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Shipping & Billing Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Shipping Address</h3>
                </div>
                <div className="text-sm text-gray-700 space-y-1">
                  <p className="font-medium text-gray-900">{order.customer_name}</p>
                  <p>{order.customer_phone}</p>
                  <p>{order.shipping_address_line1}</p>
                  {order.shipping_address_line2 && (
                    <p>{order.shipping_address_line2}</p>
                  )}
                  <p>
                    {order.shipping_city}, {order.shipping_state}{' '}
                    {order.shipping_postal_code}
                  </p>
                  <p>{order.shipping_country}</p>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                  <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <h3 className="font-bold text-gray-900">Contact Information</h3>
                </div>
                <div className="text-sm text-gray-700 space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                    <a href={`mailto:${order.customer_email}`} className="text-blue-600 hover:text-blue-800">
                      {order.customer_email}
                    </a>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                    <a href={`tel:${order.customer_phone}`} className="text-blue-600 hover:text-blue-800">
                      {order.customer_phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h3 className="font-bold text-gray-900">Customer Details</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Name</p>
                  <p className="font-medium text-gray-900">{customer?.full_name || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                  <a href={`mailto:${customer?.email}`} className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {customer?.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                  {customer?.phone_number ? (
                    <a href={`tel:${customer.phone_number}`} className="text-blue-600 hover:text-blue-800 font-medium">
                      {customer.phone_number}
                    </a>
                  ) : (
                    <p className="text-gray-500">Not provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Update Order Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <h3 className="font-bold text-gray-900">Update Order</h3>
              </div>
              <OrderUpdateForm
                orderId={orderId}
                currentOrderStatus={order.status}
                currentPaymentStatus={order.payment_status}
                currentTrackingId={order.tracking_id || ''}
                currentTrackingUrl={order.tracking_url || ''}
                currentAdminNotes={order.admin_notes || ''}
              />
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center gap-2 mb-4">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="font-bold text-gray-900">Timeline</h3>
              </div>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <div className="w-0.5 h-full bg-gray-200"></div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Order Created</p>
                    <p className="text-xs text-gray-500">{formatDate(order.created_at)}</p>
                  </div>
                </div>
                {order.updated_at && order.updated_at !== order.created_at && (
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Last Updated</p>
                      <p className="text-xs text-gray-500">{formatDate(order.updated_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
