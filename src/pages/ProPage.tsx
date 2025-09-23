import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Crown, Zap, BarChart3, Download, Clock, CreditCard, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const ProPage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleStartTrial = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para começar o trial");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout-session');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast.error("Erro ao criar sessão de checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Crown className="w-8 h-8 text-accent" />
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              Desbloqueie seu próximo nível
            </h1>
          </div>
          <p className="text-xl text-text-2 mb-8">
            IA + Progresso avançado
          </p>
          <p className="text-lg text-text-2 mb-8">
            Pro por <span className="text-accent font-bold">R$ 99/mês</span> com <span className="text-accent">3 dias grátis</span>. Sem fidelidade.
          </p>
          
          {user ? (
            <Button 
              onClick={handleStartTrial}
              disabled={loading}
              size="lg" 
              className="volt-button text-lg px-8 py-4 mb-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Criando sessão...
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Começar 3 dias grátis
                </>
              )}
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="lg" className="volt-button text-lg px-8 py-4 mb-6">
                <Zap className="w-5 h-5 mr-2" />
                Começar 3 dias grátis
              </Button>
            </Link>
          )}
          
          <p className="text-sm text-text-2">
            <CreditCard className="w-4 h-4 inline mr-1" />
            Cancele quando quiser · Sem multa · Pix e cartão
          </p>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="container-custom max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="glass-card p-6 border border-line/50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Grátis</h3>
                <div className="text-3xl font-bold text-text-2 mb-2">R$ 0</div>
                <div className="text-text-2 text-sm">3 dias trial</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-text-2 text-sm">3 treinos máximo</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-text-2 text-sm">5 consultas IA</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-green-400" />
                  <span className="text-text-2 text-sm">Registro básico</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-text-2 text-sm">Métricas avançadas</span>
                </li>
              </ul>
              
              <Button variant="glass" size="sm" className="w-full" disabled>
                Plano atual
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="glass-card p-6 border-2 border-accent relative overflow-hidden">
              <div className="absolute -top-2 -right-2 bg-accent text-black px-3 py-1 rounded-bl-lg text-xs font-bold">
                POPULAR
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Crown className="w-5 h-5 text-accent" />
                  Pro
                </h3>
                <div className="text-3xl font-bold text-accent mb-2">R$ 99</div>
                <div className="text-text-2 text-sm">/mês</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-text-2 text-sm">Treinos ilimitados</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-text-2 text-sm">IA Coach ilimitada</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-text-2 text-sm">Métricas avançadas</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-accent" />
                  <span className="text-text-2 text-sm">Templates prontos</span>
                </li>
                <li className="flex items-center gap-3">
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-text-2 text-sm">Dashboard nutrição</span>
                </li>
              </ul>
              
              {user ? (
                <Button 
                  onClick={handleStartTrial}
                  disabled={loading}
                  size="sm" 
                  className="w-full volt-button"
                >
                  {loading ? "Processando..." : "Começar trial"}
                </Button>
              ) : (
                <Link to="/auth" className="block">
                  <Button size="sm" className="w-full volt-button">
                    Começar trial
                  </Button>
                </Link>
              )}
            </Card>

            {/* Premium Plan */}
            <Card className="glass-card p-6 border-2 border-purple-400 relative overflow-hidden">
              <div className="absolute -top-2 -right-2 bg-purple-500 text-white px-3 py-1 rounded-bl-lg text-xs font-bold">
                COMPLETO
              </div>
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  Premium
                </h3>
                <div className="text-3xl font-bold text-purple-400 mb-2">R$ 149</div>
                <div className="text-text-2 text-sm">/mês</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm">Tudo do Pro +</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm font-medium">Dashboard nutrição</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm font-medium">IA Nutricionista</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm font-medium">Contador calorias IA</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm font-medium">Selo verificado ✓</span>
                </li>
              </ul>
              
              <Link to="/premium">
                <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Ver Premium
                </Button>
              </Link>
            </Card>
          </div>
        </div>
      </section>

      {/* Pro Features Details */}
      <section className="py-16 px-4 bg-surface/30">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            O que você ganha com o <span className="text-accent">VOLT Pro</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">IA Coach</h3>
              </div>
              <p className="text-text-2">
                IA personalizada que analisa seu progresso e ajusta automaticamente pesos, séries e descanso para otimizar seus resultados.
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">Métricas Avançadas</h3>
              </div>
              <p className="text-text-2">
                Acompanhe PRs, volume total, frequência e progressão com gráficos detalhados dos últimos 90 dias.
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">Templates Prontos</h3>
              </div>
              <p className="text-text-2">
                Acesso a planos de treino profissionais para ganho de massa, força e cutting, criados por especialistas.
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                  <Download className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-white">Exportação & Suporte</h3>
              </div>
              <p className="text-text-2">
                Exporte seus dados em CSV, compartilhe com seu nutricionista e tenha suporte prioritário da nossa equipe.
              </p>
            </Card>
          </div>
          
          <div className="mt-8 p-6 glass-card border border-purple-400/50 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <Sparkles className="w-8 h-8 text-purple-400" />
              <div>
                <h3 className="text-xl font-bold text-white">Quer ainda mais?</h3>
                <p className="text-text-2">Premium inclui nutrição completa + selo verificado</p>
              </div>
            </div>
            <Link to="/premium">
              <Button className="bg-purple-500 hover:bg-purple-600 text-white">
                <Crown className="w-5 h-5 mr-2" />
                Ver Premium
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Legal Footer */}
      <section className="py-8 px-4 border-t border-line/30">
        <div className="container-custom max-w-4xl mx-auto text-center">
          <p className="text-sm text-text-2">
            Ao continuar, você concorda com os{" "}
            <a href="#" className="text-accent hover:underline">Termos</a> e a{" "}
            <a href="#" className="text-accent hover:underline">Política de Privacidade</a>.
          </p>
        </div>
      </section>
    </div>
  );
};

export default ProPage;