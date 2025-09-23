-- Add phone field to profiles table
ALTER TABLE public.profiles ADD COLUMN phone TEXT;

-- Create index for better phone search performance
CREATE INDEX idx_profiles_phone ON public.profiles(phone);