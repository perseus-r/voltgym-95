import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Zap, Shield, Users, ShoppingCart, Database } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { systemHealthCheck } from '@/services/SystemHealthCheck';

interface HealthStatus {
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
export const SystemStatus: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const checkHealth = async () => {
      setIsLoading(true);
      try {
        const result = await systemHealthCheck.runHealthCheck();
        setHealth(result);
      } catch (error) {
        console.error('Health check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <Card className="liquid-glass">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 animate-pulse text-accent" />
            <span className="text-sm text-txt-2">Verificando sistema...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!health) {
    return (
      <Card className="liquid-glass">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <XCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-txt-2">Erro ao verificar status</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'degraded':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'unhealthy':
        return <XCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy':
        return 'bg-green-500/20 text-green-400 border-green-400/30';
      case 'degraded':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30';
      case 'unhealthy':
        return 'bg-red-500/20 text-red-400 border-red-400/30';
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString('pt-BR');
  };

  return (
    <div className="space-y-4">
      {/* Status Principal */}
      <Card className="liquid-glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            {getStatusIcon()}
            <span>Status do Sistema</span>
            <Badge className={`${getStatusColor()} border`}>
              {health.status === 'healthy' ? 'Saudável' : 
               health.status === 'degraded' ? 'Degradado' : 'Crítico'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${health.checks.auth ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-txt-2">Autenticação</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${health.checks.database ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-txt-2">Banco de Dados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${health.checks.localStorage ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-txt-2">Armazenamento</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${health.checks.api ? 'bg-green-400' : 'bg-red-400'}`} />
              <span className="text-sm text-txt-2">API</span>
            </div>
          </div>
          
          <div className="text-xs text-txt-2">
            Última verificação: {formatTimestamp(health.timestamp)}
          </div>
          
          {health.errors.length > 0 && (
            <div className="mt-3 p-2 bg-red-500/10 rounded border border-red-400/20">
              <div className="text-xs text-red-400">
                Erros: {health.errors.join(', ')}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Funcionalidades Administrativas */}
      <Card className="liquid-glass">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-accent" />
            <span>Funcionalidades Administrativas</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50">
              <div className={`w-3 h-3 rounded-full ${health.checks.adminAccess ? 'bg-green-400' : 'bg-red-400'}`} />
              <div>
                <div className="text-sm font-medium text-txt">Acesso Admin</div>
                <div className="text-xs text-txt-2">
                  {health.adminInfo?.isAdmin ? `Ativo (${health.adminInfo.email})` : 'Não disponível'}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50">
              <div className={`w-3 h-3 rounded-full ${health.checks.userProfiles ? 'bg-green-400' : 'bg-red-400'}`} />
              <div>
                <div className="text-sm font-medium text-txt">Gestão Usuários</div>
                <div className="text-xs text-txt-2">
                  {health.adminInfo?.totalUsers || 0} usuários registrados
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 rounded-lg bg-surface/50">
              <div className={`w-3 h-3 rounded-full ${health.checks.storeProducts ? 'bg-green-400' : 'bg-red-400'}`} />
              <div>
                <div className="text-sm font-medium text-txt">Loja & Produtos</div>
                <div className="text-xs text-txt-2">
                  {health.adminInfo?.productsCount || 0} produtos cadastrados
                </div>
              </div>
            </div>
          </div>

          {health.adminInfo?.isAdmin && (
            <div className="mt-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-4 h-4 text-accent" />
                <span className="text-sm font-medium text-accent">Status Administrativo</span>
              </div>
              <div className="text-xs text-txt-2 space-y-1">
                <div>✅ Painel administrativo ativo</div>
                <div>✅ Controle de usuários habilitado</div>
                <div>✅ Gestão da loja operacional</div>
                <div>✅ Acesso gratuito configurável</div>
                {health.adminInfo.hasAdminControls && <div>✅ Controles admin configurados</div>}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};