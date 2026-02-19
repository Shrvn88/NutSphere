import { createClient } from '@/lib/supabase/server'
import { Category, CategoryWithProductCount } from '@/types'
import { cache } from 'react'

/**
 * Get all active categories with product count
 */
export const getCategories = cache(async (): Promise<CategoryWithProductCount[]> => {
  try {
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
      console.error('Error fetching categories:', error.message, error.details)
      return []
    }

    if (!data) {
      console.warn('No categories data returned')
      return []
    }

    return data.map((category: any) => ({
      ...category,
      product_count: category.products[0]?.count || 0,
    }))
  } catch (err) {
    console.error('Unexpected error fetching categories:', err)
    return []
  }
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
