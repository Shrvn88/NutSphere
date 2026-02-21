import Link from 'next/link'
import Image from 'next/image'
import { ProductListItem } from '@/types'
import { formatPrice, getStockStatusLabel, getStockStatusColor } from '@/lib/utils/product'

interface ProductCardProps {
  product: ProductListItem
}

export default function ProductCard({ product }: Readonly<ProductCardProps>) {
  const stockColor = getStockStatusColor(product.stock_quantity)
  const stockColorClass = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-amber-100 text-amber-700',
    red: 'bg-red-100 text-red-700',
  }[stockColor]

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
    >
      {/* Product Image */}
      <div className="relative h-56 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {product.primary_image ? (
          <Image
            src={product.primary_image}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Image src="/nuts.svg" alt="Nut" width={96} height={96} className="opacity-50" />
          </div>
        )}
        
        {/* Discount Badge */}
        {product.discount_percentage > 0 && (
          <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
            {product.discount_percentage}% OFF
          </div>
        )}

        {/* Stock Badge */}
        <div className={`absolute top-3 left-3 ${stockColorClass} px-3 py-1 rounded-full text-xs font-semibold shadow-sm`}>
          {getStockStatusLabel(product.stock_quantity)}
        </div>

        {/* Quick View Overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-medium shadow-lg">
            View Details
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5">
        {/* Category */}
        {product.categories && (
          <span className="inline-flex items-center text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full">
            {product.categories.name}
          </span>
        )}

        {/* Name */}
        <h3 className="mt-2 text-lg font-semibold text-gray-900 line-clamp-2 group-hover:text-green-600 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product.rating_count > 0 && (
          <div className="mt-2 flex items-center gap-1">
            <div className="flex items-center bg-amber-50 px-2 py-0.5 rounded-full">
              <span className="text-amber-500">★</span>
              <span className="ml-1 text-sm font-medium text-amber-700">
                {product.rating_average.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              ({product.rating_count} reviews)
            </span>
          </div>
        )}

        {/* Price */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.discounted_price)}
          </span>
          {product.discount_percentage > 0 && (
            <span className="text-sm text-gray-400 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Weight */}
        {product.weight_grams && (
          <p className="mt-1 text-xs text-gray-500">
            {product.weight_grams >= 1000 
              ? `${(product.weight_grams / 1000).toFixed(1)} kg` 
              : `${product.weight_grams}g`
            }
          </p>
        )}
      </div>
    </Link>
  )
}

