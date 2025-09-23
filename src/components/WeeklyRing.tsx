import { Calendar, Target } from "lucide-react";
import { getWeekCount } from "@/lib/storage";
import { useAuth } from "@/contexts/AuthContext";

export function WeeklyRing() {
  const { user } = useAuth();
  const weekCount = user ? getWeekCount(user.id) : 0;
  const weekGoal = 4;
  const percentage = Math.min((weekCount / weekGoal) * 100, 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-semibold">Meta Semanal</h3>
      </div>
      
      <div className="flex items-center justify-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="hsl(var(--surface))"
              strokeWidth="6"
              fill="transparent"
            />
            
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r="40"
              stroke="url(#weeklyGradient)"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            
            <defs>
              <linearGradient id="weeklyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="hsl(var(--accent))" />
                <stop offset="100%" stopColor="hsl(var(--accent-2))" />
              </linearGradient>
            </defs>
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-accent">{weekCount}</span>
            <span className="text-xs text-txt-3">de {weekGoal}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <div className="flex items-center justify-center gap-1 text-sm">
          <Target className="w-4 h-4 text-accent" />
          <span className="text-txt-2">{Math.round(percentage)}% da meta atingida</span>
        </div>
        <p className="text-xs text-txt-3 mt-1">
          {weekGoal - weekCount > 0 
            ? `Faltam ${weekGoal - weekCount} treinos esta semana`
            : "Meta semanal alcançada! 🎉"
          }
        </p>
      </div>
    </div>
  );
}