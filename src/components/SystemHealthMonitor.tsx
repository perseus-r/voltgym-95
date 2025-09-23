import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, CheckCircle, RefreshCw, Activity, Zap, Wifi, HardDrive } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { systemChecker, SystemCheckResult, PerformanceMetrics } from '@/utils/systemCheck';

interface SystemHealthMonitorProps {
  className?: string;
  compact?: boolean;
}

const SystemHealthMonitor: React.FC<SystemHealthMonitorProps> = ({ className = "", compact = false }) => {
  const [healthReport, setHealthReport] = useState<{
    overall: 'healthy' | 'warning' | 'error';
    results: SystemCheckResult[];
    metrics: PerformanceMetrics;
    summary: string;
  } | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<string>('');

  useEffect(() => {
    // Setup error monitoring
    systemChecker.setupErrorMonitoring();
    
    // Run initial check
    runHealthCheck();
    
    // Run periodic checks every 5 minutes
    const interval = setInterval(runHealthCheck, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const runHealthCheck = async () => {
    setIsRunning(true);
    try {
      await systemChecker.runSystemCheck();
      const report = systemChecker.getHealthReport();
      setHealthReport(report);
      setLastCheck(new Date().toLocaleTimeString('pt-BR'));
    } catch (error) {
      console.error('Health check failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: 'healthy' | 'warning' | 'error') => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <Shield className="w-4 h-4 text-red-500" />;
    }
  };

  const getComponentIcon = (component: string) => {
    switch (component) {
      case 'LocalStorage':
        return <HardDrive className="w-4 h-4" />;
      case 'WorkoutData':
        return <Activity className="w-4 h-4" />;
      case 'RenderPerformance':
        return <Zap className="w-4 h-4" />;
      case 'Memory':
        return <Activity className="w-4 h-4" />;
      case 'Network':
        return <Wifi className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  if (!healthReport) {
    return (
      <Card className={`glass-card p-4 ${className}`}>
        <div className="flex items-center gap-2">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-sm text-txt-2">Verificando sistema...</span>
        </div>
      </Card>
    );
  }

  if (compact) {
    return (
      <Card className={`glass-card p-3 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getStatusIcon(healthReport.overall)}
            <span className="text-sm font-medium text-txt">Sistema</span>
            <Badge 
              variant={healthReport.overall === 'healthy' ? 'default' : 'destructive'}
              className="text-xs"
            >
              {healthReport.overall === 'healthy' ? 'OK' : 
               healthReport.overall === 'warning' ? 'WARN' : 'ERROR'}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={runHealthCheck}
            disabled={isRunning}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
          </Button>
        </div>
        {lastCheck && (
          <p className="text-xs text-txt-3 mt-1">
            Última verificação: {lastCheck}
          </p>
        )}
      </Card>
    );
  }

  return (
    <Card className={`glass-card p-4 md:p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {getStatusIcon(healthReport.overall)}
          <h3 className="text-lg font-semibold text-txt">Saúde do Sistema</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={runHealthCheck}
          disabled={isRunning}
          className="glass-button"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isRunning ? 'animate-spin' : ''}`} />
          {isRunning ? 'Verificando...' : 'Atualizar'}
        </Button>
      </div>

      {/* Overall Status */}
      <div className="mb-4 p-3 rounded-lg bg-white/5">
        <div className="flex items-center gap-2 mb-2">
          {getStatusIcon(healthReport.overall)}
          <span className="font-medium text-txt">{healthReport.summary}</span>
        </div>
        {lastCheck && (
          <p className="text-sm text-txt-2">
            Última verificação: {lastCheck}
          </p>
        )}
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="text-center p-2 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-accent">
            {healthReport.metrics.renderTime.toFixed(0)}ms
          </div>
          <div className="text-xs text-txt-3">Render</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-accent">
            {healthReport.metrics.memoryUsage.toFixed(0)}%
          </div>
          <div className="text-xs text-txt-3">Memória</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-accent">
            {healthReport.metrics.networkLatency.toFixed(0)}ms
          </div>
          <div className="text-xs text-txt-3">Rede</div>
        </div>
        <div className="text-center p-2 rounded-lg bg-white/5">
          <div className="text-lg font-bold text-accent">
            {healthReport.metrics.errorCount}
          </div>
          <div className="text-xs text-txt-3">Erros</div>
        </div>
      </div>

      {/* Component Status */}
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-txt-2 mb-2">Status dos Componentes:</h4>
        {healthReport.results.map((result, index) => (
          <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-white/5">
            <div className="flex items-center gap-2">
              {getComponentIcon(result.component)}
              <span className="text-sm text-txt">{result.component}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-txt-2 max-w-32 truncate">
                {result.message}
              </span>
              {getStatusIcon(result.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Memory Usage Bar */}
      {healthReport.metrics.memoryUsage > 0 && (
        <div className="mt-4">
          <div className="flex justify-between text-sm mb-1">
            <span className="text-txt-2">Uso de Memória</span>
            <span className="text-txt-2">{healthReport.metrics.memoryUsage.toFixed(1)}%</span>
          </div>
          <Progress 
            value={healthReport.metrics.memoryUsage} 
            className="h-2"
          />
        </div>
      )}
    </Card>
  );
};

export default SystemHealthMonitor;