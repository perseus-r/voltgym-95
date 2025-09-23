import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMobileExperience } from '@/hooks/useMobileExperience';
import { TabBar } from './TabBar';
import { cn } from '@/lib/utils';
import { ChevronUp, Wifi, Battery, Signal } from 'lucide-react';

interface EnhancedMobileLayoutProps {
  children: React.ReactNode;
  enablePullToRefresh?: boolean;
  onRefresh?: () => Promise<void>;
}

export const EnhancedMobileLayout: React.FC<EnhancedMobileLayoutProps> = ({
  children,
  enablePullToRefresh = true,
  onRefresh
}) => {
  const { isMobile, screenHeight, isKeyboardOpen, safeAreaTop, safeAreaBottom, isStandalone } = useMobileExperience();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Estados de interação
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // Pull to refresh
  const [startY, setStartY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);

  // Scroll tracking para mostrar/esconder botão "voltar ao topo"
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollTop(currentScrollY > 200);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Pull to refresh handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!enablePullToRefresh || !isMobile || window.scrollY > 0) return;
    setStartY(e.touches[0].clientY);
    setIsPulling(true);
  }, [enablePullToRefresh, isMobile]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || !enablePullToRefresh || !isMobile || isRefreshing) return;
    
    const currentY = e.touches[0].clientY;
    const distance = Math.max(0, currentY - startY);
    
    if (window.scrollY === 0 && distance > 0) {
      setPullDistance(Math.min(distance * 0.4, 80)); // Damping effect
      if (distance > 20) {
        e.preventDefault();
      }
    }
  }, [isPulling, enablePullToRefresh, isMobile, isRefreshing, startY]);

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling || !enablePullToRefresh) return;
    
    setIsPulling(false);
    
    if (pullDistance > 60 && onRefresh) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Error refreshing:', error);
      } finally {
        setIsRefreshing(false);
      }
    }
    
    setPullDistance(0);
    setStartY(0);
  }, [isPulling, enablePullToRefresh, pullDistance, onRefresh]);

  // Scroll to top com animação suave
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animações de transição entre páginas
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
      scale: 0.98
    },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1
    },
    exit: {
      opacity: 0,
      y: -10,
      scale: 1.02
    }
  };

  if (!isMobile) {
    return <div>{children}</div>;
  }

  return (
    <div 
      className={cn(
        "min-h-screen w-full relative overflow-x-hidden",
        "bg-gradient-to-br from-bg via-surface to-bg",
        "touch-manipulation overscroll-none",
        isStandalone && "standalone-app",
        isKeyboardOpen && "keyboard-open"
      )}
      style={{
        minHeight: `${screenHeight}px`,
        paddingTop: safeAreaTop,
        paddingBottom: safeAreaBottom
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Status Bar Simulado para PWA */}
      {isStandalone && (
        <div className="fixed top-0 left-0 right-0 h-6 bg-bg/95 backdrop-blur-sm z-50 flex items-center justify-between px-4 text-xs text-txt-2">
          <div className="flex items-center gap-1">
            <span>9:41</span>
          </div>
          <div className="flex items-center gap-1">
            <Signal className="w-3 h-3" />
            <Wifi className="w-3 h-3" />
            <Battery className="w-3 h-3" />
          </div>
        </div>
      )}

      {/* Pull to Refresh Indicator */}
      <AnimatePresence>
        {enablePullToRefresh && pullDistance > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-16 left-1/2 transform -translate-x-1/2 z-40"
            style={{
              transform: `translateX(-50%) translateY(${pullDistance - 40}px)`
            }}
          >
            <div className="bg-card/90 backdrop-blur-xl rounded-full p-3 shadow-lg border border-accent/20">
              <motion.div
                animate={{
                  rotate: isRefreshing ? 360 : pullDistance > 60 ? 180 : 0,
                  scale: pullDistance > 60 ? 1.1 : 1
                }}
                transition={{
                  rotate: { duration: isRefreshing ? 1 : 0.3, repeat: isRefreshing ? Infinity : 0, ease: 'linear' },
                  scale: { duration: 0.2 }
                }}
                className="text-accent"
              >
                <ChevronUp className="w-5 h-5" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Conteúdo Principal com Transições */}
      <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{
              duration: 0.3,
              ease: "easeOut"
            }}
            className={cn(
              "relative z-10 pb-24", // Espaço para TabBar
              isKeyboardOpen && "pb-4"
            )}
          >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
            className={cn(
              "fixed bottom-32 right-4 z-30",
              "w-12 h-12 bg-accent/90 backdrop-blur-xl rounded-full",
              "flex items-center justify-center text-accent-ink",
              "shadow-lg shadow-accent/25 border border-accent/20",
              "transition-all duration-300"
            )}
          >
            <ChevronUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Enhanced TabBar */}
      <TabBar />

      {/* Bottom Safe Area */}
      <div 
        className="fixed bottom-0 left-0 right-0 bg-bg/50 backdrop-blur-sm z-20"
        style={{ height: safeAreaBottom }}
      />
    </div>
  );
};

// Hook para animações de página específicas
export const usePageAnimations = () => {
  const location = useLocation();
  const [isChanging, setIsChanging] = useState(false);

  useEffect(() => {
    setIsChanging(true);
    const timer = setTimeout(() => setIsChanging(false), 300);
    return () => clearTimeout(timer);
  }, [location.pathname]);

  return { isChanging };
};

// Componente para cards otimizados mobile
export const MobileCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  onPress?: () => void;
}> = ({ children, className, interactive = false, onPress }) => {
  return (
    <motion.div
      whileHover={interactive ? { scale: 1.02, y: -2 } : {}}
      whileTap={interactive ? { scale: 0.98 } : {}}
      transition={{ duration: 0.2 }}
      onClick={interactive ? onPress : undefined}
      className={cn(
        "bg-card/90 backdrop-blur-xl border border-accent/10",
        "rounded-2xl p-4 mx-4 mb-4 shadow-lg shadow-black/10",
        "transition-all duration-300 ease-out",
        interactive && "touch-manipulation cursor-pointer active:bg-card/95",
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default EnhancedMobileLayout;