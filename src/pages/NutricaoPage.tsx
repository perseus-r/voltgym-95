import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Apple, 
  Brain, 
  Calculator, 
  Camera, 
  ChefHat, 
  Target, 
  TrendingUp,
  Droplets,
  Zap,
  Plus,
  Settings,
  BookOpen,
  Award,
  Clock,
  Calendar,
  BarChart3,
  Sparkles,
  Utensils,
  Flame
} from 'lucide-react';
import { toast } from 'sonner';

import { VoltCard } from '@/components/VoltCard';
import { VoltButton } from '@/components/VoltButton';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import NutritionAIChat from '@/components/NutritionAIChat';
import { EnhancedNutritionCard, MacroProgressCard, MealCard } from '@/components/EnhancedNutritionCards';
import { cn } from '@/lib/utils';
import { ErrorBoundary } from '@/components/ErrorFallback';
import { SmoothTabTransition, StaggeredList } from '@/components/SmoothTransitions';
import { useAuth } from '@/contexts/AuthContext';
import { useDataCleanup } from '@/hooks/useDataCleanup';

const NutricaoPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showGoalsDialog, setShowGoalsDialog] = useState(false);
  
  // Limpar dados genéricos para novos usuários
  useDataCleanup();
  
  // Nutrition Data State - Zerar para novos usuários
  const [nutritionData, setNutritionData] = useState(() => {
    if (!user) {
      return {
        calories: { consumed: 0, target: 2200, burned: 0 },
        macros: {
          protein: { consumed: 0, target: 165 },
          carbs: { consumed: 0, target: 275 },
          fat: { consumed: 0, target: 95 }
        },
        water: { consumed: 0, target: 3000 },
        meals: []
      };
    }

    // Para usuários logados, carregar dados salvos ou usar padrão zerado
    const savedData = localStorage.getItem(`nutrition_data_${user.id}`);
    if (savedData) {
      return JSON.parse(savedData);
    }

    return {
      calories: { consumed: 0, target: 2200, burned: 0 },
      macros: {
        protein: { consumed: 0, target: 165 },
        carbs: { consumed: 0, target: 275 },
        fat: { consumed: 0, target: 95 }
      },
      water: { consumed: 0, target: 3000 },
      meals: [
        { id: 1, name: 'Café da Manhã', time: '08:00', calories: 0, completed: false },
        { id: 2, name: 'Lanche', time: '10:30', calories: 0, completed: false },
        { id: 3, name: 'Almoço', time: '13:00', calories: 0, completed: false },
        { id: 4, name: 'Lanche', time: '16:00', calories: 0, completed: false },
        { id: 5, name: 'Jantar', time: '19:30', calories: 0, completed: false }
      ]
    };
  });

  // Salvar dados quando alterados
  useEffect(() => {
    if (user) {
      localStorage.setItem(`nutrition_data_${user.id}`, JSON.stringify(nutritionData));
    }
  }, [nutritionData, user]);

  const addWater = (amount: number) => {
    setNutritionData(prev => ({
      ...prev,
      water: {
        ...prev.water,
        consumed: Math.min(prev.water.consumed + amount, prev.water.target)
      }
    }));
    toast.success(`+${amount}ml de água adicionados!`);
  };

  const quickAddCalories = (calories: number) => {
    setNutritionData(prev => ({
      ...prev,
      calories: {
        ...prev.calories,
        consumed: prev.calories.consumed + calories
      }
    }));
    toast.success(`+${calories} kcal adicionadas!`);
  };

  // Calculate progress percentages
  const caloriesProgress = (nutritionData.calories.consumed / nutritionData.calories.target) * 100;
  const waterProgress = (nutritionData.water.consumed / nutritionData.water.target) * 100;
  const proteinProgress = (nutritionData.macros.protein.consumed / nutritionData.macros.protein.target) * 100;

  const completedMeals = nutritionData.meals.filter(meal => meal.completed).length;
  const totalMeals = nutritionData.meals.length;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg text-txt overflow-x-hidden">
      {/* Premium Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-surface via-card to-surface p-6 border-b border-line/30 relative overflow-hidden"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,hsl(var(--accent))_0%,transparent_50%)]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500/20 to-accent/20 flex items-center justify-center border border-green-400/30"
              >
                <Apple className="w-7 h-7 text-green-400" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-bold text-txt mb-1">
                  Nutrição Premium
                </h1>
                <p className="text-txt-2 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-accent" />
                  Dashboard nutricional completo com IA
                </p>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGoalsDialog(true)}
                className="border-accent/30 text-accent hover:bg-accent/10"
              >
                <Settings className="w-4 h-4 mr-2" />
                Metas
              </Button>
            </div>
          </div>

          {/* Quick Actions - Mobile friendly */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Adicionar\nRefeição', icon: Plus, color: 'text-accent', onClick: () => setActiveTab('meals') },
              { label: 'Escanear\nComida', icon: Camera, color: 'text-green-400', onClick: () => toast.info('Scanner em desenvolvimento') },
              { label: 'Chat IA', icon: Brain, color: 'text-purple-400', onClick: () => setActiveTab('chat') },
              { label: 'Plano do Dia', icon: Calendar, color: 'text-orange-400', onClick: () => setActiveTab('meals') },
            ].map((action, idx) => (
              <button
                key={idx}
                onClick={action.onClick}
                className="group relative w-full rounded-2xl border border-line/30 bg-surface/60 p-3 text-left hover:bg-card transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-white/5 border border-line/20 flex items-center justify-center mb-2">
                  <action.icon className={cn('w-5 h-5', action.color)} />
                </div>
                <div className="text-sm text-txt leading-tight whitespace-pre-line">{action.label}</div>
              </button>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
            {[
              { label: 'Calorias', value: `${Math.round(caloriesProgress)}%`, icon: Flame, color: 'text-orange-400' },
              { label: 'Proteína', value: `${Math.round(proteinProgress)}%`, icon: ChefHat, color: 'text-green-400' },
              { label: 'Hidratação', value: `${Math.round(waterProgress)}%`, icon: Droplets, color: 'text-blue-400' },
              { label: 'Refeições', value: `${completedMeals}/${totalMeals}`, icon: Utensils, color: 'text-purple-400' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <VoltCard className="p-3 text-center hover:scale-105 transition-transform">
                  <stat.icon className={cn("w-5 h-5 mx-auto mb-2", stat.color)} />
                  <div className="text-lg font-bold text-txt">{stat.value}</div>
                  <div className="text-xs text-txt-2">{stat.label}</div>
                </VoltCard>
              </motion.div>
            ))}
          </div>

          {/* Premium Features Pills */}
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-green-500/10 text-green-400 border-green-500/30">
              🧠 IA Nutricional
            </Badge>
            <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
              📸 Análise de Fotos
            </Badge>
            <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
              📊 Tracking Avançado
            </Badge>
            <Badge className="bg-orange-500/10 text-orange-400 border-orange-500/30">
              🎯 Metas Personalizadas
            </Badge>
          </div>
        </div>
      </motion.div>

      <div className="max-w-4xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* Tab Navigation */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
          >
            <TabsList className="grid w-full grid-cols-4 bg-surface/50 p-1 rounded-2xl border border-line/20">
              <TabsTrigger 
                value="dashboard" 
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-ink rounded-xl transition-all duration-300"
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="meals"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-ink rounded-xl transition-all duration-300"
              >
                <Utensils className="w-4 h-4 mr-2" />
                Refeições
              </TabsTrigger>
              <TabsTrigger 
                value="chat"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-ink rounded-xl transition-all duration-300"
              >
                <Brain className="w-4 h-4 mr-2" />
                IA Coach
              </TabsTrigger>
              <TabsTrigger 
                value="tools"
                className="data-[state=active]:bg-accent data-[state=active]:text-accent-ink rounded-xl transition-all duration-300"
              >
                <Calculator className="w-4 h-4 mr-2" />
                Ferramentas
              </TabsTrigger>
            </TabsList>
          </motion.div>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <AnimatePresence mode="wait">
              {/* Main Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, staggerChildren: 0.1 }}
                className="grid md:grid-cols-3 gap-6"
              >
                {/* Calories Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <VoltCard className="p-6 relative overflow-hidden hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                          className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center"
                        >
                          <Flame className="w-5 h-5 text-orange-400" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-txt">Calorias</h3>
                          <p className="text-xs text-txt-2">Meta diária</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[100, 200].map((cal, idx) => (
                          <motion.div
                            key={cal}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 + idx * 0.1 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => quickAddCalories(cal)}
                              className="text-accent hover:bg-accent/10 text-xs px-2"
                            >
                              +{cal}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="flex items-baseline gap-2"
                      >
                        <span className="text-3xl font-bold text-txt">
                          {nutritionData.calories.consumed.toLocaleString()}
                        </span>
                        <span className="text-txt-2">
                          / {nutritionData.calories.target.toLocaleString()} kcal
                        </span>
                      </motion.div>
                      
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        style={{ transformOrigin: 'left' }}
                      >
                        <Progress value={caloriesProgress} className="h-3 bg-surface" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="grid grid-cols-2 gap-4 text-sm"
                      >
                        <div>
                          <span className="text-txt-2">Consumidas</span>
                          <div className="font-semibold text-orange-400">
                            {nutritionData.calories.consumed}
                          </div>
                        </div>
                        <div>
                          <span className="text-txt-2">Queimadas</span>
                          <div className="font-semibold text-red-400">
                            -{nutritionData.calories.burned}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </VoltCard>
                </motion.div>

                {/* Water Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <VoltCard className="p-6 relative overflow-hidden hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <motion.div 
                          animate={{ y: [0, -2, 0] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                          className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center"
                        >
                          <Droplets className="w-5 h-5 text-blue-400" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-txt">Hidratação</h3>
                          <p className="text-xs text-txt-2">Meta diária</p>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {[250, 500].map((amount, idx) => (
                          <motion.div
                            key={amount}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.3 + idx * 0.1 }}
                          >
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => addWater(amount)}
                              className="text-accent hover:bg-accent/10 text-xs px-2"
                            >
                              +{amount}ml
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="flex items-baseline gap-2"
                      >
                        <span className="text-3xl font-bold text-txt">
                          {(nutritionData.water.consumed / 1000).toFixed(1)}L
                        </span>
                        <span className="text-txt-2">
                          / {(nutritionData.water.target / 1000).toFixed(1)}L
                        </span>
                      </motion.div>
                      
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.5, duration: 0.8 }}
                        style={{ transformOrigin: 'left' }}
                      >
                        <Progress value={waterProgress} className="h-3 bg-surface" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="text-center"
                      >
                        <span className="text-blue-400 font-medium text-sm">
                          {nutritionData.water.target - nutritionData.water.consumed > 0 
                            ? `${Math.round((nutritionData.water.target - nutritionData.water.consumed) / 250)} copos restantes` 
                            : 'Meta atingida! 🎉'
                          }
                        </span>
                      </motion.div>
                    </div>
                  </VoltCard>
                </motion.div>

                {/* Protein Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <VoltCard className="p-6 relative overflow-hidden hover:scale-105 transition-transform duration-300">
                    <div className="flex items-center gap-3 mb-4">
                      <motion.div 
                        animate={{ rotateY: [0, 15, -15, 0] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 2 }}
                        className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center"
                      >
                        <ChefHat className="w-5 h-5 text-green-400" />
                      </motion.div>
                      <div>
                        <h3 className="font-semibold text-txt">Proteína</h3>
                        <p className="text-xs text-txt-2">Meta diária</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex items-baseline gap-2"
                      >
                        <span className="text-3xl font-bold text-txt">
                          {nutritionData.macros.protein.consumed}g
                        </span>
                        <span className="text-txt-2">
                          / {nutritionData.macros.protein.target}g
                        </span>
                      </motion.div>
                      
                      <motion.div
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                        style={{ transformOrigin: 'left' }}
                      >
                        <Progress value={proteinProgress} className="h-3 bg-surface" />
                      </motion.div>
                      
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                        className="text-center"
                      >
                        <span className="text-green-400 font-medium text-sm">
                          {nutritionData.macros.protein.target - nutritionData.macros.protein.consumed > 0 
                            ? `${nutritionData.macros.protein.target - nutritionData.macros.protein.consumed}g restantes` 
                            : 'Meta atingida! 💪'
                          }
                        </span>
                      </motion.div>
                    </div>
                  </VoltCard>
                </motion.div>
              </motion.div>

              {/* Macros Distribution */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5, staggerChildren: 0.1 }}
              >
                <VoltCard className="p-6">
                  <motion.h3 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-xl font-semibold text-txt mb-6 flex items-center gap-2"
                  >
                    <BarChart3 className="w-5 h-5 text-accent" />
                    Distribuição de Macronutrientes
                  </motion.h3>
                  
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, staggerChildren: 0.1 }}
                    className="grid md:grid-cols-3 gap-6"
                  >
                    {[
                      { label: 'Proteína', current: nutritionData.macros.protein.consumed, target: nutritionData.macros.protein.target, unit: 'g', color: 'text-green-400' },
                      { label: 'Carboidratos', current: nutritionData.macros.carbs.consumed, target: nutritionData.macros.carbs.target, unit: 'g', color: 'text-blue-400' },
                      { label: 'Gorduras', current: nutritionData.macros.fat.consumed, target: nutritionData.macros.fat.target, unit: 'g', color: 'text-yellow-400' }
                    ].map((macro, index) => (
                      <motion.div
                        key={macro.label}
                        initial={{ opacity: 0, y: 20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
                      >
                        <MacroProgressCard
                          label={macro.label}
                          current={macro.current}
                          target={macro.target}
                          unit={macro.unit}
                          color={macro.color}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </VoltCard>
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* Meals Tab */}
          <TabsContent value="meals" className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <VoltCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-txt flex items-center gap-2">
                    <Utensils className="w-5 h-5 text-accent" />
                    Suas Refeições Hoje
                  </h3>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-accent/30 text-accent hover:bg-accent/10"
                    onClick={() => toast.info('Funcionalidade em desenvolvimento')}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar
                  </Button>
                </div>

                <div className="space-y-3">
                  {nutritionData.meals.map((meal, index) => (
                    <motion.div
                      key={meal.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <MealCard
                        name={meal.name}
                        time={meal.time}
                        calories={meal.calories}
                        completed={meal.completed}
                        onClick={() => toast.info(`Editando ${meal.name}`)}
                      />
                    </motion.div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-line/20">
                  <div className="flex items-center justify-between">
                    <span className="text-txt-2">Total do Dia</span>
                    <span className="text-xl font-bold text-accent">
                      {nutritionData.meals.reduce((sum, meal) => sum + meal.calories, 0)} kcal
                    </span>
                  </div>
                </div>
              </VoltCard>
            </motion.div>
          </TabsContent>

          {/* Chat Tab */}
          <TabsContent value="chat" className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key="chat-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="pb-4" 
              >
                <NutritionAIChat className="max-w-none" />
              </motion.div>
            </AnimatePresence>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key="tools-content"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, staggerChildren: 0.08 }}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {[
                  {
                    title: "Calculadora de Macros",
                    description: "Calcule suas necessidades nutricionais baseadas nos seus objetivos",
                    icon: <Calculator className="w-8 h-8" />,
                    color: "text-blue-400",
                    onClick: () => toast.info('Abrindo calculadora de macros')
                  },
                  {
                    title: "Scanner de Alimentos",
                    description: "Use a câmera para identificar alimentos e obter informações nutricionais",
                    icon: <Camera className="w-8 h-8" />,
                    color: "text-green-400",
                    onClick: () => toast.info('Funcionalidade em desenvolvimento')
                  },
                  {
                    title: "Planejador de Refeições",
                    description: "Crie planos alimentares personalizados com IA",
                    icon: <Brain className="w-8 h-8" />,
                    color: "text-purple-400",
                    onClick: () => setActiveTab('chat'),
                    isPremium: true
                  },
                  {
                    title: "Biblioteca de Receitas",
                    description: "Receitas saudáveis com informações nutricionais completas",
                    icon: <BookOpen className="w-8 h-8" />,
                    color: "text-orange-400",
                    onClick: () => toast.info('Abrindo biblioteca de receitas')
                  },
                  {
                    title: "Relatórios de Progresso",
                    description: "Acompanhe sua evolução nutricional ao longo do tempo",
                    icon: <TrendingUp className="w-8 h-8" />,
                    color: "text-accent",
                    onClick: () => navigate('/progresso')
                  },
                  {
                    title: "Configurar Metas",
                    description: "Defina e ajuste suas metas nutricionais personalizadas",
                    icon: <Target className="w-8 h-8" />,
                    color: "text-red-400",
                    onClick: () => setShowGoalsDialog(true)
                  }
                ].map((tool, index) => (
                  <motion.div
                    key={tool.title}
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.1 + index * 0.08,
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <EnhancedNutritionCard
                      title={tool.title}
                      description={tool.description}
                      icon={tool.icon}
                      color={tool.color}
                      onClick={tool.onClick}
                      isPremium={tool.isPremium}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </div>

      {/* Goals Configuration Dialog */}
      <Dialog open={showGoalsDialog} onOpenChange={setShowGoalsDialog}>
        <DialogContent className="bg-card border-line/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-txt">
              <Target className="w-5 h-5 text-accent" />
              Configurar Metas Nutricionais
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-txt-2">
              Funcionalidade em desenvolvimento. Em breve você poderá personalizar todas as suas metas nutricionais.
            </p>
            <VoltButton onClick={() => setShowGoalsDialog(false)} className="w-full">
              Fechar
            </VoltButton>
          </div>
        </DialogContent>
      </Dialog>
    </div>
    </ErrorBoundary>
  );
};

export default NutricaoPage;