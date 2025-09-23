import React from 'react';
import { cn } from '@/lib/utils';

interface OptimizedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const OptimizedLayout: React.FC<OptimizedLayoutProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn(
      'w-full min-h-screen overflow-x-hidden bg-background',
      className
    )}>
      {children}
    </div>
  );
};

export const OptimizedSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  id?: string;
}> = ({
  children,
  className,
  id
}) => {
  return (
    <section 
      id={id}
      className={cn(
        'w-full py-16 md:py-24 relative overflow-hidden',
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
        {children}
      </div>
    </section>
  );
};

export const OptimizedContainer: React.FC<{
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}> = ({
  children,
  className,
  size = 'xl'
}) => {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl', 
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
    full: 'max-w-full'
  };

  return (
    <div className={cn(
      'w-full mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

export const OptimizedHero: React.FC<{
  children: React.ReactNode;
  className?: string;
  background?: 'gradient' | 'solid' | 'transparent';
}> = ({
  children,
  className,
  background = 'gradient'
}) => {
  const backgroundClasses = {
    gradient: 'bg-gradient-to-br from-background via-background/95 to-background/90',
    solid: 'bg-background',
    transparent: ''
  };

  return (
    <section className={cn(
      'w-full min-h-screen flex items-center justify-center relative overflow-hidden',
      backgroundClasses[background],
      className
    )}>
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 -top-48 -left-48 rounded-full opacity-10 animate-pulse bg-gradient-to-r from-accent/20 to-primary/20"></div>
        <div className="absolute w-96 h-96 -bottom-48 -right-48 rounded-full opacity-10 animate-pulse delay-1000 bg-gradient-to-r from-primary/20 to-accent/20"></div>
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10 w-full">
        {children}
      </div>
    </section>
  );
};