import React, { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { databaseService } from '@/services/DatabaseService';
import { useAuth } from '@/contexts/AuthContext';
import { TrendingUp, Activity, Target, Zap } from 'lucide-react';

export function EnhancedWorkoutCharts() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutStats();
  }, [user]);

  const loadWorkoutStats = async () => {
    if (!user?.id) return;
    
    try {
      const workoutStats = await databaseService.getUserWorkoutStats(user.id);
      setStats(workoutStats);
    } catch (error) {
      console.error('Erro ao carregar stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-muted rounded w-1/3"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Nenhum dado de treino encontrado</p>
      </Card>
    );
  }

  const volumeData = stats.chartData || [];
  const exerciseBreakdown = Object.entries(stats.exerciseProgress || {}).slice(0, 5).map(([name, data]: [string, any]) => ({
    name: name.length > 15 ? `${name.slice(0, 15)}...` : name,
    sessions: data.length,
    avgWeight: data.reduce((sum: number, d: any) => sum + d.weight, 0) / data.length || 0
  }));

  const COLORS = ['hsl(var(--accent))', 'hsl(var(--accent) / 0.8)', 'hsl(var(--accent) / 0.6)', 'hsl(var(--accent) / 0.4)', 'hsl(var(--accent) / 0.2)'];

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-4 h-4 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Total Sessões</p>
              <p className="text-xl font-bold">{stats.totalSessions}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Volume Total</p>
              <p className="text-xl font-bold">{Math.round(stats.totalVolume)}kg</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Média/Sessão</p>
              <p className="text-xl font-bold">{Math.round(stats.averageVolume)}kg</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-accent" />
            <div>
              <p className="text-sm text-muted-foreground">Exercícios</p>
              <p className="text-xl font-bold">{Object.keys(stats.exerciseProgress || {}).length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="volume" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="exercises">Exercícios</TabsTrigger>
          <TabsTrigger value="progression">Progressão</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Volume por Sessão</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Distribuição de Exercícios</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={exerciseBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="sessions"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {exerciseBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                <h4 className="font-medium">Top Exercícios</h4>
                {exerciseBreakdown.map((exercise, index) => (
                  <div key={exercise.name} className="flex justify-between text-sm">
                    <span>{exercise.name}</span>
                    <span className="text-muted-foreground">
                      {exercise.sessions}x • {Math.round(exercise.avgWeight)}kg
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="progression" className="mt-4">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Progressão Geral</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={volumeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="duration" 
                  fill="hsl(var(--accent) / 0.6)" 
                  name="Duração (min)"
                />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}