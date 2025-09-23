import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';

interface PageTransitionProps {
  children: React.ReactNode;
}

export function PageTransition({ children }: PageTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 10, scale: 0.98 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: -10, scale: 1.02 }}
        transition={{ duration: 0.4 }}
        className="w-full h-full"
        style={{ 
          willChange: 'transform, opacity',
          backfaceVisibility: 'hidden',
          transform: 'translateZ(0)'
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export function useContentTransition() {
  return {
    contentVariants: {
      hidden: { opacity: 0, y: 15, scale: 0.98 },
      visible: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: -15, scale: 1.02 },
    },
    contentTransition: { duration: 0.3 },
  };
}

interface SectionTransitionProps {
  children: React.ReactNode;
  isActive: boolean;
  className?: string;
}

export function SectionTransition({ children, isActive, className = '' }: SectionTransitionProps) {
  const { contentVariants, contentTransition } = useContentTransition();

  return (
    <AnimatePresence mode="wait">
      {isActive && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={contentVariants}
          transition={contentTransition}
          className={className}
          style={{ 
            willChange: 'transform, opacity',
            backfaceVisibility: 'hidden',
            transform: 'translateZ(0)'
          }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface StaggeredAnimationProps {
  children: React.ReactNode[];
  className?: string;
  delay?: number;
}

export function StaggeredAnimation({ children, className = '', delay = 0.1 }: StaggeredAnimationProps) {
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
    hidden: { opacity: 0, y: 20, scale: 0.95 },
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
        <motion.div key={index} variants={itemVariants}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

export function useHoverAnimation() {
  return {
    hoverVariants: {
      initial: { scale: 1, y: 0 },
      hover: { scale: 1.02, y: -2 },
      tap: { scale: 0.98 },
    },
  };
}

interface LoadingTransitionProps {
  isLoading: boolean;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function LoadingTransition({ isLoading, children, fallback }: LoadingTransitionProps) {
  return (
    <motion.div
      animate={isLoading ? { opacity: 0.6, scale: 0.98 } : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      style={{ 
        willChange: 'transform, opacity',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)'
      }}
    >
      <AnimatePresence mode="wait">
        {isLoading && fallback ? (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {fallback}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}