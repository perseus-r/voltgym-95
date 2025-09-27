import { motion, useInView, useReducedMotion } from 'framer-motion';
import { useRef, ReactNode, ElementType } from 'react';

type Props = {
  children: ReactNode;
  y?: number;
  delay?: number;
  once?: boolean;
  as?: ElementType;
  className?: string;
};

export default function Reveal({ 
  children, 
  y = 24, 
  delay = 0, 
  once = true, 
  as: Tag = 'div',
  className 
}: Props) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.2, once });
  const prefersReduced = useReducedMotion();

  return (
    <Tag ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y }}
        animate={inView ? { opacity: 1, y: 0 } : undefined}
        transition={{ 
          duration: prefersReduced ? 0 : 0.7, 
          ease: [0.22, 1, 0.36, 1], 
          delay 
        }}
      >
        {children}
      </motion.div>
    </Tag>
  );
}