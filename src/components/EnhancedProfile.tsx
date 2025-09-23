import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { UserLevelSystem, USER_LEVELS } from "./UserLevelSystem";
import { Trophy, Star, Zap, Crown, User, Settings, Award, TrendingUp } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import VerifiedBadge from "./VerifiedBadge";
import { UserProfile } from "./UserProfile";

interface EnhancedProfileProps {
  currentXP: number;
  userName?: string;
  achievements?: number;
  totalWorkouts?: number;
  streak?: number;
}

export function EnhancedProfile({ 
  currentXP, 
  userName = "Atleta BORA",
  achievements = 12,
  totalWorkouts = 45,
  streak = 7
}: EnhancedProfileProps) {
  const { isPremium } = useSubscription();
  const currentLevel = USER_LEVELS.find(level => 
    currentXP >= level.minXP && currentXP <= level.maxXP
  ) || USER_LEVELS[0];

  const stats = [
    { label: "Total de Treinos", value: totalWorkouts, icon: TrendingUp },
    { label: "Conquistas", value: achievements, icon: Award },
    { label: "Sequência Atual", value: `${streak} dias`, icon: Star },
    { label: "Nível Atual", value: currentLevel.name, icon: currentLevel.icon }
  ];

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="glass-card p-8">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-accent/20 flex items-center justify-center">
            <User className="w-10 h-10 text-accent" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-txt mb-2 flex items-center gap-2">
              {userName}
              {isPremium && <VerifiedBadge size="lg" />}
            </h2>
            <div className="flex items-center gap-3">
              <Badge 
                variant="secondary" 
                className="bg-accent/20 text-accent border-accent/30"
              >
                {currentLevel.name}
              </Badge>
              <span className="text-txt-2">{currentXP} XP total</span>
            </div>
          </div>
          <div className="flex gap-2">
            <UserProfile />
            <Button variant="outline" className="glass-button">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="glass-card p-4 text-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-accent/20 mx-auto mb-2">
                  <IconComponent className="w-5 h-5 text-accent" />
                </div>
                <div className="text-lg font-bold text-txt">{stat.value}</div>
                <div className="text-xs text-txt-3">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Level System */}
      <UserLevelSystem currentXP={currentXP} />

      {/* Recent Achievements */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-txt mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-warning" />
          Conquistas Recentes
        </h3>
        
        <div className="space-y-3">
          {[
            { title: "Primeira Semana Completa", desc: "7 dias consecutivos de treino", xp: 50 },
            { title: "Força Bruta", desc: "Aumentou 10kg no supino", xp: 30 },
            { title: "Consistência", desc: "30 treinos completos", xp: 100 }
          ].map((achievement, index) => (
            <div key={index} className="flex items-center gap-4 p-3 rounded-lg bg-surface/50 border border-line/30">
              <div className="w-10 h-10 rounded-full bg-warning/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-warning" />
              </div>
              <div className="flex-1">
                <h4 className="font-medium text-txt">{achievement.title}</h4>
                <p className="text-sm text-txt-2">{achievement.desc}</p>
              </div>
              <Badge variant="outline" className="text-accent border-accent/30">
                +{achievement.xp} XP
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Actions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-txt mb-4">Ações do Perfil</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button className="btn-premium justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-semibold">Compartilhar Perfil</div>
              <div className="text-sm opacity-80">Mostre seus progressos</div>
            </div>
          </Button>
          
          <Button variant="outline" className="glass-button justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-semibold text-txt">Histórico Completo</div>
              <div className="text-sm text-txt-2">Ver todos os treinos</div>
            </div>
          </Button>
          
          <Button variant="outline" className="glass-button justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-semibold text-txt">Exportar Dados</div>
              <div className="text-sm text-txt-2">Baixar relatório detalhado</div>
            </div>
          </Button>
          
          <Button variant="outline" className="glass-button justify-start h-auto p-4">
            <div className="text-left">
              <div className="font-semibold text-txt">Conectar Apps</div>
              <div className="text-sm text-txt-2">Sincronizar com outros apps</div>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}