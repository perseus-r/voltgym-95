import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode } from 'react';

export function Stagger({ 
  children, 
  delay = 0,
  className 
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ amount: 0.2, once: true }}
      variants={{
        hidden: {},
        show: { 
          transition: { 
            staggerChildren: prefersReduced ? 0 : 0.08, 
            delayChildren: delay 
          } 
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function Item({ 
  children, 
  y = 24,
  className 
}: { 
  children: ReactNode; 
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { 
          opacity: 1, 
          y: 0, 
          transition: { 
            duration: 0.6, 
            ease: [0.22, 1, 0.36, 1] 
          } 
        },
      }}
    >
      {children}
    </motion.div>
  );
}