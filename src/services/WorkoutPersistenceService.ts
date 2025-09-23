import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { saveWorkoutHistory, HistoryEntry, getWorkoutHistory } from "@/lib/storage";

export interface SavedWorkout {
  id: string;
  name: string;
  focus: string;
  exercises: Array<{
    name: string;
    weight: number;
    reps: number | string;
    rpe: number;
    notes?: string;
    sets?: number;
    rest?: number;
  }>;
  created_at: string;
  user_id: string;
  completed?: boolean;
}

export class WorkoutPersistenceService {
  /**
   * Salva um treino com redundância total (localStorage + Supabase)
   */
  static async saveWorkout(workoutData: {
    name: string;
    focus: string;
    exercises: Array<{
      name: string;
      weight: number;
      reps: number | string;
      rpe?: number;
      notes?: string;
      sets?: number;
      rest?: number;
    }>;
  }): Promise<boolean> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      const userId = currentUser?.user?.id || 'demo';
      const timestamp = new Date().toISOString();

      console.log('🔄 Salvando treino:', workoutData.name);

      // 1. SEMPRE salvar no localStorage primeiro (garantia de persistência)
      const savedWorkout: SavedWorkout = {
        id: `workout_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: workoutData.name,
        focus: workoutData.focus,
        exercises: workoutData.exercises.map(ex => ({
          ...ex,
          rpe: ex.rpe || 7,
          sets: ex.sets || 3,
          rest: ex.rest || 90
        })),
        created_at: timestamp,
        user_id: userId,
        completed: true
      };

      // Salvar na lista de treinos customizados
      const existingWorkouts = this.getLocalWorkouts(userId);
      existingWorkouts.push(savedWorkout);
      localStorage.setItem(`bora_workouts_${userId}`, JSON.stringify(existingWorkouts));

      // Salvar no histórico também
      const historyEntry: HistoryEntry = {
        ts: timestamp,
        user: userId,
        focus: workoutData.focus,
        items: workoutData.exercises.map(ex => ({
          name: ex.name,
          carga: ex.weight,
          rpe: ex.rpe || 7,
          nota: ex.notes || ''
        }))
      };
      
      saveWorkoutHistory(historyEntry);

      console.log('✅ Treino salvo localmente:', savedWorkout.id);

      // 2. Tentar salvar no Supabase (não bloqueia se falhar)
      try {
        await this.saveToSupabase(savedWorkout);
        console.log('✅ Treino sincronizado com Supabase');
      } catch (supabaseError) {
        console.warn('Supabase indisponível, treino mantido localmente:', supabaseError);
      }

      toast.success(`💪 Treino "${workoutData.name}" salvo com sucesso!`);
      return true;

    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      toast.error('Erro ao salvar treino');
      return false;
    }
  }

  /**
   * Recupera todos os treinos salvos (localStorage + Supabase)
   */
  static async getWorkouts(userId?: string): Promise<SavedWorkout[]> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      const currentUserId = userId || currentUser?.user?.id || 'demo';

      console.log('📋 Carregando treinos para usuário:', currentUserId);

      // 1. Sempre carregar do localStorage primeiro
      const localWorkouts = this.getLocalWorkouts(currentUserId);
      console.log('📂 Treinos locais encontrados:', localWorkouts.length);

      // 2. Tentar carregar do Supabase e mesclar
      let supabaseWorkouts: SavedWorkout[] = [];
      try {
        const { data, error } = await supabase
          .from('workout_sessions')
          .select('*')
          .eq('user_id', currentUserId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          supabaseWorkouts = data.map(session => ({
            id: session.id,
            name: session.name,
            focus: session.focus || 'Treino',
            exercises: [], // Seria necessário carregar exercise_logs separadamente
            created_at: session.created_at,
            user_id: session.user_id,
            completed: !!session.completed_at
          }));
          console.log('☁️ Treinos do Supabase:', supabaseWorkouts.length);
        }
      } catch (supabaseError) {
        console.warn('Supabase indisponível, usando apenas dados locais');
      }

      // 3. Mesclar e deduplificar
      const allWorkouts = [...localWorkouts, ...supabaseWorkouts];
      const uniqueWorkouts = allWorkouts.filter((workout, index, arr) => 
        arr.findIndex(w => w.name === workout.name && w.created_at === workout.created_at) === index
      );

      return uniqueWorkouts.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
      return [];
    }
  }

  /**
   * Remove um treino
   */
  static async deleteWorkout(workoutId: string, userId?: string): Promise<boolean> {
    try {
      const { data: currentUser } = await supabase.auth.getUser();
      const currentUserId = userId || currentUser?.user?.id || 'demo';

      // Remover do localStorage
      const localWorkouts = this.getLocalWorkouts(currentUserId);
      const updatedWorkouts = localWorkouts.filter(w => w.id !== workoutId);
      localStorage.setItem(`bora_workouts_${currentUserId}`, JSON.stringify(updatedWorkouts));

      // Tentar remover do Supabase
      try {
        await supabase
          .from('workout_sessions')
          .delete()
          .eq('id', workoutId)
          .eq('user_id', currentUserId);
      } catch (supabaseError) {
        console.warn('Erro ao remover do Supabase, removido localmente');
      }

      toast.success('🗑️ Treino removido!');
      return true;
    } catch (error) {
      console.error('Erro ao remover treino:', error);
      toast.error('Erro ao remover treino');
      return false;
    }
  }

  // --- Métodos privados ---

  private static getLocalWorkouts(userId: string): SavedWorkout[] {
    try {
      const stored = localStorage.getItem(`bora_workouts_${userId}`);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Erro ao carregar treinos locais:', error);
      return [];
    }
  }

  private static async saveToSupabase(workout: SavedWorkout): Promise<void> {
    // Criar sessão
    const { data: session, error: sessionError } = await supabase
      .from('workout_sessions')
      .insert([{
        id: workout.id,
        user_id: workout.user_id,
        name: workout.name,
        focus: workout.focus,
        started_at: workout.created_at,
        completed_at: workout.completed ? workout.created_at : null,
        xp_earned: 30,
        total_volume: workout.exercises.reduce((sum, ex) => sum + (ex.weight * (typeof ex.reps === 'number' ? ex.reps : 10)), 0)
      }])
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Criar logs de exercícios
    for (let i = 0; i < workout.exercises.length; i++) {
      const exercise = workout.exercises[i];
      
      const { data: exerciseLog, error: exError } = await supabase
        .from('exercise_logs')
        .insert([{
          session_id: session.id,
          exercise_id: exercise.name,
          order_index: i,
          completed: true,
          notes: exercise.notes
        }])
        .select()
        .single();

      if (!exError && exerciseLog) {
        // Criar sets
        const sets = exercise.sets || 3;
        for (let setNum = 1; setNum <= sets; setNum++) {
          await supabase
            .from('set_logs')
            .insert([{
              exercise_log_id: exerciseLog.id,
              set_number: setNum,
              reps: typeof exercise.reps === 'number' ? exercise.reps : 10,
              weight: exercise.weight,
              rpe: exercise.rpe || 7,
              rest_seconds: exercise.rest || 90,
              completed: true
            }]);
        }
      }
    }
  }
}

export default WorkoutPersistenceService;