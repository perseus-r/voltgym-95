import { supabase } from '@/integrations/supabase/client';
import { ProgressEngine } from './ProgressEngine';
import { getStorage } from '@/lib/storage';

interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  analysis_type?: string;
  insights?: string[];
  recommendations?: string[];
  tags?: string[];
  created_at: string;
}

interface WorkoutAnalysis {
  exercises: any[];
  volume: number;
  rpe: number;
  duration: number;
  date: string;
}

interface AIResponse {
  response: string;
  analysisType: string;
  insights: string[];
  recommendations: string[];
  tags: string[];
  timestamp: string;
}

export class AICoachService {
  // Métodos para gerenciar conversas
  static async createConversation(title?: string): Promise<AIConversation | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data, error } = await supabase
        .from('ai_conversations')
        .insert([{
          user_id: user.id,
          title: title || 'Nova Conversa'
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      return null;
    }
  }

  static async getConversations(): Promise<AIConversation[]> {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar conversas:', error);
      return [];
    }
  }

  static async getConversationMessages(conversationId: string): Promise<AIMessage[]> {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(item => ({
        ...item,
        role: item.role as 'user' | 'assistant'
      }));
    } catch (error) {
      console.error('Erro ao buscar mensagens:', error);
      return [];
    }
  }

  static async saveMessage(
    conversationId: string,
    role: 'user' | 'assistant',
    content: string,
    analysisType?: string,
    insights?: string[],
    recommendations?: string[],
    tags?: string[]
  ): Promise<AIMessage | null> {
    try {
      const { data, error } = await supabase
        .from('ai_messages')
        .insert([{
          conversation_id: conversationId,
          role,
          content,
          analysis_type: analysisType,
          insights,
          recommendations,
          tags
        }])
        .select()
        .single();

      if (error) throw error;

      // Atualizar timestamp da conversa
      await supabase
        .from('ai_conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);

      return {
        ...data,
        role: data.role as 'user' | 'assistant'
      };
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
      return null;
    }
  }

  static async deleteConversation(conversationId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      return false;
    }
  }

  static async updateConversationTitle(conversationId: string, title: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .update({ title })
        .eq('id', conversationId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro ao atualizar título:', error);
      return false;
    }
  }

  // Método melhorado para análise com salvamento automático
  static async analyzeProgression(
    recentWorkouts: WorkoutAnalysis[], 
    conversationId?: string
  ): Promise<AIResponse> {
    const workoutData = this.buildWorkoutContext(recentWorkouts);
    const message = "Analise minha progressão recente. Onde estou evoluindo bem e onde preciso melhorar?";
    
    const response = await this.callAI(message, workoutData, 'progression');
    
    if (conversationId) {
      await this.saveMessage(conversationId, 'user', message);
      await this.saveMessage(
        conversationId,
        'assistant',
        response.response,
        response.analysisType,
        response.insights,
        response.recommendations,
        response.tags
      );
    }
    
    return response;
  }

  static async suggestAdaptation(issue: string, currentWorkout?: any): Promise<AIResponse> {
    const workoutData = currentWorkout ? this.buildWorkoutContext([currentWorkout]) : undefined;
    
    return this.callAI(
      `Preciso adaptar meu treino: ${issue}. Como devo proceder?`,
      workoutData,
      'adaptation'
    );
  }

  static async optimizeVolume(weeklyData: any[]): Promise<AIResponse> {
    const workoutData = this.buildWorkoutContext(weeklyData);
    
    return this.callAI(
      "Analise meu volume de treino semanal. Está adequado para meus objetivos?",
      workoutData,
      'periodization'
    );
  }

  static async askGeneral(question: string): Promise<AIResponse> {
    return this.callAI(question, undefined, 'general');
  }

  static async generateWorkoutPlan(goal: string, experience: string): Promise<AIResponse> {
    const userStats = this.getUserStats();
    
    return this.callAI(
      `Gere um plano de treino para ${goal}. Meu nível de experiência: ${experience}`,
      { userStats } as any,
      'planning'
    );
  }

  static async analyzeExerciseForm(exerciseName: string, issues?: string): Promise<AIResponse> {
    const context = issues ? ` Problemas reportados: ${issues}` : '';
    
    return this.callAI(
      `Analise a execução do ${exerciseName}.${context} Dê dicas técnicas específicas.`,
      undefined,
      'technique'
    );
  }

  static async suggestDeload(fatigueLevel: number, performanceData: any[]): Promise<AIResponse> {
    const workoutData = this.buildWorkoutContext(performanceData);
    
    return this.callAI(
      `Meu nível de fadiga está ${fatigueLevel}/10. Preciso de deload ou posso continuar?`,
      workoutData,
      'periodization'
    );
  }

  private static async callAI(
    message: string, 
    workoutData?: any, 
    analysisType: string = 'general'
  ): Promise<AIResponse> {
    try {
      // Enriquecer contexto com nome e patente do usuário
      let displayName = 'Atleta';
      let rankName = 'Recruta';
      try {
        const { data: auth } = await supabase.auth.getUser();
        const user = auth?.user;
        if (user) {
          displayName = (user.user_metadata as any)?.display_name || user.email?.split('@')[0] || displayName;
          const { data: profile } = await supabase
            .from('profiles')
            .select('current_xp, display_name')
            .eq('user_id', user.id)
            .maybeSingle();
          const xp = (profile as any)?.current_xp ?? 0;
          rankName = this.getRankName(xp);
          if ((profile as any)?.display_name) displayName = (profile as any).display_name;
        }
      } catch {}

      const baseStats = this.getUserStats();
      const augmentedWorkoutData = {
        ...(workoutData || {}),
        userStats: {
          ...(workoutData?.userStats || baseStats),
          displayName,
          rankName,
        },
      };

      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: {
          message,
          workoutData: augmentedWorkoutData,
          analysisType,
        },
      });

      if (error) {
        console.error('AI Coach API error:', error);
        return this.getFallbackResponse(message, analysisType);
      }

      return data;
    } catch (error) {
      console.error('AI Coach service error:', error);
      return this.getFallbackResponse(message, analysisType);
    }
  }

  private static buildWorkoutContext(workouts: WorkoutAnalysis[]) {
    const userStats = this.getUserStats();
    
    return {
      exercises: workouts[0]?.exercises || [],
      volume: workouts.reduce((sum, w) => sum + w.volume, 0),
      rpe: workouts.reduce((sum, w) => sum + w.rpe, 0) / workouts.length,
      duration: workouts.reduce((sum, w) => sum + w.duration, 0) / workouts.length,
      lastWorkouts: workouts.slice(0, 5),
      userStats
    };
  }

  private static getUserStats() {
    return {
      level: ProgressEngine.currentLevel(),
      streak: ProgressEngine.currentStreak(),
      totalWorkouts: this.getTotalWorkouts(),
      maxLifts: this.getMaxLifts()
    };
  }

  private static getTotalWorkouts(): number {
    const history = getStorage('bora_hist_v1', []);
    return history.length;
  }

  private static getMaxLifts(): Record<string, number> {
    const history = getStorage('bora_hist_v1', []);
    const maxLifts: Record<string, number> = {};
    
    history.forEach((session: any) => {
      session.items?.forEach((item: any) => {
        const exerciseName = item.name?.toLowerCase();
        if (exerciseName && item.carga) {
          if (!maxLifts[exerciseName] || item.carga > maxLifts[exerciseName]) {
            maxLifts[exerciseName] = item.carga;
          }
        }
      });
    });
    
    return maxLifts;
  }

  private static getFallbackResponse(message: string, analysisType: string): AIResponse {
    const fallbacks = {
      progression: {
        response: "Pelos dados que vejo, suba +2.5kg no próximo treino. Sua evolução tá consistente e pode empurrar mais.",
        insights: [
          "Progressão sólida - hora de aumentar a carga",
          "Consistência boa, corpo pedindo mais estímulo",
          "Seus números mostram capacidade pra progredir"
        ],
        recommendations: [
          "Próximo treino: +2.5kg nos exercícios principais",
          "Mantém as reps, só aumenta o peso",
          "Se RPE passar de 8.5, volta pra carga anterior"
        ]
      },
      adaptation: {
        response: "Troca as pegadas e ângulos dos exercícios principais. Seu corpo se adaptou ao padrão atual.",
        insights: [
          "Hora de variar - corpo se adaptou aos movimentos",
          "Mudança de pegada/ângulo gera novo estímulo",
          "Manter igual não vai gerar mais progresso"
        ],
        recommendations: [
          "Supino: muda de reto pra inclinado (ou vice-versa)",
          "Puxadas: alterna pegada pronada/supinada",
          "Agachamento: testa variação box squat"
        ]
      },
      general: {
        response: "Foca na execução perfeita e sobe +1.25kg por semana nos principais. Consistência é tudo.",
        insights: [
          "Técnica perfeita vale mais que peso alto",
          "Progressão gradual é mais sustentável",
          "Constância sempre bate intensidade"
        ],
        recommendations: [
          "Filma os exercícios pra checar a forma",
          "+1.25kg semanais nos movimentos principais",
          "Mantém 3-4 treinos fixos por semana"
        ]
      }
    };

    const fallback = fallbacks[analysisType as keyof typeof fallbacks] || fallbacks.general;
    
    return {
      ...fallback,
      analysisType,
      tags: [analysisType, 'prático', 'direto'],
      timestamp: new Date().toISOString()
    };
  }

  private static getRankName(xp: number): string {
    if (xp >= 1001) return 'General';
    if (xp >= 501) return 'Capitão';
    if (xp >= 101) return 'Soldado';
    return 'Recruta';
  }
}