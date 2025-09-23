import React, { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface MobileOptimizationsProps {
  children: React.ReactNode;
}

export const MobileOptimizations: React.FC<MobileOptimizationsProps> = ({ children }) => {
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      // Disable zoom on mobile
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        );
      }

      // Disable text selection for better touch experience
      document.body.style.userSelect = 'none';
      document.body.style.webkitUserSelect = 'none';
      
      // Reduce bounce scrolling without blocking page scroll
      (document.body.style as any).overscrollBehaviorY = 'none';
      (document.documentElement.style as any).overscrollBehaviorY = 'none';
      
      // Optimize for mobile performance
      (document.body.style as any).webkitTapHighlightColor = 'transparent';
      (document.body.style as any).webkitTouchCallout = 'none';
      
      // Set CSS custom properties for mobile
      document.documentElement.style.setProperty('--mobile-safe-area-top', 'env(safe-area-inset-top)');
      document.documentElement.style.setProperty('--mobile-safe-area-bottom', 'env(safe-area-inset-bottom)');
      document.documentElement.style.setProperty('--mobile-safe-area-left', 'env(safe-area-inset-left)');
      document.documentElement.style.setProperty('--mobile-safe-area-right', 'env(safe-area-inset-right)');
      
      return () => {
        // Cleanup on unmount
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
        (document.body.style as any).overscrollBehaviorY = '';
        (document.documentElement.style as any).overscrollBehaviorY = '';
      };
    }
  }, [isMobile]);

  return (
    <div 
      className={`w-full ${isMobile ? 'min-h-[100dvh] mobile-optimized' : 'min-h-screen'}`}
    >
      {children}
    </div>
  );
};