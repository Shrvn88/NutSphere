import { getCategories } from '@/lib/data/categories'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Shop by Category - NutSphere',
  description: 'Browse our collection of premium nuts and seeds by category. Find almonds, cashews, walnuts, chia seeds, and more at NutSphere.',
  openGraph: {
    title: 'Shop by Category - NutSphere',
    description: 'Browse our collection of premium nuts and seeds by category',
    type: 'website',
  },
}

// Category emoji map
const categoryEmoji: Record<string, string> = {
  nuts: '🌰',
  seeds: '🌱',
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Shop by <span className="text-green-600">Category</span>
            </h1>
            <p className="text-lg text-gray-600">
              Explore our carefully curated selection of premium superfoods
            </p>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-3xl">
              <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-3xl">📦</span>
              </div>
              <p className="text-gray-500 text-lg">No categories available at the moment.</p>
              <p className="text-gray-400 mt-2">Check back soon!</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {categories.map((category) => {
                const emoji = categoryEmoji[category.slug.toLowerCase()] || '📦'
                const isNuts = category.slug.toLowerCase() === 'nuts'
                
                return (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className={`group relative rounded-3xl p-8 overflow-hidden hover:shadow-xl transition-all duration-300 ${
                      isNuts 
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50' 
                        : 'bg-gradient-to-br from-green-50 to-emerald-50'
                    }`}
                  >
                    <div className={`absolute top-0 right-0 w-40 h-40 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-500 ${
                      isNuts ? 'bg-amber-200/50' : 'bg-green-200/50'
                    }`} />
                    
                    <div className="relative">
                      {/* Category Image or Emoji */}
                      <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-6 overflow-hidden">
                        {category.image_url ? (
                          <Image
                            src={category.image_url}
                            alt={category.name}
                            width={96}
                            height={96}
                            className="object-cover"
                          />
                        ) : (
                          <span className="text-5xl">{emoji}</span>
                        )}
                      </div>
                      
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        {category.name}
                      </h2>
                      
                      {category.description && (
                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500 bg-white/50 px-3 py-1 rounded-full">
                          {category.product_count} {category.product_count === 1 ? 'product' : 'products'}
                        </span>
                        <span className={`inline-flex items-center font-semibold group-hover:gap-2 transition-all ${
                          isNuts ? 'text-amber-700' : 'text-green-700'
                        }`}>
                          Explore
                          <svg className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </span>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-12 lg:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Shop with NutSphere?
            </h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-sm text-gray-600">Carefully selected and tested products</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fresh & Hygienic</h3>
              <p className="text-sm text-gray-600">Sealed for freshness and safety</p>
            </div>
            <div className="text-center">
              <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-sm text-gray-600">Quick and reliable shipping</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
