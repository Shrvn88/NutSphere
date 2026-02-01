'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'

interface CartIconProps {
  itemCount: number
}

export default function CartIcon({ itemCount }: CartIconProps) {
  return (
    <Link
      href="/cart"
      className="relative p-2 hover:bg-gray-100 rounded-lg transition-colors"
      aria-label={`Cart with ${itemCount} items`}
    >
      <ShoppingCart className="w-6 h-6 text-gray-700" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}
