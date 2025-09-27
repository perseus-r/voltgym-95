import React from 'react';
import { motion } from 'framer-motion';
import { Stagger, Item } from '@/components/animations/Stagger';
import { Check, Star, Zap, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';

const plans = [
  {
    tier: 'Starter',
    price: 'Grátis',
    period: '',
    highlight: 'Comece hoje, sem fricção',
    icon: Zap,
    features: [
      'Treinos guiados essenciais',
      'Cronômetro e descansos automáticos',
      'Histórico básico de treinos',
      'Acesso a exercícios básicos'
    ],
    cta: { label: 'Começar Grátis', href: '/auth' },
    buttonStyle: 'border border-line text-txt hover:bg-surface'
  },
  {
    tier: 'Pro',
    price: 'R$ 29',
    period: '/mês',
    highlight: 'Para evoluir com consistência',
    icon: Star,
    features: [
      'Planos personalizados por objetivo',
      'Recomendações de carga (RPE/1RM)',
      'Integração Apple Health/Google Fit',
      'Análises avançadas de progresso',
      'Suporte prioritário'
    ],
    cta: { label: 'Assinar Pro', href: '/premium' },
    badge: 'Mais Popular',
    buttonStyle: 'bg-gradient-primary text-accent-ink shadow-glow hover:shadow-xl hover:shadow-accent/30'
  },
  {
    tier: 'Elite',
    price: 'R$ 59',
    period: '/mês',
    highlight: 'Performance máxima',
    icon: Crown,
    features: [
      'Periodização e ciclos avançados',
      'Relatórios de progresso e PRs',
      'Programas exclusivos + comunidade',
      'Coach pessoal por IA',
      'Acesso antecipado a novidades'
    ],
    cta: { label: 'Assinar Elite', href: '/pro' },
    buttonStyle: 'bg-gradient-to-r from-accent to-primary text-accent-ink shadow-glow hover:shadow-xl hover:shadow-primary/30'
  },
];

function CheckIcon() {
  return (
    <div className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center">
      <Check className="h-3 w-3 text-accent" />
    </div>
  );
}

export default function SalesPricing() {
  return (
    <section id="pricing" className="py-20 px-6 bg-gradient-to-b from-bg to-surface/20">
      <div className="max-w-7xl mx-auto">
        <Stagger>
          <Item>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-txt mb-4">
                Planos que Impulsionam 
                <span className="block text-accent">Seus Resultados</span>
              </h2>
              <p className="text-lg text-txt/70 max-w-2xl mx-auto">
                Escolha o plano ideal para sua jornada fitness. Upgrade ou downgrade a qualquer momento.
              </p>
            </div>
          </Item>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Item key={plan.tier}>
                <motion.div 
                  className={cn(
                    "relative rounded-3xl border bg-surface/50 backdrop-blur-sm p-8",
                    "hover:border-accent/50 transition-all duration-300",
                    index === 1 && "border-accent/30 shadow-lg shadow-accent/10 scale-105 md:scale-110"
                  )}
                  whileHover={{ 
                    y: -8, 
                    transition: { type: 'spring', stiffness: 300, damping: 25 }
                  }}
                >
                  {plan.badge && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-gradient-primary text-accent-ink px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                        {plan.badge}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "p-3 rounded-2xl",
                      index === 0 && "bg-line/20",
                      index === 1 && "bg-accent/20", 
                      index === 2 && "bg-primary/20"
                    )}>
                      <plan.icon className={cn(
                        "h-6 w-6",
                        index === 0 && "text-txt/70",
                        index === 1 && "text-accent",
                        index === 2 && "text-primary"
                      )} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-txt">{plan.tier}</h3>
                      <p className="text-sm text-txt/60">{plan.highlight}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-bold text-txt">{plan.price}</span>
                      <span className="text-txt/60">{plan.period}</span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckIcon />
                        <span className="text-txt/80 leading-relaxed">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <motion.a
                    href={plan.cta.href}
                    className={cn(
                      "w-full py-4 px-6 rounded-2xl font-semibold text-center",
                      "transition-all duration-300 flex items-center justify-center gap-2",
                      plan.buttonStyle
                    )}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  >
                    {plan.cta.label}
                  </motion.a>
                </motion.div>
              </Item>
            ))}
          </div>

          <Item>
            <div className="text-center mt-12">
              <p className="text-txt/60 mb-4">
                Não tem certeza? Comece com o plano gratuito e faça upgrade quando quiser.
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-txt/50">
                <span>✅ Cancelamento fácil</span>
                <span>✅ Sem taxas ocultas</span>
                <span>✅ Garantia de 30 dias</span>
              </div>
            </div>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}