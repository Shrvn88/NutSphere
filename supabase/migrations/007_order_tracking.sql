-- Phase 5: Add order tracking and courier information
ALTER TABLE orders
ADD COLUMN courier_name TEXT,
ADD COLUMN tracking_id TEXT,
ADD COLUMN tracking_url TEXT;

-- Add index for tracking lookups
CREATE INDEX idx_orders_tracking_id ON orders(tracking_id);

-- Add comments
COMMENT ON COLUMN orders.courier_name IS 'Name of courier service (e.g., Delhivery, BlueDart)';
COMMENT ON COLUMN orders.tracking_id IS 'Courier tracking number/AWB number';
COMMENT ON COLUMN orders.tracking_url IS 'Full tracking URL for the shipment';
