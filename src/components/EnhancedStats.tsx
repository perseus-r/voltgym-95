import { useState } from "react";
import { Zap, Target, TrendingUp, Clock, Award, Calendar, Flame, Trophy } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardProps {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  trend?: string;
  color: string;
  animated?: boolean;
}

function StatsCard({ icon, value, label, trend, color, animated = true }: StatsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card 
      className={`liquid-glass p-6 text-center cursor-pointer transition-all duration-500 ${animated ? 'animate-fade-in' : ''} hover:scale-105`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <CardContent className="p-0">
        <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${color} flex items-center justify-center shadow-lg transform transition-all duration-300 ${isHovered ? 'scale-110 rotate-12' : ''}`}>
          {icon}
        </div>
        <div className={`text-3xl font-bold text-txt mb-2 transition-all duration-300 ${isHovered ? 'scale-110' : ''}`}>
          {value}
        </div>
        <div className="text-sm text-txt-3 font-medium">{label}</div>
        {trend && (
          <div className="text-xs text-accent mt-1 font-semibold">
            {trend}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface EnhancedStatsProps {
  userXP: number;
  workoutsThisMonth?: number;
  averageWorkoutTime?: number;
  currentStreak?: number;
}

export function EnhancedStats({ 
  userXP, 
  workoutsThisMonth = 12, 
  averageWorkoutTime = 45,
  currentStreak = 7 
}: EnhancedStatsProps) {
  const stats = [
    {
      icon: <Zap className="w-8 h-8 text-white" />,
      value: userXP.toLocaleString(),
      label: "XP Total",
      trend: "+25% este mês",
      color: "from-blue-500 to-cyan-400"
    },
    {
      icon: <Flame className="w-8 h-8 text-white" />,
      value: currentStreak,
      label: "Sequência",
      trend: "Recorde pessoal!",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: <Target className="w-8 h-8 text-white" />,
      value: workoutsThisMonth,
      label: "Treinos/Mês",
      trend: "+3 vs meta",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: <Clock className="w-8 h-8 text-white" />,
      value: `${averageWorkoutTime}min`,
      label: "Média/Treino",
      trend: "Consistente",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Trophy className="w-8 h-8 text-white" />,
      value: "Elite",
      label: "Nível Atual",
      trend: "95% próximo nível",
      color: "from-yellow-500 to-amber-500"
    },
    {
      icon: <Award className="w-8 h-8 text-white" />,
      value: "12",
      label: "Conquistas",
      trend: "2 novas disponíveis",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-white" />,
      value: "+18%",
      label: "Progresso",
      trend: "Acima da média",
      color: "from-teal-500 to-cyan-600"
    },
    {
      icon: <Calendar className="w-8 h-8 text-white" />,
      value: "24",
      label: "Dias Ativos",
      trend: "Este mês",
      color: "from-rose-500 to-pink-600"
    }
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={index}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <StatsCard {...stat} />
        </div>
      ))}
    </div>
  );
}