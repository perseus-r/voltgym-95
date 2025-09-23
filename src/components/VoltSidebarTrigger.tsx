import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Zap } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface VoltSidebarTriggerProps {
  className?: string;
}

export function VoltSidebarTrigger({ className }: VoltSidebarTriggerProps) {
  const { toggleSidebar, state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <motion.button
      onClick={toggleSidebar}
      data-sidebar="trigger"
      className={cn(
        "relative p-2 rounded-xl transition-all duration-300 group overflow-hidden",
        "bg-gradient-to-r from-accent/10 to-accent/5 border border-accent/20",
        "hover:from-accent/20 hover:to-accent/10 hover:border-accent/30",
        "focus:outline-none focus:ring-2 focus:ring-accent/50",
        className
      )}
      whileHover={{ scale: 1.05, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.15 }}
    >
      {/* Background glow effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-accent/20 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        animate={{ 
          background: [
            "linear-gradient(90deg, rgba(0,191,255,0.1) 0%, rgba(0,191,255,0.05) 100%)",
            "linear-gradient(90deg, rgba(0,191,255,0.2) 0%, rgba(0,191,255,0.1) 100%)",
            "linear-gradient(90deg, rgba(0,191,255,0.1) 0%, rgba(0,191,255,0.05) 100%)"
          ]
        }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <div className="relative z-10 flex items-center gap-2">
        <motion.div
          animate={{ 
            rotate: isCollapsed ? 0 : 180,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 0.3 },
            scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Menu className="w-5 h-5 text-accent" />
        </motion.div>
        
        {/* Pulse indicator */}
        <motion.div
          className="w-1.5 h-1.5 bg-accent rounded-full"
          animate={{ 
            opacity: [0.5, 1, 0.5],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      {/* Hover lightning effect */}
      <motion.div
        className="absolute inset-0 opacity-0 group-hover:opacity-30"
        initial={false}
        animate={{ 
          background: [
            "radial-gradient(circle at 0% 50%, rgba(0,191,255,0) 0%, rgba(0,191,255,0.3) 50%, rgba(0,191,255,0) 100%)",
            "radial-gradient(circle at 100% 50%, rgba(0,191,255,0) 0%, rgba(0,191,255,0.3) 50%, rgba(0,191,255,0) 100%)",
            "radial-gradient(circle at 0% 50%, rgba(0,191,255,0) 0%, rgba(0,191,255,0.3) 50%, rgba(0,191,255,0) 100%)"
          ]
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />

      <span className="sr-only">Abrir/Fechar Menu</span>
    </motion.button>
  );
}