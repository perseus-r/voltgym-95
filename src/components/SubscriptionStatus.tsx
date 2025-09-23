import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Settings, AlertTriangle, Clock, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

const SubscriptionStatus = () => {
  const { 
    isPro, 
    isTrial, 
    isPastDue, 
    status, 
    trial_end, 
    current_period_end, 
    grace_period,
    loading, 
    checkSubscription, 
    openCustomerPortal 
  } = useSubscription();

  const handleManageSubscription = async () => {
    try {
      await openCustomerPortal();
    } catch (error) {
      toast.error('Erro ao abrir portal de gerenciamento');
    }
  };

  const handleRefresh = async () => {
    try {
      await checkSubscription();
      toast.success('Status atualizado');
    } catch (error) {
      toast.error('Erro ao verificar status');
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Card className="glass-card p-6">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
          <span className="ml-2 text-text-2">Verificando assinatura...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {isPro ? (
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-accent" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-xl bg-text-2/20 flex items-center justify-center">
              <Crown className="w-5 h-5 text-text-2" />
            </div>
          )}
          <div>
            <h3 className="text-lg font-bold text-white">
              {isPro ? 'VOLT Pro' : 'VOLT Free'}
            </h3>
            <p className="text-sm text-text-2 capitalize">
              {status === 'trialing' && 'Trial ativo'}
              {status === 'active' && 'Assinatura ativa'}
              {status === 'past_due' && 'Pagamento pendente'}
              {status === 'canceled' && 'Cancelado'}
              {status === 'free' && 'Plano gratuito'}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      {/* Trial Info */}
      {isTrial && trial_end && (
        <div className="bg-accent/10 border border-accent/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Trial ativo</span>
          </div>
          <p className="text-sm text-text-2">
            Seu trial termina em {formatDate(trial_end)}
          </p>
        </div>
      )}

      {/* Past Due Warning */}
      {isPastDue && (
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-500">
              Pagamento pendente
            </span>
          </div>
          <p className="text-sm text-text-2">
            {grace_period 
              ? 'Você tem 3 dias para atualizar o pagamento'
              : 'Atualize seu método de pagamento para continuar usando o Pro'
            }
          </p>
        </div>
      )}

      {/* Active Subscription Info */}
      {isPro && current_period_end && (
        <div className="text-sm text-text-2 mb-4">
          Próxima cobrança: {formatDate(current_period_end)}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {isPro ? (
          <Button
            variant="glass"
            size="sm"
            onClick={handleManageSubscription}
            className="flex-1"
          >
            <Settings className="w-4 h-4 mr-2" />
            Gerenciar assinatura
          </Button>
        ) : (
          <Button
            className="volt-button flex-1"
            size="sm"
            onClick={() => window.open('/pro', '_self')}
          >
            <Crown className="w-4 h-4 mr-2" />
            Upgrade para Pro
          </Button>
        )}
      </div>
    </Card>
  );
};

export default SubscriptionStatus;