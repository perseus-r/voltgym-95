import React, { useState, useEffect } from 'react';
import { Play, Edit3, Plus, Calendar, Target, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CreatePlanDialog } from '@/components/CreatePlanDialog';
import { Plan, PlanExercise, Exercise } from '@/types';
import { seedExercises } from '@/data/seedData';
import { toast } from "sonner";

interface WeeklyWorkoutScheduleProps {
  onStartWorkout: (workout: any) => void;
}

interface WeeklySchedule {
  [key: string]: Plan | null; // Segunda: Plan, Terça: Plan, etc.
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda', short: 'SEG' },
  { key: 'tuesday', label: 'Terça', short: 'TER' },
  { key: 'wednesday', label: 'Quarta', short: 'QUA' },
  { key: 'thursday', label: 'Quinta', short: 'QUI' },
  { key: 'friday', label: 'Sexta', short: 'SEX' },
  { key: 'saturday', label: 'Sábado', short: 'SÁB' },
  { key: 'sunday', label: 'Domingo', short: 'DOM' }
];

export function WeeklyWorkoutSchedule({ onStartWorkout }: WeeklyWorkoutScheduleProps) {
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklySchedule>({});
  const [availablePlans, setAvailablePlans] = useState<Plan[]>([]);
  const [planExercises, setPlanExercises] = useState<PlanExercise[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);

  useEffect(() => {
    loadWeeklySchedule();
    loadAvailablePlans();
  }, []);

  const loadWeeklySchedule = () => {
    const schedule = localStorage.getItem('bora_weekly_schedule_v1');
    if (schedule) {
      setWeeklySchedule(JSON.parse(schedule));
    }
  };

  const loadAvailablePlans = () => {
    const plans: Plan[] = JSON.parse(localStorage.getItem('bora_plans_v1') || '[]');
    const exercises: PlanExercise[] = JSON.parse(localStorage.getItem('bora_plan_exercises_v1') || '[]');
    setAvailablePlans(plans);
    setPlanExercises(exercises);
  };

  const saveWeeklySchedule = (schedule: WeeklySchedule) => {
    setWeeklySchedule(schedule);
    localStorage.setItem('bora_weekly_schedule_v1', JSON.stringify(schedule));
  };

  const assignPlanToDay = (dayKey: string, plan: Plan) => {
    const newSchedule = { ...weeklySchedule, [dayKey]: plan };
    saveWeeklySchedule(newSchedule);
    setSelectedDay(null);
    setShowAssignDialog(false);
    
    toast.success(`${plan.nome} agendado para ${DAYS_OF_WEEK.find(d => d.key === dayKey)?.label}!`);
  };

  const removePlanFromDay = (dayKey: string) => {
    const newSchedule = { ...weeklySchedule };
    delete newSchedule[dayKey];
    saveWeeklySchedule(newSchedule);
    
    toast.info(`Treino removido de ${DAYS_OF_WEEK.find(d => d.key === dayKey)?.label}`);
  };

  const startWorkoutForDay = (dayKey: string) => {
    const plan = weeklySchedule[dayKey];
    if (!plan) return;

    // Converter para formato de treino
    const planExs = planExercises
      .filter(pe => pe.planId === plan.id)
      .map(pe => {
        const exercise = seedExercises.find(e => e.id === pe.exerciseId);
        return { ...pe, exercise };
      });

    const workout = {
      id: `${plan.id}-${dayKey}-${Date.now()}`,
      focus: plan.foco,
      day: DAYS_OF_WEEK.find(d => d.key === dayKey)?.label,
      exercises: planExs.map((pe: any) => ({
        name: pe.exercise?.nome || pe.exerciseName || "Exercício",
        sets: pe.series || 3,
        reps: pe.reps || "8-10",
        rest_s: pe.restSeg || 90,
        id: pe.exerciseId
      }))
    };

    onStartWorkout(workout);
  };

  const getTodayWorkout = () => {
    const today = new Date().getDay();
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = dayKeys[today];
    return weeklySchedule[todayKey];
  };

  const todayWorkout = getTodayWorkout();
  const todayDayName = DAYS_OF_WEEK.find(d => d.key === Object.keys(weeklySchedule)[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1])?.label;

  return (
    <div className="space-y-6">
      {/* Today's Workout Highlight */}
      {todayWorkout && (
        <Card className="p-6 bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-txt mb-1">
                🎯 Treino de Hoje ({todayDayName})
              </h3>
              <p className="text-accent font-medium">{todayWorkout.nome}</p>
              <p className="text-sm text-txt-2">{todayWorkout.foco}</p>
            </div>
            <Button 
              onClick={() => startWorkoutForDay(Object.keys(weeklySchedule)[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1])}
              className="bg-accent text-accent-ink hover:bg-accent/90 px-6 py-3"
            >
              <Play className="w-4 h-4 mr-2" />
              Começar Agora
            </Button>
          </div>
        </Card>
      )}

      {/* Weekly Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3 md:gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const assignedPlan = weeklySchedule[day.key];
          const isToday = new Date().getDay() === (DAYS_OF_WEEK.indexOf(day) + 1) % 7;

          return (
            <Card 
              key={day.key} 
              className={`p-4 cursor-pointer transition-all hover:bg-surface/80 ${
                isToday ? 'ring-2 ring-accent bg-accent/5' : ''
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-txt text-sm">
                    {day.short}
                  </h4>
                  {isToday && (
                    <Badge variant="outline" className="text-xs mt-1 bg-accent/20 text-accent border-accent/30">
                      Hoje
                    </Badge>
                  )}
                </div>
                {assignedPlan && (
                  <button
                    onClick={() => removePlanFromDay(day.key)}
                    className="text-txt-3 hover:text-red-400 transition-colors"
                    title="Remover treino"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Plan Content */}
              {assignedPlan ? (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-medium text-txt text-sm">{assignedPlan.nome}</h5>
                    <p className="text-xs text-txt-2 line-clamp-2">{assignedPlan.foco}</p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-txt-3">
                    <Target className="w-3 h-3" />
                    {planExercises.filter(pe => pe.planId === assignedPlan.id).length} exercícios
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={() => startWorkoutForDay(day.key)}
                      size="sm"
                      className="flex-1 bg-accent/20 text-accent hover:bg-accent/30 text-xs py-1.5"
                    >
                      <Play className="w-3 h-3 mr-1" />
                      Iniciar
                    </Button>
                    <Button 
                      onClick={() => {
                        setSelectedDay(day.key);
                        setShowAssignDialog(true);
                      }}
                      size="sm"
                      variant="outline"
                      className="p-1.5"
                    >
                      <Edit3 className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="text-txt-3">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-xs">Nenhum treino</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setSelectedDay(day.key);
                      setShowAssignDialog(true);
                    }}
                    size="sm"
                    variant="outline"
                    className="w-full text-xs py-1.5"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Adicionar
                  </Button>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3">
        <Button 
          onClick={() => setShowCreateDialog(true)}
          className="flex-1 bg-accent text-accent-ink hover:bg-accent/90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Criar Novo Plano
        </Button>
        <Button 
          variant="outline"
          className="px-6"
          onClick={() => {
            // Auto-assign plans to empty days
            const emptyDays = DAYS_OF_WEEK.filter(day => !weeklySchedule[day.key]);
            if (emptyDays.length > 0 && availablePlans.length > 0) {
              const newSchedule = { ...weeklySchedule };
              emptyDays.forEach((day, index) => {
                if (availablePlans[index % availablePlans.length]) {
                  newSchedule[day.key] = availablePlans[index % availablePlans.length];
                }
              });
              saveWeeklySchedule(newSchedule);
              toast.success('Treinos distribuídos automaticamente!');
            }
          }}
        >
          🎲 Auto-Agendar
        </Button>
      </div>

      {/* Assign Plan Dialog */}
      {showAssignDialog && selectedDay && (
        <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Escolher treino para {DAYS_OF_WEEK.find(d => d.key === selectedDay)?.label}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {availablePlans.map((plan) => (
                <Card 
                  key={plan.id}
                  className="p-4 cursor-pointer hover:bg-accent/10 transition-colors"
                  onClick={() => assignPlanToDay(selectedDay, plan)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-txt">{plan.nome}</h4>
                      <p className="text-sm text-txt-2">{plan.foco}</p>
                      <p className="text-xs text-txt-3">
                        {planExercises.filter(pe => pe.planId === plan.id).length} exercícios
                      </p>
                    </div>
                    <Button size="sm">
                      Escolher
                    </Button>
                  </div>
                </Card>
              ))}
              
              {availablePlans.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-txt-2 mb-4">Nenhum plano disponível</p>
                  <Button onClick={() => {
                    setShowAssignDialog(false);
                    setShowCreateDialog(true);
                  }}>
                    Criar Primeiro Plano
                  </Button>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Plan Dialog */}
      <CreatePlanDialog 
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreatePlan={(newPlan: Plan, newPlanExercises: PlanExercise[]) => {
          // Add to available plans
          const updatedPlans = [...availablePlans, newPlan];
          const updatedPlanExs = [...planExercises, ...newPlanExercises];
          
          setAvailablePlans(updatedPlans);
          setPlanExercises(updatedPlanExs);
          
          // Save to localStorage
          localStorage.setItem('bora_plans_v1', JSON.stringify(updatedPlans));
          localStorage.setItem('bora_plan_exercises_v1', JSON.stringify(updatedPlanExs));
          
          toast.success(`${newPlan.nome} criado com sucesso!`);
        }}
      />
    </div>
  );
}