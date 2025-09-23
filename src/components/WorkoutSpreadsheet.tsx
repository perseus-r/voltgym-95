import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Plus, 
  Edit, 
  Calendar,
  Filter,
  Download,
  BarChart3,
  Target,
  Dumbbell
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { unifiedDataService } from "@/services/UnifiedDataService";

interface ExerciseData {
  name: string;
  lastWeight: number;
  personalRecord: number;
  totalVolume: number;
  lastDate: string;
  trend: 'up' | 'down' | 'stable';
  sessions: number;
  totalSets: number;
  averageRpe: number;
}

export function WorkoutSpreadsheet() {
  const [exerciseData, setExerciseData] = useState<ExerciseData[]>([]);
  const [filter, setFilter] = useState("");
  const [editingExercise, setEditingExercise] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  
  const { user } = useAuth();

  useEffect(() => {
    loadExerciseData();
  }, [user]);

  const loadExerciseData = async () => {
    try {
      setLoading(true);
      console.log('📊 Loading exercise data from unified service...');
      
      if (!user) {
        console.log('⚠️ No user logged in');
        setExerciseData([]);
        setLoading(false);
        return;
      }

      // Get workout history from unified service
      const history = await unifiedDataService.getWorkoutHistory(100);
      console.log(`📈 Loaded ${history.length} workouts from history`);
      
      if (history.length === 0) {
        console.log('📭 No workout history found');
        setExerciseData([]);
        setLoading(false);
        return;
      }

      // Process exercise data from history
      const exerciseMap = new Map<string, {
        weights: number[];
        volumes: number[];
        dates: string[];
        rpes: number[];
        totalSets: number;
      }>();

      history.forEach((session: any) => {
        session.exercises?.forEach((exercise: any, index: number) => {
          const exerciseName = exercise.name || `Exercício ${index + 1}`;
          
          if (!exerciseMap.has(exerciseName)) {
            exerciseMap.set(exerciseName, {
              weights: [],
              volumes: [],
              dates: [],
              rpes: [],
              totalSets: 0
            });
          }

          const exerciseStats = exerciseMap.get(exerciseName)!;
          
          // Add exercise data
          if (exercise.weight) {
            exerciseStats.weights.push(exercise.weight);
            const reps = typeof exercise.reps === 'string' ? parseInt(exercise.reps) : exercise.reps;
            exerciseStats.volumes.push(exercise.weight * (reps || 1) * (exercise.sets || 1));
          }
          
          exerciseStats.dates.push(session.completed_at || session.started_at);
          if (exercise.rpe) exerciseStats.rpes.push(exercise.rpe);
          exerciseStats.totalSets += exercise.sets || 1;
        });
      });

      // Convert to ExerciseData array
      const processedData: ExerciseData[] = Array.from(exerciseMap.entries()).map(([name, data]) => {
        const lastWeight = data.weights[data.weights.length - 1] || 0;
        const personalRecord = Math.max(...data.weights, 0);
        const totalVolume = data.volumes.reduce((sum, vol) => sum + vol, 0);
        const lastDate = data.dates[data.dates.length - 1] || '';
        const averageRpe = data.rpes.length > 0 
          ? data.rpes.reduce((sum, rpe) => sum + rpe, 0) / data.rpes.length 
          : 0;

        // Calculate trend (compare last 3 sessions with previous 3)
        let trend: 'up' | 'down' | 'stable' = 'stable';
        if (data.weights.length >= 6) {
          const recent = data.weights.slice(-3).reduce((sum, w) => sum + w, 0) / 3;
          const previous = data.weights.slice(-6, -3).reduce((sum, w) => sum + w, 0) / 3;
          
          if (recent > previous * 1.05) trend = 'up';
          else if (recent < previous * 0.95) trend = 'down';
        }

        return {
          name,
          lastWeight,
          personalRecord,
          totalVolume,
          lastDate: lastDate ? new Date(lastDate).toLocaleDateString('pt-BR') : '',
          trend,
          sessions: Math.ceil(data.totalSets / 3), // Estimate sessions
          totalSets: data.totalSets,
          averageRpe: Math.round(averageRpe * 10) / 10
        };
      });

      console.log(`✅ Processed ${processedData.length} exercises`);
      setExerciseData(processedData.sort((a, b) => b.totalVolume - a.totalVolume));
    } catch (error) {
      console.error('❌ Error loading exercise data:', error);
      toast.error('Erro ao carregar planilha de cargas');
    } finally {
      setLoading(false);
    }
  };

  const filteredData = exerciseData.filter(exercise =>
    exercise.name.toLowerCase().includes(filter.toLowerCase())
  );

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return <Minus className="w-4 h-4 text-yellow-500" />;
    }
  };

  const handleEditWeight = (exerciseName: string, currentWeight: number) => {
    setEditingExercise(exerciseName);
    setNewWeight(currentWeight);
  };

  const handleSaveWeight = (exerciseName: string) => {
    setExerciseData(prev => prev.map(exercise =>
      exercise.name === exerciseName
        ? { ...exercise, lastWeight: newWeight }
        : exercise
    ));
    setEditingExercise(null);
    toast.success('Carga atualizada!');
  };

  const handleAddNewRecord = async (exerciseName: string) => {
    try {
      const ex = exerciseData.find((e) => e.name === exerciseName);
      const weight = Number.isFinite(newWeight) && newWeight > 0 ? newWeight : (ex?.lastWeight || 0);

      console.log('💾 Adding new record:', { exerciseName, weight });

      const success = await unifiedDataService.saveWorkout({
        user_id: user!.id,
        name: `Planilha: ${exerciseName}`,
        focus: 'Planilha de Cargas',
        exercises: [
          { 
            name: exerciseName, 
            sets: 3,
            reps: 10,
            weight, 
            rpe: 7,
            notes: 'Adicionado via planilha'
          }
        ]
      });

      if (success) {
        await loadExerciseData();
        toast.success('💪 Novo registro salvo!');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('❌ Error saving record:', error);
      toast.error('Erro ao salvar registro');
    } finally {
      setEditingExercise(null);
    }
  };

  if (loading) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-txt-2">Carregando planilha de cargas...</p>
        </div>
      </Card>
    );
  }

  if (!user) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center">
          <Target className="w-12 h-12 text-txt-3 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-txt mb-2">Login Necessário</h3>
          <p className="text-txt-2">Faça login para ver sua planilha de cargas</p>
        </div>
      </Card>
    );
  }

  if (exerciseData.length === 0) {
    return (
      <Card className="glass-card p-6">
        <div className="text-center space-y-4">
          <Dumbbell className="w-12 h-12 text-txt-3 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-txt mb-2">Nenhum Dado Encontrado</h3>
            <p className="text-txt-2">Complete alguns treinos para ver sua planilha de cargas</p>
          </div>
          <Button onClick={loadExerciseData} className="bg-accent text-accent-ink">
            Recarregar Dados
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-txt">📊 Planilha de Cargas</h2>
            <p className="text-txt-2">Acompanhe sua evolução por exercício</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="glass-button">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button 
              onClick={() => loadExerciseData()}
              className="bg-accent text-accent-ink"
            >
              <Plus className="w-4 h-4 mr-2" />
              Recarregar
            </Button>
          </div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-txt-3" />
            <Input
              placeholder="Filtrar exercícios..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card className="glass-card">
        <Table>
          <TableHeader>
            <TableRow className="border-line/20 hover:bg-transparent">
              <TableHead className="text-txt font-semibold">Exercício</TableHead>
              <TableHead className="text-txt font-semibold text-center">Última Carga</TableHead>
              <TableHead className="text-txt font-semibold text-center">Recorde Pessoal</TableHead>
              <TableHead className="text-txt font-semibold text-center">Volume Total</TableHead>
              <TableHead className="text-txt font-semibold text-center">Último Treino</TableHead>
              <TableHead className="text-txt font-semibold text-center">Evolução</TableHead>
              <TableHead className="text-txt font-semibold text-center">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.map((exercise, index) => (
              <TableRow key={index} className="border-line/20 hover:bg-surface/30 group">
                <TableCell className="font-medium text-txt">{exercise.name}</TableCell>
                <TableCell>
                  {editingExercise === exercise.name ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={newWeight}
                        onChange={(e) => setNewWeight(parseFloat(e.target.value) || 0)}
                        className="w-20 h-8 text-center"
                      />
                      <Button 
                        size="sm" 
                        onClick={() => handleSaveWeight(exercise.name)}
                        className="h-8 px-2 bg-accent text-accent-ink"
                      >
                        ✓
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="text-txt">{exercise.lastWeight}kg</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditWeight(exercise.name, exercise.lastWeight)}
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="bg-accent/20 text-accent font-semibold">
                    {exercise.personalRecord}kg
                  </Badge>
                </TableCell>
                <TableCell className="text-txt-2">{exercise.totalVolume.toLocaleString()}kg</TableCell>
                <TableCell className="text-txt-2">{exercise.lastDate}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(exercise.trend)}
                    <div className="text-xs text-txt-2">
                      <div>{exercise.sessions} sessões</div>
                      <div>{exercise.totalSets} séries</div>
                      {exercise.averageRpe > 0 && <div>RPE {exercise.averageRpe}</div>}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleAddNewRecord(exercise.name)}
                    className="glass-button h-8 text-xs"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-txt">{exerciseData.length}</div>
              <div className="text-xs text-txt-2">Exercícios</div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-txt">
                {exerciseData.reduce((sum, ex) => sum + ex.totalVolume, 0).toLocaleString()}kg
              </div>
              <div className="text-xs text-txt-2">Volume Total</div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center">
              <Target className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-txt">
                {Math.max(...exerciseData.map(ex => ex.personalRecord), 0)}kg
              </div>
              <div className="text-xs text-txt-2">Maior PR</div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <div className="text-lg font-bold text-txt">
                {exerciseData.reduce((sum, ex) => sum + ex.sessions, 0)}
              </div>
              <div className="text-xs text-txt-2">Sessões</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}