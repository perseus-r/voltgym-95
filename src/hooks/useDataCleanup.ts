import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook para limpar dados genéricos quando um novo usuário faz login
 * Garante que cada usuário tenha uma experiência personalizada desde o início
 */
export function useDataCleanup() {
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const cleanupKey = `data_cleaned_${user.id}`;
    const alreadyCleaned = localStorage.getItem(cleanupKey);

    // Se já foi limpo para este usuário, não fazer nada
    if (alreadyCleaned) return;

    console.log('🧹 Limpando dados genéricos para novo usuário:', user.id);

    // Lista de chaves de dados genéricos para limpar
    const keysToClean = [
      'bora_hist_v1', // Histórico antigo
      'bora_plans_v1', // Planos antigos
      'bora_plan_exercises_v1', // Exercícios de planos antigos  
      'workout_templates', // Templates sem ID de usuário
      'active_workout_plan', // Plano ativo antigo
      'weekly_workout_schedule', // Cronograma antigo
      'user_progress', // Progresso antigo
      'workout_sessions', // Sessões antigas
      'cached_exercises', // Cache de exercícios
      'demo_data', // Dados demo
      'temp_data' // Dados temporários
    ];

    // Remove dados genéricos
    keysToClean.forEach(key => {
      localStorage.removeItem(key);
    });

    // Inicializar dados zerados para o usuário
    const userDataPrefix = `user_${user.id}_`;
    
    // Estrutura inicial zerada
    const initialUserData = {
      [`${userDataPrefix}workouts`]: JSON.stringify([]),
      [`${userDataPrefix}templates`]: JSON.stringify([]),
      [`${userDataPrefix}progress`]: JSON.stringify({
        level: 1,
        xp: 0,
        streak: 0,
        totalWorkouts: 0,
        weeklyWorkouts: 0
      }),
      [`${userDataPrefix}settings`]: JSON.stringify({
        goal: 'massa',
        experience: 'iniciante',
        weeklyGoal: 4,
        notifications: true
      }),
      [`${userDataPrefix}achievements`]: JSON.stringify([])
    };

    // Salvar dados iniciais zerados
    Object.entries(initialUserData).forEach(([key, value]) => {
      localStorage.setItem(key, value);
    });

    // Marcar como limpo para este usuário
    localStorage.setItem(cleanupKey, new Date().toISOString());

    console.log('✅ Dados limpos e inicializados para usuário:', user.id);
  }, [user?.id]);

  // Função para limpar dados manualmente (se necessário)
  const cleanUserData = () => {
    if (!user) return;

    const cleanupKey = `data_cleaned_${user.id}`;
    localStorage.removeItem(cleanupKey);
    
    // Forçar limpeza na próxima execução
    window.location.reload();
  };

  return { cleanUserData };
}