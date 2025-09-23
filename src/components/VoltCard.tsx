import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoltCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function VoltCard({ 
  children, 
  className, 
  hover = true, 
  glow = false,
  onClick 
}: VoltCardProps) {
  const cardVariants = {
    initial: { scale: 1, opacity: 1 },
    hover: { 
      scale: hover ? 1.02 : 1,
      y: hover ? -2 : 0,
    },
    tap: { scale: 0.98 },
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      whileTap={onClick ? "tap" : "initial"}
      transition={{ 
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1]
      }}
      onClick={onClick}
      className={cn(
        // Base glassmorphism
        "backdrop-blur-md border border-white/10",
        "bg-gradient-to-br from-white/5 to-white/[0.02]",
        "rounded-2xl shadow-2xl",
        
        // Glow effect
        glow && "shadow-accent/20",
        
        // Interactive states
        onClick && "cursor-pointer",
        hover && "hover:border-white/20 hover:shadow-xl hover:shadow-black/40",
        
        // Transitions
        "transition-all duration-300 ease-out",
        
        className
      )}
    >
      {children}
    </motion.div>
  );
}

// Specialized variants
export function VoltCardPremium({ children, className, ...props }: VoltCardProps) {
  return (
    <VoltCard 
      className={cn(
        "bg-gradient-to-br from-accent/10 to-accent/5",
        "border-accent/20 shadow-accent/10",
        className
      )}
      glow
      {...props}
    >
      {children}
    </VoltCard>
  );
}

export function VoltCardWarning({ children, className, ...props }: VoltCardProps) {
  return (
    <VoltCard 
      className={cn(
        "bg-gradient-to-br from-orange-500/10 to-orange-500/5",
        "border-orange-500/20 shadow-orange-500/10",
        className
      )}
      {...props}
    >
      {children}
    </VoltCard>
  );
}