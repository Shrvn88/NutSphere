'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { User } from '@supabase/supabase-js'

interface MobileMenuProps {
  user: User | null
  isAdmin?: boolean
}

export default function MobileMenu({ user, isAdmin }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="lg:hidden">
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-700 hover:text-green-600 focus:outline-none"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-72 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <span className="text-lg font-bold text-gray-800">Menu</span>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <nav className="p-4 space-y-2">
              <Link
                href="/"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
              >
                🏠 Home
              </Link>
              <Link
                href="/products?category=nuts"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
              >
                <Image src="/nuts.svg" alt="Nut" width={20} height={20} className="inline-block mr-2" /> Dry-Fruits & Nuts
              </Link>
              <Link
                href="/products?category=seeds"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
              >
                🌱 Seeds
              </Link>
              <Link
                href="/products"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
              >
                📦 All Products
              </Link>
              <Link
                href="/about"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
              >
                ℹ️ About Us
              </Link>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
              >
                📞 Contact
              </Link>

              <div className="border-t my-4" />

              {user ? (
                <>
                  <Link
                    href="/profile"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
                  >
                    👤 My Profile
                  </Link>
                  <Link
                    href="/orders"
                    onClick={() => setIsOpen(false)}
                    className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 rounded-lg font-medium"
                  >
                    📦 My Orders
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin/dashboard"
                      onClick={() => setIsOpen(false)}
                      className="block px-4 py-3 text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg font-medium"
                    >
                      ⚙️ Admin Dashboard
                    </Link>
                  )}
                  <form action="/auth/logout" method="POST" className="mt-4">
                    <button
                      type="submit"
                      className="w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium text-left"
                    >
                      🚪 Logout
                    </button>
                  </form>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center bg-green-600 text-white rounded-lg font-medium hover:bg-green-700"
                  >
                    Login
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsOpen(false)}
                    className="block w-full px-4 py-3 text-center border-2 border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}
