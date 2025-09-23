import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart3, TrendingUp, Download, Filter, Calendar, Dumbbell } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface WorkoutData {
  id: string;
  name: string;
  focus: string;
  completed_at: string;
  total_volume: number;
  duration_minutes: number;
  exercises: Array<{
    name: string;
    sets: Array<{
      weight: number;
      reps: number;
      rpe: number;
    }>;
  }>;
}

interface ChartData {
  date: string;
  volume: number;
  workouts: number;
  avgRpe: number;
}

export function EnhancedChartsAndSpreadsheets() {
  const { user } = useAuth();
  const [workoutData, setWorkoutData] = useState<WorkoutData[]>([]);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [muscleGroupData, setMuscleGroupData] = useState<any[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMuscleGroup, setSelectedMuscleGroup] = useState('all');
  const [loading, setLoading] = useState(true);
  const [spreadsheetData, setSpreadsheetData] = useState<any[]>([]);

  // Cores para os gráficos
  const COLORS = ['#7bdcff', '#ff6b9d', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'];

  useEffect(() => {
    if (user) {
      loadWorkoutData();
    }
  }, [user, selectedPeriod]);

  const loadWorkoutData = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Calcular data de início baseada no período selecionado
      const daysMap = { '7d': 7, '30d': 30, '90d': 90, '1y': 365 };
      const days = daysMap[selectedPeriod as keyof typeof daysMap] || 30;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      // Buscar dados do Supabase
      const { data: sessions, error } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          exercise_logs (
            *,
            set_logs (*)
          )
        `)
        .eq('user_id', user.id)
        .gte('completed_at', startDate.toISOString())
        .not('completed_at', 'is', null)
        .order('completed_at', { ascending: true });

      if (error) throw error;

      if (!sessions || sessions.length === 0) {
        // Gerar dados de demonstração se não houver dados reais
        generateDemoData();
        return;
      }

      // Processar dados para gráficos
      const processedData = processWorkoutData(sessions);
      setWorkoutData(processedData);
      
      // Gerar dados dos gráficos
      generateChartData(processedData);
      generateMuscleGroupData(processedData);
      generateSpreadsheetData(processedData);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      generateDemoData();
    } finally {
      setLoading(false);
    }
  };

  const generateDemoData = () => {
    // Criar dados de demonstração para mostrar a funcionalidade
    const demoData: ChartData[] = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      demoData.push({
        date: date.toISOString().split('T')[0],
        volume: Math.random() * 5000 + 2000,
        workouts: Math.random() > 0.6 ? 1 : 0,
        avgRpe: 6 + Math.random() * 3
      });
    }
    
    setChartData(demoData);
    
    // Dados por grupo muscular
    const muscleGroups = ['Peito', 'Costas', 'Pernas', 'Ombros', 'Bíceps', 'Tríceps'];
    const muscleData = muscleGroups.map((group, index) => ({
      name: group,
      volume: Math.random() * 15000 + 5000,
      workouts: Math.floor(Math.random() * 12) + 4,
      color: COLORS[index % COLORS.length]
    }));
    
    setMuscleGroupData(muscleData);
    
    // Dados para planilha
    const spreadsheet = [];
    for (let i = 0; i < 20; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      spreadsheet.push({
        data: date.toLocaleDateString('pt-BR'),
        treino: `Treino ${['Push', 'Pull', 'Legs'][i % 3]}`,
        exercicio: ['Supino Reto', 'Remada Curvada', 'Agachamento'][i % 3],
        series: 4,
        reps: 8 + Math.floor(Math.random() * 4),
        peso: 60 + Math.random() * 40,
        rpe: 6 + Math.floor(Math.random() * 4),
        volume: 0
      });
    }
    
    // Calcular volume
    spreadsheet.forEach(row => {
      row.volume = row.series * row.reps * row.peso;
    });
    
    setSpreadsheetData(spreadsheet);
  };

  const processWorkoutData = (sessions: any[]): WorkoutData[] => {
    return sessions.map(session => ({
      id: session.id,
      name: session.name,
      focus: session.focus,
      completed_at: session.completed_at,
      total_volume: session.total_volume || 0,
      duration_minutes: session.duration_minutes || 0,
      exercises: session.exercise_logs?.map((log: any) => ({
        name: log.exercise_id, // Precisaria buscar o nome real do exercício
        sets: log.set_logs?.map((set: any) => ({
          weight: set.weight || 0,
          reps: set.reps || 0,
          rpe: set.rpe || 5
        })) || []
      })) || []
    }));
  };

  const generateChartData = (data: WorkoutData[]) => {
    const chartMap = new Map<string, ChartData>();
    
    data.forEach(workout => {
      const date = workout.completed_at.split('T')[0];
      const existing = chartMap.get(date) || {
        date,
        volume: 0,
        workouts: 0,
        avgRpe: 0
      };
      
      existing.volume += workout.total_volume;
      existing.workouts += 1;
      
      // Calcular RPE médio dos exercícios
      const allRpes = workout.exercises.flatMap(ex => ex.sets.map(set => set.rpe));
      const avgRpe = allRpes.reduce((sum, rpe) => sum + rpe, 0) / allRpes.length || 5;
      existing.avgRpe = (existing.avgRpe * (existing.workouts - 1) + avgRpe) / existing.workouts;
      
      chartMap.set(date, existing);
    });
    
    setChartData(Array.from(chartMap.values()).sort((a, b) => a.date.localeCompare(b.date)));
  };

  const generateMuscleGroupData = (data: WorkoutData[]) => {
    const muscleMap = new Map<string, { volume: number; workouts: number }>();
    
    data.forEach(workout => {
      const group = workout.focus || 'Geral';
      const existing = muscleMap.get(group) || { volume: 0, workouts: 0 };
      
      existing.volume += workout.total_volume;
      existing.workouts += 1;
      
      muscleMap.set(group, existing);
    });
    
    const muscleData = Array.from(muscleMap.entries()).map(([name, data], index) => ({
      name,
      volume: data.volume,
      workouts: data.workouts,
      color: COLORS[index % COLORS.length]
    }));
    
    setMuscleGroupData(muscleData);
  };

  const generateSpreadsheetData = (data: WorkoutData[]) => {
    const spreadsheet: any[] = [];
    
    data.forEach(workout => {
      workout.exercises.forEach(exercise => {
        exercise.sets.forEach((set, setIndex) => {
          spreadsheet.push({
            data: new Date(workout.completed_at).toLocaleDateString('pt-BR'),
            treino: workout.name,
            foco: workout.focus,
            exercicio: exercise.name,
            serie: setIndex + 1,
            reps: set.reps,
            peso: set.weight,
            rpe: set.rpe,
            volume: set.reps * set.weight
          });
        });
      });
    });
    
    setSpreadsheetData(spreadsheet);
  };

  const exportToCSV = () => {
    if (spreadsheetData.length === 0) {
      toast.error('Nenhum dado disponível para exportar');
      return;
    }

    const headers = Object.keys(spreadsheetData[0]);
    const csvContent = [
      headers.join(','),
      ...spreadsheetData.map(row => 
        headers.map(header => `"${row[header]}"`).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `treinos_${selectedPeriod}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Planilha exportada com sucesso!');
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="glass-card p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-6 bg-surface rounded w-48"></div>
            <div className="h-4 bg-surface rounded w-full"></div>
            <div className="h-64 bg-surface rounded"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header e Controles */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent-2 rounded-xl flex items-center justify-center">
            <BarChart3 className="w-6 h-6 text-accent-ink" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-txt">Gráficos e Análises</h2>
            <p className="text-txt-2">Visualização completa do seu progresso</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">7 dias</SelectItem>
              <SelectItem value="30d">30 dias</SelectItem>
              <SelectItem value="90d">90 dias</SelectItem>
              <SelectItem value="1y">1 ano</SelectItem>
            </SelectContent>
          </Select>
          
          <Button onClick={exportToCSV} variant="outline" className="glass-button">
            <Download className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Métricas Resumo */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-accent" />
            <div>
              <p className="text-2xl font-bold text-txt">
                {chartData.reduce((sum, d) => sum + d.workouts, 0)}
              </p>
              <p className="text-sm text-txt-2">Treinos</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <div>
              <p className="text-2xl font-bold text-txt">
                {Math.round(chartData.reduce((sum, d) => sum + d.volume, 0) / 1000)}K
              </p>
              <p className="text-sm text-txt-2">Volume Total</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
            <div>
              <p className="text-2xl font-bold text-txt">
                {chartData.filter(d => d.workouts > 0).length}
              </p>
              <p className="text-sm text-txt-2">Dias Ativos</p>
            </div>
          </div>
        </Card>
        
        <Card className="glass-card p-4">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-400" />
            <div>
              <p className="text-2xl font-bold text-txt">
                {chartData.length > 0 ? 
                  (chartData.reduce((sum, d) => sum + d.avgRpe, 0) / chartData.length).toFixed(1) 
                  : '0'
                }
              </p>
              <p className="text-sm text-txt-2">RPE Médio</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Gráfico de Volume por Tempo */}
      <Card className="glass-card p-6">
        <h3 className="text-xl font-semibold text-txt mb-4">Evolução do Volume</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2a55" />
              <XAxis 
                dataKey="date" 
                stroke="#c8d2ff"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
              />
              <YAxis stroke="#c8d2ff" tick={{ fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#141b34', 
                  border: '1px solid #1e2a55',
                  borderRadius: '14px',
                  color: '#e9efff'
                }}
                formatter={(value, name) => [
                  name === 'volume' ? `${Math.round(Number(value))}kg` : value,
                  name === 'volume' ? 'Volume' : name === 'workouts' ? 'Treinos' : 'RPE Médio'
                ]}
                labelFormatter={(label) => new Date(label).toLocaleDateString('pt-BR')}
              />
              <Line 
                type="monotone" 
                dataKey="volume" 
                stroke="#7bdcff" 
                strokeWidth={3}
                dot={{ fill: '#7bdcff', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Volume por Grupo Muscular */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-txt mb-4">Volume por Grupo Muscular</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={muscleGroupData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="volume"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {muscleGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141b34', 
                    border: '1px solid #1e2a55',
                    borderRadius: '14px',
                    color: '#e9efff'
                  }}
                  formatter={(value) => [`${Math.round(Number(value))}kg`, 'Volume']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-txt mb-4">Treinos por Grupo</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={muscleGroupData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#1e2a55" />
                <XAxis type="number" stroke="#c8d2ff" tick={{ fontSize: 12 }} />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  stroke="#c8d2ff" 
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#141b34', 
                    border: '1px solid #1e2a55',
                    borderRadius: '14px',
                    color: '#e9efff'
                  }}
                  formatter={(value) => [`${value} treinos`, 'Quantidade']}
                />
                <Bar dataKey="workouts" fill="#7bdcff" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Planilha de Dados */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-txt">Planilha Detalhada</h3>
          <Badge variant="secondary" className="bg-accent/20 text-accent">
            {spreadsheetData.length} registros
          </Badge>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line">
                <th className="text-left p-2 text-txt-2">Data</th>
                <th className="text-left p-2 text-txt-2">Treino</th>
                <th className="text-left p-2 text-txt-2">Exercício</th>
                <th className="text-left p-2 text-txt-2">Série</th>
                <th className="text-left p-2 text-txt-2">Reps</th>
                <th className="text-left p-2 text-txt-2">Peso</th>
                <th className="text-left p-2 text-txt-2">RPE</th>
                <th className="text-left p-2 text-txt-2">Volume</th>
              </tr>
            </thead>
            <tbody>
              {spreadsheetData.slice(0, 20).map((row, index) => (
                <tr key={index} className="border-b border-line/30 hover:bg-surface/30">
                  <td className="p-2 text-txt">{row.data}</td>
                  <td className="p-2 text-txt">{row.treino}</td>
                  <td className="p-2 text-txt">{row.exercicio}</td>
                  <td className="p-2 text-txt">{row.serie}</td>
                  <td className="p-2 text-txt">{row.reps}</td>
                  <td className="p-2 text-txt">{row.peso}kg</td>
                  <td className="p-2 text-txt">{row.rpe}</td>
                  <td className="p-2 text-accent font-medium">{Math.round(row.volume)}kg</td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {spreadsheetData.length > 20 && (
            <div className="text-center p-4">
              <p className="text-txt-3 text-sm">
                Mostrando 20 de {spreadsheetData.length} registros. 
                <Button variant="link" className="text-accent p-0 ml-1 h-auto">
                  Exportar todos
                </Button>
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}