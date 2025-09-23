import { supabase } from '@/integrations/supabase/client';
import { HistoryEntry, saveWorkoutHistory } from '@/lib/storage';

export interface WorkoutSessionData {
  user_id: string;
  name: string;
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    weight?: number;
    rpe?: number;
    notes?: string;
  }>;
  completed_at?: string;
  duration_minutes?: number;
  total_volume?: number;
}

export interface ExerciseLogData {
  session_id: string;
  exercise_id?: string;
  order_index: number;
  notes?: string;
  completed?: boolean;
}

class DatabaseService {
  async saveWorkoutSession(sessionData: WorkoutSessionData) {
    try {
      // Salvar sessão principal no formato correto
      const { data: session, error: sessionError } = await supabase
        .from('workout_sessions')
        .insert({
          user_id: sessionData.user_id,
          name: sessionData.name || `Treino ${sessionData.focus}`,
          focus: sessionData.focus,
          completed_at: sessionData.completed_at || new Date().toISOString(),
          duration_minutes: sessionData.duration_minutes,
          total_volume: sessionData.total_volume
        })
        .select()
        .single();

      if (sessionError) throw sessionError;

      // Salvar logs de exercícios no formato correto
      for (let index = 0; index < sessionData.exercises.length; index++) {
        const exercise = sessionData.exercises[index];
        
        await supabase
          .from('exercise_logs')
          .insert({
            session_id: session.id,
            order_index: index,
            completed: true,
            notes: `${exercise.name} - ${exercise.sets}x${exercise.reps}${exercise.weight ? ` @${exercise.weight}kg` : ''}${exercise.rpe ? ` RPE:${exercise.rpe}` : ''}${exercise.notes ? ` | ${exercise.notes}` : ''}`
          });
      }

      // Manter compatibilidade com storage local
      const historyEntry: HistoryEntry = {
        ts: sessionData.completed_at || new Date().toISOString(),
        user: sessionData.user_id,
        focus: sessionData.focus,
        items: sessionData.exercises.map(ex => ({
          name: ex.name,
          carga: ex.weight || 0,
          rpe: ex.rpe || 0,
          nota: ex.notes || ''
        }))
      };
      
      saveWorkoutHistory(historyEntry);

      console.log('✅ Sessão salva no banco e localStorage');
      return session;
    } catch (error) {
      console.error('❌ Erro ao salvar sessão:', error);
      throw error;
    }
  }

  async getUserWorkoutStats(userId: string) {
    try {
      const { data: sessions, error } = await supabase
        .from('workout_sessions')
        .select(`
          id,
          name,
          focus,
          completed_at,
          duration_minutes,
          total_volume,
          exercise_logs (
            order_index,
            notes,
            completed
          )
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false })
        .limit(50);

      if (error) throw error;

      return this.processWorkoutStats(sessions || []);
    } catch (error) {
      console.error('❌ Erro ao buscar stats:', error);
      return null;
    }
  }

  private processWorkoutStats(sessions: any[]) {
    const totalSessions = sessions.length;
    const totalVolume = sessions.reduce((sum, s) => sum + (s.total_volume || 0), 0);
    
    // Extrair dados dos exercícios das notas
    const exerciseProgress = new Map();
    sessions.forEach(session => {
      session.exercise_logs?.forEach((log: any) => {
        if (log.notes) {
          // Parse das notas que contém informações do exercício
          const noteMatch = log.notes.match(/^([^-]+)\s*-\s*(\d+)x([\d-]+)(?:\s*@(\d+(?:\.\d+)?)kg)?(?:\s*RPE:(\d+))?/);
          if (noteMatch) {
            const [, name, sets, reps, weight, rpe] = noteMatch;
            const exerciseName = name.trim();
            
            if (!exerciseProgress.has(exerciseName)) {
              exerciseProgress.set(exerciseName, []);
            }
            exerciseProgress.get(exerciseName).push({
              date: session.completed_at,
              weight: parseFloat(weight || '0'),
              reps: parseInt(reps) || 0,
              volume: (parseFloat(weight || '0') * parseInt(reps || '0'))
            });
          }
        }
      });
    });

    // Dados para gráficos
    const chartData = sessions.slice(0, 12).reverse().map(session => ({
      date: new Date(session.completed_at).toLocaleDateString('pt-BR', { 
        month: 'short', 
        day: 'numeric' 
      }),
      volume: session.total_volume || 0,
      duration: session.duration_minutes || 0
    }));

    return {
      totalSessions,
      totalVolume,
      averageVolume: totalVolume / Math.max(totalSessions, 1),
      exerciseProgress: Object.fromEntries(exerciseProgress),
      chartData,
      recentSessions: sessions.slice(0, 5)
    };
  }

  async getExerciseProgression(userId: string, exerciseName: string, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('exercise_logs')
        .select(`
          notes,
          created_at,
          workout_sessions!inner(completed_at, user_id)
        `)
        .eq('workout_sessions.user_id', userId)
        .ilike('notes', `%${exerciseName}%`)
        .order('workout_sessions(completed_at)', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data?.map(log => {
        // Parse das notas para extrair dados
        const noteMatch = log.notes?.match(/(\d+)x([\d-]+)(?:\s*@(\d+(?:\.\d+)?)kg)?(?:\s*RPE:(\d+))?/);
        if (noteMatch) {
          const [, sets, reps, weight, rpe] = noteMatch;
          return {
            date: (log as any).workout_sessions.completed_at,
            weight: parseFloat(weight || '0'),
            reps: parseInt(reps) || 0,
            volume: (parseFloat(weight || '0') * parseInt(reps || '0')),
            rpe: parseInt(rpe || '0')
          };
        }
        return null;
      }).filter(Boolean) || [];
    } catch (error) {
      console.error('❌ Erro ao buscar progressão:', error);
      return [];
    }
  }

  async syncLocalToDatabase(userId: string) {
    try {
      // Buscar dados do localStorage que não foram sincronizados
      const localHistory = JSON.parse(localStorage.getItem(`fitai_history_v1_user_${userId}`) || '[]');
      
      for (const entry of localHistory) {
        // Verificar se já existe no banco
        const { data: existing } = await supabase
          .from('workout_sessions')
          .select('id')
          .eq('user_id', userId)
          .eq('completed_at', entry.ts)
          .single();

        if (!existing) {
          // Não existe, sincronizar
          const sessionData: WorkoutSessionData = {
            user_id: userId,
            name: `Treino ${entry.focus}`,
            focus: entry.focus,
            exercises: entry.items.map((item: any) => ({
              name: item.name,
              sets: 1, // Assumir 1 set por item do histórico
              reps: '1',
              weight: item.carga,
              rpe: item.rpe,
              notes: item.nota
            })),
            completed_at: entry.ts,
            total_volume: entry.items.reduce((sum: number, item: any) => sum + (item.carga || 0), 0)
          };
          
          await this.saveWorkoutSession(sessionData);
        }
      }

      console.log('✅ Sincronização concluída');
    } catch (error) {
      console.error('❌ Erro na sincronização:', error);
    }
  }
}

export const databaseService = new DatabaseService();