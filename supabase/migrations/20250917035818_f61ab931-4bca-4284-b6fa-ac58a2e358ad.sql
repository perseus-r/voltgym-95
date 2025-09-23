-- CORREÇÃO DO ÚLTIMO WARNING INFO

-- Adicionar políticas para tabelas que têm RLS mas não têm políticas
DO $$
DECLARE
    r RECORD;
BEGIN
    -- Para cada tabela que tem RLS habilitado mas não tem políticas
    FOR r IN 
        SELECT t.tablename
        FROM pg_tables t
        LEFT JOIN pg_policies p ON t.tablename = p.tablename AND t.schemaname = p.schemaname
        WHERE t.schemaname = 'public' 
        AND p.tablename IS NULL
        AND EXISTS (
            SELECT 1 FROM pg_class c 
            JOIN pg_namespace n ON c.relnamespace = n.oid
            WHERE c.relname = t.tablename AND n.nspname = t.schemaname AND c.relrowsecurity = true
        )
    LOOP
        -- Adicionar política restritiva por padrão
        EXECUTE 'CREATE POLICY "Default restrictive policy" ON public.' || quote_ident(r.tablename) || ' FOR ALL USING (false)';
    END LOOP;
END $$;