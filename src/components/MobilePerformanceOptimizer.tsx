import React, { useEffect, useState } from 'react';
import { performanceMonitor } from '@/services/PerformanceMonitor';
import { systemChecker } from '@/utils/systemCheck';
import { useIsMobile } from '@/hooks/use-mobile';

interface PerformanceState {
  memoryUsage: number;
  renderTime: number;
  networkLatency: number;
  cacheHitRate: number;
}

export const MobilePerformanceOptimizer: React.FC = () => {
  const isMobile = useIsMobile();
  const [performance, setPerformance] = useState<PerformanceState>({
    memoryUsage: 0,
    renderTime: 0,
    networkLatency: 0,
    cacheHitRate: 90
  });

  useEffect(() => {
    // Monitor performance metrics
    const updateMetrics = () => {
      const memoryInfo = (performance as any).memory;
      const metrics = performanceMonitor.getMetrics();
      
      setPerformance({
        memoryUsage: memoryInfo ? memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit * 100 : 0,
        renderTime: performanceMonitor.getAverageTime('render') || 0,
        networkLatency: performanceMonitor.getAverageTime('network') || 0,
        cacheHitRate: 90 + Math.random() * 10 // Simulate cache metrics
      });
    };

    const interval = setInterval(updateMetrics, 5000);
    updateMetrics();

    // Mobile-specific optimizations
    if (isMobile) {
      // Reduce animation complexity on mobile
      document.documentElement.style.setProperty('--animation-duration', '0.2s');
      
      // Enable GPU acceleration for transforms
      document.body.classList.add('gpu-accelerated');
      
      // Optimize scroll behavior
      document.body.style.overscrollBehavior = 'contain';
      
      // Prefetch critical resources
      const criticalImages = ['/icons/logo.png', '/images/placeholder.jpg'];
      criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = src;
        document.head.appendChild(link);
      });
    }

    return () => {
      clearInterval(interval);
      if (isMobile) {
        document.body.classList.remove('gpu-accelerated');
      }
    };
  }, [isMobile]);

  // Performance monitoring for development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('📱 Mobile Performance Metrics:', performance);
      
      // Log slow operations
      const slowOps = performanceMonitor.getSlowOperations(100);
      if (slowOps.length > 0) {
        console.warn('⚠️ Slow operations detected:', slowOps);
      }
    }
  }, [performance]);

  return null; // Invisible performance optimizer
};

export default MobilePerformanceOptimizer;