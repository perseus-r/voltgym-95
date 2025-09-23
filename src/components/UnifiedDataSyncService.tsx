import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Database, Upload, Download, RefreshCw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SyncStatus {
  localToSupabase: {
    status: 'idle' | 'syncing' | 'completed' | 'error';
    progress: number;
    message: string;
    lastSync?: string;
  };
  supabaseToLocal: {
    status: 'idle' | 'syncing' | 'completed' | 'error';
    progress: number;
    message: string;
    lastSync?: string;
  };
  autoSync: {
    enabled: boolean;
    interval: number;
    lastRun?: string;
  };
}

interface LocalStorageData {
  plans: any[];
  planExercises: any[];
  weeklySchedule: any;
  workoutHistory: any[];
  userProgress: any;
}

export function UnifiedDataSyncService() {
  const { user } = useAuth();
  const [syncStatus, setSyncStatus] = useState<SyncStatus>({
    localToSupabase: {
      status: 'idle',
      progress: 0,
      message: 'Pronto para sincronizar'
    },
    supabaseToLocal: {
      status: 'idle',
      progress: 0,
      message: 'Pronto para sincronizar'
    },
    autoSync: {
      enabled: false,
      interval: 300000 // 5 minutes
    }
  });

  const [localData, setLocalData] = useState<LocalStorageData>({
    plans: [],
    planExercises: [],
    weeklySchedule: {},
    workoutHistory: [],
    userProgress: {}
  });

  const [conflicts, setConflicts] = useState<any[]>([]);

  useEffect(() => {
    loadLocalData();
    checkLastSync();
  }, []);

  // Auto-sync effect
  useEffect(() => {
    if (syncStatus.autoSync.enabled && user) {
      const interval = setInterval(() => {
        syncLocalToSupabase();
      }, syncStatus.autoSync.interval);

      return () => clearInterval(interval);
    }
  }, [syncStatus.autoSync.enabled, syncStatus.autoSync.interval, user]);

  const loadLocalData = () => {
    try {
      const data: LocalStorageData = {
        plans: JSON.parse(localStorage.getItem('bora_plans_v1') || '[]'),
        planExercises: JSON.parse(localStorage.getItem('bora_plan_exercises_v1') || '[]'),
        weeklySchedule: JSON.parse(localStorage.getItem('bora_weekly_schedule_v1') || '{}'),
        workoutHistory: JSON.parse(localStorage.getItem('bora_hist_v1') || '[]'),
        userProgress: JSON.parse(localStorage.getItem('user_progress') || '{}')
      };
      
      setLocalData(data);
    } catch (error) {
      console.error('Erro ao carregar dados locais:', error);
      toast.error('Erro ao carregar dados locais');
    }
  };

  const checkLastSync = () => {
    const lastSyncLocal = localStorage.getItem('last_sync_local_to_supabase');
    const lastSyncSupabase = localStorage.getItem('last_sync_supabase_to_local');
    
    setSyncStatus(prev => ({
      ...prev,
      localToSupabase: {
        ...prev.localToSupabase,
        lastSync: lastSyncLocal || undefined
      },
      supabaseToLocal: {
        ...prev.supabaseToLocal,
        lastSync: lastSyncSupabase || undefined
      }
    }));
  };

  const syncLocalToSupabase = async () => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setSyncStatus(prev => ({
      ...prev,
      localToSupabase: {
        ...prev.localToSupabase,
        status: 'syncing',
        progress: 0,
        message: 'Iniciando sincronização...'
      }
    }));

    try {
      // 1. Sync workout sessions from history
      setSyncStatus(prev => ({
        ...prev,
        localToSupabase: {
          ...prev.localToSupabase,
          progress: 20,
          message: 'Sincronizando histórico de treinos...'
        }
      }));

      for (const historyEntry of localData.workoutHistory) {
        // Check if session already exists
        const { data: existingSession } = await supabase
          .from('workout_sessions')
          .select('id')
          .eq('user_id', user.id)
          .eq('started_at', historyEntry.ts)
          .single();

        if (!existingSession) {
          // Create workout session
          const { data: session, error: sessionError } = await supabase
            .from('workout_sessions')
            .insert({
              user_id: user.id,
              name: `Treino ${historyEntry.focus}`,
              focus: historyEntry.focus,
              started_at: historyEntry.ts,
              completed_at: historyEntry.ts,
              duration_minutes: 45, // Default duration
              total_volume: historyEntry.items.reduce((sum: number, item: any) => 
                sum + (item.carga * 10), 0) // Estimate volume
            })
            .select()
            .single();

          if (sessionError) throw sessionError;

          // Create exercise logs and set logs
          for (const item of historyEntry.items) {
            const { data: exerciseLog, error: exerciseError } = await supabase
              .from('exercise_logs')
              .insert({
                session_id: session.id,
                order_index: historyEntry.items.indexOf(item),
                completed: true,
                notes: item.nota
              })
              .select()
              .single();

            if (exerciseError) throw exerciseError;

            // Create set log
            await supabase
              .from('set_logs')
              .insert({
                exercise_log_id: exerciseLog.id,
                set_number: 1,
                weight: item.carga,
                reps: 10, // Default reps
                rpe: item.rpe,
                completed: true,
                notes: item.nota
              });
          }
        }
      }

      // 2. Sync weekly plans (could be converted to workout templates)
      setSyncStatus(prev => ({
        ...prev,
        localToSupabase: {
          ...prev.localToSupabase,
          progress: 60,
          message: 'Sincronizando planos semanais...'
        }
      }));

      for (const plan of localData.plans) {
        const { data: existingTemplate } = await supabase
          .from('workout_templates')
          .select('id')
          .eq('name', plan.nome)
          .eq('created_by', user.id)
          .single();

        if (!existingTemplate) {
          const { data: template, error: templateError } = await supabase
            .from('workout_templates')
            .insert({
              name: plan.nome,
              description: plan.observacoes || `Plano criado pelo usuário`,
              focus: plan.foco,
              target_muscle_groups: [plan.foco],
              difficulty_level: 3,
              estimated_duration: 45,
              is_public: false,
              created_by: user.id
            })
            .select()
            .single();

          if (templateError) throw templateError;

          // Add exercises to template
          const planExercises = localData.planExercises.filter(pe => pe.planId === plan.id);
          for (const planExercise of planExercises) {
            await supabase
              .from('template_exercises')
              .insert({
                template_id: template.id,
                order_index: planExercises.indexOf(planExercise),
                sets: planExercise.series || 3,
                reps_target: planExercise.reps || '8-10',
                rest_seconds: planExercise.restSeg || 90,
                weight_suggestion: planExercise.peso || 0,
                notes: planExercise.observacoes || ''
              });
          }
        }
      }

      setSyncStatus(prev => ({
        ...prev,
        localToSupabase: {
          ...prev.localToSupabase,
          progress: 100,
          status: 'completed',
          message: 'Sincronização concluída com sucesso!',
          lastSync: new Date().toISOString()
        }
      }));

      localStorage.setItem('last_sync_local_to_supabase', new Date().toISOString());
      toast.success('Dados sincronizados com Supabase!');

    } catch (error) {
      console.error('Erro na sincronização:', error);
      setSyncStatus(prev => ({
        ...prev,
        localToSupabase: {
          ...prev.localToSupabase,
          status: 'error',
          message: `Erro: ${error}`
        }
      }));
      toast.error('Erro na sincronização com Supabase');
    }
  };

  const syncSupabaseToLocal = async () => {
    if (!user) {
      toast.error('Usuário não autenticado');
      return;
    }

    setSyncStatus(prev => ({
      ...prev,
      supabaseToLocal: {
        ...prev.supabaseToLocal,
        status: 'syncing',
        progress: 0,
        message: 'Baixando dados do Supabase...'
      }
    }));

    try {
      // 1. Download workout sessions
      setSyncStatus(prev => ({
        ...prev,
        supabaseToLocal: {
          ...prev.supabaseToLocal,
          progress: 25,
          message: 'Baixando sessões de treino...'
        }
      }));

      const { data: sessions, error: sessionsError } = await supabase
        .from('workout_sessions')
        .select(`
          *,
          exercise_logs (
            *,
            set_logs (*)
          )
        `)
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      // Convert to local history format
      const historyEntries = sessions?.filter(s => s.completed_at).map(session => ({
        ts: session.completed_at,
        user: user.id,
        focus: session.focus,
        items: session.exercise_logs?.flatMap((log: any) => 
          log.set_logs?.map((set: any) => ({
            name: `Exercício ${log.order_index + 1}`,
            carga: set.weight || 0,
            rpe: set.rpe || 5,
            nota: set.notes || ''
          })) || []
        ) || []
      })) || [];

      // 2. Download workout templates
      setSyncStatus(prev => ({
        ...prev,
        supabaseToLocal: {
          ...prev.supabaseToLocal,
          progress: 50,
          message: 'Baixando modelos de treino...'
        }
      }));

      const { data: templates, error: templatesError } = await supabase
        .from('workout_templates')
        .select(`
          *,
          template_exercises (
            *
          )
        `)
        .or(`created_by.eq.${user.id},is_public.eq.true`);

      if (templatesError) throw templatesError;

      // Convert to local plans format
      const plans = templates?.map(template => ({
        id: template.id,
        nome: template.name,
        foco: template.focus,
        observacoes: template.description,
        createdAt: template.created_at
      })) || [];

      const planExercises = templates?.flatMap(template => 
        template.template_exercises?.map((te: any) => ({
          id: `${template.id}-${te.id}`,
          planId: template.id,
          exerciseId: te.exercise_id,
          series: te.sets,
          reps: te.reps_target,
          restSeg: te.rest_seconds,
          peso: te.weight_suggestion,
          observacoes: te.notes
        })) || []
      ) || [];

      // 3. Save to localStorage
      setSyncStatus(prev => ({
        ...prev,
        supabaseToLocal: {
          ...prev.supabaseToLocal,
          progress: 75,
          message: 'Salvando dados localmente...'
        }
      }));

      localStorage.setItem('bora_hist_v1', JSON.stringify(historyEntries));
      localStorage.setItem('bora_plans_v1', JSON.stringify(plans));
      localStorage.setItem('bora_plan_exercises_v1', JSON.stringify(planExercises));

      // Reload local data
      loadLocalData();

      setSyncStatus(prev => ({
        ...prev,
        supabaseToLocal: {
          ...prev.supabaseToLocal,
          progress: 100,
          status: 'completed',
          message: 'Download concluído com sucesso!',
          lastSync: new Date().toISOString()
        }
      }));

      localStorage.setItem('last_sync_supabase_to_local', new Date().toISOString());
      toast.success('Dados baixados do Supabase!');

    } catch (error) {
      console.error('Erro no download:', error);
      setSyncStatus(prev => ({
        ...prev,
        supabaseToLocal: {
          ...prev.supabaseToLocal,
          status: 'error',
          message: `Erro: ${error}`
        }
      }));
      toast.error('Erro ao baixar dados do Supabase');
    }
  };

  const toggleAutoSync = () => {
    setSyncStatus(prev => ({
      ...prev,
      autoSync: {
        ...prev.autoSync,
        enabled: !prev.autoSync.enabled
      }
    }));

    const newState = !syncStatus.autoSync.enabled;
    localStorage.setItem('auto_sync_enabled', String(newState));
    
    toast.success(newState ? 'Auto-sync ativado' : 'Auto-sync desativado');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400';
      case 'syncing': return 'text-accent';
      case 'error': return 'text-red-400';
      default: return 'text-txt-3';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'syncing': return <div className="w-5 h-5 animate-spin border-2 border-accent border-t-transparent rounded-full" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-400" />;
      default: return <Clock className="w-5 h-5 text-txt-3" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-r from-accent to-accent-2 rounded-xl flex items-center justify-center">
            <Database className="w-6 h-6 text-accent-ink" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-txt">Sincronização de Dados</h2>
            <p className="text-txt-2">Backup e sincronização entre dispositivos</p>
          </div>
        </div>
        
        <Button 
          onClick={toggleAutoSync}
          variant={syncStatus.autoSync.enabled ? "default" : "outline"}
          className={syncStatus.autoSync.enabled ? "bg-accent text-accent-ink" : "glass-button"}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Auto-Sync {syncStatus.autoSync.enabled ? 'ON' : 'OFF'}
        </Button>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Local para Supabase */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Upload className="w-6 h-6 text-accent" />
              <div>
                <h3 className="text-lg font-semibold text-txt">Local → Supabase</h3>
                <p className="text-sm text-txt-2">Backup dos dados locais</p>
              </div>
            </div>
            {getStatusIcon(syncStatus.localToSupabase.status)}
          </div>

          {syncStatus.localToSupabase.status === 'syncing' && (
            <div className="mb-4">
              <Progress value={syncStatus.localToSupabase.progress} className="h-2" />
            </div>
          )}

          <p className={`text-sm mb-4 ${getStatusColor(syncStatus.localToSupabase.status)}`}>
            {syncStatus.localToSupabase.message}
          </p>

          {syncStatus.localToSupabase.lastSync && (
            <p className="text-xs text-txt-3 mb-4">
              Última sincronização: {new Date(syncStatus.localToSupabase.lastSync).toLocaleString('pt-BR')}
            </p>
          )}

          <Button 
            onClick={syncLocalToSupabase}
            disabled={syncStatus.localToSupabase.status === 'syncing' || !user}
            className="w-full bg-accent text-accent-ink hover:bg-accent/90"
          >
            {syncStatus.localToSupabase.status === 'syncing' ? 'Sincronizando...' : 'Fazer Backup'}
          </Button>
        </Card>

        {/* Supabase para Local */}
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Download className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-txt">Supabase → Local</h3>
                <p className="text-sm text-txt-2">Restaurar dados salvos</p>
              </div>
            </div>
            {getStatusIcon(syncStatus.supabaseToLocal.status)}
          </div>

          {syncStatus.supabaseToLocal.status === 'syncing' && (
            <div className="mb-4">
              <Progress value={syncStatus.supabaseToLocal.progress} className="h-2" />
            </div>
          )}

          <p className={`text-sm mb-4 ${getStatusColor(syncStatus.supabaseToLocal.status)}`}>
            {syncStatus.supabaseToLocal.message}
          </p>

          {syncStatus.supabaseToLocal.lastSync && (
            <p className="text-xs text-txt-3 mb-4">
              Último download: {new Date(syncStatus.supabaseToLocal.lastSync).toLocaleString('pt-BR')}
            </p>
          )}

          <Button 
            onClick={syncSupabaseToLocal}
            disabled={syncStatus.supabaseToLocal.status === 'syncing' || !user}
            className="w-full glass-button"
          >
            {syncStatus.supabaseToLocal.status === 'syncing' ? 'Baixando...' : 'Restaurar Dados'}
          </Button>
        </Card>
      </div>

      {/* Local Data Summary */}
      <Card className="glass-card p-6">
        <h3 className="text-xl font-semibold text-txt mb-4">Dados Locais</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{localData.plans.length}</p>
            <p className="text-sm text-txt-2">Planos</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{localData.planExercises.length}</p>
            <p className="text-sm text-txt-2">Exercícios</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">{localData.workoutHistory.length}</p>
            <p className="text-sm text-txt-2">Histórico</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-accent">
              {Object.keys(localData.weeklySchedule).length}
            </p>
            <p className="text-sm text-txt-2">Dias Agendados</p>
          </div>
        </div>
      </Card>

      {/* Auto-sync Settings */}
      {syncStatus.autoSync.enabled && (
        <Card className="glass-card p-6">
          <h3 className="text-xl font-semibold text-txt mb-4">Configurações do Auto-Sync</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-txt-2">Intervalo de sincronização</span>
              <Badge variant="secondary" className="bg-accent/20 text-accent">
                {Math.round(syncStatus.autoSync.interval / 60000)} minutos
              </Badge>
            </div>
            
            {syncStatus.autoSync.lastRun && (
              <div className="flex items-center justify-between">
                <span className="text-txt-2">Última execução automática</span>
                <span className="text-txt-3 text-sm">
                  {new Date(syncStatus.autoSync.lastRun).toLocaleString('pt-BR')}
                </span>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
}