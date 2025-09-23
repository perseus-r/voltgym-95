-- Criar tabelas para rede social avançada
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

-- Tabela de comentários expandida
CREATE TABLE IF NOT EXISTS public.social_comments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  parent_comment_id UUID, -- Para respostas a comentários
  likes_count INTEGER NOT NULL DEFAULT 0,
  media_urls TEXT[], -- Comentários com mídia
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de curtidas
CREATE TABLE IF NOT EXISTS public.social_likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID,
  comment_id UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

-- Tabela de seguidores/seguindo
CREATE TABLE IF NOT EXISTS public.social_follows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID NOT NULL,
  following_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(follower_id, following_id)
);

-- Tabela de compartilhamentos
CREATE TABLE IF NOT EXISTS public.social_shares (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID NOT NULL,
  shared_to TEXT NOT NULL, -- 'timeline', 'story', 'external'
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

-- Tabela de stories (24h)
CREATE TABLE IF NOT EXISTS public.social_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  duration INTEGER NOT NULL DEFAULT 10, -- segundos
  views_count INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '24 hours'),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de visualizações de stories
CREATE TABLE IF NOT EXISTS public.story_views (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL,
  viewer_id UUID NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, viewer_id)
);

-- RLS Policies para social_posts
ALTER TABLE public.social_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts públicos são visíveis para todos" 
ON public.social_posts 
FOR SELECT 
USING (visibility = 'public' OR user_id = auth.uid());

CREATE POLICY "Usuários podem criar seus próprios posts" 
ON public.social_posts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem atualizar seus próprios posts" 
ON public.social_posts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem deletar seus próprios posts" 
ON public.social_posts 
FOR DELETE 
USING (auth.uid() = user_id);

-- RLS Policies para social_comments
ALTER TABLE public.social_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Comentários são visíveis para todos" 
ON public.social_comments 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem criar comentários" 
ON public.social_comments 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem editar seus comentários" 
ON public.social_comments 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies para social_likes
ALTER TABLE public.social_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver todas as curtidas" 
ON public.social_likes 
FOR SELECT 
USING (true);

CREATE POLICY "Usuários podem curtir/descurtir" 
ON public.social_likes 
FOR ALL 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- RLS Policies para ai_feed_content
ALTER TABLE public.ai_feed_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Conteúdo de IA é público" 
ON public.ai_feed_content 
FOR SELECT 
USING (is_active = true);

CREATE POLICY "Apenas admins podem gerenciar conteúdo de IA" 
ON public.ai_feed_content 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies para media_uploads
ALTER TABLE public.media_uploads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seus uploads" 
ON public.media_uploads 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem fazer upload" 
ON public.media_uploads 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Índices para performance
CREATE INDEX idx_social_posts_user_id ON public.social_posts(user_id);
CREATE INDEX idx_social_posts_created_at ON public.social_posts(created_at DESC);
CREATE INDEX idx_social_posts_type ON public.social_posts(post_type);
CREATE INDEX idx_social_comments_post_id ON public.social_comments(post_id);
CREATE INDEX idx_social_likes_post_id ON public.social_likes(post_id);
CREATE INDEX idx_social_likes_user_id ON public.social_likes(user_id);
CREATE INDEX idx_ai_feed_category ON public.ai_feed_content(category);
CREATE INDEX idx_ai_feed_published ON public.ai_feed_content(published_at DESC);

-- Triggers para atualizar contadores
CREATE OR REPLACE FUNCTION update_post_stats()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER update_likes_count
  AFTER INSERT OR DELETE ON public.social_likes
  FOR EACH ROW EXECUTE FUNCTION update_post_stats();

-- Função para popular conteúdo de IA automaticamente
CREATE OR REPLACE FUNCTION seed_ai_content()
RETURNS void AS $$
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
  ),
  ('Técnica de respiração 4-7-8 melhora foco durante treino',
   'Estudo comprova que a respiração 4-7-8 (inspire 4s, segure 7s, expire 8s) reduz cortisol e aumenta concentração. Aplicação entre séries mostrou melhora de 12% na execução técnica.',
   'Padrão respiratório específico reduz stress e melhora concentração durante exercícios.',
   'technique',
   ARRAY['respiração', 'foco', 'cortisol', 'concentração'],
   'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Executar seeding
SELECT seed_ai_content();