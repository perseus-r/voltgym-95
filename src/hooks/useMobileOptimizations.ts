import { useEffect, useState } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileOptimizations {
  isMobile: boolean;
  screenHeight: number;
  screenWidth: number;
  isKeyboardOpen: boolean;
  hasNotch: boolean;
  orientation: 'portrait' | 'landscape';
}

export function useMobileOptimizations(): MobileOptimizations {
  const isMobile = useIsMobile();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [initialHeight] = useState(window.innerHeight);

  useEffect(() => {
    if (!isMobile) return;

    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const currentWidth = window.innerWidth;
      
      setScreenHeight(currentHeight);
      setScreenWidth(currentWidth);
      
      // Detect keyboard open (iOS/Android)
      const heightDifference = initialHeight - currentHeight;
      setIsKeyboardOpen(heightDifference > 150);
    };

    const handleOrientationChange = () => {
      // Small delay to get accurate measurements after orientation change
      setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Set initial viewport meta tag for mobile
    if (isMobile) {
      const viewport = document.querySelector('meta[name="viewport"]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover'
        );
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [isMobile, initialHeight]);

  // Detect device with notch (approximate)
  const hasNotch = isMobile && (
    screenHeight > 800 || // iPhone X+ height indicators
    window.screen.height / window.screen.width > 2 || // Tall aspect ratio
    window.CSS?.supports?.('padding: env(safe-area-inset-top)')
  );

  const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';

  return {
    isMobile,
    screenHeight,
    screenWidth,
    isKeyboardOpen,
    hasNotch,
    orientation
  };
}