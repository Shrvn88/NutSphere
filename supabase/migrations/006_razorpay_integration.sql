-- Add Razorpay payment fields to orders table
ALTER TABLE orders
ADD COLUMN razorpay_order_id TEXT,
ADD COLUMN razorpay_payment_id TEXT,
ADD COLUMN razorpay_signature TEXT;

-- Add indexes for faster lookups
CREATE INDEX idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX idx_orders_razorpay_payment_id ON orders(razorpay_payment_id);

-- Add comment for documentation
COMMENT ON COLUMN orders.razorpay_order_id IS 'Razorpay order ID created when order is placed';
COMMENT ON COLUMN orders.razorpay_payment_id IS 'Razorpay payment ID received after successful payment';
COMMENT ON COLUMN orders.razorpay_signature IS 'Razorpay signature for payment verification';

-- Create function to increment stock (for refunds)
CREATE OR REPLACE FUNCTION increment_stock(product_id UUID, amount INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity + amount,
      updated_at = NOW()
  WHERE id = product_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
