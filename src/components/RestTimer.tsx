import { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useVibration } from '@/hooks/useVibration';

interface RestTimerProps {
  exerciseName?: string;
  defaultDuration?: number;
  onComplete?: () => void;
  className?: string;
}

export function RestTimer({ 
  exerciseName = "Exercício", 
  defaultDuration = 90, 
  onComplete,
  className = ""
}: RestTimerProps) {
  const [duration, setDuration] = useState(defaultDuration);
  const [timeLeft, setTimeLeft] = useState(defaultDuration);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const { vibrate } = useVibration();

  // Smart duration suggestions based on exercise
  const getSuggestedDuration = useCallback((exercise: string) => {
    const suggestions = {
      'supino': 120,
      'agachamento': 180,
      'levantamento terra': 180,
      'desenvolvimento': 90,
      'tríceps': 60,
      'bíceps': 60,
      'abdominal': 45,
      'cardio': 30
    };

    const key = Object.keys(suggestions).find(k => 
      exercise.toLowerCase().includes(k)
    );
    
    return key ? suggestions[key as keyof typeof suggestions] : 90;
  }, []);

  useEffect(() => {
    if (exerciseName && exerciseName !== "Exercício") {
      const suggested = getSuggestedDuration(exerciseName);
      setDuration(suggested);
      setTimeLeft(suggested);
    }
  }, [exerciseName, getSuggestedDuration]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            vibrate([200, 100, 200]);
            onComplete?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, onComplete, vibrate]);

  const startTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(duration);
      setIsCompleted(false);
    }
    setIsActive(true);
    vibrate([100]);
  };

  const pauseTimer = () => {
    setIsActive(false);
    vibrate([50]);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration);
    setIsCompleted(false);
    vibrate([100, 50, 100]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((duration - timeLeft) / duration) * 100;

  return (
    <Card className={`glass-card p-6 ${className}`}>
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-txt">
            Descanso • {exerciseName}
          </h3>
          <div className="relative">
            <div 
              className={`text-4xl font-mono font-bold transition-all duration-300 ${
                isCompleted ? 'text-success animate-pulse-glow' : 
                timeLeft <= 10 ? 'text-warning animate-pulse' : 
                'text-accent'
              }`}
            >
              {formatTime(timeLeft)}
            </div>
            {isCompleted && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-success text-sm font-medium bg-surface/80 px-3 py-1 rounded-full backdrop-blur">
                  ✓ Pronto!
                </div>
              </div>
            )}
          </div>
        </div>

        <Progress 
          value={progress} 
          className="h-2 bg-surface"
        />

        <div className="flex justify-center gap-3">
          <Button
            onClick={isActive ? pauseTimer : startTimer}
            size="sm"
            className="glass-button hover:scale-105 transition-transform"
            disabled={timeLeft === 0 && isCompleted}
          >
            {isActive ? (
              <Pause className="w-4 h-4 mr-2" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            {isActive ? 'Pausar' : 'Iniciar'}
          </Button>

          <Button
            onClick={resetTimer}
            size="sm"
            variant="outline"
            className="glass-button hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>

          <Button
            onClick={() => {
              const newDuration = duration === 60 ? 90 : duration === 90 ? 120 : 60;
              setDuration(newDuration);
              setTimeLeft(newDuration);
            }}
            size="sm"
            variant="outline"
            className="glass-button hover:scale-105 transition-transform"
          >
            <Settings className="w-4 h-4 mr-2" />
            {duration}s
          </Button>
        </div>

        <div className="text-xs text-txt-3">
          Dica: {timeLeft <= 30 ? 'Quase lá! Prepare-se para a próxima série' : 
                 timeLeft <= 60 ? 'Meio caminho andado, relaxa' : 
                 'Respira fundo e hidrata'}
        </div>
      </div>
    </Card>
  );
}