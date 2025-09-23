-- Remover constraint de foreign key para permitir dados mock
ALTER TABLE public.progress_rankings 
DROP CONSTRAINT IF EXISTS progress_rankings_user_id_fkey;

-- Adicionar constraint que referencia profiles ao invés de auth.users
ALTER TABLE public.progress_rankings 
ADD CONSTRAINT progress_rankings_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(user_id) ON DELETE CASCADE;