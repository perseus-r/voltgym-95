import React, { useState, useEffect } from 'react';
import { Award, Trophy, Medal, Star, Flame, Target, Zap, Crown, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProgressEngine } from '@/services/ProgressEngine';

export function AchievementsSection() {
  const [currentXP, setCurrentXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    setCurrentXP(ProgressEngine.currentXP());
    setCurrentLevel(ProgressEngine.currentLevel());
    setCurrentStreak(ProgressEngine.currentStreak());
  }, []);

  const achievements = [
    {
      id: 'first_workout',
      title: 'Primeiro Treino',
      description: 'Complete seu primeiro treino no app',
      icon: Star,
      earned: true,
      rarity: 'common',
      xpReward: 50,
      earnedAt: '2024-01-15'
    },
    {
      id: 'consistency_week',
      title: 'Semana Consistente',
      description: 'Treine 4 vezes em uma semana',
      icon: Calendar,
      earned: true,
      rarity: 'uncommon',
      xpReward: 100,
      earnedAt: '2024-02-01'
    },
    {
      id: 'streak_7',
      title: 'Sequência de Fogo',
      description: '7 dias de treino consecutivos',
      icon: Flame,
      earned: currentStreak >= 7,
      rarity: 'rare',
      xpReward: 200,
      progress: Math.min((currentStreak / 7) * 100, 100)
    },
    {
      id: 'level_5',
      title: 'Guerreiro do Ferro',
      description: 'Alcance o nível 5',
      icon: Crown,
      earned: currentLevel >= 5,
      rarity: 'epic',
      xpReward: 300,
      progress: Math.min((currentLevel / 5) * 100, 100)
    },
    {
      id: 'supino_100',
      title: 'Beast Mode',
      description: 'Supino de 100kg ou mais',
      icon: Target,
      earned: false,
      rarity: 'legendary',
      xpReward: 500,
      progress: 85
    },
    {
      id: 'volume_month',
      title: 'Movimentador de Peso',
      description: 'Mova mais de 50 toneladas em um mês',
      icon: Zap,
      earned: true,
      rarity: 'epic',
      xpReward: 400,
      earnedAt: '2024-03-01'
    },
    {
      id: 'streak_30',
      title: 'Imortal do Ferro',
      description: '30 dias de treino consecutivos',
      icon: Trophy,
      earned: false,
      rarity: 'legendary',
      xpReward: 1000,
      progress: Math.min((currentStreak / 30) * 100, 100)
    },
    {
      id: 'dedication',
      title: 'Dedicação Total',
      description: '100 treinos completados',
      icon: Medal,
      earned: false,
      rarity: 'epic',
      xpReward: 600,
      progress: 68
    }
  ];

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-400 bg-gray-400/10';
      case 'uncommon': return 'text-green-400 bg-green-400/10';
      case 'rare': return 'text-blue-400 bg-blue-400/10';
      case 'epic': return 'text-purple-400 bg-purple-400/10';
      case 'legendary': return 'text-yellow-400 bg-yellow-400/10';
      default: return 'text-accent bg-accent/10';
    }
  };

  const getRarityIcon = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '🏆';
      case 'epic': return '💎';
      case 'rare': return '⭐';
      case 'uncommon': return '🥈';
      default: return '🥉';
    }
  };

  const earnedAchievements = achievements.filter(a => a.earned);
  const inProgressAchievements = achievements.filter(a => !a.earned);
  const totalXP = earnedAchievements.reduce((sum, a) => sum + a.xpReward, 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass text-center">
          <CardContent className="p-4">
            <Trophy className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-2xl font-bold text-txt mb-1">{earnedAchievements.length}</div>
            <div className="text-xs text-txt-2">Conquistas</div>
          </CardContent>
        </Card>
        
        <Card className="glass text-center">
          <CardContent className="p-4">
            <Star className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-txt mb-1">{totalXP}</div>
            <div className="text-xs text-txt-2">XP Total</div>
          </CardContent>
        </Card>
        
        <Card className="glass text-center">
          <CardContent className="p-4">
            <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-txt mb-1">{earnedAchievements.filter(a => a.rarity === 'legendary' || a.rarity === 'epic').length}</div>
            <div className="text-xs text-txt-2">Épicas/Lendárias</div>
          </CardContent>
        </Card>
        
        <Card className="glass text-center">
          <CardContent className="p-4">
            <Flame className="w-8 h-8 text-orange-400 mx-auto mb-2" />
            <div className="text-2xl font-bold text-txt mb-1">{Math.round((earnedAchievements.length / achievements.length) * 100)}%</div>
            <div className="text-xs text-txt-2">Completude</div>
          </CardContent>
        </Card>
      </div>

      {/* Earned Achievements */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-txt">
            <Trophy className="w-5 h-5 text-accent" />
            Conquistas Desbloqueadas ({earnedAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {earnedAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-accent/20"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-txt truncate">
                        {achievement.title}
                      </h4>
                      <span className="text-lg">{getRarityIcon(achievement.rarity)}</span>
                    </div>
                    <p className="text-sm text-txt-2 mb-2 line-clamp-2">
                      {achievement.description}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      <Badge className="bg-accent/20 text-accent">
                        +{achievement.xpReward} XP
                      </Badge>
                      {achievement.earnedAt && (
                        <span className="text-xs text-txt-3">
                          {new Date(achievement.earnedAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* In Progress Achievements */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-txt">
            <Target className="w-5 h-5 text-accent" />
            Em Progresso ({inProgressAchievements.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inProgressAchievements.map((achievement) => {
              const Icon = achievement.icon;
              return (
                <div
                  key={achievement.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white/5 border border-line/50"
                >
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-lg bg-surface/50 flex items-center justify-center grayscale">
                      <Icon className="w-6 h-6 text-txt-3" />
                    </div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-txt truncate">
                        {achievement.title}
                      </h4>
                      <span className="text-lg grayscale">{getRarityIcon(achievement.rarity)}</span>
                    </div>
                    <p className="text-sm text-txt-2 mb-3 line-clamp-2">
                      {achievement.description}
                    </p>
                    
                    {achievement.progress !== undefined && (
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-sm">
                          <span className="text-txt-3">Progresso</span>
                          <span className="text-txt">{Math.round(achievement.progress)}%</span>
                        </div>
                        <Progress value={achievement.progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getRarityColor(achievement.rarity)}>
                        {achievement.rarity}
                      </Badge>
                      <Badge variant="outline" className="text-accent">
                        +{achievement.xpReward} XP
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}