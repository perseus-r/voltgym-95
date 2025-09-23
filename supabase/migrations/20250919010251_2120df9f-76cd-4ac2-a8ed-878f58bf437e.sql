-- Criar trigger para verificar usuários premium automaticamente
CREATE OR REPLACE FUNCTION public.auto_verify_premium_users()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Se o usuário tem uma assinatura ativa premium, verificar automaticamente
  IF NEW.status = 'active' AND NEW.plan_id LIKE '%premium%' THEN
    UPDATE public.profiles 
    SET verified = true, updated_at = now()
    WHERE user_id = NEW.user_id;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Criar trigger na tabela subscriptions
CREATE TRIGGER auto_verify_premium_trigger
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.auto_verify_premium_users();

-- Função para admin ver todos os usuários com emails reais
CREATE OR REPLACE FUNCTION public.get_all_users_admin()
RETURNS TABLE (
    id uuid,
    email text,
    display_name text,
    created_at timestamptz,
    last_sign_in_at timestamptz,
    plan_type text,
    is_verified boolean
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  -- Verificar se é admin
  IF NOT is_admin() THEN
    RAISE EXCEPTION 'Access denied';
  END IF;
  
  RETURN QUERY
  SELECT 
    au.id,
    au.email,
    COALESCE(p.display_name, 'Usuário VOLT') as display_name,
    au.created_at,
    au.last_sign_in_at,
    CASE 
      WHEN s.status = 'active' AND s.plan_id LIKE '%premium%' THEN 'premium'
      WHEN s.status = 'active' THEN 'pro'
      ELSE 'free'
    END as plan_type,
    COALESCE(p.verified, false) as is_verified
  FROM auth.users au
  LEFT JOIN public.profiles p ON p.user_id = au.id
  LEFT JOIN public.subscriptions s ON s.user_id = au.id
  ORDER BY au.created_at DESC;
END;
$$;

-- Verificar usuários premium existentes
UPDATE public.profiles 
SET verified = true, updated_at = now()
WHERE user_id IN (
  SELECT user_id 
  FROM public.subscriptions 
  WHERE status = 'active' AND plan_id LIKE '%premium%'
);