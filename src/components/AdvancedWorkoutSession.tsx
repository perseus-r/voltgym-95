import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { WorkoutPersistenceService } from '@/services/WorkoutPersistenceService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Play, 
  Pause, 
  Square, 
  Plus, 
  Minus, 
  Clock, 
  Target, 
  Zap, 
  Save,
  SkipForward,
  Volume2,
  VolumeX,
  Timer,
  CheckCircle,
  TrendingUp,
  Edit3,
  MoreHorizontal
} from 'lucide-react';

interface Exercise {
  name: string;
  sets?: number;
  reps?: number | string;
  weight?: number;
  rest?: number;
  rpe?: number;
  notes?: string;
}

interface WorkoutSet {
  setNumber: number;
  reps: number;
  weight: number;
  rpe: number;
  completed: boolean;
  restTime?: number;
}

interface ExerciseLog {
  exercise: Exercise;
  sets: WorkoutSet[];
  notes: string;
  completed: boolean;
}

interface AdvancedWorkoutSessionProps {
  workout: {
    id: string;
    name?: string;
    focus: string;
    exercises: Exercise[];
  };
  onClose: () => void;
  onComplete: () => void;
}

export function AdvancedWorkoutSession({ workout, onClose, onComplete }: AdvancedWorkoutSessionProps) {
  const { user } = useAuth();
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLog[]>([]);
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [sessionDuration, setSessionDuration] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [autoRest, setAutoRest] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Inicializar logs dos exercícios
    const initialLogs: ExerciseLog[] = workout.exercises.map((exercise) => ({
      exercise,
      sets: Array.from({ length: exercise.sets || 3 }, (_, index) => ({
        setNumber: index + 1,
        reps: typeof exercise.reps === 'number' ? exercise.reps : 10,
        weight: exercise.weight || 0,
        rpe: exercise.rpe || 7,
        completed: false,
        restTime: exercise.rest || 90
      })),
      notes: exercise.notes || '',
      completed: false
    }));
    
    setExerciseLogs(initialLogs);

    // Timer da sessão
    durationIntervalRef.current = setInterval(() => {
      setSessionDuration(Math.floor((Date.now() - sessionStartTime.getTime()) / 1000));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (durationIntervalRef.current) clearInterval(durationIntervalRef.current);
    };
  }, [workout.exercises, sessionStartTime]);

  // Timer de descanso
  useEffect(() => {
    if (isResting && restTimer > 0) {
      intervalRef.current = setInterval(() => {
        setRestTimer((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            if (soundEnabled) playNotificationSound();
            toast.success('⏰ Tempo de descanso terminado!');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isResting, restTimer, soundEnabled]);

  const playNotificationSound = () => {
    try {
      // Som simples usando Web Audio API
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      gain.gain.setValueAtTime(0.1, audioContext.currentTime);
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.2);
    } catch (error) {
      console.log('Não foi possível tocar o som');
    }
  };

  // Atualizar set
  const updateSet = (exerciseIndex: number, setIndex: number, field: keyof WorkoutSet, value: any) => {
    setExerciseLogs(prev => {
      const updated = [...prev];
      updated[exerciseIndex].sets[setIndex] = {
        ...updated[exerciseIndex].sets[setIndex],
        [field]: value
      };
      return updated;
    });
  };

  // Completar set
  const completeSet = (exerciseIndex: number, setIndex: number) => {
    updateSet(exerciseIndex, setIndex, 'completed', true);
    
    const exerciseLog = exerciseLogs[exerciseIndex];
    const set = exerciseLog.sets[setIndex];
    
    if (autoRest && set.restTime && set.restTime > 0) {
      setRestTimer(set.restTime);
      setIsResting(true);
      toast.success(`💪 Série ${setIndex + 1} concluída! Descanso de ${set.restTime}s`);
    } else {
      toast.success(`✅ Série ${setIndex + 1} concluída!`);
    }

    // Verificar se exercício foi completado
    const allSetsCompleted = exerciseLog.sets.every(s => s.completed);
    if (allSetsCompleted) {
      completeExercise(exerciseIndex);
    }
  };

  // Completar exercício
  const completeExercise = (exerciseIndex: number) => {
    setExerciseLogs(prev => {
      const updated = [...prev];
      updated[exerciseIndex].completed = true;
      return updated;
    });

    toast.success(`🎯 ${exerciseLogs[exerciseIndex].exercise.name} concluído!`);

    // Avançar para próximo exercício
    if (exerciseIndex < exerciseLogs.length - 1) {
      setCurrentExerciseIndex(exerciseIndex + 1);
    }
  };

  // Adicionar set extra
  const addExtraSet = (exerciseIndex: number) => {
    setExerciseLogs(prev => {
      const updated = [...prev];
      const lastSet = updated[exerciseIndex].sets[updated[exerciseIndex].sets.length - 1];
      const newSet: WorkoutSet = {
        setNumber: updated[exerciseIndex].sets.length + 1,
        reps: lastSet.reps,
        weight: lastSet.weight,
        rpe: lastSet.rpe,
        completed: false,
        restTime: lastSet.restTime
      };
      updated[exerciseIndex].sets.push(newSet);
      return updated;
    });
    
    toast.success('➕ Série extra adicionada!');
  };

  // Pular descanso
  const skipRest = () => {
    setIsResting(false);
    setRestTimer(0);
    toast.info('⏭️ Descanso pulado');
  };

  // Salvar e finalizar treino
  const finishWorkout = async () => {
    try {
      const sessionData = {
        name: workout.name || workout.focus,
        focus: workout.focus,
        exercises: exerciseLogs.map(log => ({
          name: log.exercise.name,
          weight: log.sets.reduce((sum, set) => sum + (set.completed ? set.weight : 0), 0) / log.sets.filter(s => s.completed).length || 0,
          reps: log.sets.reduce((sum, set) => sum + (set.completed ? set.reps : 0), 0) / log.sets.filter(s => s.completed).length || 0,
          rpe: log.sets.reduce((sum, set) => sum + (set.completed ? set.rpe : 0), 0) / log.sets.filter(s => s.completed).length || 0,
          notes: log.notes,
          sets: log.sets.filter(s => s.completed).length
        }))
      };

      // Salvar no serviço
      await WorkoutPersistenceService.saveWorkout(sessionData);
      
      toast.success('🎉 Treino finalizado e salvo!');
      onComplete();
      onClose();
      
    } catch (error) {
      console.error('Erro ao finalizar treino:', error);
      toast.error('Erro ao salvar treino');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentExercise = exerciseLogs[currentExerciseIndex];
  const progressPercentage = (exerciseLogs.filter(log => log.completed).length / exerciseLogs.length) * 100;
  const completedSets = exerciseLogs.reduce((total, log) => total + log.sets.filter(s => s.completed).length, 0);
  const totalSets = exerciseLogs.reduce((total, log) => total + log.sets.length, 0);

  return (
    <div className="fixed inset-0 bg-bg z-50 overflow-y-auto">
      <div className="min-h-screen p-4">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Header da Sessão */}
          <Card className="p-6 bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-txt">{workout.name || workout.focus}</h1>
                <p className="text-txt-2">{workout.focus}</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-accent">{formatTime(sessionDuration)}</div>
                <div className="text-sm text-txt-2">Duração</div>
              </div>
            </div>

            {/* Progresso Geral */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-txt-2">Progresso</span>
                <span className="text-txt">{completedSets}/{totalSets} séries</span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </div>

            {/* Controles da Sessão */}
            <div className="flex items-center gap-3 mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSoundEnabled(!soundEnabled)}
                className="gap-2"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                {soundEnabled ? 'Som' : 'Mudo'}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setAutoRest(!autoRest)}
                className="gap-2"
              >
                <Timer className="w-4 h-4" />
                {autoRest ? 'Auto-Descanso' : 'Manual'}
              </Button>
              <div className="flex-1" />
              <Button
                variant="outline"
                onClick={onClose}
                className="text-red-400 hover:text-red-300"
              >
                <Square className="w-4 h-4 mr-2" />
                Parar
              </Button>
            </div>
          </Card>

          {/* Timer de Descanso */}
          {isResting && (
            <Card className="p-6 bg-gradient-to-r from-yellow-500/20 to-yellow-500/10 border-yellow-500/30">
              <div className="text-center">
                <div className="text-6xl font-bold text-yellow-400 mb-2">
                  {formatTime(restTimer)}
                </div>
                <p className="text-txt-2 mb-4">Tempo de descanso</p>
                <Button onClick={skipRest} variant="outline" className="gap-2">
                  <SkipForward className="w-4 h-4" />
                  Pular Descanso
                </Button>
              </div>
            </Card>
          )}

          {/* Exercício Atual */}
          {currentExercise && (
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold text-txt flex items-center gap-2">
                    <Target className="w-5 h-5 text-accent" />
                    {currentExercise.exercise.name}
                  </h2>
                  <p className="text-txt-2">
                    Exercício {currentExerciseIndex + 1} de {exerciseLogs.length}
                  </p>
                </div>
                {currentExercise.completed && (
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Concluído
                  </Badge>
                )}
              </div>

              {/* Séries */}
              <div className="space-y-3 mb-6">
                {currentExercise.sets.map((set, setIndex) => (
                  <Card key={setIndex} className={`p-4 ${set.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-surface/50'}`}>
                    <div className="flex items-center gap-4">
                      <div className="font-semibold text-txt min-w-0">
                        Série {set.setNumber}
                      </div>
                      
                      <div className="flex items-center gap-2 flex-1">
                        <div className="flex items-center gap-1">
                          <span className="text-sm text-txt-2">Reps:</span>
                          <Input
                            type="number"
                            value={set.reps}
                            onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'reps', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center"
                            disabled={set.completed}
                          />
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-sm text-txt-2">Peso:</span>
                          <Input
                            type="number"
                            value={set.weight}
                            onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'weight', parseFloat(e.target.value) || 0)}
                            className="w-20 h-8 text-center"
                            disabled={set.completed}
                            step="0.5"
                          />
                          <span className="text-xs text-txt-3">kg</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span className="text-sm text-txt-2">RPE:</span>
                          <Input
                            type="number"
                            value={set.rpe}
                            onChange={(e) => updateSet(currentExerciseIndex, setIndex, 'rpe', parseInt(e.target.value) || 0)}
                            className="w-16 h-8 text-center"
                            disabled={set.completed}
                            min="1"
                            max="10"
                          />
                        </div>
                      </div>

                      {!set.completed ? (
                        <Button
                          onClick={() => completeSet(currentExerciseIndex, setIndex)}
                          size="sm"
                          className="bg-accent text-accent-ink hover:bg-accent/90"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </Button>
                      ) : (
                        <div className="text-green-400">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Ações do Exercício */}
              <div className="flex gap-3">
                <Button
                  onClick={() => addExtraSet(currentExerciseIndex)}
                  variant="outline"
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Série Extra
                </Button>
                
                {!currentExercise.completed && (
                  <Button
                    onClick={() => completeExercise(currentExerciseIndex)}
                    className="bg-accent text-accent-ink hover:bg-accent/90 gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    Concluir Exercício
                  </Button>
                )}

                <div className="flex-1" />

                {currentExerciseIndex < exerciseLogs.length - 1 && (
                  <Button
                    onClick={() => setCurrentExerciseIndex(currentExerciseIndex + 1)}
                    variant="outline"
                    className="gap-2"
                  >
                    Próximo
                    <SkipForward className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Notas do Exercício */}
              <div className="mt-4">
                <label className="text-sm text-txt-2 mb-2 block">Notas do exercício:</label>
                <Textarea
                  value={currentExercise.notes}
                  onChange={(e) => {
                    setExerciseLogs(prev => {
                      const updated = [...prev];
                      updated[currentExerciseIndex].notes = e.target.value;
                      return updated;
                    });
                  }}
                  placeholder="Adicione observações sobre o exercício..."
                  className="min-h-[60px]"
                />
              </div>
            </Card>
          )}

          {/* Lista de Exercícios */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-txt mb-4">Exercícios do Treino</h3>
            <div className="space-y-2">
              {exerciseLogs.map((log, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentExerciseIndex 
                      ? 'bg-accent/20 border border-accent/30' 
                      : 'bg-surface/50 hover:bg-surface/80'
                  }`}
                  onClick={() => setCurrentExerciseIndex(index)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      log.completed 
                        ? 'bg-green-500 text-white' 
                        : index === currentExerciseIndex 
                          ? 'bg-accent text-accent-ink' 
                          : 'bg-surface text-txt-2'
                    }`}>
                      {log.completed ? '✓' : index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-txt">{log.exercise.name}</div>
                      <div className="text-sm text-txt-2">
                        {log.sets.filter(s => s.completed).length}/{log.sets.length} séries
                      </div>
                    </div>
                  </div>
                  
                  {log.completed && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      Concluído
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Botão Finalizar */}
          <Card className="p-6">
            <div className="text-center space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-accent">{completedSets}</div>
                  <div className="text-sm text-txt-2">Séries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-400">
                    {exerciseLogs.filter(log => log.completed).length}
                  </div>
                  <div className="text-sm text-txt-2">Exercícios</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-400">
                    {Math.round(progressPercentage)}%
                  </div>
                  <div className="text-sm text-txt-2">Progresso</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-txt">{formatTime(sessionDuration)}</div>
                  <div className="text-sm text-txt-2">Tempo</div>
                </div>
              </div>

              <Button
                onClick={finishWorkout}
                className="bg-accent text-accent-ink hover:bg-accent/90 px-8 py-3 text-lg"
                size="lg"
              >
                <Save className="w-5 h-5 mr-2" />
                Finalizar Treino
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}