import React, { useEffect, useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { cn } from '@/lib/utils';

// Native status bar component
export const NativeStatusBar: React.FC = () => {
  const isMobile = useIsMobile();
  const { hasNotch } = useMobileOptimizations();
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    if (!isMobile || !('getBattery' in navigator)) return;

    // Battery API (experimental)
    const getBatteryInfo = async () => {
      try {
        const battery = await (navigator as any).getBattery();
        setBatteryLevel(Math.round(battery.level * 100));
        setIsCharging(battery.charging);
        
        battery.addEventListener('levelchange', () => {
          setBatteryLevel(Math.round(battery.level * 100));
        });
        
        battery.addEventListener('chargingchange', () => {
          setIsCharging(battery.charging);
        });
      } catch (error) {
        // Silently fail if Battery API is not supported
      }
    };

    getBatteryInfo();
  }, [isMobile]);

  if (!isMobile) return null;

  return (
    <div className={cn(
      "fixed top-0 left-0 right-0 z-[200] pointer-events-none",
      "flex items-center justify-between px-6 py-1",
      "text-white text-sm font-medium",
      hasNotch ? "h-[env(safe-area-inset-top,44px)]" : "h-6",
      "bg-gradient-to-b from-black/60 to-transparent"
    )}>
      {/* Time */}
      <div className="font-mono text-xs">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>

      {/* Status indicators */}
      <div className="flex items-center space-x-1 text-xs">
        {/* Signal strength bars */}
        <div className="flex items-end space-x-0.5">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={cn(
                "w-0.5 bg-white rounded-full",
                bar <= 3 ? "opacity-100" : "opacity-50"
              )}
              style={{ height: `${2 + bar * 1}px` }}
            />
          ))}
        </div>

        {/* WiFi icon */}
        <div className="w-3 h-3 relative">
          <div className="absolute inset-0 border border-white rounded-full opacity-75" />
          <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full" />
        </div>

        {/* Battery */}
        {batteryLevel !== null && (
          <div className="flex items-center space-x-1">
            <div className="relative w-6 h-3 border border-white rounded-sm">
              <div
                className={cn(
                  "absolute top-0.5 left-0.5 bottom-0.5 rounded-sm transition-all duration-300",
                  batteryLevel > 20 ? "bg-white" : "bg-red-400",
                  isCharging && "animate-pulse"
                )}
                style={{ width: `${(batteryLevel / 100) * 16}px` }}
              />
              <div className="absolute -right-0.5 top-1 bottom-1 w-0.5 bg-white rounded-r" />
            </div>
            <span className="text-[10px]">{batteryLevel}%</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Native screen edge swipe detector
interface EdgeSwipeDetectorProps {
  onLeftSwipe?: () => void;
  onRightSwipe?: () => void;
  children: React.ReactNode;
}

export const EdgeSwipeDetector: React.FC<EdgeSwipeDetectorProps> = ({
  onLeftSwipe,
  onRightSwipe,
  children
}) => {
  const isMobile = useIsMobile();
  const [startX, setStartX] = useState<number>(0);
  const [startY, setStartY] = useState<number>(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.touches[0];
    setStartX(touch.clientX);
    setStartY(touch.clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isMobile) return;
    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    
    // Check if it's a horizontal swipe (more horizontal than vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      // Check if swipe started from edge
      if (startX < 30 && deltaX > 100 && onRightSwipe) {
        onRightSwipe();
      } else if (startX > window.innerWidth - 30 && deltaX < -100 && onLeftSwipe) {
        onLeftSwipe();
      }
    }
  };

  if (!isMobile) return <>{children}</>;

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full"
    >
      {children}
    </div>
  );
};

// Native app-like loading screen
interface NativeLoadingScreenProps {
  isLoading: boolean;
  title?: string;
  subtitle?: string;
}

export const NativeLoadingScreen: React.FC<NativeLoadingScreenProps> = ({
  isLoading,
  title = "VOLT",
  subtitle = "Carregando sua experiência..."
}) => {
  const isMobile = useIsMobile();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + Math.random() * 15;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [isLoading]);

  useEffect(() => {
    if (!isLoading) setProgress(0);
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div className={cn(
      "fixed inset-0 z-[300] flex flex-col items-center justify-center",
      "bg-gradient-to-br from-bg via-surface to-bg",
      isMobile && "safe-area"
    )}>
      <NativeStatusBar />
      
      {/* App icon */}
      <div className="w-24 h-24 mb-8 bg-gradient-to-br from-accent to-accent-2 rounded-3xl flex items-center justify-center shadow-2xl shadow-accent/30 animate-pulse">
        <span className="text-3xl font-black text-accent-ink">V</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-black text-txt mb-2 tracking-tight">
        {title}
      </h1>
      
      {/* Subtitle */}
      <p className="text-txt-2 mb-12 text-center px-8">
        {subtitle}
      </p>

      {/* Progress indicator */}
      <div className="w-64 mb-4">
        <div className="w-full h-1 bg-card rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-accent to-accent-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>
      
      <span className="text-xs text-txt-3 font-mono">
        {Math.round(Math.min(progress, 100))}%
      </span>

      {/* Loading dots */}
      <div className="flex space-x-1 mt-8">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 bg-accent rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.1}s` }}
          />
        ))}
      </div>
    </div>
  );
};

// Native keyboard spacer
export const KeyboardSpacer: React.FC = () => {
  const isMobile = useIsMobile();
  const { isKeyboardOpen } = useMobileOptimizations();

  if (!isMobile || !isKeyboardOpen) return null;

  return <div className="h-80" />; // Space to prevent content from being hidden
};

// Native safe area wrapper
interface SafeAreaWrapperProps {
  children: React.ReactNode;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
  className?: string;
}

export const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({
  children,
  edges = ['top', 'bottom', 'left', 'right'],
  className
}) => {
  const isMobile = useIsMobile();

  if (!isMobile) return <div className={className}>{children}</div>;

  const edgeClasses = {
    top: 'pt-[env(safe-area-inset-top)]',
    bottom: 'pb-[env(safe-area-inset-bottom)]',
    left: 'pl-[env(safe-area-inset-left)]',
    right: 'pr-[env(safe-area-inset-right)]'
  };

  const appliedEdges = edges.map(edge => edgeClasses[edge]).join(' ');

  return (
    <div className={cn(appliedEdges, className)}>
      {children}
    </div>
  );
};

// Native momentum scrolling container
interface MomentumScrollProps {
  children: React.ReactNode;
  className?: string;
  horizontal?: boolean;
}

export const MomentumScroll: React.FC<MomentumScrollProps> = ({
  children,
  className,
  horizontal = false
}) => {
  const isMobile = useIsMobile();

  return (
    <div 
      className={cn(
        "scroll-smooth",
        horizontal ? "overflow-x-auto overflow-y-hidden" : "overflow-y-auto overflow-x-hidden",
        isMobile && [
          "-webkit-overflow-scrolling: touch",
          "overscroll-behavior: contain",
          "scrollbar-width: none",
          "ms-overflow-style: none"
        ],
        className
      )}
      style={{
        WebkitOverflowScrolling: 'touch',
        overscrollBehavior: 'contain'
      }}
    >
      {children}
    </div>
  );
};