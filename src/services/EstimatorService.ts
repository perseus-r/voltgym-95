import { UserProfile, SessionIntensity } from '@/types';

export class EstimatorService {
  static kcalEstimadas(profile: UserProfile, intensity: SessionIntensity): number {
    const tdee = this.tdee(profile);
    const dailyKcal = tdee / 24; // Per hour base
    
    // Session duration and intensity multipliers
    const intensityMultipliers = {
      leve: 1.2,
      moderado: 1.375,
      alto: 1.55
    };
    
    const sessionDuration = 0.75; // 45 minutes
    const multiplier = intensityMultipliers[intensity];
    
    return Math.round(dailyKcal * sessionDuration * multiplier);
  }

  static tdee(profile: UserProfile): number {
    // Mifflin-St Jeor Equation
    let bmr: number;
    
    if (profile.sexo === 'M') {
      bmr = (10 * profile.peso) + (6.25 * profile.altura) - (5 * 25) + 5;
    } else {
      bmr = (10 * profile.peso) + (6.25 * profile.altura) - (5 * 25) - 161;
    }
    
    // Activity factor based on objective
    const activityFactors = {
      massa: 1.55, // High activity
      gordura: 1.725, // Very high activity (more cardio)
      forca: 1.375 // Moderate activity
    };
    
    return Math.round(bmr * activityFactors[profile.objetivo]);
  }
}