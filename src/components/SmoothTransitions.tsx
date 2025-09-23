import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export const pageTransition = { duration: 0.35 };

export const pageVariants = {
  initial: { opacity: 0, x: 8, scale: 0.985 },
  in: { opacity: 1, x: 0, scale: 1 },
  out: { opacity: 0, x: -8, scale: 1.015 },
};

export const tabVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -12, scale: 1.04 },
};

interface SmoothPageTransitionProps {
  children: React.ReactNode;
}

export function SmoothPageTransition({ children }: SmoothPageTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)',
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

interface SmoothTabTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

export function SmoothTabTransition({ 
  children, 
  isActive, 
  className = '' 
}: SmoothTabTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={tabVariants}
          transition={{ duration: 0.3 }}
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface StaggeredListProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
}

export function StaggeredList({ 
  children, 
  className = '', 
  delay = 0.05 
}: StaggeredListProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: delay,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.96 },
    visible: { opacity: 1, y: 0, scale: 1 },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={itemVariants}
          style={{
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)',
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export const useHoverTransition = () => {
  return {
    hoverVariants: {
      initial: { scale: 1, y: 0 },
      hover: { scale: 1.02, y: -2 },
      tap: { scale: 0.98, y: 0 },
    },
  };
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
}

export function LoadingOverlay({ isLoading, children }: LoadingOverlayProps) {
  return (
    <motion.div
      animate={isLoading 
        ? { opacity: 0.5, scale: 0.98, filter: 'blur(1px)', pointerEvents: 'none' as const }
        : { opacity: 1, scale: 1, filter: 'blur(0px)', pointerEvents: 'auto' as const }
      }
      transition={{ duration: 0.3 }}
      style={{
        willChange: 'transform, opacity, filter',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)',
      }}
    >
      {children}
    </motion.div>
  );
}