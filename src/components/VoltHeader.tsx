import React from 'react';
import { motion } from 'framer-motion';
import { Bell, Zap, User } from 'lucide-react';
import { VoltButton } from './VoltButton';
import { cn } from '@/lib/utils';

interface VoltHeaderProps {
  title?: string;
  showNotifications?: boolean;
  showProfile?: boolean;
  className?: string;
}

export function VoltHeader({ 
  title = "Volt Gym", 
  showNotifications = true, 
  showProfile = true,
  className 
}: VoltHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-xl border-b border-white/10",
        "safe-area-top",
        className
      )}
    >
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo com animação */}
        <motion.div
          className="flex items-center gap-3"
          whileHover={{ scale: 1.02 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative">
            <motion.div
              animate={{ 
                rotate: [0, 5, -5, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-8 h-8 text-accent" />
            </motion.div>
            
            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 text-accent blur-md opacity-50"
              animate={{ 
                opacity: [0.3, 0.7, 0.3],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-8 h-8" />
            </motion.div>
          </div>
          
          <div>
            <motion.h1 
              className="text-xl font-bold text-white tracking-wide"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.4 }}
            >
              {title}
            </motion.h1>
          </div>
        </motion.div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {showNotifications && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.15 }}
            >
              <VoltButton
                variant="ghost"
                size="sm"
                className="relative p-2 rounded-xl"
              >
                <Bell className="w-5 h-5" />
                
                {/* Notification badge */}
                <motion.div
                  className="absolute -top-1 -right-1 w-3 h-3 bg-accent rounded-full"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </VoltButton>
            </motion.div>
          )}

          {showProfile && (
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.15 }}
            >
              <VoltButton
                variant="ghost"
                size="sm"
                className="p-2 rounded-xl border border-accent/20"
              >
                <User className="w-5 h-5" />
              </VoltButton>
            </motion.div>
          )}
        </div>
      </div>
    </motion.header>
  );
}