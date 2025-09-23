import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { cn } from '@/lib/utils';

interface NativeMobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
}

export const NativeMobileLayout: React.FC<NativeMobileLayoutProps> = ({ 
  children, 
  className, 
  enablePullToRefresh = false,
  onRefresh 
}) => {
  const isMobile = useIsMobile();
  const { screenHeight, isKeyboardOpen, hasNotch, orientation } = useMobileOptimizations();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [startY, setStartY] = useState(0);

  // Pull to refresh logic
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!enablePullToRefresh || !isMobile) return;
    setStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!enablePullToRefresh || !isMobile || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const distance = currentY - startY;
    
    // Only allow pull when at the top of the page
    if (window.scrollY === 0 && distance > 0) {
      setPullDistance(Math.min(distance, 80));
      if (distance > 10) {
        e.preventDefault();
      }
    }
  };

  const handleTouchEnd = async () => {
    if (!enablePullToRefresh || !isMobile) return;
    
    if (pullDistance > 60 && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
      }
    }
    setPullDistance(0);
    setStartY(0);
  };

  useEffect(() => {
    if (!isMobile) return;

    // Apply mobile-specific viewport optimizations
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      viewport.setAttribute('content', 
        'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
      );
    }

    // Add CSS for native feel
    document.body.style.setProperty('overscroll-behavior-y', 'none');
    document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');
    document.body.style.setProperty('touch-action', 'manipulation');

    // Status bar styling for different devices
    const statusBarColor = hasNotch ? '#0b1020' : '#111831';
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', statusBarColor);
    }

    return () => {
      document.body.style.removeProperty('overscroll-behavior-y');
      document.body.style.removeProperty('-webkit-overflow-scrolling');
      document.body.style.removeProperty('touch-action');
    };
  }, [isMobile, hasNotch]);

  if (!isMobile) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div 
      className={cn(
        "min-h-screen w-full relative overflow-x-hidden",
        "safe-area bg-gradient-to-br from-bg via-surface to-bg",
        orientation === 'landscape' && "landscape-mode",
        isKeyboardOpen && "keyboard-open",
        hasNotch && "has-notch",
        className
      )}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{
        minHeight: `${screenHeight}px`,
        paddingBottom: isKeyboardOpen ? '0px' : 'env(safe-area-inset-bottom, 20px)',
      }}
    >
      {/* Native status bar simulation */}
      <div className={cn(
        "fixed top-0 left-0 right-0 z-[100]",
        "h-[env(safe-area-inset-top,0px)] bg-bg/95 backdrop-blur-sm",
        hasNotch && "bg-gradient-to-b from-bg to-transparent"
      )} />

      {/* Pull to refresh indicator */}
      {enablePullToRefresh && (
        <div 
          className={cn(
            "fixed top-0 left-1/2 transform -translate-x-1/2 z-50",
            "transition-all duration-300 ease-out",
            pullDistance > 0 ? "opacity-100" : "opacity-0"
          )}
          style={{
            transform: `translateX(-50%) translateY(${Math.min(pullDistance - 20, 40)}px)`,
          }}
        >
          <div className="bg-card/90 backdrop-blur-xl rounded-full p-3 shadow-lg">
            <div 
              className={cn(
                "w-6 h-6 border-2 border-accent rounded-full",
                isRefreshing ? "animate-spin border-t-transparent" : "",
                pullDistance > 60 ? "scale-110" : "scale-100",
                "transition-transform duration-200"
              )}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className={cn(
        "relative z-10 pb-24", // Extra padding for tab bar
        isKeyboardOpen && "pb-4"
      )}>
        {children}
      </div>

      {/* Native-style bottom safe area */}
      <div className="fixed bottom-0 left-0 right-0 h-[env(safe-area-inset-bottom,0px)] bg-bg/50 backdrop-blur-sm z-40" />
    </div>
  );
};

// Native header component
interface NativeHeaderProps {
  title: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
  transparent?: boolean;
}

export const NativeHeader: React.FC<NativeHeaderProps> = ({
  title,
  leftAction,
  rightAction,
  className,
  transparent = false
}) => {
  const isMobile = useIsMobile();
  const { hasNotch } = useMobileOptimizations();

  if (!isMobile) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-40",
      "transition-all duration-300 ease-out",
      transparent ? "bg-transparent" : "bg-card/95 backdrop-blur-2xl border-b border-accent/10",
      hasNotch && "pt-[env(safe-area-inset-top)]",
      className
    )}>
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left action */}
        <div className="w-10 flex justify-start">
          {leftAction}
        </div>

        {/* Title */}
        <div className="flex-1 text-center">
          <h1 className="text-lg font-bold text-txt truncate px-2">
            {title}
          </h1>
        </div>

        {/* Right action */}
        <div className="w-10 flex justify-end">
          {rightAction}
        </div>
      </div>
    </div>
  );
};

// Native card component optimized for mobile
interface NativeCardProps {
  children: React.ReactNode;
  className?: string;
  padding?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onPress?: () => void;
}

export const NativeCard: React.FC<NativeCardProps> = ({
  children,
  className,
  padding = 'md',
  interactive = false,
  onPress
}) => {
  const isMobile = useIsMobile();

  const paddingClasses = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6'
  };

  return (
    <div 
      className={cn(
        "bg-card/90 backdrop-blur-xl border border-accent/10 rounded-2xl",
        "shadow-lg shadow-black/20 transition-all duration-300 ease-out",
        paddingClasses[padding],
        interactive && [
          "touch-manipulation active:scale-[0.98] active:bg-card/95",
          "hover:shadow-xl hover:shadow-black/30 hover:-translate-y-1"
        ],
        isMobile && "mx-2 mb-4",
        className
      )}
      onClick={interactive ? onPress : undefined}
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
    >
      {children}
    </div>
  );
};