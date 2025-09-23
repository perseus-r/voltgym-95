-- Allow admins to view all profiles
CREATE POLICY IF NOT EXISTS "Admins can select all profiles"
ON public.profiles
FOR SELECT
USING (public.is_admin());