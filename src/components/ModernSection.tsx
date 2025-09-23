import React from 'react';
import { cn } from '@/lib/utils';

interface ModernSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  background?: 'transparent' | 'surface' | 'card';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

export const ModernSection: React.FC<ModernSectionProps> = ({
  children,
  className,
  id,
  background = 'transparent',
  padding = 'xl'
}) => {
  const backgroundClasses = {
    transparent: '',
    surface: 'bg-card/20',
    card: 'bg-card/40'
  };

  const paddingClasses = {
    sm: 'py-12',
    md: 'py-16', 
    lg: 'py-20',
    xl: 'py-24 md:py-32'
  };

  return (
    <section 
      id={id}
      className={cn(
        'w-full relative overflow-hidden',
        backgroundClasses[background],
        paddingClasses[padding],
        className
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl w-full">
        {children}
      </div>
    </section>
  );
};

export const ModernContainer: React.FC<{
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
      'w-full mx-auto',
      sizeClasses[size],
      className
    )}>
      {children}
    </div>
  );
};

export const ModernGrid: React.FC<{
  children: React.ReactNode;
  className?: string;
  cols?: {
    default?: number;
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
}> = ({
  children,
  className,
  cols = { default: 1, md: 2, lg: 3 }
}) => {
  const gridCols = cn(
    cols.default === 1 && 'grid-cols-1',
    cols.default === 2 && 'grid-cols-2',
    cols.default === 3 && 'grid-cols-3',
    cols.sm === 1 && 'sm:grid-cols-1',
    cols.sm === 2 && 'sm:grid-cols-2',
    cols.sm === 3 && 'sm:grid-cols-3',
    cols.md === 1 && 'md:grid-cols-1',
    cols.md === 2 && 'md:grid-cols-2',
    cols.md === 3 && 'md:grid-cols-3',
    cols.lg === 1 && 'lg:grid-cols-1',
    cols.lg === 2 && 'lg:grid-cols-2',
    cols.lg === 3 && 'lg:grid-cols-3',
    cols.lg === 4 && 'lg:grid-cols-4',
    cols.xl === 1 && 'xl:grid-cols-1',
    cols.xl === 2 && 'xl:grid-cols-2',
    cols.xl === 3 && 'xl:grid-cols-3',
    cols.xl === 4 && 'xl:grid-cols-4'
  );

  return (
    <div className={cn('grid gap-6 lg:gap-8 w-full', gridCols, className)}>
      {children}
    </div>
  );
};

export const ModernCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}> = ({
  children,
  className,
  hover = true
}) => {
  return (
    <div className={cn(
      'glass-card p-8 rounded-2xl border border-border/50',
      hover && 'hover:border-accent/30 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 hover:-translate-y-1',
      className
    )}>
      {children}
    </div>
  );
};