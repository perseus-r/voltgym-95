-- Inserir dados de teste para exercícios
INSERT INTO exercises (name, primary_muscles, equipment, difficulty_level, instructions, form_tips) VALUES 
('Supino Reto', ARRAY['Peitoral', 'Tríceps'], 'Barra', 3, ARRAY['Posicione-se no banco', 'Pegue a barra com pegada média', 'Desça controladamente até o peito', 'Empurre a barra para cima'], ARRAY['Mantenha os pés no chão', 'Contraia o core', 'Não arqueie demais as costas']),
('Agachamento', ARRAY['Quadríceps', 'Glúteos'], 'Barra', 4, ARRAY['Posicione a barra nas costas', 'Desça flexionando joelhos e quadris', 'Mantenha o peito ereto', 'Suba empurrando o chão'], ARRAY['Joelhos alinhados com os pés', 'Desça até 90 graus', 'Olhe para frente']),
('Levantamento Terra', ARRAY['Posteriores', 'Lombar', 'Glúteos'], 'Barra', 5, ARRAY['Posicione-se com pés na largura dos ombros', 'Flexione quadris e joelhos', 'Mantenha coluna neutra', 'Levante estendendo quadris'], ARRAY['Barra próxima ao corpo', 'Core contraído', 'Não arredonde as costas']),
('Remada Curvada', ARRAY['Dorsais', 'Bíceps'], 'Barra', 3, ARRAY['Flexione levemente os joelhos', 'Incline o tronco', 'Puxe a barra em direção ao abdômen', 'Aperte as escápulas'], ARRAY['Mantenha as costas retas', 'Cotovelos próximos ao corpo', 'Controle a descida']),
('Desenvolvimento', ARRAY['Ombros', 'Tríceps'], 'Halteres', 3, ARRAY['Sente-se com apoio nas costas', 'Segure os halteres na altura dos ombros', 'Empurre para cima', 'Desça controladamente'], ARRAY['Core contraído', 'Não curve as costas', 'Movimento fluido']),
('Rosca Direta', ARRAY['Bíceps'], 'Barra', 2, ARRAY['Segure a barra com pegada supinada', 'Cotovelos fixos ao lado do corpo', 'Flexione os braços', 'Desça controladamente'], ARRAY['Não balance o corpo', 'Foco na contração', 'Amplitude completa']),
('Tríceps Testa', ARRAY['Tríceps'], 'Barra W', 3, ARRAY['Deite-se no banco', 'Segure a barra acima do peito', 'Flexione apenas os antebraços', 'Estenda de volta'], ARRAY['Cotovelos fixos', 'Movimento controlado', 'Foco no tríceps']);

-- Inserir templates de treino
INSERT INTO workout_templates (name, description, focus, target_muscle_groups, difficulty_level, estimated_duration, is_public, created_by) VALUES 
('Push A - Peito e Tríceps', 'Treino focado em movimentos de empurrar para peito e tríceps', 'Membros Superiores - Push', ARRAY['Peitoral', 'Tríceps', 'Ombros'], 3, 45, true, null),
('Pull A - Costas e Bíceps', 'Treino focado em movimentos de puxar para costas e bíceps', 'Membros Superiores - Pull', ARRAY['Dorsais', 'Bíceps', 'Posteriores'], 3, 45, true, null),
('Legs A - Pernas Completo', 'Treino completo de membros inferiores', 'Membros Inferiores', ARRAY['Quadríceps', 'Glúteos', 'Posteriores'], 4, 60, true, null),
('Full Body Iniciante', 'Treino completo para iniciantes', 'Corpo Todo', ARRAY['Peitoral', 'Dorsais', 'Pernas', 'Ombros'], 2, 40, true, null);

-- Inserir exercícios nos templates (usando os IDs dos exercícios e templates criados acima)
WITH template_ids AS (
  SELECT id, name FROM workout_templates WHERE name IN ('Push A - Peito e Tríceps', 'Pull A - Costas e Bíceps', 'Legs A - Pernas Completo', 'Full Body Iniciante')
),
exercise_ids AS (
  SELECT id, name FROM exercises WHERE name IN ('Supino Reto', 'Agachamento', 'Levantamento Terra', 'Remada Curvada', 'Desenvolvimento', 'Rosca Direta', 'Tríceps Testa')
)
INSERT INTO template_exercises (template_id, exercise_id, order_index, sets, reps_target, rest_seconds, weight_suggestion, notes)
SELECT 
  t.id,
  e.id,
  CASE 
    WHEN t.name = 'Push A - Peito e Tríceps' AND e.name = 'Supino Reto' THEN 1
    WHEN t.name = 'Push A - Peito e Tríceps' AND e.name = 'Desenvolvimento' THEN 2
    WHEN t.name = 'Push A - Peito e Tríceps' AND e.name = 'Tríceps Testa' THEN 3
    WHEN t.name = 'Pull A - Costas e Bíceps' AND e.name = 'Remada Curvada' THEN 1
    WHEN t.name = 'Pull A - Costas e Bíceps' AND e.name = 'Levantamento Terra' THEN 2
    WHEN t.name = 'Pull A - Costas e Bíceps' AND e.name = 'Rosca Direta' THEN 3
    WHEN t.name = 'Legs A - Pernas Completo' AND e.name = 'Agachamento' THEN 1
    WHEN t.name = 'Legs A - Pernas Completo' AND e.name = 'Levantamento Terra' THEN 2
    WHEN t.name = 'Full Body Iniciante' AND e.name = 'Supino Reto' THEN 1
    WHEN t.name = 'Full Body Iniciante' AND e.name = 'Agachamento' THEN 2
    WHEN t.name = 'Full Body Iniciante' AND e.name = 'Remada Curvada' THEN 3
  END as order_index,
  CASE 
    WHEN t.name LIKE '%Iniciante%' THEN 3
    ELSE 4
  END as sets,
  CASE 
    WHEN t.name LIKE '%Iniciante%' THEN '10-12'
    ELSE '8-10'
  END as reps_target,
  90 as rest_seconds,
  CASE 
    WHEN e.name = 'Supino Reto' THEN 60.0
    WHEN e.name = 'Agachamento' THEN 80.0
    WHEN e.name = 'Levantamento Terra' THEN 100.0
    WHEN e.name = 'Remada Curvada' THEN 50.0
    WHEN e.name = 'Desenvolvimento' THEN 20.0
    WHEN e.name = 'Rosca Direta' THEN 30.0
    WHEN e.name = 'Tríceps Testa' THEN 35.0
  END as weight_suggestion,
  'Exercício fundamental do programa'
FROM template_ids t
CROSS JOIN exercise_ids e
WHERE (
  (t.name = 'Push A - Peito e Tríceps' AND e.name IN ('Supino Reto', 'Desenvolvimento', 'Tríceps Testa')) OR
  (t.name = 'Pull A - Costas e Bíceps' AND e.name IN ('Remada Curvada', 'Levantamento Terra', 'Rosca Direta')) OR
  (t.name = 'Legs A - Pernas Completo' AND e.name IN ('Agachamento', 'Levantamento Terra')) OR
  (t.name = 'Full Body Iniciante' AND e.name IN ('Supino Reto', 'Agachamento', 'Remada Curvada'))
);