import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { WorkoutPersistenceService, SavedWorkout } from '@/services/WorkoutPersistenceService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Play, 
  Trash2, 
  Calendar, 
  Dumbbell, 
  Target, 
  Clock, 
  Zap,
  RefreshCw,
  ListChecks
} from 'lucide-react';

interface SavedWorkoutsListProps {
  onStartWorkout?: (workout: SavedWorkout) => void;
}

export function SavedWorkoutsList({ onStartWorkout }: SavedWorkoutsListProps) {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<SavedWorkout[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWorkout, setSelectedWorkout] = useState<SavedWorkout | null>(null);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      console.log('📋 Carregando treinos salvos...');
      const savedWorkouts = await WorkoutPersistenceService.getWorkouts(user?.id);
      console.log('📋 Treinos carregados:', savedWorkouts.length);
      setWorkouts(savedWorkouts);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
      toast.error('Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [user?.id]);

  const handleStartWorkout = (workout: SavedWorkout) => {
    console.log('🔥 Iniciando treino:', workout.name);
    toast.success(`🔥 Iniciando "${workout.name}"!`);
    onStartWorkout?.(workout);
  };

  const handleDeleteWorkout = async (workoutId: string, workoutName: string) => {
    try {
      const success = await WorkoutPersistenceService.deleteWorkout(workoutId, user?.id);
      if (success) {
        setWorkouts(workouts.filter(w => w.id !== workoutId));
        toast.success(`🗑️ "${workoutName}" removido!`);
      }
    } catch (error) {
      console.error('Erro ao deletar treino:', error);
      toast.error('Erro ao remover treino');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-3 text-txt-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Carregando treinos...
        </div>
      </Card>
    );
  }

  if (workouts.length === 0) {
    return (
      <Card className="p-8 text-center">
        <Dumbbell className="w-12 h-12 text-txt-3 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-txt mb-2">Nenhum treino salvo</h3>
        <p className="text-txt-2">Crie seu primeiro treino personalizado!</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-txt flex items-center gap-2">
          <ListChecks className="w-5 h-5 text-accent" />
          Seus Treinos ({workouts.length})
        </h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={loadWorkouts}
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      <ScrollArea className="h-[400px]">
        <div className="space-y-3 pr-4">
          {workouts.map((workout) => (
            <Card key={workout.id} className="p-4 hover:bg-surface/80 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-txt truncate">{workout.name}</h4>
                    {workout.completed && (
                      <Badge variant="default" className="text-xs bg-green-500/20 text-green-400 border-green-500/30">
                        Concluído
                      </Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-txt-2 mb-3">{workout.focus}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-txt-3 mb-3">
                    <div className="flex items-center gap-1">
                      <Dumbbell className="w-3 h-3" />
                      {workout.exercises.length} exercícios
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(workout.created_at)}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setSelectedWorkout(workout)}
                        >
                          <Target className="w-3 h-3 mr-1" />
                          Detalhes
                        </Button>
                      </DialogTrigger>
                      
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Dumbbell className="w-5 h-5 text-accent" />
                            {selectedWorkout?.name}
                          </DialogTitle>
                        </DialogHeader>
                        
                        {selectedWorkout && (
                          <div className="space-y-4">
                            <div>
                              <Badge variant="outline">{selectedWorkout.focus}</Badge>
                            </div>
                            
                            <div className="space-y-3">
                              <h4 className="font-semibold text-txt">Exercícios:</h4>
                              {selectedWorkout.exercises.map((exercise, index) => (
                                <Card key={index} className="p-3 bg-surface/50">
                                  <div className="flex items-center justify-between">
                                    <span className="font-medium text-txt">{exercise.name}</span>
                                    <div className="flex items-center gap-4 text-sm text-txt-2">
                                      {exercise.sets && (
                                        <span className="flex items-center gap-1">
                                          <Target className="w-3 h-3" />
                                          {exercise.sets} séries
                                        </span>
                                      )}
                                      <span className="flex items-center gap-1">
                                        <Dumbbell className="w-3 h-3" />
                                        {exercise.reps} reps
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Zap className="w-3 h-3" />
                                        {exercise.weight}kg
                                      </span>
                                      {exercise.rest && (
                                        <span className="flex items-center gap-1">
                                          <Clock className="w-3 h-3" />
                                          {exercise.rest}s
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                  {exercise.notes && (
                                    <p className="text-xs text-txt-3 mt-2">{exercise.notes}</p>
                                  )}
                                </Card>
                              ))}
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                    
                    <Button 
                      size="sm"
                      onClick={() => handleStartWorkout(workout)}
                      className="gap-1"
                    >
                      <Play className="w-3 h-3" />
                      Iniciar
                    </Button>
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteWorkout(workout.id, workout.name)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}