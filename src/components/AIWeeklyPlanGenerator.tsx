import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Brain, Target, Zap, Calendar, Dumbbell, Clock, CheckCircle, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { seedExercises } from '@/data/seedData';

interface MuscleGroupConfig {
  name: string;
  exercises: string[];
  volume: 'low' | 'medium' | 'high';
  frequency: number; // days per week
}

interface WeeklyPlan {
  [key: string]: {
    id: string;
    nome: string;
    foco: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest_s: number;
      weight?: number;
    }>;
    aiReasoning: string;
  } | null;
}

const MUSCLE_GROUPS: MuscleGroupConfig[] = [
  {
    name: 'Peito',
    exercises: ['Supino Reto', 'Supino Inclinado', 'Flexão', 'Crucifixo', 'Paralelas'],
    volume: 'medium',
    frequency: 2
  },
  {
    name: 'Costas',
    exercises: ['Barra Fixa', 'Remada Curvada', 'Puxada Alta', 'Remada Unilateral', 'Levantamento Terra'],
    volume: 'high',
    frequency: 2
  },
  {
    name: 'Pernas',
    exercises: ['Agachamento', 'Leg Press', 'Stiff', 'Afundo', 'Panturrilha'],
    volume: 'high',
    frequency: 2
  },
  {
    name: 'Ombros',
    exercises: ['Desenvolvimento', 'Elevação Lateral', 'Elevação Frontal', 'Remada Alta', 'Crucifixo Inverso'],
    volume: 'medium',
    frequency: 2
  },
  {
    name: 'Bíceps',
    exercises: ['Rosca Direta', 'Rosca Martelo', 'Rosca Concentrada', 'Rosca Scott'],
    volume: 'low',
    frequency: 2
  },
  {
    name: 'Tríceps',
    exercises: ['Tríceps Testa', 'Mergulho', 'Tríceps Corda', 'Tríceps Coice'],
    volume: 'low',
    frequency: 2
  }
];

const DAYS_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAYS_LABELS = {
  monday: 'Segunda',
  tuesday: 'Terça', 
  wednesday: 'Quarta',
  thursday: 'Quinta',
  friday: 'Sexta',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

export function AIWeeklyPlanGenerator() {
  const [selectedGroups, setSelectedGroups] = useState<string[]>(['Peito', 'Costas', 'Pernas']);
  const [trainingDays, setTrainingDays] = useState(4);
  const [experienceLevel, setExperienceLevel] = useState('intermediate');
  const [goal, setGoal] = useState('muscle');
  const [generatedPlan, setGeneratedPlan] = useState<WeeklyPlan>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  const handleGroupToggle = (groupName: string) => {
    if (selectedGroups.includes(groupName)) {
      setSelectedGroups(prev => prev.filter(g => g !== groupName));
    } else {
      setSelectedGroups(prev => [...prev, groupName]);
    }
  };

  const generateAIWeeklyPlan = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate AI thinking time
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const plan: WeeklyPlan = {};
      const availableDays = DAYS_ORDER.slice(0, trainingDays);
      
      // Strategy: Distribute muscle groups across available days
      const workoutSplits = createWorkoutSplits(selectedGroups, trainingDays, experienceLevel);
      
      availableDays.forEach((day, index) => {
        if (workoutSplits[index]) {
          const split = workoutSplits[index];
          const exercises = generateExercisesForSplit(split, experienceLevel, goal);
          
          plan[day] = {
            id: `ai-${day}-${Date.now()}`,
            nome: `AI ${split.focus}`,
            foco: split.focus,
            exercises,
            aiReasoning: split.reasoning
          };
        }
      });
      
      setGeneratedPlan(plan);
      toast.success('🤖 Plano semanal gerado pela IA!');
    } catch (error) {
      toast.error('Erro ao gerar plano');
    } finally {
      setIsGenerating(false);
    }
  };

  const createWorkoutSplits = (groups: string[], days: number, level: string) => {
    const splits = [];
    
    if (days <= 3) {
      // Full body splits
      for (let i = 0; i < days; i++) {
        splits.push({
          focus: 'Full Body',
          groups: groups,
          reasoning: `Treino full body ${i + 1} - ideal para ${level}s com ${days} dias disponíveis`
        });
      }
    } else if (days <= 4) {
      // Upper/Lower split
      const upperGroups = groups.filter(g => ['Peito', 'Costas', 'Ombros', 'Bíceps', 'Tríceps'].includes(g));
      const lowerGroups = groups.filter(g => ['Pernas'].includes(g));
      
      splits.push({
        focus: 'Membros Superiores',
        groups: upperGroups,
        reasoning: 'Foco em membros superiores para desenvolvimento equilibrado'
      });
      splits.push({
        focus: 'Membros Inferiores',
        groups: [...lowerGroups, 'Core'],
        reasoning: 'Treino de pernas intenso com trabalho de core'
      });
      splits.push({
        focus: 'Push (Empurrar)',
        groups: ['Peito', 'Ombros', 'Tríceps'],
        reasoning: 'Movimentos de empurrar para força e hipertrofia'
      });
      splits.push({
        focus: 'Pull (Puxar)',
        groups: ['Costas', 'Bíceps'],
        reasoning: 'Movimentos de puxar para equilibrar o desenvolvimento'
      });
    } else {
      // Push/Pull/Legs split
      const pushGroups = ['Peito', 'Ombros', 'Tríceps'];
      const pullGroups = ['Costas', 'Bíceps'];
      const legGroups = ['Pernas'];
      
      splits.push({
        focus: 'Push (Empurrar)',
        groups: pushGroups.filter(g => groups.includes(g)),
        reasoning: 'Dia de empurrar - peitoral, ombros e tríceps'
      });
      splits.push({
        focus: 'Pull (Puxar)', 
        groups: pullGroups.filter(g => groups.includes(g)),
        reasoning: 'Dia de puxar - costas e bíceps'
      });
      splits.push({
        focus: 'Legs (Pernas)',
        groups: legGroups.filter(g => groups.includes(g)),
        reasoning: 'Dia de pernas completo'
      });
      
      // Add additional days if needed
      while (splits.length < days) {
        splits.push({
          focus: 'Upper Body',
          groups: [...pushGroups, ...pullGroups].filter(g => groups.includes(g)),
          reasoning: 'Dia adicional de membros superiores'
        });
      }
    }
    
    return splits.slice(0, days);
  };

  const generateExercisesForSplit = (split: any, level: string, goal: string) => {
    const exercises = [];
    const volumeMultipliers = {
      beginner: { sets: 3, reps: '10-12' },
      intermediate: { sets: 4, reps: '8-10' },
      advanced: { sets: 5, reps: '6-8' }
    };
    
    const multiplier = volumeMultipliers[level as keyof typeof volumeMultipliers] || volumeMultipliers.intermediate;
    
    split.groups.forEach((groupName: string) => {
      const group = MUSCLE_GROUPS.find(g => g.name === groupName);
      if (group) {
        // Select 2-3 exercises per muscle group
        const exerciseCount = group.volume === 'high' ? 3 : 2;
        const selectedExercises = group.exercises.slice(0, exerciseCount);
        
        selectedExercises.forEach((exerciseName, index) => {
          const sets = index === 0 ? multiplier.sets : multiplier.sets - 1; // Main exercise gets more sets
          const reps = goal === 'strength' ? '4-6' : 
                      goal === 'power' ? '3-5' : 
                      multiplier.reps;
          
          exercises.push({
            name: exerciseName,
            sets,
            reps,
            rest_s: goal === 'strength' ? 180 : goal === 'power' ? 120 : 90,
            weight: 0
          });
        });
      }
    });
    
    return exercises;
  };

  const applyPlanToSchedule = () => {
    // Save to weekly schedule
    const existingSchedule = JSON.parse(localStorage.getItem('bora_weekly_schedule_v1') || '{}');
    const mergedSchedule = { ...existingSchedule, ...generatedPlan };
    
    localStorage.setItem('bora_weekly_schedule_v1', JSON.stringify(mergedSchedule));
    localStorage.setItem('bora_ai_generated_plan', JSON.stringify(generatedPlan));
    
    setIsApplied(true);
    toast.success('🎯 Plano aplicado ao cronograma semanal!');
  };

  const resetPlan = () => {
    setGeneratedPlan({});
    setIsApplied(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent-2 rounded-xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-accent-ink" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-txt">Gerador de Plano Semanal IA</h2>
            <p className="text-txt-2">Criação automática por grupo muscular</p>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <Card className="liquid-glass p-6 border border-accent/20">
        <h3 className="text-xl font-semibold text-txt mb-4 flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Configurações do Plano
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="text-sm font-medium text-txt-2 mb-2 block">Dias de Treino</label>
            <Select value={trainingDays.toString()} onValueChange={(v) => setTrainingDays(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 dias/semana</SelectItem>
                <SelectItem value="4">4 dias/semana</SelectItem>
                <SelectItem value="5">5 dias/semana</SelectItem>
                <SelectItem value="6">6 dias/semana</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-txt-2 mb-2 block">Nível de Experiência</label>
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Iniciante</SelectItem>
                <SelectItem value="intermediate">Intermediário</SelectItem>
                <SelectItem value="advanced">Avançado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="text-sm font-medium text-txt-2 mb-2 block">Objetivo Principal</label>
            <Select value={goal} onValueChange={setGoal}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="muscle">Hipertrofia</SelectItem>
                <SelectItem value="strength">Força</SelectItem>
                <SelectItem value="power">Potência</SelectItem>
                <SelectItem value="endurance">Resistência</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Muscle Group Selection */}
        <div className="mb-6">
          <label className="text-sm font-medium text-txt-2 mb-3 block">Grupos Musculares</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {MUSCLE_GROUPS.map((group) => (
              <div key={group.name} className="flex items-center space-x-2">
                <Checkbox
                  id={group.name}
                  checked={selectedGroups.includes(group.name)}
                  onCheckedChange={() => handleGroupToggle(group.name)}
                />
                <label
                  htmlFor={group.name}
                  className="text-sm font-medium text-txt cursor-pointer"
                >
                  {group.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <Button 
          onClick={generateAIWeeklyPlan}
          disabled={isGenerating || selectedGroups.length === 0}
          className="w-full bg-gradient-to-r from-accent to-accent-2 text-accent-ink font-semibold"
        >
          {isGenerating ? (
            <Brain className="w-4 h-4 mr-2 animate-pulse" />
          ) : (
            <Zap className="w-4 h-4 mr-2" />
          )}
          {isGenerating ? 'Gerando Plano Inteligente...' : 'Gerar Plano Semanal com IA'}
        </Button>
      </Card>

      {/* Generated Plan Preview */}
      {Object.keys(generatedPlan).length > 0 && (
        <Card className="liquid-glass p-6 border border-accent/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-txt flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Plano Gerado pela IA
            </h3>
            
            <div className="flex gap-2">
              <Button 
                onClick={applyPlanToSchedule}
                disabled={isApplied}
                className="bg-accent text-accent-ink hover:bg-accent/90"
              >
                {isApplied ? (
                  <CheckCircle className="w-4 h-4 mr-2" />
                ) : (
                  <Target className="w-4 h-4 mr-2" />
                )}
                {isApplied ? 'Aplicado!' : 'Aplicar ao Cronograma'}
              </Button>
              
              <Button variant="outline" onClick={resetPlan} className="glass-button">
                Gerar Novo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {DAYS_ORDER.map((day) => {
              const workout = generatedPlan[day];
              
              return (
                <Card key={day} className={`liquid-glass p-4 ${workout ? 'border-accent/30' : 'border-gray-400/20'}`}>
                  <div className="mb-3">
                    <h4 className="font-semibold text-txt">{DAYS_LABELS[day as keyof typeof DAYS_LABELS]}</h4>
                    {workout ? (
                      <div>
                        <p className="text-sm text-accent font-medium">{workout.nome}</p>
                        <p className="text-xs text-txt-2">{workout.foco}</p>
                      </div>
                    ) : (
                      <p className="text-xs text-txt-3">Descanso</p>
                    )}
                  </div>

                  {workout && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1 text-xs text-txt-3 mb-2">
                        <Dumbbell className="w-3 h-3" />
                        {workout.exercises.length} exercícios
                      </div>
                      
                      {workout.exercises.slice(0, 3).map((ex, idx) => (
                        <div key={idx} className="text-xs">
                          <div className="flex justify-between">
                            <span className="text-txt-2">{ex.name}</span>
                            <span className="text-txt-3">{ex.sets}x{ex.reps}</span>
                          </div>
                        </div>
                      ))}
                      
                      {workout.exercises.length > 3 && (
                        <p className="text-xs text-txt-3">+{workout.exercises.length - 3} mais...</p>
                      )}
                      
                      {/* AI Reasoning */}
                      <div className="mt-3 p-2 bg-accent/5 rounded border border-accent/10">
                        <div className="flex items-start gap-1">
                          <Brain className="w-3 h-3 text-accent mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-txt-2">{workout.aiReasoning}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </Card>
      )}

      {/* Applied Plan Status */}
      {isApplied && (
        <Card className="liquid-glass p-4 border border-green-400/30 bg-green-400/10">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-green-400" />
            <div>
              <p className="font-medium text-txt">Plano Aplicado com Sucesso!</p>
              <p className="text-sm text-txt-2">
                O plano gerado pela IA foi integrado ao seu cronograma semanal. 
                Você pode agora iniciar os treinos diretamente do painel principal.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}