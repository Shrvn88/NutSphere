import Link from 'next/link'
import Image from 'next/image'
import SearchBar from './search-bar'
import CartIcon from './cart-icon'
import UserMenu from './user-menu'
import MobileMenu from './mobile-menu'
import { getCart } from '@/lib/data/cart'
import { createClient } from '@/lib/supabase/server'

export default async function Navigation() {
  const cart = await getCart()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // Get user profile if logged in
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, full_name')
      .eq('id', user.id)
      .single()
    profile = data
  }
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="w-full px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo - Leftmost */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.svg"
              alt="NutSphere - The Sphere of Superfoods"
              width={300}
              height={100}
              className="object-contain h-12 sm:h-14 lg:h-20 w-auto"
              priority
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 ml-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              All Products
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:block flex-1 max-w-md mx-6">
            <SearchBar />
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <CartIcon itemCount={cart.itemCount} />
            
            {user ? (
              <div className="flex items-center gap-4">
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin/dashboard"
                    className="hidden lg:inline-flex px-3 py-1.5 bg-purple-100 text-purple-700 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <UserMenu user={user} />
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="hidden sm:inline-flex px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors"
              >
                Login
              </Link>
            )}
            
            {/* Mobile Menu */}
            <MobileMenu user={user} isAdmin={profile?.role === 'admin'} />
          </div>
        </div>

        {/* Search Bar (Mobile) */}
        <div className="md:hidden pb-3 px-2 sm:px-4">
          <SearchBar />
        </div>
      </div>
    </nav>
  )
}
