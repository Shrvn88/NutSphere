import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET() {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('products')
    .select('slug, name, images')
    .limit(5)

  return NextResponse.json({
    success: !error,
    error: error?.message,
    products: data,
    count: data?.length || 0
  })
}
