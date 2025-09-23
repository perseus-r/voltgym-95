import React from 'react';
import { motion } from 'framer-motion';

// ==================== LIGHTNING BOLT COMPONENT ====================

interface LightningBoltProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  className?: string;
  color?: 'electric-blue' | 'chrome' | 'silver';
}

export function LightningBolt({ 
  size = 'md', 
  animate = true, 
  className = '',
  color = 'electric-blue'
}: LightningBoltProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const colors = {
    'electric-blue': 'text-electric-blue',
    chrome: 'text-chrome',
    silver: 'text-silver'
  };

  return (
    <motion.div
      className={`${sizes[size]} ${colors[color]} ${className}`}
      animate={animate ? {
        scale: [1, 1.1, 1],
        filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)']
      } : {}}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor"
        className="w-full h-full drop-shadow-[0_0_8px_currentColor]"
      >
        <path d="M13 0L3 14h6l-2 10 10-14h-6l2-10z" />
      </svg>
    </motion.div>
  );
}

// ==================== ELECTRIC BACKGROUND EFFECT ====================

export function ElectricBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Ambient lightning glow */}
      <div className="absolute inset-0 bg-gradient-glow opacity-10 animate-pulse" />
      
      {/* Electric particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-electric-blue rounded-full opacity-40"
          initial={{ 
            x: Math.random() * 100 + '%',
            y: Math.random() * 100 + '%',
            scale: 0
          }}
          animate={{ 
            y: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%'
            ],
            x: [
              Math.random() * 100 + '%',
              Math.random() * 100 + '%',
              Math.random() * 100 + '%'
            ],
            scale: [0, 1, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Lightning streaks */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`streak-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-electric-blue to-transparent opacity-30"
          style={{
            width: Math.random() * 200 + 100 + 'px',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            transform: `rotate(${Math.random() * 360}deg)`
          }}
          animate={{
            opacity: [0, 0.6, 0],
            scaleX: [0, 1, 0]
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
}

// ==================== CHROME BUTTON COMPONENT ====================

interface ChromeButtonProps {
  children: React.ReactNode;
  variant?: 'chrome' | 'electric' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export function ChromeButton({ 
  children, 
  variant = 'chrome',
  size = 'md',
  className,
  onClick,
  disabled = false
}: ChromeButtonProps) {
  const sizes = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-xl',
    lg: 'px-8 py-4 text-lg rounded-2xl'
  };

  const variants = {
    chrome: [
      'bg-gradient-chrome text-bg',
      'shadow-[0_4px_14px_rgba(255,255,255,0.15)]',
      'hover:shadow-[0_6px_20px_rgba(255,255,255,0.25)]',
      'border border-chrome/30'
    ],
    electric: [
      'bg-gradient-lightning text-bg',
      'shadow-[0_4px_14px_rgba(55,160,244,0.3)]',
      'hover:shadow-[0_6px_20px_rgba(55,160,244,0.5)]',
      'border border-electric-blue/40'
    ],
    ghost: [
      'text-electric-blue hover:bg-electric-blue/10',
      'border border-transparent hover:border-electric-blue/30'
    ]
  };

  return (
    <motion.button
      className={`
        font-semibold transition-all duration-200
        relative overflow-hidden
        touch-manipulation select-none
        disabled:opacity-50 disabled:cursor-not-allowed
        ${sizes[size]}
        ${variants[variant].join(' ')}
        ${className || ''}
      `}
      whileHover={!disabled ? { 
        scale: 1.02, 
        y: -1 
      } : undefined}
      whileTap={!disabled ? { scale: 0.98 } : undefined}
      onClick={onClick}
      disabled={disabled}
      style={{
        willChange: 'transform, box-shadow',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Metallic shine effect */}
      {(variant === 'chrome' || variant === 'electric') && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        />
      )}
      
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

// ==================== ELECTRIC CARD COMPONENT ====================

interface ElectricCardProps {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
  variant?: 'glass' | 'chrome' | 'electric';
}

export function ElectricCard({ 
  children, 
  className,
  interactive = true,
  variant = 'glass'
}: ElectricCardProps) {
  const variants = {
    glass: [
      'bg-glass-bg backdrop-blur-[20px]',
      'border border-glass-border',
      'hover:border-electric-blue/30'
    ],
    chrome: [
      'bg-gradient-to-br from-silver/10 to-chrome/5',
      'border border-silver/20',
      'hover:border-chrome/40'
    ],
    electric: [
      'bg-gradient-to-br from-electric-blue/5 to-electric-glow/5',
      'border border-electric-blue/20',
      'hover:border-electric-blue/40'
    ]
  };

  return (
    <motion.div
      className={`
        rounded-2xl shadow-glass p-6
        transition-all duration-300 ease-out
        relative overflow-hidden
        ${variants[variant].join(' ')}
        ${interactive ? 'cursor-pointer' : ''}
        ${className || ''}
      `}
      whileHover={interactive ? { 
        y: -2, 
        scale: 1.01,
        boxShadow: variant === 'electric' 
          ? '0 20px 60px rgba(55, 160, 244, 0.2)' 
          : '0 20px 60px rgba(0, 0, 0, 0.3)'
      } : undefined}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      style={{
        willChange: 'transform, box-shadow',
        backfaceVisibility: 'hidden'
      }}
    >
      {/* Electric accent border */}
      {variant === 'electric' && (
        <div className="absolute inset-0 rounded-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-electric-blue/20 via-transparent to-electric-blue/20 rounded-2xl opacity-50" />
        </div>
      )}
      
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
}

export default LightningBolt;