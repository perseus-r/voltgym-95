import React from 'react';
import { motion } from 'framer-motion';
import Reveal from '@/components/animations/Reveal';
import { ArrowRight, Zap, Activity } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SalesHero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg/95 to-bg/90">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-primary/5 animate-pulse" />
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <Reveal y={20}>
          <div className="flex items-center justify-center gap-2 mb-6">
            <Zap className="h-6 w-6 text-accent" />
            <span className="text-accent/80 font-semibold">VOLT FITNESS</span>
          </div>
        </Reveal>

        <Reveal y={24} delay={0.1}>
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-txt via-txt/90 to-txt/80 bg-clip-text text-transparent leading-tight mb-6">
            Treinos Inteligentes 
            <br />
            <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Para Resultados Reais
            </span>
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="text-lg md:text-xl text-txt/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Planos personalizados, ajuste automático de carga e métricas que importam. 
            <span className="text-accent font-semibold">Em casa ou na academia.</span>
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.a
              href="#pricing"
              className={cn(
                "group inline-flex items-center gap-2 px-8 py-4",
                "bg-gradient-primary text-accent-ink font-semibold rounded-2xl",
                "shadow-glow transition-all duration-300",
                "hover:shadow-xl hover:shadow-accent/30"
              )}
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <Activity className="h-5 w-5" />
              Começar Treino Grátis
              <motion.div
                className="flex items-center"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <ArrowRight className="h-5 w-5" />
              </motion.div>
            </motion.a>

            <motion.button
              className="text-txt/80 hover:text-accent transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Ver demonstração →
            </motion.button>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="text-sm text-txt/60">
              Usado por <span className="font-semibold text-accent">10.000+</span> atletas
            </div>
            <div className="w-px h-4 bg-line" />
            <div className="text-sm text-txt/60">
              <span className="font-semibold text-primary">4.9★</span> na App Store
            </div>
            <div className="w-px h-4 bg-line" />
            <div className="text-sm text-txt/60">
              <span className="font-semibold text-accent">95%</span> veem resultados
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}