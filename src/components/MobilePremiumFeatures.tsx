import { useState } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Crown, 
  Sparkles, 
  Zap, 
  Brain, 
  Target, 
  TrendingUp,
  Calendar,
  Users,
  ChevronRight,
  Lock,
  Play,
  Timer,
  BarChart3
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SubscriptionGuard from './SubscriptionGuard';
import PlanGuard from './PlanGuard';

export const MobilePremiumFeatures = () => {
  const { isPro, isPremium, isFree } = useSubscription();
  const isMobile = useIsMobile();
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null);

  const premiumFeatures = [
    {
      id: 'ai-coach',
      title: 'IA Coach Personal',
      description: 'Coaching inteligente 24/7 com análise em tempo real',
      icon: Brain,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      plan: 'pro',
      available: isPro || isPremium
    },
    {
      id: 'advanced-analytics',
      title: 'Analytics Avançados',
      description: 'Métricas detalhadas de performance e evolução',
      icon: BarChart3,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      plan: 'pro',
      available: isPro || isPremium
    },
    {
      id: 'smart-timer',
      title: 'Timer Inteligente',
      description: 'Cronômetros adaptativos com notificações inteligentes',
      icon: Timer,
      color: 'text-orange-400',
      bgColor: 'bg-orange-500/20',
      plan: 'pro',
      available: isPro || isPremium
    },
    {
      id: 'nutrition-ai',
      title: 'Nutricionista IA',
      description: 'Planos alimentares personalizados com IA',
      icon: Sparkles,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      plan: 'premium',
      available: isPremium
    },
    {
      id: 'community-pro',
      title: 'Comunidade Premium',
      description: 'Acesso exclusivo a grupos e challenges',
      icon: Users,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      plan: 'pro',
      available: isPro || isPremium
    },
    {
      id: 'workout-builder',
      title: 'Builder Avançado',
      description: 'Criador de treinos com templates premium',
      icon: Target,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      plan: 'pro',
      available: isPro || isPremium
    }
  ];

  const quickActions = [
    {
      id: 'start-ai-session',
      title: 'Iniciar Sessão IA',
      description: 'Treino guiado por inteligência artificial',
      icon: Play,
      color: 'text-accent',
      action: () => console.log('Start AI session')
    },
    {
      id: 'weekly-plan',
      title: 'Plano Semanal',
      description: 'Gerar cronograma inteligente',
      icon: Calendar,
      color: 'text-blue-400',
      action: () => console.log('Generate weekly plan')
    },
    {
      id: 'performance-report',
      title: 'Relatório Performance',
      description: 'Análise completa dos seus resultados',
      icon: TrendingUp,
      color: 'text-green-400',
      action: () => console.log('Show performance report')
    }
  ];

  if (!isMobile) {
    return null;
  }

  return (
    <Card className="glass-card p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
            <Crown className="w-4 h-4 text-accent-ink" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-txt">Recursos Premium</h3>
            <p className="text-xs text-txt-2">
              {isPremium ? 'Premium Ativo' : isPro ? 'Pro Ativo' : 'Desbloqueie recursos avançados'}
            </p>
          </div>
        </div>
        
        {(isPro || isPremium) && (
          <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
            <Crown className="w-3 h-3 mr-1" />
            {isPremium ? 'Premium' : 'Pro'}
          </Badge>
        )}
      </div>

      {/* Quick Actions - Only for Pro/Premium users */}
      {(isPro || isPremium) && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-txt-2">Ações Rápidas</h4>
          <div className="grid grid-cols-1 gap-2">
            {quickActions.map((action) => (
              <button
                key={action.id}
                onClick={action.action}
                className="flex items-center gap-3 p-3 rounded-xl bg-card/50 hover:bg-card/80 transition-all duration-200 touch-manipulation active:scale-95"
              >
                <div className={`w-8 h-8 rounded-lg bg-card/50 flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-txt">{action.title}</p>
                  <p className="text-xs text-txt-2">{action.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-txt-3" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Premium Features Grid */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-txt-2">Recursos Disponíveis</h4>
        <div className="grid grid-cols-1 gap-2">
          {premiumFeatures.map((feature) => (
            <div
              key={feature.id}
              className={`relative p-3 rounded-xl border transition-all duration-200 ${
                feature.available
                  ? 'bg-card/30 border-border/20 hover:bg-card/50 cursor-pointer'
                  : 'bg-card/10 border-border/10 opacity-70'
              }`}
              onClick={() => feature.available && setSelectedFeature(feature.id)}
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl ${feature.bgColor} flex items-center justify-center relative`}>
                  <feature.icon className={`w-5 h-5 ${feature.color}`} />
                  {!feature.available && (
                    <div className="absolute inset-0 bg-surface/80 rounded-xl flex items-center justify-center">
                      <Lock className="w-3 h-3 text-txt-3" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h5 className="text-sm font-semibold text-txt truncate">{feature.title}</h5>
                    <Badge 
                      variant="outline" 
                      className={`text-xs px-1.5 py-0.5 ${
                        feature.plan === 'premium' 
                          ? 'border-purple-500/30 text-purple-400' 
                          : 'border-accent/30 text-accent'
                      }`}
                    >
                      {feature.plan.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs text-txt-2 line-clamp-1">{feature.description}</p>
                </div>

                {feature.available ? (
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-txt-3" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upgrade CTA for Free users */}
      {isFree && (
        <div className="pt-2 border-t border-border/20">
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <p className="text-sm text-txt-2">Desbloqueie todos os recursos</p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 btn-premium text-xs py-2"
                onClick={() => window.location.href = '/pro'}
              >
                <Crown className="w-3 h-3 mr-1" />
                Upgrade Pro
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 text-xs py-2 border-purple-500/30 text-purple-400 hover:bg-purple-500/10"
                onClick={() => window.location.href = '/premium'}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Premium
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MobilePremiumFeatures;