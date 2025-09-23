import { useState } from "react";
import { X, RotateCcw, ZoomIn, ZoomOut, Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExerciseInstructions } from "./ExerciseInstructions";

interface Exercise {
  id: string;
  name: string;
  category_id?: string;
  primary_muscles?: string[];
  secondary_muscles?: string[];
  equipment?: string;
  difficulty_level?: number;
  instructions?: string[];
  form_tips?: string[];
  model_3d_url?: string | null;
  demo_video_url?: string | null;
  thumbnail_url?: string | null;
  exercise_categories?: {
    name: string;
    icon: string;
  };
}

interface Exercise3DViewerProps {
  exercise: Exercise;
  onClose: () => void;
}

export function Exercise3DViewer({ exercise, onClose }: Exercise3DViewerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentView, setCurrentView] = useState<'3d' | 'instructions'>('instructions');

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
        <Card className="liquid-glass border border-line/20">
          {/* Header */}
          <div className="p-6 border-b border-line/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-txt">{exercise.name}</h2>
                  <p className="text-txt-2">{exercise.exercise_categories?.name}</p>
                </div>
                {exercise.model_3d_url && (
                  <Badge className="bg-gradient-to-r from-accent to-accent-2 text-accent-ink">
                    Visualização 3D
                  </Badge>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={currentView === 'instructions' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('instructions')}
                  className={currentView === 'instructions' ? 'bg-accent text-accent-ink' : 'glass-button'}
                >
                  Instruções
                </Button>
                <Button
                  variant={currentView === '3d' ? 'default' : 'outline'}
                  onClick={() => setCurrentView('3d')}
                  className={currentView === '3d' ? 'bg-accent text-accent-ink' : 'glass-button'}
                >
                  Visualização 3D
                </Button>
                <Button variant="ghost" size="icon" onClick={onClose} className="glass-button">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
            {currentView === 'instructions' ? (
              <ExerciseInstructions
                exerciseName={exercise.name}
                instructions={exercise.instructions}
                formTips={exercise.form_tips}
                equipment={exercise.equipment}
                difficulty={exercise.difficulty_level}
                primaryMuscles={exercise.primary_muscles}
                secondaryMuscles={exercise.secondary_muscles}
              />
            ) : (
              <div className="space-y-6">
                {/* 3D Viewer Container */}
                <div className="relative">
                  <div className="aspect-video bg-gradient-to-br from-surface to-card rounded-xl border border-line/20 flex items-center justify-center">
                    {exercise.model_3d_url ? (
                      <div className="text-center space-y-4">
                        {/* Placeholder for actual 3D model */}
                        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-r from-accent to-accent-2 flex items-center justify-center animate-pulse">
                          <Play className="w-12 h-12 text-accent-ink" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-txt">Modelo 3D Carregando</h3>
                          <p className="text-txt-2">Visualização interativa em desenvolvimento</p>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center space-y-4">
                        <div className="w-24 h-24 mx-auto rounded-full bg-surface border border-line/50 flex items-center justify-center">
                          <ZoomIn className="w-12 h-12 text-txt-3" />
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-bold text-txt">Modelo 3D Não Disponível</h3>
                          <p className="text-txt-2">Confira as instruções detalhadas na aba ao lado</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 3D Controls */}
                  {exercise.model_3d_url && (
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-4 py-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handlePlayPause}
                          className="text-white hover:text-accent"
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:text-accent"
                        >
                          <RotateCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:text-accent"
                        >
                          <ZoomIn className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-white hover:text-accent"
                        >
                          <ZoomOut className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 3D Info */}
                <Card className="liquid-glass p-4 border border-line/20">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-txt">Sobre a Visualização 3D</h4>
                    <ul className="space-y-2 text-sm text-txt-2">
                      <li>• Clique e arraste para rotacionar o modelo</li>
                      <li>• Use a roda do mouse para dar zoom</li>
                      <li>• Clique em play para ver a animação do movimento</li>
                      <li>• Use os controles para resetar a visualização</li>
                    </ul>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}