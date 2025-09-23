-- Criar apenas as tabelas que não existem
CREATE TABLE IF NOT EXISTS public.social_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  media_urls TEXT[], -- URLs de fotos/vídeos
  post_type TEXT NOT NULL DEFAULT 'text' CHECK (post_type IN ('text', 'workout', 'media', 'ai_content')),
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  workout_data JSONB, -- Dados do treino se for post de treino
  likes_count INTEGER NOT NULL DEFAULT 0,
  comments_count INTEGER NOT NULL DEFAULT 0,
  shares_count INTEGER NOT NULL DEFAULT 0,
  visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'friends', 'private')),
  tags TEXT[],
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de uploads de mídia
CREATE TABLE IF NOT EXISTS public.media_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'image', 'video'
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT,
  processing_status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'processing', 'completed', 'failed'
  ai_description TEXT, -- Descrição gerada por IA
  ai_tags TEXT[], -- Tags geradas por IA
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de feeds de IA (notícias, dicas científicas)
CREATE TABLE IF NOT EXISTS public.ai_feed_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category TEXT NOT NULL, -- 'news', 'research', 'tips', 'technique'
  tags TEXT[],
  source_url TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  engagement_score INTEGER NOT NULL DEFAULT 0
);

-- RLS para as tabelas (somente se não existir)
DO $$ 
BEGIN
  -- Enable RLS
  ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;
  ALTER TABLE public.ai_feed_content ENABLE ROW LEVEL SECURITY;
  
  -- Criar políticas apenas se não existirem
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_posts' AND policyname = 'Posts são visíveis para todos') THEN
    CREATE POLICY "Posts são visíveis para todos" 
    ON public.social_posts 
    FOR SELECT 
    USING (visibility = 'public' OR user_id = auth.uid());
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_posts' AND policyname = 'Usuários podem criar posts') THEN
    CREATE POLICY "Usuários podem criar posts" 
    ON public.social_posts 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'social_posts' AND policyname = 'Usuários podem editar posts') THEN
    CREATE POLICY "Usuários podem editar posts" 
    ON public.social_posts 
    FOR UPDATE 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'ai_feed_content' AND policyname = 'Conteúdo IA é público') THEN
    CREATE POLICY "Conteúdo IA é público" 
    ON public.ai_feed_content 
    FOR SELECT 
    USING (is_active = true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_uploads' AND policyname = 'Usuários veem seus uploads') THEN
    CREATE POLICY "Usuários veem seus uploads" 
    ON public.media_uploads 
    FOR SELECT 
    USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'media_uploads' AND policyname = 'Usuários podem fazer upload') THEN
    CREATE POLICY "Usuários podem fazer upload" 
    ON public.media_uploads 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
  END IF;
END $$;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_social_posts_created_at ON public.social_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_social_posts_type ON public.social_posts(post_type);
CREATE INDEX IF NOT EXISTS idx_ai_feed_category ON public.ai_feed_content(category);
CREATE INDEX IF NOT EXISTS idx_ai_feed_published ON public.ai_feed_content(published_at DESC);

-- Popular conteúdo de IA inicial
INSERT INTO public.ai_feed_content (title, content, summary, category, tags, image_url) 
VALUES
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
),
('Técnica de respiração 4-7-8 melhora foco durante treino',
 'Estudo comprova que a respiração 4-7-8 (inspire 4s, segure 7s, expire 8s) reduz cortisol e aumenta concentração. Aplicação entre séries mostrou melhora de 12% na execução técnica.',
 'Padrão respiratório específico reduz stress e melhora concentração durante exercícios.',
 'technique',
 ARRAY['respiração', 'foco', 'cortisol', 'concentração'],
 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
)
ON CONFLICT DO NOTHING;