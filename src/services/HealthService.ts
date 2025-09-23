import { UserProfile } from '@/types';

export interface HealthData {
  steps: number;
  calories: number;
  heartRate?: number;
  weight?: number;
  sleepHours?: number;
  restingHeartRate?: number;
  vo2Max?: number;
  bodyFatPercentage?: number;
  muscleMass?: number;
  hydrationLevel?: number;
}

export interface DetailedHealthMetrics {
  weeklySteps: number[];
  weeklyCalories: number[];
  heartRateZones: {
    resting: number;
    fat_burn: number;
    cardio: number;
    peak: number;
  };
  sleepQuality: {
    deep: number;
    light: number;
    rem: number;
    awake: number;
  };
  recovery: {
    hrv: number;
    restingHr: number;
    sleepScore: number;
    stressLevel: number;
  };
}

export class HealthService {
  private static hasPermission: boolean = false;
  private static connectedApps: string[] = [];

  static async requestPermissions(): Promise<boolean> {
    try {
      // In a real Capacitor app, this would use HealthKit/Google Fit
      // For web, we'll simulate or use available APIs
      
      if ('permissions' in navigator) {
        // Web API permissions (limited)
        const result = await navigator.permissions.query({ name: 'camera' as PermissionName });
        this.hasPermission = result.state === 'granted';
      } else {
        // Mock permission for development
        this.hasPermission = true;
      }

      // Simulate connected health apps
      this.connectedApps = ['Apple Health', 'Google Fit', 'Samsung Health'];
      
      return this.hasPermission;
    } catch (error) {
      console.warn('Health permissions not available, using mock data');
      this.hasPermission = false;
      return false;
    }
  }

  static async getHealthData(): Promise<HealthData> {
    if (!this.hasPermission) {
      return this.getMockHealthData();
    }

    try {
      // In Capacitor app, this would use actual HealthKit/Google Fit data
      return this.getMockHealthData();
    } catch (error) {
      console.error('Failed to fetch health data:', error);
      return this.getMockHealthData();
    }
  }

  static async getDetailedMetrics(): Promise<DetailedHealthMetrics> {
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31;
    
    return {
      weeklySteps: [8500, 12300, 9800, 11200, 10500, 13400, 7800],
      weeklyCalories: [2200, 2850, 2400, 2650, 2500, 3100, 2300],
      heartRateZones: {
        resting: 62,
        fat_burn: 125,
        cardio: 155,
        peak: 185
      },
      sleepQuality: {
        deep: 22,
        light: 55,
        rem: 18,
        awake: 5
      },
      recovery: {
        hrv: 42 + (seed % 15), // 42-57ms
        restingHr: 58 + (seed % 12), // 58-70 bpm
        sleepScore: 75 + (seed % 20), // 75-95%
        stressLevel: 15 + (seed % 25) // 15-40%
      }
    };
  }

  static async syncWeight(profile: UserProfile): Promise<void> {
    if (!this.hasPermission) return;

    try {
      // In real app, sync weight to HealthKit/Google Fit
      console.log(`📊 Syncing weight: ${profile.peso}kg to health app`);
      
      // Store locally for now
      localStorage.setItem('bora_health_weight', JSON.stringify({
        weight: profile.peso,
        date: new Date().toISOString(),
        synced: true,
        apps: this.connectedApps
      }));
    } catch (error) {
      console.error('Failed to sync weight:', error);
    }
  }

  static async syncWorkoutToHealth(workoutData: {
    type: string;
    duration: number;
    calories: number;
    heartRate?: number;
    exercises: any[];
  }): Promise<void> {
    if (!this.hasPermission) return;

    try {
      console.log('📊 Syncing workout to health apps:', workoutData);
      
      const healthWorkout = {
        ...workoutData,
        timestamp: new Date().toISOString(),
        syncedApps: this.connectedApps,
        totalSets: workoutData.exercises.reduce((acc, ex) => acc + (ex.sets || 0), 0),
        totalReps: workoutData.exercises.reduce((acc, ex) => acc + (ex.reps || 0), 0),
        totalVolume: workoutData.exercises.reduce((acc, ex) => acc + ((ex.weight || 0) * (ex.reps || 0)), 0)
      };

      const stored = JSON.parse(localStorage.getItem('bora_health_workouts') || '[]');
      stored.push(healthWorkout);
      localStorage.setItem('bora_health_workouts', JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to sync workout to health apps:', error);
    }
  }

  private static getMockHealthData(): HealthData {
    // Generate realistic mock data
    const today = new Date();
    const seed = today.getDate() + today.getMonth() * 31; // Consistent daily values
    
    return {
      steps: 8000 + (seed % 5000), // 8k-13k steps
      calories: 2200 + (seed % 800), // 2200-3000 calories
      heartRate: 65 + (seed % 25), // 65-90 bpm
      weight: 75 + Math.sin(seed) * 2, // Slightly varying weight
      sleepHours: 6.5 + (seed % 3), // 6.5-9.5 hours
      restingHeartRate: 58 + (seed % 12), // 58-70 bpm
      vo2Max: 35 + (seed % 20), // 35-55 ml/kg/min
      bodyFatPercentage: 12 + (seed % 8), // 12-20%
      muscleMass: 65 + (seed % 10), // 65-75kg
      hydrationLevel: 75 + (seed % 20) // 75-95%
    };
  }

  static hasHealthPermissions(): boolean {
    return this.hasPermission;
  }

  static getConnectedApps(): string[] {
    return this.connectedApps;
  }

  static async trackWorkout(duration: number, calories: number, heartRate?: number): Promise<void> {
    if (!this.hasPermission) return;

    try {
      // In real app, this would log workout to health apps
      console.log(`📊 Logging workout: ${duration}min, ${calories}kcal, HR: ${heartRate}bpm`);
      
      const workoutData = {
        date: new Date().toISOString(),
        duration,
        calories,
        heartRate,
        type: 'strength_training',
        syncedTo: this.connectedApps
      };

      const stored = JSON.parse(localStorage.getItem('bora_health_workouts') || '[]');
      stored.push(workoutData);
      localStorage.setItem('bora_health_workouts', JSON.stringify(stored));
    } catch (error) {
      console.error('Failed to track workout:', error);
    }
  }

  static async getHealthInsights(): Promise<{
    weeklyTrend: 'up' | 'down' | 'stable';
    recommendation: string;
    riskFactors: string[];
    achievements: string[];
  }> {
    const metrics = await this.getDetailedMetrics();
    
    return {
      weeklyTrend: 'up',
      recommendation: 'Seus dados de recuperação estão ótimos! Continue mantendo 7-8h de sono.',
      riskFactors: [
        metrics.recovery.stressLevel > 30 ? 'Nível de stress elevado' : '',
        metrics.recovery.sleepScore < 80 ? 'Qualidade do sono abaixo do ideal' : ''
      ].filter(Boolean),
      achievements: [
        'Meta de passos atingida 5x esta semana',
        'Frequência cardíaca em repouso melhorou',
        'Consistência de sono excelente'
      ]
    };
  }

  // Integration with wearables
  static async connectWearable(device: 'apple_watch' | 'garmin' | 'fitbit' | 'samsung_watch'): Promise<boolean> {
    try {
      console.log(`🔗 Connecting to ${device}...`);
      
      // Simulate connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      if (!this.connectedApps.includes(device)) {
        this.connectedApps.push(device);
      }
      
      localStorage.setItem('bora_connected_devices', JSON.stringify(this.connectedApps));
      return true;
    } catch (error) {
      console.error(`Failed to connect ${device}:`, error);
      return false;
    }
  }
}