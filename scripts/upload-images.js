/**
 * Upload Product Images to Supabase Storage
 * Run this script once to upload all product images
 */

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Load environment variables manually
const envPath = path.join(__dirname, '..', '.env.local')
const envContent = fs.readFileSync(envPath, 'utf8')
const env = {}
envContent.split('\n').forEach(line => {
  const [key, ...valueParts] = line.split('=')
  if (key && valueParts.length) {
    env[key.trim()] = valueParts.join('=').trim()
  }
})

const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const BUCKET_NAME = 'product-images'
const IMAGES_DIR = path.join(__dirname, '..', 'images')

// Map folder names to category slugs
const folderToCategoryMap = {
  'almond': 'almonds',
  'Whole_cashew': 'cashews',
  'Black _raisns': 'walnuts', // We'll use walnuts as placeholder
  'Premimum_raisins': 'pistachios',
  'pumpkin_seeds': 'mixed-nuts',
  'Chia_seeds': 'mixed-nuts',
  'Sunflower_seeds': 'mixed-nuts'
}

async function uploadImages() {
  console.log('🚀 Starting image upload to Supabase Storage...\n')

  const folders = fs.readdirSync(IMAGES_DIR)
  const uploadedImages = {}

  for (const folder of folders) {
    const folderPath = path.join(IMAGES_DIR, folder)
    if (!fs.statSync(folderPath).isDirectory()) continue

    console.log(`📁 Processing folder: ${folder}`)
    
    const categorySlug = folderToCategoryMap[folder] || 'almonds'
    const images = fs.readdirSync(folderPath).filter(file => 
      file.match(/\.(jpg|jpeg|png|webp)$/i)
    )

    const uploadedUrls = []

    for (let i = 0; i < Math.min(images.length, 3); i++) { // Upload max 3 images per product
      const imageName = images[i]
      const imagePath = path.join(folderPath, imageName)
      const fileBuffer = fs.readFileSync(imagePath)
      
      // Create clean filename
      const ext = path.extname(imageName)
      const cleanName = `${categorySlug}-${i + 1}${ext}`.toLowerCase()
      const storagePath = `${categorySlug}/${cleanName}`

      console.log(`  ⬆️  Uploading: ${imageName} → ${storagePath}`)

      const { data, error } = await supabase.storage
        .from(BUCKET_NAME)
        .upload(storagePath, fileBuffer, {
          contentType: `image/${ext.slice(1)}`,
          upsert: true
        })

      if (error) {
        console.error(`  ❌ Error uploading ${imageName}:`, error.message)
      } else {
        const { data: { publicUrl } } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(storagePath)
        
        uploadedUrls.push(publicUrl)
        console.log(`  ✅ Uploaded successfully`)
      }
    }

    if (uploadedUrls.length > 0) {
      uploadedImages[categorySlug] = uploadedUrls
    }

    console.log('')
  }

  console.log('📊 Upload Summary:')
  console.log(JSON.stringify(uploadedImages, null, 2))

  // Now update the database
  console.log('\n📝 Updating database with image URLs...\n')

  for (const [categorySlug, imageUrls] of Object.entries(uploadedImages)) {
    const productSlug = `premium-${categorySlug}`
    
    const { data, error } = await supabase
      .from('products')
      .update({ images: imageUrls })
      .eq('slug', productSlug)

    if (error) {
      console.error(`❌ Error updating ${productSlug}:`, error.message)
    } else {
      console.log(`✅ Updated ${productSlug} with ${imageUrls.length} images`)
    }
  }

  console.log('\n🎉 All done! Images uploaded and database updated.')
}

uploadImages().catch(console.error)
