-- Melhorar segurança das políticas RLS duplicadas na tabela profiles
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles; 
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Adicionar políticas administrativas para acesso completo a dados quando necessário
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (is_admin() OR is_profile_owner(user_id));

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions  
FOR SELECT USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admins can view all subscribers" ON public.subscribers
FOR SELECT USING (is_admin() OR is_subscriber_owner(user_id));

-- Otimizar políticas de exercícios para performance com alta carga
CREATE POLICY "Admins can manage exercises" ON public.exercises
FOR ALL USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can manage workout templates" ON public.workout_templates  
FOR ALL USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can manage template exercises" ON public.template_exercises
FOR ALL USING (is_admin()) 
WITH CHECK (is_admin());

-- Índices para performance com 100k+ usuários
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON public.workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_created_at ON public.workout_sessions(created_at);
CREATE INDEX IF NOT EXISTS idx_exercise_logs_session_id ON public.exercise_logs(session_id);
CREATE INDEX IF NOT EXISTS idx_set_logs_exercise_log_id ON public.set_logs(exercise_log_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user_id ON public.ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON public.ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_personal_records_user_id ON public.personal_records(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user_id ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON public.subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_user_id ON public.subscribers(user_id);

-- Função para inserir dados de exemplo de exercícios básicos
CREATE OR REPLACE FUNCTION public.seed_basic_exercises()
RETURNS void AS $$
BEGIN
  -- Inserir categorias básicas se não existirem
  INSERT INTO public.exercise_categories (name, description, icon) VALUES
  ('Peito', 'Exercícios para peitoral', '💪'),
  ('Costas', 'Exercícios para dorsais', '🏋️'),
  ('Pernas', 'Exercícios para membros inferiores', '🦵'),
  ('Ombros', 'Exercícios para deltoides', '🏋️‍♂️'),
  ('Braços', 'Exercícios para bíceps e tríceps', '💪')
  ON CONFLICT (name) DO NOTHING;

  -- Inserir exercícios básicos se não existirem
  INSERT INTO public.exercises (name, primary_muscles, secondary_muscles, instructions, form_tips, equipment, difficulty_level) VALUES
  ('Supino Reto', ARRAY['Peitoral Maior'], ARRAY['Tríceps', 'Deltoides Anterior'], 
   ARRAY['Deite no banco com pés firmes no chão', 'Pegue a barra com pegada média', 'Desça controladamente até o peito', 'Empurre de volta à posição inicial'],
   ARRAY['Mantenha escápulas retraídas', 'Peito elevado', 'Trajetória ligeiramente em J'], 'Barra', 3),
  
  ('Agachamento', ARRAY['Quadríceps', 'Glúteos'], ARRAY['Isquiotibiais', 'Core'],
   ARRAY['Posicione os pés na largura dos ombros', 'Desça flexionando quadris e joelhos', 'Mantenha o tronco ereto', 'Suba empurrando pelos calcanhares'],
   ARRAY['Joelhos alinhados com os pés', 'Quadril para trás primeiro', 'Core contraído'], 'Barra', 4),
   
  ('Puxada Frontal', ARRAY['Latíssimo do Dorso'], ARRAY['Bíceps', 'Romboides'],
   ARRAY['Sente no equipamento com joelhos fixos', 'Pegue a barra com pegada ampla', 'Puxe até a altura do peito', 'Retorne controladamente'],
   ARRAY['Peito elevado', 'Ombros para baixo', 'Contraia as costas'], 'Polia', 3),
   
  ('Desenvolvimento Militar', ARRAY['Deltoides'], ARRAY['Tríceps', 'Core'],
   ARRAY['Em pé com pés na largura dos ombros', 'Barra na altura dos ombros', 'Empurre verticalmente acima da cabeça', 'Retorne controladamente'],
   ARRAY['Core bem contraído', 'Não arqueie as costas', 'Trajetória vertical'], 'Barra', 4),
   
  ('Rosca Direta', ARRAY['Bíceps'], ARRAY['Antebraços'],
   ARRAY['Em pé com barra nas mãos', 'Cotovelos fixos ao lado do corpo', 'Flexione apenas os antebraços', 'Retorne controladamente'],
   ARRAY['Não balance o corpo', 'Movimento apenas dos antebraços', 'Controle na descida'], 'Barra', 2)
  ON CONFLICT (name) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar seeding de exercícios básicos
SELECT public.seed_basic_exercises();