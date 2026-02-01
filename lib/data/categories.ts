import { createClient } from '@/lib/supabase/server'
import { Category, CategoryWithProductCount } from '@/types'
import { cache } from 'react'

/**
 * Get all active categories with product count
 */
export const getCategories = cache(async (): Promise<CategoryWithProductCount[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select(`
      *,
      products:products(count)
    `)
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data.map((category: any) => ({
    ...category,
    product_count: category.products[0]?.count || 0,
  }))
})

/**
 * Get category by slug
 */
export const getCategoryBySlug = cache(async (slug: string): Promise<Category | null> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single()

  if (error) {
    console.error('Error fetching category:', error)
    return null
  }

  return data
})
