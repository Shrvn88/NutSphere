-- Migration: Create product variants table
-- Allows products to have multiple variants (e.g., 250g, 500g, 1000g with different prices)

CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL, -- e.g., "250g", "500g", "1kg"
  weight_grams INTEGER, -- Weight in grams for sorting
  price INTEGER NOT NULL, -- Price in paisa
  compare_at_price INTEGER, -- Original price for showing discount
  sku VARCHAR(50),
  stock_quantity INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT false, -- Default selected variant
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_active ON product_variants(product_id, is_active);

-- Enable RLS
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read active variants
CREATE POLICY "Anyone can read active variants"
  ON product_variants FOR SELECT
  USING (is_active = true);

-- Policy: Admins can do everything
CREATE POLICY "Admins can manage variants"
  ON product_variants FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION update_variant_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_variant_timestamp
  BEFORE UPDATE ON product_variants
  FOR EACH ROW
  EXECUTE FUNCTION update_variant_updated_at();

-- Add variant_id to order_items table to track which variant was ordered
ALTER TABLE order_items 
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id);

-- Add variant_id to cart_items table
ALTER TABLE cart_items
ADD COLUMN IF NOT EXISTS variant_id UUID REFERENCES product_variants(id);
