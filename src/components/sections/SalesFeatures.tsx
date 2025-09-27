import React from 'react';
import { Stagger, Item } from '@/components/animations/Stagger';
import { Brain, BarChart3, Timer, Users, Smartphone, Trophy, Zap, Target } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

const features = [
  {
    icon: Brain,
    title: 'IA Coach Pessoal',
    description: 'Treinos adaptativos que evoluem com você, ajustando intensidade e volume automaticamente baseado em 200+ métricas biológicas.',
    color: 'accent',
    gradient: 'from-accent/20 to-accent/5'
  },
  {
    icon: BarChart3,
    title: 'Analytics Científico',
    description: 'Métricas detalhadas validadas por 500+ estudos científicos para otimizar força, resistência e composição corporal.',
    color: 'primary',
    gradient: 'from-primary/20 to-primary/5'
  },
  {
    icon: Timer,
    title: 'Periodização Inteligente',
    description: 'Sistema de progressão que ajusta cargas, volumes e intensidades automaticamente para evitar plateaus.',
    color: 'accent',
    gradient: 'from-accent/20 to-accent/5'
  },
  {
    icon: Users,
    title: 'Comunidade Global',
    description: 'Conecte-se com 10.000+ atletas, compartilhe conquistas e participe de desafios mensais exclusivos.',
    color: 'primary',
    gradient: 'from-primary/20 to-primary/5'
  },
  {
    icon: Smartphone,
    title: 'Sincronização Total',
    description: 'Integração perfeita com Apple Health, Google Fit e 50+ wearables para monitoramento contínuo.',
    color: 'accent',
    gradient: 'from-accent/20 to-accent/5'
  },
  {
    icon: Trophy,
    title: 'Sistema de Conquistas',
    description: 'Gamificação baseada em neurociência que mantém você motivado com recompensas personalizadas.',
    color: 'primary',
    gradient: 'from-primary/20 to-primary/5'
  }
];

export default function SalesFeatures() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -50]);

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ y }}
      >
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Stagger>
          <Item>
            <div className="text-center mb-20">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Zap className="h-4 w-4 text-accent" />
                <span className="text-accent font-medium">Tecnologia Avançada</span>
              </motion.div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-txt mb-6">
                Por Que Escolher 
                <motion.span 
                  className="block bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent mt-2"
                  style={{ backgroundSize: "200% 200%" }}
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Volt Fitness?
                </motion.span>
              </h2>
              
              <motion.p 
                className="text-xl text-txt/70 max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                Tecnologia de ponta validada cientificamente que transforma como você treina, 
                monitora progresso e alcança resultados.
              </motion.p>
            </div>
          </Item>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Item key={feature.title}>
                <motion.div
                  className={cn(
                    "group relative h-full p-8 rounded-3xl",
                    "bg-surface/50 backdrop-blur-sm border border-line/50",
                    "hover:border-accent/50 transition-all duration-500",
                    "overflow-hidden"
                  )}
                  whileHover={{ 
                    y: -8,
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 300, damping: 25 }
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  {/* Animated gradient background */}
                  <motion.div 
                    className={cn(
                      "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                      `bg-gradient-to-br ${feature.gradient}`
                    )}
                    initial={false}
                  />

                  {/* Glow effect on hover */}
                  <motion.div
                    className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                      background: `radial-gradient(circle at 50% 50%, ${
                        feature.color === 'accent' ? 'rgba(123, 220, 255, 0.1)' : 'rgba(46, 204, 113, 0.1)'
                      } 0%, transparent 70%)`
                    }}
                  />

                  <div className="relative z-10">
                    {/* Icon with advanced animations */}
                    <motion.div 
                      className={cn(
                        "inline-flex p-4 rounded-2xl mb-6 relative",
                        feature.color === 'accent' ? "bg-accent/20" : "bg-primary/20"
                      )}
                      whileHover={{ 
                        scale: 1.1,
                        rotate: [0, -5, 5, 0],
                        transition: { 
                          scale: { type: "spring", stiffness: 400, damping: 25 },
                          rotate: { duration: 0.5, ease: "easeInOut" }
                        }
                      }}
                    >
                      <feature.icon className={cn(
                        "h-8 w-8 relative z-10",
                        feature.color === 'accent' ? "text-accent" : "text-primary"
                      )} />
                      
                      {/* Pulse effect */}
                      <motion.div
                        className={cn(
                          "absolute inset-0 rounded-2xl opacity-30",
                          feature.color === 'accent' ? "bg-accent" : "bg-primary"
                        )}
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.3, 0.1, 0.3]
                        }}
                        transition={{ 
                          duration: 2, 
                          repeat: Infinity, 
                          ease: "easeInOut",
                          delay: index * 0.2
                        }}
                      />
                    </motion.div>

                    <motion.h3 
                      className="text-2xl font-bold text-txt mb-4 group-hover:text-accent transition-colors duration-300"
                      whileHover={{ x: 4 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    >
                      {feature.title}
                    </motion.h3>

                    <motion.p 
                      className="text-txt/70 leading-relaxed group-hover:text-txt/90 transition-colors duration-300"
                      initial={{ opacity: 0.8 }}
                      whileHover={{ opacity: 1 }}
                    >
                      {feature.description}
                    </motion.p>

                    {/* Hover arrow indicator */}
                    <motion.div
                      className="flex items-center gap-2 mt-6 text-accent opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ x: -10 }}
                      whileHover={{ x: 0 }}
                    >
                      <span className="text-sm font-medium">Saiba mais</span>
                      <Target className="h-4 w-4" />
                    </motion.div>
                  </div>

                  {/* Decorative corner element */}
                  <motion.div
                    className="absolute top-4 right-4 w-8 h-8 opacity-20 group-hover:opacity-40 transition-opacity duration-300"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <div className={cn(
                      "w-full h-full rounded-full",
                      feature.color === 'accent' ? "bg-accent" : "bg-primary"
                    )} />
                  </motion.div>
                </motion.div>
              </Item>
            ))}
          </div>
        </Stagger>
      </div>
    </section>
  );
}