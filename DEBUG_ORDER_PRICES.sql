-- Check actual order data to understand the format
-- Run this in Supabase SQL Editor

SELECT 
  o.order_number,
  o.total_amount as order_total,
  oi.product_name,
  oi.quantity,
  oi.unit_price as stored_price,
  oi.unit_price * oi.quantity as line_total,
  p.price as current_product_price
FROM order_items oi
JOIN orders o ON o.id = oi.order_id
LEFT JOIN products p ON p.name ILIKE oi.product_name
WHERE o.payment_status = 'paid'
ORDER BY o.created_at DESC
LIMIT 10;
