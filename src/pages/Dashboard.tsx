import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Play, TrendingUp, Trophy, Target, Calendar, Clock, Zap, 
  Activity, Heart, Award, Flame, BarChart3, Settings,
  Plus, Bell, User, Home
} from 'lucide-react';
import { VoltCard, VoltCardPremium } from '@/components/VoltCard';
import { VoltButton } from '@/components/VoltButton';
import { VoltStats } from '@/components/VoltStats';

import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUserWorkouts } from '@/hooks/useUserWorkouts';
import { useAuth } from '@/contexts/AuthContext';
import { useDataCleanup } from '@/hooks/useDataCleanup';
import { LoadingScreen, SkeletonStats } from '@/components/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorFallback';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const { stats, getTodayWorkout, startWorkout, loading } = useUserWorkouts();
  
  // Limpar dados genéricos para novos usuários
  useDataCleanup();

  // IMPORTANTE: Todos os hooks devem vir ANTES de qualquer return condicional
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <LoadingScreen message="Carregando seu dashboard..." />;
  }

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Bom dia";
    if (hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  // Get today's suggested workout
  const todayWorkout = getTodayWorkout();
  const todayWorkouts = todayWorkout ? [
    {
      id: todayWorkout.id,
      name: todayWorkout.name,
      focus: todayWorkout.focus,
      duration: '45min',
      exercises: todayWorkout.exercises.length,
      difficulty: 'Personalizado',
      completed: false,
      scheduled: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ] : [];

  // Generate weekly progress from user stats
  const generateWeeklyProgress = () => {
    const today = new Date().getDay();
    return Array.from({ length: 7 }, (_, i) => ({
      day: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'][i],
      completed: i < stats.weeklyCompleted,
      today: i === today
    }));
  };

  const weeklyProgress = generateWeeklyProgress();

  const quickActions = [
    {
      title: 'Iniciar Treino',
      subtitle: 'Começar agora',
      icon: Play,
      color: 'bg-accent/10 text-accent',
      action: () => navigate('/treinos')
    },
    {
      title: 'IA Coach',
      subtitle: 'Criar treino',
      icon: Zap,
      color: 'bg-purple-500/10 text-purple-400',
      action: () => navigate('/ia-coach')
    },
    {
      title: 'Nutrição',
      subtitle: 'Acompanhar',
      icon: Heart,
      color: 'bg-green-500/10 text-green-400',
      action: () => navigate('/nutricao')
    },
    {
      title: 'Progresso',
      subtitle: 'Ver evolução',
      icon: BarChart3,
      color: 'bg-blue-500/10 text-blue-400',
      action: () => navigate('/progresso')
    }
  ];

  // Generate achievements based on user stats
  const generateAchievements = () => {
    const achievements = [];
    
    if (stats.streak > 0) {
      achievements.push({ text: `🔥 ${stats.streak} dias de streak!`, time: "Atual" });
    }
    
    if (stats.completedWorkouts > 0) {
      achievements.push({ text: `💪 ${stats.completedWorkouts} treinos concluídos`, time: "Total" });
    }
    
    if (stats.weeklyCompleted > 0) {
      const percentage = Math.round((stats.weeklyCompleted / stats.weeklyGoal) * 100);
      achievements.push({ text: `🎯 Meta semanal ${percentage}% completa`, time: "Esta semana" });
    }
    
    // If no achievements, show welcome message
    if (achievements.length === 0) {
      achievements.push(
        { text: "👋 Bem-vindo ao VOLT!", time: "Agora" },
        { text: "🚀 Comece seu primeiro treino!", time: "" },
        { text: "💯 Construa sua jornada fitness!", time: "" }
      );
    }
    
    return achievements;
  };

  const recentAchievements = generateAchievements();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg">
        <div className="container-custom pt-6 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto space-y-6"
          >
          {/* Header Premium */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <VoltCard className="p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="relative">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                    className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center"
                  >
                    <Home className="w-6 h-6 text-accent" />
                  </motion.div>
                </div>
                <h1 className="text-2xl font-bold text-white">Dashboard Premium</h1>
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <p className="text-txt-2">
                {getGreeting()}! Seu centro de controle fitness premium com estatísticas avançadas e insights personalizados.
              </p>
            </VoltCard>
          </motion.div>

          {/* User Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <VoltCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Estatísticas do Usuário
              </h2>
              {loading ? (
                <SkeletonStats />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{stats.level}</div>
                    <div className="text-txt-2 text-sm">Nível</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{stats.xp}</div>
                    <div className="text-txt-2 text-sm">XP Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{stats.streak}</div>
                    <div className="text-txt-2 text-sm">Streak</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-accent">{stats.completedWorkouts}</div>
                    <div className="text-txt-2 text-sm">Treinos</div>
                  </div>
                </div>
              )}
            </VoltCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <VoltCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                Ações Rápidas
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div
                    key={action.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <VoltCard 
                      className="p-4 cursor-pointer text-center h-full" 
                      onClick={action.action}
                      hover
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-2xl flex items-center justify-center mb-3 mx-auto",
                        action.color
                      )}>
                        <action.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-white text-sm mb-1">{action.title}</h3>
                      <p className="text-txt-2 text-xs">{action.subtitle}</p>
                    </VoltCard>
                  </motion.div>
                ))}
              </div>
            </VoltCard>
          </motion.div>

          {/* Weekly Progress */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            <VoltCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-accent" />
                Progresso Semanal
              </h2>
              <div className="flex justify-between items-center">
                {weeklyProgress.map((day, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.3 }}
                    className="flex flex-col items-center gap-2"
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300",
                      day.completed 
                        ? "bg-accent text-accent-ink border-accent" 
                        : "bg-surface text-txt-2 border-line",
                      day.today && "ring-2 ring-accent/50 scale-110"
                    )}>
                      {day.completed ? "✓" : day.day}
                    </div>
                    <span className="text-xs text-txt-2">{day.day}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 text-center">
                <p className="text-txt-2 text-sm">
                  {stats.weeklyCompleted} de {stats.weeklyGoal} treinos esta semana
                </p>
              </div>
            </VoltCard>
          </motion.div>

          {/* Today's Workout */}
          {todayWorkouts.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <VoltCard className="p-6">
                <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <Play className="w-5 h-5 text-accent" />
                  Treino de Hoje
                </h2>
                {todayWorkouts.map((workout) => (
                  <div key={workout.id} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-white">{workout.name}</h3>
                        <p className="text-txt-2 text-sm">{workout.focus}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-accent font-semibold">{workout.scheduled}</p>
                        <p className="text-txt-2 text-sm">{workout.duration}</p>
                      </div>
                    </div>
                    <div className="flex gap-4 text-sm text-txt-2">
                      <span>{workout.exercises} exercícios</span>
                      <span>•</span>
                      <span>{workout.difficulty}</span>
                    </div>
                    <VoltButton 
                      className="w-full" 
                      onClick={() => {
                        if (todayWorkout) {
                          startWorkout(todayWorkout);
                          navigate('/treinos');
                        } else {
                          navigate('/treinos');
                        }
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Iniciar Treino
                    </VoltButton>
                  </div>
                ))}
              </VoltCard>
            </motion.div>
          )}

          {/* Recent Achievements */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
          >
            <VoltCard className="p-6">
              <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-accent" />
                Conquistas Recentes
              </h2>
              <div className="space-y-3">
                {recentAchievements.map((achievement, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.1 + index * 0.1, duration: 0.4 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface/30 border border-line/20"
                  >
                    <span className="text-txt text-sm">{achievement.text}</span>
                    <span className="text-txt-2 text-xs">{achievement.time}</span>
                  </motion.div>
                ))}
              </div>
            </VoltCard>
          </motion.div>
          </motion.div>
        </div>
      </div>
    </ErrorBoundary>
  );
}