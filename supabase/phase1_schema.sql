-- ============================================
-- E-COMMERCE DATABASE SCHEMA - PHASE 1
-- Product Catalog: Categories & Products
-- ============================================

-- ============================================
-- CATEGORIES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for categories
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_active ON categories(is_active);
CREATE INDEX IF NOT EXISTS idx_categories_order ON categories(display_order);

-- ============================================
-- PRODUCTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  stock_quantity INTEGER NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  images TEXT[] DEFAULT '{}',
  weight_grams INTEGER,
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  rating_average DECIMAL(3, 2) DEFAULT 0 CHECK (rating_average >= 0 AND rating_average <= 5),
  rating_count INTEGER DEFAULT 0,
  views_count INTEGER DEFAULT 0,
  sales_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for products
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating_average);
CREATE INDEX IF NOT EXISTS idx_products_sales ON products(sales_count);
CREATE INDEX IF NOT EXISTS idx_products_name ON products USING gin(to_tsvector('english', name));

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active categories
CREATE POLICY "Anyone can view active categories"
  ON categories
  FOR SELECT
  USING (is_active = true);

-- Policy: Admins can manage categories (handled via service role)

-- Enable RLS on products
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can view active products
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (is_active = true);

-- Policy: Admins can manage products (handled via service role)

-- ============================================
-- FUNCTIONS
-- ============================================

-- Trigger to update updated_at on category changes
CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update updated_at on product changes
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate discounted price
CREATE OR REPLACE FUNCTION get_discounted_price(original_price DECIMAL, discount_pct INTEGER)
RETURNS DECIMAL AS $$
BEGIN
  RETURN ROUND(original_price * (100 - discount_pct) / 100, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to check if product is in stock
CREATE OR REPLACE FUNCTION is_in_stock(stock_qty INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN stock_qty > 0;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to increment product views
CREATE OR REPLACE FUNCTION increment_product_views(product_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE products 
  SET views_count = views_count + 1 
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- SEED DATA (Sample categories and products)
-- ============================================

-- Insert sample categories
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Almonds', 'almonds', 'Premium quality almonds', 1),
  ('Cashews', 'cashews', 'Fresh and crunchy cashews', 2),
  ('Walnuts', 'walnuts', 'Healthy walnuts', 3),
  ('Pistachios', 'pistachios', 'Delicious pistachios', 4),
  ('Mixed Nuts', 'mixed-nuts', 'Assorted nut varieties', 5)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (category_id, name, slug, description, price, discount_percentage, stock_quantity, weight_grams, is_featured) 
SELECT 
  c.id,
  'Premium ' || c.name,
  'premium-' || c.slug,
  'High quality ' || LOWER(c.name) || ' sourced from the best farms',
  599.00,
  10,
  100,
  500,
  true
FROM categories c
ON CONFLICT (slug) DO NOTHING;
