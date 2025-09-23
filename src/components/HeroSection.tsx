import { Button } from "@/components/ui/button";
import { ArrowRight, Dumbbell, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import voltPremiumBg from "@/assets/volt-premium-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden electric-bg pt-16">
      {/* Fitness-focused background effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-red-500 to-accent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-accent to-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-gradient-to-br from-primary to-secondary rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10 container-custom px-4 py-12 lg:py-20">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Main Headline with Fitness Focus */}
            <div className="mb-8">
              <div className="text-6xl sm:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-wider mb-6">
                <span className="text-red-500">⚡</span><span className="text-white">VOLT</span>
              </div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-white/95 font-semibold leading-tight mb-4">
                A revolução do treino chegou ao Brasil
                <br />
                <span className="volt-text font-bold">IA que treina como um campeão</span>
              </h1>
              <p className="text-base sm:text-lg text-white/80 max-w-2xl mx-auto lg:mx-0">
                Pare de treinar igual todo mundo. Nossa IA analisa <span className="text-accent font-bold">cada rep, cada série, cada músculo</span> para criar o treino perfeito para SEU CORPO.
              </p>
            </div>
            
            {/* Proof Points - Fitness Focused */}
            <div className="mb-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-gradient-to-br from-red-500/20 to-red-600/20 border border-red-500/30 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl font-bold text-red-400 mb-1">+47%</div>
                  <div className="text-xs sm:text-sm text-white/90">Mais Força</div>
                </div>
                <div className="bg-gradient-to-br from-accent/20 to-accent/30 border border-accent/30 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl font-bold text-accent mb-1">-65%</div>
                  <div className="text-xs sm:text-sm text-white/90">Menos Tempo</div>
                </div>
                <div className="bg-gradient-to-br from-primary/20 to-primary/30 border border-primary/30 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl font-bold text-primary mb-1">100%</div>
                  <div className="text-xs sm:text-sm text-white/90">Científico</div>
                </div>
                <div className="bg-gradient-to-br from-secondary/20 to-secondary/30 border border-secondary/30 rounded-xl p-3 sm:p-4 text-center">
                  <div className="text-lg sm:text-xl font-bold text-secondary mb-1">24/7</div>
                  <div className="text-xs sm:text-sm text-white/90">Seu Coach</div>
                </div>
              </div>
              
              {/* Value Proposition Box */}
              <div className="bg-gradient-to-r from-red-500/20 via-accent/20 to-primary/20 border-2 border-accent/40 rounded-2xl p-4 sm:p-6 backdrop-blur-sm">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="text-white font-bold text-sm sm:text-base">
                      🔥 ÚLTIMO DIA DA PROMOÇÃO
                    </div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="volt-text font-bold text-base sm:text-lg lg:text-xl mb-2">
                    3 DIAS PREMIUM TOTALMENTE GRÁTIS
                  </div>
                  <div className="text-white/90 text-xs sm:text-sm">
                    <span className="line-through text-white/60">R$ 297</span> → <span className="font-bold text-accent">R$ 0</span> • Sem cartão • Cancela quando quiser
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-3 sm:gap-4 justify-center lg:justify-start mb-8 lg:mb-12 max-w-sm mx-auto lg:max-w-none lg:mx-0 lg:flex-row">
              <Link to="/auth" className="w-full lg:w-auto">
                <Button 
                  variant="hero" 
                  size="lg" 
                  className="w-full text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 font-bold shadow-2xl hover:shadow-accent/30 transition-all duration-300"
                  data-track="cta_hero_primary"
                >
                  🚀 COMEÇAR 3 DIAS GRÁTIS
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </Link>
              
              <Link to="/dashboard" className="w-full lg:w-auto">
                <Button 
                  variant="glass" 
                  size="lg" 
                  className="w-full text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 backdrop-blur-sm"
                  data-track="cta_hero_demo"
                >
                  ⚡ Ver demonstração
                </Button>
              </Link>
            </div>
            
            {/* Social Proof - Fitness Focused */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 lg:gap-8 text-center max-w-lg mx-auto lg:mx-0">
              <div className="glass-card p-3 sm:p-4 rounded-xl hover:scale-105 transition-transform">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold volt-text mb-1">18K+</div>
                <div className="text-xs sm:text-sm text-white/90 font-medium">Atletas Ativos</div>
              </div>
              <div className="glass-card p-3 sm:p-4 rounded-xl hover:scale-105 transition-transform">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold volt-text mb-1">4.9⭐</div>
                <div className="text-xs sm:text-sm text-white/90 font-medium">Nota Média</div>
              </div>
              <div className="glass-card p-3 sm:p-4 rounded-xl hover:scale-105 transition-transform">
                <div className="text-xl sm:text-2xl lg:text-3xl font-bold volt-text mb-1">97%</div>
                <div className="text-xs sm:text-sm text-white/90 font-medium">Recomendam</div>
              </div>
            </div>
          </div>
          
          {/* Right Content - Fitness Benefits */}
          <div className="space-y-4 lg:space-y-6 order-1 lg:order-2">
            {/* AI Personal Trainer */}
            <div className="glass-card p-4 sm:p-6 rounded-2xl border border-accent/20 hover:border-accent/40 transition-all duration-300 group">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-3 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Dumbbell className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    🧠 Sua IA Personal Exclusiva
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base font-medium leading-relaxed">
                    Aprende SEU corpo, SEU ritmo e cria treinos que evoluem com você. Como ter um personal campeão 24h.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-green-400 text-xs font-medium">Online agora</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Resultados Científicos */}
            <div className="glass-card p-4 sm:p-6 rounded-2xl border border-primary/20 hover:border-primary/40 transition-all duration-300 group">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-3 bg-gradient-to-br from-primary to-primary/80 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                    📊 Resultados Comprovados
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base font-medium leading-relaxed">
                    +47% mais ganhos de força e massa. Baseado em 18.000+ treinos analisados e estudos científicos.
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs">
                    <span className="bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">Científico</span>
                    <span className="bg-green-500/20 text-green-400 px-2 py-1 rounded-full font-medium">Comprovado</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Comunidade Elite */}
            <div className="glass-card p-4 sm:p-6 rounded-2xl border border-secondary/20 hover:border-secondary/40 transition-all duration-300 group">
              <div className="flex items-start gap-3 sm:gap-4">
                <div className="p-3 bg-gradient-to-br from-secondary to-secondary/80 rounded-xl flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-secondary transition-colors">
                    🏆 Comunidade de Campeões
                  </h3>
                  <p className="text-white/90 text-sm sm:text-base font-medium leading-relaxed">
                    18K+ atletas compartilhando conquistas, dicas e motivação. Sua rede de apoio para nunca desistir.
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="flex -space-x-1">
                      <div className="w-5 h-5 bg-accent rounded-full border border-white"></div>
                      <div className="w-5 h-5 bg-primary rounded-full border border-white"></div>
                      <div className="w-5 h-5 bg-secondary rounded-full border border-white"></div>
                    </div>
                    <span className="text-white/70 text-xs">+247 online agora</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator - hidden on mobile */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden sm:block">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;