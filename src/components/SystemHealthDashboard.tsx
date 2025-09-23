import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Activity, 
  Database, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Settings
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';
import { isAdminEmail } from '@/lib/admin';
import { toast } from 'sonner';

interface SystemHealth {
  auth: boolean;
  database: boolean;
  subscription: boolean;
  aiService: boolean;
  adminAccess: boolean;
  errors: string[];
}

export const SystemHealthDashboard: React.FC = () => {
  const { user } = useAuth();
  const subscription = useSubscription();
  const [health, setHealth] = useState<SystemHealth>({
    auth: false,
    database: false,
    subscription: false,
    aiService: false,
    adminAccess: false,
    errors: []
  });
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    checkSystemHealth();
  }, [user]);

  const checkSystemHealth = async () => {
    setChecking(true);
    const errors: string[] = [];
    
    try {
      // Check Authentication
      const authStatus = !!user;
      if (!authStatus) errors.push('Usuário não autenticado');

      // Check Database Connection
      let dbStatus = false;
      try {
        const { error } = await supabase.from('profiles').select('id').limit(1);
        dbStatus = !error;
        if (error) errors.push(`Database: ${error.message}`);
      } catch (err) {
        errors.push('Database: Conexão falhou');
      }

      // Check Subscription System
      let subscriptionStatus = false;
      try {
        const subCheck = await subscription.checkSubscription();
        subscriptionStatus = !subscription.error;
        if (subscription.error) errors.push(`Subscription: ${subscription.error}`);
      } catch (err) {
        errors.push('Subscription: Sistema indisponível');
      }

      // Check AI Service
      let aiStatus = false;
      try {
        const { data, error } = await supabase.functions.invoke('ai-coach', {
          body: { 
            message: 'health check',
            analysisType: 'system'
          }
        });
        aiStatus = !error && !!data;
        if (error) errors.push(`AI Service: ${error.message}`);
      } catch (err) {
        errors.push('AI Service: Indisponível');
      }

      // Check Admin Access
      const adminStatus = user ? isAdminEmail(user.email) : false;

      setHealth({
        auth: authStatus,
        database: dbStatus,
        subscription: subscriptionStatus,
        aiService: aiStatus,
        adminAccess: adminStatus,
        errors
      });

    } catch (error) {
      console.error('System health check error:', error);
      errors.push(`System: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
      setHealth(prev => ({ ...prev, errors }));
    } finally {
      setLoading(false);
      setChecking(false);
    }
  };

  const getStatusIcon = (status: boolean) => {
    return status ? (
      <CheckCircle className="w-4 h-4 text-green-400" />
    ) : (
      <XCircle className="w-4 h-4 text-red-400" />
    );
  };

  const getStatusBadge = (status: boolean) => {
    return (
      <Badge variant={status ? "default" : "destructive"} className="text-xs">
        {status ? 'OK' : 'ERRO'}
      </Badge>
    );
  };

  const overallHealth = Object.values(health).filter(v => typeof v === 'boolean').every(Boolean);

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-accent" />
          <div>
            <h3 className="text-lg font-semibold text-white">Status do Sistema</h3>
            <p className="text-text-2 text-sm">Monitoramento em tempo real</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={overallHealth ? "default" : "destructive"}>
            {overallHealth ? 'SAUDÁVEL' : 'DEGRADADO'}
          </Badge>
          <Button
            size="sm"
            variant="outline"
            onClick={checkSystemHealth}
            disabled={checking}
          >
            {checking ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {/* Authentication */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-blue-400" />
            <span className="text-white text-sm">Autenticação</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(health.auth)}
            {getStatusBadge(health.auth)}
          </div>
        </div>

        {/* Database */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-purple-400" />
            <span className="text-white text-sm">Banco de Dados</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(health.database)}
            {getStatusBadge(health.database)}
          </div>
        </div>

        {/* Subscription */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-accent" />
            <span className="text-white text-sm">Sistema de Assinaturas</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(health.subscription)}
            {getStatusBadge(health.subscription)}
          </div>
        </div>

        {/* AI Service */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
          <div className="flex items-center gap-3">
            <Activity className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm">Serviço de IA</span>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(health.aiService)}
            {getStatusBadge(health.aiService)}
          </div>
        </div>

        {/* Admin Access */}
        {user && (
          <div className="flex items-center justify-between p-3 rounded-lg bg-surface/50">
            <div className="flex items-center gap-3">
              <Shield className="w-4 h-4 text-amber-400" />
              <span className="text-white text-sm">Acesso Administrativo</span>
            </div>
            <div className="flex items-center gap-2">
              {getStatusIcon(health.adminAccess)}
              {getStatusBadge(health.adminAccess)}
            </div>
          </div>
        )}
      </div>

      {/* Errors */}
      {health.errors.length > 0 && (
        <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-400" />
            <span className="text-red-400 font-medium text-sm">Erros Detectados</span>
          </div>
          <div className="space-y-2">
            {health.errors.map((error, index) => (
              <div key={index} className="text-red-300 text-xs">
                • {error}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Info */}
      {user && (
        <div className="mt-4 p-3 rounded-lg bg-surface/30 border border-line/20">
          <div className="text-xs text-text-2 mb-1">Usuário Atual</div>
          <div className="text-white text-sm">{user.email}</div>
          <div className="text-xs text-text-2 mt-1">
            Plano: {subscription.plan_type?.toUpperCase() || 'FREE'} | 
            Status: {subscription.subscribed ? 'ATIVO' : 'INATIVO'}
          </div>
        </div>
      )}
    </Card>
  );
};

export default SystemHealthDashboard;