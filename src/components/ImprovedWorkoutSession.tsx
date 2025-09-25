import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, Check, X, Timer, Zap, Target, TrendingUp, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useWorkoutPersistence } from '@/hooks/useWorkoutPersistence';
import { useVibration } from '@/hooks/useVibration';
import { RestTimer } from '@/components/RestTimer';
import { ExerciseInstructions } from '@/components/ExerciseInstructions';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_s: number;
  weight?: number;
  muscle_groups?: string[];
  notes?: string;
}

interface Workout {
  id: string;
  name: string;
  focus: string;
  exercises: Exercise[];
}

interface WorkoutSessionProps {
  workout: Workout;
  onComplete: () => void;
  onClose: () => void;
}

interface ExerciseLog {
  name: string;
  sets: Array<{
    reps: number;
    weight: number;
    rpe: number;
    completed: boolean;
    notes?: string;
  }>;
  completed: boolean;
  notes?: string;
}

export function ImprovedWorkoutSession({ workout, onComplete, onClose }: WorkoutSessionProps) {
  const { saveWorkoutSession, saving } = useWorkoutPersistence();
  const { vibrateSuccess, vibrateError } = useVibration();
  
  // Session state
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [sessionStartTime] = useState(new Date());
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [workoutLogs, setWorkoutLogs] = useState<ExerciseLog[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Initialize workout logs
  useEffect(() => {
    const logs: ExerciseLog[] = workout.exercises.map(exercise => ({
      name: exercise.name,
      sets: Array(exercise.sets).fill(null).map(() => ({
        reps: parseInt(exercise.reps.split('-')[0]) || 10,
        weight: exercise.weight || 0,
        rpe: 7,
        completed: false
      })),
      completed: false
    }));
    setWorkoutLogs(logs);
  }, [workout.exercises]);

  const currentExercise = workout.exercises[currentExerciseIndex];
  const currentExerciseLog = workoutLogs[currentExerciseIndex];
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSets = workoutLogs.reduce((sum, log) => 
    sum + log.sets.filter(set => set.completed).length, 0
  );

  // Complete current set
  const completeSet = useCallback(() => {
    if (!currentExerciseLog) return;

    const newLogs = [...workoutLogs];
    newLogs[currentExerciseIndex].sets[currentSetIndex].completed = true;
    
    // Check if exercise is complete
    const allSetsComplete = newLogs[currentExerciseIndex].sets.every(set => set.completed);
    if (allSetsComplete) {
      newLogs[currentExerciseIndex].completed = true;
    }
    
    setWorkoutLogs(newLogs);
    vibrateSuccess();
    
    // Start rest timer if not last set
    const isLastSet = currentSetIndex === currentExercise.sets - 1;
    const isLastExercise = currentExerciseIndex === workout.exercises.length - 1;
    
    if (!isLastSet || !isLastExercise) {
      setIsResting(true);
      setRestTimeLeft(currentExercise.rest_s);
    }
    
    toast.success(`Série ${currentSetIndex + 1} concluída!`);
  }, [currentExerciseIndex, currentSetIndex, workoutLogs, currentExercise, vibrateSuccess]);

  // Skip to next set/exercise
  const nextSet = useCallback(() => {
    if (currentSetIndex < currentExercise.sets - 1) {
      setCurrentSetIndex(prev => prev + 1);
    } else if (currentExerciseIndex < workout.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSetIndex(0);
    } else {
      // Workout complete
      setSessionCompleted(true);
    }
    setIsResting(false);
    setRestTimeLeft(0);
  }, [currentExerciseIndex, currentSetIndex, currentExercise, workout.exercises.length]);

  // Update set data
  const updateSetData = useCallback((field: 'reps' | 'weight' | 'rpe', value: number) => {
    const newLogs = [...workoutLogs];
    newLogs[currentExerciseIndex].sets[currentSetIndex][field] = value;
    setWorkoutLogs(newLogs);
  }, [currentExerciseIndex, currentSetIndex, workoutLogs]);

  // Complete workout
  const completeWorkout = useCallback(async () => {
    try {
      const sessionData = {
        name: workout.name,
        focus: workout.focus,
        duration_minutes: Math.round((new Date().getTime() - sessionStartTime.getTime()) / 60000),
        exercises: workoutLogs.map(log => ({
          name: log.name,
          sets: log.sets.map(set => ({
            reps: set.reps,
            weight: set.weight,
            rpe: set.rpe
          }))
        })),
        completed_at: new Date().toISOString()
      };

      await saveWorkoutSession(sessionData);
      toast.success('Treino salvo com sucesso! 💪');
      vibrateSuccess();
      onComplete();
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      toast.error('Erro ao salvar treino');
      vibrateError();
    }
  }, [workout, workoutLogs, sessionStartTime, saveWorkoutSession, onComplete, vibrateSuccess, vibrateError]);

  // Rest timer effect
  useEffect(() => {
    if (isResting && restTimeLeft > 0) {
      const timer = setTimeout(() => {
        setRestTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isResting && restTimeLeft === 0) {
      setIsResting(false);
      nextSet();
    }
  }, [isResting, restTimeLeft, nextSet]);

  if (sessionCompleted) {
    return (
      <Card className="glass-card p-6 max-w-md mx-auto text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto"
        >
          <Check className="w-8 h-8 text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-txt">Treino Concluído!</h2>
        <p className="text-txt-2">Parabéns! Você completou o treino "{workout.name}"</p>
        <div className="space-y-2">
          <Button onClick={completeWorkout} disabled={saving} className="w-full">
            {saving ? 'Salvando...' : 'Salvar Treino'}
          </Button>
          <Button variant="outline" onClick={onClose} className="w-full">
            Fechar
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Header */}
      <Card className="glass-card p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-txt">{workout.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4 text-sm text-txt-2">
          <span>Exercício {currentExerciseIndex + 1}/{workout.exercises.length}</span>
          <span>Série {currentSetIndex + 1}/{currentExercise.sets}</span>
          <Badge variant="outline">{workout.focus}</Badge>
        </div>
        <Progress value={(completedSets / totalSets) * 100} className="mt-2" />
      </Card>

      {/* Rest Timer */}
      <AnimatePresence>
        {isResting && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="glass-card p-4 text-center">
              <div className="text-2xl font-bold text-primary mb-2">
                {Math.floor(restTimeLeft / 60)}:{(restTimeLeft % 60).toString().padStart(2, '0')}
              </div>
              <p className="text-txt-2 mb-3">Tempo de descanso</p>
              <Button variant="outline" onClick={nextSet}>
                Pular Descanso
              </Button>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Current Exercise */}
      <Card className="glass-card p-6">
        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-xl font-bold text-txt mb-2">{currentExercise.name}</h3>
            <div className="flex items-center justify-center gap-4 text-sm text-txt-2">
              <span className="flex items-center gap-1">
                <Target className="w-4 h-4" />
                {currentExercise.sets} séries
              </span>
              <span className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                {currentExercise.reps} reps
              </span>
              <span className="flex items-center gap-1">
                <Timer className="w-4 h-4" />
                {currentExercise.rest_s}s descanso
              </span>
            </div>
          </div>

          {/* Set Controls */}
          {currentExerciseLog && (
            <div className="grid grid-cols-3 gap-4">
              {/* Reps */}
              <div className="text-center">
                <label className="text-sm text-txt-2 block mb-2">Repetições</label>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetData('reps', Math.max(1, currentExerciseLog.sets[currentSetIndex].reps - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-bold text-txt w-12 text-center">
                    {currentExerciseLog.sets[currentSetIndex].reps}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetData('reps', currentExerciseLog.sets[currentSetIndex].reps + 1)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Weight */}
              <div className="text-center">
                <label className="text-sm text-txt-2 block mb-2">Peso (kg)</label>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetData('weight', Math.max(0, currentExerciseLog.sets[currentSetIndex].weight - 2.5))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-bold text-txt w-16 text-center">
                    {currentExerciseLog.sets[currentSetIndex].weight}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetData('weight', currentExerciseLog.sets[currentSetIndex].weight + 2.5)}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* RPE */}
              <div className="text-center">
                <label className="text-sm text-txt-2 block mb-2">RPE</label>
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetData('rpe', Math.max(1, currentExerciseLog.sets[currentSetIndex].rpe - 1))}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="text-lg font-bold text-txt w-12 text-center">
                    {currentExerciseLog.sets[currentSetIndex].rpe}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateSetData('rpe', Math.min(10, currentExerciseLog.sets[currentSetIndex].rpe + 1))}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              onClick={completeSet}
              className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              disabled={isResting}
            >
              <Check className="w-4 h-4 mr-2" />
              Completar Série
            </Button>
            <Button
              variant="outline"
              onClick={nextSet}
              disabled={isResting}
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Pular
            </Button>
          </div>
        </div>
      </Card>

      {/* Exercise Instructions */}
      <ExerciseInstructions exerciseName={currentExercise.name} />

      {/* Sets Progress */}
      <Card className="glass-card p-4">
        <h4 className="font-medium text-txt mb-3">Progresso das Séries</h4>
        <div className="grid grid-cols-4 gap-2">
          {currentExerciseLog?.sets.map((set, index) => (
            <div
              key={index}
              className={`p-2 rounded-lg text-center text-xs transition-colors ${
                set.completed
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                  : index === currentSetIndex
                  ? 'bg-primary/20 text-primary border border-primary/30'
                  : 'bg-white/5 text-txt-3 border border-white/10'
              }`}
            >
              <div className="font-medium">Série {index + 1}</div>
              <div className="text-xs opacity-75">
                {set.reps}x{set.weight}kg
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}