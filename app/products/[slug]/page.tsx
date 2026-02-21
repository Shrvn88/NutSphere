import { getProductBySlug } from '@/lib/data/products'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatPrice, getStockStatusColor, toProductDisplay } from '@/lib/utils/product'
import type { Metadata } from 'next'
import ProductDetailsClient from '@/components/ProductDetailsClient'
import ProductImageGallery from '@/components/ProductImageGallery'
import { createClient } from '@/lib/supabase/server'

// Cache page for 60 seconds, then revalidate
export const revalidate = 60

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }

  const displayProduct = toProductDisplay(product)
  const imageUrl = displayProduct.primary_image || '/placeholder-product.jpg'
  const price = formatPrice(displayProduct.discounted_price)
  const stockStatus = displayProduct.in_stock ? 'In Stock' : 'Out of Stock'

  return {
    title: `${product.name} | E-Commerce Store`,
    description: product.description || `Buy ${product.name} - Premium quality nuts and dry fruits at ${price}. ${stockStatus} with fast delivery.`,
    openGraph: {
      title: product.name,
      description: product.description || `Premium quality ${product.name}`,
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description || `Premium quality ${product.name}`,
      images: [imageUrl],
    },
  }
}

export default async function ProductDetailPage({ params }: Readonly<Props>) {
  const { slug } = await params
  const productData = await getProductBySlug(slug)
  
  if (!productData) {
    notFound()
  }

  // Fetch variants for this product
  const supabase = await createClient()
  const { data: variants } = await supabase
    .from('product_variants')
    .select('*')
    .eq('product_id', productData.id)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  const product = toProductDisplay(productData)
  const stockColor = getStockStatusColor(product.stock_quantity)
  const stockColorClass = {
    green: 'bg-green-100 text-green-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
  }[stockColor]

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: 'E-Commerce Store',
    },
    offers: {
      '@type': 'Offer',
      url: `https://yourstore.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.discounted_price,
      availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
    aggregateRating: product.rating_average ? {
      '@type': 'AggregateRating',
      ratingValue: product.rating_average,
      ratingCount: product.rating_count,
    } : undefined,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center gap-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-blue-600">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-blue-600">Categories</Link>
            {productData.categories && (
              <>
                <span>/</span>
                <Link href={`/categories/${productData.categories.slug}`} className="hover:text-blue-600">
                  {productData.categories.name}
                </Link>
              </>
            )}
            <span>/</span>
            <span className="text-gray-900">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Details */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div>
            <ProductImageGallery 
              images={product.images}
              productName={product.name}
              discountPercentage={product.discount_percentage}
            />
          </div>

          {/* Product Info */}
          <div>
            {/* Category */}
            {productData.categories && (
              <Link 
                href={`/categories/${productData.categories.slug}`}
                className="text-sm text-blue-600 hover:underline"
              >
                {productData.categories.name}
              </Link>
            )}

            {/* Product Name */}
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>

            {/* Rating */}
            {product.rating_count > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center">
                  {new Array(5).fill(0).map((_, starIdx) => {
                    const starKey = `rating-star-${product.id}-${starIdx}`
                    return (
                      <span key={starKey} className={`text-xl ${starIdx < Math.round(product.rating_average) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ★
                      </span>
                    )
                  })}
                </div>
                <span className="text-sm text-gray-600">
                  {product.rating_average.toFixed(1)} ({product.rating_count} reviews)
                </span>
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">Description</h2>
                <p className="mt-2 text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Price, Variants & Add to Cart - Client Component */}
            <div className="mt-6">
              <ProductDetailsClient
                productId={productData.id}
                productName={product.name}
                basePrice={product.price}
                baseDiscountedPrice={product.discounted_price}
                discountPercentage={product.discount_percentage}
                stockQuantity={product.stock_quantity}
                isActive={productData.is_active}
                weightGrams={product.weight_grams}
                variants={variants || []}
              />
            </div>

            {/* Policy Information */}
            <div className="mt-8 border-t pt-6 space-y-3">
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-lg">🚚</span>
                <span>Free Delivery Across India on all orders</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-lg">💯</span>
                <span>No Returns on Food Products once delivered</span>
              </div>
              <div className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-lg">✓</span>
                <span>Refunds applicable Only for Damaged, Defective, or incorrect items as per our refund guidelines</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
