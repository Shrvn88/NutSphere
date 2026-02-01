import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getUserOrders } from '@/lib/data/orders'
import { formatPrice } from '@/lib/utils/product'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'My Orders | E-Commerce Store',
  description: 'View your order history',
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth/login?redirect=/orders')
  }
  
  const orders = await getUserOrders()
  
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }
  
  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>
        
        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="text-6xl mb-4">📦</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
            <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
            <Link
              href="/products"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        {order.order_number}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.status)}`}>
                        {getStatusLabel(order.status)}
                      </span>
                    </div>
                    
                    <p className="text-sm text-gray-600">
                      Placed on {new Date(order.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatPrice(order.total_amount)}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      order.payment_status === 'paid' ? 'bg-green-500' :
                      order.payment_status === 'pending' ? 'bg-yellow-500' :
                      order.payment_status === 'failed' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`} />
                    <span className="text-sm text-gray-600">
                      Payment: {getStatusLabel(order.payment_status)}
                    </span>
                  </div>
                  
                  <span className="text-blue-600 font-medium text-sm">
                    View Details →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
