-- Phase 3: Cart & Checkout Database Schema
-- Run this in Supabase SQL Editor

-- =====================================================
-- CART ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id TEXT, -- For guest users
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure user has either user_id OR session_id
  CONSTRAINT cart_user_or_session CHECK (
    (user_id IS NOT NULL AND session_id IS NULL) OR 
    (user_id IS NULL AND session_id IS NOT NULL)
  ),
  
  -- One cart item per product per user/session
  UNIQUE NULLS NOT DISTINCT (user_id, session_id, product_id)
);

-- Indexes for cart queries
CREATE INDEX idx_cart_items_user_id ON cart_items(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_cart_items_session_id ON cart_items(session_id) WHERE session_id IS NOT NULL;
CREATE INDEX idx_cart_items_product_id ON cart_items(product_id);

-- =====================================================
-- ADDRESSES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT 'India',
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for user addresses
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_default ON addresses(user_id, is_default) WHERE is_default = true;

-- =====================================================
-- ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  
  -- Customer info (captured at order time)
  customer_email TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  
  -- Shipping address
  shipping_address_line1 TEXT NOT NULL,
  shipping_address_line2 TEXT,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  shipping_postal_code TEXT NOT NULL,
  shipping_country TEXT NOT NULL DEFAULT 'India',
  
  -- Order totals (in paisa/cents)
  subtotal INTEGER NOT NULL CHECK (subtotal >= 0),
  discount_amount INTEGER DEFAULT 0 CHECK (discount_amount >= 0),
  shipping_cost INTEGER DEFAULT 0 CHECK (shipping_cost >= 0),
  tax_amount INTEGER DEFAULT 0 CHECK (tax_amount >= 0),
  total_amount INTEGER NOT NULL CHECK (total_amount >= 0),
  
  -- Order status
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at TIMESTAMPTZ,
  shipped_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  
  -- Notes
  customer_notes TEXT,
  admin_notes TEXT
);

-- Indexes for order queries
CREATE INDEX idx_orders_user_id ON orders(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_number ON orders(order_number);

-- =====================================================
-- ORDER ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  
  -- Product snapshot (captured at order time)
  product_name TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  product_image TEXT,
  
  -- Pricing (in paisa/cents)
  unit_price INTEGER NOT NULL CHECK (unit_price >= 0),
  discount_percentage INTEGER DEFAULT 0 CHECK (discount_percentage >= 0 AND discount_percentage <= 100),
  discounted_price INTEGER NOT NULL CHECK (discounted_price >= 0),
  
  -- Quantity
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  
  -- Line total
  line_total INTEGER NOT NULL CHECK (line_total >= 0),
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for order items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- CART ITEMS POLICIES
-- Users can see their own cart items
CREATE POLICY "Users can view own cart items"
ON cart_items FOR SELECT
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- Users can insert their own cart items
CREATE POLICY "Users can insert own cart items"
ON cart_items FOR INSERT
WITH CHECK (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- Users can update their own cart items
CREATE POLICY "Users can update own cart items"
ON cart_items FOR UPDATE
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- Users can delete their own cart items
CREATE POLICY "Users can delete own cart items"
ON cart_items FOR DELETE
USING (
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  (auth.uid() IS NULL AND session_id IS NOT NULL)
);

-- ADDRESSES POLICIES
CREATE POLICY "Users can view own addresses"
ON addresses FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own addresses"
ON addresses FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
ON addresses FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
ON addresses FOR DELETE
USING (auth.uid() = user_id);

-- ORDERS POLICIES
-- Users can view their own orders
CREATE POLICY "Users can view own orders"
ON orders FOR SELECT
USING (
  auth.uid() = user_id OR
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Only server can create orders (will use service role key)
-- Users cannot directly insert orders

-- ORDER ITEMS POLICIES
-- Users can view items for their orders
CREATE POLICY "Users can view own order items"
ON order_items FOR SELECT
USING (
  order_id IN (
    SELECT id FROM orders 
    WHERE user_id = auth.uid() OR 
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
  )
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
DECLARE
  new_number TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    -- Generate format: ORD-YYYYMMDD-XXXX
    new_number := 'ORD-' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || 
                  LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
    
    -- Check if exists
    SELECT EXISTS(SELECT 1 FROM orders WHERE order_number = new_number) INTO exists;
    
    EXIT WHEN NOT exists;
  END LOOP;
  
  RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER cart_items_updated_at BEFORE UPDATE ON cart_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER addresses_updated_at BEFORE UPDATE ON addresses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFY SETUP
-- =====================================================
SELECT 'Setup complete! Tables created:' as message;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('cart_items', 'addresses', 'orders', 'order_items')
ORDER BY table_name;
