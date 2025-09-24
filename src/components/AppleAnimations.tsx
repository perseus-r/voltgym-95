import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';

// Hook para animações Apple-style
export const useAppleSpring = (initialValue = 0) => {
  const motionValue = useMotionValue(initialValue);
  const spring = useSpring(motionValue, {
    stiffness: 300,
    damping: 30,
    mass: 0.8,
  });
  return { motionValue, spring };
};

// Componente de transição suave Apple-style
export const ApplePageTransition: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.98 }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};

// Botão Apple-style com haptic feedback visual
export const AppleButton: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'glass';
  className?: string;
  disabled?: boolean;
}> = ({ children, onClick, variant = 'primary', className = '', disabled = false }) => {
  const [isPressed, setIsPressed] = useState(false);
  
  const baseClasses = {
    primary: 'bg-gradient-to-b from-accent/90 to-accent text-white shadow-lg shadow-accent/25',
    secondary: 'bg-gradient-to-b from-surface/80 to-surface text-txt border border-line/30',
    glass: 'bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl text-white border border-white/20'
  };

  return (
    <motion.button
      className={`
        relative overflow-hidden rounded-xl px-6 py-3 font-medium
        transition-all duration-200 ease-out
        ${baseClasses[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={!disabled ? { scale: 1.02, y: -1 } : {}}
      whileTap={!disabled ? { scale: 0.98, y: 0 } : {}}
      onTapStart={() => setIsPressed(true)}
      onTapCancel={() => setIsPressed(false)}
      onClick={!disabled ? onClick : undefined}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
    >
      {/* Shine effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
        initial={{ x: '-100%' }}
        animate={isPressed ? { x: '100%' } : { x: '-100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Content */}
      <span className="relative z-10">{children}</span>
      
      {/* Press feedback */}
      <motion.div
        className="absolute inset-0 bg-white/10 rounded-xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: isPressed ? 1 : 0 }}
        transition={{ duration: 0.1 }}
      />
    </motion.button>
  );
};

// Card Apple-style com glass morphism
export const AppleCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  hoverable?: boolean;
}> = ({ children, className = '', hoverable = true }) => {
  return (
    <motion.div
      className={`
        backdrop-blur-xl bg-gradient-to-b from-white/10 to-white/5
        border border-white/20 rounded-2xl shadow-xl
        transition-all duration-300 ease-out
        ${className}
      `}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={hoverable ? {
        y: -4,
        scale: 1.02,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      } : {}}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
      }}
    >
      {children}
    </motion.div>
  );
};

// Floating Action Button Apple-style
export const AppleFAB: React.FC<{
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}> = ({ children, onClick, className = '' }) => {
  return (
    <motion.button
      className={`
        fixed bottom-6 right-6 z-50
        w-14 h-14 rounded-full
        bg-gradient-to-b from-accent to-accent-2
        shadow-lg shadow-accent/30
        flex items-center justify-center
        text-white
        ${className}
      `}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      transition={{
        type: "spring",
        stiffness: 400,
        damping: 25,
      }}
      style={{
        boxShadow: '0 8px 32px rgba(55, 160, 244, 0.3), 0 2px 8px rgba(0, 0, 0, 0.2)'
      }}
    >
      {children}
    </motion.button>
  );
};

// Input Apple-style
export const AppleInput: React.FC<{
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  type?: string;
  className?: string;
}> = ({ placeholder, value, onChange, type = 'text', className = '' }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <motion.div
      className={`relative ${className}`}
      initial={{ scale: 0.98, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <motion.input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        className="
          w-full px-4 py-3 rounded-xl
          bg-gradient-to-b from-surface/80 to-surface
          border border-line/30
          text-txt placeholder-txt-3
          transition-all duration-200 ease-out
          focus:outline-none focus:border-accent/50 focus:shadow-lg focus:shadow-accent/10
          backdrop-blur-sm
        "
        whileFocus={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      />
      
      {/* Focus ring */}
      <motion.div
        className="absolute inset-0 rounded-xl border-2 border-accent/50 pointer-events-none"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{
          opacity: isFocused ? 1 : 0,
          scale: isFocused ? 1 : 0.95,
        }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

// Loading spinner Apple-style
export const AppleSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <motion.div
      className={`${sizes[size]} relative`}
      animate={{ rotate: 360 }}
      transition={{
        duration: 1,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <div className="absolute inset-0 rounded-full border-2 border-accent/30" />
      <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-accent" />
    </motion.div>
  );
};

// Notification Apple-style
export const AppleNotification: React.FC<{
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error' | 'info';
}> = ({ title, message, isVisible, onClose, type = 'info' }) => {
  const colors = {
    success: 'from-green-500/10 to-green-600/10 border-green-500/30',
    error: 'from-red-500/10 to-red-600/10 border-red-500/30',
    info: 'from-accent/10 to-accent-2/10 border-accent/30'
  };

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`
            fixed top-4 right-4 z-50 max-w-sm
            backdrop-blur-xl bg-gradient-to-b ${colors[type]}
            border rounded-xl p-4 shadow-lg
          `}
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30,
          }}
        >
          <h4 className="font-medium text-txt mb-1">{title}</h4>
          <p className="text-sm text-txt-2">{message}</p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Progress bar Apple-style
export const AppleProgress: React.FC<{
  value: number;
  max?: number;
  className?: string;
}> = ({ value, max = 100, className = '' }) => {
  const percentage = Math.min((value / max) * 100, 100);

  return (
    <div className={`w-full bg-surface rounded-full h-2 overflow-hidden ${className}`}>
      <motion.div
        className="h-full bg-gradient-to-r from-accent to-accent-2 rounded-full"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
      />
    </div>
  );
};