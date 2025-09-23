// Storage utilities com dados únicos por usuário
// NUNCA mais usar dados compartilhados ou 'demo'

export interface HistoryEntry {
  ts: string;
  user: string; // ID real do usuário
  focus: string;
  items: { name: string; carga: number; rpe: number; nota: string }[];
}

export interface ApiConfig {
  apiBase: string;
  userId: string;
}

// SEMPRE usar chaves únicas por usuário
function getUserStorageKey(userId: string, baseKey: string): string {
  return `${baseKey}_user_${userId}`;
}

export function getApiConfig(userId: string): ApiConfig {
  if (!userId) {
    throw new Error('User ID é obrigatório');
  }
  
  const userConfigKey = getUserStorageKey(userId, 'fitai_config');
  const config = localStorage.getItem(userConfigKey);
  
  if (config) {
    return JSON.parse(config);
  }
  
  // Config padrão ÚNICO para o usuário
  return {
    apiBase: '/api',
    userId: userId // ID real, nunca 'demo'
  };
}

export function saveApiConfig(userId: string, config: ApiConfig): void {
  if (!userId) {
    throw new Error('User ID é obrigatório');
  }
  
  const userConfigKey = getUserStorageKey(userId, 'fitai_config');
  localStorage.setItem(userConfigKey, JSON.stringify({
    ...config,
    userId: userId // Sempre usar ID real
  }));
}

export function saveWorkoutHistory(entry: HistoryEntry): void {
  if (!entry.user || entry.user === 'demo') {
    console.error('ERRO CRÍTICO: Tentativa de salvar dados compartilhados!');
    return;
  }
  
  try {
    const userHistoryKey = getUserStorageKey(entry.user, 'fitai_history_v1');
    const existingData = localStorage.getItem(userHistoryKey);
    const history: HistoryEntry[] = existingData ? JSON.parse(existingData) : [];
    
    history.push(entry);
    
    // Limitar a 100 entradas por usuário
    const trimmed = history.slice(-100);
    localStorage.setItem(userHistoryKey, JSON.stringify(trimmed));
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ Histórico salvo para usuário ${entry.user.slice(0, 8)}...`);
    }
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Erro ao salvar histórico:', error);
    }
  }
}

export function getWorkoutHistory(userId: string): HistoryEntry[] {
  if (!userId || userId === 'demo') {
    console.warn('Tentativa de acessar dados compartilhados bloqueada');
    return [];
  }
  
  try {
    const userHistoryKey = getUserStorageKey(userId, 'fitai_history_v1');
    const history = localStorage.getItem(userHistoryKey);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Erro ao carregar histórico:', error);
    return [];
  }
}

export function getWeekCount(userId: string): number {
  if (!userId) return 0;
  
  const history = getWorkoutHistory(userId);
  const thisWeek = getStartOfWeek();
  const thisWeekWorkouts = history.filter(entry => {
    const entryDate = new Date(entry.ts);
    return entryDate >= thisWeek;
  });
  
  // Contar dias únicos
  const uniqueDays = new Set(
    thisWeekWorkouts.map(entry => new Date(entry.ts).toDateString())
  );
  
  return uniqueDays.size;
}

export function getConsistency(userId: string): { completed: number; planned: number } {
  if (!userId) return { completed: 0, planned: 4 };
  
  const weekCount = getWeekCount(userId);
  return {
    completed: weekCount,
    planned: 4 // Meta padrão
  };
}

export function getTopExerciseSeries(userId?: string): { name: string; data: number[] }[] {
  if (!userId) return [];
  
  const history = getWorkoutHistory(userId);
  
  if (history.length === 0) {
    return [{
      name: 'Cargas',
      data: [0, 0, 0, 0, 0]
    }];
  }
  
  // Pegar últimas 5 entradas do exercício mais frequente
  const exerciseFreq: { [key: string]: number } = {};
  history.forEach(entry => {
    entry.items.forEach(item => {
      exerciseFreq[item.name] = (exerciseFreq[item.name] || 0) + 1;
    });
  });
  
  const topExercise = Object.keys(exerciseFreq).reduce((a, b) => 
    exerciseFreq[a] > exerciseFreq[b] ? a : b
  );
  
  const topExerciseData = history
    .filter(entry => entry.items.some(item => item.name === topExercise))
    .slice(-5)
    .map(entry => {
      const exerciseItem = entry.items.find(item => item.name === topExercise);
      return exerciseItem?.carga || 0;
    });
  
  return [{
    name: topExercise,
    data: topExerciseData
  }];
}

function getStartOfWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Segunda-feira
  return new Date(now.setDate(diff));
}

// Funcões de cache genéricas com ID de usuário
export function getCachedData<T>(userId: string, key: string): T | null {
  if (!userId) return null;
  
  try {
    const userKey = getUserStorageKey(userId, key);
    const item = localStorage.getItem(userKey);
    return item ? JSON.parse(item) : null;
  } catch (error) {
    console.error('Erro ao ler cache:', error);
    return null;
  }
}

export function setCachedData<T>(userId: string, key: string, value: T): void {
  if (!userId) {
    console.error('ERRO: Tentativa de cache sem ID de usuário');
    return;
  }
  
  try {
    const userKey = getUserStorageKey(userId, key);
    localStorage.setItem(userKey, JSON.stringify(value));
  } catch (error) {
    console.error('Erro ao salvar cache:', error);
  }
}

// Limpar dados demo/compartilhados (função de limpeza de segurança)
export function clearSharedData(): void {
  const keysToRemove = [
    'bora_hist_v1',
    'fitai_history_v1',
    'bora_user_profile',
    'bora_plans',
    'bora_exercises',
    'bora_sessions',
    'auto_settings' // Clear auto security settings
  ];
  
  // Also remove any keys that might contain user-specific data
  const allKeys = Object.keys(localStorage);
  const userKeys = allKeys.filter(key => 
    key.includes('_demo') || 
    key.includes('shared_') ||
    (key.includes('user_') && !key.includes('user_' + getCurrentUserId()))
  );
  
  [...keysToRemove, ...userKeys].forEach(key => {
    localStorage.removeItem(key);
  });
  
  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ Dados compartilhados removidos para segurança');
  }
}

function getCurrentUserId(): string {
  // Helper to get current user ID safely
  try {
    const userId = localStorage.getItem('currentUserId');
    return userId || 'unknown';
  } catch {
    return 'unknown';
  }
}

// Compatibilidade com código antigo (mas agora seguro)
export function getConfig() {
  return { apiBase: '/api', userId: 'protected' };
}

export function setConfig(config: any) {
  console.warn('setConfig depreciado - use saveApiConfig com userId');
}

export function pushHistory(workout: any) {
  console.warn('pushHistory depreciado - use saveWorkoutHistory');
}

export function getHistory() {
  console.warn('getHistory depreciado - use getWorkoutHistory com userId');
  return [];
}

export function getStreakData() {
  return { current: 0, best: 0 };
}

export function getConsistencyData() {
  return { completed: 0, planned: 4 };
}

// Funções genéricas de storage (seguras)
export function getStorage<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
}

export function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Erro ao salvar no localStorage:', error);
  }
}
