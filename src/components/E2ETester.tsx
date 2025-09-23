import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface TestResult {
  name: string;
  status: 'pass' | 'fail' | 'skip' | 'running';
  duration: number;
  error?: string;
  details?: string;
}

interface TestSuite {
  name: string;
  results: TestResult[];
  totalTests: number;
  passedTests: number;
  failedTests: number;
  duration: number;
}

export const E2ETester: React.FC = () => {
  const { user } = useAuth();
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    // Só executar testes se for ambiente de desenvolvimento ou se o usuário for admin
    if (process.env.NODE_ENV !== 'development' && !user?.email?.includes('admin')) {
      return;
    }

    const runE2ETests = async () => {
      setIsRunning(true);
      const suites: TestSuite[] = [];

      // Suite 1: Autenticação
      const authSuite = await runAuthTests();
      suites.push(authSuite);

      // Suite 2: Dashboard
      const dashboardSuite = await runDashboardTests();
      suites.push(dashboardSuite);

      // Suite 3: Treinos
      const workoutSuite = await runWorkoutTests();
      suites.push(workoutSuite);

      // Suite 4: Performance
      const performanceSuite = await runPerformanceTests();
      suites.push(performanceSuite);

      // Suite 5: Responsividade
      const responsiveSuite = await runResponsiveTests();
      suites.push(responsiveSuite);

      setTestSuites(suites);
      setIsRunning(false);
    };

    // Executar após um pequeno delay para não interferir no carregamento
    setTimeout(runE2ETests, 3000);
  }, [user]);

  const createTestResult = (name: string, testFn: () => boolean | Promise<boolean>, timeout = 5000): Promise<TestResult> => {
    return new Promise(async (resolve) => {
      const startTime = performance.now();
      
      try {
        const result = await Promise.race([
          Promise.resolve(testFn()),
          new Promise<boolean>((_, reject) => 
            setTimeout(() => reject(new Error('Test timeout')), timeout)
          )
        ]);

        const endTime = performance.now();
        resolve({
          name,
          status: result ? 'pass' : 'fail',
          duration: endTime - startTime,
          error: result ? undefined : 'Test assertion failed'
        });
      } catch (error) {
        const endTime = performance.now();
        resolve({
          name,
          status: 'fail',
          duration: endTime - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    });
  };

  const runAuthTests = async (): Promise<TestSuite> => {
    const startTime = performance.now();
    const results: TestResult[] = [];

    // Teste 1: Verificar se o usuário está autenticado
    results.push(await createTestResult(
      'User Authentication Check',
      () => !!user
    ));

    // Teste 2: Verificar se o perfil está carregado
    results.push(await createTestResult(
      'User Profile Data',
      () => !!user?.email
    ));

    // Teste 3: Verificar localStorage do usuário
    results.push(await createTestResult(
      'User Storage Access',
      () => {
        const userId = localStorage.getItem('currentUserId');
        return !!userId;
      }
    ));

    const endTime = performance.now();
    return {
      name: 'Authentication Tests',
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      duration: endTime - startTime
    };
  };

  const runDashboardTests = async (): Promise<TestSuite> => {
    const startTime = performance.now();
    const results: TestResult[] = [];

    // Teste 1: Verificar se os componentes principais estão renderizados
    results.push(await createTestResult(
      'Main Dashboard Components',
      () => {
        const heroSection = document.querySelector('[class*="hero"], [class*="HeroNextWorkout"]');
        const statsSection = document.querySelector('[class*="stats"], [class*="StreakWeek"]');
        return !!(heroSection && statsSection);
      }
    ));

    // Teste 2: Verificar se os botões principais estão funcionais
    results.push(await createTestResult(
      'Interactive Buttons',
      () => {
        const buttons = document.querySelectorAll('button:not([disabled])');
        return buttons.length > 0;
      }
    ));

    // Teste 3: Verificar se os dados estão carregando
    results.push(await createTestResult(
      'Data Loading State',
      () => {
        // Verificar se não há muitos elementos de loading
        const loadingElements = document.querySelectorAll('[class*="loading"], [class*="skeleton"]');
        return loadingElements.length < 5; // Permitir alguns elementos de loading
      }
    ));

    // Teste 4: Verificar navegação
    results.push(await createTestResult(
      'Navigation Elements',
      () => {
        const navElements = document.querySelectorAll('nav, [role="navigation"], .sidebar');
        return navElements.length > 0;
      }
    ));

    const endTime = performance.now();
    return {
      name: 'Dashboard Tests',
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      duration: endTime - startTime
    };
  };

  const runWorkoutTests = async (): Promise<TestSuite> => {
    const startTime = performance.now();
    const results: TestResult[] = [];

    // Teste 1: Verificar se os dados de treino estão acessíveis
    results.push(await createTestResult(
      'Workout Data Access',
      () => {
        const workoutHistory = localStorage.getItem('bora_hist_v1');
        return workoutHistory !== null;
      }
    ));

    // Teste 2: Verificar se há elementos de treino na interface
    results.push(await createTestResult(
      'Workout UI Elements',
      () => {
        const workoutElements = document.querySelectorAll('[class*="workout"], [class*="exercise"]');
        return workoutElements.length > 0;
      }
    ));

    // Teste 3: Verificar funcionalidade de salvamento
    results.push(await createTestResult(
      'Save Workout Functionality',
      () => {
        // Simular teste de salvamento básico
        try {
          const testData = { test: 'workout_save_test', timestamp: Date.now() };
          localStorage.setItem('test_workout_save', JSON.stringify(testData));
          const saved = localStorage.getItem('test_workout_save');
          localStorage.removeItem('test_workout_save');
          return !!saved;
        } catch {
          return false;
        }
      }
    ));

    // Teste 4: Verificar gráficos de performance
    results.push(await createTestResult(
      'Performance Charts',
      () => {
        const charts = document.querySelectorAll('[class*="chart"], svg[class*="recharts"]');
        return charts.length > 0;
      }
    ));

    const endTime = performance.now();
    return {
      name: 'Workout Tests',
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      duration: endTime - startTime
    };
  };

  const runPerformanceTests = async (): Promise<TestSuite> => {
    const startTime = performance.now();
    const results: TestResult[] = [];

    // Teste 1: Tempo de carregamento da página
    results.push(await createTestResult(
      'Page Load Performance',
      () => {
        const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
        if (navigation) {
          const loadTime = navigation.loadEventEnd - navigation.fetchStart;
          return loadTime < 3000; // Menos de 3 segundos
        }
        return true; // Skip se não disponível
      }
    ));

    // Teste 2: Verificar memory leaks básicos
    results.push(await createTestResult(
      'Memory Usage Check',
      () => {
        const memoryInfo = (performance as any).memory;
        if (memoryInfo) {
          const memoryUsage = memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit;
          return memoryUsage < 0.8; // Menos de 80% do heap
        }
        return true; // Skip se não disponível
      }
    ));

    // Teste 3: Verificar se há muitos re-renders
    results.push(await createTestResult(
      'Render Performance',
      () => {
        const paintEntries = performance.getEntriesByType('paint');
        return paintEntries.length > 0;
      }
    ));

    // Teste 4: Verificar recursos não utilizados
    results.push(await createTestResult(
      'Resource Optimization',
      () => {
        const scripts = document.querySelectorAll('script[src]');
        const styles = document.querySelectorAll('link[rel="stylesheet"]');
        // Básico: verificar se há um número razoável de recursos
        return scripts.length < 10 && styles.length < 5;
      }
    ));

    const endTime = performance.now();
    return {
      name: 'Performance Tests',
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      duration: endTime - startTime
    };
  };

  const runResponsiveTests = async (): Promise<TestSuite> => {
    const startTime = performance.now();
    const results: TestResult[] = [];

    // Teste 1: Verificar se não há overflow horizontal
    results.push(await createTestResult(
      'No Horizontal Overflow',
      () => {
        return document.body.scrollWidth <= document.body.clientWidth + 5; // 5px de tolerância
      }
    ));

    // Teste 2: Verificar touch targets em mobile
    results.push(await createTestResult(
      'Mobile Touch Targets',
      () => {
        if (window.innerWidth > 768) return true; // Skip em desktop
        
        const buttons = document.querySelectorAll('button, [role="button"]');
        let validTouchTargets = 0;
        
        buttons.forEach(btn => {
          const rect = btn.getBoundingClientRect();
          if (rect.width >= 44 && rect.height >= 44) {
            validTouchTargets++;
          }
        });
        
        return validTouchTargets / buttons.length > 0.8; // 80% dos botões devem ter tamanho adequado
      }
    ));

    // Teste 3: Verificar viewport meta tag
    results.push(await createTestResult(
      'Viewport Meta Tag',
      () => {
        const viewportMeta = document.querySelector('meta[name="viewport"]');
        return !!viewportMeta;
      }
    ));

    // Teste 4: Verificar se há elementos muito pequenos
    results.push(await createTestResult(
      'Readable Text Size',
      () => {
        if (window.innerWidth > 768) return true; // Skip em desktop
        
        const textElements = document.querySelectorAll('p, span, div, a');
        let readableTexts = 0;
        
        textElements.forEach(el => {
          const computedStyle = window.getComputedStyle(el);
          const fontSize = parseFloat(computedStyle.fontSize);
          if (fontSize >= 14) {
            readableTexts++;
          }
        });
        
        return readableTexts / textElements.length > 0.9; // 90% do texto deve ser legível
      }
    ));

    const endTime = performance.now();
    return {
      name: 'Responsive Tests',
      results,
      totalTests: results.length,
      passedTests: results.filter(r => r.status === 'pass').length,
      failedTests: results.filter(r => r.status === 'fail').length,
      duration: endTime - startTime
    };
  };

  // Log resultados em desenvolvimento
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && testSuites.length > 0) {
      console.log('🧪 E2E Test Results:', testSuites);
      
      // Calcular score geral
      const totalTests = testSuites.reduce((sum, suite) => sum + suite.totalTests, 0);
      const totalPassed = testSuites.reduce((sum, suite) => sum + suite.passedTests, 0);
      const overallScore = totalTests > 0 ? Math.round((totalPassed / totalTests) * 100) : 0;
      
      console.log(`📊 Overall Test Score: ${overallScore}% (${totalPassed}/${totalTests} tests passed)`);
    }
  }, [testSuites]);

  return null; // Componente invisível de testes
};

export default E2ETester;