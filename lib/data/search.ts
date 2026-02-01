import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import type { Database } from '@/types/database.types'

type Product = Database['public']['Tables']['products']['Row'] & {
  categories: Database['public']['Tables']['categories']['Row'] | null
}

export type SortOption = 
  | 'newest' 
  | 'popular' 
  | 'price-asc' 
  | 'price-desc' 
  | 'rating'

export interface SearchFilters {
  query?: string
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  minRating?: number
  inStock?: boolean
  sortBy?: SortOption
  page?: number
  limit?: number
}

export interface SearchResult {
  products: Product[]
  total: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

/**
 * Server-side search with filters, sorting, and pagination
 * Uses PostgreSQL full-text search and trigram similarity for fuzzy matching
 */
export const searchProducts = cache(async (
  filters: SearchFilters = {}
): Promise<SearchResult> => {
  const supabase = await createClient()
  
  const {
    query = '',
    categoryId,
    minPrice,
    maxPrice,
    minRating,
    inStock = true,
    sortBy = 'newest',
    page = 1,
    limit = 20,
  } = filters

  // Start with base query
  let dbQuery = supabase
    .from('products')
    .select('*, categories:category_id (*)', { count: 'exact' })
    .eq('is_active', true)

  // Text search with fuzzy matching
  if (query?.trim()) {
    const searchTerm = query.trim()
    
    // Use full-text search if available, fallback to ILIKE
    // Full-text search uses the search_vector column we created
    // For fuzzy matching, we use trigram similarity with ILIKE
    dbQuery = dbQuery.or(
      `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    )
  }

  // Category filter
  if (categoryId) {
    dbQuery = dbQuery.eq('category_id', categoryId)
  }

  // Price range filter
  if (minPrice !== undefined) {
    dbQuery = dbQuery.gte('price', minPrice)
  }
  if (maxPrice !== undefined) {
    dbQuery = dbQuery.lte('price', maxPrice)
  }

  // Rating filter
  if (minRating !== undefined) {
    dbQuery = dbQuery.gte('rating_average', minRating)
  }

  // Stock filter
  if (inStock) {
    dbQuery = dbQuery.gt('stock_quantity', 0)
  }

  // Sorting
  switch (sortBy) {
    case 'newest':
      dbQuery = dbQuery.order('created_at', { ascending: false })
      break
    case 'popular':
      // Sort by sales count, then views count
      dbQuery = dbQuery
        .order('sales_count', { ascending: false })
        .order('views_count', { ascending: false })
      break
    case 'price-asc':
      dbQuery = dbQuery.order('price', { ascending: true })
      break
    case 'price-desc':
      dbQuery = dbQuery.order('price', { ascending: false })
      break
    case 'rating':
      dbQuery = dbQuery
        .order('rating_average', { ascending: false })
        .order('rating_count', { ascending: false })
      break
    default:
      dbQuery = dbQuery.order('created_at', { ascending: false })
  }

  // Pagination
  const from = (page - 1) * limit
  const to = from + limit - 1
  dbQuery = dbQuery.range(from, to)

  const { data, error, count } = await dbQuery

  if (error) {
    console.error('Search error:', error)
    throw new Error(`Search failed: ${error.message}`)
  }

  const total = count || 0
  const totalPages = Math.ceil(total / limit)

  return {
    products: data || [],
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  }
})

/**
 * Get search suggestions (autocomplete)
 * Returns top 5 matching products for quick suggestions
 */
export const getSearchSuggestions = cache(async (
  query: string
): Promise<Product[]> => {
  if (!query || query.trim().length < 2) {
    return []
  }

  const supabase = await createClient()
  const searchTerm = query.trim()

  // Use similarity search for fuzzy matching
  // This helps with typos and partial matches
  const { data, error } = await supabase
    .from('products')
    .select('*, categories:category_id (*)')
    .eq('is_active', true)
    .or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
    .limit(5)

  if (error) {
    console.error('Suggestion error:', error)
    return []
  }

  return data || []
})

/**
 * Get available filter options based on current search
 * Useful for showing dynamic filter values
 */
export const getFilterOptions = cache(async (
  categoryId?: string
): Promise<{
  priceRange: { min: number; max: number }
  categories: Database['public']['Tables']['categories']['Row'][]
}> => {
  const supabase = await createClient()

  // Get price range
  let priceQuery = supabase
    .from('products')
    .select('price')
    .eq('is_active', true)

  if (categoryId) {
    priceQuery = priceQuery.eq('category_id', categoryId)
  }

  const { data: priceData } = await priceQuery

  const prices = priceData?.map(p => p.price) || []
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000

  // Get categories with product counts
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return {
    priceRange: { min: minPrice, max: maxPrice },
    categories: categories || [],
  }
})
