import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { useMobileExperience } from '@/hooks/useMobileExperience';
import { cn } from '@/lib/utils';

// ==================== REVOLUT-INSPIRED ANIMATIONS ====================

// Apple-like timing functions
const easing = {
  smooth: [0.4, 0, 0.2, 1],
  spring: [0.175, 0.885, 0.32, 1.275],
  bounce: [0.68, -0.55, 0.265, 1.55],
  snappy: [0.25, 0.46, 0.45, 0.94]
} as const;

// Premium page transitions - Revolut style
const pageTransitions = {
  initial: { 
    opacity: 0, 
    scale: 0.98,
    filter: 'blur(8px)',
    y: 12
  },
  animate: { 
    opacity: 1, 
    scale: 1,
    filter: 'blur(0px)',
    y: 0
  },
  exit: { 
    opacity: 0, 
    scale: 1.02,
    filter: 'blur(4px)',
    y: -8
  }
};

// Mobile swipe transitions
const mobileSwipeTransitions = {
  initial: { 
    x: 40,
    opacity: 0,
    scale: 0.96
  },
  animate: { 
    x: 0,
    opacity: 1,
    scale: 1
  },
  exit: { 
    x: -40,
    opacity: 0,
    scale: 1.04
  }
};

// Glass card animations
const glassCardVariants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.96,
    backdropFilter: 'blur(0px)'
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    backdropFilter: 'blur(20px)'
  },
  hover: {
    y: -4,
    scale: 1.02,
    backdropFilter: 'blur(24px)',
    transition: { duration: 0.25, ease: easing.smooth }
  },
  tap: {
    scale: 0.98,
    transition: { duration: 0.1, ease: easing.smooth }
  }
};

// Button micro-interactions - Revolut style
const buttonVariants = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.02, 
    y: -1,
    boxShadow: '0 8px 25px rgba(46, 204, 113, 0.3)',
    transition: { duration: 0.2, ease: easing.smooth }
  },
  tap: { 
    scale: 0.98,
    y: 0,
    transition: { duration: 0.1, ease: easing.smooth }
  }
};

// ==================== COMPONENTS ====================

interface PremiumPageTransitionProps {
  children: React.ReactNode;
}

export function PremiumPageTransition({ children }: PremiumPageTransitionProps) {
  const location = useLocation();
  const { isMobile } = useMobileExperience();
  const prefersReducedMotion = useReducedMotion();

  const variants = prefersReducedMotion 
    ? { initial: {}, animate: {}, exit: {} }
    : isMobile 
      ? mobileSwipeTransitions 
      : pageTransitions;

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{
          duration: 0.4,
          ease: easing.snappy
        }}
        className="w-full"
        style={{
          willChange: 'transform, opacity, filter',
          backfaceVisibility: 'hidden'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  delay?: number;
}

export function GlassCard({ 
  children, 
  className, 
  interactive = true, 
  delay = 0 
}: GlassCardProps) {
  const { isTouch } = useMobileExperience();
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      variants={prefersReducedMotion ? {} : glassCardVariants}
      initial="initial"
      animate="animate"
      whileHover={interactive && !isTouch ? "hover" : undefined}
      whileTap={interactive ? "tap" : undefined}
      transition={{ 
        delay,
        duration: 0.4,
        ease: easing.smooth
      }}
      className={cn(
        // Base glass styling
        "bg-glass-bg backdrop-blur-[20px] border border-glass-border",
        "rounded-2xl shadow-lg",
        // Premium touches
        "relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-glass before:opacity-50",
        interactive && "cursor-pointer touch-manipulation",
        className
      )}
      style={{
        willChange: 'transform, backdrop-filter',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
}

interface PremiumButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function PremiumButton({ 
  children, 
  variant = 'primary',
  className,
  onClick,
  disabled = false
}: PremiumButtonProps) {
  const prefersReducedMotion = useReducedMotion();

  const baseClasses = cn(
    "px-6 py-3 rounded-xl font-semibold",
    "transition-all duration-200",
    "relative overflow-hidden",
    "touch-manipulation select-none",
    disabled && "opacity-50 cursor-not-allowed"
  );

  const variantClasses = {
    primary: "bg-gradient-primary text-accent-ink shadow-glow",
    secondary: "bg-surface text-txt border border-line",
    ghost: "text-accent hover:bg-accent/10"
  };

  return (
    <motion.button
      variants={prefersReducedMotion ? {} : buttonVariants}
      initial="initial"
      whileHover={!disabled ? "hover" : undefined}
      whileTap={!disabled ? "tap" : undefined}
      className={cn(baseClasses, variantClasses[variant], className)}
      onClick={onClick}
      disabled={disabled}
      style={{
        willChange: 'transform, box-shadow',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Shine effect */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: easing.smooth }}
          style={{ willChange: 'transform' }}
        />
      )}
      {children}
    </motion.button>
  );
}

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  stagger?: number;
}

export function StaggeredList({ 
  children, 
  className, 
  stagger = 0.1 
}: StaggeredListProps) {
  const prefersReducedMotion = useReducedMotion();

  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: prefersReducedMotion ? 0 : stagger,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20, scale: 0.95 },
    animate: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.4, ease: easing.smooth }
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={prefersReducedMotion ? {} : itemVariants}
          style={{ willChange: 'transform, opacity' }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

interface FloatingActionProps {
  children: React.ReactNode;
  className?: string;
}

export function FloatingAction({ children, className }: FloatingActionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25
      }}
      whileHover={!prefersReducedMotion ? { scale: 1.05 } : undefined}
      whileTap={!prefersReducedMotion ? { scale: 0.95 } : undefined}
      className={cn(
        "fixed bottom-6 right-6 z-50",
        "bg-gradient-primary text-accent-ink",
        "rounded-full p-4 shadow-glow",
        "cursor-pointer touch-manipulation",
        className
      )}
      style={{ willChange: 'transform' }}
    >
      {children}
    </motion.div>
  );
}

// ==================== HOOKS ====================

export function usePremiumAnimations() {
  const { isMobile, isTouch } = useMobileExperience();
  const prefersReducedMotion = useReducedMotion();

  return {
    shouldAnimate: !prefersReducedMotion,
    isMobile,
    isTouch,
    easing,
    
    // Quick animation presets
    quickFade: {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      transition: { duration: 0.2, ease: easing.smooth }
    },
    
    slideUp: {
      initial: { y: 20, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      transition: { duration: 0.4, ease: easing.smooth }
    },
    
    scaleIn: {
      initial: { scale: 0.9, opacity: 0 },
      animate: { scale: 1, opacity: 1 },
      transition: { duration: 0.3, ease: easing.spring }
    }
  };
}

// ==================== SCROLL ANIMATIONS ====================

export function useScrollReveal() {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1, rootMargin: '20px 0px -10% 0px' }
    );

    const elements = document.querySelectorAll('[data-scroll-reveal]');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return {
    isVisible,
    shouldAnimate: !prefersReducedMotion
  };
}

export default PremiumPageTransition;