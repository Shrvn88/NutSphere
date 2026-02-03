-- =====================================================
-- FIX EXISTING ORDER ITEMS UNIT PRICES
-- Convert from paisa (cents) to rupees
-- =====================================================

-- This migration fixes unit_price in order_items table
-- Old system stored prices in paisa (1 rupee = 100 paisa)
-- New system stores prices directly in rupees

-- Only update prices that are likely in paisa format (< 10000)
-- This assumes no product costs more than ₹10,000
UPDATE order_items
SET unit_price = unit_price * 100
WHERE unit_price < 10000
  AND created_at < '2026-02-02 00:00:00';

-- Add a comment for tracking
COMMENT ON TABLE order_items IS 'Updated unit_price from paisa to rupees on 2026-02-02';
