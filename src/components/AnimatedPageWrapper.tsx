import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedPageWrapperProps {
  children: React.ReactNode;
  pageKey: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    x: 50,
    scale: 0.98,
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.98,
  },
};

const pageTransition = {
  duration: 0.4,
};

export function AnimatedPageWrapper({ children, pageKey }: AnimatedPageWrapperProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={pageTransition}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}