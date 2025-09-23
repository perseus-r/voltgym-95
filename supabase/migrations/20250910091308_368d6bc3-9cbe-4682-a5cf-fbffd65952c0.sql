-- Fix profiles table constraints and update design for Volt app
-- Remove old check constraints that are causing issues
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_goal_check;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_experience_level_check;

-- Add proper check constraints
ALTER TABLE public.profiles ADD CONSTRAINT profiles_goal_check 
CHECK (goal IN ('massa', 'gordura', 'forca', 'resistencia'));

ALTER TABLE public.profiles ADD CONSTRAINT profiles_experience_level_check 
CHECK (experience_level IN ('iniciante', 'intermediario', 'avancado'));

-- Add workout_location field for new question
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS workout_location TEXT DEFAULT 'academia';

-- Add check constraint for workout_location
ALTER TABLE public.profiles ADD CONSTRAINT profiles_workout_location_check 
CHECK (workout_location IN ('academia', 'casa', 'crossfit', 'parque', 'hibrido'));