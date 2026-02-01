# Product Images Storage Setup

## Option 1: Via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Enter:
   - **Name**: `product-images`
   - **Public bucket**: ✅ Enabled
   - **File size limit**: 5MB
   - **Allowed MIME types**: `image/jpeg, image/png, image/gif, image/webp`
5. Click **Create bucket**

### Set Storage Policies

After creating the bucket:

1. Click on the `product-images` bucket
2. Go to **Policies** tab
3. Add these policies:

**Policy 1: Public Read Access**
- Operation: SELECT
- Target roles: public
- Policy: `true` (allow all reads)

**Policy 2: Authenticated Upload**
- Operation: INSERT  
- Target roles: authenticated
- Policy: `bucket_id = 'product-images'`

**Policy 3: Authenticated Delete**
- Operation: DELETE
- Target roles: authenticated
- Policy: `bucket_id = 'product-images'`

---

## Option 2: Via SQL

Run this in the Supabase SQL Editor:

```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to view images
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY "Auth Upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete
CREATE POLICY "Auth Delete" ON storage.objects
FOR DELETE USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
```

---

## Usage

After setup, the admin can:
1. Click **Upload Images** button in product form
2. Select one or multiple images
3. Images automatically upload to Supabase Storage
4. URLs are automatically added to the product

The first image becomes the main product image.
