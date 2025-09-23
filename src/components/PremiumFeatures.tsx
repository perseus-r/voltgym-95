import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Crown, Zap, Shield, Star, TrendingUp, BarChart3, Users, 
  Heart, Brain, Dumbbell, Award, CheckCircle, Lock, Unlock
} from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import VerifiedBadge from "./VerifiedBadge";

interface PremiumFeaturesProps {
  showUpgrade?: boolean;
}

export function PremiumFeatures({ showUpgrade = true }: PremiumFeaturesProps) {
  const { isPremium, isPro } = useSubscription();

  const premiumFeatures = [
    {
      icon: Crown,
      title: "Badge Verificado",
      description: "Destaque-se na comunidade com o selo de usuário premium",
      available: isPremium,
      category: "social"
    },
    {
      icon: Brain,
      title: "IA Coach Avançada",
      description: "Análises detalhadas e recomendações personalizadas",
      available: isPremium,
      category: "ai"
    },
    {
      icon: BarChart3,
      title: "Analytics Profissional",
      description: "Relatórios avançados de performance e progresso",
      available: isPremium,
      category: "analytics"
    },
    {
      icon: Heart,
      title: "Dashboard Nutricional",
      description: "Controle completo de macronutrientes e calorias",
      available: isPremium,
      category: "nutrition"
    },
    {
      icon: Users,
      title: "Comunidade Premium",
      description: "Acesso exclusivo a grupos VIP e conteúdo premium",
      available: isPremium,
      category: "social"
    },
    {
      icon: Dumbbell,
      title: "Treinos Ilimitados",
      description: "Crie quantos treinos personalizados quiser",
      available: isPremium || isPro,
      category: "workouts"
    },
    {
      icon: Award,
      title: "Conquistas Exclusivas",
      description: "Desbloqueie achievements especiais para membros premium",
      available: isPremium,
      category: "gamification"
    },
    {
      icon: Shield,
      title: "Backup na Nuvem",
      description: "Seus dados sempre seguros e sincronizados",
      available: isPremium || isPro,
      category: "security"
    }
  ];

  const categoryColors = {
    social: "text-purple-400",
    ai: "text-blue-400", 
    analytics: "text-green-400",
    nutrition: "text-orange-400",
    workouts: "text-red-400",
    gamification: "text-yellow-400",
    security: "text-indigo-400"
  };

  return (
    <div className="space-y-6">
      {/* Premium Status Header */}
      <div className="liquid-glass p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-gradient-primary">
            <Crown className="w-6 h-6 text-accent-ink" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-txt flex items-center gap-2">
              Funcionalidades Premium
              {isPremium && <VerifiedBadge size="md" />}
            </h2>
            <p className="text-txt-2">
              {isPremium 
                ? "Você tem acesso a todas as funcionalidades premium!" 
                : "Desbloqueie todo o potencial do VOLT Fitness"
              }
            </p>
          </div>
        </div>

        {isPremium && (
          <div className="bg-gradient-primary/20 border border-accent/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="w-5 h-5 text-accent" />
              <span className="font-semibold text-accent">Status Premium Ativo</span>
            </div>
            <p className="text-sm text-txt-2">
              Aproveite todas as funcionalidades exclusivas e o badge verificado!
            </p>
          </div>
        )}
      </div>

      {/* Features Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {premiumFeatures.map((feature, index) => {
          const IconComponent = feature.icon;
          const isAvailable = feature.available;
          
          return (
            <Card key={index} className={`liquid-glass p-6 transition-all duration-300 ${
              isAvailable ? 'border-accent/30' : 'border-line/20'
            }`}>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${
                  isAvailable 
                    ? 'bg-accent/20' 
                    : 'bg-surface/50'
                }`}>
                  <IconComponent className={`w-6 h-6 ${
                    isAvailable 
                      ? categoryColors[feature.category] 
                      : 'text-txt-3'
                  }`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className={`font-semibold ${
                      isAvailable ? 'text-txt' : 'text-txt-2'
                    }`}>
                      {feature.title}
                    </h3>
                    {isAvailable ? (
                      <CheckCircle className="w-4 h-4 text-accent flex-shrink-0" />
                    ) : (
                      <Lock className="w-4 h-4 text-txt-3 flex-shrink-0" />
                    )}
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    isAvailable ? 'text-txt-2' : 'text-txt-3'
                  }`}>
                    {feature.description}
                  </p>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${
                      isAvailable
                        ? 'border-accent/30 text-accent'
                        : 'border-txt-3/30 text-txt-3'
                    }`}
                  >
                    {feature.category}
                  </Badge>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Upgrade CTA */}
      {showUpgrade && !isPremium && (
        <div className="liquid-glass p-8 text-center">
          <div className="mb-6">
            <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-txt mb-2">
              Desbloqueie o Poder Premium
            </h3>
            <p className="text-txt-2 max-w-md mx-auto">
              Acesse todas as funcionalidades exclusivas, badge verificado e muito mais por apenas R$ 149/mês
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="btn-premium text-lg px-8 py-3">
              <Crown className="w-5 h-5 mr-2" />
              Assinar Premium
            </Button>
            <Button variant="outline" className="liquid-glass-button text-lg px-8 py-3">
              Ver Planos
            </Button>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-txt-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>7 dias grátis</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Cancele quando quiser</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Suporte VIP</span>
            </div>
          </div>
        </div>
      )}

      {/* Feature Categories */}
      <div className="liquid-glass p-6">
        <h3 className="text-lg font-semibold text-txt mb-4">Categorias Premium</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(categoryColors).map(([category, color], index) => {
            const categoryFeatures = premiumFeatures.filter(f => f.category === category);
            const availableCount = categoryFeatures.filter(f => f.available).length;
            
            return (
              <div key={index} className="text-center">
                <div className="w-12 h-12 rounded-full bg-surface/50 flex items-center justify-center mx-auto mb-2">
                  <div className={`w-6 h-6 rounded-full ${color.replace('text-', 'bg-')}`} />
                </div>
                <div className="font-medium text-txt capitalize mb-1">
                  {category === 'ai' ? 'IA' : category}
                </div>
                <div className="text-xs text-txt-3">
                  {availableCount}/{categoryFeatures.length} ativas
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}