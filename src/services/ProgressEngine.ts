import { SetEntry, OverloadHint, Session } from '@/types';

export class ProgressEngine {
  private static readonly XP_STORAGE_KEY = 'bora_xp_v1';
  private static readonly STREAK_STORAGE_KEY = 'bora_streak_v1';

  static applyOverloadSuggestion(exerciseId: string): OverloadHint | null {
    const history = this.getExerciseHistory(exerciseId);
    if (history.length < 2) return null;

    const lastTwo = history.slice(-2);
    const avgRPE = lastTwo.reduce((sum, set) => sum + set.rpe, 0) / lastTwo.length;

    if (avgRPE <= 7) {
      const lastWeight = lastTwo[lastTwo.length - 1].peso;
      const suggestion = lastWeight > 20 ? 2.5 : 1.25; // Smaller increments for lighter weights
      
      return {
        exerciseId,
        suggestion: 'increase_weight',
        amount: suggestion,
        reason: `RPE médio ${avgRPE.toFixed(1)} por 2 sessões. Hora de progredir!`
      };
    }

    if (avgRPE >= 9) {
      return {
        exerciseId,
        suggestion: 'maintain',
        reason: `RPE alto (${avgRPE.toFixed(1)}). Mantenha a carga atual.`
      };
    }

    return null;
  }

  static updateXPAndStreak(session: Session): void {
    this.updateXP(session);
    this.updateStreak();
  }

  static currentXP(): number {
    const stored = localStorage.getItem(this.XP_STORAGE_KEY);
    if (!stored) return 0;
    
    const data = JSON.parse(stored);
    return data.currentXP || 0;
  }

  static currentLevel(): number {
    const stored = localStorage.getItem(this.XP_STORAGE_KEY);
    if (!stored) return 1;
    
    const data = JSON.parse(stored);
    return data.level || 1;
  }

  static currentStreak(): number {
    const stored = localStorage.getItem(this.STREAK_STORAGE_KEY);
    if (!stored) return 0;
    
    const data = JSON.parse(stored);
    const lastWorkout = new Date(data.lastWorkout || 0);
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - lastWorkout.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) return 0; // Streak broken
    return data.streak || 0;
  }

  private static updateXP(session: Session): void {
    const history = JSON.parse(localStorage.getItem('bora_hist_v1') || '[]');
    const sessionSets = history
      .filter((entry: any) => entry.ts === session.date)
      .flatMap((entry: any) => entry.items);

    // Calculate volume-based XP
    const volume = sessionSets.reduce((total: number, set: any) => {
      return total + (set.carga * 10); // Simplified volume calculation
    }, 0);

    const xpGain = Math.min(Math.floor(volume / 100), 100); // Cap at 100 XP per session
    
    const stored = JSON.parse(localStorage.getItem(this.XP_STORAGE_KEY) || '{"currentXP": 0, "level": 1}');
    stored.currentXP = (stored.currentXP + xpGain) % 100;
    
    if (stored.currentXP < xpGain) { // Level up occurred
      stored.level = (stored.level || 1) + 1;
      this.triggerLevelUpEffect();
    }

    localStorage.setItem(this.XP_STORAGE_KEY, JSON.stringify(stored));
  }

  private static updateStreak(): void {
    const today = new Date().toISOString().split('T')[0];
    const stored = JSON.parse(localStorage.getItem(this.STREAK_STORAGE_KEY) || '{"streak": 0, "lastWorkout": ""}');
    
    const lastWorkout = stored.lastWorkout;
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0];

    if (lastWorkout === yesterdayStr) {
      stored.streak += 1;
    } else if (lastWorkout !== today) {
      stored.streak = 1; // Reset streak if not consecutive
    }

    stored.lastWorkout = today;
    localStorage.setItem(this.STREAK_STORAGE_KEY, JSON.stringify(stored));
  }

  private static triggerLevelUpEffect(): void {
    // Trigger confetti effect - will be implemented in UI
    window.dispatchEvent(new CustomEvent('levelUp'));
  }

  private static getExerciseHistory(exerciseId: string): SetEntry[] {
    const history = JSON.parse(localStorage.getItem('bora_hist_v1') || '[]');
    return history
      .flatMap((entry: any) => entry.items)
      .filter((item: any) => item.name === exerciseId)
      .map((item: any, index: number) => ({
        id: `${exerciseId}-${index}`,
        sessionId: '',
        exerciseId,
        setNumber: 1,
        reps: 10,
        peso: item.carga,
        rpe: item.rpe,
        nota: item.nota
      }));
  }
}