import React from 'react';
import { Stagger, Item } from '@/components/animations/Stagger';
import { Brain, BarChart3, Timer, Users, Smartphone, Trophy } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Brain,
    title: 'IA Coach Pessoal',
    description: 'Treinos adaptativos que evoluem com você, ajustando intensidade e volume automaticamente.',
    color: 'accent'
  },
  {
    icon: BarChart3,
    title: 'Analytics Avançado',
    description: 'Métricas detalhadas de progresso, força e resistência para otimizar seus resultados.',
    color: 'primary'
  },
  {
    icon: Timer,
    title: 'Descanso Inteligente',
    description: 'Intervalos adaptativos baseados no seu ritmo cardíaco e intensidade do exercício.',
    color: 'accent'
  },
  {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Conecte-se com outros atletas, compartilhe conquistas e participe de desafios.',
    color: 'primary'
  },
  {
    icon: Smartphone,
    title: 'Sincronização Total',
    description: 'Integração perfeita com Apple Health, Google Fit e principais wearables.',
    color: 'accent'
  },
  {
    icon: Trophy,
    title: 'Sistema de Conquistas',
    description: 'Gamificação inteligente que mantém você motivado e engajado nos treinos.',
    color: 'primary'
  }
];

export default function SalesFeatures() {
  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <Stagger>
          <Item>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-txt mb-4">
                Por Que Escolher 
                <span className="block bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                  Volt Fitness?
                </span>
              </h2>
              <p className="text-lg text-txt/70 max-w-2xl mx-auto">
                Tecnologia de ponta que transforma como você treina e acompanha seu progresso.
              </p>
            </div>
          </Item>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Item key={feature.title}>
                <motion.div
                  className={cn(
                    "group relative h-full p-8 rounded-3xl",
                    "bg-surface/50 backdrop-blur-sm border border-line/50",
                    "hover:border-accent/50 transition-all duration-300"
                  )}
                  whileHover={{ 
                    y: -4,
                    transition: { type: 'spring', stiffness: 300, damping: 25 }
                  }}
                >
                  {/* Background gradient on hover */}
                  <div className={cn(
                    "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300",
                    feature.color === 'accent' ? "bg-gradient-to-br from-accent/5 to-accent/10" : "bg-gradient-to-br from-primary/5 to-primary/10"
                  )} />

                  <div className="relative z-10">
                    <div className={cn(
                      "inline-flex p-4 rounded-2xl mb-6",
                      feature.color === 'accent' ? "bg-accent/20" : "bg-primary/20"
                    )}>
                      <feature.icon className={cn(
                        "h-8 w-8",
                        feature.color === 'accent' ? "text-accent" : "text-primary"
                      )} />
                    </div>

                    <h3 className="text-xl font-bold text-txt mb-3">
                      {feature.title}
                    </h3>

                    <p className="text-txt/70 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </Item>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}