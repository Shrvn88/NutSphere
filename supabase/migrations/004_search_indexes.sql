-- Add indexes for search performance
-- Run this in Supabase SQL Editor

-- Index for sorting by price
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);

-- Index for sorting by rating
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating_average DESC, rating_count DESC);

-- Index for sorting by popularity (sales)
CREATE INDEX IF NOT EXISTS idx_products_popularity ON products(sales_count DESC, views_count DESC);

-- Index for sorting by newest
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id) WHERE is_active = true;

-- Index for active products
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active) WHERE is_active = true;

-- Full-text search index for name and description (fuzzy matching)
-- This enables fast text search with trigram similarity
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- GIN index for fuzzy text search on name
CREATE INDEX IF NOT EXISTS idx_products_name_trgm ON products USING gin(name gin_trgm_ops);

-- GIN index for fuzzy text search on description
CREATE INDEX IF NOT EXISTS idx_products_description_trgm ON products USING gin(description gin_trgm_ops);

-- Full-text search using tsvector (more accurate for full words)
ALTER TABLE products ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- Update search vector for existing rows
UPDATE products 
SET search_vector = to_tsvector('english', coalesce(name, '') || ' ' || coalesce(description, ''));

-- Create trigger to automatically update search_vector on insert/update
CREATE OR REPLACE FUNCTION products_search_vector_update() RETURNS trigger AS $$
BEGIN
  NEW.search_vector := to_tsvector('english', coalesce(NEW.name, '') || ' ' || coalesce(NEW.description, ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_search_vector_trigger ON products;
CREATE TRIGGER products_search_vector_trigger
  BEFORE INSERT OR UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION products_search_vector_update();

-- GIN index for full-text search
CREATE INDEX IF NOT EXISTS idx_products_search_vector ON products USING gin(search_vector);

-- Composite index for common queries (active products in category, sorted by price)
CREATE INDEX IF NOT EXISTS idx_products_category_price ON products(category_id, price) WHERE is_active = true;

-- Composite index for featured products
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured, created_at DESC) WHERE is_active = true AND is_featured = true;

-- Analyze tables to update statistics for query planner
ANALYZE products;
ANALYZE categories;

-- Verify indexes were created
SELECT 
  tablename,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'products'
ORDER BY indexname;
