import { useState, useMemo } from "react";
import { Flame, Target, Calendar, TrendingUp, Award, ChevronRight } from "lucide-react";
import { getStreakData, getWeekCount, getStorage } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export function StreakWeek() {
  const { user } = useAuth();
  const [showDetails, setShowDetails] = useState(false);
  const { current, best } = getStreakData();
  const weekCount = user ? getWeekCount(user.id) : 0;
  const weekGoal = 4;
  
  const workoutHistory = getStorage('bora_hist_v1', []);

  const streakAnalytics = useMemo(() => {
    const now = new Date();
    
    // Last 7 days activity
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const hasWorkout = workoutHistory.some((session: any) => {
        const sessionDate = new Date(session.ts);
        sessionDate.setHours(0, 0, 0, 0);
        return sessionDate.getTime() === date.getTime();
      });
      
      return {
        date: date.toLocaleDateString('pt-BR', { weekday: 'short', day: 'numeric' }),
        hasWorkout,
        isToday: i === 0
      };
    }).reverse();

    // Streak milestones
    const milestones = [
      { days: 3, name: 'Iniciante', achieved: current >= 3 },
      { days: 7, name: 'Consistente', achieved: current >= 7 },
      { days: 14, name: 'Dedicado', achieved: current >= 14 },
      { days: 30, name: 'Viciado', achieved: current >= 30 },
      { days: 50, name: 'Lendário', achieved: current >= 50 }
    ];

    const nextMilestone = milestones.find(m => !m.achieved);
    
    // Calculate weekly trend
    const thisWeek = weekCount;
    const lastWeekStart = new Date();
    lastWeekStart.setDate(lastWeekStart.getDate() - 14);
    lastWeekStart.setDate(lastWeekStart.getDate() - lastWeekStart.getDay());
    
    const lastWeekEnd = new Date();
    lastWeekEnd.setDate(lastWeekEnd.getDate() - 7);
    lastWeekEnd.setDate(lastWeekEnd.getDate() - lastWeekEnd.getDay() + 6);
    
    const lastWeekWorkouts = workoutHistory.filter((session: any) => {
      const sessionDate = new Date(session.ts);
      return sessionDate >= lastWeekStart && sessionDate <= lastWeekEnd;
    }).length;

    const weeklyTrend = thisWeek - lastWeekWorkouts;

    return {
      last7Days,
      milestones,
      nextMilestone,
      weeklyTrend,
      streakPercentage: Math.min((current / (nextMilestone?.days || 100)) * 100, 100)
    };
  }, [workoutHistory, current, weekCount]);

  return (
    <div className="liquid-glass p-5 md:p-6 border border-accent/10 hover:border-accent/20 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-red-500 rounded-full blur animate-pulse"></div>
            <div className="relative w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <Flame className="w-5 h-5 text-white animate-bounce" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-bold text-txt">Sequência de Fogo</h3>
            <p className="text-xs text-txt-3">Mantenha o ritmo!</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-3xl font-black bg-gradient-to-r from-accent to-accent-2 bg-clip-text text-transparent">{current}</span>
            <span className="text-sm text-txt-3 font-medium">DIAS</span>
          </div>
          {current >= best && current > 0 && (
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black text-xs font-bold animate-pulse">
              🏆 RECORDE!
            </Badge>
          )}
        </div>
      </div>
      
      <div className="space-y-4">
        {/* Weekly Progress */}
        <div className="flex justify-between items-center">
          <span className="text-txt-2">Esta semana</span>
          <div className="flex items-center gap-2">
            <span className="text-lg font-semibold text-accent">
              {weekCount}/{weekGoal}
            </span>
            {streakAnalytics.weeklyTrend > 0 && (
              <TrendingUp className="w-4 h-4 text-success" />
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="w-full bg-surface rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-primary h-3 rounded-full transition-all duration-500 relative"
              style={{ width: `${Math.min((weekCount / weekGoal) * 100, 100)}%` }}
            >
              {weekCount >= weekGoal && (
                <div className="absolute inset-0 bg-white/20 animate-pulse rounded-full" />
              )}
            </div>
          </div>
          
          <div className="flex justify-between text-sm text-txt-3">
            <span>Melhor: {best} dias</span>
            <span>{Math.round((weekCount / weekGoal) * 100)}% da meta</span>
          </div>
        </div>

        {/* 7-Day Activity Grid */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium text-txt-2">Últimos 7 dias</span>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="text-xs text-accent hover:text-accent-2 flex items-center gap-1"
            >
              Detalhes 
              <ChevronRight className={`w-3 h-3 transition-transform ${showDetails ? 'rotate-90' : ''}`} />
            </button>
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {streakAnalytics.last7Days.map((day, index) => (
              <div key={index} className="text-center">
                <div className="text-xs text-txt-3 mb-1">{day.date.split(' ')[0]}</div>
                <div 
                  className={`w-6 h-6 mx-auto rounded-lg border-2 transition-all ${
                    day.hasWorkout 
                      ? 'bg-gradient-primary border-accent shadow-lg shadow-accent/30' 
                      : 'border-surface bg-surface/30'
                  } ${day.isToday ? 'ring-2 ring-accent ring-opacity-50' : ''}`}
                >
                  {day.hasWorkout && (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-accent-ink rounded-full" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Milestone Progress */}
        {streakAnalytics.nextMilestone && (
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-txt-2">Próxima Conquista</span>
              <span className="text-xs text-accent">{streakAnalytics.nextMilestone.name}</span>
            </div>
            
            <div className="space-y-1">
              <div className="w-full bg-surface rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-accent to-accent-2 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${streakAnalytics.streakPercentage}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-txt-3">
                <span>{current} dias</span>
                <span>{streakAnalytics.nextMilestone.days} dias</span>
              </div>
            </div>
          </div>
        )}

        {/* Achievement Badges */}
        {showDetails && (
          <div className="space-y-2">
            <span className="text-sm font-medium text-txt-2">Conquistas</span>
            <div className="grid grid-cols-2 gap-2">
              {streakAnalytics.milestones.map((milestone, index) => (
                <div 
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg border transition-all ${
                    milestone.achieved 
                      ? 'bg-gradient-primary/20 border-accent/30' 
                      : 'bg-surface/30 border-surface'
                  }`}
                >
                  <Award className={`w-3 h-3 ${milestone.achieved ? 'text-yellow-400' : 'text-txt-3'}`} />
                  <div>
                    <div className={`text-xs font-medium ${milestone.achieved ? 'text-txt' : 'text-txt-3'}`}>
                      {milestone.name}
                    </div>
                    <div className="text-xs text-txt-3">{milestone.days} dias</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Current streak celebration */}
        {current >= 7 && (
          <div className="p-3 rounded-lg bg-gradient-primary/20 border border-accent/30">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-400 animate-bounce" />
              <span className="text-sm font-medium text-txt">
                {current >= 30 ? '🔥 Você está imparável!' : 
                 current >= 14 ? '💪 Ritmo excelente!' : 
                 '⚡ Continuem assim!'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}