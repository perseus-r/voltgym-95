import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { databaseService } from '@/services/DatabaseService';
import { getWorkoutHistory } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, TrendingUp, Activity, BarChart3 } from 'lucide-react';
import { format, startOfWeek, addDays, startOfMonth, addMonths, startOfYear, addYears, isWithinInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChartDataPoint {
  period: string;
  volume: number;
  sessions: number;
  avgWeight: number;
  exercises: number;
}

export default function ComparativeCharts() {
  const { user } = useAuth();
  const [timeRange, setTimeRange] = useState('weeks');
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMetric, setSelectedMetric] = useState('volume');

  useEffect(() => {
    loadChartData();
  }, [user, timeRange]);

  const loadChartData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // Buscar dados do banco e localStorage
      const [dbStats, localHistory] = await Promise.all([
        databaseService.getUserWorkoutStats(user.id),
        Promise.resolve(getWorkoutHistory(user.id))
      ]);

      // Processar dados por período
      const processedData = processDataByTimeRange(dbStats, localHistory);
      setChartData(processedData);
    } catch (error) {
      console.error('Erro ao carregar dados dos gráficos:', error);
    } finally {
      setLoading(false);
    }
  };

  const processDataByTimeRange = (dbStats: any, localHistory: any[]) => {
    const now = new Date();
    let periods: Date[] = [];
    let formatString = '';

    switch (timeRange) {
      case 'days':
        // Últimos 14 dias
        for (let i = 13; i >= 0; i--) {
          periods.push(addDays(now, -i));
        }
        formatString = 'dd/MM';
        break;
      
      case 'weeks':
        // Últimas 12 semanas
        for (let i = 11; i >= 0; i--) {
          periods.push(startOfWeek(addDays(now, -i * 7)));
        }
        formatString = "'Sem' dd/MM";
        break;
      
      case 'months':
        // Últimos 12 meses
        for (let i = 11; i >= 0; i--) {
          periods.push(startOfMonth(addMonths(now, -i)));
        }
        formatString = 'MMM yyyy';
        break;
      
      case 'years':
        // Últimos 5 anos
        for (let i = 4; i >= 0; i--) {
          periods.push(startOfYear(addYears(now, -i)));
        }
        formatString = 'yyyy';
        break;
    }

    return periods.map(periodStart => {
      let periodEnd: Date;
      
      switch (timeRange) {
        case 'days':
          periodEnd = addDays(periodStart, 1);
          break;
        case 'weeks':
          periodEnd = addDays(periodStart, 7);
          break;
        case 'months':
          periodEnd = addMonths(periodStart, 1);
          break;
        case 'years':
          periodEnd = addYears(periodStart, 1);
          break;
        default:
          periodEnd = addDays(periodStart, 1);
      }

      // Filtrar dados do período
      const periodData = localHistory.filter(entry => {
        const entryDate = new Date(entry.ts);
        return isWithinInterval(entryDate, { start: periodStart, end: periodEnd });
      });

      // Calcular métricas
      const totalVolume = periodData.reduce((sum, entry) => {
        return sum + entry.items.reduce((itemSum: number, item: any) => itemSum + (item.carga || 0), 0);
      }, 0);

      const totalExercises = periodData.reduce((sum, entry) => sum + entry.items.length, 0);
      
      const allWeights = periodData.flatMap(entry => 
        entry.items.map((item: any) => item.carga || 0).filter(w => w > 0)
      );
      const avgWeight = allWeights.length > 0 ? allWeights.reduce((a, b) => a + b, 0) / allWeights.length : 0;

      return {
        period: format(periodStart, formatString, { locale: ptBR }),
        volume: totalVolume,
        sessions: periodData.length,
        avgWeight: Math.round(avgWeight),
        exercises: totalExercises
      };
    });
  };

  const getChartTitle = () => {
    switch (timeRange) {
      case 'days': return '📅 Comparativo Diário (14 dias)';
      case 'weeks': return '📊 Comparativo Semanal (12 semanas)';
      case 'months': return '📈 Comparativo Mensal (12 meses)';
      case 'years': return '🎯 Comparativo Anual (5 anos)';
      default: return '📊 Comparativo de Treinos';
    }
  };

  const getMetricConfig = () => {
    switch (selectedMetric) {
      case 'volume':
        return { 
          dataKey: 'volume', 
          label: 'Volume Total (kg)', 
          color: 'hsl(var(--accent))',
          icon: '🏋️'
        };
      case 'sessions':
        return { 
          dataKey: 'sessions', 
          label: 'Sessões de Treino', 
          color: '#ffd700',
          icon: '📅'
        };
      case 'avgWeight':
        return { 
          dataKey: 'avgWeight', 
          label: 'Peso Médio (kg)', 
          color: '#ff6b6b',
          icon: '⚖️'
        };
      case 'exercises':
        return { 
          dataKey: 'exercises', 
          label: 'Total de Exercícios', 
          color: '#7fff7f',
          icon: '🎯'
        };
      default:
        return { 
          dataKey: 'volume', 
          label: 'Volume Total (kg)', 
          color: 'hsl(var(--accent))',
          icon: '🏋️'
        };
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        <p className="text-txt-2">Carregando gráficos comparativos...</p>
      </div>
    );
  }

  const metricConfig = getMetricConfig();

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="text-sm font-medium text-txt mb-2 block">Período de Comparação</label>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="bg-input-bg border-input-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="days">📅 Últimos 14 Dias</SelectItem>
              <SelectItem value="weeks">📊 Últimas 12 Semanas</SelectItem>
              <SelectItem value="months">📈 Últimos 12 Meses</SelectItem>
              <SelectItem value="years">🎯 Últimos 5 Anos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex-1">
          <label className="text-sm font-medium text-txt mb-2 block">Métrica</label>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="bg-input-bg border-input-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="volume">🏋️ Volume Total</SelectItem>
              <SelectItem value="sessions">📅 Sessões de Treino</SelectItem>
              <SelectItem value="avgWeight">⚖️ Peso Médio</SelectItem>
              <SelectItem value="exercises">🎯 Total de Exercícios</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Chart */}
      <Card className="p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-txt mb-2">
            {getChartTitle()}
          </h3>
          <p className="text-sm text-txt-2">
            {metricConfig.icon} Comparando: {metricConfig.label}
          </p>
        </div>

        <Tabs defaultValue="line" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="line">📈 Linha</TabsTrigger>
            <TabsTrigger value="bar">📊 Barras</TabsTrigger>
            <TabsTrigger value="area">🌊 Área</TabsTrigger>
          </TabsList>

          <TabsContent value="line">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="period" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => `Período: ${value}`}
                    formatter={(value, name) => [value, metricConfig.label]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey={metricConfig.dataKey}
                    stroke={metricConfig.color}
                    strokeWidth={3}
                    dot={{ fill: metricConfig.color, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="bar">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="period" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => `Período: ${value}`}
                    formatter={(value, name) => [value, metricConfig.label]}
                  />
                  <Bar 
                    dataKey={metricConfig.dataKey}
                    fill={metricConfig.color}
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="area">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="period" 
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    labelFormatter={(value) => `Período: ${value}`}
                    formatter={(value, name) => [value, metricConfig.label]}
                  />
                  <Area 
                    type="monotone" 
                    dataKey={metricConfig.dataKey}
                    stroke={metricConfig.color}
                    fill={`${metricConfig.color}40`}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { key: 'volume', icon: '🏋️', label: 'Volume Total', color: 'text-accent' },
          { key: 'sessions', icon: '📅', label: 'Sessões', color: 'text-yellow-400' },
          { key: 'avgWeight', icon: '⚖️', label: 'Peso Médio', color: 'text-red-400' },
          { key: 'exercises', icon: '🎯', label: 'Exercícios', color: 'text-green-400' }
        ].map(({ key, icon, label, color }) => {
          const total = chartData.reduce((sum, item) => sum + (item[key as keyof ChartDataPoint] as number), 0);
          const avg = chartData.length > 0 ? Math.round(total / chartData.length) : 0;
          
          return (
            <Card key={key} className="p-4 text-center">
              <div className="text-2xl mb-1">{icon}</div>
              <div className={`text-lg font-bold ${color}`}>
                {key === 'volume' ? `${total.toLocaleString()}kg` : 
                 key === 'avgWeight' ? `${avg}kg` : 
                 total.toLocaleString()}
              </div>
              <div className="text-xs text-txt-3">{label}</div>
              <div className="text-xs text-txt-3 mt-1">
                Média: {key === 'avgWeight' ? `${avg}kg` : avg}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}