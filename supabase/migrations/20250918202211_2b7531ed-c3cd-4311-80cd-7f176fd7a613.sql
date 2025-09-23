-- Criar bucket para avatars dos usuários
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket de avatars
CREATE POLICY "Avatar images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Adicionar avatar_url ao perfil do usuário
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS avatar_url text;

-- Criar tabela de ranking de progresso
CREATE TABLE IF NOT EXISTS public.progress_rankings (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  total_volume numeric DEFAULT 0,
  workouts_completed integer DEFAULT 0,
  consistency_score numeric DEFAULT 0,
  strength_gains_score numeric DEFAULT 0,
  overall_progress_score numeric DEFAULT 0,
  ranking_position integer,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  
  UNIQUE(user_id, period_start, period_end)
);

-- Enable RLS
ALTER TABLE public.progress_rankings ENABLE ROW LEVEL SECURITY;

-- RLS policies para progress_rankings
CREATE POLICY "Progress rankings are viewable by everyone" 
ON public.progress_rankings 
FOR SELECT 
USING (true);

CREATE POLICY "Users can insert their own progress rankings" 
ON public.progress_rankings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress rankings" 
ON public.progress_rankings 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Criar função para atualizar rankings automaticamente
CREATE OR REPLACE FUNCTION public.calculate_progress_rankings()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  current_period_start date;
  current_period_end date;
BEGIN
  -- Calcular período atual (últimos 30 dias)
  current_period_start := CURRENT_DATE - INTERVAL '30 days';
  current_period_end := CURRENT_DATE;
  
  -- Inserir/atualizar rankings baseado em workout_sessions dos últimos 30 dias
  INSERT INTO public.progress_rankings (
    user_id,
    period_start,
    period_end,
    total_volume,
    workouts_completed,
    consistency_score,
    strength_gains_score,
    overall_progress_score
  )
  SELECT 
    ws.user_id,
    current_period_start,
    current_period_end,
    COALESCE(
      (SELECT SUM(sl.weight * sl.reps) 
       FROM exercise_logs el 
       JOIN set_logs sl ON el.id = sl.exercise_log_id 
       WHERE el.session_id = ANY(ARRAY_AGG(ws.id)) AND sl.completed = true), 
      0
    ) as total_volume,
    COUNT(DISTINCT ws.id) as workouts_completed,
    LEAST(COUNT(DISTINCT ws.id) * 3.33, 100) as consistency_score, -- 30 treinos = 100%
    50 + RANDOM() * 50 as strength_gains_score, -- Mock por enquanto
    0 as overall_progress_score -- Será calculado depois
  FROM workout_sessions ws
  WHERE ws.created_at >= current_period_start
    AND ws.created_at <= current_period_end
  GROUP BY ws.user_id
  ON CONFLICT (user_id, period_start, period_end) 
  DO UPDATE SET
    total_volume = EXCLUDED.total_volume,
    workouts_completed = EXCLUDED.workouts_completed,
    consistency_score = EXCLUDED.consistency_score,
    strength_gains_score = EXCLUDED.strength_gains_score,
    updated_at = now();
    
  -- Calcular score geral e ranking
  UPDATE public.progress_rankings 
  SET overall_progress_score = (
    (total_volume / NULLIF((SELECT MAX(total_volume) FROM progress_rankings WHERE period_start = current_period_start), 0) * 40) +
    (consistency_score * 0.4) +
    (strength_gains_score * 0.2)
  )
  WHERE period_start = current_period_start;
  
  -- Atualizar posições do ranking
  WITH ranked_users AS (
    SELECT 
      id,
      ROW_NUMBER() OVER (ORDER BY overall_progress_score DESC) as position
    FROM public.progress_rankings
    WHERE period_start = current_period_start
  )
  UPDATE public.progress_rankings 
  SET ranking_position = ranked_users.position
  FROM ranked_users
  WHERE progress_rankings.id = ranked_users.id;
  
END;
$$;

-- Trigger para atualizar timestamp
CREATE TRIGGER update_progress_rankings_updated_at
BEFORE UPDATE ON public.progress_rankings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Populate initial data
SELECT public.calculate_progress_rankings();