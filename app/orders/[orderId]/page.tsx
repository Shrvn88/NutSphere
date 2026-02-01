import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getOrder } from '@/lib/data/orders'
import { formatPrice } from '@/lib/utils/product'
import type { Metadata } from 'next'
import DownloadInvoiceButton from './download-invoice-button'

interface Props {
  params: Promise<{ orderId: string }>
}

export const metadata: Metadata = {
  title: 'Order Confirmation | E-Commerce Store',
  description: 'Your order has been placed successfully',
}

export default async function OrderConfirmationPage({ params }: Readonly<Props>) {
  const { orderId } = await params
  const order = await getOrder(orderId)
  
  if (!order) {
    redirect('/orders')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Message */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-4xl">✓</span>
            <div>
              <h1 className="text-2xl font-bold text-green-900">Order Placed Successfully!</h1>
              <p className="text-green-700">Thank you for your order</p>
            </div>
          </div>
        </div>
        
        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
            <DownloadInvoiceButton orderId={orderId} orderNumber={order.order_number} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Number</p>
              <p className="text-lg font-bold text-gray-900">{order.order_number}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Order Date</p>
              <p className="text-lg font-semibold text-gray-900">
                {new Date(order.created_at).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </p>
            </div>
            
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Amount</p>
              <p className="text-lg font-bold text-blue-600">{formatPrice(order.total_amount)}</p>
            </div>
          </div>

          {/* Order Tracking Info */}
          {(order.courier_name || order.tracking_id || order.tracking_url) && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="font-bold text-blue-900 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Shipment Tracking
              </h3>
              
              {order.courier_name && (
                <div className="mb-2">
                  <span className="text-sm text-blue-700 font-medium">Courier:</span>{' '}
                  <span className="text-blue-900">{order.courier_name}</span>
                </div>
              )}
              
              {order.tracking_id && (
                <div className="mb-2">
                  <span className="text-sm text-blue-700 font-medium">Tracking ID:</span>{' '}
                  <span className="text-blue-900 font-mono">{order.tracking_id}</span>
                </div>
              )}
              
              {order.tracking_url && (
                <a
                  href={order.tracking_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Track Your Order
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              )}
            </div>
          )}
          
          <div className="border-t pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="text-gray-700">
              <p className="font-semibold">{order.customer_name}</p>
              <p>{order.shipping_address_line1}</p>
              {order.shipping_address_line2 && <p>{order.shipping_address_line2}</p>}
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_postal_code}</p>
              <p>{order.shipping_country}</p>
              <p className="mt-2">{order.customer_phone}</p>
              <p>{order.customer_email}</p>
            </div>
          </div>
        </div>
        
        {/* Order Items */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.order_items.map((item: any) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b last:border-b-0">
                <img
                  src={item.product_image || '/placeholder-product.jpg'}
                  alt={item.product_name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div className="flex-1">
                  <Link
                    href={`/products/${item.product_slug}`}
                    className="font-semibold text-gray-900 hover:text-blue-600"
                  >
                    {item.product_name}
                  </Link>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-gray-600">Qty: {item.quantity}</span>
                    {item.discount_percentage > 0 && (
                      <span className="text-sm text-green-600 font-semibold">
                        {item.discount_percentage}% OFF
                      </span>
                    )}
                  </div>
                  <div className="mt-1">
                    <span className="font-bold text-gray-900">{formatPrice(item.line_total)}</span>
                    {item.discount_percentage > 0 && (
                      <span className="ml-2 text-sm text-gray-500 line-through">
                        {formatPrice(item.unit_price * item.quantity)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Price Breakdown */}
          <div className="mt-6 pt-6 border-t space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            
            {order.discount_amount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatPrice(order.discount_amount)}</span>
              </div>
            )}
            
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span>{order.shipping_cost === 0 ? 'FREE' : formatPrice(order.shipping_cost)}</span>
            </div>
            
            <div className="flex justify-between text-gray-600">
              <span>Tax (GST)</span>
              <span>{formatPrice(order.tax_amount)}</span>
            </div>
            
            <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
              <span>Total</span>
              <span>{formatPrice(order.total_amount)}</span>
            </div>
          </div>
        </div>
        
        {/* Payment Info */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-6">
          <h3 className="font-bold text-yellow-900 mb-2">Payment Method</h3>
          <p className="text-yellow-800">
            {order.payment_method === 'COD' ? 'Cash on Delivery' : order.payment_method}
          </p>
          {order.payment_method === 'COD' && (
            <p className="mt-2 text-sm text-yellow-700">
              Please keep exact change ready at the time of delivery.
            </p>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/orders"
            className="flex-1 text-center bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            View All Orders
          </Link>
          <Link
            href="/products"
            className="flex-1 text-center border-2 border-gray-300 text-gray-700 py-3 px-6 rounded-lg font-semibold hover:border-gray-400 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
