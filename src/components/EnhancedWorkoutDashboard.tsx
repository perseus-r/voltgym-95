import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, Search, Calendar, Target, Star, 
  Play, Edit3, Copy, Trash2, Clock, Activity, Zap,
  BarChart3, BookOpen, Heart, Award, Flame
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { VoltButton } from './VoltButton';

interface WorkoutTemplate {
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
  exercises_count: number;
}

interface EnhancedWorkoutDashboardProps {
  onStartWorkout: (workout: any) => void;
  onCreateWorkout: () => void;
}

export function EnhancedWorkoutDashboard({ onStartWorkout, onCreateWorkout }: EnhancedWorkoutDashboardProps) {
  const [activeTab, setActiveTab] = useState<'agenda' | 'templates' | 'myworkouts' | 'stats'>('templates');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>([]);
  const [myWorkouts, setMyWorkouts] = useState<WorkoutTemplate[]>([]);
  const [weeklySchedule, setWeeklySchedule] = useState<any>({});
  const [showWorkoutDetails, setShowWorkoutDetails] = useState<WorkoutTemplate | null>(null);
  const [showAddToScheduleDialog, setShowAddToScheduleDialog] = useState<{template: WorkoutTemplate | null, day: string | null}>({template: null, day: null});

  const categories = [
    { id: 'all', name: 'Todos', icon: Target, color: 'text-accent' },
    { id: 'strength', name: 'Força', icon: Activity, color: 'text-red-400' },
    { id: 'cardio', name: 'Cardio', icon: Heart, color: 'text-pink-400' },
    { id: 'hiit', name: 'HIIT', icon: Zap, color: 'text-yellow-400' }
  ];

  const weekDays = [
    { key: 'monday', short: 'SEG', full: 'Segunda-feira' },
    { key: 'tuesday', short: 'TER', full: 'Terça-feira' },
    { key: 'wednesday', short: 'QUA', full: 'Quarta-feira' },
    { key: 'thursday', short: 'QUI', full: 'Quinta-feira' },
    { key: 'friday', short: 'SEX', full: 'Sexta-feira' },
    { key: 'saturday', short: 'SÁB', full: 'Sábado' },
    { key: 'sunday', short: 'DOM', full: 'Domingo' }
  ];

  useEffect(() => {
    loadWorkoutTemplates();
    loadWeeklySchedule();
  }, []);

  const loadWorkoutTemplates = () => {
    const templates: WorkoutTemplate[] = [
      {
        id: 'template-1',
        name: 'Push Day Intenso',
        category: 'strength',
        focus: 'Peito, Ombros, Tríceps',
        difficulty: 'intermediario',
        duration_minutes: 75,
        description: 'Treino focado em movimentos de empurrar para desenvolvimento de força e massa muscular.',
        tags: ['força', 'hipertrofia', 'push', 'peito'],
        rating: 4.8,
        completions: 234,
        exercises_count: 8
      },
      {
        id: 'template-2',
        name: 'HIIT Fat Burner',
        category: 'hiit',
        focus: 'Queima de Gordura',
        difficulty: 'avancado',
        duration_minutes: 30,
        description: 'Treino intervalado de alta intensidade para máxima queima calórica.',
        tags: ['hiit', 'cardio', 'queima', 'intervalado'],
        rating: 4.9,
        completions: 156,
        exercises_count: 6
      },
      {
        id: 'template-3',
        name: 'Pull Day Completo',
        category: 'strength',
        focus: 'Costas, Bíceps, Posteriores',
        difficulty: 'intermediario',
        duration_minutes: 70,
        description: 'Desenvolvimento completo de costas, bíceps e posteriores com foco em força e definição.',
        tags: ['força', 'costas', 'pull', 'bíceps'],
        rating: 4.7,
        completions: 189,
        exercises_count: 7
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
        exercises_count: 9
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
        exercises_count: 5
      },
      {
        id: 'template-6',
        name: 'Upper Body Power',
        category: 'strength',
        focus: 'Tronco Superior Completo',
        difficulty: 'intermediario',
        duration_minutes: 65,
        description: 'Treino completo para o tronco superior combinando peito, costas, ombros e braços em uma sessão.',
        tags: ['força', 'upper', 'completo', 'definição'],
        rating: 4.5,
        completions: 167,
        exercises_count: 6
      }
    ];
    setWorkoutTemplates(templates);
  };

  const loadWeeklySchedule = () => {
    const stored = localStorage.getItem('volt_weekly_schedule');
    setWeeklySchedule(stored ? JSON.parse(stored) : {});
  };

  const addWorkoutToDay = (dayKey: string, template: WorkoutTemplate) => {
    const newSchedule = { ...weeklySchedule };
    if (!newSchedule[dayKey]) {
      newSchedule[dayKey] = [];
    }
    newSchedule[dayKey].push(template);
    setWeeklySchedule(newSchedule);
    localStorage.setItem('volt_weekly_schedule', JSON.stringify(newSchedule));
    setShowAddToScheduleDialog({template: null, day: null});
  };

  const removeWorkoutFromDay = (dayKey: string, templateId: string) => {
    const newSchedule = { ...weeklySchedule };
    if (newSchedule[dayKey]) {
      newSchedule[dayKey] = newSchedule[dayKey].filter((w: WorkoutTemplate) => w.id !== templateId);
    }
    setWeeklySchedule(newSchedule);
    localStorage.setItem('volt_weekly_schedule', JSON.stringify(newSchedule));
  };

  const startWorkout = (template: WorkoutTemplate) => {
    const workoutData = {
      id: `workout-${Date.now()}`,
      name: template.name,
      focus: template.focus,
      duration_minutes: template.duration_minutes,
      exercises: Array.from({length: template.exercises_count}, (_, i) => ({
        id: `ex-${template.id}-${i}`,
        name: `Exercício ${i + 1}`,
        sets: 3,
        reps_target: '8-12',
        completed: false
      }))
    };
    onStartWorkout(workoutData);
  };

  const duplicateWorkout = (template: WorkoutTemplate) => {
    const duplicated = {
      ...template,
      id: `${template.id}-copy-${Date.now()}`,
      name: `${template.name} (Cópia)`,
      completions: 0
    };
    setMyWorkouts(prev => [...prev, duplicated]);
  };

  const filteredTemplates = workoutTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.focus.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderTemplatesView = () => (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-txt-3" />
          <Input
            placeholder="Buscar treinos, exercícios, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all hover:scale-105 active:scale-95 ${
                  selectedCategory === category.id
                    ? 'bg-accent text-accent-ink'
                    : 'glass-button hover:bg-accent/10'
                }`}
              >
                <IconComponent className={`w-4 h-4 ${
                  selectedCategory === category.id ? 'text-accent-ink' : category.color
                }`} />
                {category.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 hover:scale-105 transition-all cursor-pointer group">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-txt group-hover:text-accent transition-colors">
                      {template.name}
                    </h3>
                    <p className="text-sm text-txt-2 mt-1">{template.focus}</p>
                  </div>
                  <Badge variant={template.difficulty === 'avancado' ? 'destructive' : 
                                 template.difficulty === 'intermediario' ? 'default' : 'secondary'}>
                    {template.difficulty === 'avancado' ? 'Avançado' : 
                     template.difficulty === 'intermediario' ? 'Intermediário' : 'Iniciante'}
                  </Badge>
                </div>

                <div className="flex items-center gap-4 text-sm text-txt-3">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {template.duration_minutes}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="w-4 h-4" />
                    {template.exercises_count} exercícios
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    {template.rating.toFixed(1)}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1">
                  {template.tags.slice(0, 3).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <p className="text-sm text-txt-2 line-clamp-2">{template.description}</p>

                <div className="flex gap-2">
                  <Button
                    onClick={() => startWorkout(template)}
                    className="flex-1 bg-accent text-accent-ink hover:bg-accent/90"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowWorkoutDetails(template)}
                  >
                    <BookOpen className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => duplicateWorkout(template)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderAgendaView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const dayWorkouts = weeklySchedule[day.key] || [];
          const isToday = new Date().getDay() === (index + 1) % 7;

          return (
            <motion.div
              key={day.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`p-4 transition-all hover:scale-105 cursor-pointer ${
                isToday ? 'ring-2 ring-accent bg-accent/5' : ''
              }`}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-bold text-txt">{day.short}</h4>
                    {isToday && (
                      <Badge className="text-xs mt-1 bg-accent text-accent-ink">
                        Hoje
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-txt-2">
                    {dayWorkouts.length} treino{dayWorkouts.length !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2 mb-4 min-h-[80px]">
                  {dayWorkouts.length > 0 ? (
                    dayWorkouts.map((workout: WorkoutTemplate, idx: number) => (
                      <div
                        key={idx}
                        className="glass-button p-2 text-xs rounded-lg flex items-center justify-between"
                      >
                        <span className="text-txt truncate">{workout.name}</span>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startWorkout(workout)}
                            className="p-1 hover:bg-accent/20 rounded"
                          >
                            <Play className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => removeWorkoutFromDay(day.key, workout.id)}
                            className="p-1 hover:bg-red-500/20 rounded text-red-400"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-txt-3" />
                      <p className="text-xs text-txt-2">Nenhum treino</p>
                    </div>
                  )}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className="w-full"
                  onClick={() => setShowAddToScheduleDialog({template: null, day: day.key})}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </Button>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-txt flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-accent to-accent-2">
              <Target className="w-8 h-8 text-accent-ink" />
            </div>
            Centro de Treinos
          </h1>
          <p className="text-txt-2 mt-2">
            Gerencie seus treinos, agenda e progresso em um só lugar
          </p>
        </div>
        
        <VoltButton onClick={onCreateWorkout} className="px-6 py-3">
          <Plus className="w-5 h-5 mr-2" />
          Criar Treino
        </VoltButton>
      </div>

      <Tabs value={activeTab} onValueChange={(value: any) => setActiveTab(value)}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="agenda" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Agenda
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Templates
          </TabsTrigger>
          <TabsTrigger value="myworkouts" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Meus Treinos
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Estatísticas
          </TabsTrigger>
        </TabsList>

        <TabsContent value="agenda" className="mt-6">
          {renderAgendaView()}
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          {renderTemplatesView()}
        </TabsContent>

        <TabsContent value="myworkouts" className="mt-6">
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-txt-3" />
            <h3 className="text-xl font-bold text-txt mb-2">Seus Treinos Salvos</h3>
            <p className="text-txt-2 mb-6">Os treinos que você criou aparecerão aqui</p>
            <VoltButton onClick={onCreateWorkout}>
              <Plus className="w-5 h-5 mr-2" />
              Criar Primeiro Treino
            </VoltButton>
          </div>
        </TabsContent>

        <TabsContent value="stats" className="mt-6">
          <div className="text-center py-12">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 text-txt-3" />
            <h3 className="text-xl font-bold text-txt mb-2">Estatísticas de Treino</h3>
            <p className="text-txt-2">Visualize seu progresso e estatísticas detalhadas</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add to Schedule Dialog */}
      <Dialog open={!!showAddToScheduleDialog.day} onOpenChange={() => setShowAddToScheduleDialog({template: null, day: null})}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Adicionar treino para {weekDays.find(d => d.key === showAddToScheduleDialog.day)?.full}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {workoutTemplates.map((template) => (
              <Card 
                key={template.id}
                className="p-4 cursor-pointer hover:bg-accent/10 transition-colors"
                onClick={() => addWorkoutToDay(showAddToScheduleDialog.day!, template)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-txt">{template.name}</h4>
                    <p className="text-sm text-txt-2">{template.focus}</p>
                    <p className="text-xs text-txt-3">
                      {template.exercises_count} exercícios • {template.duration_minutes} min
                    </p>
                  </div>
                  <Button size="sm">
                    Escolher
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}