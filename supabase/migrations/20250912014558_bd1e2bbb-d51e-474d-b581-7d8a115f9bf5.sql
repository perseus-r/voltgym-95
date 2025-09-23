-- Criar tabela de produtos para a loja
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  featured BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Produtos são visíveis para todos
CREATE POLICY "Products are viewable by everyone" 
ON public.products 
FOR SELECT 
USING (true);

-- Apenas admins podem gerenciar produtos (verificação via função)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT auth.email() = ANY(ARRAY['pedrosannger16@gmail.com', 'sannger@proton.me']) 
  OR auth.email() LIKE '%@volt.com';
$$;

CREATE POLICY "Only admins can manage products" 
ON public.products 
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Criar tabela de admin controls para liberar acesso
CREATE TABLE public.admin_controls (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  target_user_email TEXT NOT NULL UNIQUE,
  free_access_granted BOOLEAN NOT NULL DEFAULT false,
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.admin_controls ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver e gerenciar controles
CREATE POLICY "Only admins can view admin controls" 
ON public.admin_controls 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can manage admin controls" 
ON public.admin_controls 
FOR ALL
USING (is_admin())
WITH CHECK (is_admin());

-- Atualizar trigger de updated_at para products
CREATE TRIGGER update_products_updated_at
BEFORE UPDATE ON public.products
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Função para verificar acesso gratuito
CREATE OR REPLACE FUNCTION public.has_free_access(user_email TEXT)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_controls 
    WHERE target_user_email = user_email 
    AND free_access_granted = true
    AND (expires_at IS NULL OR expires_at > now())
  ) OR user_email = ANY(ARRAY['pedrosannger16@gmail.com', 'sannger@proton.me']);
$$;