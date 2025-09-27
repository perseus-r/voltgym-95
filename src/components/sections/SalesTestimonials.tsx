import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Stagger, Item } from '@/components/animations/Stagger';
import { 
  Star, Users, Trophy, TrendingUp, Zap, Heart, 
  ArrowRight, Quote, CheckCircle 
} from 'lucide-react';
import { cn } from '@/lib/utils';

const testimonials = [
  {
    name: "Maria Fernanda Santos",
    age: "34 anos",
    occupation: "CEO",
    text: "Perdi 18kg em 4 meses mantendo minha rotina executiva. O VOLT se adapta perfeitamente aos meus horários.",
    before: "78kg",
    after: "60kg",
    rating: 5,
    time: "4 meses",
    image: "🏋️‍♀️",
    achievement: "Melhor forma física da vida"
  },
  {
    name: "Roberto Carlos Silva",
    age: "45 anos",
    occupation: "Contador",
    text: "Aos 45 anos conquistei o melhor shape da minha vida. Ganhei 12kg de massa magra seguindo protocolos científicos.",
    before: "72kg",
    after: "84kg",
    rating: 5,
    time: "6 meses",
    image: "💪",
    achievement: "Ganho de massa magra"
  },
  {
    name: "Ana Julia Oliveira",
    age: "28 anos",
    occupation: "Médica",
    text: "Como médica, busco evidências científicas. O VOLT oferece treinos baseados em pesquisas validadas, não modismos.",
    before: "89kg",
    after: "74kg",
    rating: 5,
    time: "5 meses",
    image: "👩‍⚕️",
    achievement: "Transformação científica"
  }
];

const stats = [
  { icon: Users, value: "10.000+", label: "Usuários ativos", color: "accent" },
  { icon: Trophy, value: "95%", label: "Veem resultados", color: "primary" },
  { icon: TrendingUp, value: "267%", label: "Mais eficiente", color: "accent" },
  { icon: Heart, value: "4.9★", label: "Avaliação média", color: "primary" }
];

export default function SalesTestimonials() {
  const [currentTestimonial, setCurrentTestimonial] = React.useState(0);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 1000], [0, -50]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 px-6 bg-gradient-to-b from-surface/20 to-bg relative overflow-hidden">
      {/* Background elements */}
      <motion.div 
        className="absolute inset-0 opacity-30"
        style={{ y }}
      >
        <div className="absolute top-1/4 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-10 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      </motion.div>

      <div className="max-w-7xl mx-auto relative z-10">
        <Stagger>
          <Item>
            <div className="text-center mb-20">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6"
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Trophy className="h-4 w-4 text-primary" />
                <span className="text-primary font-medium">Transformações Reais</span>
              </motion.div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-txt mb-6">
                Histórias de 
                <motion.span 
                  className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mt-2"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  Sucesso
                </motion.span>
              </h2>
              
              <p className="text-xl text-txt/70 max-w-3xl mx-auto">
                Conheça algumas das milhares de pessoas que transformaram suas vidas com o VOLT.
              </p>
            </div>
          </Item>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
            {stats.map((stat, index) => (
              <Item key={stat.label}>
                <motion.div
                  className="text-center p-6 rounded-2xl bg-surface/30 backdrop-blur-sm border border-line/30 hover:border-accent/30 transition-all duration-300"
                  whileHover={{ 
                    y: -4,
                    scale: 1.02,
                    transition: { type: 'spring', stiffness: 300, damping: 25 }
                  }}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <motion.div
                    className={cn(
                      "inline-flex p-3 rounded-xl mb-4",
                      stat.color === 'accent' ? "bg-accent/20" : "bg-primary/20"
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
                    <stat.icon className={cn(
                      "h-6 w-6",
                      stat.color === 'accent' ? "text-accent" : "text-primary"
                    )} />
                  </motion.div>
                  
                  <motion.div 
                    className={cn(
                      "text-3xl font-bold mb-2",
                      stat.color === 'accent' ? "text-accent" : "text-primary"
                    )}
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    {stat.value}
                  </motion.div>
                  
                  <div className="text-sm text-txt/60">{stat.label}</div>
                </motion.div>
              </Item>
            ))}
          </div>

          {/* Main Testimonial */}
          <Item>
            <div className="relative max-w-5xl mx-auto">
              <motion.div
                className="relative rounded-3xl bg-surface/50 backdrop-blur-sm border border-line/50 p-12 overflow-hidden"
                whileHover={{ 
                  borderColor: "rgba(123, 220, 255, 0.5)",
                  transition: { duration: 0.3 }
                }}
                key={currentTestimonial}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {/* Quote decoration */}
                <motion.div
                  className="absolute top-8 left-8 w-12 h-12 text-accent/20"
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 400, damping: 25 }}
                >
                  <Quote className="w-full h-full" />
                </motion.div>

                <div className="text-center relative z-10">
                  {/* User emoji/avatar */}
                  <motion.div 
                    className="text-8xl mb-8"
                    animate={{ 
                      rotate: [0, 5, -5, 0],
                      scale: [1, 1.05, 1]
                    }}
                    transition={{ 
                      duration: 3, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                  >
                    {testimonials[currentTestimonial].image}
                  </motion.div>
                  
                  {/* Star rating */}
                  <div className="flex justify-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ 
                          delay: 0.1 * i,
                          type: "spring",
                          stiffness: 400,
                          damping: 25
                        }}
                      >
                        <Star className="w-6 h-6 text-yellow-400 fill-current" />
                      </motion.div>
                    ))}
                  </div>
                  
                  {/* Testimonial text */}
                  <motion.blockquote 
                    className="text-2xl md:text-3xl text-txt mb-8 leading-relaxed font-medium"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  >
                    "{testimonials[currentTestimonial].text}"
                  </motion.blockquote>
                  
                  {/* Before/After stats */}
                  <motion.div 
                    className="flex justify-center items-center gap-12 mb-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-400 mb-2">
                        {testimonials[currentTestimonial].before}
                      </div>
                      <div className="text-sm text-txt/60 font-medium">Antes</div>
                    </div>
                    
                    <motion.div
                      animate={{ x: [0, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <ArrowRight className="w-8 h-8 text-accent" />
                    </motion.div>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-400 mb-2">
                        {testimonials[currentTestimonial].after}
                      </div>
                      <div className="text-sm text-txt/60 font-medium">Depois</div>
                    </div>
                  </motion.div>
                  
                  {/* User info */}
                  <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                  >
                    <div className="font-bold text-txt text-xl mb-1">
                      {testimonials[currentTestimonial].name}
                    </div>
                    <div className="text-txt/60 mb-2">
                      {testimonials[currentTestimonial].occupation} • {testimonials[currentTestimonial].age}
                    </div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                      <CheckCircle className="h-4 w-4 text-accent" />
                      <span className="text-accent font-medium">
                        {testimonials[currentTestimonial].achievement} em {testimonials[currentTestimonial].time}
                      </span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Testimonial indicators */}
              <div className="flex justify-center space-x-3 mt-8">
                {testimonials.map((_, index) => (
                  <motion.button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={cn(
                      "w-4 h-4 rounded-full transition-all duration-300",
                      index === currentTestimonial 
                        ? "bg-accent scale-125" 
                        : "bg-txt/20 hover:bg-txt/40"
                    )}
                    whileHover={{ scale: index === currentTestimonial ? 1.25 : 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            </div>
          </Item>
        </Stagger>
      </div>
    </section>
  );
}