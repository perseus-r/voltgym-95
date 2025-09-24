import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { unifiedDataService } from '@/services/UnifiedDataService';
import { HeroNextWorkout } from '@/components/HeroNextWorkout';
import { StreakWeek } from '@/components/StreakWeek';
import { ConsistencyDonut } from '@/components/ConsistencyDonut';
import { QuickActions } from '@/components/QuickActions';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Activity,
  Target,
  Flame,
  TrendingUp,
  Calendar,
  Play,
  Plus,
  BarChart3
} from 'lucide-react';
import { toast } from 'sonner';
import { useUserWorkouts } from '@/hooks/useUserWorkouts';
import { useNavigate } from 'react-router-dom';

export const MobileOptimizedDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { startWorkout, getTodayWorkout, getQuickTemplates } = useUserWorkouts();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentWorkouts, setRecentWorkouts] = useState([]);

  const todayWorkout = getTodayWorkout();
  const quickTemplates = getQuickTemplates();
  const defaultWorkout = todayWorkout || quickTemplates[0];

  const heroWorkout = defaultWorkout
    ? {
        exercises: defaultWorkout.exercises.map((exercise, index) => ({
          name: exercise.name || `Exercício ${index + 1}`,
          sets: exercise.sets ?? 3,
          reps: typeof exercise.reps === 'string' ? exercise.reps : `${exercise.reps ?? 10}`,
          rest_s: exercise.rest ?? 90
        }))
      }
    : undefined;

  const handleStartWorkout = () => {
    if (!defaultWorkout) {
      toast.info('Nenhum treino disponível no momento');
      return;
    }

    startWorkout(defaultWorkout);
    navigate('/treinos');
  };

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [userStats, workoutHistory] = await Promise.all([
        unifiedDataService.getUserStats(),
        unifiedDataService.getWorkoutHistory(5)
      ]);
      
      setStats(userStats);
      setRecentWorkouts(workoutHistory);
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pb-20 md:pb-6">
        <div className="safe-area-top p-3 md:p-4 lg:p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-4 animate-pulse">
                <div className="h-4 bg-surface rounded w-3/4 mb-2"></div>
                <div className="h-8 bg-surface rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      {/* Mobile-First Header */}
      <div className="safe-area-top p-3 md:p-4 lg:p-6">
        {/* Welcome Section - Mobile optimized */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-txt">
                Bom dia, {user?.user_metadata?.display_name || 'Atleta'}! 💪
              </h1>
              <p className="text-sm md:text-base text-txt-2">
                Pronto para treinar hoje?
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl md:text-3xl font-bold text-accent">
                {stats?.currentXP || 0}
              </div>
              <div className="text-xs text-txt-3">XP</div>
            </div>
          </div>
          
          {/* Stats Cards - Mobile Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
            <StatsCard
              icon={<Flame className="w-4 h-4" />}
              title="Streak"
              value={`${stats?.streak || 0} dias`}
              color="text-orange-400"
            />
            <StatsCard
              icon={<Target className="w-4 h-4" />}
              title="Treinos"
              value={stats?.totalWorkouts || 0}
              color="text-blue-400"
            />
            <StatsCard
              icon={<Activity className="w-4 h-4" />}
              title="Semana"
              value={`${stats?.weeklyWorkouts || 0}/4`}
              color="text-green-400"
            />
            <StatsCard
              icon={<TrendingUp className="w-4 h-4" />}
              title="Volume"
              value={`${Math.round((stats?.totalVolume || 0) / 1000)}k kg`}
              color="text-purple-400"
            />
          </div>
        </div>

        {/* Hero Workout - Mobile optimized */}
        <div className="mb-6">
          <HeroNextWorkout
            focus={defaultWorkout?.name || defaultWorkout?.focus || 'Seu próximo treino'}
            workout={heroWorkout}
            onStart={handleStartWorkout}
          />
        </div>

        {/* Progress Section - Mobile layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
          <div className="glass-card p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-txt mb-4">
              Meta Semanal
            </h3>
            <StreakWeek />
          </div>
          
          <div className="glass-card p-4 md:p-6">
            <h3 className="text-base md:text-lg font-semibold text-txt mb-4">
              Consistência
            </h3>
            <ConsistencyDonut />
          </div>
        </div>

        {/* Recent Workouts - Mobile optimized */}
        {recentWorkouts.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-txt">Treinos Recentes</h2>
              <Button variant="ghost" size="sm" className="text-accent">
                <BarChart3 className="w-4 h-4 mr-1" />
                Ver todos
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentWorkouts.slice(0, 3).map((workout, index) => (
                <Card key={workout.id || index} className="glass-card p-3 md:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-txt text-sm md:text-base truncate">
                        {workout.name || workout.focus}
                      </h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-txt-2">
                          {new Date(workout.completed_at).toLocaleDateString('pt-BR')}
                        </span>
                        <Badge variant="secondary" className="text-xs">
                          {workout.exercises?.length || 0} exercícios
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="text-right ml-4">
                      <div className="text-sm font-semibold text-accent">
                        +{workout.xp_earned || 0} XP
                      </div>
                      {workout.total_volume && (
                        <div className="text-xs text-txt-3">
                          {Math.round(workout.total_volume)} kg
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions - Mobile optimized */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-txt mb-4">Ações Rápidas</h2>
          <QuickActions onStartWorkout={handleStartWorkout} />
        </div>

        {/* Motivation Card - Mobile */}
        <Card className="glass-card p-4 md:p-6 text-center">
          <div className="mb-4">
            <div className="text-4xl mb-2">🔥</div>
            <h3 className="text-lg font-semibold text-txt mb-2">
              Você está no caminho certo!
            </h3>
            <p className="text-sm text-txt-2">
              Continue assim e alcance seus objetivos de forma consistente.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button className="bg-accent text-accent-ink hover:bg-accent/90">
              <Play className="w-4 h-4 mr-2" />
              Iniciar Treino
            </Button>
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Criar Plano
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

// Mobile-optimized stats card
const StatsCard = ({ icon, title, value, color }) => (
  <Card className="glass-card p-3 md:p-4">
    <div className="flex items-center gap-2 mb-2">
      <div className={`${color}`}>
        {icon}
      </div>
      <span className="text-xs md:text-sm text-txt-2 truncate">{title}</span>
    </div>
    <div className="text-lg md:text-xl font-bold text-txt">
      {value}
    </div>
  </Card>
);

export default MobileOptimizedDashboard;