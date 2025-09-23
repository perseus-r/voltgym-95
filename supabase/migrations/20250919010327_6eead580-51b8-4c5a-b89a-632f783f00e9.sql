-- Desabilitar temporariamente o trigger para a atualização
ALTER TABLE public.profiles DISABLE TRIGGER ALL;

-- Verificar usuários premium existentes
UPDATE public.profiles 
SET verified = true, updated_at = now()
WHERE user_id IN (
  SELECT user_id 
  FROM public.subscriptions 
  WHERE status = 'active' AND plan_id LIKE '%premium%'
);

-- Reabilitar o trigger
ALTER TABLE public.profiles ENABLE TRIGGER ALL;

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
DROP TRIGGER IF EXISTS auto_verify_premium_trigger ON public.subscriptions;
CREATE TRIGGER auto_verify_premium_trigger
AFTER INSERT OR UPDATE ON public.subscriptions
FOR EACH ROW
EXECUTE FUNCTION public.auto_verify_premium_users();