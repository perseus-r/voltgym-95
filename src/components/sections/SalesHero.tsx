import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import Reveal from '@/components/animations/Reveal';
import { ArrowRight, Zap, Activity, Play, Sparkles, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SalesHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  
  // Parallax effects
  const yBg = useTransform(scrollY, [0, 800], [0, 200]);
  const yContent = useTransform(scrollY, [0, 800], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  // Smooth spring animations
  const springConfig = { stiffness: 300, damping: 30, mass: 0.8 };
  const smoothY = useSpring(yContent, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: (e.clientY / window.innerHeight) * 2 - 1,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Enhanced animated background */}
      <motion.div 
        className="absolute inset-0"
        style={{ y: yBg }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-bg via-bg/95 to-bg/90">
          {/* Dynamic gradient overlay */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-primary/10"
            animate={{
              background: [
                "linear-gradient(45deg, rgba(123,220,255,0.1) 0%, transparent 50%, rgba(46,204,113,0.1) 100%)",
                "linear-gradient(135deg, rgba(46,204,113,0.1) 0%, transparent 50%, rgba(123,220,255,0.1) 100%)",
                "linear-gradient(225deg, rgba(123,220,255,0.1) 0%, transparent 50%, rgba(46,204,113,0.1) 100%)",
                "linear-gradient(315deg, rgba(46,204,113,0.1) 0%, transparent 50%, rgba(123,220,255,0.1) 100%)"
              ]
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />
          
          {/* Interactive floating orbs */}
          <motion.div 
            className="absolute top-20 right-20 w-96 h-96 bg-accent/10 rounded-full blur-3xl"
            animate={{
              x: mousePosition.x * 30,
              y: mousePosition.y * 30,
              scale: [1, 1.1, 1],
            }}
            transition={{ 
              x: { type: "spring", stiffness: 100, damping: 20 },
              y: { type: "spring", stiffness: 100, damping: 20 },
              scale: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
          />
          
          <motion.div 
            className="absolute bottom-20 left-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl"
            animate={{
              x: mousePosition.x * -20,
              y: mousePosition.y * -20,
              scale: [1, 1.2, 1],
            }}
            transition={{ 
              x: { type: "spring", stiffness: 150, damping: 25 },
              y: { type: "spring", stiffness: 150, damping: 25 },
              scale: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }
            }}
          />

          {/* Floating particles */}
          {Array.from({ length: 12 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent/30 rounded-full"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: [null, Math.random() * window.innerWidth],
                y: [null, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div 
        className="relative z-10 max-w-5xl mx-auto px-6 text-center"
        style={{ y: smoothY, opacity }}
      >
        <Reveal y={20}>
          <motion.div 
            className="flex items-center justify-center gap-3 mb-8"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="h-8 w-8 text-accent" />
            </motion.div>
            <span className="text-accent/90 font-bold text-lg tracking-wider">VOLT FITNESS</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Sparkles className="h-6 w-6 text-primary" />
            </motion.div>
          </motion.div>
        </Reveal>

        <Reveal y={30} delay={0.1}>
          <motion.h1 
            className="text-5xl md:text-8xl font-bold leading-tight mb-8"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <motion.span 
              className="block bg-gradient-to-r from-txt via-txt/90 to-txt/80 bg-clip-text text-transparent"
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            >
              Treinos Inteligentes
            </motion.span>
            <motion.span 
              className="block bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent mt-2"
              style={{ backgroundSize: "200% 200%" }}
              animate={{ 
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              Para Resultados
              <motion.span
                className="inline-block ml-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                Reais
              </motion.span>
            </motion.span>
          </motion.h1>
        </Reveal>

        <Reveal delay={0.2}>
          <motion.p 
            className="text-xl md:text-2xl text-txt/80 max-w-3xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Planos personalizados com 
            <motion.span 
              className="text-accent font-semibold mx-2"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
            >
              IA avançada
            </motion.span>
            que se adapta ao seu ritmo e objetivos.
            <br />
            <span className="text-primary font-medium">Em casa ou na academia.</span>
          </motion.p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
            <motion.a
              href="#pricing"
              className={cn(
                "group relative inline-flex items-center gap-3 px-10 py-5",
                "bg-gradient-primary text-accent-ink font-bold rounded-2xl text-lg",
                "shadow-glow overflow-hidden",
                "hover:shadow-2xl hover:shadow-accent/40 transition-all duration-300"
              )}
              whileHover={{ 
                y: -4, 
                scale: 1.02,
                boxShadow: "0 20px 40px rgba(123, 220, 255, 0.3)"
              }}
              whileTap={{ scale: 0.98, y: 0 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
              
              <Activity className="h-6 w-6" />
              Começar Treino Grátis
              
              <motion.div
                className="flex items-center"
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <ArrowRight className="h-6 w-6" />
              </motion.div>
            </motion.a>

            <motion.button
              className="group flex items-center gap-3 text-txt/80 hover:text-accent transition-colors font-medium text-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            >
              <motion.div
                className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center"
                whileHover={{ 
                  backgroundColor: "rgba(123, 220, 255, 0.3)",
                  scale: 1.1 
                }}
                transition={{ duration: 0.2 }}
              >
                <Play className="h-5 w-5 text-accent ml-1" />
              </motion.div>
              Ver Demonstração
            </motion.button>
          </div>
        </Reveal>

        <Reveal delay={0.4}>
          <motion.div 
            className="grid grid-cols-3 gap-8 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {[
              { icon: TrendingUp, label: "10.000+", desc: "atletas" },
              { icon: Sparkles, label: "4.9★", desc: "avaliação" },
              { icon: Activity, label: "95%", desc: "resultados" }
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                className="text-center group"
                whileHover={{ y: -4 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <motion.div
                  className="inline-flex p-3 rounded-xl bg-accent/10 mb-3 group-hover:bg-accent/20 transition-colors duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <stat.icon className="h-6 w-6 text-accent" />
                </motion.div>
                <div className="font-bold text-xl text-accent">{stat.label}</div>
                <div className="text-sm text-txt/60">{stat.desc}</div>
              </motion.div>
            ))}
          </motion.div>
        </Reveal>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <motion.div
          className="w-6 h-10 border-2 border-accent/50 rounded-full flex justify-center"
          whileHover={{ scale: 1.1, borderColor: "rgba(123, 220, 255, 0.8)" }}
        >
          <motion.div
            className="w-1 h-3 bg-accent rounded-full mt-2"
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}