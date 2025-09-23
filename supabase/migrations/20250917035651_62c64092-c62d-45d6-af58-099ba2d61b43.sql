-- CORREÇÃO FINAL DEFINITIVA DE RLS

-- Habilitar RLS em TODAS as tabelas públicas
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Habilitar RLS em todas as tabelas que ainda não têm
    FOR r IN 
        SELECT schemaname, tablename
        FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename NOT IN (
            SELECT tablename 
            FROM pg_policies 
            WHERE schemaname = 'public'
        )
    LOOP
        EXECUTE 'ALTER TABLE ' || quote_ident(r.schemaname) || '.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;

-- Habilitar RLS explicitamente nas tabelas que sabemos que existem
ALTER TABLE public.social_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;

-- Adicionar políticas básicas para tabelas que não têm
DO $$
BEGIN

-- SOCIAL_FOLLOWS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_follows' AND policyname = 'Users can manage their follows') THEN
  CREATE POLICY "Users can manage their follows" ON public.social_follows 
  FOR ALL USING (follower_id = auth.uid()) WITH CHECK (follower_id = auth.uid());
END IF;

-- SOCIAL_SHARES
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_shares' AND policyname = 'Users can manage their shares') THEN
  CREATE POLICY "Users can manage their shares" ON public.social_shares 
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
END IF;

-- SOCIAL_STORIES
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_stories' AND policyname = 'Users can manage their stories') THEN
  CREATE POLICY "Users can manage their stories" ON public.social_stories 
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
END IF;

-- STORY_VIEWS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'story_views' AND policyname = 'Users can manage their story views') THEN
  CREATE POLICY "Users can manage their story views" ON public.story_views 
  FOR ALL USING (viewer_id = auth.uid()) WITH CHECK (viewer_id = auth.uid());
END IF;

-- MEDIA_UPLOADS
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_uploads' AND policyname = 'Users can manage their uploads') THEN
  CREATE POLICY "Users can manage their uploads" ON public.media_uploads 
  FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
END IF;

END $$;