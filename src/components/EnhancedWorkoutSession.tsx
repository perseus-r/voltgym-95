import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Timer, CheckCircle, ArrowRight, Zap, Target, TrendingUp, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_s: number;
  weight?: number;
}

interface EnhancedWorkoutSessionProps {
  workout: {
    focus: string;
    exercises: Exercise[];
  };
  onComplete: () => void;
  onClose: () => void;
}

export function EnhancedWorkoutSession({ workout, onComplete, onClose }: EnhancedWorkoutSessionProps) {
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [currentSet, setCurrentSet] = useState(1);
  const [isResting, setIsResting] = useState(false);
  const [restTimeLeft, setRestTimeLeft] = useState(0);
  const [completedSets, setCompletedSets] = useState<Set<string>>(new Set());
  const [workoutStartTime] = useState(Date.now());
  const [sessionStats, setSessionStats] = useState({
    totalVolume: 0,
    avgRPE: 7,
    completedExercises: 0
  });

  const currentExercise = workout.exercises[currentExerciseIndex];
  const totalExercises = workout.exercises.length;
  const totalSets = workout.exercises.reduce((sum, ex) => sum + ex.sets, 0);
  const completedSetsCount = completedSets.size;
  const progressPercent = (completedSetsCount / totalSets) * 100;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isResting && restTimeLeft > 0) {
      timer = setTimeout(() => setRestTimeLeft(prev => prev - 1), 1000);
    } else if (isResting && restTimeLeft === 0) {
      setIsResting(false);
      toast.success("Descanso terminado! Próxima série 💪");
    }
    return () => clearTimeout(timer);
  }, [isResting, restTimeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getWorkoutDuration = () => {
    const elapsed = Math.floor((Date.now() - workoutStartTime) / 1000 / 60);
    return elapsed;
  };

  const handleSetComplete = () => {
    const setId = `${currentExerciseIndex}-${currentSet}`;
    const newCompletedSets = new Set(completedSets);
    newCompletedSets.add(setId);
    setCompletedSets(newCompletedSets);

    // Update stats
    setSessionStats(prev => ({
      ...prev,
      totalVolume: prev.totalVolume + (currentExercise.weight || 0) * parseInt(currentExercise.reps.split('-')[0] || '1'),
    }));

    if (currentSet < currentExercise.sets) {
      // Start rest period
      setIsResting(true);
      setRestTimeLeft(currentExercise.rest_s);
      setCurrentSet(prev => prev + 1);
      toast.success(`Série ${currentSet} concluída! 🔥`);
    } else {
      // Exercise completed
      setSessionStats(prev => ({
        ...prev,
        completedExercises: prev.completedExercises + 1
      }));

      if (currentExerciseIndex < totalExercises - 1) {
        setCurrentExerciseIndex(prev => prev + 1);
        setCurrentSet(1);
        toast.success(`${currentExercise.name} concluído! Próximo exercício 🚀`);
      } else {
        // Workout completed
        onComplete();
      }
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTimeLeft(0);
  };

  const nextExercise = () => {
    if (currentExerciseIndex < totalExercises - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  const prevExercise = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
      setCurrentSet(1);
      setIsResting(false);
    }
  };

  if (isResting) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <Card className="liquid-glass border-accent/20 p-8 text-center max-w-md w-full">
          <div className="mb-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-r from-accent to-accent-2 rounded-full flex items-center justify-center mb-4 animate-pulse">
              <Timer className="w-12 h-12 text-accent-ink" />
            </div>
            <h3 className="text-2xl font-bold text-txt mb-2">Descansando</h3>
            <p className="text-txt-2">Prepare-se para a próxima série</p>
          </div>

          <div className="mb-6">
            <div className="text-6xl font-black text-accent mb-2">
              {formatTime(restTimeLeft)}
            </div>
            <Progress value={((currentExercise.rest_s - restTimeLeft) / currentExercise.rest_s) * 100} className="h-3" />
          </div>

          <div className="flex gap-3">
            <Button onClick={skipRest} variant="outline" className="flex-1">
              Pular Descanso
            </Button>
            <Button onClick={onClose} variant="ghost" className="flex-1">
              Pausar Treino
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg">
      <Card className="liquid-glass border-accent/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-line/20">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-txt">{workout.focus}</h2>
              <p className="text-txt-3">Exercício {currentExerciseIndex + 1} de {totalExercises}</p>
            </div>
            <Badge className="bg-accent/20 text-accent text-lg px-3 py-1">
              {getWorkoutDuration()} min
            </Badge>
          </div>

          <Progress value={progressPercent} className="h-3 mb-4" />
          
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-accent">{completedSetsCount}</div>
              <div className="text-xs text-txt-3">SÉRIES FEITAS</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{sessionStats.totalVolume}kg</div>
              <div className="text-xs text-txt-3">VOLUME TOTAL</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{sessionStats.completedExercises}</div>
              <div className="text-xs text-txt-3">EXERCÍCIOS OK</div>
            </div>
          </div>
        </div>

        {/* Current Exercise */}
        <div className="p-6">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-accent-ink" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-txt mb-2">{currentExercise.name}</h1>
            <p className="text-txt-2">Série {currentSet} de {currentExercise.sets}</p>
          </div>

          {/* Exercise Details */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="liquid-glass p-4 text-center border-accent/10">
              <Target className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-txt">{currentExercise.reps}</div>
              <div className="text-sm text-txt-3">REPETIÇÕES</div>
            </Card>
            <Card className="liquid-glass p-4 text-center border-accent/10">
              <Timer className="w-8 h-8 text-accent mx-auto mb-2" />
              <div className="text-2xl font-bold text-txt">{currentExercise.rest_s}s</div>
              <div className="text-sm text-txt-3">DESCANSO</div>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              onClick={handleSetComplete}
              className="w-full bg-gradient-to-r from-accent to-accent-2 text-accent-ink font-bold py-6 text-xl hover:scale-105 transition-all"
              size="lg"
            >
              <CheckCircle className="w-6 h-6 mr-3" />
              {currentSet === currentExercise.sets ? 'CONCLUIR EXERCÍCIO' : 'SÉRIE CONCLUÍDA'}
            </Button>

            <div className="grid grid-cols-3 gap-3">
              <Button
                onClick={prevExercise}
                disabled={currentExerciseIndex === 0}
                variant="outline"
                className="glass-button"
              >
                ← Anterior
              </Button>
              <Button onClick={onClose} variant="ghost" className="text-txt-2">
                Pausar
              </Button>
              <Button
                onClick={nextExercise}
                disabled={currentExerciseIndex === totalExercises - 1}
                variant="outline"
                className="glass-button"
              >
                Próximo →
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}