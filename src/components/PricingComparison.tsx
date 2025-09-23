import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

const PricingComparison = () => {
  return (
    <section id="planos" className="py-20 px-4 bg-gradient-to-br from-surface to-background">
      <div className="container-custom">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
            Personal Trainer vs <span className="volt-text">VOLT</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 max-w-4xl mx-auto font-medium px-4">
            A comparação que vai <span className="volt-text font-bold">abrir seus olhos</span> para a revolução fitness
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-white/70">
            <span>📊 Baseado em +18.000 treinos analisados</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 lg:gap-12 max-w-6xl mx-auto">
          {/* Personal Trainer - Enhanced negative positioning */}
          <Card className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-red-500/15 to-red-600/15 border-2 border-red-500/40 relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-red-500/20 text-red-400 px-3 py-1 rounded-full text-xs font-bold border border-red-500/30">
              ULTRAPASSADO
            </div>
            <div className="text-center mb-6 sm:mb-8">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">Personal Trainer Tradicional</h3>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-red-400 mb-2">R$ 4.800</div>
              <div className="text-white/80 text-base sm:text-lg">por mês (4x/semana)</div>
              <div className="text-red-400 text-sm mt-2 font-semibold">+ R$ 57.600/ano 💸</div>
            </div>
            
            <div className="space-y-3 sm:space-y-4 text-white/80">
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">Horários rígidos (só funciona para eles)</span>
              </div>
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">Custo astronômico: R$ 300+ por hora</span>
              </div>
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">Dependência total (faltou = perdeu)</span>
              </div>
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">Zero suporte fora do horário</span>
              </div>
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">Treino baseado no "achismo"</span>
              </div>
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">Resultados inconsistentes</span>
              </div>
              <div className="flex items-center gap-3">
                <X className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span className="text-sm sm:text-base">Sem dados científicos</span>
              </div>
            </div>
            
            {/* Negative social proof */}
            <div className="mt-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="text-center text-red-400 text-sm font-medium">
                😔 "Gastei uma fortuna e não vi resultado"
              </div>
              <div className="text-center text-red-400/70 text-xs mt-1">
                - Relato comum de ex-clientes
              </div>
            </div>
          </Card>

          {/* VOLT - Enhanced with fitness identity */}
          <Card className="p-6 sm:p-8 lg:p-10 bg-gradient-to-br from-accent/25 to-primary/25 border-2 border-accent relative overflow-hidden shadow-2xl hover:scale-[1.02] transition-transform duration-300">
            <div className="absolute -top-3 sm:-top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-accent via-primary to-secondary text-white px-4 sm:px-6 lg:px-8 py-2 sm:py-3 rounded-full text-sm sm:text-base lg:text-lg font-bold shadow-lg border border-white/20">
              🏆 REVOLUÇÃO FITNESS
            </div>
            
            <div className="text-center mb-6 sm:mb-8 pt-4 sm:pt-6">
              <h3 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">VOLT Fitness AI</h3>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold volt-text">R$ 99</span>
                <div className="text-xs sm:text-sm bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">
                  -98% vs Personal
                </div>
              </div>
              <div className="text-white/90 text-base sm:text-lg">por mês completo</div>
              <div className="text-accent font-bold text-lg sm:text-xl mt-2">💰 ECONOMIA: R$ 4.701/mês</div>
              
              {/* Value indicators */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div className="bg-accent/20 rounded-lg p-2">
                  <div className="text-accent font-bold text-sm">24/7</div>
                  <div className="text-white/70 text-xs">Disponível</div>
                </div>
                <div className="bg-primary/20 rounded-lg p-2">
                  <div className="text-primary font-bold text-sm">+47%</div>
                  <div className="text-white/70 text-xs">Resultados</div>
                </div>
                <div className="bg-secondary/20 rounded-lg p-2">
                  <div className="text-secondary font-bold text-sm">18K+</div>
                  <div className="text-white/70 text-xs">Atletas</div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3 sm:space-y-4 text-white/90 mb-6">
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">IA Personal 24/7 exclusiva para você</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">Treina quando, onde e como VOCÊ quer</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">100% baseado em ciência e dados reais</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">Resultados 47% mais rápidos comprovados</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">Comunidade de 18K+ atletas motivados</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">Suporte especializado ilimitado</span>
              </div>
              <div className="flex items-center gap-3">
                <Check className="w-5 h-5 text-accent flex-shrink-0" />
                <span className="text-sm sm:text-base font-medium">Garantia de 365 dias (risco zero)</span>
              </div>
            </div>
            
            {/* Positive social proof */}
            <div className="mb-6 p-3 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="text-center text-accent text-sm font-medium">
                ⭐ "Melhor investimento que já fiz na minha saúde"
              </div>
              <div className="text-center text-accent/70 text-xs mt-1">
                - Carlos, ganhou 15kg de massa em 5 meses
              </div>
            </div>
            
            <Link to="/auth" className="block mt-10">
              <Button 
                variant="hero" 
                size="lg" 
                className="w-full text-xl py-6 shadow-2xl hover:shadow-accent/20"
                data-track="cta_pricing"
              >
                🔥 QUERO 3 DIAS GRÁTIS
              </Button>
            </Link>
            
            <div className="text-center mt-4 text-accent font-medium">
              ✅ Sem cartão · ✅ Cancela quando quiser
            </div>
          </Card>
        </div>

        {/* Social Proof */}
        <div className="text-center mt-20">
          <div className="glass-card p-8 rounded-2xl max-w-4xl mx-auto">
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-6">
              Junte-se a <span className="volt-text">12.000+</span> pessoas que já transformaram suas vidas
            </h3>
            <div className="flex items-center justify-center gap-2 mb-6">
              {[...Array(5)].map((_, i) => (
                <span key={i} className="text-yellow-400 text-2xl">⭐</span>
              ))}
              <span className="text-white font-bold text-xl ml-3">4.9/5 · +3.200 avaliações</span>
            </div>
            <p className="text-white/80 text-lg">
              "A melhor decisão que tomei para minha saúde e forma física"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PricingComparison;