import { useState, useEffect } from 'react';
import { Timer, Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface FocusModeProps {
  isActive: boolean;
  onToggle: () => void;
  currentExercise?: string;
  currentSet?: number;
  totalSets?: number;
  restTime?: number;
  className?: string;
}

export function FocusMode({ 
  isActive, 
  onToggle, 
  currentExercise = "Exercício",
  currentSet = 1,
  totalSets = 3,
  restTime = 0,
  className = ""
}: FocusModeProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [motivation, setMotivation] = useState('');

  const motivationalPhrases = [
    "Foco total! Você consegue!",
    "Esta série é sua. Domine ela.",
    "Respiração controlada. Movimento perfeito.",
    "Seu melhor rep está chegando.",
    "Concentração máxima agora.",
    "Forme e técnica. Sempre.",
    "Você é mais forte que pensa.",
    "Esta é sua zona. Aproveite.",
    "Mente calma, músculo trabalhando.",
    "Qualidade sobre quantidade."
  ];

  useEffect(() => {
    if (isActive) {
      const randomMotivation = motivationalPhrases[
        Math.floor(Math.random() * motivationalPhrases.length)
      ];
      setMotivation(randomMotivation);
      
      // Change motivation every 30 seconds
      const interval = setInterval(() => {
        const newMotivation = motivationalPhrases[
          Math.floor(Math.random() * motivationalPhrases.length)
        ];
        setMotivation(newMotivation);
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isActive]);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (error) {
      console.log('Fullscreen not supported');
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!isActive) {
    return (
      <Button
        onClick={onToggle}
        className="glass-button hover:scale-105 transition-transform"
        size="sm"
      >
        <Timer className="w-4 h-4 mr-2" />
        Modo Foco
      </Button>
    );
  }

  const progress = totalSets > 0 ? (currentSet / totalSets) * 100 : 0;

  return (
    <div className={`fixed inset-0 z-50 bg-bg/95 backdrop-blur-xl ${className}`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-line/30">
          <div className="flex items-center gap-4">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" />
            <span className="text-sm font-medium text-accent">MODO FOCO ATIVO</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              onClick={() => setSoundEnabled(!soundEnabled)}
              size="sm"
              variant="ghost"
              className="glass-button"
            >
              {soundEnabled ? (
                <Volume2 className="w-4 h-4" />
              ) : (
                <VolumeX className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              onClick={toggleFullscreen}
              size="sm"
              variant="ghost"
              className="glass-button"
            >
              {isFullscreen ? (
                <Minimize className="w-4 h-4" />
              ) : (
                <Maximize className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              onClick={onToggle}
              size="sm"
              className="glass-button hover:bg-error/20"
            >
              Sair
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          {/* Exercise Info */}
          <div className="text-center space-y-4">
            <div className="text-6xl font-display font-bold text-gradient animate-fade-in">
              {currentExercise}
            </div>
            
            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-accent">
                  {currentSet}
                </div>
                <div className="text-sm text-txt-3 uppercase tracking-wider">
                  Série Atual
                </div>
              </div>
              
              <div className="w-px h-12 bg-line" />
              
              <div className="text-center">
                <div className="text-4xl font-mono font-bold text-txt-2">
                  {totalSets}
                </div>
                <div className="text-sm text-txt-3 uppercase tracking-wider">
                  Total
                </div>
              </div>
            </div>
          </div>

          {/* Progress */}
          <div className="w-full max-w-2xl space-y-4">
            <Progress 
              value={progress} 
              className="h-4 bg-surface shadow-inner"
            />
            <div className="flex justify-between text-sm text-txt-3">
              <span>Progresso do Treino</span>
              <span>{Math.round(progress)}% Completo</span>
            </div>
          </div>

          {/* Motivation */}
          <Card className="glass-card p-6 max-w-md">
            <div className="text-center">
              <div className="text-lg font-medium text-txt-2 animate-pulse">
                {motivation}
              </div>
            </div>
          </Card>

          {/* Rest Timer (if active) */}
          {restTime > 0 && (
            <Card className="glass-card p-8 border-accent/50">
              <div className="text-center space-y-4">
                <div className="text-sm text-accent uppercase tracking-wider">
                  Tempo de Descanso
                </div>
                <div className="text-5xl font-mono font-bold text-accent animate-pulse-glow">
                  {Math.floor(restTime / 60)}:{(restTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-txt-3">
                  Respire fundo e se prepare
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Breathing Guide */}
        <div className="p-6 border-t border-line/30">
          <div className="flex items-center justify-center">
            <div className="text-center space-y-2">
              <div className="w-20 h-20 rounded-full border-2 border-accent/30 flex items-center justify-center animate-float">
                <div className="w-12 h-12 rounded-full bg-accent/20 animate-pulse" />
              </div>
              <div className="text-sm text-txt-3">
                Respire com calma
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}