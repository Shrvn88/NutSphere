'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createOrder } from '@/lib/data/orders'
import type { User } from '@supabase/supabase-js'

// Razorpay types
declare global {
  interface Window {
    Razorpay: any
  }
}

interface CheckoutFormProps {
  user: User | null
  savedAddresses: any[]
  onPaymentMethodChange?: (method: 'online' | 'cod') => void
}

export default function CheckoutForm({ user, savedAddresses, onPaymentMethodChange }: Readonly<CheckoutFormProps>) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [useExistingAddress, setUseExistingAddress] = useState(savedAddresses.length > 0)
  const [selectedAddressId, setSelectedAddressId] = useState(
    savedAddresses.find(a => a.is_default)?.id || savedAddresses[0]?.id || ''
  )
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online')

  // Notify parent when payment method changes
  const handlePaymentMethodChange = (method: 'online' | 'cod') => {
    setPaymentMethod(method)
    if (onPaymentMethodChange) {
      onPaymentMethodChange(method)
    }
  }

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      script.remove()
    }
  }, [])
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    let checkoutData
    
    if (useExistingAddress && selectedAddressId) {
      const address = savedAddresses.find(a => a.id === selectedAddressId)
      if (!address) {
        setError('Selected address not found')
        setLoading(false)
        return
      }
      
      checkoutData = {
        customerName: address.full_name,
        customerEmail: user?.email || formData.get('email') as string,
        customerPhone: address.phone,
        shippingAddress: {
          line1: address.address_line1,
          line2: address.address_line2 || undefined,
          city: address.city,
          state: address.state,
          postalCode: address.postal_code,
          country: address.country,
        },
        paymentMethod: paymentMethod === 'online' ? 'razorpay' : 'cod',
        notes: formData.get('notes') as string || undefined,
      }
    } else {
      checkoutData = {
        customerName: formData.get('name') as string,
        customerEmail: formData.get('email') as string,
        customerPhone: formData.get('phone') as string,
        shippingAddress: {
          line1: formData.get('address1') as string,
          line2: formData.get('address2') as string || undefined,
          city: formData.get('city') as string,
          state: formData.get('state') as string,
          postalCode: formData.get('postalCode') as string,
          country: formData.get('country') as string || 'India',
        },
        paymentMethod: paymentMethod === 'online' ? 'razorpay' : 'cod',
        notes: formData.get('notes') as string || undefined,
      }
    }
    
    // Create order on backend first
    const result = await createOrder(checkoutData)
    
    if (!result.success) {
      setError(result.error || 'Failed to create order')
      setLoading(false)
      return
    }

    // If COD, redirect directly to order page
    if (paymentMethod === 'cod') {
      router.push(`/orders/${result.orderId}`)
      router.refresh()
      return
    }
    
    if (!result.success) {
      setError(result.error || 'Failed to create order')
      setLoading(false)
      return
    }

    // Open Razorpay payment modal
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: result.amount,
      currency: result.currency || 'INR',
      name: 'E-Commerce Store',
      description: `Order ${result.orderNumber}`,
      order_id: result.razorpayOrderId,
      prefill: {
        name: checkoutData.customerName,
        email: checkoutData.customerEmail,
        contact: checkoutData.customerPhone,
      },
      theme: {
        color: '#3b82f6',
      },
      handler: async function (response: any) {
        // Payment successful, verify on backend
        try {
          const verifyResponse = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              order_id: result.orderId,
            }),
          })

          const verifyData = await verifyResponse.json()

          if (verifyData.success) {
            // Redirect to order confirmation and refresh to clear cart
            router.push(`/orders/${result.orderId}`)
            router.refresh()
          } else {
            setError('Payment verification failed. Please contact support.')
            setLoading(false)
          }
        } catch (error) {
          console.error('Error verifying payment:', error)
          setError('Payment verification failed. Please contact support.')
          setLoading(false)
        }
      },
      modal: {
        ondismiss: function () {
          setError('Payment cancelled. Your order has been created but not paid.')
          setLoading(false)
        },
      },
    }

    if (typeof globalThis.window !== 'undefined' && globalThis.window.Razorpay) {
      const razorpay = new globalThis.window.Razorpay(options)
      razorpay.on('payment.failed', function (response: any) {
        setError(`Payment failed: ${response.error.description}`)
        setLoading(false)
      })
      razorpay.open()
    } else {
      setError('Payment gateway not loaded. Please refresh and try again.')
      setLoading(false)
    }
  }
  
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-800 border border-red-200 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Saved Addresses */}
      {savedAddresses.length > 0 && (
        <div>
          <label className="flex items-center gap-2 mb-4">
            <input
              type="checkbox"
              checked={useExistingAddress}
              onChange={(e) => setUseExistingAddress(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="font-medium text-gray-900">Use saved address</span>
          </label>
          
          {useExistingAddress && (
            <div className="space-y-2">
              {savedAddresses.map((address) => (
                <label
                  key={address.id}
                  className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                    selectedAddressId === address.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="savedAddress"
                    value={address.id}
                    checked={selectedAddressId === address.id}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="mr-3"
                  />
                  <div className="inline-block">
                    <p className="font-semibold text-gray-900">{address.full_name}</p>
                    <p className="text-sm text-gray-600">
                      {address.address_line1}
                      {address.address_line2 && `, ${address.address_line2}`}
                    </p>
                    <p className="text-sm text-gray-600">
                      {address.city}, {address.state} {address.postal_code}
                    </p>
                    <p className="text-sm text-gray-600">{address.phone}</p>
                    {address.is_default && (
                      <span className="inline-block mt-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded">
                        Default
                      </span>
                    )}
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* New Address Form */}
      {(!useExistingAddress || savedAddresses.length === 0) && (
        <>
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  defaultValue={user?.user_metadata?.full_name || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  defaultValue={user?.email || ''}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div className="md:col-span-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  pattern="[0-9]{10}"
                  placeholder="10 digit mobile number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">Shipping Address</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 1 *
                </label>
                <input
                  type="text"
                  id="address1"
                  name="address1"
                  required
                  placeholder="House/Flat No, Street"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div>
                <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-2">
                  Address Line 2
                </label>
                <input
                  type="text"
                  id="address2"
                  name="address2"
                  placeholder="Landmark, Area"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
                
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    id="state"
                    name="state"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
                
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    required
                    pattern="[0-9]{6}"
                    placeholder="6 digit PIN"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
                
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                    Country *
                  </label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    defaultValue="India"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      
      {/* Payment Method */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h2>
        
        {/* Online Payment Option */}
        <label
          className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors mb-3 ${
            paymentMethod === 'online'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="online"
            checked={paymentMethod === 'online'}
            onChange={(e) => handlePaymentMethodChange('online')}
            className="mr-3"
          />
          <div className="inline-block">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Online Payment (Razorpay)</span>
              <span className="px-2 py-0.5 bg-green-100 text-green-800 text-xs font-semibold rounded-full">FREE Delivery</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">UPI, Cards, Net Banking & Wallets</p>
          </div>
        </label>
        
        {/* COD Option */}
        <label
          className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
            paymentMethod === 'cod'
              ? 'border-blue-600 bg-blue-50'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="cod"
            checked={paymentMethod === 'cod'}
            onChange={(e) => handlePaymentMethodChange('cod')}
            className="mr-3"
          />
          <div className="inline-block">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Cash on Delivery (COD)</span>
              <span className="px-2 py-0.5 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">+ ₹49 Delivery</span>
            </div>
            <p className="text-sm text-gray-600 mt-1">Pay when you receive your order</p>
          </div>
        </label>
        
        {paymentMethod === 'cod' && (
          <div className="mt-3 p-3 bg-yellow-50 text-yellow-800 border border-yellow-200 rounded-lg text-sm">
            <strong>💡 Tip:</strong> Choose Online Payment to save ₹49 and get FREE delivery!
          </div>
        )}
      </div>
      
      {/* Order Notes */}
      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Order Notes (Optional)
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Any special instructions for delivery..."
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
        />
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {loading 
          ? 'Processing...' 
          : paymentMethod === 'online' 
            ? 'Proceed to Payment' 
            : 'Place Order (Pay on Delivery)'}
      </button>
      
      <p className="text-xs text-gray-500 text-center">
        {paymentMethod === 'online' 
          ? 'By placing this order, you agree to our terms and conditions. Your payment will be processed securely by Razorpay.'
          : 'By placing this order, you agree to our terms and conditions. You will pay ₹49 delivery charges + order amount when you receive your order.'}
      </p>
    </form>
  )
}
