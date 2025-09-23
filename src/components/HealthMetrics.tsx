import React, { useState, useEffect } from 'react';
import { Heart, Activity, Moon, Droplets, Smartphone, Watch, TrendingUp, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { HealthService, HealthData, DetailedHealthMetrics } from '@/services/HealthService';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function HealthMetrics() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [detailedMetrics, setDetailedMetrics] = useState<DetailedHealthMetrics | null>(null);
  const [healthPermission, setHealthPermission] = useState(false);
  const [connectedApps, setConnectedApps] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkHealthPermission();
  }, []);

  const checkHealthPermission = async () => {
    const hasPermission = await HealthService.requestPermissions();
    setHealthPermission(hasPermission);
    
    if (hasPermission) {
      loadHealthData();
    }
  };

  const loadHealthData = async () => {
    setLoading(true);
    try {
      const health = await HealthService.getHealthData();
      const detailed = await HealthService.getDetailedMetrics();
      const apps = HealthService.getConnectedApps();
      
      setHealthData(health);
      setDetailedMetrics(detailed);
      setConnectedApps(apps);
    } catch (error) {
      console.error('Erro ao carregar dados de saúde:', error);
    } finally {
      setLoading(false);
    }
  };

  const healthInsights = healthData ? [
    {
      icon: Activity,
      title: "Passos Hoje",
      value: healthData.steps.toLocaleString(),
      target: "10.000",
      progress: Math.min((healthData.steps / 10000) * 100, 100),
      status: healthData.steps >= 10000 ? 'excellent' : healthData.steps >= 7500 ? 'good' : 'needs_attention',
      trend: "+12% vs ontem"
    },
    {
      icon: Heart,
      title: "FC Repouso",
      value: `${healthData.restingHeartRate || 62}`,
      unit: "bpm",
      progress: Math.max(0, 100 - ((healthData.restingHeartRate || 62) - 40) * 2),
      status: (healthData.restingHeartRate || 62) < 60 ? 'excellent' : (healthData.restingHeartRate || 62) < 70 ? 'good' : 'needs_attention',
      trend: "-2 bpm vs semana passada"
    },
    {
      icon: Moon,
      title: "Sono",
      value: `${healthData.sleepHours || 7.5}`,
      unit: "horas",
      target: "8h",
      progress: Math.min(((healthData.sleepHours || 7.5) / 8) * 100, 100),
      status: (healthData.sleepHours || 7.5) >= 7.5 ? 'excellent' : (healthData.sleepHours || 7.5) >= 6.5 ? 'good' : 'needs_attention',
      trend: detailedMetrics ? `${detailedMetrics.sleepQuality.deep}% sono profundo` : "Qualidade boa"
    },
    {
      icon: Droplets,
      title: "Hidratação",
      value: `${healthData.hydrationLevel || 85}`,
      unit: "%",
      target: "100%",
      progress: healthData.hydrationLevel || 85,
      status: (healthData.hydrationLevel || 85) >= 80 ? 'excellent' : (healthData.hydrationLevel || 85) >= 60 ? 'good' : 'needs_attention',
      trend: "Baseado na atividade"
    }
  ] : [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-400 bg-green-400/10';
      case 'good': return 'text-yellow-400 bg-yellow-400/10';
      case 'needs_attention': return 'text-red-400 bg-red-400/10';
      default: return 'text-accent bg-accent/10';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'excellent': return 'Excelente';
      case 'good': return 'Bom';
      case 'needs_attention': return 'Atenção';
      default: return 'Normal';
    }
  };

  // Mock data para gráfico de evolução
  const healthTrendData = [
    { date: '01/09', steps: 8500, heartRate: 65, sleep: 7.2 },
    { date: '02/09', steps: 9200, heartRate: 63, sleep: 7.8 },
    { date: '03/09', steps: 10800, heartRate: 62, sleep: 8.1 },
    { date: '04/09', steps: 9600, heartRate: 64, sleep: 7.5 },
    { date: '05/09', steps: 11200, heartRate: 61, sleep: 7.9 },
    { date: '06/09', steps: 10500, heartRate: 62, sleep: 8.3 },
    { date: '07/09', steps: 9800, heartRate: 63, sleep: 7.6 }
  ];

  if (!healthPermission) {
    return (
      <div className="space-y-6">
        <Card className="glass">
          <CardContent className="p-8 text-center">
            <Smartphone className="w-16 h-16 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-txt mb-2">Conectar Apps de Saúde</h3>
            <p className="text-txt-2 mb-6 max-w-md mx-auto">
              Conecte seus aplicativos de saúde e fitness para obter métricas detalhadas 
              sobre sua recuperação e bem-estar geral.
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-center gap-2 text-sm text-txt-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Frequência cardíaca e variabilidade</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-txt-2">
                <Moon className="w-4 h-4 text-blue-400" />
                <span>Qualidade e duração do sono</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-txt-2">
                <Activity className="w-4 h-4 text-green-400" />
                <span>Passos e atividade diária</span>
              </div>
            </div>
            <Button onClick={checkHealthPermission} className="btn-premium" disabled={loading}>
              {loading ? 'Conectando...' : 'Conectar Agora'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connected Apps Status */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-txt">
            <Watch className="w-5 h-5 text-accent" />
            Apps Conectados
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {connectedApps.map((app) => (
              <Badge key={app} className="bg-accent/20 text-accent">
                {app}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {healthInsights.map((insight) => {
          const Icon = insight.icon;
          return (
            <Card key={insight.title} className="glass hover:bg-white/5 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-txt-2 flex-1 truncate">
                    {insight.title}
                  </span>
                  <Badge className={getStatusColor(insight.status)}>
                    {getStatusText(insight.status)}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-txt">
                      {insight.value}
                    </span>
                    {insight.unit && (
                      <span className="text-sm text-txt-3">{insight.unit}</span>
                    )}
                    {insight.target && (
                      <span className="text-xs text-txt-3 ml-1">/ {insight.target}</span>
                    )}
                  </div>
                  
                  {insight.progress !== undefined && (
                    <Progress value={insight.progress} className="h-2" />
                  )}
                  
                  <p className="text-xs text-txt-3">{insight.trend}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Health Trends Chart */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-txt">
            <TrendingUp className="w-5 h-5 text-accent" />
            Tendências da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={healthTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="date" stroke="#8892b0" />
                <YAxis stroke="#8892b0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--line))',
                    borderRadius: '8px'
                  }} 
                />
                <Line 
                  type="monotone" 
                  dataKey="steps" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 3 }}
                  name="Passos"
                />
                <Line 
                  type="monotone" 
                  dataKey="heartRate" 
                  stroke="hsl(var(--success))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 3 }}
                  name="FC Repouso"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Health Tips */}
      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-txt">
            <AlertCircle className="w-5 h-5 text-accent" />
            Dicas de Saúde
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-500/10">
              <Moon className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-txt mb-1">Melhore seu Sono</h4>
                <p className="text-sm text-txt-2">
                  Mantenha uma rotina regular, evite telas 1h antes de dormir e mantenha o quarto fresco.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-green-500/10">
              <Activity className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-txt mb-1">Atividade Regular</h4>
                <p className="text-sm text-txt-2">
                  Caminhe pelo menos 10.000 passos por dia. Suba escadas quando possível.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10">
              <Heart className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-txt mb-1">Saúde Cardiovascular</h4>
                <p className="text-sm text-txt-2">
                  Monitore sua FC de repouso. Uma FC mais baixa indica melhor condicionamento.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}