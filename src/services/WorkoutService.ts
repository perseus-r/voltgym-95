import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { saveWorkoutHistory, HistoryEntry, getWorkoutHistory } from "@/lib/storage";

// Types for our workout system
export interface WorkoutSession {
  id?: string;
  user_id: string;
  name: string;
  focus: string;
  started_at?: string;
  completed_at?: string | null;
  duration_minutes?: number;
  total_volume?: number;
  notes?: string;
  xp_earned?: number;
}

export interface ExerciseLog {
  id?: string;
  session_id: string;
  exercise_id: string;
  order_index: number;
  completed?: boolean;
  notes?: string;
}

export interface SetLog {
  id?: string;
  exercise_log_id: string;
  set_number: number;
  reps?: number;
  weight?: number;
  rpe?: number;
  rest_seconds?: number;
  completed?: boolean;
  notes?: string;
}

export class WorkoutService {
  // Create a new workout session and save to both Supabase and localStorage
  static async createWorkoutSession(sessionData: Omit<WorkoutSession, 'id'>): Promise<WorkoutSession | null> {
    try {
      // Try Supabase first
      const { data, error } = await supabase
        .from('workout_sessions')
        .insert([sessionData])
        .select()
        .single();

      if (error) {
        console.warn('Supabase unavailable, saving locally:', error);
        // Save locally as fallback
        const localSession: WorkoutSession = {
          ...sessionData,
          id: `local_${Date.now()}`,
          started_at: sessionData.started_at || new Date().toISOString()
        };
        
        // Save to localStorage for offline support
        const existingSessions = JSON.parse(localStorage.getItem('bora_workout_sessions') || '[]');
        existingSessions.push(localSession);
        localStorage.setItem('bora_workout_sessions', JSON.stringify(existingSessions));
        
        return localSession;
      }

      return data;
    } catch (error) {
      console.error('Error creating workout session:', error);
      toast.error('Erro ao criar sessão de treino');
      return null;
    }
  }

  // Complete a workout session with better offline support
  static async completeWorkoutSession(sessionId: string, xpEarned: number = 30): Promise<boolean> {
    try {
      // Calculate total volume
      const totalVolume = await this.calculateSessionVolume(sessionId);
      
      const { error } = await supabase
        .from('workout_sessions')
        .update({
          completed_at: new Date().toISOString(),
          xp_earned: xpEarned,
          total_volume: totalVolume
        })
        .eq('id', sessionId);

      if (error) {
        console.warn('Supabase unavailable, completing locally:', error);
        // Update local session
        const existingSessions = JSON.parse(localStorage.getItem('bora_workout_sessions') || '[]');
        const updatedSessions = existingSessions.map((session: WorkoutSession) => 
          session.id === sessionId 
            ? { ...session, completed_at: new Date().toISOString(), xp_earned: xpEarned, total_volume: totalVolume }
            : session
        );
        localStorage.setItem('bora_workout_sessions', JSON.stringify(updatedSessions));
      }
      
      // Update user XP and total workouts
      await this.updateUserProgress(xpEarned);
      
      return true;
    } catch (error) {
      console.error('Error completing workout session:', error);
      toast.error('Erro ao finalizar treino');
      return false;
    }
  }

  // Calculate total volume for a session
  static async calculateSessionVolume(sessionId: string): Promise<number> {
    try {
      const { data, error } = await supabase
        .rpc('calculate_session_volume', { session_id_param: sessionId });

      if (error) {
        // Calculate from localStorage if Supabase fails
        const localLogs = JSON.parse(localStorage.getItem('bora_exercise_logs') || '[]');
        const sessionLogs = localLogs.filter((log: any) => log.session_id === sessionId);
        let totalVolume = 0;
        
        sessionLogs.forEach((log: any) => {
          const setLogs = JSON.parse(localStorage.getItem('bora_set_logs') || '[]');
          const exerciseSets = setLogs.filter((set: any) => set.exercise_log_id === log.id);
          exerciseSets.forEach((set: any) => {
            if (set.weight && set.reps && set.completed) {
              totalVolume += set.weight * set.reps;
            }
          });
        });
        
        return totalVolume;
      }
      
      return data || 0;
    } catch (error) {
      console.error('Error calculating session volume:', error);
      return 0;
    }
  }

  // Enhanced workout history that combines Supabase and localStorage data
  static async getUserWorkoutHistory(limit: number = 10) {
    try {
      let supabaseData = [];
      
      // Try to get from Supabase first
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select(`
            *,
            exercise_logs (
              *,
              exercises (name),
              set_logs (*)
            )
          `)
          .order('started_at', { ascending: false })
          .limit(limit);

        if (!error) {
          supabaseData = data || [];
        }
      } catch (supabaseError) {
        console.warn('Supabase unavailable, using local data');
      }

      // Get localStorage data as fallback/supplement
      const { data: currentUser } = await supabase.auth.getUser();
      const userId = currentUser?.user?.id || 'demo';
      const localHistory = getWorkoutHistory(userId);
      
      // Combine and format data
      const combinedHistory = [
        ...supabaseData,
        ...localHistory.map(entry => ({
          id: `local_${entry.ts}`,
          name: entry.focus,
          focus: entry.focus,
          started_at: entry.ts,
          completed_at: entry.ts,
          user_id: entry.user,
          exercise_logs: entry.items.map((item, index) => ({
            id: `local_ex_${entry.ts}_${index}`,
            exercise_id: item.name,
            exercises: { name: item.name },
            set_logs: [{
              id: `local_set_${entry.ts}_${index}`,
              set_number: 1,
              reps: 10,
              weight: item.carga,
              rpe: item.rpe,
              completed: true,
              created_at: entry.ts
            }]
          }))
        }))
      ];

      // Sort by date and limit
      return combinedHistory
        .sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
        .slice(0, limit);
        
    } catch (error) {
      console.error('Error fetching workout history:', error);
      return [];
    }
  }

  // Enhanced save workout that works offline
  static async saveWorkout(workoutData: {
    name: string;
    focus: string;
    exercises: Array<{
      name: string;
      weight: number;
      reps: number;
      rpe: number;
      notes?: string;
    }>;
  }) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      const userId = currentUser?.user?.id || 'demo';

      console.log('🔄 Salvando treino:', workoutData.name, 'para usuário:', userId);

      // SEMPRE salvar no localStorage primeiro para garantir persistência
      const historyEntry: HistoryEntry = {
        ts: new Date().toISOString(),
        user: userId,
        focus: workoutData.focus,
        items: workoutData.exercises.map(ex => ({
          name: ex.name,
          carga: ex.weight,
          rpe: ex.rpe,
          nota: ex.notes || ''
        }))
      };

      saveWorkoutHistory(historyEntry);
      
      // Salvar também na estrutura de treinos customizados
      const customWorkout = {
        id: `saved_workout_${Date.now()}`,
        name: workoutData.name,
        focus: workoutData.focus,
        exercises: workoutData.exercises,
        created_at: new Date().toISOString(),
        user_id: userId,
        completed: true
      };
      
      const existingWorkouts = JSON.parse(localStorage.getItem('bora_custom_workouts') || '[]');
      existingWorkouts.push(customWorkout);
      localStorage.setItem('bora_custom_workouts', JSON.stringify(existingWorkouts));
      
      console.log('✅ Treino salvo no localStorage:', customWorkout.id);

      // Tentar criar session no Supabase (opcional, não bloqueia)
      try {
        const session = await this.createWorkoutSession({
          user_id: userId,
          name: workoutData.name,
          focus: workoutData.focus,
          started_at: new Date().toISOString()
        });

        if (session) {
          console.log('✅ Session criada no Supabase:', session.id);
        }

        // Tentar salvar exercise logs no Supabase (opcional)
        try {
          for (let i = 0; i < workoutData.exercises.length; i++) {
            const exercise = workoutData.exercises[i];
            
            const exerciseLog = await this.logExercise({
              session_id: session.id!,
              exercise_id: exercise.name,
              order_index: i
            });

            if (exerciseLog) {
              await this.logSet({
                exercise_log_id: exerciseLog.id!,
                set_number: 1,
                reps: exercise.reps,
                weight: exercise.weight,
                rpe: exercise.rpe,
                completed: true,
                notes: exercise.notes
              });
            }
          }
          
          // Complete the session
          await this.completeWorkoutSession(session.id!, 30);
          console.log('✅ Exercícios salvos no Supabase');
        } catch (logError) {
          console.warn('Supabase indisponível, dados salvos localmente:', logError);
        }
      } catch (supabaseError) {
        console.warn('Supabase indisponível, dados salvos localmente:', supabaseError);
      }

      toast.success('💪 Treino salvo com sucesso!');
      return true;
    } catch (error) {
      console.error('Error saving workout:', error);
      toast.error('Erro ao salvar treino');
      return false;
    }
  }

  // Log an exercise in a workout session
  static async logExercise(exerciseData: Omit<ExerciseLog, 'id'>): Promise<ExerciseLog | null> {
    try {
      const { data, error } = await supabase
        .from('exercise_logs')
        .insert([exerciseData])
        .select()
        .single();

      if (error) {
        // Save locally if Supabase fails
        const localLog: ExerciseLog = {
          ...exerciseData,
          id: `local_ex_${Date.now()}`
        };
        
        const existingLogs = JSON.parse(localStorage.getItem('bora_exercise_logs') || '[]');
        existingLogs.push(localLog);
        localStorage.setItem('bora_exercise_logs', JSON.stringify(existingLogs));
        
        return localLog;
      }

      return data;
    } catch (error) {
      console.error('Error logging exercise:', error);
      return null;
    }
  }

  // Log a set for an exercise
  static async logSet(setData: Omit<SetLog, 'id'>): Promise<SetLog | null> {
    try {
      const { data, error } = await supabase
        .from('set_logs')
        .insert([setData])
        .select()
        .single();

      if (error) {
        // Save locally if Supabase fails
        const localSet: SetLog = {
          ...setData,
          id: `local_set_${Date.now()}`
        };
        
        const existingSets = JSON.parse(localStorage.getItem('bora_set_logs') || '[]');
        existingSets.push(localSet);
        localStorage.setItem('bora_set_logs', JSON.stringify(existingSets));
        
        return localSet;
      }

      return data;
    } catch (error) {
      console.error('Error logging set:', error);
      return null;
    }
  }

  // Update set data
  static async updateSet(setId: string, setData: Partial<SetLog>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('set_logs')
        .update(setData)
        .eq('id', setId);

      if (error) {
        // Update locally if Supabase fails
        const existingSets = JSON.parse(localStorage.getItem('bora_set_logs') || '[]');
        const updatedSets = existingSets.map((set: SetLog) => 
          set.id === setId ? { ...set, ...setData } : set
        );
        localStorage.setItem('bora_set_logs', JSON.stringify(updatedSets));
      }

      return true;
    } catch (error) {
      console.error('Error updating set:', error);
      return false;
    }
  }

  // Get exercise progress
  static async getExerciseProgress(exerciseId: string, limit: number = 10) {
    try {
      const { data, error } = await supabase
        .from('set_logs')
        .select(`
          *,
          exercise_logs!inner(
            *,
            workout_sessions!inner(started_at, user_id)
          )
        `)
        .eq('exercise_logs.exercise_id', exerciseId)
        .order('exercise_logs.workout_sessions.started_at', { ascending: false })
        .limit(limit);

      if (error) {
        // Get from localStorage if Supabase fails
        const localHistory = getWorkoutHistory('');
        const exerciseData = [];
        
        localHistory.forEach(entry => {
          entry.items.forEach(item => {
            if (item.name === exerciseId) {
              exerciseData.push({
                weight: item.carga,
                rpe: item.rpe,
                created_at: entry.ts
              });
            }
          });
        });
        
        return exerciseData.slice(0, limit);
      }

      return data || [];
    } catch (error) {
      console.error('Error fetching exercise progress:', error);
      return [];
    }
  }

  // Update user progress (XP, total workouts, etc.)
  static async updateUserProgress(xpGained: number) {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return;

      // Get current profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.user.id)
        .maybeSingle();

      if (fetchError) {
        console.warn('Could not fetch profile from Supabase');
        // Update local progress
        const localProgress = JSON.parse(localStorage.getItem('bora_user_progress') || '{}');
        localProgress.current_xp = (localProgress.current_xp || 0) + xpGained;
        localProgress.total_workouts = (localProgress.total_workouts || 0) + 1;
        localStorage.setItem('bora_user_progress', JSON.stringify(localProgress));
        return;
      }

      if (profile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            current_xp: (profile.current_xp || 0) + xpGained,
            total_workouts: (profile.total_workouts || 0) + 1,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', currentUser.user.id);

        if (updateError) throw updateError;
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([{
            user_id: currentUser.user.id,
            current_xp: xpGained,
            total_workouts: 1
          }]);

        if (insertError) throw insertError;
      }
    } catch (error) {
      console.error('Error updating user progress:', error);
    }
  }

  // Get user profile
  static async getUserProfile() {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) return null;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', currentUser.user.id)
        .maybeSingle();

      if (error) {
        // Return local profile if Supabase fails
        const localProgress = JSON.parse(localStorage.getItem('bora_user_progress') || '{}');
        return {
          user_id: currentUser.user.id,
          current_xp: localProgress.current_xp || 0,
          total_workouts: localProgress.total_workouts || 0,
          ...localProgress
        };
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }

  // Get all exercises
  static async getExercises() {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          exercise_categories (
            name,
            icon
          )
        `)
        .order('name');

      if (error) {
        // Return seed data if Supabase fails
        console.warn('Using fallback exercise data');
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching exercises:', error);
      return [];
    }
  }

  // Get workout templates
  static async getWorkoutTemplates() {
    try {
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

      if (error) {
        // Return default templates if Supabase fails
        console.warn('Using fallback template data');
        return [];
      }
      
      return data || [];
    } catch (error) {
      console.error('Error fetching workout templates:', error);
      return [];
    }
  }

  // Create workout session from template
  static async createSessionFromTemplate(templateId: string): Promise<{ session: WorkoutSession | null; exerciseLogs: ExerciseLog[] }> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      if (!currentUser.user) {
        toast.error('Usuário não autenticado');
        return { session: null, exerciseLogs: [] };
      }

      // Get template with exercises
      const { data: template, error: templateError } = await supabase
        .from('workout_templates')
        .select(`
          *,
          template_exercises (
            *,
            exercises (name)
          )
        `)
        .eq('id', templateId)
        .single();

      if (templateError) throw templateError;

      // Create workout session
      const session = await this.createWorkoutSession({
        user_id: currentUser.user.id,
        name: template.name,
        focus: template.focus,
        started_at: new Date().toISOString()
      });

      if (!session) return { session: null, exerciseLogs: [] };

      // Create exercise logs
      const exerciseLogs: ExerciseLog[] = [];
      for (const templateExercise of template.template_exercises) {
        const exerciseLog = await this.logExercise({
          session_id: session.id!,
          exercise_id: templateExercise.exercise_id,
          order_index: templateExercise.order_index
        });
        
        if (exerciseLog) {
          exerciseLogs.push(exerciseLog);
        }
      }

      return { session, exerciseLogs };
    } catch (error) {
      console.error('Error creating session from template:', error);
      toast.error('Erro ao criar treino do template');
      return { session: null, exerciseLogs: [] };
    }
  }
}