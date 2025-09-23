-- Correção: remover políticas RLS duplicadas e melhorar segurança
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles; 
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;

-- Políticas administrativas para acesso completo quando necessário
CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (is_admin() OR is_profile_owner(user_id));

CREATE POLICY "Admins can view all subscriptions" ON public.subscriptions  
FOR SELECT USING (is_admin() OR auth.uid() = user_id);

CREATE POLICY "Admins can view all subscribers" ON public.subscribers
FOR SELECT USING (is_admin() OR is_subscriber_owner(user_id));

-- Políticas administrativas para gerenciamento de exercícios
CREATE POLICY "Admins can manage exercises" ON public.exercises
FOR ALL USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can manage workout templates" ON public.workout_templates  
FOR ALL USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can manage template exercises" ON public.template_exercises
FOR ALL USING (is_admin()) 
WITH CHECK (is_admin());

-- Índices críticos para performance com 100k+ usuários  
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