import Link from 'next/link'
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 lg:h-20">
          {/* Logo - Leftmost */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0 mr-8">
            <div className="flex flex-col">
              <span className="text-2xl lg:text-3xl font-bold">
                <span className="text-gray-800">Nut</span>
                <span className="text-gray-600">Sphere</span>
              </span>
              <span className="text-[10px] lg:text-xs text-green-600 font-medium tracking-wider -mt-1">
                THE SPHERE OF SUPERFOODS
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
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
          <div className="flex items-center gap-4 ml-auto">
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
        <div className="md:hidden pb-4">
          <SearchBar />
        </div>
      </div>
    </nav>
  )
}
