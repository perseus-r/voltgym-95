import { useEffect } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

// Haptic feedback types
export enum HapticType {
  Light = 'light',
  Medium = 'medium', 
  Heavy = 'heavy',
  Success = 'success',
  Warning = 'warning',
  Error = 'error',
  Selection = 'selection'
}

class HapticManager {
  private static instance: HapticManager;
  private isSupported: boolean = false;

  constructor() {
    this.checkSupport();
  }

  static getInstance(): HapticManager {
    if (!HapticManager.instance) {
      HapticManager.instance = new HapticManager();
    }
    return HapticManager.instance;
  }

  private checkSupport(): void {
    // Check for Vibration API support
    this.isSupported = 'vibrate' in navigator || 'mozVibrate' in navigator;
    
    // Enhanced check for modern devices
    if ('hapticEngines' in navigator || 'vibrate' in navigator) {
      this.isSupported = true;
    }
  }

  public trigger(type: HapticType): void {
    if (!this.isSupported) return;

    try {
      // Try modern Haptic API first (if available)
      if ('vibrate' in navigator) {
        const patterns = this.getVibrationPattern(type);
        navigator.vibrate(patterns);
      }
    } catch (error) {
      console.warn('Haptic feedback not available:', error);
    }
  }

  private getVibrationPattern(type: HapticType): number | number[] {
    switch (type) {
      case HapticType.Light:
        return 10;
      case HapticType.Medium:
        return 20;
      case HapticType.Heavy:
        return [30, 10, 30];
      case HapticType.Success:
        return [50, 50, 100];
      case HapticType.Warning:
        return [100, 100, 100];
      case HapticType.Error:
        return [200, 100, 200, 100, 200];
      case HapticType.Selection:
        return 5;
      default:
        return 10;
    }
  }
}

// Hook for haptic feedback
export const useHaptic = () => {
  const isMobile = useIsMobile();
  const hapticManager = HapticManager.getInstance();

  const trigger = (type: HapticType) => {
    if (isMobile) {
      hapticManager.trigger(type);
    }
  };

  return { trigger };
};

// Higher-order component for adding haptic feedback to buttons
interface WithHapticsProps {
  hapticType?: HapticType;
  onPress?: () => void;
}

export const withHaptics = <P extends object>(
  Component: React.ComponentType<P>,
  defaultHapticType: HapticType = HapticType.Light
) => {
  return (props: P & WithHapticsProps) => {
    const { hapticType = defaultHapticType, onPress, ...rest } = props;
    const { trigger } = useHaptic();

    const handlePress = () => {
      trigger(hapticType);
      onPress?.();
    };

    return <Component {...(rest as P)} onPress={handlePress} />;
  };
};

// Native button with built-in haptics
interface HapticButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  hapticType?: HapticType;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
}

export const HapticButton: React.FC<HapticButtonProps> = ({
  children,
  onPress,
  hapticType = HapticType.Light,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = ''
}) => {
  const { trigger } = useHaptic();
  const isMobile = useIsMobile();

  const handlePress = () => {
    if (!disabled) {
      trigger(hapticType);
      onPress?.();
    }
  };

  const variantClasses = {
    primary: 'bg-gradient-to-r from-accent to-accent-2 text-accent-ink shadow-lg shadow-accent/30',
    secondary: 'bg-card/90 text-txt border border-accent/20 hover:border-accent/40',
    ghost: 'bg-transparent text-txt-2 hover:bg-card/50'
  };

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm min-h-[40px]',
    md: 'px-6 py-3 text-base min-h-[48px]',
    lg: 'px-8 py-4 text-lg min-h-[56px]'
  };

  return (
    <button
      onClick={handlePress}
      disabled={disabled}
      className={`
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isMobile ? 'touch-manipulation' : ''}
        rounded-2xl font-semibold transition-all duration-200 ease-out
        active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      {children}
    </button>
  );
};

// Haptic feedback component for page transitions
export const PageTransitionHaptic: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { trigger } = useHaptic();
  
  useEffect(() => {
    // Trigger light haptic on page load
    trigger(HapticType.Light);
  }, [trigger]);

  return <>{children}</>;
};