// Unified Data Service - Handles all data persistence with Supabase + localStorage fallback
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Types
export interface WorkoutSessionData {
  id?: string;
  user_id: string;
  name: string;
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string | number;
    weight?: number;
    rpe?: number;
    notes?: string;
  }>;
  started_at?: string;
  completed_at?: string;
  duration_minutes?: number;
  total_volume?: number;
  xp_earned?: number;
}

export interface UserStats {
  totalWorkouts: number;
  totalVolume: number;
  currentXP: number;
  weeklyWorkouts: number;
  streak: number;
}

class UnifiedDataService {
  private readonly STORAGE_PREFIX = 'bora_v2_';
  
  // Save workout with full persistence
  async saveWorkout(workoutData: WorkoutSessionData): Promise<boolean> {
    try {
      console.log('💾 Saving workout...', workoutData.name);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('User not authenticated');
      }

      workoutData.user_id = user.id;
      workoutData.completed_at = workoutData.completed_at || new Date().toISOString();
      workoutData.xp_earned = workoutData.xp_earned || this.calculateXP(workoutData);
      workoutData.total_volume = workoutData.total_volume || this.calculateVolume(workoutData);

      // Try Supabase first
      let sessionId = null;
      try {
        const { data: session, error } = await supabase
          .from('workout_sessions')
          .insert({
            user_id: workoutData.user_id,
            name: workoutData.name,
            focus: workoutData.focus,
            started_at: workoutData.started_at,
            completed_at: workoutData.completed_at,
            duration_minutes: workoutData.duration_minutes,
            total_volume: workoutData.total_volume,
            notes: `${workoutData.exercises.length} exercícios completados`,
            xp_earned: workoutData.xp_earned
          })
          .select('id')
          .single();

        if (error) throw error;
        
        sessionId = session.id;
        console.log('✅ Session saved to Supabase:', sessionId);

        // Save exercise logs
        for (let i = 0; i < workoutData.exercises.length; i++) {
          const exercise = workoutData.exercises[i];
          
          const { data: exerciseLog, error: logError } = await supabase
            .from('exercise_logs')
            .insert({
              session_id: sessionId,
              order_index: i,
              completed: true,
              notes: this.formatExerciseNote(exercise)
            })
            .select('id')
            .single();

          if (logError) throw logError;

          // Save set logs
          const setLogs = Array.from({ length: exercise.sets }, (_, setIndex) => ({
            exercise_log_id: exerciseLog.id,
            set_number: setIndex + 1,
            reps: typeof exercise.reps === 'string' ? parseInt(exercise.reps) : exercise.reps,
            weight: exercise.weight || 0,
            rpe: exercise.rpe || null,
            notes: exercise.notes || '',
            completed: true,
            rest_seconds: 90
          }));

          const { error: setError } = await supabase
            .from('set_logs')
            .insert(setLogs);

          if (setError) throw setError;
        }

        // Update user profile
        await this.updateUserProgress(user.id, workoutData.xp_earned);
        
        console.log('✅ Complete workout saved to database');
      } catch (supabaseError) {
        console.warn('⚠️ Supabase save failed, using localStorage:', supabaseError);
        sessionId = `local_${Date.now()}`;
      }

      // Always save to localStorage for offline access
      await this.saveToLocalStorage(workoutData, sessionId);
      
      // Show success message
      toast.success(`💪 Treino \"${workoutData.name}\" salvo! +${workoutData.xp_earned} XP`);
      
      return true;
    } catch (error) {
      console.error('❌ Error saving workout:', error);
      toast.error('Erro ao salvar treino');
      return false;
    }
  }

  // Get workout history with combined data
  async getWorkoutHistory(limit = 20): Promise<WorkoutSessionData[]> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return this.getLocalHistory(limit);

      // Try Supabase first
      let supabaseData: WorkoutSessionData[] = [];
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select(`
            *,
            exercise_logs (
              *,
              set_logs (*)
            )
          `)
          .eq('user_id', user.id)
          .order('completed_at', { ascending: false })
          .limit(limit);

        if (!error && data) {
          supabaseData = data.map(session => ({
            id: session.id,
            user_id: session.user_id,
            name: session.name || session.focus,
            focus: session.focus,
            started_at: session.started_at,
            completed_at: session.completed_at,
            duration_minutes: session.duration_minutes,
            total_volume: session.total_volume,
            xp_earned: session.xp_earned,
            exercises: this.parseExercisesFromLogs(session.exercise_logs)
          }));
        }
      } catch (supabaseError) {
        console.warn('⚠️ Supabase fetch failed, using localStorage');
      }

      // Get local data as supplement
      const localData = this.getLocalHistory(limit);
      
      // Combine and deduplicate
      const combined = [...supabaseData, ...localData];
      const unique = combined.filter((item, index, arr) => 
        arr.findIndex(t => t.completed_at === item.completed_at) === index
      );
      
      return unique
        .sort((a, b) => new Date(b.completed_at!).getTime() - new Date(a.completed_at!).getTime())
        .slice(0, limit);
        
    } catch (error) {
      console.error('❌ Error fetching history:', error);
      return this.getLocalHistory(limit);
    }
  }

  // Get user statistics
  async getUserStats(): Promise<UserStats> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return this.getLocalStats();

      // Try getting from Supabase profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_xp, total_workouts, streak_days')
        .eq('user_id', user.id)
        .single();

      // Get weekly workouts
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      weekStart.setHours(0, 0, 0, 0);

      const { data: weeklyData } = await supabase
        .from('workout_sessions')
        .select('total_volume')
        .eq('user_id', user.id)
        .gte('completed_at', weekStart.toISOString());

      const weeklyWorkouts = weeklyData?.length || 0;
      const weeklyVolume = weeklyData?.reduce((sum, w) => sum + (w.total_volume || 0), 0) || 0;

      return {
        totalWorkouts: profile?.total_workouts || 0,
        totalVolume: weeklyVolume,
        currentXP: profile?.current_xp || 0,
        weeklyWorkouts,
        streak: profile?.streak_days || 0
      };
    } catch (error) {
      console.error('❌ Error fetching stats:', error);
      return this.getLocalStats();
    }
  }

  // Private helper methods
  private calculateXP(workout: WorkoutSessionData): number {
    return workout.exercises.length * 10 + (workout.duration_minutes || 0);
  }

  private calculateVolume(workout: WorkoutSessionData): number {
    return workout.exercises.reduce((total, exercise) => {
      if (exercise.weight && typeof exercise.reps === 'number') {
        return total + (exercise.weight * exercise.reps * exercise.sets);
      }
      return total;
    }, 0);
  }

  private formatExerciseNote(exercise: any): string {
    return `${exercise.name} - ${exercise.sets}x${exercise.reps}${exercise.weight ? ` @${exercise.weight}kg` : ''}${exercise.rpe ? ` RPE:${exercise.rpe}` : ''}${exercise.notes ? ` | ${exercise.notes}` : ''}`;
  }

  private async saveToLocalStorage(workout: WorkoutSessionData, sessionId: string | null) {
    const key = `${this.STORAGE_PREFIX}workouts`;
    const existing = JSON.parse(localStorage.getItem(key) || '[]');
    
    const workoutWithId = { ...workout, id: sessionId };
    existing.unshift(workoutWithId);
    
    // Keep only last 100 workouts
    const limited = existing.slice(0, 100);
    localStorage.setItem(key, JSON.stringify(limited));
    
    console.log('✅ Workout saved to localStorage');
  }

  private getLocalHistory(limit: number): WorkoutSessionData[] {
    const key = `${this.STORAGE_PREFIX}workouts`;
    const data = JSON.parse(localStorage.getItem(key) || '[]');
    return data.slice(0, limit);
  }

  private getLocalStats(): UserStats {
    const workouts = this.getLocalHistory(100);
    const totalVolume = workouts.reduce((sum, w) => sum + (w.total_volume || 0), 0);
    
    // Calculate weekly workouts
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weeklyWorkouts = workouts.filter(w => 
      new Date(w.completed_at!) >= weekStart
    ).length;

    return {
      totalWorkouts: workouts.length,
      totalVolume,
      currentXP: workouts.reduce((sum, w) => sum + (w.xp_earned || 0), 0),
      weeklyWorkouts,
      streak: 0 // TODO: Calculate streak from dates
    };
  }

  private parseExercisesFromLogs(logs: any[]): any[] {
    return logs.map(log => {
      // Parse exercise info from notes
      const noteMatch = log.notes?.match(/^([^-]+)\s*-\s*(\d+)x([\d-]+)(?:\s*@(\d+(?:\.\d+)?)kg)?(?:\s*RPE:(\d+))?/);
      if (noteMatch) {
        const [, name, sets, reps, weight, rpe] = noteMatch;
        return {
          name: name.trim(),
          sets: parseInt(sets),
          reps: reps,
          weight: weight ? parseFloat(weight) : undefined,
          rpe: rpe ? parseInt(rpe) : undefined
        };
      }
      return {
        name: 'Exercício',
        sets: 1,
        reps: '1'
      };
    });
  }

  private async updateUserProgress(userId: string, xpGained: number) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('current_xp, total_workouts')
        .eq('user_id', userId)
        .single();

      await supabase
        .from('profiles')
        .update({
          current_xp: (profile?.current_xp || 0) + xpGained,
          total_workouts: (profile?.total_workouts || 0) + 1,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      console.log('✅ User progress updated');
    } catch (error) {
      console.warn('⚠️ Could not update user progress:', error);
    }
  }

  // Test connectivity
  async testConnection(): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);

      if (error) throw error;
      
      console.log('✅ Database connection OK');
      return true;
    } catch (error) {
      console.warn('❌ Database connection failed:', error);
      return false;
    }
  }
}

export const unifiedDataService = new UnifiedDataService();
