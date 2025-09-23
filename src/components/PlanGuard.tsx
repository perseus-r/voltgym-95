import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PlanGuardProps {
  children: ReactNode;
  feature: string;
  requiredPlan: 'pro' | 'premium';
  fallback?: ReactNode;
}

const PlanGuard = ({ children, feature, requiredPlan, fallback }: PlanGuardProps) => {
  const { isPro, isPremium, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const hasAccess = requiredPlan === 'pro' ? (isPro || isPremium) : isPremium;

  if (hasAccess) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  const isPremiumFeature = requiredPlan === 'premium';

  return (
    <Card className="glass-card p-8 text-center">
      <div className="flex items-center justify-center mb-6">
        <div className={`w-16 h-16 rounded-full ${isPremiumFeature ? 'bg-purple-500/20' : 'bg-accent/20'} flex items-center justify-center`}>
          {isPremiumFeature ? (
            <Sparkles className="w-8 h-8 text-purple-400" />
          ) : (
            <Lock className="w-8 h-8 text-accent" />
          )}
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4">
        {feature} é exclusivo do {isPremiumFeature ? 'Premium' : 'Pro'}
      </h3>
      
      <p className="text-text-2 mb-6">
        {isPremiumFeature ? (
          <>
            Desbloqueie recursos de nutrição e IA avançada com o VOLT Premium. 
            Funcionalidades completas de alimentação!
          </>
        ) : (
          <>
            Desbloqueie este recurso e muito mais com o VOLT Pro. 
            Comece seu trial de 3 dias grátis agora!
          </>
        )}
      </p>
      
      <Link to={isPremiumFeature ? "/premium" : "/pro"}>
        <Button className={isPremiumFeature ? 'bg-purple-500 hover:bg-purple-600 text-white' : 'volt-button'}>
          {isPremiumFeature ? (
            <Sparkles className="w-5 h-5 mr-2" />
          ) : (
            <Crown className="w-5 h-5 mr-2" />
          )}
          {isPremiumFeature ? 'Upgrade para Premium' : 'Começar trial grátis'}
        </Button>
      </Link>
    </Card>
  );
};

export default PlanGuard;