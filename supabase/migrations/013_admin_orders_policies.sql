-- =====================================================
-- ADMIN ORDER MANAGEMENT POLICIES
-- =====================================================

-- Allow admins to update orders
CREATE POLICY "Admins can update orders"
ON orders FOR UPDATE
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
)
WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Allow admins to insert orders (if needed)
CREATE POLICY "Admins can insert orders"
ON orders FOR INSERT
WITH CHECK (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);

-- Allow admins to update order items (if needed)
CREATE POLICY "Admins can update order items"
ON order_items FOR UPDATE
USING (
  auth.uid() IN (SELECT id FROM profiles WHERE role = 'admin')
);
