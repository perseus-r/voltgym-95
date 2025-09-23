import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, RotateCcw, Info, ChevronLeft, ChevronRight } from 'lucide-react';

interface Exercise3D {
  id: string;
  name: string;
  category: string;
  difficulty: 'Iniciante' | 'Intermediário' | 'Avançado';
  targetMuscles: string[];
  description: string;
  steps: string[];
  commonMistakes: string[];
  tips: string[];
  equipment: string;
}

const mock3DExercises: Exercise3D[] = [
  {
    id: '1',
    name: 'Supino Reto',
    category: 'Peito',
    difficulty: 'Iniciante',
    targetMuscles: ['Peitoral Maior', 'Tríceps', 'Deltoides Anterior'],
    description: 'Exercício fundamental para desenvolvimento do peitoral',
    steps: [
      'Deite no banco com os pés apoiados no chão',
      'Posicione as mãos na barra com pegada pronada',
      'Retire a barra do suporte mantendo tensão',
      'Desça controladamente até o peito',
      'Empurre a barra de volta à posição inicial'
    ],
    commonMistakes: [
      'Barra muito alta no peito',
      'Perder tensão na descida',
      'Pés instáveis'
    ],
    tips: [
      'Mantenha escápulas retraídas',
      'Caminho em "J" no movimento',
      'Ritmo 2-0-2 (descida-pausa-subida)'
    ],
    equipment: 'Barra e anilhas'
  },
  {
    id: '2',
    name: 'Agachamento Livre',
    category: 'Pernas',
    difficulty: 'Intermediário',
    targetMuscles: ['Quadríceps', 'Glúteos', 'Isquiotibiais'],
    description: 'Rei dos exercícios para membros inferiores',
    steps: [
      'Posicione a barra no trapézio',
      'Pés na largura dos ombros',
      'Desça flexionando quadril e joelhos',
      'Mantenha joelhos alinhados com os pés',
      'Suba empurrando o chão'
    ],
    commonMistakes: [
      'Joelhos colapsando para dentro',
      'Inclinar muito o tronco',
      'Não ativar o core'
    ],
    tips: [
      'Ative o core antes de iniciar',
      'Olhar fixo à frente',
      'Empurre o chão com força'
    ],
    equipment: 'Barra, anilhas e rack'
  }
];

interface Exercise3DPreviewProps {
  userLevel?: string;
}

export function Exercise3DPreview({ userLevel = 'Iniciante' }: Exercise3DPreviewProps) {
  const [exercises] = useState<Exercise3D[]>(mock3DExercises);
  const [selectedExercise, setSelectedExercise] = useState<Exercise3D>(exercises[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simulate 3D animation
      const interval = setInterval(() => {
        setCurrentStep(prev => {
          if (prev >= selectedExercise.steps.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return 0;
          }
          return prev + 1;
        });
      }, 2000);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => 
      prev < selectedExercise.steps.length - 1 ? prev + 1 : 0
    );
  };

  const prevStep = () => {
    setCurrentStep(prev => 
      prev > 0 ? prev - 1 : selectedExercise.steps.length - 1
    );
  };

  // Check if user has access based on level
  const hasAccess = userLevel !== 'Recruta';

  if (!hasAccess) {
    return (
      <div className="glass-card p-6 text-center">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <div className="text-lg font-bold text-muted-foreground">3D</div>
        </div>
        <h3 className="text-xl font-semibold text-txt mb-2">Preview 3D - Acesso Restrito</h3>
        <p className="text-txt-2 mb-4">
          Os previews 3D de exercícios estão disponíveis para usuários <Badge className="bg-accent/20 text-accent">Soldado+</Badge>
        </p>
        <p className="text-sm text-txt-3 mb-4">
          Complete mais treinos para desbloquear esta funcionalidade premium!
        </p>
        <Button className="btn-premium">
          Fazer Upgrade
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-accent/20">
            <Play className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-txt">Preview 3D Exercícios</h2>
            <p className="text-txt-2">Demonstrações interativas para execução perfeita</p>
          </div>
        </div>

        {/* Exercise Selector */}
        <div className="flex gap-2 overflow-x-auto">
          {exercises.map((exercise) => (
            <button
              key={exercise.id}
              onClick={() => {
                setSelectedExercise(exercise);
                setCurrentStep(0);
                setIsPlaying(false);
              }}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedExercise.id === exercise.id
                  ? 'bg-accent/20 text-accent'
                  : 'glass-button'
              }`}
            >
              {exercise.name}
            </button>
          ))}
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="glass-card p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-txt mb-2">{selectedExercise.name}</h3>
          <div className="flex justify-center gap-2 mb-4">
            <Badge className="bg-accent/20 text-accent">{selectedExercise.category}</Badge>
            <Badge variant="outline">{selectedExercise.difficulty}</Badge>
          </div>
          <p className="text-txt-2">{selectedExercise.description}</p>
        </div>

        {/* 3D Animation Area */}
        <div className="relative bg-gradient-to-br from-bg to-surface rounded-xl border border-line min-h-[300px] flex items-center justify-center mb-6">
          {/* 3D Figure Placeholder */}
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
              <div className="text-2xl font-bold text-primary-foreground">3D</div>
            </div>
            <div className="text-lg font-semibold text-txt mb-2">
              Passo {currentStep + 1}/{selectedExercise.steps.length}
            </div>
            <div className="max-w-md text-txt-2">
              {selectedExercise.steps[currentStep]}
            </div>
          </div>

          {/* Play Button Overlay */}
          {!isPlaying && (
            <button
              onClick={handlePlay}
              className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl opacity-0 hover:opacity-100 transition-opacity"
            >
              <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center">
                <Play className="w-8 h-8 text-accent-ink" />
              </div>
            </button>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={prevStep}
            disabled={isPlaying}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          <Button
            onClick={handlePlay}
            className="btn-premium"
          >
            {isPlaying ? 'Pausar' : 'Reproduzir'}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={nextStep}
            disabled={isPlaying}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentStep(0)}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>

        {/* Exercise Info Tabs */}
        <div className="flex gap-2 mb-4">
          <Button
            variant={!showTips ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTips(false)}
          >
            Músculos Trabalhados
          </Button>
          <Button
            variant={showTips ? "default" : "outline"}
            size="sm"
            onClick={() => setShowTips(true)}
          >
            <Info className="w-4 h-4 mr-1" />
            Dicas & Erros
          </Button>
        </div>

        {/* Info Panel */}
        <div className="glass-card p-4">
          {!showTips ? (
            <div>
              <h4 className="font-semibold text-txt mb-2">Músculos Principais:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedExercise.targetMuscles.map((muscle, index) => (
                  <Badge key={index} variant="secondary" className="bg-accent/10 text-accent">
                    {muscle}
                  </Badge>
                ))}
              </div>
              <div className="mt-4">
                <span className="text-sm text-txt-3">Equipamento: </span>
                <span className="text-sm text-txt">{selectedExercise.equipment}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-txt mb-2">Dicas Importantes:</h4>
                <ul className="space-y-1">
                  {selectedExercise.tips.map((tip, index) => (
                    <li key={index} className="text-sm text-txt-2 flex items-start gap-2">
                      <span className="text-accent">•</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-txt mb-2">Erros Comuns:</h4>
                <ul className="space-y-1">
                  {selectedExercise.commonMistakes.map((mistake, index) => (
                    <li key={index} className="text-sm text-txt-2 flex items-start gap-2">
                      <span className="text-error">•</span>
                      {mistake}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Access Info */}
      <div className="glass-card p-4 text-center">
        <p className="text-sm text-txt-3">
          Preview 3D disponível para usuários <Badge className="bg-accent/20 text-accent">Soldado+</Badge>
        </p>
        <p className="text-xs text-txt-3 mt-1">
          Mais exercícios e ângulos de câmera disponíveis na versão premium
        </p>
      </div>
    </div>
  );
}