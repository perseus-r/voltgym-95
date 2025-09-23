import React from 'react';
import { Card } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileOptimizedCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'small' | 'medium' | 'large';
}

export const MobileOptimizedCard: React.FC<MobileOptimizedCardProps> = ({ 
  children, 
  className, 
  padding = 'medium' 
}) => {
  const isMobile = useIsMobile();
  
  const paddingClasses = {
    small: isMobile ? 'p-3' : 'p-4',
    medium: isMobile ? 'p-4' : 'p-6',
    large: isMobile ? 'p-6' : 'p-8'
  };

  return (
    <Card className={cn(
      'glass-card',
      paddingClasses[padding],
      className
    )}>
      {children}
    </Card>
  );
};

interface MobileTextProps {
  children: React.ReactNode;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
}

export const MobileText: React.FC<MobileTextProps> = ({ 
  children, 
  size = 'base', 
  className 
}) => {
  const isMobile = useIsMobile();
  
  const sizeClasses = {
    xs: isMobile ? 'text-xs' : 'text-sm',
    sm: isMobile ? 'text-sm' : 'text-base',
    base: isMobile ? 'text-base' : 'text-lg',
    lg: isMobile ? 'text-lg' : 'text-xl',
    xl: isMobile ? 'text-xl' : 'text-2xl',
    '2xl': isMobile ? 'text-xl' : 'text-3xl',
    '3xl': isMobile ? 'text-2xl' : 'text-4xl'
  };

  return (
    <span className={cn(sizeClasses[size], className)}>
      {children}
    </span>
  );
};