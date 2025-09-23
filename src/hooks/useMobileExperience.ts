import { useState, useEffect } from 'react';
import { useIsMobile } from './use-mobile';

interface MobileExperience {
  isMobile: boolean;
  isTouch: boolean;
  hasHover: boolean;
  screenHeight: number;
  screenWidth: number;
  orientation: 'portrait' | 'landscape';
  isKeyboardOpen: boolean;
  devicePixelRatio: number;
  safeAreaTop: number;
  safeAreaBottom: number;
  isStandalone: boolean;
  canInstall: boolean;
}

export const useMobileExperience = (): MobileExperience => {
  const isMobile = useIsMobile();
  const [screenHeight, setScreenHeight] = useState(window.innerHeight);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [initialHeight] = useState(window.innerHeight);

  useEffect(() => {
    const updateScreenInfo = () => {
      setScreenHeight(window.innerHeight);
      setScreenWidth(window.innerWidth);
      
      // Detecta se o teclado está aberto no mobile
      if (isMobile) {
        const heightDiff = initialHeight - window.innerHeight;
        setIsKeyboardOpen(heightDiff > 150); // Assume keyboard se altura diminuiu mais de 150px
      }
    };

    const handleOrientationChange = () => {
      // Aguarda um pouco para o browser ajustar as dimensões
      setTimeout(updateScreenInfo, 100);
    };

    window.addEventListener('resize', updateScreenInfo, { passive: true });
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true });

    // CSS para otimizar scrolling no mobile
    if (isMobile) {
      document.body.style.setProperty('-webkit-overflow-scrolling', 'touch');
      document.body.style.setProperty('overscroll-behavior', 'none');
      
      // Previne zoom ao dar double-tap
      document.addEventListener('dblclick', (e) => e.preventDefault(), { passive: false });
    }

    return () => {
      window.removeEventListener('resize', updateScreenInfo);
      window.removeEventListener('orientationchange', handleOrientationChange);
      
      if (isMobile) {
        document.body.style.removeProperty('-webkit-overflow-scrolling');
        document.body.style.removeProperty('overscroll-behavior');
      }
    };
  }, [isMobile, initialHeight]);

  // Detecta capacidades do dispositivo
  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasHover = window.matchMedia('(hover: hover)').matches;
  const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';
  const devicePixelRatio = window.devicePixelRatio || 1;
  
  // Detecta safe areas (para dispositivos com notch)
  const safeAreaTop = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('env(safe-area-inset-top)').replace('px', '')) || 0;
  const safeAreaBottom = parseInt(getComputedStyle(document.documentElement)
    .getPropertyValue('env(safe-area-inset-bottom)').replace('px', '')) || 0;
    
  // Detecta se é PWA standalone
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || 
                      (window.navigator as any).standalone === true;

  // Detecta se pode instalar como PWA
  const canInstall = 'serviceWorker' in navigator && 'BeforeInstallPromptEvent' in window;

  return {
    isMobile,
    isTouch,
    hasHover,
    screenHeight,
    screenWidth,
    orientation,
    isKeyboardOpen,
    devicePixelRatio,
    safeAreaTop,
    safeAreaBottom,
    isStandalone,
    canInstall
  };
};