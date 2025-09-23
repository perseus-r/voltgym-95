import React from 'react';
import { cn } from '@/lib/utils';

interface CleanDesignWrapperProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'card' | 'section' | 'container';
  glow?: boolean;
}

export function CleanDesignWrapper({ 
  children, 
  className, 
  variant = 'card',
  glow = false 
}: CleanDesignWrapperProps) {
  const baseStyles = {
    card: "bg-card/80 backdrop-blur-sm border border-border/50 rounded-xl shadow-lg",
    section: "bg-gradient-to-br from-background to-surface/50 rounded-2xl border border-border/30",
    container: "bg-background/95 backdrop-blur-lg rounded-3xl border border-border/20 shadow-2xl"
  };

  const glowStyles = glow ? 
    "relative before:absolute before:inset-0 before:rounded-xl before:p-[1px] before:bg-gradient-to-r before:from-primary/20 before:via-accent/20 before:to-primary/20 before:-z-10" 
    : "";

  return (
    <div className={cn(
      baseStyles[variant],
      glowStyles,
      "transition-all duration-300 hover:shadow-xl hover:border-border/70",
      className
    )}>
      {children}
    </div>
  );
}