-- Populate exercise categories
INSERT INTO public.exercise_categories (name, description, icon) VALUES
('Peito', 'Exercícios para desenvolvimento do peitoral', '💪'),
('Costas', 'Exercícios para fortalecimento das costas', '🏋️'),
('Pernas', 'Exercícios para membros inferiores', '🦵'),
('Ombros', 'Exercícios para deltoides', '🤸'),
('Braços', 'Exercícios para bíceps e tríceps', '💪'),
('Core', 'Exercícios para abdômen e core', '🔥');

-- Populate exercises with 3D model URLs (using placeholder URLs for now)
INSERT INTO public.exercises (name, category_id, primary_muscles, secondary_muscles, equipment, difficulty_level, instructions, form_tips, model_3d_url, demo_video_url, thumbnail_url) VALUES
-- PEITO
((SELECT name FROM public.exercise_categories WHERE name = 'Peito'), 
 (SELECT id FROM public.exercise_categories WHERE name = 'Peito'),
 ARRAY['Peitoral Maior', 'Peitoral Menor'],
 ARRAY['Tríceps', 'Deltoides Anterior'],
 'Barra',
 3,
 ARRAY['Deite-se no banco', 'Posicione as mãos na largura dos ombros', 'Desça a barra até o peito', 'Empurre com força'],
 ARRAY['Mantenha as escápulas retraídas', 'Pés firmes no chão', 'Controle a descida'],
 'https://models.example.com/supino-reto.glb',
 'https://videos.example.com/supino-reto.mp4',
 'https://images.example.com/supino-reto.jpg'),

('Supino Inclinado',
 (SELECT id FROM public.exercise_categories WHERE name = 'Peito'),
 ARRAY['Peitoral Superior'],
 ARRAY['Tríceps', 'Deltoides Anterior'],
 'Barra',
 3,
 ARRAY['Ajuste o banco a 30-45°', 'Posicione-se corretamente', 'Execute o movimento'],
 ARRAY['Ângulo ideal entre 30-45°', 'Não arqueie demais as costas'],
 'https://models.example.com/supino-inclinado.glb',
 'https://videos.example.com/supino-inclinado.mp4',
 'https://images.example.com/supino-inclinado.jpg'),

('Supino com Halteres',
 (SELECT id FROM public.exercise_categories WHERE name = 'Peito'),
 ARRAY['Peitoral Maior'],
 ARRAY['Tríceps', 'Deltoides'],
 'Halteres',
 2,
 ARRAY['Deite-se com halteres', 'Desça controladamente', 'Suba contraindo o peito'],
 ARRAY['Amplitude completa', 'Controle o peso', 'Não trave os cotovelos'],
 'https://models.example.com/supino-halteres.glb',
 'https://videos.example.com/supino-halteres.mp4',
 'https://images.example.com/supino-halteres.jpg'),

-- COSTAS
('Puxada na Polia',
 (SELECT id FROM public.exercise_categories WHERE name = 'Costas'),
 ARRAY['Grande Dorsal', 'Romboides'],
 ARRAY['Bíceps', 'Deltoides Posterior'],
 'Polia',
 3,
 ARRAY['Sente-se na máquina', 'Puxe a barra até o peito', 'Retorne controladamente'],
 ARRAY['Peito estufado', 'Cotovelos para trás', 'Contraia as escápulas'],
 'https://models.example.com/puxada-polia.glb',
 'https://videos.example.com/puxada-polia.mp4',
 'https://images.example.com/puxada-polia.jpg'),

('Remada Curvada',
 (SELECT id FROM public.exercise_categories WHERE name = 'Costas'),
 ARRAY['Grande Dorsal', 'Romboides', 'Trapézio'],
 ARRAY['Bíceps', 'Deltoides Posterior'],
 'Barra',
 4,
 ARRAY['Incline o tronco 45°', 'Puxe a barra até o abdômen', 'Controle a descida'],
 ARRAY['Mantenha as costas retas', 'Contraia o core', 'Não use impulso'],
 'https://models.example.com/remada-curvada.glb',
 'https://videos.example.com/remada-curvada.mp4',
 'https://images.example.com/remada-curvada.jpg'),

-- PERNAS
('Agachamento',
 (SELECT id FROM public.exercise_categories WHERE name = 'Pernas'),
 ARRAY['Quadríceps', 'Glúteos'],
 ARRAY['Isquiotibiais', 'Panturrilhas'],
 'Barra',
 4,
 ARRAY['Posicione a barra nos ombros', 'Desça até 90°', 'Suba com força'],
 ARRAY['Joelhos alinhados com os pés', 'Peso nos calcanhares', 'Core contraído'],
 'https://models.example.com/agachamento.glb',
 'https://videos.example.com/agachamento.mp4',
 'https://images.example.com/agachamento.jpg'),

('Leg Press',
 (SELECT id FROM public.exercise_categories WHERE name = 'Pernas'),
 ARRAY['Quadríceps', 'Glúteos'],
 ARRAY['Isquiotibiais'],
 'Máquina',
 2,
 ARRAY['Sente-se na máquina', 'Posicione os pés', 'Execute o movimento'],
 ARRAY['Amplitude completa', 'Não trave os joelhos', 'Controle o peso'],
 'https://models.example.com/leg-press.glb',
 'https://videos.example.com/leg-press.mp4',
 'https://images.example.com/leg-press.jpg'),

-- OMBROS  
('Desenvolvimento Militar',
 (SELECT id FROM public.exercise_categories WHERE name = 'Ombros'),
 ARRAY['Deltoides Anterior', 'Deltoides Medial'],
 ARRAY['Tríceps', 'Trapézio'],
 'Barra',
 4,
 ARRAY['Posicione a barra na altura do peito', 'Empurre para cima', 'Desça controladamente'],
 ARRAY['Core contraído', 'Não arqueie as costas', 'Movimento vertical'],
 'https://models.example.com/desenvolvimento-militar.glb',
 'https://videos.example.com/desenvolvimento-militar.mp4',
 'https://images.example.com/desenvolvimento-militar.jpg'),

('Elevação Lateral',
 (SELECT id FROM public.exercise_categories WHERE name = 'Ombros'),
 ARRAY['Deltoides Medial'],
 ARRAY['Deltoides Anterior', 'Trapézio'],
 'Halteres',
 2,
 ARRAY['Segure os halteres', 'Eleve lateralmente', 'Desça controladamente'],
 ARRAY['Cotovelos ligeiramente flexionados', 'Não use impulso', 'Controle total'],
 'https://models.example.com/elevacao-lateral.glb',
 'https://videos.example.com/elevacao-lateral.mp4',
 'https://images.example.com/elevacao-lateral.jpg'),

-- BRAÇOS
('Rosca Bíceps',
 (SELECT id FROM public.exercise_categories WHERE name = 'Braços'),
 ARRAY['Bíceps'],
 ARRAY['Braquial', 'Braquiorradial'],
 'Barra',
 2,
 ARRAY['Segure a barra', 'Flexione os cotovelos', 'Retorne à posição inicial'],
 ARRAY['Cotovelos fixos', 'Não balance o corpo', 'Contração completa'],
 'https://models.example.com/rosca-biceps.glb',
 'https://videos.example.com/rosca-biceps.mp4',
 'https://images.example.com/rosca-biceps.jpg'),

('Tríceps Testa',
 (SELECT id FROM public.exercise_categories WHERE name = 'Braços'),
 ARRAY['Tríceps'],
 ARRAY['Anconeo'],
 'Barra',
 3,
 ARRAY['Deite-se no banco', 'Segure a barra', 'Flexione apenas os cotovelos'],
 ARRAY['Cotovelos fixos', 'Movimento isolado', 'Controle total'],
 'https://models.example.com/triceps-testa.glb',
 'https://videos.example.com/triceps-testa.mp4',
 'https://images.example.com/triceps-testa.jpg');

-- Create sample workout templates
INSERT INTO public.workout_templates (name, description, focus, difficulty_level, estimated_duration, target_muscle_groups, is_public) VALUES
('Push Day Intenso', 'Treino focado em peito, ombros e tríceps', 'Peito & Tríceps', 4, 75, ARRAY['Peito', 'Ombros', 'Braços'], true),
('Pull Day Completo', 'Treino para costas e bíceps', 'Costas & Bíceps', 4, 70, ARRAY['Costas', 'Braços'], true),
('Leg Day Pesado', 'Treino intenso para pernas', 'Pernas & Glúteos', 5, 80, ARRAY['Pernas'], true),
('Upper Body', 'Treino para parte superior do corpo', 'Tronco Completo', 3, 60, ARRAY['Peito', 'Costas', 'Ombros', 'Braços'], true);

-- Add exercises to workout templates
-- Push Day
INSERT INTO public.template_exercises (template_id, exercise_id, order_index, sets, reps_target, rest_seconds, weight_suggestion) VALUES
((SELECT id FROM public.workout_templates WHERE name = 'Push Day Intenso'), 
 (SELECT id FROM public.exercises WHERE name = 'Supino Reto'), 1, 4, '8-10', 90, 80.0),
((SELECT id FROM public.workout_templates WHERE name = 'Push Day Intenso'), 
 (SELECT id FROM public.exercises WHERE name = 'Supino Inclinado'), 2, 3, '10-12', 90, 70.0),
((SELECT id FROM public.workout_templates WHERE name = 'Push Day Intenso'), 
 (SELECT id FROM public.exercises WHERE name = 'Desenvolvimento Militar'), 3, 3, '8-10', 90, 50.0),
((SELECT id FROM public.workout_templates WHERE name = 'Push Day Intenso'), 
 (SELECT id FROM public.exercises WHERE name = 'Tríceps Testa'), 4, 3, '12-15', 60, 35.0);

-- Pull Day  
INSERT INTO public.template_exercises (template_id, exercise_id, order_index, sets, reps_target, rest_seconds, weight_suggestion) VALUES
((SELECT id FROM public.workout_templates WHERE name = 'Pull Day Completo'), 
 (SELECT id FROM public.exercises WHERE name = 'Puxada na Polia'), 1, 4, '8-10', 90, 70.0),
((SELECT id FROM public.workout_templates WHERE name = 'Pull Day Completo'), 
 (SELECT id FROM public.exercises WHERE name = 'Remada Curvada'), 2, 3, '10-12', 90, 60.0),
((SELECT id FROM public.workout_templates WHERE name = 'Pull Day Completo'), 
 (SELECT id FROM public.exercises WHERE name = 'Rosca Bíceps'), 3, 3, '12-15', 60, 25.0);

-- Leg Day
INSERT INTO public.template_exercises (template_id, exercise_id, order_index, sets, reps_target, rest_seconds, weight_suggestion) VALUES
((SELECT id FROM public.workout_templates WHERE name = 'Leg Day Pesado'), 
 (SELECT id FROM public.exercises WHERE name = 'Agachamento'), 1, 4, '6-8', 120, 100.0),
((SELECT id FROM public.workout_templates WHERE name = 'Leg Day Pesado'), 
 (SELECT id FROM public.exercises WHERE name = 'Leg Press'), 2, 3, '12-15', 90, 200.0);