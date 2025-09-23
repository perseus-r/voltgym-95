import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { WorkoutPersistenceService } from '@/services/WorkoutPersistenceService';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { 
  Play, 
  Plus, 
  Calendar, 
  Target, 
  Clock, 
  Trash2,
  Edit3,
  Dumbbell,
  Zap,
  ChevronRight,
  RefreshCw
} from 'lucide-react';

interface WeeklyScheduleItem {
  id: string;
  workout: any;
  scheduledFor: string;
  completed: boolean;
  completedAt?: string;
}

interface EnhancedWeeklyScheduleProps {
  onStartWorkout?: (workout: any) => void;
}

const DAYS_OF_WEEK = [
  { key: 'monday', label: 'Segunda-feira', short: 'SEG' },
  { key: 'tuesday', label: 'Terça-feira', short: 'TER' },
  { key: 'wednesday', label: 'Quarta-feira', short: 'QUA' },
  { key: 'thursday', label: 'Quinta-feira', short: 'QUI' },
  { key: 'friday', label: 'Sexta-feira', short: 'SEX' },
  { key: 'saturday', label: 'Sábado', short: 'SÁB' },
  { key: 'sunday', label: 'Domingo', short: 'DOM' }
];

export function EnhancedWeeklySchedule({ onStartWorkout }: EnhancedWeeklyScheduleProps) {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<Record<string, WeeklyScheduleItem>>({});
  const [availableWorkouts, setAvailableWorkouts] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadScheduleAndWorkouts();
  }, [user?.id]);

  // Carrega agenda e treinos disponíveis
  const loadScheduleAndWorkouts = async () => {
    try {
      setLoading(true);
      
      // Carregar agenda do localStorage
      const savedSchedule = localStorage.getItem('enhanced_weekly_schedule');
      if (savedSchedule) {
        setSchedule(JSON.parse(savedSchedule));
      }

      // Carregar treinos salvos disponíveis
      const workouts = await WorkoutPersistenceService.getWorkouts(user?.id);
      setAvailableWorkouts(workouts);
      
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar agenda');
    } finally {
      setLoading(false);
    }
  };

  // Salva agenda no localStorage
  const saveSchedule = (newSchedule: Record<string, WeeklyScheduleItem>) => {
    setSchedule(newSchedule);
    localStorage.setItem('enhanced_weekly_schedule', JSON.stringify(newSchedule));
  };

  // Adiciona treino à agenda
  const addWorkoutToSchedule = (dayKey: string, workout: any) => {
    const scheduleItem: WeeklyScheduleItem = {
      id: `schedule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      workout,
      scheduledFor: dayKey,
      completed: false
    };

    const newSchedule = { ...schedule, [dayKey]: scheduleItem };
    saveSchedule(newSchedule);
    
    toast.success(`🗓️ ${workout.name} agendado para ${DAYS_OF_WEEK.find(d => d.key === dayKey)?.label}!`);
    setShowAddDialog(false);
    setSelectedDay(null);
  };

  // Remove treino da agenda
  const removeFromSchedule = (dayKey: string) => {
    const newSchedule = { ...schedule };
    delete newSchedule[dayKey];
    saveSchedule(newSchedule);
    
    toast.info(`🗑️ Treino removido de ${DAYS_OF_WEEK.find(d => d.key === dayKey)?.label}`);
  };

  // Marca treino como concluído
  const markAsCompleted = (dayKey: string) => {
    const scheduleItem = schedule[dayKey];
    if (!scheduleItem) return;

    const updatedItem: WeeklyScheduleItem = {
      ...scheduleItem,
      completed: true,
      completedAt: new Date().toISOString()
    };

    const newSchedule = { ...schedule, [dayKey]: updatedItem };
    saveSchedule(newSchedule);
    
    toast.success(`✅ ${scheduleItem.workout.name} marcado como concluído!`);
  };

  // Inicia treino
  const startWorkout = (dayKey: string) => {
    const scheduleItem = schedule[dayKey];
    if (!scheduleItem) return;

    onStartWorkout?.(scheduleItem.workout);
    markAsCompleted(dayKey);
  };

  // Obtém treino de hoje
  const getTodaysWorkout = () => {
    const today = new Date().getDay();
    const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayKey = dayKeys[today];
    return schedule[todayKey];
  };

  const todaysWorkout = getTodaysWorkout();

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center gap-3 text-txt-2">
          <RefreshCw className="w-5 h-5 animate-spin" />
          Carregando agenda...
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-txt flex items-center gap-3">
            <Calendar className="w-7 h-7 text-accent" />
            Agenda Semanal
          </h2>
          <p className="text-txt-2 mt-1">
            Organize seus treinos para cada dia da semana
          </p>
        </div>
        <Button 
          onClick={loadScheduleAndWorkouts}
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </Button>
      </div>

      {/* Treino de Hoje - Destaque */}
      {todaysWorkout && (
        <Card className="p-6 bg-gradient-to-r from-accent/20 to-accent/10 border-accent/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-accent/20 rounded-full">
                <Dumbbell className="w-6 h-6 text-accent" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-txt mb-1">
                  🎯 Treino de Hoje
                </h3>
                <p className="text-lg font-semibold text-accent">{todaysWorkout.workout.name}</p>
                <p className="text-txt-2">{todaysWorkout.workout.focus}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-txt-3">
                  <span className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {todaysWorkout.workout.exercises?.length || 0} exercícios
                  </span>
                  {todaysWorkout.completed && (
                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                      ✅ Concluído
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            {!todaysWorkout.completed && (
              <Button 
                onClick={() => {
                  const today = new Date().getDay();
                  const dayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                  startWorkout(dayKeys[today]);
                }}
                className="bg-accent text-accent-ink hover:bg-accent/90 px-8 py-3 text-lg"
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Começar Agora
              </Button>
            )}
          </div>
        </Card>
      )}

      {/* Grade Semanal */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
        {DAYS_OF_WEEK.map((day) => {
          const scheduleItem = schedule[day.key];
          const isToday = new Date().getDay() === (DAYS_OF_WEEK.indexOf(day) + 1) % 7;
          
          return (
            <Card 
              key={day.key}
              className={`p-4 transition-all hover:bg-surface/80 ${
                isToday ? 'ring-2 ring-accent bg-accent/5' : ''
              }`}
            >
              {/* Cabeçalho do Dia */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-txt text-sm">
                    {day.short}
                  </h4>
                  {isToday && (
                    <Badge variant="outline" className="text-xs mt-1 bg-accent/20 text-accent border-accent/30">
                      Hoje
                    </Badge>
                  )}
                </div>
                {scheduleItem && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromSchedule(day.key)}
                    className="text-txt-3 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>

              {/* Conteúdo */}
              {scheduleItem ? (
                <div className="space-y-3">
                  <div>
                    <h5 className="font-semibold text-txt text-sm line-clamp-2">
                      {scheduleItem.workout.name}
                    </h5>
                    <p className="text-xs text-txt-2 line-clamp-1">
                      {scheduleItem.workout.focus}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-1 text-xs text-txt-3">
                    <Target className="w-3 h-3" />
                    {scheduleItem.workout.exercises?.length || 0} exercícios
                  </div>

                  {scheduleItem.completed ? (
                    <div className="text-center py-2">
                      <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs">
                        ✅ Concluído
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => startWorkout(day.key)}
                        size="sm"
                        className="flex-1 bg-accent/20 text-accent hover:bg-accent/30 text-xs py-1.5"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Iniciar
                      </Button>
                      <Button 
                        onClick={() => {
                          setSelectedDay(day.key);
                          setShowAddDialog(true);
                        }}
                        size="sm"
                        variant="outline"
                        className="p-1.5"
                      >
                        <Edit3 className="w-3 h-3" />
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center space-y-3">
                  <div className="py-6">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-txt-3 opacity-50" />
                    <p className="text-xs text-txt-3">Nenhum treino</p>
                  </div>
                  <Button 
                    onClick={() => {
                      setSelectedDay(day.key);
                      setShowAddDialog(true);
                    }}
                    size="sm"
                    variant="outline"
                    className="w-full text-xs py-1.5 border-dashed"
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

      {/* Estatísticas da Semana */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-txt mb-4">Resumo da Semana</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">
              {Object.values(schedule).length}
            </div>
            <div className="text-sm text-txt-2">Treinos Agendados</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {Object.values(schedule).filter(item => item.completed).length}
            </div>
            <div className="text-sm text-txt-2">Concluídos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {Object.values(schedule).filter(item => !item.completed).length}
            </div>
            <div className="text-sm text-txt-2">Pendentes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-txt">
              {availableWorkouts.length}
            </div>
            <div className="text-sm text-txt-2">Treinos Disponíveis</div>
          </div>
        </div>
      </Card>

      {/* Dialog para Adicionar Treino */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-accent" />
              Escolher treino para {selectedDay && DAYS_OF_WEEK.find(d => d.key === selectedDay)?.label}
            </DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="max-h-96 pr-4">
            <div className="space-y-3">
              {availableWorkouts.map((workout) => (
                <Card 
                  key={workout.id}
                  className="p-4 cursor-pointer hover:bg-accent/10 transition-colors border hover:border-accent/30"
                  onClick={() => selectedDay && addWorkoutToSchedule(selectedDay, workout)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Dumbbell className="w-5 h-5 text-accent" />
                        <h4 className="font-semibold text-txt">{workout.name}</h4>
                      </div>
                      <p className="text-sm text-txt-2 mb-2">{workout.focus}</p>
                      <div className="flex items-center gap-4 text-xs text-txt-3">
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {workout.exercises?.length || 0} exercícios
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(workout.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-accent" />
                  </div>
                </Card>
              ))}
              
              {availableWorkouts.length === 0 && (
                <div className="text-center py-8">
                  <Dumbbell className="w-12 h-12 text-txt-3 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-txt mb-2">Nenhum treino disponível</h3>
                  <p className="text-txt-2 mb-4">Crie seus primeiros treinos para adicioná-los à agenda</p>
                  <Button onClick={() => setShowAddDialog(false)}>
                    Fechar
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}