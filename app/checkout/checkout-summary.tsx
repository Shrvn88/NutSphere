'use client'

import { formatPrice } from '@/lib/utils/product'

interface CheckoutSummaryProps {
  items: any[]
  subtotal: number
  discount: number
  paymentMethod: 'online' | 'cod'
}

export default function CheckoutSummary({ items, subtotal, discount, paymentMethod }: CheckoutSummaryProps) {
  // Calculate delivery charges based on payment method  
  const deliveryCharge = paymentMethod === 'cod' ? 49 : 0 // ₹49 for COD, free for online
  const taxAmount = 0 // GST is included in product prices
  const totalAmount = subtotal + deliveryCharge
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
      <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
      
      {/* Items */}
      <div className="space-y-3 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <img
              src={item.products.images?.[0] || '/placeholder-product.jpg'}
              alt={item.products.name}
              className="w-16 h-16 object-cover rounded"
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{item.products.name}</p>
              <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatPrice(item.subtotal)}
              </p>
            </div>
          </div>
        ))}
      </div>
      
      {/* Price Breakdown */}
      <div className="border-t pt-4 space-y-2">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>{formatPrice(subtotal)}</span>
        </div>
        
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-{formatPrice(discount)}</span>
          </div>
        )}
        
        <div className="flex justify-between text-gray-600">
          <div className="flex items-center gap-1">
            <span>COD Fees</span>
            {paymentMethod === 'online' && (
              <span className="text-xs text-green-600 font-semibold">FREE</span>
            )}
          </div>
          <span className={deliveryCharge === 0 ? 'text-green-600 font-semibold' : ''}>
            {deliveryCharge === 0 ? 'FREE' : formatPrice(deliveryCharge)}
          </span>
        </div>
        
        <div className="flex justify-between text-gray-600">
          <span>GST</span>
          <span className="text-green-600 font-semibold">Included</span>
        </div>
        
        <div className="border-t pt-2 flex justify-between text-xl font-bold text-gray-900">
          <span>Total</span>
          <span>{formatPrice(totalAmount)}</span>
        </div>
      </div>
      
      {/* Free Delivery Banner */}
      {paymentMethod === 'cod' && (
        <div className="mt-4 p-3 bg-green-50 text-green-800 border border-green-200 rounded-lg text-sm">
          <strong>💡 Save ₹49!</strong> Use Online Payment to get FREE delivery
        </div>
      )}
      
      {paymentMethod === 'online' && (
        <div className="mt-4 p-3 bg-blue-50 text-blue-800 border border-blue-200 rounded-lg text-sm flex items-center gap-2">
          <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span><strong>You're saving ₹49</strong> with FREE delivery!</span>
        </div>
      )}
    </div>
  )
}

