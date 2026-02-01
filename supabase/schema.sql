-- ============================================
-- E-COMMERCE DATABASE SCHEMA - PHASE 0
-- ============================================
-- This schema implements a secure foundation with:
-- - User profiles with role-based access
-- - Row Level Security (RLS) enabled
-- - Automatic profile creation on signup
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES TABLE
-- ============================================
-- Stores user profile information and roles
-- Linked to Supabase Auth users

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

-- Policy: Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id 
    AND role = (SELECT role FROM profiles WHERE id = auth.uid())
  );

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Allow profile creation during signup
CREATE POLICY "Allow profile creation on signup"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profile changes
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- AUTO-CREATE PROFILE ON USER SIGNUP
-- ============================================

-- Function to create profile when user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    'user'  -- Default role is 'user'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to call handle_new_user when a user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- SEED DATA (Optional - Create first admin)
-- ============================================
-- After you create your first user via the signup form,
-- Run this to make them an admin (replace 'user-email@example.com'):
-- 
-- UPDATE profiles 
-- SET role = 'admin' 
-- WHERE email = 'your-email@example.com';
-- ============================================
