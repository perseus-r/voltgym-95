import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, PlayCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ModernHero: React.FC = () => {
  return (
    <section className="min-h-screen w-full flex items-center justify-center relative overflow-hidden pt-20">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 rounded-full opacity-10 animate-pulse bg-gradient-to-r from-accent/20 to-primary/20"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 rounded-full opacity-10 animate-pulse delay-1000 bg-gradient-to-r from-primary/20 to-accent/20"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-5 bg-gradient-to-r from-accent/10 to-primary/10"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 w-full">
        <div className="text-center w-full space-y-8">
          <Badge className="px-6 py-2 bg-accent/20 text-accent border border-accent/30 backdrop-blur-sm text-sm">
            ⚡ Tecnologia de IA Revolucionária
          </Badge>
          
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold leading-tight">
              <span className="text-foreground block mb-2">
                Transformação Corporal
              </span>
              <span className="text-foreground block mb-2">
                com
              </span>
              <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent block">
                Inteligência Artificial
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl max-w-5xl mx-auto leading-relaxed text-muted-foreground">
              O primeiro sistema de fitness que combina <span className="font-semibold text-accent">Inteligência Artificial</span> com 
              <span className="font-semibold text-green-400"> metodologia científica</span> para criar protocolos únicos que se adaptam 
              continuamente ao seu progresso, garantindo resultados em <span className="font-semibold text-primary">tempo recorde</span>.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
            <Link to="/auth" className="w-full sm:w-auto">
              <Button className="bg-gradient-to-r from-accent to-primary text-white text-xl px-12 py-6 rounded-2xl font-bold shadow-2xl hover:shadow-accent/25 transition-all duration-300 hover:scale-105 w-full">
                <Zap className="w-6 h-6 mr-3" />
                Começar Transformação Gratuita
              </Button>
            </Link>
            <Button className="text-xl px-12 py-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl font-semibold hover:bg-white/20 transition-all duration-300 w-full sm:w-auto text-foreground">
              <PlayCircle className="w-6 h-6 mr-3" />
              Ver Demonstração
            </Button>
          </div>
          
          {/* Enhanced Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 pt-16 max-w-6xl mx-auto">
            {[
              { number: "27.000+", label: "Transformações Realizadas", color: "text-accent" },
              { number: "98.9%", label: "Taxa de Satisfação", color: "text-green-400" },
              { number: "2.8 meses", label: "Tempo Médio de Resultado", color: "text-primary" },
              { number: "24/7", label: "Suporte IA Disponível", color: "text-orange-400" }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className={`text-4xl lg:text-5xl font-bold mb-3 ${stat.color}`}>
                  {stat.number}
                </div>
                <div className="text-base lg:text-lg text-muted-foreground font-medium leading-tight">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};