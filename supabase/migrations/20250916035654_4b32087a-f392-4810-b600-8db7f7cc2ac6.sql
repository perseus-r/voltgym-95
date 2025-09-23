-- CRIAÇÃO DO ESQUEMA COMPLETO ENTERPRISE PARA APP DE TREINOS

-- 1. PROFILES (dados do usuário)
CREATE TABLE IF NOT EXISTS public.profiles (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name text,
    sex text CHECK (sex IN ('m', 'f', 'x')),
    dob date,
    height_cm numeric(5,2) CHECK (height_cm > 0 AND height_cm < 300),
    weight_kg numeric(6,2) CHECK (weight_kg >= 0 AND weight_kg < 500),
    timezone text DEFAULT 'America/Sao_Paulo',
    unit_weight text DEFAULT 'kg' CHECK (unit_weight IN ('kg', 'lb')),
    locale text DEFAULT 'pt-BR',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 2. SUBSCRIPTIONS (Stripe)
CREATE TABLE IF NOT EXISTS public.subscriptions (
    user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    status text NOT NULL CHECK (status IN ('trialing', 'active', 'past_due', 'canceled')),
    plan_id text NOT NULL,
    trial_end timestamptz,
    current_period_end timestamptz,
    stripe_customer_id text,
    stripe_subscription_id text UNIQUE,
    updated_at timestamptz DEFAULT now()
);

-- 3. WEBHOOK EVENTS (idempotência Stripe)
CREATE TABLE IF NOT EXISTS public.webhook_events_processed (
    event_id text PRIMARY KEY,
    processed_at timestamptz DEFAULT now()
);

-- 4. MUSCLES (catálogo)
CREATE TABLE IF NOT EXISTS public.muscles (
    id serial PRIMARY KEY,
    name text UNIQUE NOT NULL
);

-- 5. EXERCISES (catálogo)
CREATE TABLE IF NOT EXISTS public.exercises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text UNIQUE NOT NULL,
    equipment text CHECK (equipment IN ('barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'other')),
    primary_muscle_id integer REFERENCES public.muscles(id),
    secondary_muscle_ids jsonb,
    video_url text,
    cue_short text,
    created_at timestamptz DEFAULT now()
);

-- 6. EXERCISE ALIASES (opcional)
CREATE TABLE IF NOT EXISTS public.exercise_aliases (
    alias text NOT NULL,
    exercise_id uuid REFERENCES public.exercises(id) ON DELETE CASCADE,
    UNIQUE(alias)
);

-- 7. PLANS (planejamento)
CREATE TABLE IF NOT EXISTS public.plans (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    name text NOT NULL,
    goal text CHECK (goal IN ('mass', 'cut', 'strength', 'general')),
    split text CHECK (split IN ('ppl', 'full', 'upperlower', 'custom')),
    active boolean DEFAULT false,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now(),
    CONSTRAINT unique_active_plan UNIQUE (user_id, active) DEFERRABLE INITIALLY DEFERRED
);

-- 8. PLAN DAYS
CREATE TABLE IF NOT EXISTS public.plan_days (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id uuid REFERENCES public.plans(id) ON DELETE CASCADE,
    weekday integer CHECK (weekday BETWEEN 1 AND 7),
    name text NOT NULL,
    position integer CHECK (position BETWEEN 1 AND 7),
    UNIQUE(plan_id, weekday)
);

-- 9. PLAN DAY EXERCISES
CREATE TABLE IF NOT EXISTS public.plan_day_exercises (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_day_id uuid REFERENCES public.plan_days(id) ON DELETE CASCADE,
    exercise_id uuid REFERENCES public.exercises(id),
    position integer NOT NULL,
    target_sets integer CHECK (target_sets BETWEEN 1 AND 10),
    target_reps_min integer CHECK (target_reps_min BETWEEN 1 AND 100),
    target_reps_max integer CHECK (target_reps_max BETWEEN 1 AND 100),
    target_weight numeric(6,2),
    target_rest_sec integer CHECK (target_rest_sec BETWEEN 0 AND 900),
    notes text,
    CHECK (target_reps_min <= target_reps_max)
);

-- 10. WORKOUT SESSIONS (execução)
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id uuid REFERENCES public.plans(id),
    plan_day_id uuid REFERENCES public.plan_days(id),
    date date NOT NULL,
    started_at timestamptz DEFAULT now(),
    ended_at timestamptz,
    status text DEFAULT 'open' CHECK (status IN ('open', 'closed')),
    mood_1_10 integer CHECK (mood_1_10 BETWEEN 1 AND 10),
    fatigue_1_10 integer CHECK (fatigue_1_10 BETWEEN 1 AND 10),
    notes text,
    idempotency_key text UNIQUE,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 11. WORKOUT SETS (execução detalhada)
CREATE TABLE IF NOT EXISTS public.workout_sets (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id uuid REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id uuid REFERENCES public.exercises(id),
    position integer NOT NULL,
    set_num integer CHECK (set_num BETWEEN 1 AND 20),
    reps integer CHECK (reps BETWEEN 1 AND 100),
    weight numeric(6,2) CHECK (weight >= 0),
    unit_weight text CHECK (unit_weight IN ('kg', 'lb')),
    rpe numeric(3,1) CHECK (rpe BETWEEN 1.0 AND 10.0),
    rest_sec integer CHECK (rest_sec BETWEEN 0 AND 900),
    -- Snapshots do plano no momento da execução
    target_sets integer,
    target_reps_min integer,
    target_reps_max integer,
    target_weight numeric(6,2),
    completed_at timestamptz DEFAULT now(),
    created_at timestamptz DEFAULT now()
);

-- 12. PR RECORDS (recordes pessoais)
CREATE TABLE IF NOT EXISTS public.pr_records (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id uuid REFERENCES public.exercises(id),
    kind text CHECK (kind IN ('one_rm_est', 'max_load', 'max_reps')),
    value numeric NOT NULL,
    occurred_at timestamptz DEFAULT now(),
    UNIQUE(user_id, exercise_id, kind, occurred_at)
);

-- 13. WEEKLY STATS (estatísticas semanais)
CREATE TABLE IF NOT EXISTS public.weekly_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    iso_week text NOT NULL, -- formato 'YYYY-Www'
    volume_total_kg numeric DEFAULT 0,
    sessions integer DEFAULT 0,
    adherence_pct numeric(5,2) CHECK (adherence_pct BETWEEN 0 AND 100),
    top_muscle text,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, iso_week)
);

-- 14. EXERCISE STATS (estatísticas por exercício)
CREATE TABLE IF NOT EXISTS public.exercise_stats (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    exercise_id uuid REFERENCES public.exercises(id),
    last_weight numeric,
    last_date date,
    rep_mean numeric,
    trend_30d jsonb,
    updated_at timestamptz DEFAULT now(),
    UNIQUE(user_id, exercise_id)
);

-- 15. COACH LINKS (relacionamento coach-atleta)
CREATE TABLE IF NOT EXISTS public.coach_links (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    coach_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    athlete_user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    scope text CHECK (scope IN ('read', 'write')),
    status text CHECK (status IN ('pending', 'active', 'revoked')),
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- 16. REMINDERS (lembretes)
CREATE TABLE IF NOT EXISTS public.reminders (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    weekday integer CHECK (weekday BETWEEN 1 AND 7),
    time_local time NOT NULL,
    type text DEFAULT 'workout',
    active boolean DEFAULT true
);

-- 17. PUSH TOKENS (notificações push)
CREATE TABLE IF NOT EXISTS public.push_tokens (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
    token text NOT NULL,
    platform text CHECK (platform IN ('ios', 'android', 'web')),
    created_at timestamptz DEFAULT now()
);

-- 18. AUDIT EVENTS (auditoria)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id),
    action text NOT NULL,
    entity text NOT NULL,
    entity_id text,
    ip text,
    user_agent text,
    correlation_id text,
    before jsonb,
    after jsonb,
    created_at timestamptz DEFAULT now()
);

-- 19. JOBS (jobs de manutenção)
CREATE TABLE IF NOT EXISTS public.jobs (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    type text CHECK (type IN ('rebuild_stats', 'close_stuck_sessions', 'expire_trials')),
    payload jsonb,
    status text DEFAULT 'queued' CHECK (status IN ('queued', 'running', 'done', 'error')),
    run_at timestamptz DEFAULT now(),
    last_error text
);

-- ÍNDICES PARA PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_started ON public.workout_sessions(user_id, started_at DESC);
CREATE INDEX IF NOT EXISTS idx_workout_sets_user_exercise_completed ON public.workout_sets(user_id, exercise_id, completed_at DESC);
CREATE INDEX IF NOT EXISTS idx_pr_records_user_exercise_occurred ON public.pr_records(user_id, exercise_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_stripe_id ON public.subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_user_created ON public.audit_events(user_id, created_at DESC);

-- HABILITAR RLS EM TODAS AS TABELAS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_days ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plan_day_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pr_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coach_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Catálogo público (somente leitura)
ALTER TABLE public.muscles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_aliases ENABLE ROW LEVEL SECURITY;