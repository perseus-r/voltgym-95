import React from 'react';
import { cn } from '@/lib/utils';

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md', 
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
  full: 'max-w-full'
};

const paddingClasses = {
  none: '',
  sm: 'px-4',
  md: 'px-4 sm:px-6',
  lg: 'px-4 sm:px-6 lg:px-8'
};

export const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className,
  maxWidth = '7xl',
  padding = 'lg'
}) => {
  return (
    <div 
      className={cn(
        'w-full mx-auto overflow-x-hidden',
        maxWidthClasses[maxWidth],
        paddingClasses[padding],
        className
      )}
    >
      {children}
    </div>
  );
};

export const ResponsiveSection: React.FC<{
  children: React.ReactNode;
  className?: string;
  background?: 'transparent' | 'surface' | 'card';
}> = ({
  children,
  className,
  background = 'transparent'
}) => {
  const backgroundClasses = {
    transparent: '',
    surface: 'bg-surface',
    card: 'bg-card'
  };

  return (
    <section 
      className={cn(
        'w-full overflow-hidden relative',
        backgroundClasses[background],
        className
      )}
    >
      {children}
    </section>
  );
};

export const ResponsiveGrid: React.FC<{
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
    cols.xl === 4 && 'xl:grid-cols-4',
    cols.xl === 5 && 'xl:grid-cols-5'
  );

  return (
    <div className={cn('grid gap-4 sm:gap-6 lg:gap-8 w-full', gridCols, className)}>
      {children}
    </div>
  );
};