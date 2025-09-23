import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, BarChart3, Activity, Target, Calendar } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getWorkoutHistory } from '@/lib/storage';
import { WorkoutService } from '@/services/WorkoutService';
import { format, subDays, isAfter, startOfWeek, startOfMonth, startOfYear } from 'date-fns';

interface EnhancedExerciseChartProps {
  selectedExercise: string;
  className?: string;
}

interface ExerciseData {
  date: string;
  weight: number;
  volume: number;
  rpe: number;
  reps: number;
  sets: number;
  sessionName: string;
}

interface MetricSummary {
  current: number;
  previous: number;
  trend: number;
  label: string;
}

export function EnhancedExerciseChart({ selectedExercise, className = "" }: EnhancedExerciseChartProps) {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<ExerciseData[]>([]);
  const [chartType, setChartType] = useState<'line' | 'bar' | 'area'>('line');
  const [metric, setMetric] = useState<'weight' | 'volume' | 'rpe'>('weight');
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | '180d' | '365d' | 'all'>('30d');
  const [groupBy, setGroupBy] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [summary, setSummary] = useState<MetricSummary | null>(null);

  useEffect(() => {
    if (selectedExercise) {
      loadExerciseData();
    }
  }, [selectedExercise, timeRange, user]);

  const loadExerciseData = async () => {
    try {
      // Get data from both local storage and Supabase
      const localHistory = getWorkoutHistory(user?.id || 'demo');
      const supabaseHistory = await WorkoutService.getUserWorkoutHistory(100);

      // Process local data
      const localData: ExerciseData[] = [];
      localHistory.forEach(entry => {
        entry.items.forEach(item => {
          if (item.name === selectedExercise) {
            localData.push({
              date: entry.ts,
              weight: item.carga || 0,
              volume: (item.carga || 0) * 10, // Assuming 10 reps as default
              rpe: item.rpe || 0,
              reps: 10, // Default for local data
              sets: 1, // Default for local data
              sessionName: entry.focus
            });
          }
        });
      });

      // Process Supabase data
      const supabaseData: ExerciseData[] = [];
      supabaseHistory.forEach(session => {
        session.exercise_logs?.forEach(exerciseLog => {
          if (exerciseLog.exercises?.name === selectedExercise) {
            exerciseLog.set_logs?.forEach(setLog => {
              if (setLog.weight && setLog.reps) {
                supabaseData.push({
                  date: session.started_at,
                  weight: setLog.weight,
                  volume: setLog.weight * setLog.reps,
                  rpe: setLog.rpe || 0,
                  reps: setLog.reps,
                  sets: setLog.set_number,
                  sessionName: session.focus
                });
              }
            });
          }
        });
      });

      // Combine and filter by time range
      const allData = [...localData, ...supabaseData];
      const filteredData = filterByTimeRange(allData);
      
      // Group by date and get max values for each day
      const groupedData = groupDataByDate(filteredData);
      
      setChartData(groupedData);
      calculateSummary(groupedData);

    } catch (error) {
      console.error('Error loading exercise data:', error);
    }
  };

  const filterByTimeRange = (data: ExerciseData[]): ExerciseData[] => {
    if (timeRange === 'all') return data;

    const days = timeRange === '7d' 
      ? 7 
      : timeRange === '30d' 
      ? 30 
      : timeRange === '90d' 
      ? 90 
      : timeRange === '180d'
      ? 180
      : 365; // '365d'
    const cutoffDate = subDays(new Date(), days);

    return data.filter(item => isAfter(new Date(item.date), cutoffDate));
  };

  const groupDataByDate = (data: ExerciseData[]): ExerciseData[] => {
    const grouped = new Map<string, ExerciseData>();

    data.forEach(item => {
      const dateKey = format(new Date(item.date), 'yyyy-MM-dd');
      const existing = grouped.get(dateKey);

      if (!existing || item[metric] > existing[metric]) {
        grouped.set(dateKey, {
          ...item,
          date: dateKey
        });
      }
    });

    return Array.from(grouped.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const calculateSummary = (data: ExerciseData[]) => {
    if (data.length < 2) {
      setSummary(null);
      return;
    }

    const latest = data[data.length - 1];
    const previous = data[data.length - 2];
    
    const current = latest[metric];
    const prev = previous[metric];
    const trend = prev > 0 ? ((current - prev) / prev) * 100 : 0;

    setSummary({
      current,
      previous: prev,
      trend,
      label: getMetricLabel()
    });
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'weight': return 'Carga (kg)';
      case 'volume': return 'Volume (kg)';
      case 'rpe': return 'RPE';
      default: return '';
    }
  };

  const getMetricColor = () => {
    switch (metric) {
      case 'weight': return '#7bdcff';
      case 'volume': return '#ffd700';
      case 'rpe': return '#ff6b6b';
      default: return '#7bdcff';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-card border border-line rounded-lg p-3 shadow-lg">
          <p className="text-txt font-semibold">{format(new Date(label), 'dd/MM/yyyy')}</p>
          <p className="text-accent">{data.sessionName}</p>
          <p className="text-txt-2">
            <span className="font-medium">{getMetricLabel()}:</span> {payload[0].value}
            {metric === 'weight' && ' kg'}
            {metric === 'volume' && ' kg'}
          </p>
          {data.reps && data.sets && (
            <p className="text-txt-3 text-sm">
              {data.sets} série{data.sets > 1 ? 's' : ''} × {data.reps} reps
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    };

    switch (chartType) {
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#8892b0"
              tickFormatter={(value) => format(new Date(value), 'dd/MM')}
            />
            <YAxis stroke="#8892b0" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey={metric} fill={getMetricColor()} radius={[4, 4, 0, 0]} />
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#8892b0"
              tickFormatter={(value) => format(new Date(value), 'dd/MM')}
            />
            <YAxis stroke="#8892b0" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey={metric} 
              stroke={getMetricColor()} 
              fill={`${getMetricColor()}30`} 
              strokeWidth={3}
            />
          </AreaChart>
        );
      
      default:
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="date" 
              stroke="#8892b0"
              tickFormatter={(value) => format(new Date(value), 'dd/MM')}
            />
            <YAxis stroke="#8892b0" />
            <Tooltip content={<CustomTooltip />} />
            <Line 
              type="monotone" 
              dataKey={metric} 
              stroke={getMetricColor()} 
              strokeWidth={3}
              dot={{ fill: getMetricColor(), strokeWidth: 2, r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        );
    }
  };

  if (!selectedExercise) {
    return (
      <Card className={`glass-card p-8 text-center ${className}`}>
        <BarChart3 className="w-12 h-12 text-txt-3 mx-auto mb-4" />
        <div className="text-txt-2">Selecione um exercício</div>
        <div className="text-sm text-txt-3">para ver o gráfico de progresso</div>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Controls */}
      <div className="flex flex-wrap gap-4 items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-txt">{selectedExercise}</h3>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Select value={metric} onValueChange={(value: any) => setMetric(value)}>
            <SelectTrigger className="w-32 glass-card border-line/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weight">Carga</SelectItem>
              <SelectItem value="volume">Volume</SelectItem>
              <SelectItem value="rpe">RPE</SelectItem>
            </SelectContent>
          </Select>

          <Select value={chartType} onValueChange={(value: any) => setChartType(value)}>
            <SelectTrigger className="w-28 glass-card border-line/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="line">Linha</SelectItem>
              <SelectItem value="bar">Barras</SelectItem>
              <SelectItem value="area">Área</SelectItem>
            </SelectContent>
          </Select>

          <Select value={timeRange} onValueChange={(value: any) => setTimeRange(value)}>
            <SelectTrigger className="w-28 glass-card border-line/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="180d">6 meses</SelectItem>
              <SelectItem value="365d">12 meses</SelectItem>
              <SelectItem value="all">Tudo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <Target className="w-5 h-5 text-accent" />
              <div>
                <div className="text-2xl font-bold text-txt">{summary.current}</div>
                <div className="text-sm text-txt-2">Atual - {summary.label}</div>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-txt-2" />
              <div>
                <div className="text-2xl font-bold text-txt-2">{summary.previous}</div>
                <div className="text-sm text-txt-3">Anterior</div>
              </div>
            </div>
          </Card>

          <Card className="glass-card p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className={`w-5 h-5 ${summary.trend >= 0 ? 'text-green-400' : 'text-red-400'}`} />
              <div>
                <div className={`text-2xl font-bold ${summary.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {summary.trend >= 0 ? '+' : ''}{summary.trend.toFixed(1)}%
                </div>
                <div className="text-sm text-txt-3">Mudança</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Chart */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-lg font-semibold text-txt">
            Evolução - {getMetricLabel()}
          </h4>
          <Badge className="bg-accent/20 text-accent">
            {chartData.length} registros
          </Badge>
        </div>

        {chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-txt-3">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <div>Nenhum dado encontrado</div>
              <div className="text-sm">para o período selecionado</div>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            {renderChart()}
          </ResponsiveContainer>
        )}

        {/* Data points summary */}
        {chartData.length > 0 && (
          <div className="mt-4 pt-4 border-t border-line/20">
            <div className="flex justify-between text-sm text-txt-2">
              <span>Primeiro registro: {format(new Date(chartData[0].date), 'dd/MM/yyyy')}</span>
              <span>Último registro: {format(new Date(chartData[chartData.length - 1].date), 'dd/MM/yyyy')}</span>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}