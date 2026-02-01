import { Database } from './database.types'

export type UserRole = 'user' | 'admin'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  role: UserRole
  created_at: string
  updated_at: string
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  full_name: string | null
}

// Category types
export type Category = Database['public']['Tables']['categories']['Row']
export type CategoryInsert = Database['public']['Tables']['categories']['Insert']
export type CategoryUpdate = Database['public']['Tables']['categories']['Update']

export interface CategoryWithProductCount extends Category {
  product_count: number
}

// Product types
export type Product = Database['public']['Tables']['products']['Row']
export type ProductInsert = Database['public']['Tables']['products']['Insert']
export type ProductUpdate = Database['public']['Tables']['products']['Update']

export interface ProductWithCategory extends Product {
  categories: Category | null
}

// Computed product fields
export interface ProductDisplay extends Product {
  discounted_price: number
  discount_amount: number
  in_stock: boolean
  primary_image: string | null
}

// Helper type for product listing with category
export interface ProductListItem extends ProductDisplay {
  categories: Pick<Category, 'id' | 'name' | 'slug'> | null
}

// Product Variant types
export type ProductVariant = Database['public']['Tables']['product_variants']['Row']
export type ProductVariantInsert = Database['public']['Tables']['product_variants']['Insert']
export type ProductVariantUpdate = Database['public']['Tables']['product_variants']['Update']

// Pagination types
export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  total_pages: number
}
