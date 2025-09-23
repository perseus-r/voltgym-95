import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home, 
  Dumbbell, 
  TrendingUp, 
  Brain, 
  User,
  Zap
} from 'lucide-react';
import { useMobileExperience } from '@/hooks/useMobileExperience';
import { cn } from '@/lib/utils';

// ==================== REVOLUT-STYLE MOBILE NAVIGATION ====================

interface TabItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

const navigationItems: TabItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Treinos', href: '/treinos', icon: Dumbbell },
  { name: 'Progresso', href: '/progresso', icon: TrendingUp },
  { name: 'IA Coach', href: '/ia-coach', icon: Brain },
  { name: 'Perfil', href: '/perfil', icon: User }
];

// Premium Tab Bar - iOS inspired with Revolut polish
export function PremiumMobileNav() {
  const location = useLocation();
  const { isMobile, safeAreaBottom } = useMobileExperience();
  const [activeTab, setActiveTab] = useState(location.pathname);

  if (!isMobile) return null;

  return (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50",
        "bg-surface/80 backdrop-blur-[24px]",
        "border-t border-glass-border",
        "px-2"
      )}
      style={{
        paddingBottom: Math.max(safeAreaBottom, 8) + 'px',
        willChange: 'transform',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Gradient overlay for premium effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-surface/90 to-surface/70 pointer-events-none" />
      
      {/* Tab buttons */}
      <div className="relative flex items-center justify-around py-2">
        {navigationItems.map((item, index) => (
          <TabButton
            key={item.href}
            item={item}
            isActive={location.pathname === item.href}
            index={index}
          />
        ))}
      </div>

      {/* Active indicator */}
      <ActiveIndicator activeTab={location.pathname} />
    </motion.nav>
  );
}

interface TabButtonProps {
  item: TabItem;
  isActive: boolean;
  index: number;
}

function TabButton({ item, isActive, index }: TabButtonProps) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      className={({ isActive }) => cn(
        "relative flex flex-col items-center justify-center",
        "p-3 rounded-xl transition-all duration-200",
        "touch-manipulation select-none",
        "min-w-[60px] min-h-[60px]",
        isActive 
          ? "text-accent" 
          : "text-txt-3 hover:text-txt-2"
      )}
    >
      {({ isActive }) => (
        <>
          {/* Icon container with bounce animation */}
          <motion.div
            className="relative"
            animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
            transition={{ 
              duration: 0.3, 
              ease: [0.175, 0.885, 0.32, 1.275],
              delay: index * 0.05 
            }}
          >
            {/* Glow effect for active tab */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="absolute inset-0 bg-accent/20 rounded-full blur-md"
                  style={{ willChange: 'transform, opacity' }}
                />
              )}
            </AnimatePresence>

            {/* Icon */}
            <Icon 
              size={22} 
              className={cn(
                "relative z-10 transition-all duration-200",
                isActive && "drop-shadow-[0_0_8px_rgba(46,204,113,0.6)]"
              )}
            />

            {/* Badge */}
            {item.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-error text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
              >
                {item.badge}
              </motion.div>
            )}
          </motion.div>

          {/* Label with fade animation */}
          <motion.span
            className={cn(
              "text-xs font-medium mt-1 transition-all duration-200",
              isActive 
                ? "text-accent font-semibold" 
                : "text-txt-3"
            )}
            animate={isActive ? { opacity: 1, y: 0 } : { opacity: 0.7, y: 2 }}
            transition={{ duration: 0.2 }}
          >
            {item.name}
          </motion.span>

          {/* Haptic feedback simulation */}
          <motion.div
            className="absolute inset-0 rounded-xl"
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
          />
        </>
      )}
    </NavLink>
  );
}

function ActiveIndicator({ activeTab }: { activeTab: string }) {
  const activeIndex = navigationItems.findIndex(item => item.href === activeTab);
  
  if (activeIndex === -1) return null;

  return (
    <motion.div
      className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-accent to-transparent"
      initial={{ scaleX: 0, opacity: 0 }}
      animate={{ 
        scaleX: 1, 
        opacity: 1,
        x: `${activeIndex * 20}%`
      }}
      transition={{ 
        duration: 0.4, 
        ease: [0.4, 0, 0.2, 1] 
      }}
      style={{
        transformOrigin: 'center',
        willChange: 'transform, opacity'
      }}
    />
  );
}

// ==================== PREMIUM HEADER ====================

interface PremiumHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  className?: string;
}

export function PremiumHeader({ 
  title, 
  subtitle, 
  showBack = false, 
  actions,
  className 
}: PremiumHeaderProps) {
  const { isMobile, safeAreaTop } = useMobileExperience();
  const [isScrolled, setIsScrolled] = useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.header
      className={cn(
        "sticky top-0 z-40 w-full",
        "transition-all duration-300 ease-out",
        isScrolled
          ? "bg-surface/80 backdrop-blur-[24px] border-b border-glass-border shadow-lg"
          : "bg-transparent",
        className
      )}
      style={{
        paddingTop: isMobile ? Math.max(safeAreaTop, 8) + 'px' : '0px',
        willChange: 'background-color, backdrop-filter'
      }}
      animate={isScrolled ? { y: 0 } : { y: 0 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between py-4">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            {showBack && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-xl bg-glass-bg border border-glass-border"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
            )}
            
            <div>
              <motion.h1
                className={cn(
                  "font-bold transition-all duration-300",
                  isScrolled ? "text-lg" : "text-xl"
                )}
                animate={isScrolled ? { scale: 0.95 } : { scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {title}
              </motion.h1>
              
              {subtitle && !isScrolled && (
                <motion.p
                  className="text-sm text-txt-2"
                  initial={{ opacity: 1, y: 0 }}
                  animate={isScrolled ? { opacity: 0, y: -10 } : { opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {subtitle}
                </motion.p>
              )}
            </div>
          </div>

          {/* Right side actions */}
          {actions && (
            <motion.div
              className="flex items-center space-x-2"
              animate={isScrolled ? { scale: 0.9 } : { scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {actions}
            </motion.div>
          )}
        </div>
      </div>

      {/* Energy particles background for premium effect */}
      <AnimatePresence>
        {!isScrolled && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 overflow-hidden pointer-events-none"
          >
            <EnergyParticles />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

// Subtle energy particles for premium effect
function EnergyParticles() {
  return (
    <div className="absolute inset-0">
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-accent/30 rounded-full"
          initial={{ 
            x: Math.random() * 100 + '%',
            y: '100%',
            opacity: 0
          }}
          animate={{ 
            y: '-10%',
            opacity: [0, 1, 0],
            x: Math.random() * 100 + '%'
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
}

export default PremiumMobileNav;