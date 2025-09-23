import { getStorage, setStorage } from '@/lib/storage';

interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'volume' | 'consistency' | 'milestone' | 'special';
  progress: number;
  maxProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export class AchievementService {
  private static readonly STORAGE_KEY = 'bora_achievements_v1';

  private static defaultAchievements: Omit<Achievement, 'progress' | 'isUnlocked' | 'unlockedAt'>[] = [
    // Streak Achievements
    {
      id: 'first_workout',
      title: 'Primeiro Passo',
      description: 'Complete seu primeiro treino',
      category: 'milestone',
      maxProgress: 1,
      rarity: 'common'
    },
    {
      id: 'streak_3',
      title: 'Pegando o Ritmo',
      description: 'Mantenha uma sequência de 3 dias',
      category: 'streak',
      maxProgress: 3,
      rarity: 'common'
    },
    {
      id: 'streak_7',
      title: 'Uma Semana Forte',
      description: 'Mantenha uma sequência de 7 dias',
      category: 'streak',
      maxProgress: 7,
      rarity: 'rare'
    },
    {
      id: 'streak_30',
      title: 'Maratonista',
      description: 'Mantenha uma sequência de 30 dias',
      category: 'streak',
      maxProgress: 30,
      rarity: 'epic'
    },
    {
      id: 'streak_100',
      title: 'Inabalável',
      description: 'Mantenha uma sequência de 100 dias',
      category: 'streak',
      maxProgress: 100,
      rarity: 'legendary'
    },

    // Volume Achievements
    {
      id: 'volume_1000',
      title: 'Primeira Tonelada',
      description: 'Levante 1000kg em volume total',
      category: 'volume',
      maxProgress: 1000,
      rarity: 'common'
    },
    {
      id: 'volume_10000',
      title: 'Powerlifter',
      description: 'Levante 10 toneladas em volume total',
      category: 'volume',
      maxProgress: 10000,
      rarity: 'rare'
    },
    {
      id: 'volume_50000',
      title: 'Máquina de Guerra',
      description: 'Levante 50 toneladas em volume total',
      category: 'volume',
      maxProgress: 50000,
      rarity: 'epic'
    },

    // Consistency Achievements
    {
      id: 'weekly_4',
      title: 'Disciplinado',
      description: 'Complete 4 treinos em uma semana',
      category: 'consistency',
      maxProgress: 4,
      rarity: 'common'
    },
    {
      id: 'monthly_16',
      title: 'Constante',
      description: 'Complete 16 treinos em um mês',
      category: 'consistency',
      maxProgress: 16,
      rarity: 'rare'
    },

    // Milestone Achievements
    {
      id: 'workouts_10',
      title: 'Veterano Iniciante',
      description: 'Complete 10 treinos',
      category: 'milestone',
      maxProgress: 10,
      rarity: 'common'
    },
    {
      id: 'workouts_50',
      title: 'Meio Século',
      description: 'Complete 50 treinos',
      category: 'milestone',
      maxProgress: 50,
      rarity: 'rare'
    },
    {
      id: 'workouts_100',
      title: 'Centurião',
      description: 'Complete 100 treinos',
      category: 'milestone',
      maxProgress: 100,
      rarity: 'epic'
    },
    {
      id: 'workouts_365',
      title: 'Ano Completo',
      description: 'Complete 365 treinos',
      category: 'milestone',
      maxProgress: 365,
      rarity: 'legendary'
    },

    // Special Achievements
    {
      id: 'perfect_week',
      title: 'Semana Perfeita',
      description: 'Complete todos os treinos planejados da semana',
      category: 'special',
      maxProgress: 1,
      rarity: 'rare'
    },
    {
      id: 'early_bird',
      title: 'Madrugador',
      description: 'Complete 5 treinos antes das 7h',
      category: 'special',
      maxProgress: 5,
      rarity: 'rare'
    },
    {
      id: 'night_owl',
      title: 'Coruja Noturna',
      description: 'Complete 5 treinos após 21h',
      category: 'special',
      maxProgress: 5,
      rarity: 'rare'
    }
  ];

  static getAllAchievements(): Achievement[] {
    const saved = getStorage<Achievement[]>(this.STORAGE_KEY, []);
    
    // Initialize achievements if not exist
    if (saved.length === 0) {
      const initialized = this.defaultAchievements.map(template => ({
        ...template,
        progress: 0,
        isUnlocked: false
      }));
      setStorage(this.STORAGE_KEY, initialized);
      return initialized;
    }

    // Merge with new achievements if any
    const existingIds = saved.map(a => a.id);
    const newAchievements = this.defaultAchievements
      .filter(template => !existingIds.includes(template.id))
      .map(template => ({
        ...template,
        progress: 0,
        isUnlocked: false
      }));

    if (newAchievements.length > 0) {
      const updated = [...saved, ...newAchievements];
      setStorage(this.STORAGE_KEY, updated);
      return updated;
    }

    return saved;
  }

  static updateProgress(achievementId: string, newProgress: number): void {
    const achievements = this.getAllAchievements();
    const achievement = achievements.find(a => a.id === achievementId);
    
    if (achievement && !achievement.isUnlocked) {
      achievement.progress = Math.min(newProgress, achievement.maxProgress);
      
      if (achievement.progress >= achievement.maxProgress) {
        achievement.isUnlocked = true;
        achievement.unlockedAt = new Date().toISOString();
      }
      
      setStorage(this.STORAGE_KEY, achievements);
    }
  }

  static checkForNewAchievements(): Achievement[] {
    const workoutHistory = getStorage('bora_hist_v1', []);
    const achievements = this.getAllAchievements();
    const newlyUnlocked: Achievement[] = [];

    // Calculate current stats
    const totalWorkouts = workoutHistory.length;
    const totalVolume = workoutHistory.reduce((sum: number, session: any) => {
      return sum + (session.items?.reduce((s: number, item: any) => s + (item.carga || 0), 0) || 0);
    }, 0);

    const currentStreak = this.calculateCurrentStreak(workoutHistory);
    const thisWeekWorkouts = this.getThisWeekWorkouts(workoutHistory);
    const thisMonthWorkouts = this.getThisMonthWorkouts(workoutHistory);

    // Check each achievement
    achievements.forEach(achievement => {
      if (achievement.isUnlocked) return;

      let newProgress = achievement.progress;

      switch (achievement.id) {
        case 'first_workout':
          newProgress = totalWorkouts >= 1 ? 1 : 0;
          break;
        case 'streak_3':
          newProgress = Math.min(currentStreak, 3);
          break;
        case 'streak_7':
          newProgress = Math.min(currentStreak, 7);
          break;
        case 'streak_30':
          newProgress = Math.min(currentStreak, 30);
          break;
        case 'streak_100':
          newProgress = Math.min(currentStreak, 100);
          break;
        case 'volume_1000':
          newProgress = Math.min(totalVolume, 1000);
          break;
        case 'volume_10000':
          newProgress = Math.min(totalVolume, 10000);
          break;
        case 'volume_50000':
          newProgress = Math.min(totalVolume, 50000);
          break;
        case 'weekly_4':
          newProgress = Math.min(thisWeekWorkouts, 4);
          break;
        case 'monthly_16':
          newProgress = Math.min(thisMonthWorkouts, 16);
          break;
        case 'workouts_10':
          newProgress = Math.min(totalWorkouts, 10);
          break;
        case 'workouts_50':
          newProgress = Math.min(totalWorkouts, 50);
          break;
        case 'workouts_100':
          newProgress = Math.min(totalWorkouts, 100);
          break;
        case 'workouts_365':
          newProgress = Math.min(totalWorkouts, 365);
          break;
      }

      if (newProgress > achievement.progress) {
        achievement.progress = newProgress;
        
        if (achievement.progress >= achievement.maxProgress && !achievement.isUnlocked) {
          achievement.isUnlocked = true;
          achievement.unlockedAt = new Date().toISOString();
          newlyUnlocked.push(achievement);
        }
      }
    });

    setStorage(this.STORAGE_KEY, achievements);
    return newlyUnlocked;
  }

  private static calculateCurrentStreak(history: any[]): number {
    if (history.length === 0) return 0;

    const sortedHistory = history
      .map(h => new Date(h.ts).toDateString())
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    const uniqueDays = [...new Set(sortedHistory)];
    const today = new Date().toDateString();
    
    let streak = 0;
    let currentDate = new Date();

    for (let i = 0; i < uniqueDays.length; i++) {
      const workoutDate = currentDate.toDateString();
      
      if (uniqueDays.includes(workoutDate)) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  private static getThisWeekWorkouts(history: any[]): number {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    return history.filter(h => {
      const workoutDate = new Date(h.ts);
      return workoutDate >= startOfWeek && workoutDate <= now;
    }).length;
  }

  private static getThisMonthWorkouts(history: any[]): number {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    return history.filter(h => {
      const workoutDate = new Date(h.ts);
      return workoutDate >= startOfMonth && workoutDate <= now;
    }).length;
  }
}