-- Test and strengthen RLS policies for profiles table
-- First, let's verify the current RLS is enabled
SELECT schemaname, tablename, rowsecurity FROM pg_tables WHERE tablename = 'profiles';

-- Add a more explicit policy to prevent any potential data leakage
-- Drop existing policies and recreate with stronger security
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create stronger, more explicit RLS policies
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Ensure no public access to profiles
REVOKE ALL ON public.profiles FROM public;
REVOKE ALL ON public.profiles FROM anon;

-- Grant only necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;

-- Also strengthen the subscribers table policies
DROP POLICY IF EXISTS "Users can view their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can insert their own subscription" ON public.subscribers;
DROP POLICY IF EXISTS "Users can update their own subscription" ON public.subscribers;

CREATE POLICY "subscribers_select_own" ON public.subscribers
  FOR SELECT 
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "subscribers_insert_own" ON public.subscribers
  FOR INSERT 
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "subscribers_update_own" ON public.subscribers
  FOR UPDATE 
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Revoke public access from subscribers table
REVOKE ALL ON public.subscribers FROM public;
REVOKE ALL ON public.subscribers FROM anon;
GRANT SELECT, INSERT, UPDATE ON public.subscribers TO authenticated;