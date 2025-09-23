import { useState, useEffect } from 'react';
import { Trophy, Star, Flame, Target, Medal, Award } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { AchievementService } from '@/services/AchievementService';
import { useVibration } from '@/hooks/useVibration';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'volume' | 'consistency' | 'milestone' | 'special';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface AchievementSystemProps {
  className?: string;
}

export function AchievementSystem({ className = "" }: AchievementSystemProps) {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const { vibrateSuccess } = useVibration();

  useEffect(() => {
    loadAchievements();
    const interval = setInterval(checkForNewAchievements, 30000); // Check every 30s
    return () => clearInterval(interval);
  }, []);

  const loadAchievements = async () => {
    const data = AchievementService.getAllAchievements();
    setAchievements(data);
  };

  const checkForNewAchievements = async () => {
    const newAchievements = AchievementService.checkForNewAchievements();
    if (newAchievements.length > 0) {
      setNewlyUnlocked(newAchievements);
      vibrateSuccess();
      // Clear notification after 5 seconds
      setTimeout(() => setNewlyUnlocked([]), 5000);
    }
    loadAchievements();
  };

  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'text-txt-2 bg-surface';
      case 'rare': return 'text-accent bg-accent/10';
      case 'epic': return 'text-accent-2 bg-accent-2/10';
      case 'legendary': return 'text-gradient bg-gradient-primary/10';
      default: return 'text-txt-2 bg-surface';
    }
  };

  const getCategoryIcon = (category: Achievement['category']) => {
    switch (category) {
      case 'streak': return Flame;
      case 'volume': return Target;
      case 'consistency': return Medal;
      case 'milestone': return Trophy;
      case 'special': return Award;
      default: return Star;
    }
  };

  const unlockedCount = achievements.filter(a => a.isUnlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = (unlockedCount / totalCount) * 100;

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Progress */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-display font-bold text-gradient">
              Conquistas
            </h2>
            <p className="text-txt-2">
              {unlockedCount} de {totalCount} desbloqueadas
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-accent">
              {Math.round(completionPercentage)}%
            </div>
            <div className="text-sm text-txt-3">Completado</div>
          </div>
        </div>
        <Progress value={completionPercentage} className="h-3 bg-surface" />
      </Card>

      {/* New Achievement Notifications */}
      {newlyUnlocked.length > 0 && (
        <div className="space-y-2">
          {newlyUnlocked.map((achievement) => (
            <Card 
              key={achievement.id} 
              className="glass-card p-4 border-success bg-success/5 animate-slide-up"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-success/20">
                  <Trophy className="w-5 h-5 text-success" />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-success">
                    🎉 Nova Conquista Desbloqueada!
                  </div>
                  <div className="text-sm text-txt-2">
                    {achievement.title}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Achievement Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {achievements.map((achievement) => {
          const IconComponent = getCategoryIcon(achievement.category);
          const isComplete = achievement.progress >= achievement.maxProgress;
          
          return (
            <Card 
              key={achievement.id}
              className={`glass-card p-4 transition-all duration-300 hover:scale-105 ${
                achievement.isUnlocked ? 'border-accent/50' : 'opacity-75'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${
                  achievement.isUnlocked ? 'bg-accent/20' : 'bg-surface'
                }`}>
                  <IconComponent className={`w-5 h-5 ${
                    achievement.isUnlocked ? 'text-accent' : 'text-txt-3'
                  }`} />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className={`font-semibold ${
                      achievement.isUnlocked ? 'text-txt' : 'text-txt-3'
                    }`}>
                      {achievement.title}
                    </h3>
                    <Badge 
                      className={`text-xs ${getRarityColor(achievement.rarity)}`}
                    >
                      {achievement.rarity}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-txt-2">
                    {achievement.description}
                  </p>
                  
                  {!achievement.isUnlocked && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-txt-3">
                        <span>Progresso</span>
                        <span>{achievement.progress}/{achievement.maxProgress}</span>
                      </div>
                      <Progress 
                        value={(achievement.progress / achievement.maxProgress) * 100}
                        className="h-2 bg-surface"
                      />
                    </div>
                  )}
                  
                  {achievement.isUnlocked && achievement.unlockedAt && (
                    <div className="text-xs text-success">
                      ✓ Desbloqueada em {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}