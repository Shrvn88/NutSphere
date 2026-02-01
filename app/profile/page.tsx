import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from './profile-form'

export const metadata = {
  title: 'My Profile | E-Commerce Store',
  description: 'Manage your profile and account settings',
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <p className="mt-2 text-gray-600">Manage your account information</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Profile Information</h2>
          <ProfileForm user={user} profile={profile} />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/orders"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">My Orders</div>
                <div className="text-sm text-gray-500">View order history</div>
              </div>
            </a>

            <a
              href="/profile/addresses"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">Addresses</div>
                <div className="text-sm text-gray-500">Manage addresses</div>
              </div>
            </a>

            <a
              href="/cart"
              className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <div>
                <div className="font-medium text-gray-900">My Cart</div>
                <div className="text-sm text-gray-500">View cart items</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
