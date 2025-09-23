import React, { useState } from 'react';
import { VoltCard } from './VoltCard';
import { VoltButton } from './VoltButton';
import { motion } from 'framer-motion';
import { Play, Plus, Trash2, Save, Download } from 'lucide-react';
import { toast } from 'sonner';
import { useUserWorkouts } from '@/hooks/useUserWorkouts';

export function WorkoutTestPanel() {
  const [testWorkoutName, setTestWorkoutName] = useState('');
  const { workouts, loading, addWorkout: addWorkoutToHook, deleteWorkout } = useUserWorkouts();

  const handleCreateTestWorkout = () => {
    if (!testWorkoutName.trim()) {
      toast.error('Digite um nome para o treino');
      return;
    }

    const newWorkout = {
      id: `test-${Date.now()}`,
      name: testWorkoutName,
      description: 'Treino criado para teste do sistema',
      focus: 'Teste Geral',
      exercises: [
        {
          name: 'Supino Reto',
          sets: 3,
          reps: '8-12',
          rest_s: 90,
          weight_suggestion: 60,
          notes: 'Manter escápulas retraídas'
        },
        {
          name: 'Agachamento',
          sets: 4,
          reps: '10-15',
          rest_s: 120,
          weight_suggestion: 80,
          notes: 'Descer até 90 graus'
        }
      ],
      estimated_duration: 45,
      difficulty_level: 3,
      target_muscle_groups: ['peito', 'pernas'],
      created_at: new Date().toISOString(),
      user_id: 'test-user'
    };

    console.log('🧪 Creating test workout:', newWorkout);
    
    if (addWorkoutToHook) {
      addWorkoutToHook(newWorkout);
    } else {
      // Fallback to localStorage
      const savedWorkouts = JSON.parse(localStorage.getItem('user_workouts') || '[]');
      savedWorkouts.push(newWorkout);
      localStorage.setItem('user_workouts', JSON.stringify(savedWorkouts));
      window.location.reload();
    }
    
    setTestWorkoutName('');
    toast.success('Treino de teste criado!');
  };

  const handleRemoveWorkout = (workoutId: string) => {
    console.log('🗑️ Removing workout:', workoutId);
    
    if (deleteWorkout) {
      deleteWorkout(workoutId);
    } else {
      // Fallback to localStorage
      const savedWorkouts = JSON.parse(localStorage.getItem('user_workouts') || '[]');
      const filteredWorkouts = savedWorkouts.filter((w: any) => w.id !== workoutId);
      localStorage.setItem('user_workouts', JSON.stringify(filteredWorkouts));
      window.location.reload();
    }
    
    toast.success('Treino removido!');
  };

  const handleStartWorkout = (workout: any) => {
    console.log('▶️ Starting workout:', workout.name);
    toast.success(`Iniciando treino: ${workout.name}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <VoltCard className="p-6">
        <h3 className="text-xl font-bold text-txt mb-4">🧪 Painel de Teste - Treinos</h3>
        
        {/* Create Test Workout */}
        <div className="mb-6 p-4 border border-accent/20 rounded-lg">
          <h4 className="font-semibold text-txt mb-3">Criar Treino de Teste</h4>
          <div className="flex gap-3">
            <input
              type="text"
              value={testWorkoutName}
              onChange={(e) => setTestWorkoutName(e.target.value)}
              placeholder="Nome do treino..."
              className="flex-1 px-3 py-2 bg-surface border border-line rounded-lg text-txt"
            />
            <VoltButton onClick={handleCreateTestWorkout}>
              <Plus className="w-4 h-4 mr-2" />
              Criar
            </VoltButton>
          </div>
        </div>

        {/* Workouts List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-txt">Treinos Disponíveis ({workouts?.length || 0})</h4>
            {loading && <span className="text-txt-2 text-sm">⏳ Carregando...</span>}
          </div>

          {!workouts || workouts.length === 0 ? (
            <div className="text-center py-8 text-txt-2">
              <p>Nenhum treino encontrado</p>
              <p className="text-sm mt-1">Crie um treino de teste ou use o IA Coach</p>
            </div>
          ) : (
            <div className="space-y-3">
              {workouts.map((workout) => (
                <motion.div
                  key={workout.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-4 bg-surface border border-line rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h5 className="font-medium text-txt">{workout.name}</h5>
                      <p className="text-sm text-txt-2">{workout.description}</p>
                      <p className="text-xs text-txt-2 mt-1">
                        Criado em: {new Date(workout.created_at || '').toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <VoltButton
                        variant="secondary"
                        onClick={() => handleStartWorkout(workout)}
                        className="px-3 py-1 text-sm"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Iniciar
                      </VoltButton>
                      <VoltButton
                        variant="warning"
                        onClick={() => handleRemoveWorkout(workout.id)}
                        className="px-3 py-1 text-sm"
                      >
                        <Trash2 className="w-3 h-3" />
                      </VoltButton>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* System Status */}
        <div className="mt-6 p-3 bg-surface/50 rounded-lg">
          <h5 className="font-medium text-txt mb-2">Status do Sistema</h5>
          <div className="text-sm space-y-1">
            <div className="flex justify-between">
              <span className="text-txt-2">Treinos carregados:</span>
              <span className="text-accent">{workouts?.length || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-txt-2">Sistema de criação:</span>
              <span className="text-accent">✅ Ativo</span>
            </div>
            <div className="flex justify-between">
              <span className="text-txt-2">Persistência:</span>
              <span className="text-accent">✅ LocalStorage</span>
            </div>
            <div className="flex justify-between">
              <span className="text-txt-2">Hook funcionando:</span>
              <span className="text-accent">{addWorkoutToHook ? '✅' : '❌'} Hook</span>
            </div>
          </div>
        </div>
      </VoltCard>
    </motion.div>
  );
}