import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Crown, Sparkles, Check, AlertCircle, RefreshCw } from 'lucide-react';

const CheckoutTestPanel = () => {
  const { user } = useAuth();
  const subscription = useSubscription();
  const [loadingPro, setLoadingPro] = useState(false);
  const [loadingPremium, setLoadingPremium] = useState(false);

  const handleProCheckout = async () => {
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    setLoadingPro(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Redirecionando para checkout Pro...");
      }
    } catch (error) {
      console.error('Error creating Pro checkout:', error);
      toast.error("Erro ao criar checkout Pro");
    } finally {
      setLoadingPro(false);
    }
  };

  const handlePremiumCheckout = async () => {
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    setLoadingPremium(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-premium-checkout');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
        toast.success("Redirecionando para checkout Premium...");
      }
    } catch (error) {
      console.error('Error creating Premium checkout:', error);
      toast.error("Erro ao criar checkout Premium");
    } finally {
      setLoadingPremium(false);
    }
  };

  const handleManageSubscription = async () => {
    if (!user) {
      toast.error("Você precisa estar logado");
      return;
    }

    try {
      await subscription.openCustomerPortal();
      toast.success("Abrindo portal do cliente...");
    } catch (error) {
      console.error('Error opening customer portal:', error);
      toast.error("Erro ao abrir portal do cliente");
    }
  };

  const handleRefreshSubscription = () => {
    subscription.checkSubscription();
    toast.success("Verificando status da assinatura...");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-400';
      case 'trialing': return 'text-blue-400';
      case 'past_due': return 'text-yellow-400';
      case 'canceled': return 'text-red-400';
      default: return 'text-text-2';
    }
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium': return 'text-purple-400';
      case 'pro': return 'text-accent';
      default: return 'text-text-2';
    }
  };

  return (
    <div className="space-y-6">
      {/* Status Atual */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Status da Assinatura</h3>
          <Button
            onClick={handleRefreshSubscription}
            variant="ghost"
            size="sm"
            disabled={subscription.loading}
          >
            {subscription.loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent"></div>
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-sm text-text-2">Plano</div>
            <div className={`text-lg font-bold ${getPlanColor(subscription.plan_type)}`}>
              {subscription.plan_type.toUpperCase()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-text-2">Status</div>
            <div className={`text-lg font-bold ${getStatusColor(subscription.status)}`}>
              {subscription.status}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-text-2">Assinado</div>
            <div className="text-lg">
              {subscription.subscribed ? (
                <Check className="w-6 h-6 text-green-400 mx-auto" />
              ) : (
                <AlertCircle className="w-6 h-6 text-red-400 mx-auto" />
              )}
            </div>
          </div>
          <div className="text-center">
            <div className="text-sm text-text-2">Trial</div>
            <div className="text-lg">
              {subscription.isTrial ? (
                <Check className="w-6 h-6 text-blue-400 mx-auto" />
              ) : (
                <AlertCircle className="w-6 h-6 text-text-2 mx-auto" />
              )}
            </div>
          </div>
        </div>

        {subscription.trial_end && (
          <div className="mt-4 p-3 bg-blue-500/10 rounded-lg">
            <div className="text-sm text-blue-400">
              Trial termina em: {new Date(subscription.trial_end).toLocaleDateString()}
            </div>
          </div>
        )}

        {subscription.current_period_end && (
          <div className="mt-2 p-3 bg-surface rounded-lg">
            <div className="text-sm text-text-2">
              Próxima cobrança: {new Date(subscription.current_period_end).toLocaleDateString()}
            </div>
          </div>
        )}
      </Card>

      {/* Checkouts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Pro Checkout */}
        <Card className="glass-card p-6 border border-accent/20">
          <div className="text-center mb-4">
            <Crown className="w-8 h-8 text-accent mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">VOLT Pro</h3>
            <p className="text-accent font-bold">R$ 99/mês</p>
            <p className="text-sm text-text-2">3 dias grátis</p>
          </div>

          <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span className="text-text-2">Treinos ilimitados</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span className="text-text-2">IA Coach completa</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-accent" />
              <span className="text-text-2">Métricas avançadas</span>
            </li>
          </ul>

          <Button
            onClick={handleProCheckout}
            disabled={loadingPro || !user || subscription.isPro}
            className="w-full volt-button"
          >
            {loadingPro ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : subscription.isPro ? (
              "Plano Ativo"
            ) : (
              "Testar Checkout Pro"
            )}
          </Button>
        </Card>

        {/* Premium Checkout */}
        <Card className="glass-card p-6 border border-purple-400/20">
          <div className="text-center mb-4">
            <Sparkles className="w-8 h-8 text-purple-400 mx-auto mb-2" />
            <h3 className="text-xl font-bold text-white">VOLT Premium</h3>
            <p className="text-purple-400 font-bold">R$ 149/mês</p>
            <p className="text-sm text-text-2">7 dias grátis</p>
          </div>

          <ul className="space-y-2 mb-6 text-sm">
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400" />
              <span className="text-text-2">Tudo do Pro</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400" />
              <span className="text-text-2">Dashboard nutrição</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400" />
              <span className="text-text-2">IA Nutricionista</span>
            </li>
            <li className="flex items-center gap-2">
              <Check className="w-4 h-4 text-purple-400" />
              <span className="text-text-2">Selo verificado</span>
            </li>
          </ul>

          <Button
            onClick={handlePremiumCheckout}
            disabled={loadingPremium || !user || subscription.isPremium}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white"
          >
            {loadingPremium ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processando...
              </>
            ) : subscription.isPremium ? (
              "Plano Ativo"
            ) : (
              "Testar Checkout Premium"
            )}
          </Button>
        </Card>
      </div>

      {/* Portal do Cliente */}
      {subscription.subscribed && (
        <Card className="glass-card p-6">
          <h3 className="text-lg font-bold text-white mb-4">Gerenciar Assinatura</h3>
          <p className="text-text-2 mb-4">
            Acesse o portal do Stripe para gerenciar sua assinatura, alterar métodos de pagamento e ver histórico.
          </p>
          <Button
            onClick={handleManageSubscription}
            variant="glass"
            className="w-full"
          >
            Abrir Portal do Cliente
          </Button>
        </Card>
      )}

      {!user && (
        <Card className="glass-card p-6 text-center">
          <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
          <p className="text-text-2">
            Você precisa estar logado para testar os checkouts
          </p>
        </Card>
      )}
    </div>
  );
};

export default CheckoutTestPanel;