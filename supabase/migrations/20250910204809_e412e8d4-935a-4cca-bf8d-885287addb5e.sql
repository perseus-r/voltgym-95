-- Add comprehensive RLS policies for profiles table to secure user personal information

-- Drop existing policies to recreate them with more restrictive settings
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;  
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Create more secure RLS policies for the profiles table
-- Users can only view their own profile
CREATE POLICY "Users can view their own profile only" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING (auth.uid() = user_id);

-- Users can only insert their own profile
CREATE POLICY "Users can insert their own profile only" 
ON public.profiles 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = user_id);

-- Users can only update their own profile
CREATE POLICY "Users can update their own profile only" 
ON public.profiles 
FOR UPDATE 
TO authenticated 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Explicitly restrict DELETE operations - users cannot delete their profiles
-- This prevents data loss and maintains data integrity
CREATE POLICY "Prevent profile deletion" 
ON public.profiles 
FOR DELETE 
TO authenticated 
USING (false);

-- Ensure RLS is enabled on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Add comment to document security measures
COMMENT ON TABLE public.profiles IS 'Contains sensitive user personal information. Protected by strict RLS policies allowing only profile owners to access their own data.';