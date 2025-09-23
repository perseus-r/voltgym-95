import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Activity,
  Users,
  TrendingUp,
  Zap,
  Target,
  Calendar,
  Award,
  BarChart3,
  MessageSquare,
  Star,
  Clock,
  Flame
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getWorkoutHistory } from "@/lib/storage";

interface AnalyticsData {
  totalWorkouts: number;
  thisWeekWorkouts: number;
  averageWorkoutDuration: number;
  currentStreak: number;
  topExercises: Array<{ name: string; count: number }>;
  weeklyProgress: Array<{ day: string; workouts: number }>;
  monthlyVolume: number;
  achievements: number;
}

export function AdvancedAnalytics() {
  const { user } = useAuth();
  const [data, setData] = useState<AnalyticsData>({
    totalWorkouts: 0,
    thisWeekWorkouts: 0,
    averageWorkoutDuration: 0,
    currentStreak: 0,
    topExercises: [],
    weeklyProgress: [],
    monthlyVolume: 0,
    achievements: 0
  });

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user]);

  const loadAnalyticsData = () => {
    if (!user) return;

    const history = getWorkoutHistory(user.id);
    
    // Calculate metrics
    const totalWorkouts = history.length;
    
    // This week workouts
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const thisWeekWorkouts = history.filter(entry => 
      new Date(entry.ts) >= weekStart
    ).length;

    // Top exercises
    const exerciseCount: { [key: string]: number } = {};
    history.forEach(entry => {
      entry.items.forEach(item => {
        exerciseCount[item.name] = (exerciseCount[item.name] || 0) + 1;
      });
    });
    
    const topExercises = Object.entries(exerciseCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Weekly progress
    const weeklyProgress = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const dayWorkouts = history.filter(entry => {
        const entryDate = new Date(entry.ts);
        entryDate.setHours(0, 0, 0, 0);
        return entryDate.getTime() === date.getTime();
      }).length;
      
      return {
        day: date.toLocaleDateString('pt-BR', { weekday: 'short' }),
        workouts: dayWorkouts
      };
    }).reverse();

    // Monthly volume
    const thisMonth = new Date();
    thisMonth.setDate(1);
    thisMonth.setHours(0, 0, 0, 0);
    
    const monthlyVolume = history
      .filter(entry => new Date(entry.ts) >= thisMonth)
      .reduce((total, entry) => {
        return total + entry.items.reduce((entryTotal, item) => entryTotal + item.carga, 0);
      }, 0);

    // Current streak
    const currentStreak = calculateStreak(history);

    setData({
      totalWorkouts,
      thisWeekWorkouts,
      averageWorkoutDuration: 45, // Default value
      currentStreak,
      topExercises,
      weeklyProgress,
      monthlyVolume: Math.round(monthlyVolume),
      achievements: Math.floor(totalWorkouts / 5) // 1 achievement per 5 workouts
    });
  };

  const calculateStreak = (history: any[]) => {
    if (history.length === 0) return 0;
    
    const sortedHistory = history
      .map(entry => new Date(entry.ts))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const workoutDate of sortedHistory) {
      const workoutDay = new Date(workoutDate);
      workoutDay.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - workoutDay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === streak) {
        streak++;
      } else if (diffDays > streak + 1) {
        break;
      }
    }
    
    return streak;
  };

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="liquid-glass p-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-xl bg-gradient-primary">
            <BarChart3 className="w-6 h-6 text-accent-ink" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-txt">Analytics Avançado</h2>
            <p className="text-txt-2">Insights detalhados sobre seu progresso fitness</p>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="liquid-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-txt-2 text-sm font-medium">Total de Treinos</p>
                <p className="text-3xl font-bold text-accent">{data.totalWorkouts}</p>
                <p className="text-xs text-txt-3 mt-1">Desde o início</p>
              </div>
              <div className="p-3 rounded-full bg-blue-500/20">
                <Activity className="w-6 h-6 text-blue-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-txt-2 text-sm font-medium">Sequência Atual</p>
                <p className="text-3xl font-bold text-orange-400">{data.currentStreak}</p>
                <p className="text-xs text-txt-3 mt-1">Dias consecutivos</p>
              </div>
              <div className="p-3 rounded-full bg-orange-500/20">
                <Flame className="w-6 h-6 text-orange-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-txt-2 text-sm font-medium">Esta Semana</p>
                <p className="text-3xl font-bold text-green-400">{data.thisWeekWorkouts}</p>
                <p className="text-xs text-txt-3 mt-1">de 4 meta</p>
              </div>
              <div className="p-3 rounded-full bg-green-500/20">
                <Target className="w-6 h-6 text-green-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="liquid-glass">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-txt-2 text-sm font-medium">Volume Mensal</p>
                <p className="text-3xl font-bold text-purple-400">{data.monthlyVolume}kg</p>
                <p className="text-xs text-txt-3 mt-1">Carga total</p>
              </div>
              <div className="p-3 rounded-full bg-purple-500/20">
                <TrendingUp className="w-6 h-6 text-purple-400" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList className="liquid-glass">
          <TabsTrigger value="progress">Progresso</TabsTrigger>
          <TabsTrigger value="exercises">Exercícios</TabsTrigger>
          <TabsTrigger value="achievements">Conquistas</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          {/* Weekly Progress Chart */}
          <Card className="liquid-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-txt">
                <Calendar className="w-5 h-5 text-accent" />
                Progresso Semanal
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.weeklyProgress.map((day, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-12 text-sm text-txt-2 font-medium">{day.day}</div>
                    <div className="flex-1 bg-surface rounded-full h-4 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-primary transition-all duration-500"
                        style={{ width: `${Math.max(day.workouts * 25, 5)}%` }}
                      />
                    </div>
                    <div className="w-8 text-sm text-txt font-medium">{day.workouts}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Goals Progress */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="liquid-glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-txt">Meta Semanal</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-txt-2">Progresso</span>
                    <span className="text-accent font-medium">{data.thisWeekWorkouts}/4</span>
                  </div>
                  <div className="bg-surface rounded-full h-2">
                    <div 
                      className="bg-accent rounded-full h-2 transition-all duration-500"
                      style={{ width: `${getProgressPercentage(data.thisWeekWorkouts, 4)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="liquid-glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Flame className="w-5 h-5 text-orange-400" />
                  <h3 className="font-semibold text-txt">Sequência</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-txt-2">Atual</span>
                    <span className="text-orange-400 font-medium">{data.currentStreak} dias</span>
                  </div>
                  <div className="bg-surface rounded-full h-2">
                    <div 
                      className="bg-orange-400 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${getProgressPercentage(data.currentStreak, 30)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="liquid-glass">
              <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Award className="w-5 h-5 text-yellow-400" />
                  <h3 className="font-semibold text-txt">Conquistas</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-txt-2">Desbloqueadas</span>
                    <span className="text-yellow-400 font-medium">{data.achievements}</span>
                  </div>
                  <div className="bg-surface rounded-full h-2">
                    <div 
                      className="bg-yellow-400 rounded-full h-2 transition-all duration-500"
                      style={{ width: `${getProgressPercentage(data.achievements, 20)}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-6">
          <Card className="liquid-glass">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-txt">
                <Activity className="w-5 h-5 text-accent" />
                Top Exercícios
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {data.topExercises.map((exercise, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                      <span className="text-accent-ink font-bold text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-txt">{exercise.name}</div>
                      <div className="text-sm text-txt-2">{exercise.count} vezes</div>
                    </div>
                    <div className="text-accent font-semibold">{exercise.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }, (_, i) => (
              <Card key={i} className="liquid-glass">
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    i < data.achievements ? 'bg-gradient-primary' : 'bg-surface'
                  }`}>
                    <Award className={`w-8 h-8 ${
                      i < data.achievements ? 'text-accent-ink' : 'text-txt-3'
                    }`} />
                  </div>
                  <h3 className="font-semibold text-txt mb-2">
                    {['Primeiro Treino', 'Consistency', 'Power User', 'Streak Master', 'Elite', 'Legend'][i]}
                  </h3>
                  <p className="text-sm text-txt-2">
                    {[
                      'Complete seu primeiro treino',
                      'Complete 5 treinos',
                      'Complete 10 treinos',
                      'Mantenha 7 dias de sequência',
                      'Complete 25 treinos',
                      'Complete 50 treinos'
                    ][i]}
                  </p>
                  <Badge className={`mt-3 ${
                    i < data.achievements ? 'bg-accent/20 text-accent' : 'bg-surface text-txt-3'
                  }`}>
                    {i < data.achievements ? 'Desbloqueada' : 'Bloqueada'}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}