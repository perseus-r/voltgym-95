-- Verificar manualmente usuários premium e marcá-los como verificados
UPDATE public.profiles 
SET verified = true, updated_at = now()
WHERE user_id IN (
  SELECT s.user_id 
  FROM public.subscriptions s 
  WHERE s.status = 'active' AND s.plan_id LIKE '%premium%'
) AND NOT verified;

-- Também vamos executar para usuários pro
UPDATE public.profiles 
SET verified = true, updated_at = now()
WHERE user_id IN (
  SELECT s.user_id 
  FROM public.subscriptions s 
  WHERE s.status = 'active' AND s.plan_id LIKE '%pro%'
) AND NOT verified;