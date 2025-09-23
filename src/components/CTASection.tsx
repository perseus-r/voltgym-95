import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, Star, Clock, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-secondary text-white electric-bg">
      <div className="container mx-auto px-4">
        {/* Main CTA */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-6xl font-bold mb-6">
            ⚡ Pronto para o Sistema Premium?
          </h2>
          <p className="text-xl text-white/90 max-w-4xl mx-auto mb-12">
            Personal trainers custam R$ 200-500 por sessão sem garantias. 
            O VOLT custa menos que uma sessão mensal e entrega resultados científicos.
          </p>
        </div>
        
        {/* Comparison Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {/* Personal Trainer */}
          <Card className="p-8 bg-white/5 border-white/10">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">Personal Trainer</h3>
              <div className="text-4xl font-bold text-red-400">R$ 2.000+</div>
              <div className="text-white/70">por mês</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-red-400" />
                <span className="text-white/90">Horários limitados e inflexíveis</span>
              </div>
              <div className="flex items-center gap-3">
                <DollarSign className="w-5 h-5 text-red-400" />
                <span className="text-white/90">Custo alto sem garantia de resultados</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-red-400" />
                <span className="text-white/90">Planos genéricos e pouco personalizados</span>
              </div>
            </div>
          </Card>
          
          {/* Our App */}
          <Card className="p-8 bg-gradient-card border-none relative overflow-hidden">
            <div className="absolute top-4 right-4 bg-white text-cyan-500 px-3 py-1 rounded-full text-sm font-semibold">
              Melhor Escolha
            </div>
            
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                <span className="text-red-500">⚡</span> VOLT
              </h3>
              <div className="text-4xl font-bold text-white">R$ 49</div>
              <div className="text-white/90">por mês</div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="text-white">✓</span>
                <span className="text-white">Disponível 24/7, treinos quando quiser</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white">✓</span>
                <span className="text-white">97% mais barato que personal trainer</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-white">✓</span>
                <span className="text-white">IA que aprende e evolui com você</span>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Social Proof */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center gap-2 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
            ))}
            <span className="text-white/90 ml-2">4.9/5 (2.847 avaliações)</span>
          </div>
          <p className="text-white/80">
            Mais de 10.000 pessoas já energizaram seus treinos com VOLT
          </p>
        </div>
        
        {/* Final CTA */}
        <div className="text-center">
          <Link to="/auth">
            <Button variant="hero" size="lg" className="text-xl px-16 py-6 mb-4 animate-electric-pulse">
              ⚡ Começar Premium Grátis
              <ArrowRight className="ml-2" />
            </Button>
          </Link>
          <p className="text-white/70">
            ⚡ 5 dias premium grátis • ⚡ Cancele quando quiser • ⚡ Resultados garantidos
          </p>
        </div>
      </div>
    </section>
  );
};

export default CTASection;