-- CRIAÇÃO DAS POLÍTICAS RLS PARA TODAS AS TABELAS

-- POLÍTICAS PARA PROFILES
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- POLÍTICAS PARA SUBSCRIPTIONS
CREATE POLICY "Users can view their own subscription" ON public.subscriptions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own subscription" ON public.subscriptions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own subscription" ON public.subscriptions
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- POLÍTICAS PARA WEBHOOK_EVENTS_PROCESSED (somente sistema)
CREATE POLICY "No public access to webhook events" ON public.webhook_events_processed
  FOR ALL USING (false);

-- POLÍTICAS PARA MUSCLES (catálogo público)
CREATE POLICY "Muscles are viewable by everyone" ON public.muscles
  FOR SELECT USING (true);

CREATE POLICY "Only system can manage muscles" ON public.muscles
  FOR ALL USING (false) WITH CHECK (false);

-- POLÍTICAS PARA EXERCISES (catálogo público)
CREATE POLICY "Exercises are viewable by everyone" ON public.exercises
  FOR SELECT USING (true);

CREATE POLICY "Only system can manage exercises" ON public.exercises
  FOR ALL USING (false) WITH CHECK (false);

-- POLÍTICAS PARA EXERCISE_ALIASES
CREATE POLICY "Exercise aliases are viewable by everyone" ON public.exercise_aliases
  FOR SELECT USING (true);

CREATE POLICY "Only system can manage aliases" ON public.exercise_aliases
  FOR ALL USING (false) WITH CHECK (false);

-- POLÍTICAS PARA PLANS
CREATE POLICY "Users can view their own plans" ON public.plans
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own plans" ON public.plans
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own plans" ON public.plans
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own plans" ON public.plans
  FOR DELETE USING (user_id = auth.uid());

-- POLÍTICAS PARA PLAN_DAYS
CREATE POLICY "Users can view plan days of their plans" ON public.plan_days
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.plans WHERE plans.id = plan_days.plan_id AND plans.user_id = auth.uid()));

CREATE POLICY "Users can insert plan days in their plans" ON public.plan_days
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.plans WHERE plans.id = plan_days.plan_id AND plans.user_id = auth.uid()));

CREATE POLICY "Users can update plan days of their plans" ON public.plan_days
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.plans WHERE plans.id = plan_days.plan_id AND plans.user_id = auth.uid()));

CREATE POLICY "Users can delete plan days of their plans" ON public.plan_days
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.plans WHERE plans.id = plan_days.plan_id AND plans.user_id = auth.uid()));

-- POLÍTICAS PARA PLAN_DAY_EXERCISES
CREATE POLICY "Users can view exercises of their plan days" ON public.plan_day_exercises
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.plan_days pd 
    JOIN public.plans p ON p.id = pd.plan_id 
    WHERE pd.id = plan_day_exercises.plan_day_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can insert exercises in their plan days" ON public.plan_day_exercises
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.plan_days pd 
    JOIN public.plans p ON p.id = pd.plan_id 
    WHERE pd.id = plan_day_exercises.plan_day_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can update exercises of their plan days" ON public.plan_day_exercises
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.plan_days pd 
    JOIN public.plans p ON p.id = pd.plan_id 
    WHERE pd.id = plan_day_exercises.plan_day_id AND p.user_id = auth.uid()
  ));

CREATE POLICY "Users can delete exercises of their plan days" ON public.plan_day_exercises
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.plan_days pd 
    JOIN public.plans p ON p.id = pd.plan_id 
    WHERE pd.id = plan_day_exercises.plan_day_id AND p.user_id = auth.uid()
  ));

-- POLÍTICAS PARA WORKOUT_SESSIONS
CREATE POLICY "Users can view their own workout sessions" ON public.workout_sessions
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own workout sessions" ON public.workout_sessions
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own workout sessions" ON public.workout_sessions
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own workout sessions" ON public.workout_sessions
  FOR DELETE USING (user_id = auth.uid());

-- POLÍTICAS PARA WORKOUT_SETS
CREATE POLICY "Users can view their own workout sets" ON public.workout_sets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own workout sets" ON public.workout_sets
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own workout sets" ON public.workout_sets
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own workout sets" ON public.workout_sets
  FOR DELETE USING (user_id = auth.uid());

-- POLÍTICAS PARA PR_RECORDS
CREATE POLICY "Users can view their own PR records" ON public.pr_records
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own PR records" ON public.pr_records
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own PR records" ON public.pr_records
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own PR records" ON public.pr_records
  FOR DELETE USING (user_id = auth.uid());

-- POLÍTICAS PARA WEEKLY_STATS
CREATE POLICY "Users can view their own weekly stats" ON public.weekly_stats
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own weekly stats" ON public.weekly_stats
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own weekly stats" ON public.weekly_stats
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- POLÍTICAS PARA EXERCISE_STATS
CREATE POLICY "Users can view their own exercise stats" ON public.exercise_stats
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own exercise stats" ON public.exercise_stats
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own exercise stats" ON public.exercise_stats
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

-- POLÍTICAS PARA COACH_LINKS (relacionamento coach-atleta)
CREATE POLICY "Athletes can view their coach links" ON public.coach_links
  FOR SELECT USING (athlete_user_id = auth.uid() OR coach_user_id = auth.uid());

CREATE POLICY "Athletes can create coach requests" ON public.coach_links
  FOR INSERT WITH CHECK (athlete_user_id = auth.uid());

CREATE POLICY "Athletes can update their coach links" ON public.coach_links
  FOR UPDATE USING (athlete_user_id = auth.uid()) WITH CHECK (athlete_user_id = auth.uid());

CREATE POLICY "Athletes can delete their coach links" ON public.coach_links
  FOR DELETE USING (athlete_user_id = auth.uid());

-- POLÍTICAS PARA REMINDERS
CREATE POLICY "Users can view their own reminders" ON public.reminders
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own reminders" ON public.reminders
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own reminders" ON public.reminders
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own reminders" ON public.reminders
  FOR DELETE USING (user_id = auth.uid());

-- POLÍTICAS PARA PUSH_TOKENS
CREATE POLICY "Users can view their own push tokens" ON public.push_tokens
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own push tokens" ON public.push_tokens
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own push tokens" ON public.push_tokens
  FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own push tokens" ON public.push_tokens
  FOR DELETE USING (user_id = auth.uid());

-- POLÍTICAS PARA AUDIT_EVENTS
CREATE POLICY "Users can view their own audit events" ON public.audit_events
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can insert audit events" ON public.audit_events
  FOR INSERT WITH CHECK (true);

-- POLÍTICAS PARA JOBS (somente sistema)
CREATE POLICY "No public access to jobs" ON public.jobs
  FOR ALL USING (false);

-- CORRIGIR SEARCH_PATH DAS FUNÇÕES EXISTENTES
CREATE OR REPLACE FUNCTION public.sanitize_sensitive_data()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Bloquear qualquer operação que não seja do próprio usuário
  IF auth.uid() IS NULL THEN
    RAISE EXCEPTION 'Acesso negado: usuário não autenticado';
  END IF;
  
  IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
    -- Verificar se o usuário está tentando modificar dados de outro usuário
    IF NEW.user_id != auth.uid() THEN
      RAISE EXCEPTION 'Acesso negado: não é possível modificar dados de outro usuário';
    END IF;
    
    -- Sanitizar campos sensíveis se necessário
    IF NEW.phone IS NOT NULL AND LENGTH(NEW.phone) > 15 THEN
      NEW.phone = LEFT(NEW.phone, 15);
    END IF;
    
    RETURN NEW;
  END IF;
  
  IF TG_OP = 'DELETE' THEN
    -- Bloquear deletions
    RAISE EXCEPTION 'Operação não permitida: não é possível deletar perfis';
  END IF;
  
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_profile_access()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  -- Log apenas operações importantes
  IF TG_OP = 'UPDATE' THEN
    INSERT INTO public.profile_audit_log (user_id, operation)
    VALUES (auth.uid(), 'PROFILE_UPDATE');
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$function$;