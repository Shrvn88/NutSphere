-- Migration: Add admin RLS policies for product management
-- This allows admins to insert, update, and delete products

-- First, create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (b
    SELECT 1 FROM profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing restrictive policies on products if they exist
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Admins can view all products" ON products;

-- Create new policies for products table
-- Anyone can view active products
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  USING (is_active = true);

-- Admins can view ALL products (including inactive)
CREATE POLICY "Admins can view all products"
  ON products
  FOR SELECT
  USING (is_admin());

-- Admins can insert products
CREATE POLICY "Admins can insert products"
  ON products
  FOR INSERT
  WITH CHECK (is_admin());

-- Admins can update products
CREATE POLICY "Admins can update products"
  ON products
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

-- Admins can delete products
CREATE POLICY "Admins can delete products"
  ON products
  FOR DELETE
  USING (is_admin());

-- Also add policies for categories if needed
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

CREATE POLICY "Admins can insert categories"
  ON categories
  FOR INSERT
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update categories"
  ON categories
  FOR UPDATE
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "Admins can delete categories"
  ON categories
  FOR DELETE
  USING (is_admin());
