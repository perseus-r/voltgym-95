import { supabase } from '@/integrations/supabase/client';

interface HealthCheckResult {
  status: 'healthy' | 'degraded' | 'unhealthy';
  checks: {
    auth: boolean;
    database: boolean;
    localStorage: boolean;
    api: boolean;
    adminAccess: boolean;
    storeProducts: boolean;
    userProfiles: boolean;
  };
  timestamp: number;
  errors: string[];
  adminInfo?: {
    isAdmin: boolean;
    email: string;
    totalUsers: number;
    productsCount: number;
    hasAdminControls: boolean;
  };
}

class SystemHealthCheck {
  async runHealthCheck(): Promise<HealthCheckResult> {
    const checks = {
      auth: false,
      database: false,
      localStorage: false,
      api: false,
      adminAccess: false,
      storeProducts: false,
      userProfiles: false,
    };
    const errors: string[] = [];
    let adminInfo: HealthCheckResult['adminInfo'];

    // Check Auth
    try {
      const { data } = await supabase.auth.getSession();
      checks.auth = !!data.session;

      // Se logado, verificar privilégios admin
      if (data.session?.user) {
        const userEmail = data.session.user.email;
        const ADMIN_EMAILS = ['pedrosannger16@gmail.com', 'sannger@proton.me'];
        const isAdmin = ADMIN_EMAILS.includes(userEmail || '') || userEmail?.endsWith('@volt.com');
        checks.adminAccess = isAdmin;

        // Informações admin detalhadas
        if (isAdmin) {
          try {
            // Contar usuários totais
            const { count: usersCount } = await supabase
              .from('profiles')
              .select('*', { count: 'exact', head: true });

            // Contar produtos na loja
            const { count: productsCount } = await supabase
              .from('products')
              .select('*', { count: 'exact', head: true });

            // Verificar controles admin
            const { data: adminControls } = await supabase
              .from('admin_controls')
              .select('id')
              .limit(1);

            adminInfo = {
              isAdmin,
              email: userEmail || '',
              totalUsers: usersCount || 0,
              productsCount: productsCount || 0,
              hasAdminControls: !!adminControls?.length
            };
          } catch (error) {
            console.warn('Erro ao buscar informações admin:', error);
          }
        }
      }
    } catch (error) {
      errors.push('Auth check failed');
    }

    // Check Database & User Profiles
    try {
      const { data, error } = await supabase.from('profiles').select('id').limit(1);
      checks.database = !error;
      checks.userProfiles = !error && !!data;
    } catch (error) {
      errors.push('Database connection failed');
      checks.database = false;
      checks.userProfiles = false;
    }

    // Check Store Products
    try {
      const { data, error } = await supabase.from('products').select('id').limit(1);
      checks.storeProducts = !error;
    } catch (error) {
      errors.push('Store products table not accessible');
    }

    // Check LocalStorage
    try {
      localStorage.setItem('healthcheck', 'test');
      localStorage.removeItem('healthcheck');
      checks.localStorage = true;
    } catch (error) {
      errors.push('LocalStorage not available');
    }

    // Check API
    try {
      const response = await fetch('https://osvicgbgrmyogazdbllj.supabase.co/functions/v1/workouts-api-proxy/health');
      checks.api = response.ok;
    } catch (error) {
      errors.push('API health check failed');
    }

    const healthyChecks = Object.values(checks).filter(Boolean).length;
    const totalChecks = Object.keys(checks).length;
    
    let status: HealthCheckResult['status'] = 'healthy';
    if (healthyChecks < totalChecks) {
      status = healthyChecks >= totalChecks * 0.7 ? 'degraded' : 'unhealthy';
    }

    return {
      status,
      checks,
      timestamp: Date.now(),
      errors,
      adminInfo,
    };
  }

  async monitorHealth(intervalMs = 30000) {
    const check = async () => {
      const result = await this.runHealthCheck();
      
      if (result.status !== 'healthy') {
        console.warn('System health degraded:', result);
      }
      
      // Store result for monitoring dashboard
      localStorage.setItem('last_health_check', JSON.stringify(result));
    };

    // Initial check
    await check();

    // Periodic checks
    setInterval(check, intervalMs);
  }
}

export const systemHealthCheck = new SystemHealthCheck();