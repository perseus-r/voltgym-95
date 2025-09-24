import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit3, Play, Copy, FileDown, Search, BarChart3, Settings, ListChecks, Zap, Target, Calendar, Dumbbell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { seedExercises } from '@/data/seedData';
import { Plan, PlanExercise, Exercise } from '@/types';
import { CreatePlanDialog } from '@/components/CreatePlanDialog';
import { SavedWorkoutsList } from '@/components/SavedWorkoutsList';
import { CustomWorkoutBuilder } from '@/components/CustomWorkoutBuilder';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { WeeklyWorkoutSchedule } from '@/components/WeeklyWorkoutSchedule';
import { EnhancedWeeklySchedule } from '@/components/EnhancedWeeklySchedule';
import { AdvancedWorkoutSession } from '@/components/AdvancedWorkoutSession';
import ComparativeCharts from '@/components/ComparativeCharts';
import { ActiveWorkoutSession } from '@/components/ActiveWorkoutSession';
import { UserSettings } from '@/components/UserSettings';
import { EnhancedWorkoutDashboard } from '@/components/EnhancedWorkoutDashboard';
import { WorkoutTestPanel } from '@/components/WorkoutTestPanel';
import { useUserWorkouts } from '@/hooks/useUserWorkouts';
import { useDataCleanup } from '@/hooks/useDataCleanup';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ErrorBoundary } from '@/components/ErrorFallback';

import { VoltCard } from '@/components/VoltCard';
import { VoltWorkoutCard } from '@/components/VoltWorkoutCards';

const TreinosPage = () => {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [planExercises, setPlanExercises] = useState<PlanExercise[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showCharts, setShowCharts] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showSavedWorkouts, setShowSavedWorkouts] = useState(false);
  const [showWorkoutBuilder, setShowWorkoutBuilder] = useState(false);
  const [activeView, setActiveView] = useState<'schedule' | 'myworkouts' | 'reports' | 'settings'>('schedule');
  const [weeklySchedule, setWeeklySchedule] = useState<any>({});
  const { toast } = useToast();
  
  // Use new workout hook
  const {
    workouts,
    templates,
    activeWorkout,
    startWorkout,
    completeWorkout,
    saveTemplate,
    deleteTemplate,
    getQuickTemplates,
    setActiveWorkout,
    loading
  } = useUserWorkouts();

  // Clean data for new users
  useDataCleanup();

  const navigate = useNavigate();

  useEffect(() => {
    console.log('🏋️ TreinosPage loaded');
    console.log('📊 User workouts:', workouts?.length || 0);
    console.log('🎯 Templates:', templates?.length || 0);
    setExercises(seedExercises);
  }, [workouts, templates]);

  const handleSavedWorkoutStart = (workout: any) => {
    console.log('▶️ Starting saved workout:', workout.name);
    startWorkout(workout);
    setShowSavedWorkouts(false);
  };

  if (loading) {
    return <LoadingScreen message="Carregando treinos..." />;
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg overflow-x-hidden">
        <div className="container-custom pt-6 pb-24">
          <div className="space-y-6">
            {/* Test Panel */}
            <WorkoutTestPanel />
            
            {/* Main Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              {/* Premium Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6"
              >
                <VoltCard className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center"
                      >
                        <Dumbbell className="w-6 h-6 text-accent" />
                      </motion.div>
                    </div>
                    <h1 className="text-2xl font-bold text-white">Treinos</h1>
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-txt-2">
                    Crie treinos personalizados, gerencie seus planos e acompanhe seu progresso com as ferramentas mais avançadas.
                  </p>
                </VoltCard>
              </motion.div>

              {/* Enhanced Weekly Schedule */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <EnhancedWeeklySchedule 
                  onStartWorkout={startWorkout}
                />
              </motion.div>

              {/* Enhanced Workout Dashboard */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <EnhancedWorkoutDashboard 
                  onStartWorkout={startWorkout}
                  onCreateWorkout={() => setShowWorkoutBuilder(true)}
                />
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <button
                  onClick={() => setShowWorkoutBuilder(true)}
                  className="p-4 bg-surface border border-line rounded-xl hover:border-accent/50 transition-all group"
                >
                  <Plus className="w-8 h-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-txt">Criar Treino</h3>
                  <p className="text-sm text-txt-2">Monte seu treino personalizado</p>
                </button>

                <button
                  onClick={() => setShowSavedWorkouts(true)}
                  className="p-4 bg-surface border border-line rounded-xl hover:border-accent/50 transition-all group"
                >
                  <ListChecks className="w-8 h-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-txt">Meus Treinos</h3>
                  <p className="text-sm text-txt-2">Acesse treinos salvos</p>
                </button>

                <button
                  onClick={() => navigate('/ia-coach')}
                  className="p-4 bg-surface border border-line rounded-xl hover:border-accent/50 transition-all group"
                >
                  <Target className="w-8 h-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                  <h3 className="font-semibold text-txt">IA Coach</h3>
                  <p className="text-sm text-txt-2">Treinos com inteligência artificial</p>
                </button>
              </motion.div>

              {/* Templates Rápidos */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <VoltCard className="p-6">
                  <h2 className="text-xl font-bold text-txt mb-4">Templates Rápidos</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {getQuickTemplates().map((template, index) => (
                        <VoltWorkoutCard
                          key={`template-${index}`}
                          title={template.name}
                          category={template.focus}
                          duration="35 min"
                          exercises={template.exercises.length}
                          difficulty="medium"
                          onStart={() => startWorkout(template)}
                        />
                      ))}
                  </div>
                </VoltCard>
              </motion.div>

              {/* User Templates */}
              {templates && templates.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2, duration: 0.6 }}
                >
                  <VoltCard className="p-6">
                    <h2 className="text-xl font-bold text-txt mb-4">Meus Templates ({templates.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {templates.map((template) => (
                        <VoltWorkoutCard
                          key={template.id}
                          title={template.name}
                          category={template.focus}
                          duration="35 min"
                          exercises={template.exercises.length}
                          difficulty="medium"
                          onStart={() => startWorkout(template)}
                        />
                      ))}
                    </div>
                  </VoltCard>
                </motion.div>
              )}

              {/* Active Workout Banner */}
              {activeWorkout && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <VoltCard className="p-4 border-accent/50 bg-accent/10">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-txt">🔥 Treino Ativo</h3>
                        <p className="text-txt-2">{activeWorkout.name} - {activeWorkout.focus}</p>
                      </div>
                      <button
                        onClick={() => console.log('Continue workout')}
                        className="px-4 py-2 bg-accent text-accent-ink rounded-lg hover:bg-accent/80 transition-colors"
                      >
                        Continuar
                      </button>
                    </div>
                  </VoltCard>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Dialogs */}
        <Dialog open={showSavedWorkouts} onOpenChange={setShowSavedWorkouts}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Treinos Salvos</DialogTitle>
            </DialogHeader>
            <SavedWorkoutsList onStartWorkout={handleSavedWorkoutStart} />
          </DialogContent>
        </Dialog>

        <CustomWorkoutBuilder
          isOpen={showWorkoutBuilder}
          onClose={() => setShowWorkoutBuilder(false)}
          onSave={async (workout) => {
            console.log('💾 Treino salvo:', workout.name);
            await saveTemplate({
              name: workout.name,
              focus: workout.focus,
              exercises: workout.exercises
            });
            setShowWorkoutBuilder(false);
          }}
        />

        {/* Advanced Workout Session */}
        {activeWorkout && (
          <AdvancedWorkoutSession
            workout={{
              id: activeWorkout.id,
              name: activeWorkout.name,
              focus: activeWorkout.focus,
              exercises: activeWorkout.exercises
            }}
            onClose={() => setActiveWorkout(null)}
            onComplete={async () => {
              if (activeWorkout) {
                await completeWorkout(activeWorkout);
              }
            }}
          />
        )}
      </div>
    </ErrorBoundary>
  );
};

export default TreinosPage;