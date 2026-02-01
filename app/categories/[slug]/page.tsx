import { getProducts } from '@/lib/data/products'
import { getCategoryBySlug } from '@/lib/data/categories'
import { notFound } from 'next/navigation'
import { ProductCard, Pagination } from '@/components'
import type { Metadata } from 'next'
import { createStaticClient } from '@/lib/supabase/static'

interface Props {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string }>
}

// Generate static params for all categories
export async function generateStaticParams() {
  const supabase = createStaticClient()
  
  const { data } = await supabase
    .from('categories')
    .select('slug')
    .eq('is_active', true)
  
  return data?.map((category) => ({
    slug: category.slug,
  })) ?? []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

  return {
    title: `${category.name} | E-Commerce Store`,
    description: category.description || `Shop ${category.name} products - Premium quality nuts and dry fruits with fast delivery`,
    openGraph: {
      title: category.name,
      description: category.description || `Browse our ${category.name} collection`,
      images: category.image_url ? [
        {
          url: category.image_url,
          width: 800,
          height: 800,
          alt: category.name,
        },
      ] : [],
      type: 'website',
    },
  }
}

export default async function CategoryProductsPage({ params, searchParams }: Readonly<Props>) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  
  const category = await getCategoryBySlug(slug)
  
  if (!category) {
    notFound()
  }

  const page = Number(pageParam) || 1
  const productsData = await getProducts(page, 12, slug)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
          {category.description && (
            <p className="mt-2 text-gray-600">{category.description}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            {productsData.total} {productsData.total === 1 ? 'product' : 'products'}
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {productsData.data.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No products available in this category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  baseUrl={`/categories/${slug}`}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
