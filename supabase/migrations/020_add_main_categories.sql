-- Add main product type categories (Nuts and Seeds)
-- This migration adds the two main category types for NutSphere

-- First, let's add a parent_category column to support category hierarchy
ALTER TABLE categories ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES categories(id) ON DELETE SET NULL;
ALTER TABLE categories ADD COLUMN IF NOT EXISTS category_type TEXT DEFAULT 'product' CHECK (category_type IN ('main', 'product'));

-- Insert main categories (Nuts and Seeds)
INSERT INTO categories (name, slug, description, display_order, category_type) VALUES
  ('Nuts', 'nuts', 'Premium quality nuts including almonds, cashews, walnuts, and pistachios', 1, 'main'),
  ('Seeds', 'seeds', 'Nutritious seeds including chia, flax, pumpkin, and sunflower seeds', 2, 'main')
ON CONFLICT (slug) DO UPDATE SET 
  description = EXCLUDED.description,
  category_type = EXCLUDED.category_type;

-- Update existing categories to be under Nuts
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'nuts')
WHERE slug IN ('almonds', 'cashews', 'walnuts', 'pistachios', 'mixed-nuts')
  AND parent_id IS NULL;

-- If any seed categories exist, put them under Seeds
UPDATE categories 
SET parent_id = (SELECT id FROM categories WHERE slug = 'seeds')
WHERE slug IN ('chia-seeds', 'flax-seeds', 'pumpkin-seeds', 'sunflower-seeds', 'mixed-seeds')
  AND parent_id IS NULL;
