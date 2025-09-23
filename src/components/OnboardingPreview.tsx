import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, User, Target, Calendar } from "lucide-react";

const steps = [
  {
    icon: User,
    title: "⚡ Perfil Energético",
    description: "Configure sua base de energia pessoal",
    details: ["⚡ Nível de energia atual", "⚡ Histórico de atividades", "⚡ Tempo de carga disponível"]
  },
  {
    icon: Target,
    title: "⚡ Objetivos de Voltagem",
    description: "Defina seu potencial máximo",
    details: ["⚡ Ganho de energia", "⚡ Perda de peso", "⚡ Força elétrica"]
  },
  {
    icon: Calendar,
    title: "⚡ Rotina Energizada",
    description: "Receba seu plano de alta voltagem",
    details: ["⚡ Treinos carregados", "⚡ Horários flexíveis", "⚡ Progressão automática"]
  }
];

const OnboardingPreview = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-background via-surface to-card">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            <span className="volt-text">⚡ Configure Seu Sistema</span>
          </h2>
          <p className="text-xl text-txt-2 max-w-3xl mx-auto">
            Em poucos minutos, nossa IA premium analisa completamente seu perfil e cria 
            um plano de alta performance que evolui com você.
          </p>
        </div>
        
        {/* Steps */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card className="card-premium hover:volt-glow transition-all duration-300 group">
                <div className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                    <step.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-semibold mb-4 text-text group-hover:volt-text transition-colors">
                    {step.title}
                  </h3>
                  
                  <p className="text-text-2 mb-6">
                    {step.description}
                  </p>
                  
                  <div className="space-y-3">
                    {step.details.map((detail, detailIndex) => (
                      <div key={detailIndex} className="flex items-center justify-center gap-2">
                        <Zap className="w-4 h-4 text-accent" />
                        <span className="text-sm text-text-2">{detail}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <ArrowRight className="w-8 h-8 text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Process Preview */}
        <Card className="card-premium p-8 bg-gradient-primary text-white volt-glow">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                ⚡ Processo Rápido e Energizado
              </h3>
              <p className="text-white/90 text-lg mb-8">
                Nossa IA analisa centenas de variáveis energéticas para criar o plano perfeito. 
                O que levaria semanas com um personal trainer, energizamos em minutos.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center volt-glow">
                    <span className="text-accent-ink text-sm font-bold">3</span>
                  </div>
                  <span>⚡ Minutos para análise energética completa</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center volt-glow">
                    <span className="text-accent-ink text-sm font-bold">7</span>
                  </div>
                  <span>⚡ Dias para primeiro recarregamento automático</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center volt-glow">
                    <span className="text-accent-ink text-sm font-bold">∞</span>
                  </div>
                  <span>⚡ Adaptações contínuas baseadas em voltagem</span>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="inline-block p-8 bg-white/10 rounded-2xl backdrop-blur-sm volt-glow">
                <Zap className="w-20 h-20 text-accent mx-auto mb-4" />
                <p className="text-white/90 text-lg">
                  "Em 5 minutos tinha um plano mais energizado que 
                  qualquer personal que já contratei"
                </p>
                <p className="text-white/70 mt-2">- Marina, energizada há 6 meses</p>
              </div>
            </div>
          </div>
        </Card>
        
        {/* CTA */}
        <div className="text-center mt-12">
          <Button variant="hero" size="lg" className="text-lg px-12 py-4 volt-glow">
            ⚡ Começar Configuração
            <ArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default OnboardingPreview;