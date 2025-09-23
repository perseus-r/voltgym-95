-- Create workout templates table
CREATE TABLE public.workout_templates (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'custom',
  difficulty text NOT NULL DEFAULT 'intermediario',
  duration_minutes integer NOT NULL DEFAULT 45,
  focus text NOT NULL,
  tags text[] DEFAULT '{}',
  rating decimal DEFAULT 0,
  completions integer DEFAULT 0,
  is_public boolean DEFAULT false,
  created_by uuid,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create template exercises table
CREATE TABLE public.workout_template_exercises (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  template_id uuid NOT NULL REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  exercise_id uuid NOT NULL REFERENCES public.exercises(id),
  sets integer NOT NULL DEFAULT 3,
  reps_min integer,
  reps_max integer,
  reps_target text,
  weight_suggestion numeric,
  rest_seconds integer DEFAULT 90,
  order_index integer NOT NULL,
  notes text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create weekly schedule table
CREATE TABLE public.weekly_schedule (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  day_of_week text NOT NULL, -- 'monday', 'tuesday', etc.
  template_id uuid REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  scheduled_at timestamp with time zone NOT NULL DEFAULT now(),
  is_completed boolean DEFAULT false,
  completed_at timestamp with time zone,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id, day_of_week, template_id)
);

-- Enable RLS on all tables
ALTER TABLE public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_schedule ENABLE ROW LEVEL SECURITY;

-- RLS Policies for workout_templates
CREATE POLICY "Public templates are viewable by everyone" 
ON public.workout_templates FOR SELECT 
USING (is_public = true OR created_by = auth.uid());

CREATE POLICY "Users can create their own templates" 
ON public.workout_templates FOR INSERT 
WITH CHECK (created_by = auth.uid());

CREATE POLICY "Users can update their own templates" 
ON public.workout_templates FOR UPDATE 
USING (created_by = auth.uid());

CREATE POLICY "Users can delete their own templates" 
ON public.workout_templates FOR DELETE 
USING (created_by = auth.uid());

-- RLS Policies for workout_template_exercises
CREATE POLICY "Template exercises are viewable by template owners" 
ON public.workout_template_exercises FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.workout_templates wt 
  WHERE wt.id = workout_template_exercises.template_id 
  AND (wt.is_public = true OR wt.created_by = auth.uid())
));

CREATE POLICY "Users can manage exercises in their templates" 
ON public.workout_template_exercises FOR ALL 
USING (EXISTS (
  SELECT 1 FROM public.workout_templates wt 
  WHERE wt.id = workout_template_exercises.template_id 
  AND wt.created_by = auth.uid()
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.workout_templates wt 
  WHERE wt.id = workout_template_exercises.template_id 
  AND wt.created_by = auth.uid()
));

-- RLS Policies for weekly_schedule
CREATE POLICY "Users can manage their own schedule" 
ON public.weekly_schedule FOR ALL 
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Create indexes for better performance
CREATE INDEX idx_workout_templates_category ON public.workout_templates(category);
CREATE INDEX idx_workout_templates_created_by ON public.workout_templates(created_by);
CREATE INDEX idx_workout_template_exercises_template_id ON public.workout_template_exercises(template_id);
CREATE INDEX idx_weekly_schedule_user_day ON public.weekly_schedule(user_id, day_of_week);

-- Add trigger for updated_at
CREATE TRIGGER update_workout_templates_updated_at
  BEFORE UPDATE ON public.workout_templates
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Seed some public templates
INSERT INTO public.workout_templates (name, description, category, difficulty, duration_minutes, focus, tags, is_public, created_by) VALUES
('Push Day Intenso', 'Treino focado em movimentos de empurrar para desenvolvimento de força e massa muscular em peito, ombros e tríceps', 'strength', 'intermediario', 75, 'Peito, Ombros, Tríceps', ARRAY['força', 'hipertrofia', 'push', 'peito'], true, null),
('HIIT Fat Burner', 'Treino intervalado de alta intensidade para máxima queima calórica e condicionamento cardiovascular', 'hiit', 'avancado', 30, 'Queima de Gordura', ARRAY['hiit', 'cardio', 'queima', 'intervalado'], true, null),
('Pull Day Completo', 'Desenvolvimento completo de costas, bíceps e posteriores com foco em força e definição', 'strength', 'intermediario', 70, 'Costas, Bíceps, Posteriores', ARRAY['força', 'costas', 'pull', 'bíceps'], true, null),
('Leg Day Destruidor', 'Treino intenso para pernas e glúteos com foco em hipertrofia e força funcional', 'strength', 'avancado', 80, 'Pernas, Glúteos, Panturrilhas', ARRAY['pernas', 'glúteos', 'força', 'hipertrofia'], true, null),
('Cardio LISS Regenerativo', 'Treino de baixa intensidade para recuperação ativa e queima de gordura sustentável', 'cardio', 'iniciante', 45, 'Condicionamento, Recuperação', ARRAY['cardio', 'liss', 'recuperação', 'baixa intensidade'], true, null);

-- Seed template exercises for Push Day Intenso (using existing exercise IDs)
INSERT INTO public.workout_template_exercises (template_id, exercise_id, sets, reps_min, reps_max, reps_target, weight_suggestion, rest_seconds, order_index, notes)
SELECT 
  wt.id,
  e.id,
  CASE 
    WHEN e.name ILIKE '%supino%' THEN 4
    WHEN e.name ILIKE '%desenvolvimento%' THEN 4
    ELSE 3
  END as sets,
  8 as reps_min,
  12 as reps_max,
  '8-12' as reps_target,
  CASE 
    WHEN e.name ILIKE '%supino%' THEN 80
    WHEN e.name ILIKE '%desenvolvimento%' THEN 40
    ELSE 30
  END as weight_suggestion,
  90 as rest_seconds,
  ROW_NUMBER() OVER (ORDER BY e.name) as order_index,
  'Foque na execução controlada e conexão mente-músculo' as notes
FROM public.workout_templates wt
CROSS JOIN public.exercises e
WHERE wt.name = 'Push Day Intenso'
AND (
  e.name ILIKE '%supino%' OR 
  e.name ILIKE '%desenvolvimento%' OR 
  e.name ILIKE '%tríceps%' OR
  e.name ILIKE '%mergulho%' OR
  e.name ILIKE '%elevação lateral%'
)
LIMIT 8;