import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Play, Clock, Target, Users, Star } from 'lucide-react';
import { toast } from 'sonner';

interface WorkoutTemplate {
  id: string;
  name: string;
  description: string;
  focus: string;
  target_muscle_groups: string[];
  difficulty_level: number;
  estimated_duration: number;
  is_public: boolean;
  template_exercises: {
    id: string;
    order_index: number;
    sets: number;
    reps_target: string;
    rest_seconds: number;
    exercises: {
      name: string;
      primary_muscles: string[];
      equipment: string;
    };
  }[];
}

export const MobileWorkoutTemplates = ({ onStartWorkout }) => {
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWorkoutTemplates();
  }, []);

  const loadWorkoutTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('workout_templates')
        .select(`
          *,
          template_exercises (
            *,
            exercises (
              name,
              primary_muscles,
              equipment
            )
          )
        `)
        .eq('is_public', true)
        .order('name');

      if (error) throw error;

      setTemplates(data || []);
    } catch (error) {
      console.error('Erro ao carregar templates:', error);
      toast.error('Erro ao carregar templates de treino');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTemplate = (template: WorkoutTemplate) => {
    const workout = {
      id: template.id,
      name: template.name,
      focus: template.focus,
      exercises: template.template_exercises
        .sort((a, b) => a.order_index - b.order_index)
        .map(te => ({
          name: te.exercises.name,
          sets: te.sets,
          reps: te.reps_target || '8-12',
          rest_s: te.rest_seconds || 90,
          equipment: te.exercises.equipment,
          primary_muscles: te.exercises.primary_muscles
        }))
    };

    onStartWorkout(workout);
    toast.success(`🔥 ${template.name} iniciado!`);
  };

  const getDifficultyColor = (level: number) => {
    if (level <= 2) return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (level <= 3) return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-red-500/20 text-red-400 border-red-500/30';
  };

  const getDifficultyLabel = (level: number) => {
    if (level <= 2) return 'Iniciante';
    if (level <= 3) return 'Intermediário';
    return 'Avançado';
  };

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="glass-card p-4 animate-pulse">
            <div className="h-4 bg-surface rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-surface rounded w-1/2 mb-3"></div>
            <div className="h-8 bg-surface rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="text-center py-8">
        <Target className="w-12 h-12 text-txt-3 mx-auto mb-4" />
        <p className="text-txt-2">Nenhum template disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="text-center mb-4">
        <h2 className="text-lg font-semibold text-txt mb-2">
          🏋️ Templates de Treino
        </h2>
        <p className="text-sm text-txt-2">
          Treinos prontos criados por especialistas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="glass-card p-4 hover:bg-surface/80 transition-all group">
            <div className="space-y-3">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-txt text-sm md:text-base line-clamp-2 group-hover:text-accent transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-xs md:text-sm text-txt-2 mt-1">
                    {template.focus}
                  </p>
                </div>
                <Badge className={`${getDifficultyColor(template.difficulty_level)} border text-xs flex-shrink-0 ml-2`}>
                  {getDifficultyLabel(template.difficulty_level)}
                </Badge>
              </div>

              {/* Description */}
              {template.description && (
                <p className="text-xs text-txt-2 line-clamp-2">
                  {template.description}
                </p>
              )}

              {/* Muscle groups */}
              {template.target_muscle_groups?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {template.target_muscle_groups.slice(0, 3).map((muscle, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs px-2 py-0.5">
                      {muscle}
                    </Badge>
                  ))}
                  {template.target_muscle_groups.length > 3 && (
                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                      +{template.target_muscle_groups.length - 3}
                    </Badge>
                  )}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center justify-between text-xs text-txt-3">
                <div className="flex items-center gap-1">
                  <Target className="w-3 h-3" />
                  <span>{template.template_exercises?.length || 0} exercícios</span>
                </div>
                {template.estimated_duration && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{template.estimated_duration} min</span>
                  </div>
                )}
              </div>

              {/* Action button */}
              <Button 
                className="w-full bg-accent text-accent-ink hover:bg-accent/90 text-sm"
                onClick={() => handleStartTemplate(template)}
              >
                <Play className="w-3 h-3 mr-2" />
                Iniciar Treino
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MobileWorkoutTemplates;