import { requireAdmin } from '@/lib/auth/server'
import Link from 'next/link'

export default async function AdminDashboard() {
  // This will throw an error if user is not admin
  // Error will be caught by middleware and user will be redirected
  const admin = await requireAdmin()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-purple-700 text-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">
              {admin.full_name || admin.email}
            </span>
            <Link
              href="/"
              className="px-4 py-2 bg-white text-purple-700 rounded-md hover:bg-gray-100 text-sm font-medium"
            >
              Back to Store
            </Link>
            <form action="/auth/logout" method="POST">
              <button
                type="submit"
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm font-medium"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Admin Control Panel
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-purple-500 bg-purple-50 p-4">
              <h3 className="text-lg font-medium text-purple-900">
                🔒 Admin Access Verified
              </h3>
              <p className="mt-2 text-sm text-purple-800">
                You have full administrative access. This page is protected by:
              </p>
              <ul className="mt-2 text-sm text-purple-800 list-disc list-inside space-y-1">
                <li>Server-side role verification (requireAdmin)</li>
                <li>Middleware route protection</li>
                <li>Database-level RLS policies</li>
              </ul>
            </div>

            <div className="border-l-4 border-blue-500 bg-blue-50 p-4">
              <h3 className="text-lg font-medium text-blue-900">
                Phase 0 - Foundation Complete
              </h3>
              <p className="mt-2 text-sm text-blue-800">
                The following features are now working:
              </p>
              <ul className="mt-2 text-sm text-blue-800 list-disc list-inside space-y-1">
                <li>✅ User authentication (signup/login/logout)</li>
                <li>✅ Role-based access control</li>
                <li>✅ Row Level Security (RLS) enabled</li>
                <li>✅ Server-side authentication checks</li>
                <li>✅ Admin route protection</li>
                <li>✅ Automatic profile creation</li>
              </ul>
            </div>

            <div className="border-l-4 border-green-500 bg-green-50 p-4">
              <h3 className="text-lg font-medium text-green-900">
                Ready for Next Phase
              </h3>
              <p className="mt-2 text-sm text-green-800">
                The foundation is solid. Future phases will add:
              </p>
              <ul className="mt-2 text-sm text-green-800 list-disc list-inside space-y-1">
                <li>Product management (CRUD operations)</li>
                <li>Category management</li>
                <li>Order management</li>
                <li>Customer management</li>
                <li>Analytics and reports</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
