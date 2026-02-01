import { NextRequest, NextResponse } from 'next/server'
import { getSearchSuggestions } from '@/lib/data/search'
import { toProductDisplay, formatPrice } from '@/lib/utils/product'

export const runtime = 'edge'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('q')

  if (!query || query.trim().length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  try {
    const products = await getSearchSuggestions(query)
    const suggestions = products.map(product => {
      const display = toProductDisplay(product)
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: formatPrice(display.discounted_price),
        image: display.primary_image,
        category: product.categories?.name || null,
      }
    })

    return NextResponse.json({ suggestions })
  } catch (error) {
    console.error('Suggestions API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch suggestions' },
      { status: 500 }
    )
  }
}
