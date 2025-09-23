-- Inserir dados de exemplo no ranking de progresso
INSERT INTO public.progress_rankings (
  user_id, 
  period_start, 
  period_end, 
  total_volume, 
  workouts_completed, 
  consistency_score, 
  strength_gains_score, 
  overall_progress_score, 
  ranking_position
) VALUES 
-- Dados fictícios para demonstração
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 52340, 28, 93.3, 87.5, 95.8, 1),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 48920, 26, 86.7, 85.2, 91.2, 2),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 45780, 25, 83.3, 82.8, 88.5, 3),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 43560, 24, 80.0, 81.3, 85.7, 4),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 41230, 23, 76.7, 79.8, 82.9, 5),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 39480, 22, 73.3, 78.2, 80.1, 6),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 37650, 21, 70.0, 76.5, 77.3, 7),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 35890, 20, 66.7, 74.8, 74.5, 8),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 34120, 19, 63.3, 73.1, 71.7, 9),
(gen_random_uuid(), CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, 32340, 18, 60.0, 71.4, 68.9, 10)
ON CONFLICT (user_id, period_start, period_end) DO NOTHING;

-- Criar perfis fictícios correspondentes (apenas se não existirem)
INSERT INTO public.profiles (
  user_id,
  display_name,
  experience_level,
  goal,
  workout_location,
  current_xp,
  total_workouts,
  streak_days,
  created_at,
  updated_at
) 
SELECT DISTINCT 
  pr.user_id,
  CASE 
    WHEN pr.ranking_position = 1 THEN 'Carlos "Beast" Silva'
    WHEN pr.ranking_position = 2 THEN 'Ana Powerhouse'
    WHEN pr.ranking_position = 3 THEN 'João Ironman'
    WHEN pr.ranking_position = 4 THEN 'Maria Strong'
    WHEN pr.ranking_position = 5 THEN 'Pedro Titan'
    WHEN pr.ranking_position = 6 THEN 'Carla Warrior'
    WHEN pr.ranking_position = 7 THEN 'Rafael Beast'
    WHEN pr.ranking_position = 8 THEN 'Julia Thunder'
    WHEN pr.ranking_position = 9 THEN 'Bruno Legend'
    WHEN pr.ranking_position = 10 THEN 'Fernanda Force'
    ELSE 'Atleta VOLT'
  END as display_name,
  'intermediario',
  'massa',
  'academia',
  CASE 
    WHEN pr.ranking_position <= 3 THEN 1000 + (pr.ranking_position * 200)
    ELSE 500 + (pr.ranking_position * 50)
  END as current_xp,
  pr.workouts_completed,
  CASE 
    WHEN pr.ranking_position <= 5 THEN 15 + pr.ranking_position
    ELSE 10 + pr.ranking_position
  END as streak_days,
  NOW() - INTERVAL '30 days',
  NOW()
FROM public.progress_rankings pr
WHERE pr.period_start = CURRENT_DATE - INTERVAL '30 days'
ON CONFLICT (user_id) DO NOTHING;