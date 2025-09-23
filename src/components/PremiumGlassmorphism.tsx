import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ==================== PREMIUM GLASSMORPHISM COMPONENTS ====================

interface GlassContainerProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'intense' | 'subtle' | 'card';
  blur?: 'light' | 'medium' | 'heavy';
  interactive?: boolean;
}

export function GlassContainer({ 
  children, 
  className,
  variant = 'default',
  blur = 'medium',
  interactive = false
}: GlassContainerProps) {
  const blurIntensity = {
    light: 'backdrop-blur-[12px]',
    medium: 'backdrop-blur-[20px]',
    heavy: 'backdrop-blur-[40px]'
  };

  const variants = {
    default: 'bg-glass-bg border-glass-border',
    intense: 'bg-white/10 border-white/20',
    subtle: 'bg-white/5 border-white/10',
    card: 'bg-surface/80 border-line/50'
  };

  return (
    <motion.div
      className={cn(
        // Base glass styles
        blurIntensity[blur],
        variants[variant],
        'border rounded-2xl',
        'shadow-glass',
        
        // Premium enhancements
        'relative overflow-hidden',
        'before:absolute before:inset-0',
        'before:bg-gradient-glass before:opacity-30',
        
        // Interactive states
        interactive && [
          'transition-all duration-300 ease-out',
          'hover:bg-white/15 hover:border-accent/30',
          'hover:shadow-glow hover:-translate-y-1',
          'active:scale-[0.98] active:translate-y-0'
        ],
        
        className
      )}
      style={{
        willChange: interactive ? 'transform, background-color, box-shadow' : 'auto',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
}

interface GlassButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function GlassButton({ 
  children, 
  variant = 'primary',
  size = 'md',
  className,
  onClick,
  disabled = false
}: GlassButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  const variants = {
    primary: [
      'bg-gradient-primary text-accent-ink',
      'shadow-[0_4px_14px_rgba(46,204,113,0.25)]',
      'hover:shadow-[0_6px_20px_rgba(46,204,113,0.4)]',
      'hover:scale-105 hover:-translate-y-0.5'
    ],
    secondary: [
      'bg-white/10 text-txt border border-white/20',
      'backdrop-blur-[16px]',
      'hover:bg-white/15 hover:border-accent/30'
    ],
    ghost: [
      'text-accent hover:bg-accent/10',
      'border border-transparent hover:border-accent/20'
    ]
  };

  return (
    <motion.button
      className={cn(
        // Base styles
        'font-semibold transition-all duration-200',
        'relative overflow-hidden',
        'touch-manipulation select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        
        // Size and variant
        sizes[size],
        variants[variant],
        
        className
      )}
      whileTap={!disabled ? { scale: 0.95 } : undefined}
      onClick={onClick}
      disabled={disabled}
      style={{
        willChange: 'transform, box-shadow',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Shine effect for primary buttons */}
      {variant === 'primary' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
      
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

interface GlassModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function GlassModal({ 
  isOpen, 
  onClose, 
  children, 
  title,
  className 
}: GlassModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/50 backdrop-blur-[8px]"
      />
      
      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'relative w-full max-w-md',
          'bg-surface/90 backdrop-blur-[24px]',
          'border border-glass-border rounded-3xl',
          'shadow-[0_20px_60px_rgba(0,0,0,0.4)]',
          'overflow-hidden',
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        {title && (
          <div className="flex items-center justify-between p-6 border-b border-glass-border">
            <h3 className="text-xl font-bold text-txt">{title}</h3>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </div>
        )}
        
        {/* Content */}
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

interface GlassInputProps {
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  icon?: React.ReactNode;
}

export function GlassInput({ 
  type = 'text',
  placeholder,
  value,
  onChange,
  className,
  icon
}: GlassInputProps) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-txt-3">
          {icon}
        </div>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className={cn(
          // Base styles
          'w-full py-3 px-4 rounded-xl',
          'bg-white/5 border border-white/10',
          'backdrop-blur-[12px]',
          'text-txt placeholder-txt-3',
          'transition-all duration-200',
          
          // Focus states
          'focus:outline-none focus:ring-2',
          'focus:ring-accent/50 focus:border-accent/30',
          'focus:bg-white/10',
          
          // Icon spacing
          icon && 'pl-12',
          
          className
        )}
        style={{
          willChange: 'background-color, border-color',
          backfaceVisibility: 'hidden'
        }}
      />
    </div>
  );
}

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

export function GlassCard({ 
  children, 
  className,
  padding = 'md',
  hover = true
}: GlassCardProps) {
  const paddings = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };

  return (
    <motion.div
      className={cn(
        // Base glass styles
        'bg-glass-bg backdrop-blur-[20px]',
        'border border-glass-border rounded-2xl',
        'shadow-glass',
        
        // Padding
        paddings[padding],
        
        // Interactive states
        hover && [
          'transition-all duration-300 ease-out',
          'hover:bg-white/10 hover:border-accent/20',
          'hover:shadow-glow hover:-translate-y-1',
          'cursor-pointer'
        ],
        
        className
      )}
      whileHover={hover ? { y: -2, scale: 1.01 } : undefined}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        willChange: hover ? 'transform, background-color, box-shadow' : 'auto',
        backfaceVisibility: 'hidden'
      }}
    >
      {children}
    </motion.div>
  );
}

export default GlassContainer;