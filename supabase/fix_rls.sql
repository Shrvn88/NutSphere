-- Fix infinite recursion in RLS policies
-- Run this in Supabase SQL Editor

-- Drop the problematic policies
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON profiles;

-- Recreate simple policy without recursion
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);
