import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap, Crown } from "lucide-react";

export interface UserLevel {
  id: string;
  name: string;
  icon: typeof Trophy;
  color: string;
  minXP: number;
  maxXP: number;
  benefits: string[];
}

export const USER_LEVELS: UserLevel[] = [
  {
    id: 'iniciante',
    name: 'Recruta',
    icon: Star,
    color: 'hsl(var(--success))',
    minXP: 0,
    maxXP: 100,
    benefits: ['Treinos básicos', 'Dicas de execução', 'Comunidade iniciante']
  },
  {
    id: 'intermediario',
    name: 'Soldado',
    icon: Zap,
    color: 'hsl(var(--accent))',
    minXP: 101,
    maxXP: 500,
    benefits: ['Treinos avançados', 'IA personalizada', 'Shop premium', 'Previews 3D']
  },
  {
    id: 'avancado',
    name: 'Capitão',
    icon: Trophy,
    color: 'hsl(var(--accent-2))',
    minXP: 501,
    maxXP: 1000,
    benefits: ['Treinos elite', 'IA coach avançada', 'Conteúdo exclusivo', 'Mentoria']
  },
  {
    id: 'elite',
    name: 'General',
    icon: Crown,
    color: 'hsl(var(--warning))',
    minXP: 1001,
    maxXP: 9999,
    benefits: ['Acesso total', 'IA personalizada premium', 'Status VIP', 'Conteúdo exclusivo']
  }
];

interface UserLevelSystemProps {
  currentXP: number;
  onLevelChange?: (level: UserLevel) => void;
}

export function UserLevelSystem({ currentXP, onLevelChange }: UserLevelSystemProps) {
  const currentLevel = USER_LEVELS.find(level => 
    currentXP >= level.minXP && currentXP <= level.maxXP
  ) || USER_LEVELS[0];

  const nextLevel = USER_LEVELS.find(level => level.minXP > currentXP);
  const progress = nextLevel 
    ? ((currentXP - currentLevel.minXP) / (nextLevel.minXP - currentLevel.minXP)) * 100
    : 100;

  const Icon = currentLevel.icon;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-4 mb-6">
        <div 
          className="p-4 rounded-full"
          style={{ backgroundColor: currentLevel.color + '20' }}
        >
          <Icon 
            className="w-8 h-8" 
            style={{ color: currentLevel.color }}
          />
        </div>
        <div>
          <h3 className="text-xl font-bold text-txt">{currentLevel.name}</h3>
          <p className="text-sm text-txt-2">{currentXP} XP total</p>
        </div>
      </div>

      {nextLevel && (
        <div className="mb-6">
          <div className="flex justify-between text-sm text-txt-2 mb-2">
            <span>Progresso para {nextLevel.name}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-3" />
          <div className="text-xs text-txt-3 mt-1">
            {nextLevel.minXP - currentXP} XP para próximo nível
          </div>
        </div>
      )}

      <div>
        <h4 className="font-semibold text-txt mb-3">Benefícios Desbloqueados</h4>
        <div className="space-y-2">
          {currentLevel.benefits.map((benefit, index) => (
            <div key={index} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent"></div>
              <span className="text-sm text-txt-2">{benefit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}