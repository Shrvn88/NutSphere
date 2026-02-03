-- =====================================================
-- REVERT: Fix order items unit prices back
-- =====================================================

-- Revert the previous multiplication
UPDATE order_items
SET unit_price = unit_price / 100
WHERE unit_price > 1000
  AND created_at < '2026-02-02 00:00:00';
