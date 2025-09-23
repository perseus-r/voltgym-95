-- POLÍTICAS RLS USANDO APPROACH CONDICIONAL

DO $$
BEGIN

-- POLÍTICAS PARA WEBHOOK_EVENTS_PROCESSED (somente sistema)
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'webhook_events_processed' AND policyname = 'No public access to webhook events') THEN
  CREATE POLICY "No public access to webhook events" ON public.webhook_events_processed FOR ALL USING (false);
END IF;

-- POLÍTICAS PARA MUSCLES (catálogo público)  
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'muscles' AND policyname = 'Muscles are viewable by everyone') THEN
  CREATE POLICY "Muscles are viewable by everyone" ON public.muscles FOR SELECT USING (true);
END IF;

-- POLÍTICAS PARA EXERCISE_ALIASES
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_aliases' AND policyname = 'Exercise aliases are viewable by everyone') THEN
  CREATE POLICY "Exercise aliases are viewable by everyone" ON public.exercise_aliases FOR SELECT USING (true);
END IF;

-- POLÍTICAS PARA PLANS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plans' AND policyname = 'Users can view their own plans') THEN
  CREATE POLICY "Users can view their own plans" ON public.plans FOR SELECT USING (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plans' AND policyname = 'Users can insert their own plans') THEN
  CREATE POLICY "Users can insert their own plans" ON public.plans FOR INSERT WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plans' AND policyname = 'Users can update their own plans') THEN
  CREATE POLICY "Users can update their own plans" ON public.plans FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plans' AND policyname = 'Users can delete their own plans') THEN
  CREATE POLICY "Users can delete their own plans" ON public.plans FOR DELETE USING (user_id = auth.uid());
END IF;

-- POLÍTICAS PARA PLAN_DAYS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plan_days' AND policyname = 'Users can view plan days of their plans') THEN
  CREATE POLICY "Users can view plan days of their plans" ON public.plan_days 
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.plans WHERE plans.id = plan_days.plan_id AND plans.user_id = auth.uid()));
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plan_days' AND policyname = 'Users can insert plan days in their plans') THEN
  CREATE POLICY "Users can insert plan days in their plans" ON public.plan_days 
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.plans WHERE plans.id = plan_days.plan_id AND plans.user_id = auth.uid()));
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plan_days' AND policyname = 'Users can update plan days of their plans') THEN
  CREATE POLICY "Users can update plan days of their plans" ON public.plan_days 
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.plans WHERE plans.id = plan_days.plan_id AND plans.user_id = auth.uid()));
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plan_days' AND policyname = 'Users can delete plan days of their plans') THEN
  CREATE POLICY "Users can delete plan days of their plans" ON public.plan_days 
  FOR DELETE USING (EXISTS (SELECT 1 FROM public.plans WHERE plans.id = plan_days.plan_id AND plans.user_id = auth.uid()));
END IF;

-- POLÍTICAS PARA PLAN_DAY_EXERCISES
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plan_day_exercises' AND policyname = 'Users can view exercises of their plan days') THEN
  CREATE POLICY "Users can view exercises of their plan days" ON public.plan_day_exercises 
  FOR SELECT USING (EXISTS (
    SELECT 1 FROM public.plan_days pd 
    JOIN public.plans p ON p.id = pd.plan_id 
    WHERE pd.id = plan_day_exercises.plan_day_id AND p.user_id = auth.uid()
  ));
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plan_day_exercises' AND policyname = 'Users can insert exercises in their plan days') THEN
  CREATE POLICY "Users can insert exercises in their plan days" ON public.plan_day_exercises 
  FOR INSERT WITH CHECK (EXISTS (
    SELECT 1 FROM public.plan_days pd 
    JOIN public.plans p ON p.id = pd.plan_id 
    WHERE pd.id = plan_day_exercises.plan_day_id AND p.user_id = auth.uid()
  ));
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plan_day_exercises' AND policyname = 'Users can update exercises of their plan days') THEN
  CREATE POLICY "Users can update exercises of their plan days" ON public.plan_day_exercises 
  FOR UPDATE USING (EXISTS (
    SELECT 1 FROM public.plan_days pd 
    JOIN public.plans p ON p.id = pd.plan_id 
    WHERE pd.id = plan_day_exercises.plan_day_id AND p.user_id = auth.uid()
  ));
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'plan_day_exercises' AND policyname = 'Users can delete exercises of their plan days') THEN
  CREATE POLICY "Users can delete exercises of their plan days" ON public.plan_day_exercises 
  FOR DELETE USING (EXISTS (
    SELECT 1 FROM public.plan_days pd 
    JOIN public.plans p ON p.id = pd.plan_id 
    WHERE pd.id = plan_day_exercises.plan_day_id AND p.user_id = auth.uid()
  ));
END IF;

-- POLÍTICAS PARA PR_RECORDS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pr_records' AND policyname = 'Users can view their own PR records') THEN
  CREATE POLICY "Users can view their own PR records" ON public.pr_records FOR SELECT USING (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pr_records' AND policyname = 'Users can insert their own PR records') THEN
  CREATE POLICY "Users can insert their own PR records" ON public.pr_records FOR INSERT WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pr_records' AND policyname = 'Users can update their own PR records') THEN
  CREATE POLICY "Users can update their own PR records" ON public.pr_records FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'pr_records' AND policyname = 'Users can delete their own PR records') THEN
  CREATE POLICY "Users can delete their own PR records" ON public.pr_records FOR DELETE USING (user_id = auth.uid());
END IF;

-- POLÍTICAS PARA WEEKLY_STATS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weekly_stats' AND policyname = 'Users can view their own weekly stats') THEN
  CREATE POLICY "Users can view their own weekly stats" ON public.weekly_stats FOR SELECT USING (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weekly_stats' AND policyname = 'Users can insert their own weekly stats') THEN
  CREATE POLICY "Users can insert their own weekly stats" ON public.weekly_stats FOR INSERT WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'weekly_stats' AND policyname = 'Users can update their own weekly stats') THEN
  CREATE POLICY "Users can update their own weekly stats" ON public.weekly_stats FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
END IF;

-- POLÍTICAS PARA EXERCISE_STATS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_stats' AND policyname = 'Users can view their own exercise stats') THEN
  CREATE POLICY "Users can view their own exercise stats" ON public.exercise_stats FOR SELECT USING (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_stats' AND policyname = 'Users can insert their own exercise stats') THEN
  CREATE POLICY "Users can insert their own exercise stats" ON public.exercise_stats FOR INSERT WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_stats' AND policyname = 'Users can update their own exercise stats') THEN
  CREATE POLICY "Users can update their own exercise stats" ON public.exercise_stats FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
END IF;

-- POLÍTICAS PARA COACH_LINKS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_links' AND policyname = 'Athletes can view their coach links') THEN
  CREATE POLICY "Athletes can view their coach links" ON public.coach_links FOR SELECT USING (athlete_user_id = auth.uid() OR coach_user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_links' AND policyname = 'Athletes can create coach requests') THEN
  CREATE POLICY "Athletes can create coach requests" ON public.coach_links FOR INSERT WITH CHECK (athlete_user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_links' AND policyname = 'Athletes can update their coach links') THEN
  CREATE POLICY "Athletes can update their coach links" ON public.coach_links FOR UPDATE USING (athlete_user_id = auth.uid()) WITH CHECK (athlete_user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'coach_links' AND policyname = 'Athletes can delete their coach links') THEN
  CREATE POLICY "Athletes can delete their coach links" ON public.coach_links FOR DELETE USING (athlete_user_id = auth.uid());
END IF;

-- POLÍTICAS PARA REMINDERS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'Users can view their own reminders') THEN
  CREATE POLICY "Users can view their own reminders" ON public.reminders FOR SELECT USING (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'Users can insert their own reminders') THEN
  CREATE POLICY "Users can insert their own reminders" ON public.reminders FOR INSERT WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'Users can update their own reminders') THEN
  CREATE POLICY "Users can update their own reminders" ON public.reminders FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'reminders' AND policyname = 'Users can delete their own reminders') THEN
  CREATE POLICY "Users can delete their own reminders" ON public.reminders FOR DELETE USING (user_id = auth.uid());
END IF;

-- POLÍTICAS PARA PUSH_TOKENS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'push_tokens' AND policyname = 'Users can view their own push tokens') THEN
  CREATE POLICY "Users can view their own push tokens" ON public.push_tokens FOR SELECT USING (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'push_tokens' AND policyname = 'Users can insert their own push tokens') THEN
  CREATE POLICY "Users can insert their own push tokens" ON public.push_tokens FOR INSERT WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'push_tokens' AND policyname = 'Users can update their own push tokens') THEN
  CREATE POLICY "Users can update their own push tokens" ON public.push_tokens FOR UPDATE USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'push_tokens' AND policyname = 'Users can delete their own push tokens') THEN
  CREATE POLICY "Users can delete their own push tokens" ON public.push_tokens FOR DELETE USING (user_id = auth.uid());
END IF;

-- POLÍTICAS PARA AUDIT_EVENTS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_events' AND policyname = 'Users can view their own audit events') THEN
  CREATE POLICY "Users can view their own audit events" ON public.audit_events FOR SELECT USING (user_id = auth.uid());
END IF;

IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'audit_events' AND policyname = 'System can insert audit events') THEN
  CREATE POLICY "System can insert audit events" ON public.audit_events FOR INSERT WITH CHECK (true);
END IF;

-- POLÍTICAS PARA JOBS (somente sistema)
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'jobs' AND policyname = 'No public access to jobs') THEN
  CREATE POLICY "No public access to jobs" ON public.jobs FOR ALL USING (false);
END IF;

END $$;