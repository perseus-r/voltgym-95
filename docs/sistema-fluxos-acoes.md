# 🗺️ MAPA COMPLETO DE AÇÕES E DIRECIONAMENTOS - VOLT GYYM

## 📱 ESTRUTURA DE ROTAS

### **Rotas Principais**
```
/ (Index) → Página inicial pública
/auth → Login/Cadastro
/onboarding → Configuração inicial (DESATIVADO)
/dashboard → Dashboard principal ✅
/treinos → Página de treinos ✅
/ia-coach → Coach de IA ✅
/progresso → Análises e progresso ✅
/admin → Painel administrativo (apenas admins)
/settings → Redireciona para /dashboard
/* → Página 404
```

---

## 🔐 FLUXO DE AUTENTICAÇÃO

### **Página Index (/) - Landing Page**
**AÇÕES:**
- **Header**: "Começar Grátis" → `/auth`
- **Hero Section**: 
  - "Começar Grátis" → `/auth`
  - "Ver Demo" → `/dashboard`
- **System Section**: "Experimentar Agora" → `/dashboard`
- **Process Steps**: "Criar Conta Grátis" → `/auth`
- **Pricing**: "Começar Grátis" → `/auth`
- **Final CTA**: 
  - "Começar Agora" → `/auth`
  - "Ver Demo" → `/dashboard`
- **Support Button**: WhatsApp (externo)

### **Página Auth (/auth)**
**FLUXOS:**
1. **Login**: Email + Senha → `/dashboard`
2. **Cadastro**: Nome + Telefone + Email + Senha → `/dashboard`

**REGRAS:**
- ✅ Usuário logado: Redireciona automaticamente para `/dashboard`
- ✅ Cadastro cria perfil automático completo (pula onboarding)
- ✅ Login bem-sucedido vai direto para dashboard

### **ProtectedRoute - Verificações**
**VERIFICAÇÕES:**
- ❌ Não logado → `/auth`
- ✅ Logado → Permite acesso às páginas protegidas
- ⚠️ Verificação de perfil **DESATIVADA** (todos vão direto ao dashboard)

---

## 🏠 DASHBOARD PRINCIPAL (/dashboard)

### **Sidebar Navigation (Desktop)**
**SEÇÕES PRINCIPAIS:**
- **Dashboard** → View 'dashboard' (atual)
- **Planilha de Cargas** → View 'spreadsheet'
- **Exercícios** → View 'exercises'
- **Comunidade** → View 'community'
- **Loja** → View 'shop'
- **Perfil** → View 'profile'
- **Analytics** → View 'analytics'

**ADMIN (se isAdmin):**
- **Teste Sistema** → View 'system-test'

**MENU INFERIOR:**
- **Configurações** → View 'settings'
- **Sair** → Função logout

### **TabBar Navigation (Mobile)**
- **Home** → `/dashboard`
- **Treinos** → `/treinos`
- **IA Coach** → `/ia-coach`
- **Progresso** → `/progresso`
- **Config** → `/settings` (redireciona para `/dashboard`)

### **Hero Section - Próximo Treino**
**AÇÕES:**
- **"Começar Treino"** → Inicia sessão de treino ativa
- **"Ver Detalhes"** → Console.log (não implementado)

### **Floating Quick Menu**
**AÇÕES:**
- **"Iniciar Treino"** → Inicia sessão de treino
- **"Timer"** → Console.log (não implementado)
- **"Metas"** → Console.log (não implementado)
- **"Exercícios"** → Console.log (não implementado)

### **Sistema de Notificações**
**COMPORTAMENTO:**
- ✅ Bell icon com contador
- ✅ Portal no document.body
- ✅ Overlay para fechar
- ✅ Notificações demo (4 tipos)

---

## 📊 VIEWS DO DASHBOARD

### **View: 'dashboard' (Padrão)**
**COMPONENTES:**
- HeroNextWorkout
- StreakWeek
- ConsistencyDonut
- EnhancedStats
- QuickActions
- AdvancedProgressRings
- WorkoutSpreadsheet
- WeeklyRing
- MiniChart
- RecentCarouselView
- WorkoutList
- ExerciseHints
- AICoachPanel
- SystemStatus

### **View: 'spreadsheet'**
- WorkoutSpreadsheet completa

### **View: 'exercises'**
- ExerciseLibrary com filtros e 3D viewer

### **View: 'community'**
- CommunityPreview

### **View: 'shop'**
- ShopPreview

### **View: 'profile'**
- EnhancedProfile

### **View: 'analytics'**
- AdvancedAnalytics

### **View: 'system-test' (Admin)**
- SystemTester

---

## 🏋️ OUTRAS PÁGINAS

### **TreinosPage (/treinos)**
**FUNCIONALIDADES:**
- Lista de treinos disponíveis
- Criação de treinos personalizados
- Histórico de treinos

### **IACoachPage (/ia-coach)**
**FUNCIONALIDADES:**
- Chat com IA para orientações
- Sugestões personalizadas
- Análise de performance

### **ProgressoPage (/progresso)**
**FUNCIONALIDADES:**
- Gráficos de evolução
- Métricas detalhadas
- Comparativos históricos

### **AdminPanel (/admin)**
**ACESSO:** Apenas emails autorizados
**VERIFICAÇÕES:**
- ❌ Não logado → `/auth`
- ❌ Não admin → `/dashboard`
**FUNCIONALIDADES:**
- Gestão de usuários
- Monitoramento do sistema
- Análises administrativas

---

## ⚙️ AÇÕES GLOBAIS

### **AuthContext**
**FUNÇÕES:**
- `signUp()` → Cria conta + perfil automático
- `signIn()` → Faz login
- `signOut()` → Logout + limpeza localStorage
- `ensureProfileExists()` → Cria perfil completo se não existir

### **Redirecionamentos Automáticos**
1. **Auth.tsx**: Usuário logado → `/dashboard`
2. **Dashboard.tsx**: Usuário não logado → `/auth`
3. **AdminPanel.tsx**: Não admin → `/dashboard`
4. **ProtectedRoute**: Não logado → `/auth`
5. **App.tsx**: `/settings` → `/dashboard`

### **LocalStorage Management**
**DADOS SALVOS:**
- `currentUserId` → ID do usuário atual
- `user_xp_${userId}` → XP do usuário
- `training_prefs_${userId}` → Preferências de treino
- `bora_hist_v1` → Histórico de treinos
- `active_workout_plan` → Plano ativo

**LIMPEZA NO LOGOUT:**
- Todos os dados com prefixos: `bora_`, `health_`, `workout_`, `ai_chat`, `xp_`, `user_`, `auto_settings`

---

## 🔄 FLUXOS DE TREINO

### **Iniciar Treino**
1. **Trigger**: HeroNextWorkout button ou FloatingQuickMenu
2. **Ação**: `handleStartWorkout()`
3. **Estado**: `workoutStarted = true`
4. **Componente**: ActiveWorkoutSession aparece
5. **Seleção**: Primeiro exercício automaticamente

### **Sessão de Exercício**
1. **Trigger**: Click em exercício da WorkoutList
2. **Estado**: `selectedExercise` + `selectedIndex`
3. **Componente**: ExerciseSession aparece
4. **Ações**:
   - Salvar cargas
   - Próximo exercício
   - Completar exercício

### **Completar Exercício**
1. **XP**: +25 pontos
2. **História**: Salva no localStorage
3. **Progresso**: Próximo exercício ou finaliza treino

---

## 🚨 PONTOS DE ATENÇÃO

### **FUNCIONALIDADES HABILITADAS:**
- ✅ Onboarding obrigatório (perfil criado automaticamente)
- ✅ Verificação de perfil completo
- ✅ Questionário de configuração

### **FUNCIONALIDADES ATIVAS:**
- ✅ Autenticação completa
- ✅ Dashboard multi-view
- ✅ Sistema de treinos
- ✅ Notificações
- ✅ Navigation (Sidebar + TabBar)
- ✅ Proteção de rotas
- ✅ Painel admin

### **CONSOLE.LOG (Não Implementado):**
- Ver detalhes do treino
- Timer
- Metas
- Exercícios (FloatingMenu)

---

## 🎯 RESUMO DOS DIRECIONAMENTOS

| **DE** | **PARA** | **CONDIÇÃO** |
|--------|----------|--------------|
| `/` | `/auth` | Botões "Começar Grátis" |
| `/` | `/dashboard` | Botões "Ver Demo" |
| `/auth` | `/dashboard` | Login/Cadastro sucesso |
| `/dashboard` | `/auth` | Usuário não logado |
| `/admin` | `/auth` | Usuário não logado |
| `/admin` | `/dashboard` | Usuário não admin |
| `/settings` | `/dashboard` | Redirecionamento automático |
| `*` | `404` | Rota não encontrada |

**Total de verificações implementadas:** ✅ Sistema robusto e seguro