import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { databaseService } from '@/services/DatabaseService';
import { getWorkoutHistory } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';
import { BarChart3, TrendingUp, Activity, Target } from 'lucide-react';

interface ExerciseData {
  date: string;
  weight: number;
  reps: number;
  volume: number;
}

interface GroupData {
  [exerciseName: string]: ExerciseData[];
}

export default function SafeCharts() {
  const { user } = useAuth();
  const [workoutData, setWorkoutData] = useState<any>(null);
  const [groupedData, setGroupedData] = useState<{[key: string]: GroupData}>({});
  const [loading, setLoading] = useState(true);

  // Mapeamento de exercícios para grupos musculares
  const exerciseGroups = {
    'peito': ['supino', 'crucifixo', 'voador', 'flexão', 'peck deck', 'inclinado'],
    'costas': ['puxada', 'remada', 'pulldown', 'lat pulldown', 'serrote', 'barra fixa'],
    'braços': ['rosca', 'tríceps', 'martelo', 'scott', 'francês', 'mergulho', 'biceps'],
    'pernas': ['agachamento', 'leg press', 'stiff', 'cadeira', 'panturrilha', 'afundo', 'hack'],
    'ombros': ['elevação', 'desenvolvimento', 'crucifixo inverso', 'remada alta', 'shoulder']
  };

  useEffect(() => {
    loadWorkoutData();
  }, [user]);

  const loadWorkoutData = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    try {
      // Carregar dados do banco de dados
      const stats = await databaseService.getUserWorkoutStats(user.id);
      
      // Carregar dados do localStorage como backup
      const localHistory = getWorkoutHistory(user.id);
      
      // Processar dados por grupo muscular
      const processedGroups: {[key: string]: GroupData} = {};
      
      Object.keys(exerciseGroups).forEach(group => {
        processedGroups[group] = {};
      });

      // Processar dados do banco
      if (stats?.exerciseProgress) {
        Object.entries(stats.exerciseProgress).forEach(([exerciseName, progressData]: [string, any]) => {
          const group = getExerciseGroup(exerciseName);
          if (group && progressData?.length > 0) {
            if (!processedGroups[group][exerciseName]) {
              processedGroups[group][exerciseName] = [];
            }
            processedGroups[group][exerciseName].push(...progressData.map((data: any) => ({
              date: new Date(data.date).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
              weight: data.weight || 0,
              reps: data.reps || 0,
              volume: data.volume || 0
            })));
          }
        });
      }

      // Processar dados do localStorage
      localHistory.forEach(entry => {
        entry.items.forEach(item => {
          const group = getExerciseGroup(item.name);
          if (group) {
            if (!processedGroups[group][item.name]) {
              processedGroups[group][item.name] = [];
            }
            processedGroups[group][item.name].push({
              date: new Date(entry.ts).toLocaleDateString('pt-BR', { month: 'short', day: 'numeric' }),
              weight: item.carga || 0,
              reps: item.rpe || 0, // RPE como proxy para reps
              volume: (item.carga || 0) * (item.rpe || 1)
            });
          }
        });
      });

      setGroupedData(processedGroups);
      setWorkoutData(stats);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExerciseGroup = (exerciseName: string): string | null => {
    const name = exerciseName.toLowerCase();
    for (const [group, keywords] of Object.entries(exerciseGroups)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        return group;
      }
    }
    return null;
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
        <p className="text-txt-2">Carregando dados dos treinos...</p>
      </div>
    );
  }

  const hasAnyData = Object.values(groupedData).some(group => 
    Object.keys(group).length > 0
  );

  if (!hasAnyData) {
    return (
      <div className="h-96 flex flex-col items-center justify-center space-y-4 p-6">
        <div className="w-16 h-16 bg-accent/20 rounded-2xl flex items-center justify-center">
          <BarChart3 className="w-8 h-8 text-accent" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-semibold text-txt mb-2">
            📊 Sem Dados Ainda
          </h3>
          <p className="text-sm text-txt-2 max-w-md">
            Complete alguns treinos para ver gráficos de evolução de carga, repetições e volume por grupo muscular.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[70vh] overflow-y-auto">
      <Tabs defaultValue="peito" className="w-full">
        <TabsList className="grid w-full grid-cols-5 mb-4">
          <TabsTrigger value="peito">💪 Peito</TabsTrigger>
          <TabsTrigger value="costas">🔥 Costas</TabsTrigger>
          <TabsTrigger value="braços">💪 Braços</TabsTrigger>
          <TabsTrigger value="pernas">🦵 Pernas</TabsTrigger>
          <TabsTrigger value="ombros">👐 Ombros</TabsTrigger>
        </TabsList>

        {Object.keys(exerciseGroups).map(group => (
          <TabsContent key={group} value={group} className="space-y-4">
            {Object.keys(groupedData[group]).length === 0 ? (
              <Card className="p-6 text-center">
                <p className="text-txt-2">Nenhum dado de {group} encontrado ainda.</p>
                <p className="text-sm text-txt-3 mt-1">Complete treinos focados em {group} para ver os gráficos.</p>
              </Card>
            ) : (
              <div className="grid gap-4">
                {Object.entries(groupedData[group]).map(([exerciseName, exerciseData]) => {
                  if (exerciseData.length === 0) return null;
                  
                  // Ordenar por data e pegar últimos 10 registros
                  const sortedData = exerciseData
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .slice(-10);

                  return (
                    <Card key={exerciseName} className="p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold text-txt capitalize">{exerciseName}</h4>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              <TrendingUp className="w-3 h-3 mr-1" />
                              {sortedData.length} registros
                            </Badge>
                            {sortedData.length > 1 && (
                              <Badge variant="outline" className="text-xs">
                                <Target className="w-3 h-3 mr-1" />
                                Máx: {Math.max(...sortedData.map(d => d.weight))}kg
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        {/* Gráfico de Carga */}
                         <div>
                          <h5 className="text-sm font-medium text-txt-2 mb-2">📈 Evolução da Carga (kg)</h5>
                          <div className="h-32 min-h-[128px] w-full">
                            <ResponsiveContainer width="100%" height={128} minWidth={0} minHeight={128}>
                              <LineChart data={sortedData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={10}
                                />
                                <YAxis 
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={10}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--card))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                  }}
                                />
                                <Line 
                                  type="monotone" 
                                  dataKey="weight" 
                                  stroke="hsl(var(--accent))" 
                                  strokeWidth={2}
                                  dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 3 }}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>
                        </div>

                        {/* Gráfico de Volume */}
                         <div>
                          <h5 className="text-sm font-medium text-txt-2 mb-2">📊 Volume Total</h5>
                          <div className="h-32 min-h-[128px] w-full">
                            <ResponsiveContainer width="100%" height={128} minWidth={0} minHeight={128}>
                              <BarChart data={sortedData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis 
                                  dataKey="date" 
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={10}
                                />
                                <YAxis 
                                  stroke="hsl(var(--muted-foreground))"
                                  fontSize={10}
                                />
                                <Tooltip 
                                  contentStyle={{ 
                                    backgroundColor: 'hsl(var(--card))', 
                                    border: '1px solid hsl(var(--border))',
                                    borderRadius: '8px',
                                    fontSize: '12px'
                                  }}
                                />
                                <Bar 
                                  dataKey="volume" 
                                  fill="hsl(var(--accent) / 0.7)"
                                />
                              </BarChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
