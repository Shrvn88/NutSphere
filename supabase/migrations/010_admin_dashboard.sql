-- Coupons Table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  description TEXT,
  discount_type VARCHAR(20) NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  min_order_amount NUMERIC(10, 2) DEFAULT 0,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  usage_per_user INTEGER DEFAULT 1,
  valid_from TIMESTAMPTZ NOT NULL,
  valid_until TIMESTAMPTZ NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coupons_code ON coupons(code);
CREATE INDEX idx_coupons_active ON coupons(is_active);

-- CMS Pages Table
CREATE TABLE IF NOT EXISTS cms_pages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug VARCHAR(255) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  description TEXT,
  meta_description VARCHAR(255),
  meta_keywords VARCHAR(500),
  is_published BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_cms_pages_slug ON cms_pages(slug);
CREATE INDEX idx_cms_pages_published ON cms_pages(is_published);

-- Coupon Usage Tracking
CREATE TABLE IF NOT EXISTS coupon_usage (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  coupon_id UUID NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount_applied NUMERIC(10, 2),
  used_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_coupon_usage_coupon ON coupon_usage(coupon_id);
CREATE INDEX idx_coupon_usage_user ON coupon_usage(user_id);
CREATE INDEX idx_coupon_usage_order ON coupon_usage(order_id);

-- Enable RLS
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE cms_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;

-- Coupons RLS Policies
CREATE POLICY "Anyone can view active coupons"
  ON coupons FOR SELECT
  USING (is_active AND valid_from <= NOW() AND valid_until >= NOW());

CREATE POLICY "Admins can view all coupons"
  ON coupons FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can create coupons"
  ON coupons FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can update coupons"
  ON coupons FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can delete coupons"
  ON coupons FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- CMS Pages RLS Policies
CREATE POLICY "Anyone can view published pages"
  ON cms_pages FOR SELECT
  USING (is_published);

CREATE POLICY "Admins can view all pages"
  ON cms_pages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can create pages"
  ON cms_pages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can update pages"
  ON cms_pages FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Admins can delete pages"
  ON cms_pages FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

-- Coupon Usage RLS Policies
CREATE POLICY "Users can view own coupon usage"
  ON coupon_usage FOR SELECT
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "System can insert coupon usage"
  ON coupon_usage FOR INSERT
  WITH CHECK (true);

-- Update triggers
CREATE OR REPLACE FUNCTION update_coupon_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_coupons_timestamp
AFTER UPDATE ON coupons
FOR EACH ROW
EXECUTE FUNCTION update_coupon_timestamp();

CREATE TRIGGER update_cms_pages_timestamp
AFTER UPDATE ON cms_pages
FOR EACH ROW
EXECUTE FUNCTION update_coupon_timestamp();

-- Add SKU and cost_price to products if not exists
ALTER TABLE products ADD COLUMN IF NOT EXISTS sku VARCHAR(100) UNIQUE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS cost_price NUMERIC(10, 2);

-- Update order status enum if needed
-- This assumes status column exists, add new statuses if needed
