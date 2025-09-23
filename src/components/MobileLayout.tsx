import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({ children, className }) => {
  const isMobile = useIsMobile();

  return (
    <div 
      className={cn(
        "w-full min-h-[100dvh]",
        isMobile && "px-4 py-2",
        !isMobile && "px-8 py-6",
        className
      )}
      style={{
        // Safe area handling for iOS/Android — use only native insets, avoid extra gaps
        paddingTop: isMobile ? 'env(safe-area-inset-top)' : undefined,
        paddingBottom: isMobile ? 'env(safe-area-inset-bottom)' : undefined,
        paddingLeft: isMobile ? 'env(safe-area-inset-left)' : undefined,
        paddingRight: isMobile ? 'env(safe-area-inset-right)' : undefined,
      }}
    >
      {children}
    </div>
  );
};

interface MobileGridProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileGrid: React.FC<MobileGridProps> = ({ children, className }) => {
  const isMobile = useIsMobile();

  return (
    <div 
      className={cn(
        "grid gap-4",
        isMobile ? "grid-cols-1" : "grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {children}
    </div>
  );
};

interface MobileStackProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileStack: React.FC<MobileStackProps> = ({ children, className }) => {
  const isMobile = useIsMobile();

  return (
    <div 
      className={cn(
        "flex",
        isMobile ? "flex-col space-y-3" : "flex-row space-x-4",
        className
      )}
    >
      {children}
    </div>
  );
};