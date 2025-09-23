import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, Target, BarChart3, Calendar, Zap, Shield } from "lucide-react";
import dashboardPreview from "@/assets/dashboard-preview.jpg";

const features = [
  {
    icon: Brain,
    title: "⚡ IA Energizada",
    description: "Algoritmo de alta voltagem que aprende com seus treinos e carrega automaticamente sua rotina para resultados máximos.",
    color: "accent"
  },
  {
    icon: Target,
    title: "⚡ Objetivos Elétricos",
    description: "Metas inteligentes com feedback em tempo real que mantêm sua energia focada nos resultados.",
    color: "accent"
  },
  {
    icon: BarChart3,
    title: "⚡ Analytics de Voltagem",
    description: "Visualize sua energia em gráficos detalhados, tendências e insights para amplificar resultados.",
    color: "accent"
  },
  {
    icon: Calendar,
    title: "⚡ Rotina Flexível",
    description: "Treinos que se adaptam à sua energia diária. Não conseguiu treinar? A IA recarrega automaticamente.",
    color: "accent"
  },
  {
    icon: Zap,
    title: "⚡ Progressão Automática",
    description: "Sistema inteligente que aumenta cargas, voltagem e complexidade conforme sua energia evolui.",
    color: "accent"
  },
  {
    icon: Shield,
    title: "⚡ Proteção Energética",
    description: "Monitora sinais de sobrecarga e ajusta treinos para prevenir lesões e garantir recarga adequada.",
    color: "accent"
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-surface via-card to-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="volt-text">⚡ Sistema de Alta Performance</span>
          </h2>
          <p className="text-xl text-txt-2 max-w-3xl mx-auto">
            Cada funcionalidade foi desenvolvida para otimizar completamente 
            sua performance fitness, oferecendo resultados superiores aos personal trainers tradicionais.
          </p>
        </div>
        
        {/* Main Feature with Image */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <h3 className="text-3xl font-bold mb-6 volt-text">
              ⚡ Dashboard que Amplifica Você
            </h3>
            <p className="text-lg text-text-2 mb-8">
              Visualize toda sua energia de treino em um painel elétrico. 
              Acompanhe voltagem, veja tendências energéticas e receba insights carregados 
              para amplificar cada sessão de treino.
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-text">⚡ Métricas de força e resistência em tempo real</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-text">⚡ Análise de padrões de energia e desempenho</span>
              </div>
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-accent" />
                <span className="text-text">⚡ Recomendações de recarga automáticos</span>
              </div>
            </div>
            
            <Button variant="default" size="lg" className="volt-glow">
              ⚡ Explorar Dashboard
            </Button>
          </div>
          
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-card">
              <img 
                src={dashboardPreview} 
                alt="Dashboard Preview" 
                className="w-full h-auto"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center volt-glow animate-pulse">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center animate-float volt-glow">
              <Zap className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="card-premium hover:volt-glow transition-all duration-300 group">
              <div className="p-8">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-xl font-semibold mb-4 text-text group-hover:volt-text transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-text-2 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
        
        {/* CTA */}
        <div className="text-center mt-16">
          <Button variant="hero" size="lg" className="text-lg px-12 py-4 volt-glow">
            ⚡ Carregue Sua Transformação
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;