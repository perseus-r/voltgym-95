import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { seedExercises } from '@/data/seedData';
import { toast } from 'sonner';
import { Plus, X, Save, Dumbbell, Target, Clock, Zap, Heart, Layers, Activity, TrendingUp, Flame, Timer } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { WorkoutPersistenceService } from '@/services/WorkoutPersistenceService';

interface Exercise {
  id?: string;
  name?: string;
  nome?: string;
  grupo?: string;
  dicaCurta?: string;
}

interface CustomExercise {
  id: string;
  exercise: Exercise;
  sets: number;
  reps: string;
  weight: number;
  rest: number;
  notes: string;
}

interface CustomWorkoutBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (workout: any) => void;
}

export function CustomWorkoutBuilder({ isOpen, onClose, onSave }: CustomWorkoutBuilderProps) {
  const { user } = useAuth();
  const [workoutName, setWorkoutName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('peito');
  const [selectedExercises, setSelectedExercises] = useState<CustomExercise[]>([]);
  const [exerciseLibrary, setExerciseLibrary] = useState<Exercise[]>([]);

  const muscleGroups = [
    { id: 'peito', name: 'Peito', color: 'from-red-500 to-pink-500', icon: Heart },
    { id: 'costas', name: 'Costas', color: 'from-blue-500 to-cyan-500', icon: Layers },
    { id: 'ombros', name: 'Ombros', color: 'from-yellow-500 to-orange-500', icon: Target },
    { id: 'biceps', name: 'Bíceps', color: 'from-green-500 to-emerald-500', icon: Zap },
    { id: 'triceps', name: 'Tríceps', color: 'from-purple-500 to-pink-500', icon: Activity },
    { id: 'pernas', name: 'Pernas', color: 'from-indigo-500 to-purple-500', icon: TrendingUp },
    { id: 'gluteos', name: 'Glúteos', color: 'from-pink-500 to-rose-500', icon: Target },
    { id: 'core', name: 'Core', color: 'from-orange-500 to-red-500', icon: Flame },
    { id: 'panturrilha', name: 'Panturrilha', color: 'from-teal-500 to-cyan-500', icon: Timer }
  ];

  useEffect(() => {
    setExerciseLibrary(seedExercises);
  }, []);

  const filteredExercises = exerciseLibrary.filter(ex => ex.grupo === selectedGroup && ex.nome);

  const addExercise = (exercise: Exercise) => {
    const newExercise: CustomExercise = {
      id: `custom_${Date.now()}_${exercise.id || exercise.nome}`,
      exercise,
      sets: 3,
      reps: '8-12',
      weight: 20,
      rest: 90,
      notes: ''
    };
    setSelectedExercises([...selectedExercises, newExercise]);
    toast.success(`💪 ${exercise.nome || exercise.name} adicionado!`);
  };

  const removeExercise = (id: string) => {
    setSelectedExercises(selectedExercises.filter(ex => ex.id !== id));
  };

  const updateExercise = (id: string, field: keyof CustomExercise, value: any) => {
    setSelectedExercises(selectedExercises.map(ex => 
      ex.id === id ? { ...ex, [field]: value } : ex
    ));
  };

  const saveCustomWorkout = async () => {
    if (!workoutName.trim()) {
      toast.error('Digite um nome para o treino!');
      return;
    }

    if (selectedExercises.length === 0) {
      toast.error('Adicione pelo menos um exercício!');
      return;
    }

    console.log('🔄 Iniciando salvamento do treino:', workoutName);

    const workoutData = {
      name: workoutName,
      focus: `Treino Custom - ${muscleGroups.find(g => g.id === selectedGroup)?.name || 'Personalizado'}`,
      exercises: selectedExercises.map(ex => ({
        name: ex.exercise.nome || ex.exercise.name || 'Exercício',
        weight: ex.weight,
        reps: ex.reps,
        rpe: 7, // Default RPE
        notes: ex.notes,
        sets: ex.sets,
        rest: ex.rest
      }))
    };

    // Use the callback to notify parent
    onSave(workoutData);
    onClose();
    
    // Reset form
    setWorkoutName('');
    setSelectedExercises([]);
  };

  const startCustomWorkout = async () => {
    if (selectedExercises.length === 0) {
      toast.error('Adicione exercícios primeiro!');
      return;
    }

    console.log('🔥 Iniciando treino personalizado');

    const workoutData = {
      name: workoutName || `Treino Custom - ${muscleGroups.find(g => g.id === selectedGroup)?.name || 'Personalizado'}`,
      focus: `Treino Custom - ${muscleGroups.find(g => g.id === selectedGroup)?.name || 'Personalizado'}`,
      exercises: selectedExercises.map(ex => ({
        name: ex.exercise.nome || ex.exercise.name || 'Exercício',
        weight: ex.weight,
        reps: ex.reps,
        rpe: 7, // Default RPE
        notes: ex.notes || 'Treino personalizado iniciado',
        sets: ex.sets,
        rest: ex.rest
      }))
    };

    // Use callback to start workout
    onSave(workoutData);
    onClose();
    
    // Reset form
    setWorkoutName('');
    setSelectedExercises([]);
    
    toast.success(`🔥 Treino iniciado! Bora quebrar tudo!`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 rounded-xl bg-gradient-to-r from-accent to-accent-2">
              <Target className="w-6 h-6 text-accent-ink" />
            </div>
            Criar Treino Personalizado
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Workout Name */}
          <div className="space-y-2">
            <Label className="text-txt font-semibold">Nome do Treino</Label>
            <Input
              placeholder="Ex: Peito Destruidor, Costas Monster..."
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="text-lg p-4"
            />
          </div>

          {/* Muscle Group Selection */}
          <div className="space-y-4">
            <Label className="text-txt font-semibold text-lg">Escolha o Grupo Muscular</Label>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {muscleGroups.map(group => {
                const IconComponent = group.icon;
                return (
                  <button
                    key={group.id}
                    onClick={() => setSelectedGroup(group.id)}
                    className={`p-4 rounded-xl font-medium transition-all duration-300 flex items-center gap-2 ${
                      selectedGroup === group.id
                        ? 'bg-gradient-to-r ' + group.color + ' text-white scale-105 shadow-lg'
                        : 'bg-surface border border-line text-txt-2 hover:bg-surface/80'
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{group.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Exercise Library */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-5 h-5 text-accent" />
                <Label className="text-txt font-semibold text-lg">
                  Biblioteca de Exercícios ({filteredExercises.length})
                </Label>
              </div>
              
              <div className="space-y-3 max-h-96 overflow-y-auto p-2">
                {filteredExercises.map(exercise => (
                  <Card key={exercise.id} className="p-4 hover:bg-surface/80 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-txt">{exercise.nome || exercise.name}</h4>
                        <p className="text-sm text-txt-2 mt-1">{exercise.dicaCurta || 'Exercício para fortalecimento'}</p>
                        <Badge variant="outline" className="mt-2 text-xs">
                          {exercise.grupo || 'geral'}
                        </Badge>
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addExercise(exercise)}
                        className="ml-4"
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Selected Exercises */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-accent" />
                <Label className="text-txt font-semibold text-lg">
                  Seus Exercícios ({selectedExercises.length})
                </Label>
              </div>

              {selectedExercises.length === 0 ? (
                <div className="border-2 border-dashed border-line rounded-xl p-8 text-center">
                  <Dumbbell className="w-12 h-12 text-txt-3 mx-auto mb-4" />
                  <p className="text-txt-2">Selecione exercícios da biblioteca</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {selectedExercises.map((item, index) => (
                    <Card key={item.id} className="p-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-txt">
                              {index + 1}. {item.exercise.nome || item.exercise.name}
                            </h4>
                            <p className="text-sm text-txt-2">{item.exercise.dicaCurta || 'Exercício selecionado'}</p>
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => removeExercise(item.id)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          <div>
                            <Label className="text-xs text-txt-3">Séries</Label>
                            <Input
                              type="number"
                              value={item.sets}
                              onChange={(e) => updateExercise(item.id, 'sets', parseInt(e.target.value))}
                              className="text-sm"
                              min="1"
                              max="10"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-txt-3">Reps</Label>
                            <Input
                              value={item.reps}
                              onChange={(e) => updateExercise(item.id, 'reps', e.target.value)}
                              placeholder="8-12"
                              className="text-sm"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-txt-3">Carga (kg)</Label>
                            <Input
                              type="number"
                              value={item.weight}
                              onChange={(e) => updateExercise(item.id, 'weight', parseFloat(e.target.value))}
                              className="text-sm"
                              min="0"
                              step="2.5"
                            />
                          </div>
                          <div>
                            <Label className="text-xs text-txt-3">Descanso (s)</Label>
                            <Input
                              type="number"
                              value={item.rest}
                              onChange={(e) => updateExercise(item.id, 'rest', parseInt(e.target.value))}
                              className="text-sm"
                              min="30"
                              max="300"
                              step="15"
                            />
                          </div>
                        </div>

                        <div>
                          <Label className="text-xs text-txt-3">Notas</Label>
                          <Input
                            value={item.notes}
                            onChange={(e) => updateExercise(item.id, 'notes', e.target.value)}
                            placeholder="Observações sobre o exercício..."
                            className="text-sm"
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button
            onClick={saveCustomWorkout}
            className="bg-gradient-to-r from-accent to-accent-2"
          >
            <Save className="w-4 h-4 mr-2" />
            Salvar Treino
          </Button>
          <Button
            onClick={startCustomWorkout}
            className="bg-gradient-to-r from-green-500 to-emerald-500"
          >
            <Zap className="w-4 h-4 mr-2" />
            Iniciar Agora!
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}