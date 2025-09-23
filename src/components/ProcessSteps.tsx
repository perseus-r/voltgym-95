import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: User,
    title: "Acesso Imediato",
    description: "Cadastre-se em 30 segundos e ganhe 3 dias premium GRÁTIS. Sem cartão, sem pegadinha.",
    details: "Email + senha = acesso total",
    time: "30 seg"
  },
  {
    icon: Target,
    title: "IA Te Analisa", 
    description: "Nossa IA cria seu plano personalizado baseado no seu nível, objetivo e disponibilidade.",
    details: "Análise inteligente + plano customizado",
    time: "Instantâneo"
  },
  {
    icon: Zap,
    title: "Resultados Começam",
    description: "Primeiro treino disponível AGORA. Veja a diferença desde o primeiro dia.",
    details: "Treino otimizado + progressão automática",
    time: "Hoje mesmo"
  }
];

const ProcessSteps = () => {
  return (
    <section id="como-funciona" className="py-20 px-4">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            Como você obtém <span className="volt-text">RESULTADOS RÁPIDOS</span>
            <br />
            <span className="text-2xl lg:text-3xl font-medium text-white/90">sem perder tempo</span>
          </h2>
          <p className="text-xl lg:text-2xl text-white/80 max-w-3xl mx-auto mt-6">
            3 passos simples para começar sua transformação HOJE
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {steps.map((step, index) => (
            <Card key={step.title} className="glass-card p-8 text-center relative">
              {/* Step Number */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-accent rounded-full flex items-center justify-center text-sm font-bold text-white">
                {index + 1}
              </div>
              
              <div className="mb-6">
                <div className="w-16 h-16 bg-primary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                  <step.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                <p className="text-text-2 mb-4 leading-relaxed">{step.description}</p>
                
                <div className="text-sm text-accent font-medium mb-2">
                  {step.details}
                </div>
                <div className="text-xs text-text-2">
                  ⏱️ {step.time}
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Process Preview */}
        <div className="glass-card p-8 rounded-2xl">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Por que <span className="volt-text">12.000+ pessoas</span> escolheram o VOLT?
              </h3>
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-white/90 font-medium">Resultado 47% mais rápido que personal trainer</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse delay-100"></div>
                  <span className="text-white/90 font-medium">Economia de R$ 3.600/ano comparado à academia premium</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-200"></div>
                  <span className="text-white/90 font-medium">Disponível 24/7 - treina quando você quiser</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-300"></div>
                  <span className="text-white/90 font-medium">97% de satisfação comprovada</span>
                </div>
              </div>
              
              <div className="bg-gradient-to-r from-accent/10 to-primary/10 border border-accent/20 rounded-xl p-6 mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">⭐</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-lg mb-2">
                      "Melhor investimento que fiz. Em 2 meses ganhei mais massa muscular que em 1 ano de academia sozinho."
                    </p>
                    <p className="text-accent font-medium">- Rafael M., empresário</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-4">
                  <div className="h-20 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl animate-pulse"></div>
                  <div className="h-16 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl animate-pulse delay-100"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-16 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-xl animate-pulse delay-200"></div>
                  <div className="h-24 bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl animate-pulse delay-300"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-18 bg-gradient-to-br from-accent/20 to-accent/5 rounded-xl animate-pulse delay-100"></div>
                  <div className="h-20 bg-gradient-to-br from-secondary/20 to-secondary/5 rounded-xl animate-pulse delay-400"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <Link to="/auth">
            <Button 
              variant="hero" 
              size="lg"
              className="text-xl px-10 py-5"
              data-track="cta_config"
            >
              🚀 COMEÇAR AGORA - 3 DIAS GRÁTIS
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProcessSteps;