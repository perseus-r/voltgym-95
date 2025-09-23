import { useState, useEffect } from 'react';
import { unifiedDataService, WorkoutSessionData, UserStats } from '@/services/UnifiedDataService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

// Use unified types from service

export function useWorkoutPersistence() {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);

  // Save workout using unified service
  const saveWorkoutSession = async (workoutData: any): Promise<string | null> => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return null;
    }

    setSaving(true);
    try {
      // Convert old format to new format
      const unifiedWorkoutData: WorkoutSessionData = {
        user_id: user.id,
        name: workoutData.name || workoutData.focus,
        focus: workoutData.focus,
        duration_minutes: workoutData.duration_minutes || 45,
        started_at: new Date().toISOString(),
        completed_at: workoutData.completed_at || new Date().toISOString(),
        exercises: workoutData.exercises?.map((ex: any) => ({
          name: ex.name,
          sets: ex.sets?.length || 3,
          reps: ex.sets?.[0]?.reps || 10,
          weight: ex.sets?.[0]?.weight || 0,
          rpe: ex.sets?.[0]?.rpe || null,
          notes: ex.notes || ''
        })) || []
      };

      const success = await unifiedDataService.saveWorkout(unifiedWorkoutData);
      return success ? 'success' : null;
    } catch (error) {
      console.error('Error in saveWorkoutSession:', error);
      toast.error('Erro ao salvar treino');
      return null;
    } finally {
      setSaving(false);
    }
  };

  // Get workout history using unified service
  const getWorkoutHistory = async () => {
    if (!user) return [];

    setLoading(true);
    try {
      const history = await unifiedDataService.getWorkoutHistory(50);
      return history;
    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Get weekly progress using unified service  
  const getWeeklyProgress = async () => {
    if (!user) return { workouts: 0, totalVolume: 0, averageRpe: 0 };

    try {
      const stats = await unifiedDataService.getUserStats();
      
      return { 
        workouts: stats.weeklyWorkouts, 
        totalVolume: stats.totalVolume, 
        averageRpe: 7.5 // Default RPE for now
      };
    } catch (error) {
      console.error('Erro ao calcular progresso semanal:', error);
      return { workouts: 0, totalVolume: 0, averageRpe: 0 };
    }
  };

  return {
    saveWorkoutSession,
    getWorkoutHistory,
    getWeeklyProgress,
    saving,
    loading
  };
}