import { useState, useEffect, useMemo } from "react";
import { Calendar, TrendingUp, Target, Clock, Award } from "lucide-react";
import { getConsistencyData, getStorage } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";

export function ConsistencyDonut() {
  const { user } = useAuth();
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'quarter'>('month');
  
  const workoutHistory = getStorage('bora_hist_v1', []);
  
  const consistencyData = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    let plannedTarget = 4;
    
    switch (timeframe) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        plannedTarget = 4;
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        plannedTarget = 16;
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        plannedTarget = 48;
        break;
    }

    const filteredHistory = workoutHistory.filter((session: any) => 
      new Date(session.ts) >= startDate
    );

    const completed = filteredHistory.length;
    const percentage = Math.round((completed / plannedTarget) * 100);
    
    // Calculate streak data
    const sortedHistory = workoutHistory
      .map(s => new Date(s.ts))
      .sort((a, b) => b.getTime() - a.getTime());
    
    let currentStreak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    
    for (const workoutDate of sortedHistory) {
      const workoutDay = new Date(workoutDate);
      workoutDay.setHours(0, 0, 0, 0);
      
      const diffDays = Math.floor((currentDate.getTime() - workoutDay.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === currentStreak) {
        currentStreak++;
      } else if (diffDays > currentStreak + 1) {
        break;
      }
    }

    // Calculate weekly consistency (last 4 weeks)
    const weeklyData = Array.from({ length: 4 }, (_, i) => {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7) - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weekEnd.setHours(23, 59, 59, 999);

      const weekWorkouts = workoutHistory.filter((session: any) => {
        const sessionDate = new Date(session.ts);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      }).length;

      return {
        week: i === 0 ? 'Esta' : i === 1 ? 'Passada' : `${i + 1}ª atrás`,
        workouts: weekWorkouts,
        percentage: Math.round((weekWorkouts / 4) * 100)
      };
    }).reverse();

    return {
      completed,
      planned: plannedTarget,
      percentage,
      currentStreak,
      weeklyData,
      trend: weeklyData[3]?.workouts > weeklyData[2]?.workouts ? 'up' : 'down'
    };
  }, [workoutHistory, timeframe]);

  const { completed, planned, percentage, currentStreak, weeklyData, trend } = consistencyData;
  
  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  // Create prediction arc
  const predictedPercentage = Math.min(percentage + 15, 100);
  const predictedStrokeDashoffset = circumference - (predictedPercentage / 100) * circumference;

  return (
    <div className="glass-card p-4 md:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-txt">Consistência</h3>
        <div className="flex gap-1">
          {['week', 'month', 'quarter'].map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf as any)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                timeframe === tf 
                  ? 'bg-accent text-accent-ink' 
                  : 'text-txt-3 hover:text-txt-2'
              }`}
            >
              {tf === 'week' ? 'Sem' : tf === 'month' ? 'Mês' : 'Trim'}
            </button>
          ))}
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--surface))"
              strokeWidth="6"
              fill="transparent"
            />
            
            {/* Prediction circle (lighter) */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="hsl(var(--accent) / 0.3)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={predictedStrokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="url(#consistencyGradient)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
              style={{
                filter: 'drop-shadow(0 0 8px hsl(var(--accent) / 0.5))'
              }}
            />
            
            <defs>
              <linearGradient id="consistencyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--accent))" />
                <stop offset="50%" stopColor="hsl(var(--accent-2))" />
                <stop offset="100%" stopColor="hsl(var(--accent))" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-accent animate-pulse-glow">{percentage}%</span>
            <span className="text-xs text-txt-3">Atingido</span>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-txt-2">Concluídos</span>
          <span className="text-accent font-semibold">{completed}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-txt-2">Meta {timeframe === 'week' ? 'Semanal' : timeframe === 'month' ? 'Mensal' : 'Trimestral'}</span>
          <span className="text-txt-3">{planned}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-txt-2">Sequência Atual</span>
          <div className="flex items-center gap-1">
            <span className="text-orange-400 font-semibold">{currentStreak}</span>
            <span className="text-txt-3 text-xs">dias</span>
          </div>
        </div>

        {/* Trend indicator */}
        <div className="flex items-center justify-between text-sm pt-2 border-t border-line/20">
          <span className="text-txt-2">Tendência</span>
          <div className="flex items-center gap-1">
            <TrendingUp className={`w-3 h-3 ${trend === 'up' ? 'text-success' : 'text-error'} ${trend === 'up' ? '' : 'rotate-180'}`} />
            <span className={`text-xs font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
              {trend === 'up' ? 'Melhorando' : 'Atenção'}
            </span>
          </div>
        </div>
      </div>

      {/* Weekly breakdown */}
      <div className="mt-4 space-y-2">
        <h4 className="text-sm font-medium text-txt-2">Últimas Semanas</h4>
        {weeklyData.map((week, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className="w-12 text-xs text-txt-3">{week.week}</div>
            <div className="flex-1 bg-surface rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${week.percentage}%` }}
              />
            </div>
            <div className="w-6 text-xs text-txt font-medium">{week.workouts}</div>
          </div>
        ))}
      </div>

      {/* Achievement badges */}
      {percentage >= 100 && (
        <div className="mt-4 p-2 rounded-lg bg-gradient-primary/20 border border-accent/30">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium text-txt">Meta Atingida!</span>
          </div>
        </div>
      )}
    </div>
  );
}