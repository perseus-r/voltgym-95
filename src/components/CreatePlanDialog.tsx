import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Target, Calendar, Dumbbell, Zap, Settings } from 'lucide-react';
import { Plan, Exercise, PlanExercise } from '@/types';
import { seedExercises } from '@/data/seedData';

interface CreatePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePlan: (plan: Plan, planExercises: PlanExercise[]) => void;
}

export function CreatePlanDialog({ isOpen, onClose, onCreatePlan }: CreatePlanDialogProps) {
  const [planData, setPlanData] = useState({
    nome: '',
    foco: '',
    diasSemana: 3,
    descricao: ''
  });
  
  const [selectedExercises, setSelectedExercises] = useState<Array<{
    exerciseId: string;
    series: number;
    reps: string;
    pesoInicial: number;
    restSeg: number;
  }>>([]);
  
  const [currentExercise, setCurrentExercise] = useState({
    exerciseId: '',
    series: 3,
    reps: '8-12',
    pesoInicial: 0,
    restSeg: 60
  });

  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  
  // Vincula chips de grupo à aba "Seleção Rápida"
  const handleToggleGroup = (group: string) => {
    setSelectedGroups(prev => {
      const isActive = prev.includes(group);
      const next = isActive ? prev.filter(g => g !== group) : [...prev, group];

      if (!isActive) {
        setSelectedGroupFilter(group);
        setActiveTab("quick");
      } else {
        if (next.length === 0) {
          setSelectedGroupFilter("todos");
        } else if (selectedGroupFilter === group) {
          setSelectedGroupFilter(next[next.length - 1]);
        }
      }
      return next;
    });
  };
  
  // Estado para seleção rápida de múltiplos exercícios
  const [quickSelection, setQuickSelection] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>("quick");
  const [selectedGroupFilter, setSelectedGroupFilter] = useState<string>("todos");

  const exercisesByGroup = seedExercises.reduce((acc, exercise) => {
    if (!acc[exercise.grupo]) {
      acc[exercise.grupo] = [];
    }
    acc[exercise.grupo].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const focusOptions = [
    'Upper Body', 'Lower Body', 'Push Power', 'Pull Domination', 
    'Leg Crusher', 'Full Body', 'Força', 'Hipertrofia', 'Resistência',
    'Mobilidade', 'Cardio', 'Funcional'
  ];

  // Grupos disponíveis para filtro
  const availableGroups = Object.keys(exercisesByGroup);
  
  // Exercícios filtrados para seleção rápida
  const filteredExercisesForQuick = React.useMemo(() => {
    if (selectedGroupFilter === "todos") {
      return exercisesByGroup;
    } else {
      const groupExercises = exercisesByGroup[selectedGroupFilter];
      return groupExercises ? { [selectedGroupFilter]: groupExercises } : {};
    }
  }, [selectedGroupFilter, exercisesByGroup]);

  const addExercise = () => {
    if (!currentExercise.exerciseId) return;
    
    setSelectedExercises([...selectedExercises, { ...currentExercise }]);
    setCurrentExercise({
      exerciseId: '',
      series: 3,
      reps: '8-12',
      pesoInicial: 0,
      restSeg: 60
    });
  };

  // Adicionar exercícios da seleção rápida
  const addQuickSelection = () => {
    const newExercises = quickSelection.map(exerciseId => ({
      exerciseId,
      series: 3,
      reps: '8-12',
      pesoInicial: 0,
      restSeg: 90
    }));
    
    setSelectedExercises([...selectedExercises, ...newExercises]);
    setQuickSelection([]);
  };

  // Toggle exercício na seleção rápida
  const toggleQuickSelection = (exerciseId: string) => {
    setQuickSelection(prev => 
      prev.includes(exerciseId) 
        ? prev.filter(id => id !== exerciseId)
        : [...prev, exerciseId]
    );
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleCreate = () => {
    if (!planData.nome || selectedExercises.length === 0) {
      return;
    }

    const focoFinal = planData.foco || (selectedGroups.length ? selectedGroups.join(' / ') : 'Personalizado');

    const newPlan: Plan = {
      id: `plan-${Date.now()}`,
      nome: planData.nome,
      foco: focoFinal,
      diasSemana: planData.diasSemana || Math.max(2, selectedGroups.length || 3),
      createdAt: new Date().toISOString()
    };

    const newPlanExercises: PlanExercise[] = selectedExercises.map((ex, index) => ({
      id: `plan-ex-${Date.now()}-${index}`,
      planId: newPlan.id,
      exerciseId: ex.exerciseId,
      series: ex.series,
      reps: ex.reps,
      pesoInicial: ex.pesoInicial,
      restSeg: ex.restSeg
    }));

    onCreatePlan(newPlan, newPlanExercises);
    
    // Reset form
    setPlanData({ nome: '', foco: '', diasSemana: 3, descricao: '' });
    setSelectedExercises([]);
    setQuickSelection([]);
    setSelectedGroupFilter("todos");
    setActiveTab("quick");
    onClose();
  };

  const getExerciseName = (exerciseId: string) => {
    return seedExercises.find(ex => ex.id === exerciseId)?.nome || '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Criar Novo Plano de Treino
          </DialogTitle>
          <DialogDescription>
            Preencha o nome, selecione os grupos da semana e adicione exercícios. Todos os campos são editáveis.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Plan Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do Plano</Label>
              <Input
                id="nome"
                placeholder="Ex: Push Intenso"
                value={planData.nome}
                onChange={(e) => setPlanData({ ...planData, nome: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="foco">Foco Principal</Label>
              <Select 
                value={planData.foco} 
                onValueChange={(value) => setPlanData({ ...planData, foco: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o foco" />
                </SelectTrigger>
                <SelectContent>
                  {focusOptions.map(focus => (
                    <SelectItem key={focus} value={focus}>{focus}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dias">Dias por Semana</Label>
              <Select 
                value={planData.diasSemana.toString()} 
                onValueChange={(value) => setPlanData({ ...planData, diasSemana: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[2, 3, 4, 5, 6].map(dias => (
                    <SelectItem key={dias} value={dias.toString()}>
                      {dias}x por semana
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (Opcional)</Label>
              <Textarea
                id="descricao"
                placeholder="Descreva o objetivo do plano..."
                value={planData.descricao}
                onChange={(e) => setPlanData({ ...planData, descricao: e.target.value })}
                className="min-h-[80px]"
              />
            </div>
          </div>

          {/* Weekly Groups Selection */}
          <div className="space-y-3">
            <Label className="text-sm">Grupos da semana (opcional)</Label>
            <div className="flex flex-wrap gap-2">
              {Object.keys(exercisesByGroup).map((group) => {
                const active = selectedGroups.includes(group);
                return (
                  <button
                    key={group}
                    type="button"
                    onClick={() => handleToggleGroup(group)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-colors ${
                      active ? 'bg-accent text-accent-ink border-accent' : 'bg-surface border-line text-txt-2 hover:bg-surface/80'
                    }`}
                  >
                    {group}
                  </button>
                );
              })}
            </div>
            {selectedGroups.length > 0 && (
              <div className="text-xs text-txt-3">Selecionados: {selectedGroups.join(' / ')}</div>
            )}
          </div>

          {/* Add Exercises Section with Tabs */}
          <div className="border border-border rounded-lg p-4 space-y-4">
            <h3 className="font-medium flex items-center gap-2">
              <Dumbbell className="w-4 h-4" />
              Adicionar Exercícios
            </h3>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="quick" className="flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Seleção Rápida
                </TabsTrigger>
                <TabsTrigger value="detailed" className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Configuração Detalhada
                </TabsTrigger>
              </TabsList>

              {/* Quick Selection Tab */}
              <TabsContent value="quick" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Selecione múltiplos exercícios (3 séries, 8-12 reps, 90s rest por padrão)
                  </div>
                  <Select value={selectedGroupFilter} onValueChange={setSelectedGroupFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os grupos</SelectItem>
                      {availableGroups.map(group => (
                        <SelectItem key={group} value={group}>
                          {group.charAt(0).toUpperCase() + group.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {Object.entries(filteredExercisesForQuick).length > 0 ? (
                  Object.entries(filteredExercisesForQuick).map(([group, exercises]) => (
                    <div key={group} className="space-y-2">
                      <Label className="text-sm font-medium text-primary">{group.toUpperCase()}</Label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {exercises.map(exercise => (
                          <label key={exercise.id} className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm cursor-pointer transition-colors ${
                            quickSelection.includes(exercise.id!) 
                              ? 'border-accent bg-accent/10 text-accent' 
                              : 'border-muted hover:border-muted-foreground/50'
                          }`}>
                            <Checkbox 
                              checked={quickSelection.includes(exercise.id!)} 
                              onCheckedChange={() => toggleQuickSelection(exercise.id!)} 
                            />
                            <span className="flex-1">{exercise.nome}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    Nenhum exercício encontrado para este grupo
                  </div>
                )}

                {quickSelection.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm text-muted-foreground">
                      {quickSelection.length} exercício(s) selecionado(s)
                    </div>
                    <Button onClick={addQuickSelection} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar {quickSelection.length} Exercício(s)
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* Detailed Configuration Tab */}
              <TabsContent value="detailed" className="space-y-4">
                <div className="text-sm text-muted-foreground">
                  Configure cada exercício individualmente com parâmetros específicos
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  <div className="col-span-2 md:col-span-1">
                    <Label>Exercício</Label>
                    <Select
                      value={currentExercise.exerciseId}
                      onValueChange={(value) => setCurrentExercise({ ...currentExercise, exerciseId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Exercício" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(exercisesByGroup).map(([group, exercises]) => (
                          <SelectGroup key={group}>
                            <SelectLabel className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                              {group}
                            </SelectLabel>
                            {exercises.map(exercise => (
                              <SelectItem key={exercise.id} value={exercise.id}>
                                {exercise.nome}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Séries</Label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={currentExercise.series}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, series: parseInt(e.target.value) || 1 })}
                    />
                  </div>

                  <div>
                    <Label>Reps</Label>
                    <Input
                      placeholder="8-12"
                      value={currentExercise.reps}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Peso (kg)</Label>
                    <Input
                      type="number"
                      min="0"
                      step="2.5"
                      value={currentExercise.pesoInicial}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, pesoInicial: parseFloat(e.target.value) || 0 })}
                    />
                  </div>

                  <div>
                    <Label>Rest (seg)</Label>
                    <Input
                      type="number"
                      min="30"
                      step="15"
                      value={currentExercise.restSeg}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, restSeg: parseInt(e.target.value) || 60 })}
                    />
                  </div>
                </div>

                <Button onClick={addExercise} disabled={!currentExercise.exerciseId} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Exercício
                </Button>
              </TabsContent>
            </Tabs>
          </div>

          {/* Selected Exercises */}
          {selectedExercises.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-medium">Exercícios do Plano ({selectedExercises.length})</h3>
              <div className="space-y-2">
                {selectedExercises.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/20 rounded-lg">
                    <div className="flex-1">
                      <div className="font-medium">{getExerciseName(exercise.exerciseId)}</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.series} séries • {exercise.reps} reps • {exercise.pesoInicial}kg • {exercise.restSeg}s
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExercise(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button 
              onClick={handleCreate} 
              disabled={!planData.nome || selectedExercises.length === 0}
              className="flex-1"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Criar Plano
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}