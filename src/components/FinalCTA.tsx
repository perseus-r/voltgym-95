import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="py-20 px-4">
      <div className="container-custom">
        <div className="glass-card p-6 sm:p-8 lg:p-12 xl:p-16 rounded-2xl text-center max-w-5xl mx-auto relative overflow-hidden">
          {/* Background effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-primary/10 to-secondary/10 rounded-2xl"></div>
          
          <div className="relative z-10">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl xl:text-6xl font-bold text-white mb-6 sm:mb-8">
              Sua transformação começa <span className="volt-text">AGORA</span>
            </h2>
            <p className="text-lg sm:text-xl lg:text-2xl text-white/90 mb-8 sm:mb-10 lg:mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
              Não deixe para amanhã o que pode mudar sua vida hoje. 
              <br />
              <span className="volt-text font-bold">3 dias premium GRÁTIS</span> - sem cartão, sem pegadinha.
            </p>
            
            {/* Urgency indicator */}
            <div className="bg-gradient-to-r from-red-500/20 to-accent/20 border border-red-500/30 rounded-xl p-6 mb-10 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-2">🚨 ÚLTIMAS VAGAS</div>
                <div className="volt-text font-bold text-lg">Apenas 23 vagas restantes para o trial gratuito</div>
                <div className="text-white/80 text-sm mt-2">Esta oferta expira em 24 horas</div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 sm:gap-6 justify-center mb-8 sm:mb-10 max-w-md mx-auto lg:max-w-none lg:flex-row">
              <Link to="/auth" className="w-full sm:w-auto">
                <Button 
                  variant="hero" 
                  size="lg"
                  className="text-xl px-12 py-6 w-full sm:w-auto shadow-2xl hover:shadow-accent/20"
                  data-track="cta_final_primary"
                >
                  🔥 QUERO MEUS 3 DIAS GRÁTIS
                </Button>
              </Link>
              <Link to="/dashboard" className="w-full sm:w-auto">
                <Button 
                  variant="glass" 
                  size="lg"
                  className="text-lg px-8 py-6 w-full sm:w-auto"
                  data-track="cta_final_demo"
                >
                  ⚡ Ver demonstração
                </Button>
              </Link>
            </div>

            <div className="space-y-3 text-white/80">
              <p className="text-lg font-medium">
                ✅ 3 dias premium completamente grátis
              </p>
              <p className="text-lg font-medium">
                ✅ Cancelamento em 1 clique - sem burocracia
              </p>
              <p className="text-lg font-medium">
                ✅ Garantia de 365 dias - risco zero
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;