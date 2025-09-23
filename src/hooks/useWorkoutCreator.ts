import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WorkoutTemplate {
  id: string;
  name: string;
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest_s: number;
    weight?: number;
  }>;
}

interface CreateWorkoutData {
  name: string;
  focus: string;
  exercises: Array<{
    exerciseId: string;
    exerciseName: string;
    sets: number;
    reps: string;
    restSeconds: number;
    initialWeight?: number;
  }>;
}

export function useWorkoutCreator() {
  const { user } = useAuth();
  const [creating, setCreating] = useState(false);
  const [templates, setTemplates] = useState<WorkoutTemplate[]>([]);

  const createWorkout = async (workoutData: CreateWorkoutData): Promise<WorkoutTemplate | null> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setCreating(true);
    try {
      // Criar template do treino
      const template: WorkoutTemplate = {
        id: `workout-${Date.now()}`,
        name: workoutData.name,
        focus: workoutData.focus,
        exercises: workoutData.exercises.map(ex => ({
          name: ex.exerciseName,
          sets: ex.sets,
          reps: ex.reps,
          rest_s: ex.restSeconds,
          weight: ex.initialWeight || 0
        }))
      };

      // Salvar no localStorage para acesso rápido
      const savedTemplates = JSON.parse(localStorage.getItem('workout_templates') || '[]');
      savedTemplates.push(template);
      localStorage.setItem('workout_templates', JSON.stringify(savedTemplates));

      // Opcional: Salvar no Supabase como backup
      try {
        const { error } = await supabase
          .from('workout_templates')
          .insert([{
            user_id: user.id,
            name: template.name,
            focus: template.focus,
            exercises: template.exercises,
            created_at: new Date().toISOString()
          }]);

        if (error) console.warn('Erro ao salvar template no Supabase:', error);
      } catch (error) {
        console.warn('Supabase não disponível, usando apenas localStorage');
      }

      setTemplates([...templates, template]);
      toast.success(`Treino "${workoutData.name}" criado com sucesso!`);
      return template;
      
    } catch (error) {
      console.error('Erro ao criar treino:', error);
      toast.error('Erro ao criar treino');
      return null;
    } finally {
      setCreating(false);
    }
  };

  const loadTemplates = () => {
    const savedTemplates = JSON.parse(localStorage.getItem('workout_templates') || '[]');
    setTemplates(savedTemplates);
    return savedTemplates;
  };

  const deleteTemplate = (templateId: string) => {
    const updatedTemplates = templates.filter(t => t.id !== templateId);
    setTemplates(updatedTemplates);
    localStorage.setItem('workout_templates', JSON.stringify(updatedTemplates));
    toast.success('Treino removido');
  };

  const getQuickWorkoutTemplates = (): WorkoutTemplate[] => {
    return [
      {
        id: 'quick-upper',
        name: 'Upper Body Express',
        focus: 'Membros Superiores',
        exercises: [
          { name: 'Supino Reto', sets: 3, reps: '8-10', rest_s: 90, weight: 0 },
          { name: 'Puxada Alta', sets: 3, reps: '8-10', rest_s: 90, weight: 0 },
          { name: 'Desenvolvimento', sets: 3, reps: '10-12', rest_s: 60, weight: 0 },
          { name: 'Rosca Bíceps', sets: 3, reps: '12-15', rest_s: 45, weight: 0 }
        ]
      },
      {
        id: 'quick-lower',
        name: 'Lower Body Power',
        focus: 'Membros Inferiores',
        exercises: [
          { name: 'Agachamento', sets: 4, reps: '8-10', rest_s: 120, weight: 0 },
          { name: 'Leg Press', sets: 3, reps: '12-15', rest_s: 90, weight: 0 },
          { name: 'Stiff', sets: 3, reps: '10-12', rest_s: 90, weight: 0 },
          { name: 'Panturrilha', sets: 4, reps: '15-20', rest_s: 45, weight: 0 }
        ]
      },
      {
        id: 'quick-full',
        name: 'Full Body Essential',
        focus: 'Corpo Inteiro',
        exercises: [
          { name: 'Supino Reto', sets: 3, reps: '8-10', rest_s: 90, weight: 0 },
          { name: 'Agachamento', sets: 3, reps: '10-12', rest_s: 90, weight: 0 },
          { name: 'Puxada Alta', sets: 3, reps: '8-10', rest_s: 90, weight: 0 },
          { name: 'Desenvolvimento', sets: 3, reps: '10-12', rest_s: 60, weight: 0 }
        ]
      }
    ];
  };

  return {
    createWorkout,
    loadTemplates,
    deleteTemplate,
    getQuickWorkoutTemplates,
    templates,
    creating
  };
}