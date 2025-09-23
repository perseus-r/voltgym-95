import { supabase } from '@/integrations/supabase/client';

export interface WorkoutTemplate {
  id: string;
  name: string;
  category: string;
  focus: string;
  difficulty: string;
  duration_minutes: number;
  description: string;
  tags: string[];
  rating: number;
  completions: number;
  is_public: boolean;
  workout_template_exercises?: {
    id: string;
    sets: number;
    reps_target: string;
    exercises: {
      id: string;
      name: string;
      primary_muscles: string[];
    };
  }[];
}

export interface WeeklyScheduleEntry {
  id: string;
  day_of_week: string;
  template_id: string;
  is_completed: boolean;
  workout_templates: WorkoutTemplate;
}

class WorkoutTemplateService {
  private static fallbackTemplates: WorkoutTemplate[] = [
    {
      id: 'template-1',
      name: 'Push Day Intenso',
      category: 'strength',
      focus: 'Peito, Ombros, Tríceps',
      difficulty: 'intermediario',
      duration_minutes: 75,
      description: 'Treino focado em movimentos de empurrar para desenvolvimento de força e massa muscular em peito, ombros e tríceps.',
      tags: ['força', 'hipertrofia', 'push', 'peito'],
      rating: 4.8,
      completions: 234,
      is_public: true,
      workout_template_exercises: [
        { id: 'ex-1', sets: 4, reps_target: '8-10', exercises: { id: 'e1', name: 'Supino Reto com Barra', primary_muscles: ['peito'] } },
        { id: 'ex-2', sets: 3, reps_target: '8-12', exercises: { id: 'e2', name: 'Supino Inclinado com Halteres', primary_muscles: ['peito'] } },
        { id: 'ex-3', sets: 3, reps_target: '10-12', exercises: { id: 'e3', name: 'Desenvolvimento Militar', primary_muscles: ['ombros'] } },
        { id: 'ex-4', sets: 3, reps_target: '8-10', exercises: { id: 'e4', name: 'Elevação Lateral', primary_muscles: ['ombros'] } },
        { id: 'ex-5', sets: 3, reps_target: '10-12', exercises: { id: 'e5', name: 'Tríceps Testa', primary_muscles: ['tríceps'] } },
        { id: 'ex-6', sets: 3, reps_target: '12-15', exercises: { id: 'e6', name: 'Tríceps Pulley', primary_muscles: ['tríceps'] } },
        { id: 'ex-7', sets: 3, reps_target: '8-12', exercises: { id: 'e7', name: 'Mergulho', primary_muscles: ['peito', 'tríceps'] } },
        { id: 'ex-8', sets: 2, reps_target: '15-20', exercises: { id: 'e8', name: 'Flexão de Braço', primary_muscles: ['peito'] } }
      ]
    },
    {
      id: 'template-2',
      name: 'HIIT Fat Burner',
      category: 'hiit',
      focus: 'Queima de Gordura',
      difficulty: 'avancado',
      duration_minutes: 30,
      description: 'Treino intervalado de alta intensidade para máxima queima calórica e condicionamento cardiovascular.',
      tags: ['hiit', 'cardio', 'queima', 'intervalado'],
      rating: 4.9,
      completions: 156,
      is_public: true,
      workout_template_exercises: [
        { id: 'ex-h1', sets: 4, reps_target: '45s', exercises: { id: 'h1', name: 'Burpees', primary_muscles: ['corpo todo'] } },
        { id: 'ex-h2', sets: 4, reps_target: '60s', exercises: { id: 'h2', name: 'Mountain Climbers', primary_muscles: ['core'] } },
        { id: 'ex-h3', sets: 4, reps_target: '45s', exercises: { id: 'h3', name: 'Jump Squats', primary_muscles: ['pernas'] } },
        { id: 'ex-h4', sets: 4, reps_target: '30s', exercises: { id: 'h4', name: 'High Knees', primary_muscles: ['cardio'] } },
        { id: 'ex-h5', sets: 4, reps_target: '60s', exercises: { id: 'h5', name: 'Plank Jacks', primary_muscles: ['core'] } },
        { id: 'ex-h6', sets: 4, reps_target: '45s', exercises: { id: 'h6', name: 'Russian Twists', primary_muscles: ['core'] } }
      ]
    },
    {
      id: 'template-3',
      name: 'Pull Day Completo',
      category: 'strength',
      focus: 'Costas, Bíceps, Posteriores',
      difficulty: 'intermediario',
      duration_minutes: 70,
      description: 'Desenvolvimento completo de costas, bíceps e posteriores com foco em força e definição muscular.',
      tags: ['força', 'costas', 'pull', 'bíceps'],
      rating: 4.7,
      completions: 189,
      is_public: true,
      workout_template_exercises: [
        { id: 'ex-p1', sets: 4, reps_target: '6-8', exercises: { id: 'p1', name: 'Barra Fixa', primary_muscles: ['costas'] } },
        { id: 'ex-p2', sets: 4, reps_target: '8-10', exercises: { id: 'p2', name: 'Remada com Barra', primary_muscles: ['costas'] } },
        { id: 'ex-p3', sets: 3, reps_target: '10-12', exercises: { id: 'p3', name: 'Pulldown', primary_muscles: ['costas'] } },
        { id: 'ex-p4', sets: 3, reps_target: '8-10', exercises: { id: 'p4', name: 'Rosca Direta', primary_muscles: ['bíceps'] } },
        { id: 'ex-p5', sets: 3, reps_target: '10-12', exercises: { id: 'p5', name: 'Rosca Martelo', primary_muscles: ['bíceps'] } },
        { id: 'ex-p6', sets: 3, reps_target: '12-15', exercises: { id: 'p6', name: 'Face Pull', primary_muscles: ['posteriores'] } },
        { id: 'ex-p7', sets: 3, reps_target: '10-12', exercises: { id: 'p7', name: 'Remada Unilateral', primary_muscles: ['costas'] } }
      ]
    },
    {
      id: 'template-4',
      name: 'Leg Day Destruidor',
      category: 'strength',
      focus: 'Pernas, Glúteos, Panturrilhas',
      difficulty: 'avancado',
      duration_minutes: 80,
      description: 'Treino intenso para pernas e glúteos com foco em hipertrofia e força funcional.',
      tags: ['pernas', 'glúteos', 'força', 'hipertrofia'],
      rating: 4.6,
      completions: 143,
      is_public: true,
      workout_template_exercises: [
        { id: 'ex-l1', sets: 5, reps_target: '6-8', exercises: { id: 'l1', name: 'Agachamento Livre', primary_muscles: ['pernas'] } },
        { id: 'ex-l2', sets: 4, reps_target: '8-10', exercises: { id: 'l2', name: 'Leg Press', primary_muscles: ['pernas'] } },
        { id: 'ex-l3', sets: 4, reps_target: '10-12', exercises: { id: 'l3', name: 'Stiff', primary_muscles: ['posteriores'] } },
        { id: 'ex-l4', sets: 3, reps_target: '12-15', exercises: { id: 'l4', name: 'Cadeira Extensora', primary_muscles: ['quadríceps'] } },
        { id: 'ex-l5', sets: 3, reps_target: '12-15', exercises: { id: 'l5', name: 'Mesa Flexora', primary_muscles: ['posteriores'] } },
        { id: 'ex-l6', sets: 4, reps_target: '10-12', exercises: { id: 'l6', name: 'Afundo', primary_muscles: ['pernas'] } },
        { id: 'ex-l7', sets: 3, reps_target: '15-20', exercises: { id: 'l7', name: 'Elevação Pélvica', primary_muscles: ['glúteos'] } },
        { id: 'ex-l8', sets: 4, reps_target: '15-20', exercises: { id: 'l8', name: 'Panturrilha em Pé', primary_muscles: ['panturrilhas'] } },
        { id: 'ex-l9', sets: 3, reps_target: '20-25', exercises: { id: 'l9', name: 'Panturrilha Sentado', primary_muscles: ['panturrilhas'] } }
      ]
    },
    {
      id: 'template-5',
      name: 'Cardio LISS Regenerativo',
      category: 'cardio',
      focus: 'Condicionamento, Recuperação',
      difficulty: 'iniciante',
      duration_minutes: 45,
      description: 'Treino de baixa intensidade para recuperação ativa e queima de gordura sustentável.',
      tags: ['cardio', 'liss', 'recuperação', 'baixa intensidade'],
      rating: 4.3,
      completions: 98,
      is_public: true,
      workout_template_exercises: [
        { id: 'ex-c1', sets: 1, reps_target: '10min', exercises: { id: 'c1', name: 'Aquecimento na Esteira', primary_muscles: ['cardiovascular'] } },
        { id: 'ex-c2', sets: 1, reps_target: '15min', exercises: { id: 'c2', name: 'Caminhada Inclinada', primary_muscles: ['cardiovascular'] } },
        { id: 'ex-c3', sets: 1, reps_target: '10min', exercises: { id: 'c3', name: 'Bicicleta Ergométrica', primary_muscles: ['cardiovascular'] } },
        { id: 'ex-c4', sets: 1, reps_target: '5min', exercises: { id: 'c4', name: 'Elíptico', primary_muscles: ['cardiovascular'] } },
        { id: 'ex-c5', sets: 1, reps_target: '5min', exercises: { id: 'c5', name: 'Alongamento Final', primary_muscles: ['flexibilidade'] } }
      ]
    },
    {
      id: 'template-6',
      name: 'Upper Body Power',
      category: 'strength',
      focus: 'Tronco Superior Completo',
      difficulty: 'intermediario',
      duration_minutes: 65,
      description: 'Treino completo para o tronco superior combinando peito, costas, ombros e braços.',
      tags: ['força', 'upper', 'completo', 'definição'],
      rating: 4.5,
      completions: 167,
      is_public: true,
      workout_template_exercises: [
        { id: 'ex-u1', sets: 4, reps_target: '8-10', exercises: { id: 'u1', name: 'Supino com Halteres', primary_muscles: ['peito'] } },
        { id: 'ex-u2', sets: 3, reps_target: '10-12', exercises: { id: 'u2', name: 'Remada Curvada', primary_muscles: ['costas'] } },
        { id: 'ex-u3', sets: 3, reps_target: '8-10', exercises: { id: 'u3', name: 'Desenvolvimento com Halteres', primary_muscles: ['ombros'] } },
        { id: 'ex-u4', sets: 3, reps_target: '10-12', exercises: { id: 'u4', name: 'Rosca Bíceps', primary_muscles: ['bíceps'] } },
        { id: 'ex-u5', sets: 3, reps_target: '10-12', exercises: { id: 'u5', name: 'Tríceps Francês', primary_muscles: ['tríceps'] } },
        { id: 'ex-u6', sets: 2, reps_target: '12-15', exercises: { id: 'u6', name: 'Crucifixo', primary_muscles: ['peito'] } }
      ]
    }
  ];

  static async getWorkoutTemplates(): Promise<WorkoutTemplate[]> {
    return this.fallbackTemplates;
  }

  static async getMyWorkouts(userId?: string): Promise<WorkoutTemplate[]> {
    const stored = localStorage.getItem('volt_my_workouts');
    return stored ? JSON.parse(stored) : [];
  }

  static async getWeeklySchedule(userId?: string): Promise<WeeklyScheduleEntry[]> {
    const stored = localStorage.getItem('volt_weekly_schedule');
    const schedule = stored ? JSON.parse(stored) : {};
    
    const entries: WeeklyScheduleEntry[] = [];
    Object.entries(schedule).forEach(([dayKey, templates]) => {
      (templates as WorkoutTemplate[]).forEach(template => {
        entries.push({
          id: `${dayKey}-${template.id}`,
          day_of_week: dayKey,
          template_id: template.id,
          is_completed: false,
          workout_templates: template
        });
      });
    });
    
    return entries;
  }

  static async addToSchedule(templateId: string, dayOfWeek: string, userId?: string): Promise<boolean> {
    const stored = localStorage.getItem('volt_weekly_schedule');
    const schedule = stored ? JSON.parse(stored) : {};
    const template = this.fallbackTemplates.find(t => t.id === templateId);
    
    if (!template) return false;
    
    if (!schedule[dayOfWeek]) {
      schedule[dayOfWeek] = [];
    }
    
    schedule[dayOfWeek].push(template);
    localStorage.setItem('volt_weekly_schedule', JSON.stringify(schedule));
    
    return true;
  }

  static async removeFromSchedule(templateId: string, dayOfWeek: string, userId?: string): Promise<boolean> {
    const stored = localStorage.getItem('volt_weekly_schedule');
    const schedule = stored ? JSON.parse(stored) : {};
    
    if (schedule[dayOfWeek]) {
      schedule[dayOfWeek] = schedule[dayOfWeek].filter((t: WorkoutTemplate) => t.id !== templateId);
      localStorage.setItem('volt_weekly_schedule', JSON.stringify(schedule));
    }
    
    return true;
  }

  static createWorkoutFromTemplate(template: WorkoutTemplate) {
    return {
      id: `workout-${Date.now()}`,
      name: template.name,
      focus: template.focus,
      duration_minutes: template.duration_minutes,
      started_at: new Date().toISOString(),
      exercises: template.workout_template_exercises?.map((ex, index) => ({
        id: ex.id,
        name: ex.exercises.name,
        sets: ex.sets,
        reps_target: ex.reps_target,
        primary_muscles: ex.exercises.primary_muscles,
        order_index: index + 1,
        completed: false,
        current_set: 1,
        set_logs: []
      })) || []
    };
  }

  static duplicateTemplate(template: WorkoutTemplate): WorkoutTemplate {
    return {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Cópia)`,
      completions: 0,
      is_public: false,
      rating: 0
    };
  }
}

export default WorkoutTemplateService;