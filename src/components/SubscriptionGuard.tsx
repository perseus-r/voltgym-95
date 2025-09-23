import { ReactNode } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SubscriptionGuardProps {
  children: ReactNode;
  feature: string;
  fallback?: ReactNode;
}

const SubscriptionGuard = ({ children, feature, fallback }: SubscriptionGuardProps) => {
  const { isPro, loading } = useSubscription();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  if (isPro) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <Card className="glass-card p-8 text-center">
      <div className="flex items-center justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
          <Lock className="w-8 h-8 text-accent" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-white mb-4">
        {feature} é exclusivo do Pro
      </h3>
      
      <p className="text-text-2 mb-6">
        Desbloqueie este recurso e muito mais com o VOLT Pro. 
        Comece seu trial de 3 dias grátis agora!
      </p>
      
      <Link to="/pro">
        <Button className="volt-button">
          <Crown className="w-5 h-5 mr-2" />
          Começar trial grátis
        </Button>
      </Link>
    </Card>
  );
};

export default SubscriptionGuard;