import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, Target, Calendar, Trophy, Clock } from 'lucide-react';
import { VoltCard } from './VoltCard';
import { cn } from '@/lib/utils';

interface StatItem {
  label: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color?: string;
}

interface VoltStatsProps {
  stats: StatItem[];
  className?: string;
  columns?: 2 | 3 | 4;
}

export function VoltStats({ stats, className, columns = 3 }: VoltStatsProps) {
  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-2 md:grid-cols-4'
  };

  return (
    <div className={cn(`grid ${gridCols[columns]} gap-4`, className)}>
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <VoltCard 
            className="p-6 relative overflow-hidden group"
            hover
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="relative z-10">
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-all duration-300",
                stat.color || "bg-accent/10 text-accent group-hover:bg-accent/20"
              )}>
                {stat.icon}
              </div>

              {/* Value */}
              <div className="flex items-end gap-2 mb-2">
                <motion.span
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
                >
                  {stat.value}
                </motion.span>
                
                {stat.change && (
                  <span className={cn(
                    "text-sm font-medium flex items-center gap-1",
                    stat.trend === 'up' && "text-accent",
                    stat.trend === 'down' && "text-orange-500",
                    stat.trend === 'neutral' && "text-txt-3"
                  )}>
                    {stat.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                    {stat.change}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-txt-3 text-sm font-medium">
                {stat.label}
              </span>
            </div>

            {/* Animated border on hover */}
            <motion.div
              className="absolute inset-0 border-2 border-accent/30 rounded-2xl opacity-0 group-hover:opacity-100"
              initial={false}
              animate={{ 
                scale: [1, 1.02, 1],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatType: "loop"
              }}
            />
          </VoltCard>
        </motion.div>
      ))}
    </div>
  );
}

// Preset stat components
export function VoltStatsWorkout({ className }: { className?: string }) {
  const workoutStats: StatItem[] = [
    {
      label: "Treinos Completos",
      value: 42,
      change: "+12%",
      trend: "up",
      icon: <Trophy className="w-6 h-6" />,
      color: "bg-accent/10 text-accent"
    },
    {
      label: "Streak Atual",
      value: "7 dias",
      change: "Recorde!",
      trend: "up",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-orange-500/10 text-orange-500"
    },
    {
      label: "Tempo Médio",
      value: "45min",
      change: "-5min",
      trend: "up",
      icon: <Clock className="w-6 h-6" />,
      color: "bg-blue-500/10 text-blue-400"
    }
  ];

  return <VoltStats stats={workoutStats} className={className} />;
}

export function VoltStatsProgress({ className }: { className?: string }) {
  const progressStats: StatItem[] = [
    {
      label: "Meta Semanal",
      value: "4/4",
      change: "100%",
      trend: "up",
      icon: <Target className="w-6 h-6" />,
      color: "bg-accent/10 text-accent"
    },
    {
      label: "Este Mês",
      value: 18,
      change: "+25%",
      trend: "up",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-purple-500/10 text-purple-400"
    },
    {
      label: "Consistência",
      value: "87%",
      change: "+8%",
      trend: "up",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-accent/10 text-accent"
    },
    {
      label: "Nível Atual",
      value: "Pro",
      icon: <Zap className="w-6 h-6" />,
      color: "bg-orange-500/10 text-orange-500"
    }
  ];

  return <VoltStats stats={progressStats} columns={4} className={className} />;
}