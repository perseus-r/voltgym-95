import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Target, Trophy, Zap, Calendar, TrendingUp, Heart } from 'lucide-react';
import { VoltCard } from './VoltCard';
import { VoltButton } from './VoltButton';
import { cn } from '@/lib/utils';

interface WorkoutCardProps {
  title: string;
  duration: string;
  exercises: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  onStart: () => void;
  className?: string;
  isRecommended?: boolean;
}

export function VoltWorkoutCard({ 
  title, 
  duration, 
  exercises, 
  difficulty,
  category,
  onStart, 
  className,
  isRecommended = false
}: WorkoutCardProps) {
  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-400 bg-green-400/10';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10';
      case 'hard': return 'text-red-400 bg-red-400/10';
      default: return 'text-accent bg-accent/10';
    }
  };

  const getDifficultyLabel = (diff: string) => {
    switch (diff) {
      case 'easy': return 'Fácil';
      case 'medium': return 'Médio';
      case 'hard': return 'Difícil';
      default: return 'Médio';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn("relative", className)}
    >
      <VoltCard className="p-6 h-full relative overflow-hidden group border-gradient">
        {/* Recommended Badge */}
        {isRecommended && (
          <div className="absolute -top-2 -right-2 bg-accent text-accent-ink px-3 py-1 rounded-bl-lg text-xs font-bold z-10">
            RECOMENDADO
          </div>
        )}

        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent/30 rounded-full"
              animate={{
                x: [0, Math.random() * 100 - 50],
                y: [0, Math.random() * 100 - 50],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  {category}
                </span>
                <div className={cn("px-2 py-1 rounded-full text-xs font-medium", getDifficultyColor(difficulty))}>
                  {getDifficultyLabel(difficulty)}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-txt mb-2 group-hover:text-accent transition-colors">
                {title}
              </h3>
            </div>
            
            <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
              <Zap className="w-6 h-6 text-accent" />
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 mb-6 text-txt-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">{duration}</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">{exercises} exercícios</span>
            </div>
          </div>

          {/* Action Button */}
          <VoltButton
            variant="primary"
            onClick={onStart}
            className="w-full group/btn"
            size="lg"
          >
            <motion.div
              className="flex items-center justify-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Play className="w-5 h-5" />
              <span>Iniciar Treino</span>
            </motion.div>
          </VoltButton>
        </div>
      </VoltCard>
    </motion.div>
  );
}

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  trend?: 'up' | 'down' | 'neutral';
  icon: React.ReactNode;
  color?: string;
  className?: string;
}

export function VoltStatsCard({ 
  title, 
  value, 
  change, 
  trend = 'neutral', 
  icon, 
  color = 'bg-accent/10 text-accent',
  className 
}: StatsCardProps) {
  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-400';
      case 'down': return 'text-red-400';
      default: return 'text-txt-3';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-3 h-3" />;
      case 'down': return <TrendingUp className="w-3 h-3 rotate-180" />;
      default: return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.2 }}
      className={className}
    >
      <VoltCard className="p-6 relative overflow-hidden group">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Content */}
        <div className="relative z-10">
          {/* Icon */}
          <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", color)}>
            {icon}
          </div>
          
          {/* Value */}
          <div className="mb-2">
            <div className="text-2xl font-bold text-txt mb-1">{value}</div>
            {change && (
              <div className={cn("flex items-center gap-1 text-sm", getTrendColor(trend))}>
                {getTrendIcon(trend)}
                <span>{change}</span>
              </div>
            )}
          </div>
          
          {/* Title */}
          <div className="text-txt-3 text-sm font-medium">{title}</div>
        </div>
      </VoltCard>
    </motion.div>
  );
}

interface ProgressCardProps {
  title: string;
  current: number;
  target: number;
  unit?: string;
  color?: string;
  icon: React.ReactNode;
  className?: string;
}

export function VoltProgressCard({ 
  title, 
  current, 
  target, 
  unit = '', 
  color = 'accent',
  icon,
  className 
}: ProgressCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={className}
    >
      <VoltCard className="p-6 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl bg-${color}/10 flex items-center justify-center`}>
            {icon}
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-txt">{current}{unit}</div>
            <div className="text-xs text-txt-3">de {target}{unit}</div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-txt">{title}</span>
            <span className="text-sm text-txt-2">{Math.round(percentage)}%</span>
          </div>
          
          <div className="w-full bg-surface/50 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full bg-${color}`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </div>
        </div>

        {/* Status */}
        <div className="text-xs text-txt-3">
          {current >= target ? (
            <span className="text-green-400 font-medium">✓ Meta atingida!</span>
          ) : (
            <span>Restam {target - current}{unit} para a meta</span>
          )}
        </div>
      </VoltCard>
    </motion.div>
  );
}