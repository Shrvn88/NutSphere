-- Migration: Cleanup categories - keep only Nuts and Seeds
-- This migration consolidates all sub-categories into the two main categories

-- First, ensure Nuts and Seeds categories exist
INSERT INTO categories (name, slug, description, display_order) VALUES
  ('Nuts', 'nuts', 'Premium quality nuts including almonds, cashews, pistachios, walnuts and more', 1),
  ('Seeds', 'seeds', 'Nutritious seeds including chia, flax, pumpkin, sunflower and more', 2)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  display_order = EXCLUDED.display_order;

-- Get the IDs of Nuts and Seeds categories
DO $$
DECLARE
  nuts_id UUID;
  seeds_id UUID;
BEGIN
  -- Get Nuts category ID
  SELECT id INTO nuts_id FROM categories WHERE slug = 'nuts';
  
  -- Get Seeds category ID
  SELECT id INTO seeds_id FROM categories WHERE slug = 'seeds';
  
  -- Move all nut-related products to Nuts category
  -- (Almonds, Cashews, Pistachios, Walnuts, Mixed Nuts, etc.)
  UPDATE products 
  SET category_id = nuts_id 
  WHERE category_id IN (
    SELECT id FROM categories 
    WHERE slug IN ('almonds', 'cashews', 'pistachios', 'walnuts', 'mixed-nuts', 'peanuts', 'hazelnuts', 'macadamia', 'pecans', 'brazil-nuts')
    OR LOWER(name) LIKE '%almond%'
    OR LOWER(name) LIKE '%cashew%'
    OR LOWER(name) LIKE '%pistachio%'
    OR LOWER(name) LIKE '%walnut%'
    OR LOWER(name) LIKE '%mixed nuts%'
    OR LOWER(name) LIKE '%peanut%'
    OR LOWER(name) LIKE '%hazelnut%'
    OR LOWER(name) LIKE '%macadamia%'
    OR LOWER(name) LIKE '%pecan%'
  );
  
  -- Move all seed-related products to Seeds category
  -- (Chia, Flax, Pumpkin, Sunflower, etc.)
  UPDATE products 
  SET category_id = seeds_id 
  WHERE category_id IN (
    SELECT id FROM categories 
    WHERE slug IN ('chia-seeds', 'flax-seeds', 'pumpkin-seeds', 'sunflower-seeds', 'sesame-seeds', 'hemp-seeds')
    OR LOWER(name) LIKE '%chia%'
    OR LOWER(name) LIKE '%flax%'
    OR LOWER(name) LIKE '%pumpkin%'
    OR LOWER(name) LIKE '%sunflower%'
    OR LOWER(name) LIKE '%sesame%'
    OR LOWER(name) LIKE '%hemp%'
    OR LOWER(name) LIKE '%seed%'
  );
  
  -- Delete old sub-categories (keep only Nuts and Seeds)
  DELETE FROM categories 
  WHERE slug NOT IN ('nuts', 'seeds');
  
END $$;

-- Verify the changes
-- SELECT * FROM categories;
-- SELECT p.name, c.name as category FROM products p JOIN categories c ON p.category_id = c.id;
