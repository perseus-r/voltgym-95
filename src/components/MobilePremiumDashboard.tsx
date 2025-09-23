import { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Crown, 
  Sparkles, 
  Zap, 
  TrendingUp, 
  Target, 
  Calendar,
  Timer,
  Brain,
  BarChart3,
  Trophy,
  Flame,
  ChevronRight,
  Play,
  Users,
  Lock
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileLayout, MobileGrid, MobileStack } from './MobileLayout';
import SubscriptionGuard from './SubscriptionGuard';
import PlanGuard from './PlanGuard';

interface MobilePremiumDashboardProps {
  userXP: number;
  onStartWorkout: () => void;
  hasActiveWorkout: boolean;
}

export const MobilePremiumDashboard = ({ userXP, onStartWorkout, hasActiveWorkout }: MobilePremiumDashboardProps) => {
  const { isPro, isPremium, isFree, hasReachedWorkoutLimit, hasReachedAILimit } = useSubscription();
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [weeklyProgress, setWeeklyProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [totalWorkouts, setTotalWorkouts] = useState(0);

  useEffect(() => {
    if (user?.id) {
      // Calcular progresso semanal
      const history = JSON.parse(localStorage.getItem('bora_hist_v1') || '[]');
      const thisWeek = history.filter((entry: any) => {
        const entryDate = new Date(entry.ts);
        const weekStart = new Date();
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        return entryDate >= weekStart;
      });
      
      setWeeklyProgress((thisWeek.length / 4) * 100);
      setStreak(Math.min(thisWeek.length, 7));
      setTotalWorkouts(history.length);
    }
  }, [user]);

  if (!isMobile) {
    return null;
  }

  const premiumStats = [
    {
      id: 'weekly-goal',
      title: 'Meta Semanal',
      value: `${Math.round(weeklyProgress)}%`,
      subValue: `${Math.floor(weeklyProgress / 25)} de 4 treinos`,
      icon: Target,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      progress: weeklyProgress,
      isPremium: false
    },
    {
      id: 'streak',
      title: 'Sequência',
      value: `${streak} dias`,
      subValue: 'Mantenha o ritmo!',
      icon: Flame,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      isPremium: false
    },
    {
      id: 'ai-insights',
      title: 'IA Insights',
      value: hasReachedAILimit ? 'Limite' : 'Ativo',
      subValue: hasReachedAILimit ? 'Upgrade para mais' : 'Análises disponíveis',
      icon: Brain,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      isPremium: true
    },
    {
      id: 'performance',
      title: 'Performance',
      value: `${Math.min(100, userXP / 10)}%`,
      subValue: `${userXP} XP total`,
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      isPremium: true
    }
  ];

  const quickFeatures = [
    {
      id: 'ai-workout',
      title: 'Treino com IA',
      description: 'Sessão personalizada com coaching inteligente',
      icon: Brain,
      color: 'text-blue-400',
      available: isPro || isPremium,
      requiredPlan: 'pro' as const,
      action: () => console.log('Start AI workout')
    },
    {
      id: 'smart-timer',
      title: 'Timer Inteligente',
      description: 'Cronômetro adaptativo com notificações',
      icon: Timer,
      color: 'text-orange-400',
      available: isPro || isPremium,
      requiredPlan: 'pro' as const,
      action: () => console.log('Open smart timer')
    },
    {
      id: 'nutrition-plan',
      title: 'Plano Nutricional',
      description: 'IA nutricionista personalizada',
      icon: Sparkles,
      color: 'text-purple-400',
      available: isPremium,
      requiredPlan: 'premium' as const,
      action: () => console.log('Open nutrition')
    },
    {
      id: 'community-pro',
      title: 'Comunidade Pro',
      description: 'Acesso a grupos exclusivos',
      icon: Users,
      color: 'text-indigo-400',
      available: isPro || isPremium,
      requiredPlan: 'pro' as const,
      action: () => console.log('Open community')
    }
  ];

  return (
    <MobileLayout className="space-y-4">
      {/* Premium Status Header */}
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isPremium ? 'bg-purple-500/20' : isPro ? 'bg-accent/20' : 'bg-surface/20'
            }`}>
              {isPremium ? (
                <Sparkles className="w-4 h-4 text-purple-400" />
              ) : isPro ? (
                <Crown className="w-4 h-4 text-accent" />
              ) : (
                <Lock className="w-4 h-4 text-txt-3" />
              )}
            </div>
            <div>
              <h2 className="text-lg font-bold text-txt">
                {isPremium ? 'VOLT Premium' : isPro ? 'VOLT Pro' : 'VOLT Free'}
              </h2>
              <p className="text-xs text-txt-2">
                {isPremium ? 'Recursos completos ativados' : isPro ? 'Recursos Pro ativos' : 'Upgrade para mais recursos'}
              </p>
            </div>
          </div>
          
          {(isPro || isPremium) && (
            <Badge variant="secondary" className={`${
              isPremium ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-accent/20 text-accent border-accent/30'
            }`}>
              {isPremium ? 'Premium' : 'Pro'}
            </Badge>
          )}
        </div>

        {/* Quick Start Button */}
        <Button 
          onClick={onStartWorkout}
          className={`w-full mb-3 ${hasActiveWorkout ? 'btn-premium' : 'volt-button'}`}
          disabled={hasReachedWorkoutLimit && isFree}
        >
          <Play className="w-4 h-4 mr-2" />
          {hasActiveWorkout ? 'Continuar Treino' : 'Começar Treino'}
          {hasReachedWorkoutLimit && isFree && (
            <Lock className="w-3 h-3 ml-2" />
          )}
        </Button>

        {/* Usage Limits for Free Users */}
        {isFree && (
          <div className="space-y-2 p-3 bg-card/30 rounded-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="text-txt-2">Treinos restantes</span>
              <span className="text-txt">{hasReachedWorkoutLimit ? '0/3' : '2/3'}</span>
            </div>
            <Progress value={hasReachedWorkoutLimit ? 0 : 66} className="h-1.5" />
            <p className="text-xs text-txt-3">Upgrade para treinos ilimitados</p>
          </div>
        )}
      </Card>

      {/* Premium Stats Grid */}
      <MobileGrid>
        {premiumStats.map((stat) => (
          <Card key={stat.id} className="glass-card p-3">
            {stat.isPremium && !isPro && !isPremium ? (
              <PlanGuard feature={stat.title} requiredPlan="pro">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-txt">{stat.title}</h4>
                    <p className="text-xs text-txt-2">{stat.subValue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-txt">{stat.value}</p>
                  {stat.progress !== undefined && (
                    <Progress value={stat.progress} className="h-1.5 mt-1" />
                  )}
                </div>
              </PlanGuard>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <stat.icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold text-txt">{stat.title}</h4>
                    <p className="text-xs text-txt-2">{stat.subValue}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-txt">{stat.value}</p>
                  {stat.progress !== undefined && (
                    <Progress value={stat.progress} className="h-1.5 mt-1" />
                  )}
                </div>
              </>
            )}
          </Card>
        ))}
      </MobileGrid>

      {/* Quick Features */}
      <Card className="glass-card p-4">
        <h3 className="text-sm font-semibold text-txt-2 mb-3">Recursos Rápidos</h3>
        <div className="space-y-2">
          {quickFeatures.map((feature) => (
            feature.available ? (
              <button
                key={feature.id}
                onClick={feature.action}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-card/30 hover:bg-card/50 transition-all duration-200 touch-manipulation active:scale-95"
              >
                <div className={`w-8 h-8 rounded-lg bg-card/50 flex items-center justify-center ${feature.color}`}>
                  <feature.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-txt">{feature.title}</p>
                  <p className="text-xs text-txt-2">{feature.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-txt-3" />
              </button>
            ) : (
              <PlanGuard 
                key={feature.id}
                feature={feature.title} 
                requiredPlan={feature.requiredPlan}
                fallback={
                  <div className="w-full flex items-center gap-3 p-3 rounded-xl bg-card/10 border border-border/10 opacity-70">
                    <div className={`w-8 h-8 rounded-lg bg-card/30 flex items-center justify-center relative`}>
                      <feature.icon className={`w-4 h-4 ${feature.color}`} />
                      <div className="absolute inset-0 bg-surface/80 rounded-lg flex items-center justify-center">
                        <Lock className="w-3 h-3 text-txt-3" />
                      </div>
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium text-txt">{feature.title}</p>
                      <p className="text-xs text-txt-2">{feature.description}</p>
                    </div>
                    <Badge variant="outline" className="text-xs px-1.5 py-0.5 border-accent/30 text-accent">
                      {feature.requiredPlan.toUpperCase()}
                    </Badge>
                  </div>
                }
              >
                <button
                  onClick={feature.action}
                  className="w-full flex items-center gap-3 p-3 rounded-xl bg-card/30 hover:bg-card/50 transition-all duration-200 touch-manipulation active:scale-95"
                >
                  <div className={`w-8 h-8 rounded-lg bg-card/50 flex items-center justify-center ${feature.color}`}>
                    <feature.icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-txt">{feature.title}</p>
                    <p className="text-xs text-txt-2">{feature.description}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-txt-3" />
                </button>
              </PlanGuard>
            )
          ))}
        </div>
      </Card>

      {/* Upgrade CTA for Free Users */}
      {isFree && (
        <Card className="glass-card p-4 bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/20">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center">
              <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center">
                <Zap className="w-6 h-6 text-accent-ink" />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-txt">Desbloqueie Seu Potencial</h3>
              <p className="text-sm text-txt-2">
                Acesse treinos ilimitados, IA personal e recursos premium
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="flex-1 btn-premium"
                onClick={() => window.location.href = '/pro'}
              >
                <Crown className="w-4 h-4 mr-2" />
                Começar Pro
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                onClick={() => window.location.href = '/premium'}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Premium
              </Button>
            </div>
            
            <p className="text-xs text-txt-3">
              ⚡ 3 dias grátis • Cancele quando quiser
            </p>
          </div>
        </Card>
      )}
    </MobileLayout>
  );
};

export default MobilePremiumDashboard;