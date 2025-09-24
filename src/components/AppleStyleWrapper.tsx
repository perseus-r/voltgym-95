import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileOptimizations } from './MobileOptimizations';

interface AppleStyleWrapperProps {
  children: React.ReactNode;
}

export const AppleStyleWrapper: React.FC<AppleStyleWrapperProps> = ({ children }) => {
  useEffect(() => {
    // Add Apple-style CSS classes to body for global effects
    document.body.classList.add('apple-smooth');
    
    // Apply Apple-style scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add haptic-like feedback for touches on mobile
    const addHapticFeedback = (element: HTMLElement) => {
      element.addEventListener('touchstart', () => {
        element.style.transform = 'scale(0.98)';
        element.style.transition = 'transform 0.1s ease-out';
      });
      
      element.addEventListener('touchend', () => {
        element.style.transform = 'scale(1)';
        element.style.transition = 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)';
      });
    };

    // Apply haptic feedback to interactive elements
    const interactiveElements = document.querySelectorAll('button, [role="button"], .interactive');
    interactiveElements.forEach((el) => addHapticFeedback(el as HTMLElement));

    // Intersection Observer for Apple-style entrance animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          
          // Add entrance animation based on element type
          if (element.classList.contains('animate-on-scroll')) {
            element.classList.add('apple-fade-in');
          }
          
          observer.unobserve(element);
        }
      });
    }, observerOptions);

    // Observe elements with animation trigger
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach((el) => observer.observe(el));

    return () => {
      // Cleanup
      document.body.classList.remove('apple-smooth');
      observer.disconnect();
    };
  }, []);

  return (
    <MobileOptimizations>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.4, 0, 0.2, 1]
        }}
        className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg"
      >
        <AnimatePresence mode="wait">
          {children}
        </AnimatePresence>
      </motion.div>
    </MobileOptimizations>
  );
};