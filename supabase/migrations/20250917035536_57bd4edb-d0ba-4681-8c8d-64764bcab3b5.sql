-- CORREÇÕES FINAIS DE SEGURANÇA RLS

-- Habilitar RLS nas tabelas que ainda não têm (corrigir ERROR: RLS Disabled in Public)
ALTER TABLE IF EXISTS public.template_exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.social_likes ENABLE ROW LEVEL SECURITY;

-- Corrigir funções sem search_path (WARN: Function Search Path Mutable)
CREATE OR REPLACE FUNCTION public.update_post_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.post_id IS NOT NULL THEN
      UPDATE public.social_posts 
      SET likes_count = (
        SELECT COUNT(*) FROM public.social_likes 
        WHERE post_id = NEW.post_id
      )
      WHERE id = NEW.post_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.post_id IS NOT NULL THEN
      UPDATE public.social_posts 
      SET likes_count = (
        SELECT COUNT(*) FROM public.social_likes 
        WHERE post_id = OLD.post_id
      )
      WHERE id = OLD.post_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$function$;

CREATE OR REPLACE FUNCTION public.seed_ai_content()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  INSERT INTO public.ai_feed_content (title, content, summary, category, tags, image_url) VALUES
  ('Novo protocolo de aquecimento reduz lesões em 45%', 
   'Pesquisadores da Universidade de Stanford desenvolveram um protocolo de aquecimento dinâmico que combina mobilidade articular, ativação neuromuscular e progressão de intensidade. O estudo com 2.000 atletas mostrou redução significativa de lesões musculares.',
   'Protocolo inovador combina mobilidade, ativação neuromuscular e progressão para prevenir lesões.',
   'research',
   ARRAY['aquecimento', 'lesões', 'prevenção', 'stanford'],
   'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'
  ),
  ('IA identifica padrões de fadiga antes do atleta perceber',
   'Algoritmo de machine learning analisa variáveis como HRV, RPE e velocidade de execução para detectar fadiga precoce. A tecnologia permite ajustes preventivos no treino, otimizando recuperação e performance.',
   'Inteligência artificial detecta fadiga precoce através de múltiplas variáveis biométricas.',
   'news',
   ARRAY['ia', 'fadiga', 'hrv', 'machine-learning'],
   'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400'
  )
  ON CONFLICT DO NOTHING;
END;
$function$;

-- Adicionar políticas para tabelas que existem mas não têm políticas completas
DO $$
BEGIN

-- TEMPLATE_EXERCISES
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'template_exercises' AND policyname = 'Template exercises are viewable by everyone') THEN
  CREATE POLICY "Template exercises are viewable by everyone" ON public.template_exercises 
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.workout_templates wt WHERE wt.id = template_exercises.template_id AND wt.is_public = true));
END IF;

-- WORKOUT_TEMPLATES
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'workout_templates' AND policyname = 'Public workout templates are viewable by everyone') THEN
  CREATE POLICY "Public workout templates are viewable by everyone" ON public.workout_templates 
  FOR SELECT USING (is_public = true);
END IF;

-- SOCIAL_POSTS (se existir)
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'social_posts') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_posts' AND policyname = 'Posts are viewable by everyone') THEN
    CREATE POLICY "Posts are viewable by everyone" ON public.social_posts FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_posts' AND policyname = 'Users can create posts') THEN
    CREATE POLICY "Users can create posts" ON public.social_posts FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_posts' AND policyname = 'Users can update their posts') THEN
    CREATE POLICY "Users can update their posts" ON public.social_posts FOR UPDATE USING (user_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_posts' AND policyname = 'Users can delete their posts') THEN
    CREATE POLICY "Users can delete their posts" ON public.social_posts FOR DELETE USING (user_id = auth.uid());
  END IF;
END IF;

-- SOCIAL_COMMENTS (se existir)
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'social_comments') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_comments' AND policyname = 'Comments are viewable by everyone') THEN
    CREATE POLICY "Comments are viewable by everyone" ON public.social_comments FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_comments' AND policyname = 'Users can create comments') THEN
    CREATE POLICY "Users can create comments" ON public.social_comments FOR INSERT WITH CHECK (user_id = auth.uid());
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_comments' AND policyname = 'Users can update their comments') THEN
    CREATE POLICY "Users can update their comments" ON public.social_comments FOR UPDATE USING (user_id = auth.uid());
  END IF;
END IF;

-- SOCIAL_LIKES (se existir)
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'social_likes') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_likes' AND policyname = 'Likes are viewable by everyone') THEN
    CREATE POLICY "Likes are viewable by everyone" ON public.social_likes FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_likes' AND policyname = 'Users can manage their likes') THEN
    CREATE POLICY "Users can manage their likes" ON public.social_likes FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END IF;

END $$;