import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Dumbbell, TrendingUp, Bot, Apple, Users } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function TabBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!isMobile) return;
    
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, isMobile]);

  useEffect(() => {
    const currentIndex = tabs.findIndex(tab => tab.path === location.pathname);
    if (currentIndex !== -1) {
      setActiveIndex(currentIndex);
    }
  }, [location.pathname]);

  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home, path: '/dashboard', color: 'from-accent to-accent-2' },
    { id: 'treinos', label: 'Treinos', icon: Dumbbell, path: '/treinos', color: 'from-accent to-accent-2' },
    { id: 'comunidade', label: 'Comunidade', icon: Users, path: '/comunidade', color: 'from-accent to-accent-2' },
    { id: 'progresso', label: 'Progresso', icon: TrendingUp, path: '/progresso', color: 'from-accent to-accent-2' },
    { id: 'ia-coach', label: 'IA Coach', icon: Bot, path: '/ia-coach', color: 'from-warning to-orange-500' },
  ];

  // Não mostrar no desktop
  if (!isMobile) return null;

  // Especial para página IA Coach
  if (location.pathname === '/ia-coach') {
    return (
      <motion.div 
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="flex justify-center px-4 py-2 space-x-2">
          {tabs.filter(tab => ['dashboard', 'ia-coach'].includes(tab.id)).map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              whileHover={{ scale: 1.05, y: -1 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
              className={cn(
                "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                "backdrop-blur-md border",
                location.pathname === tab.path
                  ? "bg-accent/20 text-white border-accent/30 shadow-lg shadow-accent/10"
                  : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
              )}
            >
              <div className="flex items-center gap-2">
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  }

  // Tab Bar principal com estilo premium
  return (
      <motion.div 
        className="fixed bottom-0 left-0 right-0 z-50 px-3 pt-2"
        style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ 
          y: isVisible ? 0 : 100,
          opacity: isVisible ? 1 : 0
        }}
        transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="relative bg-gradient-to-r from-bg/95 via-surface/95 to-card/95 backdrop-blur-2xl rounded-3xl border border-line/40 shadow-2xl shadow-black/20 max-w-md mx-auto overflow-hidden">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-accent/10 opacity-50" />
          
          {/* Dynamic indicator background */}
          <motion.div 
            className="absolute inset-y-1 bg-gradient-to-r from-accent/25 to-accent/35 rounded-2xl shadow-xl border border-accent/50 backdrop-blur-md"
            initial={false}
            animate={{
              left: `${(activeIndex) * (100 / tabs.length)}%`,
              width: `${100 / tabs.length}%`,
            }}
            transition={{ 
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1]
            }}
          />
          
          {/* Tabs */}
          <div className="relative flex p-2 gap-1" role="tablist" aria-label="Navegação principal">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = location.pathname === tab.path;
              
            return (
                <motion.button
                  key={tab.id}
                  onClick={() => navigate(tab.path)}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  role="tab"
                  aria-selected={isActive}
                  className={cn(
                    "relative flex-1 flex flex-col items-center gap-2 py-3 px-1 rounded-2xl transition-all duration-300 min-h-[60px]",
                    isActive 
                      ? "text-accent" 
                      : "text-txt-2 hover:text-txt"
                  )}
                >
                  <motion.div
                    animate={{ 
                      scale: isActive ? 1.15 : 1,
                      y: isActive ? -2 : 0
                    }}
                    transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    className="relative"
                  >
                    <Icon 
                      className={cn(
                        "transition-all duration-300 drop-shadow-sm",
                        isActive ? "w-6 h-6" : "w-5 h-5"
                      )} 
                    />
                    
                    {/* Premium glow effect */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 text-accent opacity-60"
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.6, 0.3, 0.6]
                        }}
                        transition={{ 
                          duration: 2.5, 
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Icon className="w-6 h-6 blur-sm" />
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <motion.span 
                    className={cn(
                      "text-xs font-medium transition-all duration-300 text-center leading-tight",
                      isActive 
                        ? "text-accent font-semibold" 
                        : "text-txt-2"
                    )}
                    animate={{ 
                      scale: isActive ? 1.05 : 0.95,
                      y: isActive ? -1 : 0,
                      opacity: isActive ? 1 : 0.8
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    {tab.label}
                  </motion.span>
                  
                  {/* Active dot indicator */}
                  {isActive && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute -bottom-1 w-1.5 h-1.5 bg-accent rounded-full shadow-lg shadow-accent/50"
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
          
          {/* Premium home indicator */}
          <div className="flex justify-center pb-2">
            <div className="h-1 w-12 bg-gradient-to-r from-accent/30 to-accent/60 rounded-full" />
          </div>
        </div>
      </motion.div>
  );
}