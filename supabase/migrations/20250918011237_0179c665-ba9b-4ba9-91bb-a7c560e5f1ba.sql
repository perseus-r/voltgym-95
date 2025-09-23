-- Insert example workout template if it doesn't exist
INSERT INTO public.workout_templates (
  name, 
  description, 
  focus, 
  difficulty_level, 
  estimated_duration, 
  target_muscle_groups
) 
SELECT 
  'Push Day - Peito e Tríceps',
  'Treino focado em exercícios de empurrar, trabalhando principalmente peito, ombros e tríceps. Ideal para ganho de massa muscular.',
  'Peito & Tríceps',
  3,
  60,
  ARRAY['peito', 'triceps', 'ombros']
WHERE NOT EXISTS (
  SELECT 1 FROM public.workout_templates WHERE name = 'Push Day - Peito e Tríceps'
);

-- Insert more example templates
INSERT INTO public.workout_templates (
  name, 
  description, 
  focus, 
  difficulty_level, 
  estimated_duration, 
  target_muscle_groups
) 
SELECT * FROM (VALUES
  ('Pull Day - Costas e Bíceps', 'Treino de puxada focado em costas, bíceps e rear delt. Perfeito para desenvolver a musculatura das costas.', 'Costas & Bíceps', 3, 55, ARRAY['costas', 'biceps', 'ombros']),
  ('Leg Day - Pernas Completo', 'Treino intenso de pernas trabalhando quadríceps, posterior, glúteos e panturrilhas.', 'Pernas', 4, 70, ARRAY['pernas', 'gluteos', 'panturrilha']),
  ('Upper Body - Iniciante', 'Treino de corpo superior para iniciantes, com foco em movimentos básicos e seguros.', 'Corpo Superior', 1, 45, ARRAY['peito', 'costas', 'ombros', 'bracos']),
  ('HIIT Funcional', 'Treino funcional de alta intensidade para queima de gordura e condicionamento.', 'Funcional', 3, 30, ARRAY['corpo-todo'])
) AS v(name, description, focus, difficulty_level, estimated_duration, target_muscle_groups)
WHERE NOT EXISTS (
  SELECT 1 FROM public.workout_templates wt WHERE wt.name = v.name
);