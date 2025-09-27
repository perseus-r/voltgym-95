import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Stagger, Item } from '@/components/animations/Stagger';
import { Check, Star, Zap, Crown, Sparkles, ArrowRight } from 'lucide-react';
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
      'Acesso a exercícios básicos',
      'Comunidade ativa'
    ],
    cta: { label: 'Começar Grátis', href: '/auth' },
    buttonStyle: 'border-2 border-line text-txt hover:border-accent hover:text-accent hover:bg-accent/5',
    popular: false
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
      'Suporte prioritário',
      'Coach IA avançado'
    ],
    cta: { label: 'Assinar Pro', href: '/premium' },
    badge: 'Mais Popular',
    buttonStyle: 'bg-gradient-primary text-accent-ink shadow-glow hover:shadow-xl hover:shadow-accent/30',
    popular: true
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
      'Programas exclusivos + comunidade VIP',
      'Coach pessoal por IA dedicado',
      'Acesso antecipado a novidades',
      'Consultoria nutricional',
      'Análise biomecânica'
    ],
    cta: { label: 'Assinar Elite', href: '/pro' },
    buttonStyle: 'bg-gradient-to-r from-accent to-primary text-accent-ink shadow-glow hover:shadow-xl hover:shadow-primary/30',
    popular: false
  },
];

function CheckIcon() {
  return (
    <motion.div 
      className="flex-shrink-0 w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center"
      whileHover={{ scale: 1.1, backgroundColor: "rgba(123, 220, 255, 0.3)" }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      <Check className="h-3 w-3 text-accent" />
    </motion.div>
  );
}

export default function SalesPricing() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  return (
    <section id="pricing" className="py-24 px-6 relative overflow-hidden">
      {/* Animated background */}
      <motion.div 
        className="absolute inset-0 opacity-40"
        style={{ y, opacity }}
      >
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
        
        {/* Floating particles */}
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-accent/40 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            animate={{
              x: [null, Math.random() * window.innerWidth],
              y: [null, Math.random() * window.innerHeight],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          />
        ))}
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Stagger>
          <Item>
            <div className="text-center mb-20">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(46, 204, 113, 0.15)" }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">Planos Premium</span>
              </motion.div>
              
              <motion.h2 
                className="text-5xl md:text-6xl font-bold text-txt mb-6"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Planos que Impulsionam 
                <motion.span 
                  className="block text-accent mt-2"
                  animate={{ 
                    textShadow: [
                      "0 0 20px rgba(123, 220, 255, 0.5)",
                      "0 0 40px rgba(123, 220, 255, 0.3)",
                      "0 0 20px rgba(123, 220, 255, 0.5)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                >
                  Seus Resultados
                </motion.span>
              </motion.h2>
              
              <motion.p 
                className="text-xl text-txt/70 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Escolha o plano ideal para sua jornada fitness. 
                <span className="text-accent font-semibold">Upgrade ou downgrade a qualquer momento.</span>
                <br />
                <span className="text-primary">Garantia de 30 dias ou seu dinheiro de volta.</span>
              </motion.p>
            </div>
          </Item>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Item key={plan.tier}>
                <motion.div 
                  className={cn(
                    "relative rounded-3xl border bg-surface/50 backdrop-blur-sm p-8 h-full",
                    "hover:border-accent/50 transition-all duration-500",
                    plan.popular && "border-accent/30 shadow-lg shadow-accent/10 scale-105 md:scale-110"
                  )}
                  whileHover={{ 
                    y: -12, 
                    scale: plan.popular ? 1.02 : 1.05,
                    boxShadow: plan.popular 
                      ? "0 25px 50px rgba(123, 220, 255, 0.2)"
                      : "0 20px 40px rgba(255, 255, 255, 0.1)",
                    transition: { type: 'spring', stiffness: 300, damping: 25 }
                  }}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                >
                  {/* Popular badge */}
                  {plan.badge && (
                    <motion.div 
                      className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10"
                      initial={{ scale: 0, rotate: -10 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 400, 
                        damping: 25, 
                        delay: 0.5 + index * 0.2 
                      }}
                    >
                      <div className="bg-gradient-primary text-accent-ink px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                        {plan.badge}
                      </div>
                    </motion.div>
                  )}

                  {/* Background glow for popular plan */}
                  {plan.popular && (
                    <motion.div
                      className="absolute inset-0 rounded-3xl bg-gradient-to-br from-accent/5 to-primary/5 opacity-0"
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}

                  <div className="relative z-10">
                    {/* Plan header */}
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div 
                        className={cn(
                          "p-3 rounded-2xl",
                          index === 0 && "bg-line/20",
                          index === 1 && "bg-accent/20", 
                          index === 2 && "bg-primary/20"
                        )}
                        whileHover={{ 
                          scale: 1.1,
                          rotate: [0, -5, 5, 0]
                        }}
                        transition={{ 
                          scale: { type: "spring", stiffness: 400, damping: 25 },
                          rotate: { duration: 0.5, ease: "easeInOut" }
                        }}
                      >
                        <plan.icon className={cn(
                          "h-6 w-6",
                          index === 0 && "text-txt/70",
                          index === 1 && "text-accent",
                          index === 2 && "text-primary"
                        )} />
                      </motion.div>
                      
                      <div>
                        <h3 className="text-2xl font-bold text-txt">{plan.tier}</h3>
                        <p className="text-sm text-txt/60">{plan.highlight}</p>
                      </div>
                    </div>

                    {/* Pricing */}
                    <motion.div 
                      className="mb-8"
                      whileHover={{ scale: 1.05 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-baseline gap-1">
                        <span className="text-5xl font-bold text-txt">{plan.price}</span>
                        <span className="text-txt/60 text-lg">{plan.period}</span>
                      </div>
                      {plan.price !== 'Grátis' && (
                        <p className="text-sm text-accent mt-1">Primeira semana grátis</p>
                      )}
                    </motion.div>

                    {/* Features list */}
                    <ul className="space-y-4 mb-8">
                      {plan.features.map((feature, idx) => (
                        <motion.li 
                          key={idx}
                          className="flex items-start gap-3"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.3, delay: 0.1 * idx }}
                          whileHover={{ x: 4 }}
                        >
                          <CheckIcon />
                          <span className="text-txt/80 leading-relaxed">{feature}</span>
                        </motion.li>
                      ))}
                    </ul>

                    {/* CTA Button */}
                    <motion.a
                      href={plan.cta.href}
                      className={cn(
                        "w-full py-4 px-6 rounded-2xl font-bold text-center",
                        "transition-all duration-300 flex items-center justify-center gap-2",
                        "relative overflow-hidden group",
                        plan.buttonStyle
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      {/* Shine effect for primary buttons */}
                      {plan.popular && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6, ease: "easeInOut" }}
                        />
                      )}
                      
                      <span className="relative z-10">{plan.cta.label}</span>
                      
                      <motion.div
                        className="relative z-10"
                        whileHover={{ x: 4 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                    </motion.a>
                  </div>
                </motion.div>
              </Item>
            ))}
          </div>

          <Item>
            <motion.div 
              className="text-center mt-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <p className="text-txt/60 mb-6 text-lg">
                Não tem certeza? 
                <span className="text-accent font-semibold mx-1">Comece com o plano gratuito</span>
                e faça upgrade quando quiser.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-txt/50">
                {[
                  { icon: Check, text: "Cancelamento fácil" },
                  { icon: Check, text: "Sem taxas ocultas" },
                  { icon: Check, text: "Garantia de 30 dias" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    className="flex items-center gap-2"
                    whileHover={{ scale: 1.05, color: "rgba(123, 220, 255, 0.8)" }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    <item.icon className="h-4 w-4 text-accent" />
                    <span>{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}