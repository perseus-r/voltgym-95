import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { unifiedDataService } from '@/services/UnifiedDataService';
import { toast } from 'sonner';

export interface UserWorkoutData {
  id: string;
  name: string;
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string | number;
    weight?: number;
    rpe?: number;
    notes?: string;
    rest?: number;
  }>;
  created_at?: string;
  completed_at?: string;
  is_template?: boolean;
  description?: string;
}

export interface UserStats {
  level: number;
  xp: number;
  nextLevelXP: number;
  streak: number;
  completedWorkouts: number;
  weeklyGoal: number;
  weeklyCompleted: number;
  totalVolume: number;
}

export function useUserWorkouts() {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState<UserWorkoutData[]>([]);
  const [stats, setStats] = useState<UserStats>({
    level: 1,
    xp: 0,
    nextLevelXP: 100,
    streak: 0,
    completedWorkouts: 0,
    weeklyGoal: 4,
    weeklyCompleted: 0,
    totalVolume: 0
  });
  const [templates, setTemplates] = useState<UserWorkoutData[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeWorkout, setActiveWorkout] = useState<UserWorkoutData | null>(null);

  // Load user data
  const loadUserData = async () => {
    if (!user) {
      // Para usuários não logados, zerar dados
      setStats({
        level: 1,
        xp: 0,
        nextLevelXP: 100,
        streak: 0,
        completedWorkouts: 0,
        weeklyGoal: 4,
        weeklyCompleted: 0,
        totalVolume: 0
      });
      setWorkouts([]);
      setTemplates([]);
      return;
    }

    setLoading(true);
    try {
      // Load workout history
      const history = await unifiedDataService.getWorkoutHistory(50);
      setWorkouts(history.map(w => ({
        id: w.id || `workout_${Date.now()}`,
        name: w.name,
        focus: w.focus,
        exercises: w.exercises,
        created_at: w.started_at,
        completed_at: w.completed_at,
        is_template: false
      })));

      // Load user stats
      const userStats = await unifiedDataService.getUserStats();
      const level = Math.floor(userStats.currentXP / 100) + 1;
      const currentLevelXP = (level - 1) * 100;
      const nextLevelXP = level * 100;
      
      setStats({
        level,
        xp: userStats.currentXP,
        nextLevelXP,
        streak: userStats.streak,
        completedWorkouts: userStats.totalWorkouts,
        weeklyGoal: 4,
        weeklyCompleted: userStats.weeklyWorkouts,
        totalVolume: userStats.totalVolume
      });

      // Load templates from localStorage
      const savedTemplates = JSON.parse(localStorage.getItem(`workout_templates_${user.id}`) || '[]');
      setTemplates(savedTemplates.map((t: any) => ({
        ...t,
        is_template: true
      })));

    } catch (error) {
      console.error('❌ Error loading user data:', error);
      toast.error('Erro ao carregar dados do usuário');
    } finally {
      setLoading(false);
    }
  };

  // Save workout
  const saveWorkout = async (workoutData: Omit<UserWorkoutData, 'id'>) => {
    if (!user) {
      toast.error('Faça login para salvar treinos');
      return false;
    }

    const success = await unifiedDataService.saveWorkout({
      user_id: user.id,
      name: workoutData.name,
      focus: workoutData.focus,
      exercises: workoutData.exercises,
      started_at: new Date().toISOString(),
      completed_at: workoutData.completed_at || new Date().toISOString(),
      duration_minutes: 45 // Default duration
    });

    if (success) {
      await loadUserData(); // Reload data
      return true;
    }
    return false;
  };

  const normalizeWorkoutData = (workout: Partial<UserWorkoutData>): UserWorkoutData => {
    const id = workout.id || `workout_${Date.now()}`;
    const focus = workout.focus || workout.name || 'Treino';
    const name = workout.name || focus || 'Treino';

    const normalizedExercises = (workout.exercises || []).map((exercise, index) => {
      const repsValue =
        exercise.reps ??
        (exercise as any).reps_target ??
        (exercise as any).repsTarget ??
        (exercise as any).repsSuggested ??
        '10';

      const setsValue =
        exercise.sets ??
        (exercise as any).series ??
        (exercise as any).set_count ??
        3;

      const restValue =
        exercise.rest ??
        (exercise as any).rest_s ??
        (exercise as any).restSeconds ??
        (exercise as any).restSeg ??
        90;

      const weightValue =
        typeof exercise.weight === 'number'
          ? exercise.weight
          : typeof (exercise as any).pesoInicial === 'number'
            ? (exercise as any).pesoInicial
            : typeof (exercise as any).weight_suggestion === 'number'
              ? (exercise as any).weight_suggestion
              : 0;

      return {
        name: exercise.name || (exercise as any).nome || `Exercício ${index + 1}`,
        sets: setsValue,
        reps: repsValue,
        weight: weightValue,
        rpe: typeof exercise.rpe === 'number' ? exercise.rpe : 7,
        notes: exercise.notes || (exercise as any).notes || '',
        rest: restValue
      };
    });

    return {
      id,
      name,
      focus,
      exercises: normalizedExercises,
      created_at: workout.created_at,
      completed_at: workout.completed_at,
      is_template: workout.is_template ?? false,
      description: workout.description
    };
  };

  // Save template
  const saveTemplate = async (templateData: Omit<UserWorkoutData, 'id'>) => {
    if (!user) {
      toast.error('Faça login para salvar templates');
      return false;
    }

    const template = {
      ...templateData,
      id: `template_${Date.now()}`,
      created_at: new Date().toISOString(),
      is_template: true
    };

    try {
      const existing = JSON.parse(localStorage.getItem(`workout_templates_${user.id}`) || '[]');
      existing.push(template);
      localStorage.setItem(`workout_templates_${user.id}`, JSON.stringify(existing));
      
      setTemplates(prev => [...prev, template]);
      toast.success(`Template "${templateData.name}" salvo!`);
      return true;
    } catch (error) {
      console.error('❌ Error saving template:', error);
      toast.error('Erro ao salvar template');
      return false;
    }
  };

  // Delete template
  const deleteTemplate = async (templateId: string) => {
    if (!user) return false;

    try {
      const existing = JSON.parse(localStorage.getItem(`workout_templates_${user.id}`) || '[]');
      const filtered = existing.filter((t: any) => t.id !== templateId);
      localStorage.setItem(`workout_templates_${user.id}`, JSON.stringify(filtered));
      
      setTemplates(prev => prev.filter(t => t.id !== templateId));
      toast.success('Template removido');
      return true;
    } catch (error) {
      console.error('❌ Error deleting template:', error);
      toast.error('Erro ao remover template');
      return false;
    }
  };

  // Start workout
  const startWorkout = (workout: Partial<UserWorkoutData>) => {
    const normalizedWorkout = normalizeWorkoutData(workout);
    setActiveWorkout(normalizedWorkout);
    toast.success(`🔥 Iniciando ${normalizedWorkout.name}!`);
    return normalizedWorkout;
  };

  // Complete workout
  const completeWorkout = async (workoutData: UserWorkoutData) => {
    const success = await saveWorkout({
      ...workoutData,
      completed_at: new Date().toISOString()
    });
    
    if (success) {
      setActiveWorkout(null);
      toast.success(`💪 Treino concluído! +${workoutData.exercises.length * 10} XP`);
    }
    
    return success;
  };

  // Get quick workout templates
  const getQuickTemplates = (): UserWorkoutData[] => {
    return [
      {
        id: 'quick-upper',
        name: 'Upper Body Express',
        focus: 'Membros Superiores',
        exercises: [
          { name: 'Supino Reto', sets: 3, reps: '8-10', weight: 60, rest: 90 },
          { name: 'Puxada Alta', sets: 3, reps: '8-10', weight: 50, rest: 90 },
          { name: 'Desenvolvimento', sets: 3, reps: '10-12', weight: 30, rest: 60 },
          { name: 'Rosca Bíceps', sets: 3, reps: '12-15', weight: 15, rest: 45 }
        ],
        is_template: true
      },
      {
        id: 'quick-lower',
        name: 'Lower Body Power',
        focus: 'Membros Inferiores',
        exercises: [
          { name: 'Agachamento', sets: 4, reps: '8-10', weight: 80, rest: 120 },
          { name: 'Leg Press', sets: 3, reps: '12-15', weight: 100, rest: 90 },
          { name: 'Stiff', sets: 3, reps: '10-12', weight: 50, rest: 90 },
          { name: 'Panturrilha', sets: 4, reps: '15-20', weight: 40, rest: 45 }
        ],
        is_template: true
      },
      {
        id: 'quick-full',
        name: 'Full Body Essential',
        focus: 'Corpo Inteiro',
        exercises: [
          { name: 'Supino Reto', sets: 3, reps: '8-10', weight: 60, rest: 90 },
          { name: 'Agachamento', sets: 3, reps: '10-12', weight: 70, rest: 90 },
          { name: 'Puxada Alta', sets: 3, reps: '8-10', weight: 50, rest: 90 },
          { name: 'Desenvolvimento', sets: 3, reps: '10-12', weight: 30, rest: 60 }
        ],
        is_template: true
      }
    ];
  };

  // Get today's suggested workout
  const getTodayWorkout = (): UserWorkoutData | null => {
    const templates = getQuickTemplates();
    const today = new Date().getDay(); // 0 = Sunday, 1 = Monday, etc.
    
    // Simple logic to suggest different workouts based on day
    if (today === 1 || today === 4) return templates[0]; // Upper body Mon/Thu
    if (today === 2 || today === 5) return templates[1]; // Lower body Tue/Fri  
    if (today === 3 || today === 6) return templates[2]; // Full body Wed/Sat
    
    return templates[0]; // Default to upper body
  };

  // Load data when user changes
  useEffect(() => {
    loadUserData();
  }, [user?.id]);

  // Add workout (for testing)
  const addWorkout = async (workoutData: any) => {
    if (!user) {
      // Save to localStorage for testing
      const savedWorkouts = JSON.parse(localStorage.getItem('user_workouts') || '[]');
      savedWorkouts.push(workoutData);
      localStorage.setItem('user_workouts', JSON.stringify(savedWorkouts));
      setWorkouts(prev => [...prev, workoutData]);
      return true;
    }

    return await saveWorkout(workoutData);
  };

  // Delete workout (for testing)
  const deleteWorkout = async (workoutId: string) => {
    if (!user) {
      // Remove from localStorage for testing
      const savedWorkouts = JSON.parse(localStorage.getItem('user_workouts') || '[]');
      const filtered = savedWorkouts.filter((w: any) => w.id !== workoutId);
      localStorage.setItem('user_workouts', JSON.stringify(filtered));
      setWorkouts(prev => prev.filter(w => w.id !== workoutId));
      return true;
    }

    return await deleteTemplate(workoutId);
  };

  return {
    // Data
    workouts,
    stats,
    templates,
    activeWorkout,
    loading,
    
    // Actions
    saveWorkout,
    saveTemplate,
    deleteTemplate,
    startWorkout,
    completeWorkout,
    loadUserData,
    addWorkout,
    deleteWorkout,
    
    // Helpers
    getQuickTemplates,
    getTodayWorkout,
    
    // State setters
    setActiveWorkout
  };
}