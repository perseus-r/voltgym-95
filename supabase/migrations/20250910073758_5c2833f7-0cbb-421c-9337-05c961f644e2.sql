-- Create comprehensive workout database schema

-- User profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  experience_level TEXT CHECK (experience_level IN ('iniciante', 'intermediario', 'avancado')) DEFAULT 'iniciante',
  goal TEXT CHECK (goal IN ('massa', 'definicao', 'forca', 'resistencia')) DEFAULT 'massa',
  weight DECIMAL(5,2),
  height INTEGER,
  age INTEGER,
  current_xp INTEGER DEFAULT 0,
  total_workouts INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Exercise categories and muscle groups
CREATE TABLE public.exercise_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Exercises library with 3D models
CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category_id UUID REFERENCES public.exercise_categories(id),
  primary_muscles TEXT[],
  secondary_muscles TEXT[],
  equipment TEXT,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5) DEFAULT 3,
  instructions TEXT[],
  form_tips TEXT[],
  model_3d_url TEXT,
  demo_video_url TEXT,
  thumbnail_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Workout templates
CREATE TABLE public.workout_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  focus TEXT NOT NULL,
  difficulty_level INTEGER CHECK (difficulty_level BETWEEN 1 AND 5) DEFAULT 3,
  estimated_duration INTEGER, -- minutes
  target_muscle_groups TEXT[],
  created_by UUID,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Exercise sets in workout templates
CREATE TABLE public.template_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_id UUID REFERENCES public.workout_templates(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id),
  order_index INTEGER NOT NULL,
  sets INTEGER NOT NULL DEFAULT 3,
  reps_min INTEGER,
  reps_max INTEGER,
  reps_target TEXT, -- for cases like "AMRAP", "8-10", etc
  rest_seconds INTEGER DEFAULT 90,
  weight_suggestion DECIMAL(5,2),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User workout sessions
CREATE TABLE public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  template_id UUID REFERENCES public.workout_templates(id),
  name TEXT NOT NULL,
  focus TEXT NOT NULL,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  duration_minutes INTEGER,
  total_volume DECIMAL(10,2) DEFAULT 0, -- total weight x reps
  notes TEXT,
  xp_earned INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Individual exercise logs within sessions
CREATE TABLE public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE,
  exercise_id UUID REFERENCES public.exercises(id),
  order_index INTEGER NOT NULL,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Individual set logs
CREATE TABLE public.set_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exercise_log_id UUID REFERENCES public.exercise_logs(id) ON DELETE CASCADE,
  set_number INTEGER NOT NULL,
  reps INTEGER,
  weight DECIMAL(5,2),
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  rest_seconds INTEGER,
  completed BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- User achievements and progress tracking
CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  achievement_type TEXT NOT NULL,
  achievement_name TEXT NOT NULL,
  description TEXT,
  xp_awarded INTEGER DEFAULT 0,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Personal records tracking
CREATE TABLE public.personal_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  exercise_id UUID REFERENCES public.exercises(id),
  record_type TEXT CHECK (record_type IN ('1rm', 'volume', 'reps', 'time')) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  reps INTEGER,
  weight DECIMAL(5,2),
  achieved_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  session_id UUID REFERENCES public.workout_sessions(id)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.set_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.personal_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user-specific data
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own workout sessions" ON public.workout_sessions
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own workout sessions" ON public.workout_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own workout sessions" ON public.workout_sessions
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own exercise logs" ON public.exercise_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws 
      WHERE ws.id = exercise_logs.session_id AND ws.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create exercise logs in their sessions" ON public.exercise_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws 
      WHERE ws.id = exercise_logs.session_id AND ws.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update exercise logs in their sessions" ON public.exercise_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.workout_sessions ws 
      WHERE ws.id = exercise_logs.session_id AND ws.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own set logs" ON public.set_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.exercise_logs el
      JOIN public.workout_sessions ws ON ws.id = el.session_id
      WHERE el.id = set_logs.exercise_log_id AND ws.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can create set logs in their exercises" ON public.set_logs
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.exercise_logs el
      JOIN public.workout_sessions ws ON ws.id = el.session_id
      WHERE el.id = set_logs.exercise_log_id AND ws.user_id = auth.uid()
    )
  );
CREATE POLICY "Users can update set logs in their exercises" ON public.set_logs
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.exercise_logs el
      JOIN public.workout_sessions ws ON ws.id = el.session_id
      WHERE el.id = set_logs.exercise_log_id AND ws.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view their own achievements" ON public.user_achievements
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own achievements" ON public.user_achievements
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view their own records" ON public.personal_records
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own records" ON public.personal_records
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public policies for read-only reference data
CREATE POLICY "Exercise categories are viewable by everyone" ON public.exercise_categories
  FOR SELECT USING (true);
CREATE POLICY "Exercises are viewable by everyone" ON public.exercises
  FOR SELECT USING (true);
CREATE POLICY "Public workout templates are viewable by everyone" ON public.workout_templates
  FOR SELECT USING (is_public = true);
CREATE POLICY "Template exercises are viewable by everyone" ON public.template_exercises
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.workout_templates wt 
      WHERE wt.id = template_exercises.template_id AND wt.is_public = true
    )
  );

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_exercises_updated_at
  BEFORE UPDATE ON public.exercises
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_workout_templates_updated_at
  BEFORE UPDATE ON public.workout_templates
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to calculate total volume for session
CREATE OR REPLACE FUNCTION public.calculate_session_volume(session_id_param UUID)
RETURNS DECIMAL AS $$
DECLARE
  total_vol DECIMAL := 0;
BEGIN
  SELECT COALESCE(SUM(sl.weight * sl.reps), 0)
  INTO total_vol
  FROM public.set_logs sl
  JOIN public.exercise_logs el ON sl.exercise_log_id = el.id
  WHERE el.session_id = session_id_param AND sl.completed = true;
  
  RETURN total_vol;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;