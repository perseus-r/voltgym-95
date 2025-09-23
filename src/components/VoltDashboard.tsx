import React from 'react';
import { motion } from 'framer-motion';
import { Play, TrendingUp, Trophy, Target, Calendar, Clock, Zap } from 'lucide-react';
import { VoltCard, VoltCardPremium } from './VoltCard';
import { VoltButton } from './VoltButton';
import { VoltStats } from './VoltStats';
import { cn } from '@/lib/utils';

interface WorkoutCardProps {
  title: string;
  duration: string;
  exercises: number;
  onStart: () => void;
  className?: string;
}

function WorkoutCard({ title, duration, exercises, onStart, className }: WorkoutCardProps) {
  return (
    <VoltCardPremium className={cn("p-6 text-center relative overflow-hidden", className)}>
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/30 rounded-full"
            animate={{
              x: [0, Math.random() * 300],
              y: [0, Math.random() * 200],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center mx-auto mb-4"
        >
          <Zap className="w-8 h-8 text-accent" />
        </motion.div>

        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold text-white mb-2"
        >
          {title}
        </motion.h3>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex items-center justify-center gap-6 mb-6 text-txt-2"
        >
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Target className="w-4 h-4" />
            <span>{exercises} exercícios</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <VoltButton
            variant="primary"
            size="lg"
            onClick={onStart}
            className="relative overflow-hidden group"
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full"
              transition={{ duration: 0.6 }}
            />
            <Play className="w-5 h-5 mr-2" />
            <span>Iniciar Treino</span>
          </VoltButton>
        </motion.div>
      </div>
    </VoltCardPremium>
  );
}

interface StatCard {
  title: string;
  value: string;
  change?: string;
  icon: React.ReactNode;
  color: string;
}

function HorizontalStatCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.5 }}
          className="min-w-[200px] snap-start"
        >
          <VoltCard className="p-6 relative overflow-hidden group" hover>
            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center mb-4", stat.color)}>
              {stat.icon}
            </div>
            
            <div className="mb-2">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              {stat.change && (
                <div className="text-sm text-accent">{stat.change}</div>
              )}
            </div>
            
            <div className="text-txt-3 text-sm">{stat.title}</div>
          </VoltCard>
        </motion.div>
      ))}
    </div>
  );
}

export function VoltDashboard() {
  const mainStats = [
    {
      label: "Treinos Completos",
      value: 42,
      change: "+12%",
      trend: "up" as const,
      icon: <Trophy className="w-6 h-6" />,
      color: "bg-accent/10 text-accent"
    },
    {
      label: "Streak Atual",
      value: "7 dias",
      change: "Recorde!",
      trend: "up" as const,
      icon: <Zap className="w-6 h-6" />,
      color: "bg-warning/10 text-warning"
    },
    {
      label: "Meta Semanal",
      value: "4/4",
      change: "100%",
      trend: "up" as const,
      icon: <Target className="w-6 h-6" />,
      color: "bg-accent/10 text-accent"
    }
  ];

  const horizontalStats = [
    {
      title: "Consistência Semanal",
      value: "87%",
      change: "+8% vs última semana",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-accent/10 text-accent"
    },
    {
      title: "Evolução",
      value: "18 treinos",
      change: "Este mês",
      icon: <Calendar className="w-6 h-6" />,
      color: "bg-purple-500/10 text-purple-400"
    },
    {
      title: "Record Pessoal",
      value: "120kg",
      change: "Supino reto",
      icon: <Trophy className="w-6 h-6" />,
      color: "bg-warning/10 text-warning"
    }
  ];

  return (
    <div className="space-y-8 pt-20 pb-24">
      {/* Hero Section - Treino do dia */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <WorkoutCard
          title="Peito & Tríceps"
          duration="45min"
          exercises={8}
          onStart={() => console.log("Iniciar treino")}
        />
      </motion.section>

      {/* Stats principais */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        <VoltStats stats={mainStats} columns={3} />
      </motion.section>

      {/* Cards horizontais */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h2 className="text-xl font-bold text-white mb-4 px-2">Progresso</h2>
        <HorizontalStatCards stats={horizontalStats} />
      </motion.section>

      {/* Feed dinâmico */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="space-y-4"
      >
        <h2 className="text-xl font-bold text-white mb-4 px-2">Atividade Recente</h2>
        
        <div className="space-y-3">
          {[
            { text: "💪 Completou treino de Peito & Tríceps", time: "2h atrás" },
            { text: "🎯 Novo record pessoal: Supino 120kg!", time: "1 dia atrás" },
            { text: "🔥 7 dias de streak consecutivo", time: "2 dias atrás" }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + index * 0.1, duration: 0.4 }}
            >
              <VoltCard className="p-4" hover>
                <div className="flex justify-between items-center">
                  <span className="text-white">{item.text}</span>
                  <span className="text-txt-3 text-sm">{item.time}</span>
                </div>
              </VoltCard>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </div>
  );
}