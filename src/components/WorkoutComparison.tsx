import { useState } from 'react';
import { ArrowLeftRight, TrendingUp, TrendingDown, Calendar, BarChart3 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getStorage } from '@/lib/storage';

interface WorkoutComparisonProps {
  className?: string;
}

export function WorkoutComparison({ className = "" }: WorkoutComparisonProps) {
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  const [comparisonType, setComparisonType] = useState<'volume' | 'rpe' | 'duration'>('volume');
  
  const workoutHistory = getStorage('bora_hist_v1', []);
  
  // Group workouts by focus area
  const workoutsByFocus = workoutHistory.reduce((acc: any, workout: any) => {
    const focus = workout.focus || 'Geral';
    if (!acc[focus]) acc[focus] = [];
    acc[focus].push(workout);
    return acc;
  }, {});

  const focusAreas = Object.keys(workoutsByFocus);

  const getWorkoutMetrics = (workout: any) => {
    const volume = workout.items?.reduce((sum: number, item: any) => sum + (item.carga || 0), 0) || 0;
    const avgRPE = workout.items?.length ? 
      workout.items.reduce((sum: number, item: any) => sum + (item.rpe || 0), 0) / workout.items.length : 0;
    const duration = 45; // Placeholder, poderia vir do workout
    
    return { volume, avgRPE, duration };
  };

  const generateComparisonData = () => {
    if (selectedWorkouts.length < 2) return [];

    const selectedData = selectedWorkouts.map(focusArea => {
      const workouts = workoutsByFocus[focusArea] || [];
      const recentWorkouts = workouts.slice(-5); // Last 5 workouts
      
      return recentWorkouts.map((workout: any, index: number) => {
        const metrics = getWorkoutMetrics(workout);
        return {
          session: `#${index + 1}`,
          [focusArea]: metrics[comparisonType],
          date: new Date(workout.ts).toLocaleDateString()
        };
      });
    });

    // Combine data by session
    const maxLength = Math.max(...selectedData.map(data => data.length));
    const combinedData = [];

    for (let i = 0; i < maxLength; i++) {
      const dataPoint: any = { session: `#${i + 1}` };
      selectedWorkouts.forEach((focusArea, index) => {
        if (selectedData[index] && selectedData[index][i]) {
          dataPoint[focusArea] = selectedData[index][i][focusArea];
        }
      });
      combinedData.push(dataPoint);
    }

    return combinedData;
  };

  const getComparisonSummary = () => {
    if (selectedWorkouts.length < 2) return null;

    const summaries = selectedWorkouts.map(focusArea => {
      const workouts = workoutsByFocus[focusArea] || [];
      const recent = workouts.slice(-3);
      const previous = workouts.slice(-6, -3);

      const recentAvg = recent.reduce((sum: number, w: any) => {
        const metrics = getWorkoutMetrics(w);
        return sum + metrics[comparisonType];
      }, 0) / recent.length;

      const previousAvg = previous.length ? previous.reduce((sum: number, w: any) => {
        const metrics = getWorkoutMetrics(w);
        return sum + metrics[comparisonType];
      }, 0) / previous.length : recentAvg;

      const trend = ((recentAvg - previousAvg) / previousAvg) * 100;

      return {
        focusArea,
        current: recentAvg,
        trend,
        workoutCount: workouts.length
      };
    });

    return summaries;
  };

  const handleFocusToggle = (focusArea: string) => {
    setSelectedWorkouts(prev => 
      prev.includes(focusArea) 
        ? prev.filter(f => f !== focusArea)
        : prev.length < 3 ? [...prev, focusArea] : prev
    );
  };

  const comparisonData = generateComparisonData();
  const summary = getComparisonSummary();

  const getMetricLabel = () => {
    switch (comparisonType) {
      case 'volume': return 'Volume (kg)';
      case 'rpe': return 'RPE Médio';
      case 'duration': return 'Duração (min)';
      default: return '';
    }
  };

  const colors = ['hsl(var(--accent))', 'hsl(var(--accent-2))', 'hsl(var(--success))'];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gradient">
            Comparação de Treinos
          </h2>
          <p className="text-txt-2">Compare diferentes tipos de treino</p>
        </div>
        
        <Select value={comparisonType} onValueChange={(value: any) => setComparisonType(value)}>
          <SelectTrigger className="w-48 glass-card border-line/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="volume">Volume Total</SelectItem>
            <SelectItem value="rpe">RPE Médio</SelectItem>
            <SelectItem value="duration">Duração</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Focus Area Selection */}
      <Card className="glass-card p-6">
        <h3 className="text-lg font-semibold mb-4 text-txt">
          Selecione os Tipos de Treino (máx. 3)
        </h3>
        <div className="flex flex-wrap gap-2">
          {focusAreas.map(focusArea => (
            <Button
              key={focusArea}
              onClick={() => handleFocusToggle(focusArea)}
              variant={selectedWorkouts.includes(focusArea) ? "default" : "outline"}
              size="sm"
              className={`glass-button transition-all duration-300 ${
                selectedWorkouts.includes(focusArea) 
                  ? 'bg-accent text-accent-ink scale-105' 
                  : 'hover:scale-105'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4 mr-2" />
              {focusArea}
              <Badge className="ml-2 text-xs bg-surface/50">
                {workoutsByFocus[focusArea]?.length || 0}
              </Badge>
            </Button>
          ))}
        </div>
      </Card>

      {selectedWorkouts.length === 0 && (
        <Card className="glass-card p-8 text-center">
          <BarChart3 className="w-12 h-12 text-txt-3 mx-auto mb-4" />
          <div className="text-txt-2">Selecione pelo menos 2 tipos de treino</div>
          <div className="text-sm text-txt-3">para visualizar a comparação</div>
        </Card>
      )}

      {selectedWorkouts.length >= 2 && (
        <>
          {/* Summary Cards */}
          {summary && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {summary.map((item, index) => (
                <Card key={item.focusArea} className="glass-card p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-txt">{item.focusArea}</h4>
                      <Badge 
                        className={`${
                          item.trend > 0 ? 'bg-success/20 text-success' : 
                          item.trend < 0 ? 'bg-error/20 text-error' : 
                          'bg-surface text-txt-2'
                        }`}
                      >
                        {item.trend > 0 ? (
                          <TrendingUp className="w-3 h-3 mr-1" />
                        ) : (
                          <TrendingDown className="w-3 h-3 mr-1" />
                        )}
                        {Math.abs(item.trend).toFixed(1)}%
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-accent">
                        {item.current.toFixed(1)}
                      </div>
                      <div className="text-sm text-txt-3">
                        {getMetricLabel()} • {item.workoutCount} treinos
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Comparison Chart */}
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-txt">
              Evolução Comparativa - {getMetricLabel()}
            </h3>
            
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="session" stroke="#8892b0" />
                <YAxis stroke="#8892b0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--line))',
                    borderRadius: '8px'
                  }} 
                />
                {selectedWorkouts.map((focusArea, index) => (
                  <Line
                    key={focusArea}
                    type="monotone"
                    dataKey={focusArea}
                    stroke={colors[index]}
                    strokeWidth={3}
                    dot={{ fill: colors[index], strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7 }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
            
            <div className="flex flex-wrap gap-4 mt-4 justify-center">
              {selectedWorkouts.map((focusArea, index) => (
                <div key={focusArea} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: colors[index] }}
                  />
                  <span className="text-sm text-txt-2">{focusArea}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Insights */}
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-txt">
              💡 Insights da Comparação
            </h3>
            <div className="space-y-3">
              {summary?.map(item => {
                const insight = item.trend > 10 ? 
                  `${item.focusArea} está evoluindo muito bem (+${item.trend.toFixed(1)}%)!` :
                  item.trend > 0 ?
                  `${item.focusArea} mostra progresso constante (+${item.trend.toFixed(1)}%).` :
                  item.trend < -10 ?
                  `${item.focusArea} pode precisar de ajustes (${item.trend.toFixed(1)}%).` :
                  `${item.focusArea} está estável.`;
                
                return (
                  <div key={item.focusArea} className="flex items-start gap-3 p-3 rounded-lg bg-surface/30">
                    <Calendar className="w-5 h-5 text-accent mt-0.5" />
                    <div className="text-sm text-txt-2">{insight}</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </>
      )}
    </div>
  );
}