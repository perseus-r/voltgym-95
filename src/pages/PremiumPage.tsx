import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, Crown, Sparkles, Apple, Calculator, ChefHat, Brain, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const PremiumPage = () => {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleStartPremium = async () => {
    if (!user) {
      toast.error("Você precisa estar logado para começar o Premium");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-premium-checkout');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error creating premium checkout:', error);
      toast.error("Erro ao criar sessão de checkout Premium");
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
            <Sparkles className="w-8 h-8 text-purple-400" />
            <h1 className="text-5xl lg:text-6xl font-bold text-white">
              VOLT Premium
            </h1>
          </div>
          <p className="text-xl text-text-2 mb-8">
            Treino + Nutrição + IA Completa
          </p>
            <p className="text-lg text-text-2 mb-8">
              Premium por <span className="text-purple-400 font-bold">R$ 148/mês</span> com <span className="text-purple-400">3 dias grátis</span>
            </p>
          
          {user ? (
            <Button 
              onClick={handleStartPremium}
              disabled={loading}
              size="lg" 
              className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-4 mb-6"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Criando sessão...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Começar 3 dias grátis
                </>
              )}
            </Button>
          ) : (
            <Link to="/auth">
              <Button size="lg" className="bg-purple-500 hover:bg-purple-600 text-white text-lg px-8 py-4 mb-6">
                <Sparkles className="w-5 h-5 mr-2" />
                Começar 3 dias grátis
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-16 px-4">
        <div className="container-custom max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Free Plan */}
            <Card className="glass-card p-6 border border-line/50">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Grátis</h3>
                <div className="text-3xl font-bold text-text-2 mb-2">R$ 0</div>
                <div className="text-text-2 text-sm">3 dias</div>
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
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-text-2 text-sm">Histórico limitado</span>
                </li>
              </ul>
              
              <Button variant="glass" size="sm" className="w-full" disabled>
                Atual
              </Button>
            </Card>

            {/* Pro Plan */}
            <Card className="glass-card p-6 border border-accent/50">
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
                  <X className="w-4 h-4 text-red-400" />
                  <span className="text-text-2 text-sm">Dashboard nutrição</span>
                </li>
              </ul>
              
              <Link to="/pro">
                <Button size="sm" className="w-full volt-button">
                  Escolher Pro
                </Button>
              </Link>
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
                <div className="text-3xl font-bold text-purple-400 mb-2">R$ 148</div>
                <div className="text-text-2 text-sm">/mês</div>
              </div>
              
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm">Tudo do Pro +</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm font-medium">Dashboard nutrição completo</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm font-medium">IA Nutricionista</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm font-medium">Contador de calorias IA</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="w-4 h-4 text-purple-400" />
                  <span className="text-text-2 text-sm font-medium">Selo verificado ✓</span>
                </li>
              </ul>
              
              {user ? (
                <Button 
                  onClick={() => window.open('https://pay.kiwify.com.br/premium-mensal-148', '_blank')}
                  disabled={loading}
                  size="sm" 
                  className="w-full bg-purple-500 hover:bg-purple-600 text-white"
                >
                  Assinar Premium - R$ 148/mês
                </Button>
              ) : (
                <Link to="/auth">
                  <Button size="sm" className="w-full bg-purple-500 hover:bg-purple-600 text-white">
                    Começar 3 dias grátis
                  </Button>
                </Link>
              )}
            </Card>
          </div>
        </div>
      </section>

      {/* Premium Features */}
      <section className="py-16 px-4 bg-surface/30">
        <div className="container-custom max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Recursos <span className="text-purple-400">Premium</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Apple className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Dashboard Nutrição</h3>
              </div>
              <p className="text-text-2">
                Planeje suas refeições, acompanhe macros e monitore sua alimentação com interface completa.
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Brain className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">IA Nutricionista</h3>
              </div>
              <p className="text-text-2">
                IA especializada que cria dietas personalizadas baseadas no seu perfil e objetivos.
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Calculator className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Contador IA</h3>
              </div>
              <p className="text-text-2">
                Fotografe ou descreva sua refeição e a IA calcula automaticamente calorias e macros.
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <ChefHat className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Receitas IA</h3>
              </div>
              <p className="text-text-2">
                Receitas personalizadas baseadas nos seus macros e preferências alimentares.
              </p>
            </Card>

            <Card className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Selo Verificado</h3>
              </div>
              <p className="text-text-2">
                Destaque-se na comunidade com o selo de verificado exclusivo para membros Premium.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default PremiumPage;