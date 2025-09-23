import React from 'react';
import { cn } from '@/lib/utils';

interface LiquidGlassProps {
  children: React.ReactNode;
  variant?: 'default' | 'menu' | 'button' | 'card';
  className?: string;
  animated?: boolean;
  hover?: boolean;
  onClick?: () => void;
}

export function LiquidGlass({ 
  children, 
  variant = 'default', 
  className = '',
  animated = false,
  hover = true,
  onClick
}: LiquidGlassProps) {
  const baseClasses = {
    default: 'liquid-glass',
    menu: 'liquid-glass-menu',
    button: 'liquid-glass-button',
    card: 'liquid-glass'
  };

  const animationClasses = {
    float: animated ? 'liquid-float' : '',
    ripple: animated ? 'liquid-ripple' : ''
  };

  const Component = onClick ? 'button' : 'div';

  return (
    <Component
      className={cn(
        baseClasses[variant],
        animationClasses.float,
        animationClasses.ripple,
        hover && variant === 'button' && 'hover:scale-105 active:scale-95',
        className
      )}
      onClick={onClick}
    >
      {children}
    </Component>
  );
}

// Specialized Components
export function LiquidGlassButton({ 
  children, 
  className = '', 
  onClick,
  ...props 
}: Omit<LiquidGlassProps, 'variant'> & { onClick?: () => void }) {
  return (
    <LiquidGlass 
      variant="button" 
      className={cn('transition-all duration-200', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

export function LiquidGlassMenu({ 
  children, 
  className = '', 
  ...props 
}: Omit<LiquidGlassProps, 'variant'>) {
  return (
    <LiquidGlass 
      variant="menu" 
      className={className}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}

export function LiquidGlassCard({ 
  children, 
  className = '', 
  ...props 
}: Omit<LiquidGlassProps, 'variant'>) {
  return (
    <LiquidGlass 
      variant="card" 
      className={cn('p-6', className)}
      {...props}
    >
      {children}
    </LiquidGlass>
  );
}