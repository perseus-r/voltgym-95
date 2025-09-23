import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Dumbbell } from 'lucide-react';

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Carregando..." }: LoadingScreenProps) {
  return (
    <div className="fixed inset-0 bg-bg flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center gap-6"
      >
        {/* Logo animado */}
        <motion.div
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 1, repeat: Infinity, ease: "easeInOut" }
          }}
          className="relative"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
            <Zap className="w-8 h-8 text-accent-ink" />
          </div>
          
          {/* Particles around logo */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-accent/40 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transformOrigin: '50% 50%',
              }}
              animate={{
                rotate: [0, 360],
                x: [0, Math.cos((i * 60) * Math.PI / 180) * 30, 0],
                y: [0, Math.sin((i * 60) * Math.PI / 180) * 30, 0],
                opacity: [0.8, 0.2, 0.8],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>

        {/* Loading text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-xl font-bold text-txt mb-2">VOLT</h2>
          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-txt-2"
          >
            {message}
          </motion.p>
        </motion.div>

        {/* Progress dots */}
        <div className="flex gap-2">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-accent rounded-full"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.3, 1, 0.3],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}

// Skeleton loading para listas
export function SkeletonCard() {
  return (
    <div className="animate-pulse bg-surface rounded-2xl p-4 space-y-3">
      <div className="h-4 bg-line rounded w-3/4"></div>
      <div className="h-3 bg-line rounded w-1/2"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-line rounded w-16"></div>
        <div className="h-8 bg-line rounded w-16"></div>
      </div>
    </div>
  );
}

// Skeleton para stats
export function SkeletonStats() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="animate-pulse bg-surface rounded-2xl p-4 space-y-2">
          <div className="h-3 bg-line rounded w-1/2"></div>
          <div className="h-6 bg-line rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
}