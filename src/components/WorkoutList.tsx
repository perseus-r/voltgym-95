import { Check, Clock, Target, Plus, Dumbbell, Calendar } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CreatePlanDialog } from "./CreatePlanDialog";
import { Exercise } from "@/lib/api";
import { Plan, PlanExercise } from "@/types";
import { useWorkoutPersistence } from "@/hooks/useWorkoutPersistence";
import { toast } from "sonner";
import { seedExercises } from "@/data/seedData";

interface ExtendedExercise extends Exercise {
  completed?: boolean;
}

interface WorkoutListProps {
  focus?: string;
  exercises?: ExtendedExercise[];
  onSelectExercise?: (exerciseName: string, index: number) => void;
  onStartWorkout?: (workout: any) => void;
}

export function WorkoutList({ focus, exercises = [], onSelectExercise, onStartWorkout }: WorkoutListProps): JSX.Element {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [savedPlans, setSavedPlans] = useState<Plan[]>([]);
  const [plansData, setPlansData] = useState<Record<string, PlanExercise[]>>({});
  const { saveWorkoutSession } = useWorkoutPersistence();
  
  const completedCount = exercises.filter(ex => ex.completed).length;
  const hasExercises = exercises.length > 0;

  const getExerciseNameById = (id: string) => seedExercises.find(e => e.id === id)?.nome || id;

  const handleCreatePlan = async (plan: Plan, planExercises: PlanExercise[]) => {
    try {
      // Criar treino baseado no plano (compatível com WorkoutData)
      const workout = {
        id: plan.id,
        date: new Date().toISOString().split('T')[0],
        focus: plan.foco,
        exercises: planExercises.map(pe => ({
          name: getExerciseNameById(pe.exerciseId),
          sets: pe.series,
          reps: pe.reps,
          rest_s: pe.restSeg,
          weight: pe.pesoInicial
        }))
      };
      
      // Atualiza estado local
      setSavedPlans(prev => [...prev, plan]);
      setPlansData(prev => ({ ...prev, [plan.id]: planExercises }));

      // Persistência global para aparecer em /treinos também
      const existingPlans: Plan[] = JSON.parse(localStorage.getItem('bora_plans_v1') || '[]');
      const existingPlanExercises: PlanExercise[] = JSON.parse(localStorage.getItem('bora_plan_exercises_v1') || '[]');
      localStorage.setItem('bora_plans_v1', JSON.stringify([...existingPlans, plan]));
      localStorage.setItem('bora_plan_exercises_v1', JSON.stringify([...existingPlanExercises, ...planExercises]));

      toast.success("Plano de treino criado!");
      
      // Iniciar treino imediatamente se callback fornecido
      onStartWorkout?.(workout);
    } catch (error) {
      console.error('Erro ao criar plano:', error);
      toast.error("Erro ao criar plano de treino");
    }
  };

  const handleStartQuickWorkout = () => {
    const quickWorkout = {
      id: `quick-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      focus: "Treino Personalizado",
      exercises: [
        {
          name: "Supino Reto",
          sets: 3,
          reps: "8-12",
          rest_s: 90,
          weight: 0
        },
        {
          name: "Agachamento",
          sets: 3,
          reps: "10-12",
          rest_s: 90,
          weight: 0
        }
      ]
    };
    
    onStartWorkout?.(quickWorkout);
  };

  // Se não há exercícios, mostrar interface de criação
  if (!hasExercises) {
    return (
      <div className="glass-card p-6">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <Dumbbell className="w-8 h-8 text-accent" />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-txt mb-2">Nenhum Treino Ativo</h2>
            <p className="text-txt-2">Crie um plano de treino ou inicie um treino rápido</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md mx-auto">
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="bg-accent text-accent-ink hover:bg-accent/90 h-12"
            >
              <Plus className="w-5 h-5 mr-2" />
              Criar Plano
            </Button>
            
            <Button 
              variant="outline"
              onClick={handleStartQuickWorkout}
              className="glass-button h-12"
            >
              <Target className="w-5 h-5 mr-2" />
              Treino Rápido
            </Button>
          </div>

          {/* Planos salvos */}
          {savedPlans.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-txt mb-4">Seus Planos de Treino</h3>
              <div className="space-y-3">
                {savedPlans.map((plan) => (
                  <div key={plan.id} className="bg-surface p-4 rounded-lg flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-txt">{plan.nome}</h4>
                      <p className="text-sm text-txt-2">{plan.foco} • {plan.diasSemana}x por semana</p>
                    </div>
                    <Button 
                      size="sm"
                      className="bg-accent text-accent-ink"
                      onClick={() => {
                        const planExercises = plansData[plan.id];
                        if (!planExercises) {
                          toast.error('Não foi possível carregar os exercícios do plano');
                          return;
                        }
                        const workout = {
                          id: plan.id,
                          date: new Date().toISOString().split('T')[0],
                          focus: plan.foco,
                          exercises: planExercises.map(pe => ({
                            name: getExerciseNameById(pe.exerciseId),
                            sets: pe.series,
                            reps: pe.reps,
                            rest_s: pe.restSeg,
                            weight: pe.pesoInicial
                          }))
                        };
                        onStartWorkout?.(workout);
                      }}
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Iniciar
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <CreatePlanDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          onCreatePlan={handleCreatePlan}
        />
      </div>
    );
  }

  // Interface normal quando há exercícios
  return (
    <div className="glass-card p-4 md:p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold">Treino de Hoje</h2>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm">
              <Check className="w-4 h-4 text-accent" />
              <span className="text-accent font-semibold">{completedCount}/{exercises.length}</span>
            </div>
            <Button 
              variant="outline"
              onClick={() => setShowCreateDialog(true)}
              className="glass-button h-8 px-3 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Criar Treino
            </Button>
          </div>
        </div>
        <p className="text-txt-2">{focus} • {exercises.length} exercícios</p>
        
        {/* Progress bar */}
        <div className="w-full bg-surface rounded-full h-2 mt-3">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / exercises.length) * 100}%` }}
          />
        </div>
      </div>
      
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <div 
            key={index}
            className={`bg-surface p-4 rounded-custom hover:bg-card transition-all duration-300 group relative ${
              exercise.completed ? 'opacity-75 bg-accent/5 border border-accent/20' : ''
            }`}
          >
            {exercise.completed && (
              <div className="absolute top-2 right-2">
                <div className="w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-4 h-4 text-accent-ink" />
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className={`font-semibold mb-1 ${exercise.completed ? 'text-accent' : 'text-txt'}`}>
                  {exercise.name}
                </h3>
                <div className="flex items-center gap-4 text-sm text-txt-2">
                  <div className="flex items-center gap-1">
                    <Target className="w-3 h-3" />
                    <span>{exercise.sets} sets</span>
                  </div>
                  <span>•</span>
                  <span>{exercise.reps} reps</span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{exercise.rest_s}s</span>
      </div>

    </div>
                {exercise.weight && (
                  <div className="mt-2 text-sm">
                    <span className="text-accent font-medium">{exercise.weight}kg</span>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => onSelectExercise?.(exercise.name, index)}
                className={`btn-premium text-sm px-4 py-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity ${
                  exercise.completed ? 'opacity-50' : ''
                }`}
                disabled={exercise.completed}
              >
                {exercise.completed ? 'Concluído' : 'Dicas'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <CreatePlanDialog
        isOpen={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onCreatePlan={handleCreatePlan}
      />
    </div>
  );
}