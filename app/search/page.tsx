import { Suspense } from 'react'
import Link from 'next/link'
import { searchProducts, getFilterOptions, type SortOption } from '@/lib/data/search'
import { toProductDisplay, formatPrice } from '@/lib/utils/product'
import type { Metadata } from 'next'
import SortDropdown from '@/components/sort-dropdown'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    category?: string
    minPrice?: string
    maxPrice?: string
    minRating?: string
    sort?: SortOption
    page?: string
  }>
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams
  const query = params.q || ''
  const title = query ? `Search results for "${query}"` : 'Search Products'
  
  return {
    title: `${title} | E-Commerce Store`,
    description: 'Search for premium nuts, dry fruits, and healthy snacks',
  }
}

async function SearchResults({ searchParams }: SearchPageProps) {
  const params = await searchParams
  const query = params.q || ''
  const categoryId = params.category
  const minPrice = params.minPrice ? Number.parseInt(params.minPrice) : undefined
  const maxPrice = params.maxPrice ? Number.parseInt(params.maxPrice) : undefined
  const minRating = params.minRating ? Number.parseFloat(params.minRating) : undefined
  const sortBy = params.sort || 'newest'
  const page = params.page ? Number.parseInt(params.page) : 1

  const [searchResult, filterOptions] = await Promise.all([
    searchProducts({
      query,
      categoryId,
      minPrice,
      maxPrice,
      minRating,
      sortBy,
      page,
      limit: 20,
    }),
    getFilterOptions(categoryId),
  ])

  const displayProducts = searchResult.products.map(toProductDisplay)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            {query ? `Search results for "${query}"` : 'All Products'}
          </h1>
          <p className="mt-2 text-gray-600">
            {searchResult.total} {searchResult.total === 1 ? 'product' : 'products'} found
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Filters</h2>
              
              <form method="get" action="/search" className="space-y-6">
                {/* Preserve search query */}
                {query && <input type="hidden" name="q" value={query} />}
                
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={categoryId || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">All Categories</option>
                    {filterOptions.categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Min"
                      defaultValue={minPrice}
                      min={filterOptions.priceRange.min}
                      max={filterOptions.priceRange.max}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    />
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Max"
                      defaultValue={maxPrice}
                      min={filterOptions.priceRange.min}
                      max={filterOptions.priceRange.max}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder:text-gray-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Range: {formatPrice(filterOptions.priceRange.min)} - {formatPrice(filterOptions.priceRange.max)}
                  </p>
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    name="minRating"
                    defaultValue={minRating?.toString() || ''}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4★ & above</option>
                    <option value="3">3★ & above</option>
                    <option value="2">2★ & above</option>
                  </select>
                </div>

                {/* Sort preserved as hidden field */}
                <input type="hidden" name="sort" value={sortBy} />

                {/* Apply Filters Button */}
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Apply Filters
                </button>

                {/* Clear Filters */}
                {(categoryId || minPrice || maxPrice || minRating) && (
                  <Link
                    href={`/search${query ? `?q=${encodeURIComponent(query)}` : ''}`}
                    className="block w-full text-center text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear all filters
                  </Link>
                )}
              </form>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Sort Options */}
            <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Showing {searchResult.products.length} of {searchResult.total} products
                </span>
                <div className="flex items-center gap-2">
                  <label htmlFor="sort" className="text-sm text-gray-600">Sort by:</label>
                  <SortDropdown currentSort={sortBy} />
                </div>
              </div>
            </div>

            {/* No Results */}
            {displayProducts.length === 0 && (
              <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters or search query
                </p>
                <Link
                  href="/search"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear Search
                </Link>
              </div>
            )}

            {/* Products Grid */}
            {displayProducts.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {displayProducts.map((product) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.slug}`}
                      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
                    >
                      <div className="relative aspect-square bg-gray-100">
                        {product.primary_image ? (
                          <img
                            src={product.primary_image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-6xl text-gray-300">🥜</span>
                          </div>
                        )}
                        {product.discount_percentage > 0 && (
                          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                            {product.discount_percentage}% OFF
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl font-bold text-gray-900">
                            {formatPrice(product.discounted_price)}
                          </span>
                          {product.discount_percentage > 0 && (
                            <span className="text-sm text-gray-500 line-through">
                              {formatPrice(product.price)}
                            </span>
                          )}
                        </div>
                        {product.rating_average > 0 && (
                          <div className="flex items-center gap-1 text-sm text-gray-600">
                            <span>⭐</span>
                            <span>{product.rating_average.toFixed(1)}</span>
                            <span className="text-gray-400">({product.rating_count})</span>
                          </div>
                        )}
                        <div className="mt-2">
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            product.in_stock 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {product.in_stock ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Pagination */}
                {searchResult.totalPages > 1 && (
                  <div className="mt-8 flex justify-center gap-2">
                    {searchResult.hasPrevPage && (
                      <Link
                        href={`/search?${new URLSearchParams({
                          ...(query && { q: query }),
                          ...(categoryId && { category: categoryId }),
                          ...(minPrice && { minPrice: minPrice.toString() }),
                          ...(maxPrice && { maxPrice: maxPrice.toString() }),
                          ...(minRating && { minRating: minRating.toString() }),
                          sort: sortBy,
                          page: (page - 1).toString(),
                        }).toString()}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Previous
                      </Link>
                    )}
                    
                    <span className="px-4 py-2 text-gray-700">
                      Page {page} of {searchResult.totalPages}
                    </span>

                    {searchResult.hasNextPage && (
                      <Link
                        href={`/search?${new URLSearchParams({
                          ...(query && { q: query }),
                          ...(categoryId && { category: categoryId }),
                          ...(minPrice && { minPrice: minPrice.toString() }),
                          ...(maxPrice && { maxPrice: maxPrice.toString() }),
                          ...(minRating && { minRating: minRating.toString() }),
                          sort: sortBy,
                          page: (page + 1).toString(),
                        }).toString()}`}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                      >
                        Next
                      </Link>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SearchPage(props: SearchPageProps) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔍</div>
          <p className="text-gray-600">Loading search results...</p>
        </div>
      </div>
    }>
      <SearchResults {...props} />
    </Suspense>
  )
}
