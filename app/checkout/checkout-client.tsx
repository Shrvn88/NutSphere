'use client'

import { useState } from 'react'
import CheckoutForm from './checkout-form'
import CheckoutSummary from './checkout-summary'
import type { User } from '@supabase/supabase-js'

interface CheckoutClientProps {
  user: User | null
  savedAddresses: any[]
  items: any[]
  subtotal: number
  discount: number
}

export default function CheckoutClient({ user, savedAddresses, items, subtotal, discount }: CheckoutClientProps) {
  const [paymentMethod, setPaymentMethod] = useState<'online' | 'cod'>('online')
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Checkout Form */}
      <div className="lg:col-span-2">
        <CheckoutForm 
          user={user}
          savedAddresses={savedAddresses}
          onPaymentMethodChange={setPaymentMethod}
        />
      </div>
      
      {/* Order Summary */}
      <div className="lg:col-span-1">
        <CheckoutSummary 
          items={items}
          subtotal={subtotal}
          discount={discount}
          paymentMethod={paymentMethod}
        />
      </div>
    </div>
  )
}

