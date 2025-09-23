import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileFullLayoutProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export function MobileFullLayout({ 
  children, 
  className, 
  noPadding = false 
}: MobileFullLayoutProps) {
  const isMobile = useIsMobile();

  if (!isMobile) {
    return (
      <div className={cn("w-full min-h-screen px-8 py-6", className)}>
        {children}
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "w-full min-h-[100dvh] mobile-optimized",
        !noPadding && "px-3 py-2",
        className
      )}
      style={{
        // Use native safe areas without extra padding
        paddingTop: noPadding ? 'env(safe-area-inset-top)' : 'calc(env(safe-area-inset-top) + 0.5rem)',
        paddingBottom: noPadding ? 'env(safe-area-inset-bottom)' : 'calc(env(safe-area-inset-bottom) + 0.5rem)',
        paddingLeft: noPadding ? 'env(safe-area-inset-left)' : 'calc(env(safe-area-inset-left) + 0.75rem)',
        paddingRight: noPadding ? 'env(safe-area-inset-right)' : 'calc(env(safe-area-inset-right) + 0.75rem)',
      }}
    >
      {children}
    </div>
  );
}

interface MobileGridOptimizedProps {
  children: React.ReactNode;
  className?: string;
  columns?: 1 | 2 | 3 | 4;
}

export function MobileGridOptimized({ 
  children, 
  className, 
  columns = 2 
}: MobileGridOptimizedProps) {
  const isMobile = useIsMobile();
  
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4'
  };
  
  const mobileGridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-2',
    4: 'grid-cols-2'
  };

  return (
    <div 
      className={cn(
        "grid gap-3",
        isMobile ? mobileGridCols[columns] : `${gridCols[columns]} lg:${gridCols[Math.min(columns + 1, 4) as 1 | 2 | 3 | 4]}`,
        className
      )}
    >
      {children}
    </div>
  );
}

interface MobileCardOptimizedProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
}

export function MobileCardOptimized({ 
  children, 
  className, 
  padding = 'md' 
}: MobileCardOptimizedProps) {
  const isMobile = useIsMobile();
  
  const paddingClasses = {
    sm: isMobile ? 'p-3' : 'p-4',
    md: isMobile ? 'p-4' : 'p-6', 
    lg: isMobile ? 'p-5' : 'p-8'
  };

  return (
    <div className={cn(
      'liquid-glass border border-line/20 rounded-xl',
      paddingClasses[padding],
      isMobile && 'card-mobile',
      className
    )}>
      {children}
    </div>
  );
}