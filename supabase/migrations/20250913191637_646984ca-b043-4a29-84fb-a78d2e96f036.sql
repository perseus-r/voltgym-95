-- Inserir exercícios reais na tabela exercises (corrigido)
INSERT INTO exercises (name, primary_muscles, secondary_muscles, equipment, instructions, form_tips, difficulty_level) VALUES
-- Peito
('Supino Reto', ARRAY['Peitoral maior'], ARRAY['Tríceps', 'Deltóide anterior'], 'Barra', ARRAY['Deite no banco com os pés firmes no chão', 'Segure a barra com pegada pronada', 'Desça controladamente até o peito', 'Empurre explosivamente para cima'], ARRAY['Mantenha escápulas retraídas', 'Não arqueie excessivamente as costas', 'Controle a descida'], 3),
('Supino Inclinado', ARRAY['Peitoral superior'], ARRAY['Tríceps', 'Deltóide anterior'], 'Barra', ARRAY['Ajuste o banco em 30-45°', 'Posicione-se no banco inclinado', 'Execute o movimento controlado'], ARRAY['Foque na porção superior do peitoral', 'Mantenha cotovelos alinhados'], 4),
('Crucifixo', ARRAY['Peitoral maior'], ARRAY['Deltóide anterior'], 'Halteres', ARRAY['Deite no banco com halteres', 'Abra os braços em arco', 'Contraia o peitoral no movimento'], ARRAY['Mantenha ligeira flexão nos cotovelos', 'Sinta o alongamento do peitoral'], 3),
('Flexão de Braço', ARRAY['Peitoral maior'], ARRAY['Tríceps', 'Core'], 'Peso corporal', ARRAY['Posição de prancha', 'Desça até quase tocar o chão', 'Empurre o corpo para cima'], ARRAY['Mantenha corpo alinhado', 'Core contraído sempre'], 2),

-- Costas  
('Puxada Frente', ARRAY['Latíssimo do dorso'], ARRAY['Bíceps', 'Rombóides'], 'Polia alta', ARRAY['Sente-se na máquina', 'Pegue a barra com pegada pronada', 'Puxe até a altura do peito'], ARRAY['Inicie o movimento com as costas', 'Aperte as escápulas'], 3),
('Remada Curvada', ARRAY['Latíssimo do dorso', 'Rombóides'], ARRAY['Bíceps', 'Deltóide posterior'], 'Barra', ARRAY['Curve o tronco para frente', 'Puxe a barra em direção ao abdômen', 'Controle a descida'], ARRAY['Mantenha coluna neutra', 'Aperte as escápulas no final'], 4),
('Remada Sentado', ARRAY['Latíssimo do dorso'], ARRAY['Bíceps', 'Rombóides'], 'Polia baixa', ARRAY['Sente-se na máquina', 'Puxe o cabo até o abdômen', 'Controle o retorno'], ARRAY['Mantenha peitoral para fora', 'Não use impulso'], 3),

-- Pernas
('Agachamento', ARRAY['Quadríceps', 'Glúteos'], ARRAY['Isquiotibiais', 'Core'], 'Barra', ARRAY['Posicione a barra nos trapézios', 'Desça até coxas paralelas ao chão', 'Empurre pelos calcanhares'], ARRAY['Joelhos alinhados com os pés', 'Não curve as costas'], 5),
('Leg Press', ARRAY['Quadríceps'], ARRAY['Glúteos', 'Isquiotibiais'], 'Máquina', ARRAY['Posicione-se na máquina', 'Desça controladamente', 'Empurre a plataforma'], ARRAY['Não trave completamente os joelhos', 'Pés alinhados'], 3),
('Stiff', ARRAY['Isquiotibiais'], ARRAY['Glúteos', 'Lombar'], 'Barra', ARRAY['Segure a barra com pegada pronada', 'Desça empinando o bumbum', 'Sinta o alongamento posterior'], ARRAY['Joelhos levemente flexionados', 'Movimento vem do quadril'], 4),
('Cadeira Extensora', ARRAY['Quadríceps'], ARRAY[]::text[], 'Máquina', ARRAY['Sente na máquina', 'Estenda as pernas', 'Controle a descida'], ARRAY['Movimento controlado', 'Não bata a carga'], 2),

-- Ombros  
('Desenvolvimento', ARRAY['Deltóide'], ARRAY['Tríceps'], 'Halteres', ARRAY['Sente com halteres nas mãos', 'Empurre para cima', 'Desça controladamente'], ARRAY['Não arqueie as costas', 'Movimento fluido'], 3),
('Elevação Lateral', ARRAY['Deltóide médio'], ARRAY[]::text[], 'Halteres', ARRAY['Com halteres ao lado do corpo', 'Eleve os braços lateralmente', 'Controle a descida'], ARRAY['Cotovelos levemente flexionados', 'Não use impulso'], 3),
('Elevação Frontal', ARRAY['Deltóide anterior'], ARRAY[]::text[], 'Halteres', ARRAY['Com halteres à frente', 'Eleve os braços para frente', 'Controle o movimento'], ARRAY['Não passe da altura dos ombros', 'Core contraído'], 2),

-- Braços
('Rosca Direta', ARRAY['Bíceps'], ARRAY['Antebraços'], 'Barra', ARRAY['Segure a barra com pegada supinada', 'Flexione os braços', 'Controle a descida'], ARRAY['Cotovelos fixos ao corpo', 'Não balance o corpo'], 2),
('Rosca Martelo', ARRAY['Bíceps', 'Braquial'], ARRAY['Antebraços'], 'Halteres', ARRAY['Halteres com pegada neutra', 'Flexione alternadamente', 'Movimento controlado'], ARRAY['Cotovelos estáticos', 'Foque na contração'], 2),
('Tríceps Testa', ARRAY['Tríceps'], ARRAY[]::text[], 'Barra', ARRAY['Deite no banco', 'Segure a barra acima do peito', 'Flexione apenas os antebraços'], ARRAY['Cotovelos fixos', 'Movimento isolado do tríceps'], 3),
('Mergulho', ARRAY['Tríceps'], ARRAY['Peitoral inferior'], 'Peso corporal', ARRAY['Posicione-se entre as barras paralelas', 'Desça flexionando os braços', 'Empurre para cima'], ARRAY['Incline ligeiramente para frente', 'Desça até sentir alongamento'], 4);

-- Inserir produtos reais na loja
INSERT INTO products (name, description, price, category, image_url, stock_quantity, featured) VALUES
-- Suplementos
('Whey Protein 1kg', 'Proteína de alta qualidade para ganho de massa muscular. Sabor chocolate.', 89.90, 'Suplementos', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 50, true),
('Creatina 300g', 'Creatina monohidratada pura para aumento de força e resistência.', 45.00, 'Suplementos', 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400', 30, true),
('BCAA 120 caps', 'Aminoácidos essenciais para recuperação muscular e redução do catabolismo.', 35.00, 'Suplementos', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400', 25, false),
('Glutamina 300g', 'L-Glutamina para recuperação muscular e fortalecimento do sistema imunológico.', 42.90, 'Suplementos', 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400', 20, false),
('Pre-Treino 300g', 'Fórmula avançada com cafeína e aminoácidos para energia máxima no treino.', 65.00, 'Suplementos', 'https://images.unsplash.com/photo-1594736797933-d0401ba16043?w=400', 15, true),

-- Equipamentos
('Luvas de Treino', 'Luvas antiderrapantes com proteção palmar para levantamento de peso.', 25.90, 'Equipamentos', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 40, false),
('Cinto de Levantamento', 'Cinto de couro legitimo para suporte lombar em exercícios pesados.', 120.00, 'Equipamentos', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 10, false),
('Straps de Punho', 'Straps para melhor pegada em exercícios de puxada e levantamento.', 18.90, 'Equipamentos', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 35, false),
('Coqueteleira 600ml', 'Coqueteleira com compartimento para suplementos. Material livre de BPA.', 22.50, 'Equipamentos', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 60, false),

-- Roupas
('Camiseta Dry Fit', 'Camiseta de treino com tecnologia dry fit para máxima respirabilidade.', 39.90, 'Roupas', 'https://images.unsplash.com/photo-1583743814966-8936f37f6e3a?w=400', 50, false),
('Shorts de Treino', 'Shorts masculino de treino com tecido flexível e respirável.', 35.00, 'Roupas', 'https://images.unsplash.com/photo-1594736797933-d0401ba16043?w=400', 45, false),
('Regata Cavada', 'Regata masculina cavada para treino de musculação. 100% algodão.', 28.90, 'Roupas', 'https://images.unsplash.com/photo-1583743814966-8936f37f6e3a?w=400', 30, false),
('Legging Feminina', 'Legging de treino feminina com cintura alta e tecido moldante.', 45.90, 'Roupas', 'https://images.unsplash.com/photo-1506629905972-5f3d6f734006?w=400', 25, false),

-- Acessórios
('Garrafa de Água 1L', 'Garrafa térmica para manter a temperatura da bebida durante o treino.', 32.90, 'Acessórios', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 30, false),
('Toalha de Treino', 'Toalha de microfibra com alta absorção para uso durante os exercícios.', 15.90, 'Acessórios', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400', 40, false);

-- Inserir categorias de exercícios
INSERT INTO exercise_categories (name, description, icon) VALUES
('Peito', 'Exercícios para desenvolvimento do peitoral maior e menor', '💪'),
('Costas', 'Exercícios para latíssimo, rombóides e trapézio', '🔥'),
('Pernas', 'Exercícios para quadríceps, glúteos e isquiotibiais', '🦵'),
('Ombros', 'Exercícios para deltóides anterior, médio e posterior', '💫'),
('Braços', 'Exercícios para bíceps, tríceps e antebraços', '💪'),
('Core', 'Exercícios para abdômen e músculos estabilizadores', '⭐');