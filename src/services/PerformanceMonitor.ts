interface PerformanceMetric {
  name: string;
  value: number;
  timestamp: number;
  context?: string;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private maxMetrics = 100;

  measure(name: string, fn: () => void, context?: string) {
    const start = performance.now();
    fn();
    const end = performance.now();
    
    this.addMetric({
      name,
      value: end - start,
      timestamp: Date.now(),
      context
    });
  }

  async measureAsync(name: string, fn: () => Promise<void>, context?: string) {
    const start = performance.now();
    await fn();
    const end = performance.now();
    
    this.addMetric({
      name,
      value: end - start,
      timestamp: Date.now(),
      context
    });
  }

  private addMetric(metric: PerformanceMetric) {
    this.metrics.push(metric);
    
    // Keep only latest metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow operations in development
    if (process.env.NODE_ENV === 'development' && metric.value > 100) {
      console.warn(`Slow operation detected: ${metric.name} took ${metric.value.toFixed(2)}ms`);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAverageTime(name: string): number {
    const relevantMetrics = this.metrics.filter(m => m.name === name);
    if (relevantMetrics.length === 0) return 0;
    
    const total = relevantMetrics.reduce((sum, m) => sum + m.value, 0);
    return total / relevantMetrics.length;
  }

  getSlowOperations(threshold = 100): PerformanceMetric[] {
    return this.metrics.filter(m => m.value > threshold);
  }

  clear() {
    this.metrics = [];
  }
}

export const performanceMonitor = new PerformanceMonitor();
