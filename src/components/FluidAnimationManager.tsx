import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useMobileExperience } from '@/hooks/useMobileExperience';
import { cn } from '@/lib/utils';

interface FluidAnimationManagerProps {
  children: React.ReactNode;
}

// Animações otimizadas para performance
const pageTransitions = {
  initial: { 
    opacity: 0, 
    y: 20,
    filter: 'blur(4px)',
    scale: 0.98
  },
  animate: { 
    opacity: 1, 
    y: 0,
    filter: 'blur(0px)',
    scale: 1
  },
  exit: { 
    opacity: 0, 
    y: -10,
    filter: 'blur(2px)',
    scale: 1.02
  }
};

const cardAnimations = {
  initial: { 
    opacity: 0, 
    y: 30,
    scale: 0.95
  },
  animate: { 
    opacity: 1, 
    y: 0,
    scale: 1
  }
};

// Hook para animações fluidas
export const useFluidAnimations = () => {
  const prefersReducedMotion = useReducedMotion();
  const { isMobile, isTouch } = useMobileExperience();
  
  return {
    pageTransition: prefersReducedMotion ? {} : pageTransitions,
    cardAnimation: prefersReducedMotion ? {} : cardAnimations,
    shouldAnimate: !prefersReducedMotion,
    optimizeForTouch: isTouch,
    isMobile
  };
};

// Componente para animações de página
export const AnimatedPage: React.FC<FluidAnimationManagerProps> = ({ children }) => {
  const location = useLocation();
  const { pageTransition } = useFluidAnimations();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        variants={pageTransition}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: 0.4,
          ease: "easeOut",
          staggerChildren: 0.1
        }}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

// Componente para cards animados
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  interactive?: boolean;
}> = ({ children, className, delay = 0, interactive = true }) => {
  const { cardAnimation, shouldAnimate, optimizeForTouch } = useFluidAnimations();
  
  return (
    <motion.div
      variants={cardAnimation}
      initial="initial"
      animate="animate"
      whileHover={shouldAnimate && !optimizeForTouch ? { 
        y: -2, 
        scale: 1.02,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={{ delay }}
      className={cn(
        "will-change-transform",
        interactive && "cursor-pointer touch-manipulation",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

// Componente para listas animadas
export const AnimatedList: React.FC<{
  children: React.ReactNode;
  stagger?: number;
}> = ({ children, stagger = 0.1 }) => {
  const { shouldAnimate } = useFluidAnimations();
  
  const listVariants = {
    animate: {
      transition: {
        staggerChildren: shouldAnimate ? stagger : 0
      }
    }
  };
  
  return (
    <motion.div
      variants={listVariants}
      initial="initial"
      animate="animate"
    >
      {children}
    </motion.div>
  );
};

// Sistema de scroll suave
export const useSmoothScroll = () => {
  const { isMobile } = useMobileExperience();
  
  useEffect(() => {
    // CSS para scroll suave nativo
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Otimizações para mobile
    if (isMobile) {
      document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');
      document.body.style.setProperty('overscroll-behavior-y', 'none');
    }
    
    return () => {
      document.documentElement.style.removeProperty('scroll-behavior');
      if (isMobile) {
        document.body.style.removeProperty('-webkit-overflow-scrolling');
        document.body.style.removeProperty('overscroll-behavior-y');
      }
    };
  }, [isMobile]);
  
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const scrollToElement = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return { scrollToTop, scrollToElement };
};

// Componente principal do gerenciador de animações
export const FluidAnimationManager: React.FC<FluidAnimationManagerProps> = ({ children }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const { isMobile } = useMobileExperience();
  
  useSmoothScroll();
  
  useEffect(() => {
    // Otimizações de performance para animações
    const optimizeAnimations = () => {
      // GPU acceleration para elementos animados
      const animatedElements = document.querySelectorAll('[data-animate]');
      animatedElements.forEach(el => {
        (el as HTMLElement).style.willChange = 'transform, opacity';
      });
      
      // Reduzir animações em dispositivos com baixa performance
      if (isMobile && window.devicePixelRatio > 2) {
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
      }
    };
    
    // Aplicar otimizações após carregamento
    const timer = setTimeout(() => {
      optimizeAnimations();
      setIsLoaded(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [isMobile]);
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isLoaded ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      className="relative"
    >
      {children}
    </motion.div>
  );
};

// CSS Helpers para animações fluidas
export const fluidAnimationStyles = {
  // Transições suaves para elementos interativos
  interactive: "transition-all duration-300 ease-out will-change-transform",
  
  // Hover states otimizados
  hoverLift: "hover:shadow-lg hover:-translate-y-1 hover:shadow-accent/20",
  
  // States de loading
  loading: "animate-pulse",
  
  // Micro-interações
  bounce: "hover:animate-bounce",
  pulse: "animate-pulse",
  
  // Estados de foco para acessibilidade
  focusRing: "focus:ring-2 focus:ring-accent/50 focus:ring-offset-2 focus:ring-offset-bg",
  
  // Performance optimizations
  gpu: "transform-gpu will-change-transform"
};

// Hook para micro-interações
export const useMicroInteractions = () => {
  const { shouldAnimate, optimizeForTouch } = useFluidAnimations();
  
  const buttonPress = shouldAnimate ? {
    whileTap: { scale: 0.95 },
    whileHover: !optimizeForTouch ? { scale: 1.02 } : {}
  } : {};
  
  const cardHover = shouldAnimate ? {
    whileHover: !optimizeForTouch ? { 
      y: -4, 
      transition: { duration: 0.2 } 
    } : {},
    whileTap: { scale: 0.98 }
  } : {};
  
  const iconSpin = shouldAnimate ? {
    whileHover: { rotate: 360 },
    transition: { duration: 0.6 }
  } : {};
  
  return {
    buttonPress,
    cardHover,
    iconSpin,
    shouldAnimate
  };
};

export default FluidAnimationManager;