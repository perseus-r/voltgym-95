import React from 'react';
import { motion } from 'framer-motion';
import { Zap, TrendingUp, Target } from 'lucide-react';
import { VoltCard } from './VoltCard';
import { VoltButton } from './VoltButton';
import { cn } from '@/lib/utils';

interface VoltHeroProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  stats?: {
    label: string;
    value: string;
    icon: React.ReactNode;
    color?: string;
  }[];
  className?: string;
}

export function VoltHero({ 
  title, 
  subtitle, 
  action, 
  stats,
  className 
}: VoltHeroProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={cn("relative overflow-hidden", className)}
    >
      {/* Background gradient with animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-accent/10" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-orange-500/10"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      <VoltCard className="relative p-8 text-center border-accent/20">
        {/* Electric icon */}
        <motion.div
          className="inline-flex items-center gap-2 mb-4"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <Zap className="w-8 h-8 text-accent" />
            <motion.div
              className="absolute inset-0 w-8 h-8 text-accent opacity-50"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Zap className="w-8 h-8" />
            </motion.div>
          </div>
          <span className="text-accent font-bold text-lg tracking-wider">VOLT</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        {subtitle && (
          <motion.p
            className="text-lg md:text-xl text-txt-2 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {subtitle}
          </motion.p>
        )}

        {/* Action button */}
        {action && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
            className="mb-8"
          >
            <VoltButton
              variant="primary"
              size="lg"
              onClick={action.onClick}
              className="relative overflow-hidden"
            >
              <span className="relative z-10">{action.label}</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ 
                  duration: 1.5, 
                  repeat: Infinity, 
                  repeatDelay: 3,
                  ease: "easeInOut"
                }}
              />
            </VoltButton>
          </motion.div>
        )}

        {/* Stats */}
        {stats && (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center gap-2"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className={cn(
                  "p-3 rounded-xl",
                  stat.color || "bg-accent/10 text-accent"
                )}>
                  {stat.icon}
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-txt-3">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </VoltCard>
    </motion.div>
  );
}

// Preset hero components
export function VoltHeroDashboard({ className }: { className?: string }) {
  return (
    <VoltHero
      title="Bem-vindo ao Volt Gym"
      subtitle="Energia, performance e resultados em um só lugar"
      action={{
        label: "Iniciar Treino ⚡",
        onClick: () => console.log("Iniciar treino")
      }}
      stats={[
        { 
          label: "Treinos", 
          value: "24", 
          icon: <TrendingUp className="w-5 h-5" />,
          color: "bg-accent/10 text-accent"
        },
        { 
          label: "Streak", 
          value: "7 dias", 
          icon: <Zap className="w-5 h-5" />,
          color: "bg-orange-500/10 text-orange-500"
        },
        { 
          label: "Meta", 
          value: "85%", 
          icon: <Target className="w-5 h-5" />,
          color: "bg-accent/10 text-accent"
        }
      ]}
      className={className}
    />
  );
}