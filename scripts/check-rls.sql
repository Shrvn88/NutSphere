-- Check current RLS policies on products table
-- Run this in Supabase SQL Editor

-- Show all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'products';

-- To fix the issue, add this policy to allow anonymous updates:
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to UPDATE products (temporary for data migration)
CREATE POLICY "Allow anonymous updates during setup"
ON products
FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- After running the update script, you can remove this policy:
-- DROP POLICY "Allow anonymous updates during setup" ON products;
