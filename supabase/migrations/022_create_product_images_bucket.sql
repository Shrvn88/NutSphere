-- Migration: Create product-images storage bucket
-- Run this in Supabase SQL Editor

-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[]
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']::text[];

-- Enable public access for the bucket
CREATE POLICY IF NOT EXISTS "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'product-images');

-- Allow authenticated users to upload
CREATE POLICY IF NOT EXISTS "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'product-images' AND auth.role() = 'authenticated');

-- Allow authenticated users to delete their uploads
CREATE POLICY IF NOT EXISTS "Authenticated users can delete images"
ON storage.objects FOR DELETE
USING (bucket_id = 'product-images' AND auth.role() = 'authenticated');
