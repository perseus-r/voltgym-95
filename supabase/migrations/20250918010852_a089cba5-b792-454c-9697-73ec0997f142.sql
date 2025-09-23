-- Create workout templates table for the library
CREATE TABLE public.workout_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  focus TEXT NOT NULL,
  difficulty_level INTEGER NOT NULL DEFAULT 3,
  estimated_duration INTEGER NOT NULL DEFAULT 45,
  muscle_groups TEXT[] NOT NULL DEFAULT '{}',
  is_public BOOLEAN NOT NULL DEFAULT true,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Workout templates are viewable by everyone" 
ON public.workout_templates 
FOR SELECT 
USING (is_public = true);

CREATE POLICY "Admins can manage workout templates" 
ON public.workout_templates 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Insert first workout template
INSERT INTO public.workout_templates (
  name, 
  description, 
  focus, 
  difficulty_level, 
  estimated_duration, 
  muscle_groups
) VALUES (
  'Push Day - Peito e Tríceps',
  'Treino focado em exercícios de empurrar, trabalhando principalmente peito, ombros e tríceps.',
  'Peito & Tríceps',
  3,
  60,
  ARRAY['peito', 'triceps', 'ombros']
);

-- Get the template ID for exercises
DO $$
DECLARE
  template_id UUID;
  supino_id UUID;
  supino_inclinado_id UUID;
  mergulho_id UUID;
  triceps_testa_id UUID;
BEGIN
  -- Get template ID
  SELECT id INTO template_id FROM public.workout_templates WHERE name = 'Push Day - Peito e Tríceps';
  
  -- Get exercise IDs (assuming they exist)
  SELECT id INTO supino_id FROM public.exercises WHERE name ILIKE '%supino%reto%' LIMIT 1;
  SELECT id INTO supino_inclinado_id FROM public.exercises WHERE name ILIKE '%supino%inclinado%' LIMIT 1;
  SELECT id INTO mergulho_id FROM public.exercises WHERE name ILIKE '%mergulho%' LIMIT 1;  
  SELECT id INTO triceps_testa_id FROM public.exercises WHERE name ILIKE '%triceps%testa%' LIMIT 1;
  
  -- Insert template exercises if we found the exercises
  IF supino_id IS NOT NULL THEN
    INSERT INTO public.template_exercises (template_id, exercise_id, order_index, sets, reps_target, rest_seconds, weight_suggestion)
    VALUES (template_id, supino_id, 1, 4, '8-10', 90, 60);
  END IF;
  
  IF supino_inclinado_id IS NOT NULL THEN
    INSERT INTO public.template_exercises (template_id, exercise_id, order_index, sets, reps_target, rest_seconds, weight_suggestion)
    VALUES (template_id, supino_inclinado_id, 2, 3, '10-12', 90, 50);
  END IF;
  
  IF mergulho_id IS NOT NULL THEN
    INSERT INTO public.template_exercises (template_id, exercise_id, order_index, sets, reps_target, rest_seconds, weight_suggestion)
    VALUES (template_id, mergulho_id, 3, 3, 'AMRAP', 120, NULL);
  END IF;
  
  IF triceps_testa_id IS NOT NULL THEN
    INSERT INTO public.template_exercises (template_id, exercise_id, order_index, sets, reps_target, rest_seconds, weight_suggestion)
    VALUES (template_id, triceps_testa_id, 4, 3, '12', 60, 25);
  END IF;
END $$;