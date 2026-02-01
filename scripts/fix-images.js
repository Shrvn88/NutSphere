/**
 * Fix Product Images - Update database with correct image URLs
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

console.log('🔧 Supabase URL:', env.NEXT_PUBLIC_SUPABASE_URL)
console.log('🔑 Anon Key exists:', !!env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
console.log('🔑 Service Role Key exists:', !!env.SUPABASE_SERVICE_ROLE_KEY)

// Use service role key to bypass RLS policies
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('⚠️  WARNING: SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
  console.warn('⚠️  This script needs admin access to update the database.')
  console.warn('⚠️  Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file.')
  console.warn('⚠️  Get it from: https://app.supabase.com/project/_/settings/api')
  process.exit(1)
}

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseKey,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const BASE_URL = 'https://ukshvkdnwjjihinumuuw.supabase.co/storage/v1/object/public/product-images'

const productsToUpdate = [
  {
    slug: 'premium-almonds',
    images: [
      `${BASE_URL}/almonds/almonds-1.jpeg`,
      `${BASE_URL}/almonds/almonds-2.jpeg`,
      `${BASE_URL}/almonds/almonds-3.jpeg`
    ]
  },
  {
    slug: 'premium-cashews',
    images: [
      `${BASE_URL}/cashews/cashews-1.jpeg`,
      `${BASE_URL}/cashews/cashews-2.jpeg`,
      `${BASE_URL}/cashews/cashews-3.jpeg`
    ]
  },
  {
    slug: 'premium-walnuts',
    images: [
      `${BASE_URL}/walnuts/walnuts-1.jpeg`,
      `${BASE_URL}/walnuts/walnuts-2.jpeg`,
      `${BASE_URL}/walnuts/walnuts-3.jpeg`
    ]
  },
  {
    slug: 'premium-pistachios',
    images: [
      `${BASE_URL}/pistachios/pistachios-1.jpeg`,
      `${BASE_URL}/pistachios/pistachios-2.jpeg`,
      `${BASE_URL}/pistachios/pistachios-3.jpeg`
    ]
  },
  {
    slug: 'premium-mixed-nuts',
    images: [
      `${BASE_URL}/mixed-nuts/mixed-nuts-1.jpeg`,
      `${BASE_URL}/mixed-nuts/mixed-nuts-2.jpeg`,
      `${BASE_URL}/mixed-nuts/mixed-nuts-3.jpeg`
    ]
  }
]

async function fixDatabase() {
  console.log('\n🔍 Checking current database state...\n')
  
  // First check current state
  const { data: currentData, error: fetchError } = await supabase
    .from('products')
    .select('slug, name, images')
    .in('slug', productsToUpdate.map(p => p.slug))
  
  if (fetchError) {
    console.error('❌ Error fetching products:', fetchError)
    return
  }
  
  console.log('Current state:')
  currentData?.forEach(p => {
    console.log(`  ${p.slug}: ${p.images?.length || 0} images`)
  })
  
  console.log('\n📝 Updating products with image URLs...\n')
  
  for (const product of productsToUpdate) {
    console.log(`Updating ${product.slug}...`)
    
    const { data, error } = await supabase
      .from('products')
      .update({ images: product.images })
      .eq('slug', product.slug)
      .select()
    
    if (error) {
      console.error(`  ❌ Error:`, error.message)
      console.error(`  Full error:`, JSON.stringify(error, null, 2))
    } else {
      console.log(`  ✅ Updated successfully`)
      console.log(`  Result:`, JSON.stringify(data, null, 2))
    }
  }
  
  console.log('\n🔍 Verifying updates...\n')
  
  const { data: verifyData, error: verifyError } = await supabase
    .from('products')
    .select('slug, name, images')
    .in('slug', productsToUpdate.map(p => p.slug))
  
  if (verifyError) {
    console.error('❌ Error verifying:', verifyError)
    return
  }
  
  console.log('Final state:')
  verifyData?.forEach(p => {
    console.log(`  ${p.slug}: ${p.images?.length || 0} images`)
    if (p.images?.length > 0) {
      console.log(`    First image: ${p.images[0]}`)
    }
  })
  
  console.log('\n🎉 Done!')
}

fixDatabase().catch(console.error)
