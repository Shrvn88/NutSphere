import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCart } from '@/lib/data/cart'
import CheckoutClient from '@/app/checkout/checkout-client'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Checkout | E-Commerce Store',
  description: 'Complete your order',
}

export default async function CheckoutPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  const cart = await getCart()
  
  // Redirect to cart if empty
  if (cart.items.length === 0) {
    redirect('/cart')
  }
  
  // Calculate totals
  const subtotal = cart.subtotal
  const discount = cart.discount
  
  // Get user's saved addresses if logged in
  let savedAddresses: any[] = []
  if (user) {
    const { data } = await supabase
      .from('addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
    
    savedAddresses = data || []
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <CheckoutClient 
          user={user}
          savedAddresses={savedAddresses}
          items={cart.items}
          subtotal={subtotal}
          discount={discount}
        />
      </div>
    </div>
  )
}
