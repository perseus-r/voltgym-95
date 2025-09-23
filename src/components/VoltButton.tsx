import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface VoltButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'warning';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
}

export function VoltButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false,
  loading = false
}: VoltButtonProps) {
  const buttonVariants = {
    initial: { scale: 1 },
    hover: { scale: 1.02, y: -1 },
    tap: { scale: 0.98 },
  };

  const variants = {
    primary: "bg-gradient-to-r from-accent to-accent-2 text-black shadow-lg shadow-accent/25 hover:shadow-accent/40",
    secondary: "bg-white/10 text-white border border-white/20 hover:bg-white/20 hover:border-white/30",
    ghost: "text-txt-2 hover:text-txt hover:bg-white/5",
    warning: "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-xl",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-2xl",
    xl: "px-10 py-5 text-xl rounded-2xl",
  };

  return (
    <motion.button
      variants={buttonVariants}
      initial="initial"
      whileHover={!disabled ? "hover" : "initial"}
      whileTap={!disabled ? "tap" : "initial"}
      transition={{ 
        duration: 0.15,
        ease: "easeOut"
      }}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        // Base styles
        "inline-flex items-center justify-center gap-2",
        "font-medium tracking-wide",
        "transition-all duration-200 ease-out",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        
        // Variant styles
        variants[variant],
        
        // Size styles
        sizes[size],
        
        className
      )}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        children
      )}
    </motion.button>
  );
}