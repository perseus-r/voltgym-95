import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Plus, Search, Filter, Clock, Target, Users, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { ImprovedWorkoutSession } from './ImprovedWorkoutSession';
import { useWorkoutCreator } from '@/hooks/useWorkoutCreator';

interface Workout {
  id: string;
  name: string;
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest_s: number;
    weight?: number;
  }>;
}

interface WorkoutSessionControllerProps {
  className?: string;
}

export function WorkoutSessionController({ className = '' }: WorkoutSessionControllerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFocus, setSelectedFocus] = useState<string | null>(null);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [sessionDialogOpen, setSessionDialogOpen] = useState(false);
  const [selectedWorkouts, setSelectedWorkouts] = useState<string[]>([]);
  
  const { templates, loadTemplates, deleteTemplate, getQuickWorkoutTemplates } = useWorkoutCreator();

  React.useEffect(() => {
    loadTemplates();
  }, []);

  // Combine templates with quick workouts
  const allWorkouts: Workout[] = [
    ...getQuickWorkoutTemplates(),
    ...templates
  ];

  const filteredWorkouts = allWorkouts.filter(workout => {
    const matchesSearch = !searchQuery || 
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.focus.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFocus = !selectedFocus || workout.focus === selectedFocus;
    
    return matchesSearch && matchesFocus;
  });

  const focusOptions = [...new Set(allWorkouts.map(w => w.focus))];

  const toggleWorkoutSelection = useCallback((workoutId: string) => {
    setSelectedWorkouts(prev => 
      prev.includes(workoutId)
        ? prev.filter(id => id !== workoutId)
        : [...prev, workoutId]
    );
  }, []);

  const clearSelections = useCallback(() => {
    setSelectedWorkouts([]);
  }, []);

  const startWorkout = useCallback((workout: Workout) => {
    setActiveWorkout(workout);
    setSessionDialogOpen(true);
    toast.success(`Iniciando treino: ${workout.name}`);
  }, []);

  const handleWorkoutComplete = useCallback(() => {
    setActiveWorkout(null);
    setSessionDialogOpen(false);
    toast.success('Treino concluído com sucesso! 💪');
  }, []);

  const handleDeleteSelected = useCallback(() => {
    selectedWorkouts.forEach(workoutId => {
      const workout = templates.find(t => t.id === workoutId);
      if (workout) {
        deleteTemplate(workoutId);
      }
    });
    setSelectedWorkouts([]);
    toast.success(`${selectedWorkouts.length} treino(s) removido(s)`);
  }, [selectedWorkouts, templates, deleteTemplate]);

  const createCombinedWorkout = useCallback(() => {
    if (selectedWorkouts.length < 2) {
      toast.error('Selecione pelo menos 2 treinos para combinar');
      return;
    }

    const combinedExercises = selectedWorkouts.flatMap(workoutId => {
      const workout = allWorkouts.find(w => w.id === workoutId);
      return workout?.exercises || [];
    });

    const combinedWorkout: Workout = {
      id: `combined-${Date.now()}`,
      name: `Treino Combinado (${selectedWorkouts.length} partes)`,
      focus: 'Corpo Inteiro',
      exercises: combinedExercises
    };

    startWorkout(combinedWorkout);
    clearSelections();
  }, [selectedWorkouts, allWorkouts, startWorkout, clearSelections]);

  if (activeWorkout && sessionDialogOpen) {
    return (
      <Dialog open={sessionDialogOpen} onOpenChange={setSessionDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Sessão de Treino</DialogTitle>
          </DialogHeader>
          <ImprovedWorkoutSession 
            workout={activeWorkout}
            onComplete={handleWorkoutComplete}
            onClose={() => setSessionDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header com controles */}
      <Card className="glass-card p-4">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-txt mb-1">Meus Treinos</h2>
            <p className="text-sm text-txt-2">
              {filteredWorkouts.length} treino(s) disponível(eis)
              {selectedWorkouts.length > 0 && ` • ${selectedWorkouts.length} selecionado(s)`}
            </p>
          </div>
          
          <div className="flex gap-2">
            {selectedWorkouts.length > 0 && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearSelections}
                >
                  Limpar Seleção
                </Button>
                <Button
                  variant="outline" 
                  size="sm"
                  onClick={handleDeleteSelected}
                  className="text-red-500 hover:text-red-400"
                >
                  Excluir ({selectedWorkouts.length})
                </Button>
                {selectedWorkouts.length >= 2 && (
                  <Button
                    size="sm"
                    onClick={createCombinedWorkout}
                    className="bg-gradient-to-r from-primary to-primary/80"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Combinar Treinos
                  </Button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-col md:flex-row gap-3 mt-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-3" />
            <Input
              placeholder="Buscar treinos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedFocus === null ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFocus(null)}
            >
              Todos
            </Button>
            {focusOptions.map(focus => (
              <Button
                key={focus}
                variant={selectedFocus === focus ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedFocus(focus)}
              >
                {focus}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* Lista de Treinos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filteredWorkouts.map((workout, index) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`glass-card p-4 cursor-pointer transition-all hover:scale-105 ${
                  selectedWorkouts.includes(workout.id) 
                    ? 'ring-2 ring-primary bg-primary/10' 
                    : ''
                }`}
                onClick={() => toggleWorkoutSelection(workout.id)}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-txt line-clamp-1">
                        {workout.name}
                      </h3>
                      <Badge variant="outline" className="text-xs mt-1">
                        {workout.focus}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-txt-2">
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {workout.exercises.length} exercícios
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      ~{Math.round(workout.exercises.length * 4)} min
                    </span>
                  </div>

                  <div className="space-y-1">
                    {workout.exercises.slice(0, 3).map((exercise, idx) => (
                      <div key={idx} className="text-xs text-txt-3 line-clamp-1">
                        • {exercise.name} - {exercise.sets}x{exercise.reps}
                      </div>
                    ))}
                    {workout.exercises.length > 3 && (
                      <div className="text-xs text-txt-3">
                        +{workout.exercises.length - 3} exercícios
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    className="w-full bg-gradient-to-r from-primary to-primary/80"
                    onClick={(e) => {
                      e.stopPropagation();
                      startWorkout(workout);
                    }}
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Treino
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredWorkouts.length === 0 && (
        <Card className="glass-card p-8 text-center">
          <TrendingUp className="w-12 h-12 text-txt-3 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-txt mb-2">
            Nenhum treino encontrado
          </h3>
          <p className="text-txt-2">
            {searchQuery || selectedFocus 
              ? 'Tente ajustar os filtros de busca'
              : 'Crie seu primeiro treino para começar'}
          </p>
        </Card>
      )}
    </div>
  );
}