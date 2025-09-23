-- Verificar e corrigir a função is_admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT auth.email() = ANY(ARRAY['pedrosannger16@gmail.com', 'sannger@proton.me']) 
  OR auth.email() LIKE '%@volt.com';
$function$;

-- Criar função para conceder acesso gratuito
CREATE OR REPLACE FUNCTION public.has_free_access(user_email text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_controls 
    WHERE target_user_email = user_email 
    AND free_access_granted = true
    AND (expires_at IS NULL OR expires_at > now())
  ) OR user_email = ANY(ARRAY['pedrosannger16@gmail.com', 'sannger@proton.me']);
$function$;