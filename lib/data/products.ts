import { createClient } from '@/lib/supabase/server'
import { ProductWithCategory, PaginatedResponse, ProductListItem } from '@/types'
import { toProductDisplay } from '@/lib/utils/product'
import { cache } from 'react'

const PRODUCTS_PER_PAGE = 12

/**
 * Get paginated products with category info
 */
export const getProducts = cache(async (
  page: number = 1,
  limit: number = 12,
  categoryFilter?: string
): Promise<PaginatedResponse<ProductListItem>> => {
  const supabase = await createClient()
  const from = (page - 1) * limit
  const to = from + limit - 1

  let query = supabase
    .from('products')
    .select(`
      *,
      categories:category_id (
        id,
        name,
        slug
      )
    `, { count: 'exact' })
    .eq('is_active', true)

  // Filter by category if provided
  if (categoryFilter) {
    // Check if it's a main category (nuts or seeds)
    if (categoryFilter === 'nuts' || categoryFilter === 'seeds') {
      // Get the parent category
      const { data: parentCategory } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categoryFilter)
        .single()

      if (parentCategory) {
        // Get all child categories under this parent
        const { data: childCategories } = await supabase
          .from('categories')
          .select('id')
          .eq('parent_id', parentCategory.id)

        if (childCategories && childCategories.length > 0) {
          // Include both parent category and all child categories
          const categoryIds = [parentCategory.id, ...childCategories.map(c => c.id)]
          query = query.in('category_id', categoryIds)
        } else {
          // No children, just use parent
          query = query.eq('category_id', parentCategory.id)
        }
      } else {
        // Fallback: search by name pattern
        const { data: categories } = await supabase
          .from('categories')
          .select('id, name')
          .ilike('name', `%${categoryFilter}%`)

        if (categories && categories.length > 0) {
          const categoryIds = categories.map(c => c.id)
          query = query.in('category_id', categoryIds)
        }
      }
    } else {
      // Regular category filter by slug
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categoryFilter)
        .single()

      if (category) {
        query = query.eq('category_id', category.id)
      }
    }
  }

  const { data, error, count } = await query
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching products:', error)
    return {
      data: [],
      total: 0,
      page,
      limit: PRODUCTS_PER_PAGE,
      total_pages: 0,
    }
  }

  const products = (data || []).map((product: any) => ({
    ...toProductDisplay(product),
    categories: product.categories,
  }))

  return {
    data: products,
    total: count || 0,
    page,
    limit,
    total_pages: Math.ceil((count || 0) / limit),
  }
})

/**
 * Get product by slug
 */
export const getProductBySlug = cache(async (slug: string): Promise<ProductWithCategory | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:category_id (*)
    `)
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching product:', error)
    return null
  }

  // Increment view count
  await supabase.rpc('increment_product_views', { product_id: data.id })

  return data
})

/**
 * Get featured products
 */
export const getFeaturedProducts = cache(async (limit: number = 8): Promise<ProductListItem[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('products')
    .select(`
      *,
      categories:category_id (
        id,
        name,
        slug
      )
    `)
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('sales_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching featured products:', error)
    return []
  }

  return (data || []).map((product: any) => ({
    ...toProductDisplay(product),
    categories: product.categories,
  }))
})
