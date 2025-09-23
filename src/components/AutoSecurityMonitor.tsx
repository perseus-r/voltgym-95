import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, CheckCircle, AlertTriangle, XCircle, Zap } from 'lucide-react';
import { autoSecurityService } from '@/services/AutoSecurityService';

const ENABLE_MONITOR_UI = false; // Modo silencioso: não exibir UI

const AutoSecurityMonitor: React.FC = () => {
  if (!ENABLE_MONITOR_UI) return null;
  const [healthStatus, setHealthStatus] = useState(autoSecurityService.getHealthStatus());
  const [events, setEvents] = useState(autoSecurityService.getSecurityEvents());
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setHealthStatus(autoSecurityService.getHealthStatus());
      setEvents(autoSecurityService.getSecurityEvents());
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (healthStatus.status) {
      case 'healthy':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  };

  const getStatusColor = () => {
    switch (healthStatus.status) {
      case 'healthy': return 'text-green-600 bg-green-50 border-green-200';
      case 'warning': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsOpen(true)}
          className={`flex items-center gap-2 ${getStatusColor()}`}
        >
          <Shield className="w-4 h-4" />
          {getStatusIcon()}
          <span className="text-sm font-medium">
            IA Segurança
          </span>
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80">
      <Card className="border-line shadow-elegant">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-accent" />
              IA de Segurança Automática
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(false)}
              className="h-6 w-6 p-0"
            >
              ×
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Status Geral */}
          <div className={`flex items-center gap-2 p-2 rounded border ${getStatusColor()}`}>
            {getStatusIcon()}
            <span className="text-sm font-medium">
              Status: {healthStatus.status === 'healthy' ? 'Saudável' : 
                      healthStatus.status === 'warning' ? 'Atenção' : 'Crítico'}
            </span>
            {healthStatus.issues > 0 && (
              <Badge variant="secondary" className="ml-auto">
                {healthStatus.issues} problemas
              </Badge>
            )}
          </div>

          {/* Eventos Recentes */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-text">Últimas Ações</h4>
            <div className="max-h-32 overflow-y-auto space-y-1">
              {events.slice(-5).reverse().map((event, index) => (
                <div key={index} className="text-xs p-2 bg-surface rounded border-line border">
                  <div className="flex items-center gap-2">
                    {event.resolved ? (
                      <CheckCircle className="w-3 h-3 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-3 h-3 text-yellow-500" />
                    )}
                    <span className="font-medium">{event.component}</span>
                    <span className="text-text-2">
                      {event.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {event.solution && (
                    <p className="text-green-600 mt-1">
                      ✓ {event.solution}
                    </p>
                  )}
                </div>
              ))}
              
              {events.length === 0 && (
                <div className="text-center text-text-2 py-4">
                  <Zap className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-sm">Sistema funcionando perfeitamente!</p>
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="text-xs text-text-2 bg-surface p-2 rounded border-line border">
            <p>🤖 IA monitora e corrige problemas automaticamente</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AutoSecurityMonitor;