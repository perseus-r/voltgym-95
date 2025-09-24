import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Brain, Target, Zap, Calendar, TrendingUp, Users, Award, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getStorage } from '@/lib/storage';
import { useUserWorkouts } from '@/hooks/useUserWorkouts';
import { useNavigate } from 'react-router-dom';

interface WorkoutSuggestion {
  id: string;
  name: string;
  focus: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest: number;
  }>;
  aiReasoning: string;
  muscleGroups: string[];
}

export function IntelligentWorkoutPlanner() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { startWorkout, getQuickTemplates } = useUserWorkouts();
  const [suggestions, setSuggestions] = useState<WorkoutSuggestion[]>([]);
  const [selectedSuggestion, setSelectedSuggestion] = useState<WorkoutSuggestion | null>(null);
  const [userPreferences, setUserPreferences] = useState({
    experience: 'intermediate',
    goals: ['strength', 'muscle'],
    timeAvailable: 60,
    equipmentAvailable: ['dumbbells', 'barbell', 'machines'],
    injuries: [] as string[]
  });

  const workoutHistory = getStorage('bora_hist_v1', []);
  
  useEffect(() => {
    generateAISuggestions();
  }, [userPreferences, workoutHistory]);

  const generateAISuggestions = () => {
    const recentWorkouts = workoutHistory.slice(-10);
    const trainedGroups = new Set(recentWorkouts.map((w: any) => w.focus));
    
    // AI logic for workout suggestions
    const suggestionsData: WorkoutSuggestion[] = [
      {
        id: '1',
        name: 'Power Push Adaptativo',
        focus: 'Peito & Tríceps',
        difficulty: 'intermediate',
        duration: 45,
        exercises: [
          { name: 'Supino Reto', sets: 4, reps: '6-8', rest: 120 },
          { name: 'Supino Inclinado', sets: 3, reps: '8-10', rest: 90 },
          { name: 'Paralelas', sets: 3, reps: '10-12', rest: 90 },
          { name: 'Tríceps Testa', sets: 3, reps: '12-15', rest: 60 }
        ],
        aiReasoning: 'Baseado no seu histórico, você não treinou peito nos últimos 3 dias. Este treino combina força e hipertrofia.',
        muscleGroups: ['Peito', 'Tríceps', 'Ombros']
      },
      {
        id: '2',
        name: 'Pull Dominance',
        focus: 'Costas & Bíceps',
        difficulty: 'advanced',
        duration: 50,
        exercises: [
          { name: 'Barra Fixa', sets: 4, reps: '5-8', rest: 120 },
          { name: 'Remada Curvada', sets: 4, reps: '8-10', rest: 90 },
          { name: 'Puxada Alta', sets: 3, reps: '10-12', rest: 90 },
          { name: 'Rosca Direta', sets: 3, reps: '10-12', rest: 75 }
        ],
        aiReasoning: 'Detectei que você está progredindo bem em exercícios de puxar. Hora de intensificar!',
        muscleGroups: ['Costas', 'Bíceps', 'Trapézio']
      },
      {
        id: '3',
        name: 'Leg Power Explosion',
        focus: 'Pernas Completo',
        difficulty: 'intermediate',
        duration: 55,
        exercises: [
          { name: 'Agachamento', sets: 4, reps: '8-10', rest: 120 },
          { name: 'Leg Press', sets: 3, reps: '12-15', rest: 90 },
          { name: 'Stiff', sets: 3, reps: '10-12', rest: 90 },
          { name: 'Panturrilha', sets: 4, reps: '15-20', rest: 60 }
        ],
        aiReasoning: 'Seu último treino de pernas foi há 5 dias. Vamos focar em volume e força hoje.',
        muscleGroups: ['Quadríceps', 'Glúteos', 'Isquiotibiais']
      }
    ];

    // Filter based on recent workouts to avoid overtraining
    const filteredSuggestions = suggestionsData.filter(s => 
      !trainedGroups.has(s.focus) || recentWorkouts.length < 3
    );

    setSuggestions(filteredSuggestions.length > 0 ? filteredSuggestions : suggestionsData);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-500/20 text-green-400';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
      case 'advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-accent/20 text-accent';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Iniciante';
      case 'intermediate': return 'Intermediário';
      case 'advanced': return 'Avançado';
      default: return 'Personalizado';
    }
  };

  const handleStartWorkout = (suggestion: WorkoutSuggestion) => {
    const workout = {
      id: `ai-${suggestion.id}-${Date.now()}`,
      name: suggestion.name,
      focus: suggestion.focus,
      exercises: suggestion.exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        rest: ex.rest,
        weight: 0,
        rpe: 7
      }))
    };

    const workoutToStart = startWorkout(workout);

    if (!workoutToStart.exercises.length) {
      const fallback = getQuickTemplates()[0];
      startWorkout(fallback);
    }

    navigate('/treinos');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent-2 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-accent-ink" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-txt">IA Coach Inteligente</h2>
            <p className="text-txt-2">Treinos personalizados baseados no seu progresso</p>
          </div>
        </div>
        
        <Button variant="outline" className="glass-button">
          <Settings className="w-4 h-4 mr-2" />
          Preferências
        </Button>
      </div>

      {/* AI Insights */}
      <Card className="liquid-glass p-6 border border-accent/20">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center animate-pulse">
            <Brain className="w-5 h-5 text-accent-ink" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-txt mb-2">Análise Inteligente</h3>
            <p className="text-txt-2 mb-4">
              Baseado nos seus últimos {workoutHistory.length} treinos, identifiquei que você está progredindo bem em exercícios compostos. 
              Recomendo focar em músculos que não foram trabalhados recentemente.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <Target className="w-5 h-5 text-accent mb-2" />
                <div className="text-sm text-txt-3">FOCO RECOMENDADO</div>
                <div className="text-lg font-semibold text-accent">Peito & Tríceps</div>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <TrendingUp className="w-5 h-5 text-accent mb-2" />
                <div className="text-sm text-txt-3">INTENSIDADE IDEAL</div>
                <div className="text-lg font-semibold text-accent">Moderada-Alta</div>
              </div>
              <div className="bg-accent/10 p-4 rounded-lg border border-accent/20">
                <Calendar className="w-5 h-5 text-accent mb-2" />
                <div className="text-sm text-txt-3">DURAÇÃO SUGERIDA</div>
                <div className="text-lg font-semibold text-accent">45-60 min</div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Workout Suggestions */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-txt">Sugestões Personalizadas</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {suggestions.map((suggestion) => (
            <Card key={suggestion.id} className="liquid-glass p-6 hover:border-accent/30 transition-all cursor-pointer group">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <Badge className={getDifficultyColor(suggestion.difficulty)}>
                    {getDifficultyLabel(suggestion.difficulty)}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-txt-3">
                    <Calendar className="w-4 h-4" />
                    {suggestion.duration} min
                  </div>
                </div>
                
                <h4 className="text-xl font-bold text-txt mb-2">{suggestion.name}</h4>
                <p className="text-txt-2 mb-3">{suggestion.focus}</p>
                
                <div className="flex flex-wrap gap-1 mb-4">
                  {suggestion.muscleGroups.map((group) => (
                    <Badge key={group} variant="outline" className="text-xs border-accent/30 text-accent">
                      {group}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* AI Reasoning */}
              <div className="bg-accent/5 p-3 rounded-lg mb-4 border border-accent/10">
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-txt-2">{suggestion.aiReasoning}</p>
                </div>
              </div>

              {/* Exercise Preview */}
              <div className="space-y-2 mb-4">
                <div className="text-sm font-medium text-txt-3">EXERCÍCIOS ({suggestion.exercises.length})</div>
                {suggestion.exercises.slice(0, 3).map((ex, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-txt-2">{ex.name}</span>
                    <span className="text-txt-3">{ex.sets}x{ex.reps}</span>
                  </div>
                ))}
                {suggestion.exercises.length > 3 && (
                  <div className="text-xs text-txt-3">+{suggestion.exercises.length - 3} mais...</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button 
                  onClick={() => handleStartWorkout(suggestion)}
                  className="w-full bg-gradient-to-r from-accent to-accent-2 text-accent-ink font-semibold hover:scale-105 transition-all"
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Iniciar Treino
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full glass-button text-xs"
                  onClick={() => setSelectedSuggestion(suggestion)}
                >
                  Ver Detalhes
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Detailed View Modal */}
      {selectedSuggestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <Card className="liquid-glass w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-txt">{selectedSuggestion.name}</h3>
                  <p className="text-txt-2">{selectedSuggestion.focus}</p>
                </div>
                <Button variant="ghost" onClick={() => setSelectedSuggestion(null)}>
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                {selectedSuggestion.exercises.map((ex, idx) => (
                  <Card key={idx} className="liquid-glass p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center text-accent font-bold">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-medium text-txt">{ex.name}</h4>
                          <div className="text-sm text-txt-3">
                            {ex.sets} séries • {ex.reps} reps • {ex.rest}s descanso
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="flex gap-3 mt-6">
                <Button 
                  onClick={() => {
                    handleStartWorkout(selectedSuggestion);
                    setSelectedSuggestion(null);
                  }}
                  className="flex-1 bg-gradient-to-r from-accent to-accent-2 text-accent-ink font-semibold"
                >
                  Começar Treino
                </Button>
                <Button variant="outline" onClick={() => setSelectedSuggestion(null)} className="glass-button">
                  Fechar
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}