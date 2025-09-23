-- CORREÇÃO ULTRA-AGRESSIVA FINAL DE RLS

-- Primeiro, vamos habilitar RLS em TODAS as tabelas públicas sem exceção
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN 
        SELECT tablename
        FROM pg_tables 
        WHERE schemaname = 'public'
    LOOP
        EXECUTE 'ALTER TABLE public.' || quote_ident(r.tablename) || ' ENABLE ROW LEVEL SECURITY';
    END LOOP;
END $$;

-- Agora vamos adicionar políticas básicas para tabelas que podem não ter
DO $$
BEGIN

-- Para qualquer tabela que tenha user_id mas não tenha políticas
IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subscribers' AND column_name = 'user_id') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'subscribers' AND policyname = 'Users can manage their subscriptions') THEN
    CREATE POLICY "Users can manage their subscriptions" ON public.subscribers 
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END IF;

-- Para tabelas sem user_id mas que precisam de políticas restritivas
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profile_audit_log') THEN
  CREATE POLICY "Users can view their audit logs" ON public.profile_audit_log 
  FOR SELECT USING (user_id = auth.uid());
END IF;

-- Para tabelas que devem ser bloqueadas completamente
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'admin_controls') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admin_controls' AND policyname = 'Admin only access') THEN
    CREATE POLICY "Admin only access" ON public.admin_controls FOR ALL USING (false);
  END IF;
END IF;

-- Para tabelas de feed de IA
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_feed_content') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_feed_content' AND policyname = 'AI content is public') THEN
    CREATE POLICY "AI content is public" ON public.ai_feed_content FOR SELECT USING (is_active = true);
  END IF;
END IF;

-- Para tabelas de conversas de IA
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_conversations') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_conversations' AND policyname = 'Users can manage their conversations') THEN
    CREATE POLICY "Users can manage their conversations" ON public.ai_conversations 
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END IF;

-- Para tabelas de mensagens de IA
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_messages') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_messages' AND policyname = 'Users can manage messages in their conversations') THEN
    CREATE POLICY "Users can manage messages in their conversations" ON public.ai_messages 
    FOR ALL USING (EXISTS (SELECT 1 FROM ai_conversations WHERE ai_conversations.id = ai_messages.conversation_id AND ai_conversations.user_id = auth.uid()));
  END IF;
END IF;

-- Para tabelas de categorias de exercícios
IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'exercise_categories' AND policyname = 'Categories are public') THEN
  CREATE POLICY "Categories are public" ON public.exercise_categories FOR SELECT USING (true);
END IF;

-- Para tabelas de produtos
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'products') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Products are public') THEN
    CREATE POLICY "Products are public" ON public.products FOR SELECT USING (true);
  END IF;
END IF;

-- Para tabelas de conquistas de usuário
IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'user_achievements') THEN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_achievements' AND policyname = 'Users can manage their achievements') THEN
    CREATE POLICY "Users can manage their achievements" ON public.user_achievements 
    FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
  END IF;
END IF;

END $$;