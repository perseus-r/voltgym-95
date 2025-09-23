/**
 * Sistema de verificação de funcionalidades internas
 * Monitora saúde e integridade dos componentes críticos
 */

interface SystemCheckResult {
  component: string;
  status: 'healthy' | 'warning' | 'error';
  message: string;
  timestamp: string;
}

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage: number;
  networkLatency: number;
  errorCount: number;
}

class SystemChecker {
  private static instance: SystemChecker;
  private checkResults: SystemCheckResult[] = [];
  private performanceMetrics: PerformanceMetrics = {
    renderTime: 0,
    memoryUsage: 0,
    networkLatency: 0,
    errorCount: 0
  };

  static getInstance(): SystemChecker {
    if (!SystemChecker.instance) {
      SystemChecker.instance = new SystemChecker();
    }
    return SystemChecker.instance;
  }

  // Verificar saúde do localStorage
  private checkLocalStorage(): SystemCheckResult {
    try {
      const testKey = 'volt_system_test';
      const testValue = JSON.stringify({ test: true, timestamp: Date.now() });
      localStorage.setItem(testKey, testValue);
      const retrieved = localStorage.getItem(testKey);
      localStorage.removeItem(testKey);

      if (retrieved !== testValue) {
        throw new Error('localStorage read/write mismatch');
      }

      return {
        component: 'LocalStorage',
        status: 'healthy',
        message: 'Read/write operations working correctly',
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'LocalStorage',
        status: 'error',
        message: `Storage error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verificar dados de treinos
  private checkWorkoutData(): SystemCheckResult {
    try {
      const workoutHistory = JSON.parse(localStorage.getItem('bora_hist_v1') || '[]');
      const activePlan = localStorage.getItem('active_workout_plan');
      const userPlans = JSON.parse(localStorage.getItem('bora_plans_v1') || '[]');

      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      let message = 'Workout data structure is valid';

      if (!Array.isArray(workoutHistory)) {
        status = 'error';
        message = 'Workout history is corrupted';
      } else if (workoutHistory.length === 0) {
        status = 'warning';
        message = 'No workout history found';
      } else if (!activePlan && userPlans.length === 0) {
        status = 'warning';
        message = 'No active workout plan or user plans found';
      }

      return {
        component: 'WorkoutData',
        status,
        message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'WorkoutData',
        status: 'error',
        message: `Data integrity error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verificar performance de renderização
  private checkRenderPerformance(): SystemCheckResult {
    try {
      const startTime = performance.now();
      
      // Simular operação de renderização
      const testElement = document.createElement('div');
      testElement.innerHTML = '<div class="glass-card"><p>Performance test</p></div>';
      document.body.appendChild(testElement);
      
      const endTime = performance.now();
      const renderTime = endTime - startTime;
      
      document.body.removeChild(testElement);

      this.performanceMetrics.renderTime = renderTime;

      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      let message = `Render time: ${renderTime.toFixed(2)}ms`;

      if (renderTime > 100) {
        status = 'warning';
        message = `Slow render performance: ${renderTime.toFixed(2)}ms`;
      } else if (renderTime > 200) {
        status = 'error';
        message = `Critical render performance: ${renderTime.toFixed(2)}ms`;
      }

      return {
        component: 'RenderPerformance',
        status,
        message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'RenderPerformance',
        status: 'error',
        message: `Performance check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verificar uso de memória
  private checkMemoryUsage(): SystemCheckResult {
    try {
      const memory = (performance as any).memory;
      
      if (!memory) {
        return {
          component: 'Memory',
          status: 'warning',
          message: 'Memory API not available',
          timestamp: new Date().toISOString()
        };
      }

      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      const usagePercent = (usedMB / limitMB) * 100;

      this.performanceMetrics.memoryUsage = usagePercent;

      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      let message = `Memory usage: ${usedMB}MB (${usagePercent.toFixed(1)}%)`;

      if (usagePercent > 70) {
        status = 'warning';
        message = `High memory usage: ${usedMB}MB (${usagePercent.toFixed(1)}%)`;
      } else if (usagePercent > 90) {
        status = 'error';
        message = `Critical memory usage: ${usedMB}MB (${usagePercent.toFixed(1)}%)`;
      }

      return {
        component: 'Memory',
        status,
        message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'Memory',
        status: 'error',
        message: `Memory check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verificar conectividade de rede
  private async checkNetworkHealth(): Promise<SystemCheckResult> {
    try {
      const startTime = performance.now();
      
      // Testar conectividade com um endpoint leve
      const response = await fetch('/favicon.ico', { 
        method: 'HEAD',
        cache: 'no-cache'
      });
      
      const endTime = performance.now();
      const latency = endTime - startTime;

      this.performanceMetrics.networkLatency = latency;

      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      let message = `Network latency: ${latency.toFixed(0)}ms`;

      if (!response.ok) {
        status = 'warning';
        message = `Network response: ${response.status}`;
      } else if (latency > 1000) {
        status = 'warning';
        message = `Slow network: ${latency.toFixed(0)}ms`;
      } else if (latency > 3000) {
        status = 'error';
        message = `Critical network latency: ${latency.toFixed(0)}ms`;
      }

      return {
        component: 'Network',
        status,
        message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'Network',
        status: 'error',
        message: `Network unavailable: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Verificar erros do console
  private checkConsoleErrors(): SystemCheckResult {
    try {
      const errorCount = this.performanceMetrics.errorCount;
      
      let status: 'healthy' | 'warning' | 'error' = 'healthy';
      let message = `Console errors: ${errorCount}`;

      if (errorCount > 0 && errorCount <= 5) {
        status = 'warning';
        message = `${errorCount} console errors detected`;
      } else if (errorCount > 5) {
        status = 'error';
        message = `High error count: ${errorCount} console errors`;
      }

      return {
        component: 'ConsoleErrors',
        status,
        message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      return {
        component: 'ConsoleErrors',
        status: 'error',
        message: `Error tracking failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Executar verificação completa do sistema
  async runSystemCheck(): Promise<SystemCheckResult[]> {
    const checks = [
      this.checkLocalStorage(),
      this.checkWorkoutData(),
      this.checkRenderPerformance(),
      this.checkMemoryUsage(),
      await this.checkNetworkHealth(),
      this.checkConsoleErrors()
    ];

    this.checkResults = checks;
    return checks;
  }

  // Obter relatório de saúde do sistema
  getHealthReport(): {
    overall: 'healthy' | 'warning' | 'error';
    results: SystemCheckResult[];
    metrics: PerformanceMetrics;
    summary: string;
  } {
    const errorCount = this.checkResults.filter(r => r.status === 'error').length;
    const warningCount = this.checkResults.filter(r => r.status === 'warning').length;
    
    let overall: 'healthy' | 'warning' | 'error' = 'healthy';
    let summary = 'All systems operational';

    if (errorCount > 0) {
      overall = 'error';
      summary = `${errorCount} critical issue${errorCount > 1 ? 's' : ''} detected`;
    } else if (warningCount > 0) {
      overall = 'warning';
      summary = `${warningCount} warning${warningCount > 1 ? 's' : ''} found`;
    }

    return {
      overall,
      results: this.checkResults,
      metrics: this.performanceMetrics,
      summary
    };
  }

  // Incrementar contador de erros
  incrementErrorCount(): void {
    this.performanceMetrics.errorCount++;
  }

  // Resetar métricas
  resetMetrics(): void {
    this.performanceMetrics = {
      renderTime: 0,
      memoryUsage: 0,
      networkLatency: 0,
      errorCount: 0
    };
    this.checkResults = [];
  }

  // Monitorar erros do console automaticamente
  setupErrorMonitoring(): void {
    // Interceptar console.error
    const originalError = console.error;
    console.error = (...args) => {
      this.incrementErrorCount();
      originalError.apply(console, args);
    };

    // Interceptar erros globais
    window.addEventListener('error', () => {
      this.incrementErrorCount();
    });

    // Interceptar promise rejections
    window.addEventListener('unhandledrejection', () => {
      this.incrementErrorCount();
    });
  }
}

export const systemChecker = SystemChecker.getInstance();
export type { SystemCheckResult, PerformanceMetrics };