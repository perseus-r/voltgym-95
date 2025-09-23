import { Plan, PlanExercise, PlanRecommendation } from '@/types';

export class AIAdapter {
  static adapt(plan: Plan, userText: string): PlanRecommendation {
    const adaptedExercises = this.applyRules(plan.id, userText);
    const reasoning = this.generateReasoning(userText);

    return {
      originalPlan: plan,
      adaptedExercises,
      reasoning
    };
  }

  private static applyRules(planId: string, userText: string): PlanExercise[] {
    const text = userText.toLowerCase();
    let exercises = this.getBasePlan(planId);

    // Pain detection rules
    if (text.includes('dor no ombro') || text.includes('ombro dói')) {
      exercises = exercises.map(ex => {
        if (ex.exerciseId.includes('overhead') || ex.exerciseId.includes('press militar')) {
          return {
            ...ex,
            exerciseId: ex.exerciseId.replace('overhead', 'lateral'),
            pesoInicial: ex.pesoInicial * 0.8 // -20% weight
          };
        }
        return ex;
      });
    }

    if (text.includes('dor lombar') || text.includes('lombar dói')) {
      exercises = exercises.map(ex => {
        if (ex.exerciseId.includes('deadlift') || ex.exerciseId.includes('agachamento')) {
          return {
            ...ex,
            pesoInicial: ex.pesoInicial * 0.8,
            series: Math.max(2, ex.series - 1)
          };
        }
        return ex;
      });
    }

    // Energy level adaptations
    if (text.includes('energia baixa') || text.includes('cansado') || text.includes('fadiga')) {
      exercises = exercises.map(ex => ({
        ...ex,
        series: Math.max(2, ex.series - 1),
        restSeg: ex.restSeg + 30,
        pesoInicial: ex.pesoInicial * 0.85 // -15% volume
      }));
    }

    if (text.includes('energia alta') || text.includes('motivado') || text.includes('forte')) {
      exercises = exercises.map(ex => ({
        ...ex,
        series: ex.series + 1,
        pesoInicial: ex.pesoInicial * 1.05 // +5% intensity
      }));
    }

    return exercises;
  }

  private static generateReasoning(userText: string): string {
    const text = userText.toLowerCase();
    const reasons: string[] = [];

    if (text.includes('dor')) {
      reasons.push('Detectei menção de dor - adaptei exercícios para variações mais seguras');
    }
    if (text.includes('energia baixa') || text.includes('cansado')) {
      reasons.push('Reduzi volume e intensidade devido ao baixo nível energético');
    }
    if (text.includes('energia alta')) {
      reasons.push('Aumentei intensidade aproveitando seu alto nível energético');
    }

    return reasons.length > 0 
      ? reasons.join('. ') + '.'
      : 'Plano mantido conforme planejado - nenhuma adaptação necessária.';
  }

  private static getBasePlan(planId: string): PlanExercise[] {
    // Simplified base plans - in real app this would come from database
    const plans: Record<string, PlanExercise[]> = {
      'push': [
        {
          id: 'push-1',
          planId,
          exerciseId: 'supino-reto',
          series: 4,
          reps: '8-10',
          pesoInicial: 60,
          restSeg: 90
        },
        {
          id: 'push-2',
          planId,
          exerciseId: 'supino-inclinado',
          series: 3,
          reps: '10-12',
          pesoInicial: 50,
          restSeg: 90
        },
        {
          id: 'push-3',
          planId,
          exerciseId: 'mergulho',
          series: 3,
          reps: 'AMRAP',
          pesoInicial: 0,
          restSeg: 120
        },
        {
          id: 'push-4',
          planId,
          exerciseId: 'triceps-testa',
          series: 3,
          reps: '12',
          pesoInicial: 20,
          restSeg: 60
        }
      ]
    };

    return plans[planId] || plans['push'];
  }
}