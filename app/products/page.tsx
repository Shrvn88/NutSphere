import { getProducts } from '@/lib/data/products'
import ProductCard from '@/components/ProductCard'
import Pagination from '@/components/Pagination'
import Link from 'next/link'
import Image from 'next/image'
import type { Metadata } from 'next'

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ category?: string }> }): Promise<Metadata> {
  const { category } = await searchParams
  
  if (category === 'nuts') {
    return {
      title: 'Dry-Fruits & Nuts - NutSphere',
      description: 'Shop our premium collection of dry-fruits and nuts including almonds, cashews, walnuts, pistachios and more at NutSphere.',
    }
  }
  
  if (category === 'seeds') {
    return {
      title: 'Super Seeds - NutSphere',
      description: 'Shop our nutritious seeds collection including chia seeds, flax seeds, pumpkin seeds, sunflower seeds and more at NutSphere.',
    }
  }
  
  return {
    title: 'All Products - NutSphere',
    description: 'Browse our complete collection of premium nuts and seeds. High quality almonds, cashews, walnuts, chia seeds and more at NutSphere.',
  }
}

interface Props {
  searchParams: Promise<{ page?: string; category?: string }>
}

export default async function ProductsPage({ searchParams }: Readonly<Props>) {
  const { page: pageParam, category } = await searchParams
  const page = Number(pageParam) || 1
  const productsData = await getProducts(page, 12, category)

  // Get page title and description based on category
  const getPageInfo = () => {
    if (category === 'nuts') {
      return {
        title: 'Dry-Fruits &',
        highlight: 'Nuts',
        description: 'Handpicked, hygienically packed premium quality dry-fruits and nuts',
        emoji: 'nuts-svg'
      }
    }
    if (category === 'seeds') {
      return {
        title: 'Super',
        highlight: 'Seeds',
        description: 'Nutritious and wholesome seeds for healthy living',
        emoji: '🌱'
      }
    }
    return {
      title: 'Our',
      highlight: 'Products',
      description: 'Premium quality superfoods for a healthier you',
      emoji: '✨'
    }
  }

  const pageInfo = getPageInfo()

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-green-50 via-white to-green-50 py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="flex justify-center mb-4">
              {pageInfo.emoji === 'nuts-svg' ? (
                <Image src="/nuts.svg" alt="Nuts" width={64} height={64} />
              ) : (
                <div className="text-4xl">{pageInfo.emoji}</div>
              )}
            </div>
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              {pageInfo.title} <span className="text-green-600">{pageInfo.highlight}</span>
            </h1>
            <p className="text-lg text-gray-600">
              {pageInfo.description}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Showing {productsData.total} {productsData.total === 1 ? 'product' : 'products'}
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-4 lg:gap-8">
            {/* Sidebar Filters */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Categories Filter */}
                <div className="bg-gray-50 rounded-2xl p-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
                  <div className="space-y-2">
                    <Link
                      href="/products"
                      className={`block px-4 py-2 rounded-xl transition-colors ${
                        !category 
                          ? 'bg-green-100 text-green-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      All Products
                    </Link>
                    <Link
                      href="/products?category=nuts"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                        category === 'nuts' 
                          ? 'bg-green-100 text-green-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Image src="/nuts.svg" alt="Nut" width={20} height={20} className="inline-block mr-2" /> Dry-Fruits & Nuts
                    </Link>
                    <Link
                      href="/products?category=seeds"
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-colors ${
                        category === 'seeds' 
                          ? 'bg-green-100 text-green-700 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <span>🌱</span> Seeds
                    </Link>
                  </div>
                </div>

                {/* Trust Badge */}
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">FSSAI Certified</p>
                      <p className="text-xs text-gray-600">License: 1121599900840</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {/* Mobile Category Filter */}
              <div className="lg:hidden mb-6">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  <Link
                    href="/products"
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      !category 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    All
                  </Link>
                  <Link
                    href="/products?category=nuts"
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                      category === 'nuts' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <Image src="/nuts.svg" alt="Nut" width={20} height={20} className="inline-block mr-2" /> Dry-Fruits & Nuts
                  </Link>
                  <Link
                    href="/products?category=seeds"
                    className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-1 ${
                      category === 'seeds' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    🌱 Seeds
                  </Link>
                </div>
              </div>

              {productsData.data.length === 0 ? (
                <div className="text-center py-16 bg-gray-50 rounded-3xl">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-3xl">🔍</span>
                  </div>
                  <p className="text-gray-500 text-lg">No products found</p>
                  <p className="text-gray-400 mt-2">Try selecting a different category</p>
                  <Link
                    href="/products"
                    className="inline-flex items-center mt-6 px-6 py-3 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition-colors"
                  >
                    View All Products
                  </Link>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {productsData.data.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {productsData.total_pages > 1 && (
                    <div className="mt-12">
                      <Pagination
                        currentPage={productsData.page}
                        totalPages={productsData.total_pages}
                        baseUrl={category ? `/products?category=${category}` : '/products'}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Policy Information Section */}
      <section className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex items-start gap-4 text-gray-700">
              <span className="text-2xl flex-shrink-0">🚚</span>
              <div>
                <p className="font-medium">Free Delivery Across India on all orders</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-gray-700">
              <span className="text-2xl flex-shrink-0">💯</span>
              <div>
                <p className="font-medium">No Returns on Food Products once delivered</p>
              </div>
            </div>
            <div className="flex items-start gap-4 text-gray-700">
              <span className="text-2xl flex-shrink-0">✓</span>
              <div>
                <p className="font-medium">Refunds applicable Only for Damaged, Defective, or incorrect items as per our refund guidelines</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
