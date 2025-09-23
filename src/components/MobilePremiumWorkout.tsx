import { useState, useEffect } from 'react';
import { useSubscription } from '@/hooks/useSubscription';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Play, 
  Pause, 
  SkipForward, 
  Timer, 
  Target, 
  TrendingUp,
  Brain,
  Zap,
  Crown,
  Sparkles,
  Volume2,
  VolumeX,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  ChevronRight
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import PlanGuard from './PlanGuard';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_s: number;
  completed?: boolean;
}

interface MobilePremiumWorkoutProps {
  exercises: Exercise[];
  currentExerciseIndex: number;
  onExerciseComplete: (index: number) => void;
  onNext: () => void;
  isActive: boolean;
}

export const MobilePremiumWorkout = ({ 
  exercises, 
  currentExerciseIndex, 
  onExerciseComplete, 
  onNext, 
  isActive 
}: MobilePremiumWorkoutProps) => {
  const { isPro, isPremium } = useSubscription();
  const isMobile = useIsMobile();
  
  const [currentSet, setCurrentSet] = useState(1);
  const [restTimer, setRestTimer] = useState(0);
  const [isResting, setIsResting] = useState(false);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const [workoutProgress, setWorkoutProgress] = useState(0);
  const [aiCoaching, setAiCoaching] = useState(false);
  const [currentWeight, setCurrentWeight] = useState('');
  const [currentReps, setCurrentReps] = useState('');
  const [rpe, setRPE] = useState(5);

  const currentExercise = exercises[currentExerciseIndex];

  useEffect(() => {
    if (exercises.length > 0) {
      const completed = exercises.filter(ex => ex.completed).length;
      setWorkoutProgress((completed / exercises.length) * 100);
    }
  }, [exercises]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isTimerActive && restTimer > 0) {
      interval = setInterval(() => {
        setRestTimer(prev => {
          if (prev <= 1) {
            setIsTimerActive(false);
            setIsResting(false);
            if (audioEnabled) {
              // Play notification sound
              const audio = new Audio('/notification.mp3');
              audio.play().catch(() => {});
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerActive, restTimer, audioEnabled]);

  const startRestTimer = () => {
    if (currentExercise) {
      setRestTimer(currentExercise.rest_s);
      setIsResting(true);
      setIsTimerActive(true);
    }
  };

  const handleSetComplete = () => {
    if (currentSet < currentExercise.sets) {
      setCurrentSet(prev => prev + 1);
      startRestTimer();
    } else {
      // Exercise complete
      onExerciseComplete(currentExerciseIndex);
      setCurrentSet(1);
      setIsResting(false);
      setIsTimerActive(false);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isMobile || !isActive || !currentExercise) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-bg z-50 flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 bg-card/50 backdrop-blur-xl border-b border-border/20">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-lg font-bold text-txt">Treino Ativo</h2>
            <p className="text-sm text-txt-2">
              Exercício {currentExerciseIndex + 1} de {exercises.length}
            </p>
          </div>
          
          {(isPro || isPremium) && (
            <Badge variant="secondary" className="bg-accent/20 text-accent border-accent/30">
              <Crown className="w-3 h-3 mr-1" />
              {isPremium ? 'Premium' : 'Pro'}
            </Badge>
          )}
        </div>
        
        <Progress value={workoutProgress} className="h-2" />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {/* Current Exercise */}
        <Card className="glass-card p-4">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-txt mb-2">{currentExercise.name}</h3>
            <div className="flex items-center justify-center gap-4 text-sm text-txt-2">
              <span>Série {currentSet}/{currentExercise.sets}</span>
              <span>•</span>
              <span>{currentExercise.reps} reps</span>
            </div>
          </div>

          {/* Exercise Progress */}
          <div className="mb-4">
            <Progress value={(currentSet / currentExercise.sets) * 100} className="h-3" />
            <p className="text-xs text-txt-2 text-center mt-1">
              Progresso do exercício
            </p>
          </div>

          {/* Weight & Reps Input */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-txt-2 block mb-1">Peso (kg)</label>
              <input
                type="number"
                value={currentWeight}
                onChange={(e) => setCurrentWeight(e.target.value)}
                className="w-full p-2 bg-input-bg border border-input-border rounded-lg text-txt text-center"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-xs text-txt-2 block mb-1">Repetições</label>
              <input
                type="number"
                value={currentReps}
                onChange={(e) => setCurrentReps(e.target.value)}
                className="w-full p-2 bg-input-bg border border-input-border rounded-lg text-txt text-center"
                placeholder={currentExercise.reps}
              />
            </div>
          </div>

          {/* RPE Scale */}
          <div className="mb-4">
            <label className="text-xs text-txt-2 block mb-2">RPE (Esforço Percebido)</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <button
                  key={value}
                  onClick={() => setRPE(value)}
                  className={`flex-1 py-2 text-xs rounded transition-all ${
                    rpe === value
                      ? 'bg-accent text-accent-ink'
                      : 'bg-card/50 text-txt-2 hover:bg-card/80'
                  }`}
                >
                  {value}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Rest Timer */}
        {isResting && (
          <Card className="glass-card p-4 bg-gradient-to-r from-orange-500/20 to-red-500/20 border-orange-500/30">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Timer className="w-6 h-6 text-orange-400 mr-2" />
                <h4 className="text-lg font-bold text-txt">Descanso</h4>
              </div>
              
              <div className="text-4xl font-bold text-orange-400 mb-2">
                {formatTime(restTimer)}
              </div>
              
              <div className="flex items-center justify-center gap-2 mb-3">
                <button
                  onClick={() => setIsTimerActive(!isTimerActive)}
                  className="p-2 bg-card/50 rounded-lg hover:bg-card/80 transition-all"
                >
                  {isTimerActive ? <Pause className="w-4 h-4 text-txt" /> : <Play className="w-4 h-4 text-txt" />}
                </button>
                
                <button
                  onClick={() => {
                    setRestTimer(currentExercise.rest_s);
                    setIsTimerActive(true);
                  }}
                  className="p-2 bg-card/50 rounded-lg hover:bg-card/80 transition-all"
                >
                  <RotateCcw className="w-4 h-4 text-txt" />
                </button>
                
                <button
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="p-2 bg-card/50 rounded-lg hover:bg-card/80 transition-all"
                >
                  {audioEnabled ? <Volume2 className="w-4 h-4 text-txt" /> : <VolumeX className="w-4 h-4 text-txt" />}
                </button>
              </div>
              
              <Button
                onClick={() => {
                  setIsResting(false);
                  setIsTimerActive(false);
                  setRestTimer(0);
                }}
                variant="outline"
                size="sm"
                className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
              >
                Pular Descanso
              </Button>
            </div>
          </Card>
        )}

        {/* AI Coaching - Premium Feature */}
        <PlanGuard feature="IA Coaching" requiredPlan="pro">
          <Card className="glass-card p-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-blue-500/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-400" />
                <h4 className="text-sm font-semibold text-txt">IA Coach</h4>
              </div>
              
              <button
                onClick={() => setAiCoaching(!aiCoaching)}
                className={`px-3 py-1 rounded-full text-xs transition-all ${
                  aiCoaching 
                    ? 'bg-blue-500/30 text-blue-400 border border-blue-500/30' 
                    : 'bg-card/50 text-txt-2 hover:bg-card/80'
                }`}
              >
                {aiCoaching ? 'Ativo' : 'Inativo'}
              </button>
            </div>
            
            {aiCoaching && (
              <div className="space-y-2">
                <div className="flex items-start gap-2 p-2 bg-card/30 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Brain className="w-3 h-3 text-blue-400" />
                  </div>
                  <div>
                    <p className="text-xs text-txt">
                      💡 Dica: Mantenha os ombros para trás e o core contraído durante todo o movimento.
                    </p>
                    <p className="text-xs text-txt-2 mt-1">
                      Baseado na sua performance anterior
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-txt-2">
                  <CheckCircle className="w-3 h-3 text-green-400" />
                  <span>Forma técnica: Excelente</span>
                </div>
              </div>
            )}
          </Card>
        </PlanGuard>

        {/* Exercise List Preview */}
        <Card className="glass-card p-4">
          <h4 className="text-sm font-semibold text-txt-2 mb-3">Próximos Exercícios</h4>
          <div className="space-y-2">
            {exercises.slice(currentExerciseIndex + 1, currentExerciseIndex + 4).map((exercise, index) => (
              <div key={index} className="flex items-center gap-3 p-2 bg-card/30 rounded-lg">
                <div className="w-6 h-6 rounded-full bg-card/50 flex items-center justify-center text-xs text-txt-2">
                  {currentExerciseIndex + index + 2}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-txt truncate">{exercise.name}</p>
                  <p className="text-xs text-txt-2">{exercise.sets} × {exercise.reps}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-txt-3" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div className="flex-shrink-0 p-4 bg-card/50 backdrop-blur-xl border-t border-border/20">
        <div className="flex gap-3">
          <Button
            onClick={handleSetComplete}
            className="flex-1 btn-premium"
            disabled={isResting}
          >
            {currentSet < currentExercise.sets ? (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Série Completa
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Exercício Completo
              </>
            )}
          </Button>
          
          {currentExerciseIndex < exercises.length - 1 && (
            <Button
              onClick={onNext}
              variant="outline"
              className="px-4"
              disabled={isResting}
            >
              <SkipForward className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobilePremiumWorkout;