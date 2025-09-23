import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Crown, Settings, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const ProSucessoPage = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleManageSubscription = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;

      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Error opening customer portal:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="glass-card p-8 max-w-md w-full text-center">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-white mb-4">
          Bem-vindo ao VOLT Pro! 🎉
        </h1>

        <p className="text-text-2 mb-6">
          Sua assinatura foi ativada com sucesso. Você tem{" "}
          <span className="text-accent font-bold">3 dias grátis</span> para explorar todos os recursos Pro.
        </p>

        <div className="space-y-3 mb-8 text-left">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-accent" />
            <span className="text-text-2">IA Coach ativada</span>
          </div>
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-accent" />
            <span className="text-text-2">Métricas avançadas desbloqueadas</span>
          </div>
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-accent" />
            <span className="text-text-2">Templates prontos disponíveis</span>
          </div>
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-accent" />
            <span className="text-text-2">Exportação CSV habilitada</span>
          </div>
        </div>

        <div className="space-y-3">
          <Link to="/dashboard" className="block">
            <Button size="lg" className="w-full volt-button">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Ir para o Dashboard
            </Button>
          </Link>

          <Button 
            variant="glass" 
            size="lg" 
            className="w-full"
            onClick={handleManageSubscription}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Carregando...
              </>
            ) : (
              <>
                <Settings className="w-5 h-5 mr-2" />
                Gerenciar assinatura
              </>
            )}
          </Button>
        </div>

        <p className="text-xs text-text-2 mt-6">
          Seu trial termina em 3 dias. Você pode cancelar a qualquer momento sem cobrança.
        </p>
      </Card>
    </div>
  );
};

export default ProSucessoPage;