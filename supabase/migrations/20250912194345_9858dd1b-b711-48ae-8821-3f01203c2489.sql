-- Habilitar RLS nas tabelas que ainda não têm
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_exercises ENABLE ROW LEVEL SECURITY;

-- Policies para exercises (públicas para leitura, apenas admins podem modificar)
CREATE POLICY "Exercises are viewable by everyone" 
ON exercises FOR SELECT 
USING (true);

CREATE POLICY "Only admins can manage exercises" 
ON exercises FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Policies para workout_templates (públicas para leitura se is_public=true, apenas admins podem modificar)
CREATE POLICY "Public workout templates are viewable by everyone" 
ON workout_templates FOR SELECT 
USING (is_public = true);

CREATE POLICY "Only admins can manage workout templates" 
ON workout_templates FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- Policies para template_exercises (viewable se o template for público)
CREATE POLICY "Template exercises are viewable if template is public" 
ON template_exercises FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM workout_templates wt 
    WHERE wt.id = template_exercises.template_id 
    AND wt.is_public = true
  )
);

CREATE POLICY "Only admins can manage template exercises" 
ON template_exercises FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());