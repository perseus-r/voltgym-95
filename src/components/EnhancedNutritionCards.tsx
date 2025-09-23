import React from 'react';
import { motion } from 'framer-motion';
import { Apple, Calculator, ChefHat, Brain, TrendingUp, Target, Utensils, Award } from 'lucide-react';
import { VoltCard } from './VoltCard';
import { VoltButton } from './VoltButton';
import { cn } from '@/lib/utils';

interface NutritionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  onClick: () => void;
  isPremium?: boolean;
  className?: string;
}

export function EnhancedNutritionCard({ 
  title, 
  description, 
  icon, 
  color, 
  onClick, 
  isPremium = false,
  className 
}: NutritionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className={cn("relative", className)}
    >
      <VoltCard 
        className={cn(
          "p-6 h-full relative overflow-hidden group cursor-pointer",
          isPremium && "border-2 border-accent/30"
        )}
        onClick={onClick}
      >
        {/* Premium Badge */}
        {isPremium && (
          <div className="absolute -top-2 -right-2 bg-accent text-accent-ink px-3 py-1 rounded-bl-lg text-xs font-bold z-10">
            PREMIUM
          </div>
        )}

        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className={cn("absolute w-2 h-2 rounded-full opacity-20", color.replace('text-', 'bg-'))}
              animate={{
                x: [0, Math.random() * 50 - 25],
                y: [0, Math.random() * 50 - 25],
                scale: [0, 1, 0],
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
          {/* Icon */}
          <div className={cn("w-16 h-16 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300", color.replace('text-', 'bg-') + '/10', color)}>
            {icon}
          </div>
          
          {/* Text */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-txt group-hover:text-accent transition-colors">
              {title}
            </h3>
            
            <p className="text-txt-2 text-sm leading-relaxed">
              {description}
            </p>
          </div>

          {/* Action Area */}
          <div className="mt-6 pt-4 border-t border-line/20">
            <VoltButton
              variant="ghost"
              size="sm"
              className="w-full group/btn opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="text-accent font-semibold"
              >
                {isPremium ? 'Acessar Premium' : 'Abrir'}
              </motion.span>
            </VoltButton>
          </div>
        </div>
      </VoltCard>
    </motion.div>
  );
}

interface MacroCardProps {
  label: string;
  current: number;
  target: number;
  unit: string;
  color: string;
  className?: string;
}

export function MacroProgressCard({ label, current, target, unit, color, className }: MacroCardProps) {
  const percentage = Math.min((current / target) * 100, 100);
  const remaining = Math.max(target - current, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      <VoltCard className="p-4 relative overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold text-txt uppercase tracking-wider">
            {label}
          </span>
          <div className="text-right">
            <div className="text-lg font-bold text-txt">{current}{unit}</div>
            <div className="text-xs text-txt-3">de {target}{unit}</div>
          </div>
        </div>

        {/* Progress Ring */}
        <div className="relative flex items-center justify-center mb-3">
          <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
            <circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-surface/50"
            />
            <motion.circle
              cx="32"
              cy="32"
              r="28"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 28}`}
              strokeDashoffset={`${2 * Math.PI * 28 * (1 - percentage / 100)}`}
              className={color}
              initial={{ strokeDashoffset: 2 * Math.PI * 28 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 28 * (1 - percentage / 100) }}
              transition={{ duration: 1, delay: 0.2 }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-txt">{Math.round(percentage)}%</span>
          </div>
        </div>

        {/* Status */}
        <div className="text-center">
          {current >= target ? (
            <span className="text-xs text-green-400 font-medium">✓ Meta atingida!</span>
          ) : (
            <span className="text-xs text-txt-3">Restam {remaining}{unit}</span>
          )}
        </div>
      </VoltCard>
    </motion.div>
  );
}

interface MealCardProps {
  name: string;
  time: string;
  calories: number;
  image?: string;
  completed?: boolean;
  onClick: () => void;
  className?: string;
}

export function MealCard({ name, time, calories, image, completed = false, onClick, className }: MealCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={className}
    >
      <VoltCard 
        className={cn(
          "p-4 cursor-pointer relative overflow-hidden transition-all duration-300",
          completed && "bg-green-500/10 border-green-400/30"
        )}
        onClick={onClick}
      >
        {/* Completed Indicator */}
        {completed && (
          <div className="absolute top-2 right-2">
            <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
              <Award className="w-3 h-3 text-white" />
            </div>
          </div>
        )}

        <div className="flex items-center gap-4">
          {/* Meal Image/Icon */}
          <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center flex-shrink-0">
            {image ? (
              <img src={image} alt={name} className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <Utensils className="w-6 h-6 text-accent" />
            )}
          </div>

          {/* Meal Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h4 className={cn("font-semibold text-txt", completed && "line-through text-txt-2")}>
                {name}
              </h4>
              <span className="text-sm text-txt-3">{time}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-txt-2">{calories} kcal</span>
              {completed && (
                <span className="text-xs text-green-400 font-medium">Completo</span>
              )}
            </div>
          </div>
        </div>
      </VoltCard>
    </motion.div>
  );
}