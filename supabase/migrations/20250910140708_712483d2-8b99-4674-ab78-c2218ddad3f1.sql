-- Verificar se existe o trigger e recriá-lo se necessário
DO $$
BEGIN
    -- Criar trigger se não existir
    IF NOT EXISTS (
        SELECT 1 FROM pg_trigger 
        WHERE tgname = 'on_auth_user_created'
    ) THEN
        CREATE TRIGGER on_auth_user_created
        AFTER INSERT ON auth.users
        FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        
        RAISE NOTICE 'Trigger on_auth_user_created criado com sucesso';
    ELSE
        RAISE NOTICE 'Trigger on_auth_user_created já existe';
    END IF;
END $$;