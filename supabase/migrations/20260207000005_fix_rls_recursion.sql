-- Fix RLS recursion issue on profiles table

-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can do everything on profiles" ON profiles;

-- Create a security definer function to check admin role (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Recreate admin policy without recursion
CREATE POLICY "Admins can update all profiles" ON profiles
  FOR UPDATE USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can delete profiles" ON profiles
  FOR DELETE USING (public.is_admin(auth.uid()));
