import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, BarChart3, Zap, TrendingUp, Users } from "lucide-react";
import { Link } from "react-router-dom";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const features = [
  {
    icon: Brain,
    title: "IA Energizada",
    description: "Algoritmos avançados que personalizam cada treino com precisão científica",
    color: "accent"
  },
  {
    icon: Target,
    title: "Objetivos Elétricos", 
    description: "Sistema inteligente que adapta metas baseado na sua evolução real",
    color: "primary"
  },
  {
    icon: BarChart3,
    title: "Analytics de Voltagem",
    description: "Métricas avançadas que mostram exatamente onde você está ganhando energia",
    color: "secondary"
  },
  {
    icon: Zap,
    title: "Série Inteligente",
    description: "Progressões automáticas que maximizam seus ganhos sem overtraining",
    color: "accent"
  },
  {
    icon: TrendingUp,
    title: "Progresso Automático",
    description: "Acompanhe sua evolução com gráficos dinâmicos e insights personalizados",
    color: "primary"
  },
  {
    icon: Users,
    title: "Proteção Energética",
    description: "Sistema de prevenção de lesões com ajustes inteligentes de carga",
    color: "secondary"
  }
];

const HighPerformanceSystem = () => {
  return (
    <section id="sistema" className="py-20 px-4 bg-gradient-to-br from-surface to-background">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white mb-4 sm:mb-6">
            Por que o VOLT é <span className="volt-text">DIFERENTE?</span>
          </h2>
          <p className="text-lg sm:text-xl lg:text-2xl text-white/90 font-semibold max-w-4xl mx-auto leading-relaxed px-4">
            Não é mais um app de treino. É uma <span className="volt-text">revolução tecnológica</span> que garante seus resultados.
          </p>
        </div>

        {/* Dashboard Highlight */}
        <div className="mb-16 sm:mb-20">
          <div className="glass-card p-6 sm:p-8 rounded-2xl">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 text-center lg:text-left">
                  O primeiro <span className="volt-text">Personal Trainer IA</span> do Brasil
                </h3>
                <p className="text-white/90 mb-6 sm:mb-8 text-base sm:text-lg lg:text-xl leading-relaxed font-medium text-center lg:text-left">
                  Não é só um app com exercícios. É uma IA que <span className="volt-text font-bold">PENSA</span> como um personal trainer experiente e adapta cada treino para você alcançar resultados máximos.
                </p>
                
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-6 sm:mb-8 max-w-md mx-auto lg:max-w-none lg:mx-0">
                  <div className="glass-card p-2 sm:p-4 text-center rounded-xl">
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold volt-text mb-1">+47%</div>
                    <div className="text-xs sm:text-sm text-white/90 font-medium">Mais Resultados</div>
                  </div>
                  <div className="glass-card p-2 sm:p-4 text-center rounded-xl">
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold volt-text mb-1">-65%</div>
                    <div className="text-xs sm:text-sm text-white/90 font-medium">Menos Tempo</div>
                  </div>
                  <div className="glass-card p-2 sm:p-4 text-center rounded-xl">
                    <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold volt-text mb-1">R$ 0</div>
                    <div className="text-xs sm:text-sm text-white/90 font-medium">Por 3 Dias</div>
                  </div>
                </div>
                
                <div className="text-center lg:text-left">
                  <Link to="/dashboard">
                    <Button 
                      variant="hero" 
                      size="lg"
                      className="w-full sm:w-auto max-w-xs"
                      data-track="cta_dashboard"
                    >
                      ⚡ Explorar Dashboard
                    </Button>
                  </Link>
                </div>
              </div>
              
              <div className="relative">
                <img 
                  src={dashboardPreview} 
                  alt="VOLT Dashboard Preview"
                  className="rounded-xl shadow-2xl"
                  loading="lazy"
                />
                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-accent rounded-xl animate-float flex items-center justify-center">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-primary rounded-lg animate-pulse flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              className="glass-card p-6 hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 bg-${feature.color} rounded-xl`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-text-2 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/auth">
            <Button 
              variant="hero" 
              size="lg"
              className="text-lg px-8 py-4"
              data-track="cta_features"
            >
              ⚡ Explorar o Sistema
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HighPerformanceSystem;