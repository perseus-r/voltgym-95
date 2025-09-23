-- Atualizar o trigger log_profile_access para lidar com migrações
CREATE OR REPLACE FUNCTION public.log_profile_access()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $$
BEGIN
  -- Log apenas operações importantes e apenas quando há um usuário autenticado
  IF TG_OP = 'UPDATE' AND auth.uid() IS NOT NULL THEN
    INSERT INTO public.profile_audit_log (user_id, operation)
    VALUES (auth.uid(), 'PROFILE_UPDATE');
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$;

-- Agora verificar manualmente usuários premium e marcá-los como verificados
UPDATE public.profiles 
SET verified = true, updated_at = now()
WHERE user_id IN (
  SELECT s.user_id 
  FROM public.subscriptions s 
  WHERE s.status = 'active' AND (s.plan_id LIKE '%premium%' OR s.plan_id LIKE '%pro%')
) AND NOT verified;