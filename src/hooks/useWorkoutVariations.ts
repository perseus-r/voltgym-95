import { useState, useCallback } from 'react';
import { WorkoutSet, SetVariation, LoadProgression, ExerciseVariations } from '@/types/workout';
import { useVibration } from './useVibration';

export function useWorkoutVariations() {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [currentVariations, setCurrentVariations] = useState<ExerciseVariations>({
    dropSets: false,
    restPause: false,
    clusters: false,
    mechanicalDrops: false,
    tempoWork: false,
    autoProgression: false,
  });
  const [loadProgression, setLoadProgression] = useState<LoadProgression>({
    type: 'linear',
    increment: 2.5,
  });

  const { vibrateSuccess, vibrateClick } = useVibration();

  const addSet = useCallback((setData: Omit<WorkoutSet, 'id' | 'timestamp'>) => {
    const newSet: WorkoutSet = {
      ...setData,
      id: `set_${Date.now()}_${Math.random()}`,
      timestamp: new Date().toISOString(),
    };
    
    setSets(prev => [...prev, newSet]);
    vibrateSuccess();
    return newSet;
  }, [vibrateSuccess]);

  const updateSet = useCallback((setId: string, updates: Partial<WorkoutSet>) => {
    setSets(prev => prev.map(set => 
      set.id === setId ? { ...set, ...updates } : set
    ));
    vibrateClick();
  }, [vibrateClick]);

  const addDropSet = useCallback((baseSetId: string, dropData: { weight: number; reps: number }[]) => {
    updateSet(baseSetId, {
      variation: {
        type: 'drop',
        data: { drops: dropData }
      }
    });
  }, [updateSet]);

  const calculateProgressiveLoad = useCallback((setNumber: number, baseWeight: number): number => {
    if (!currentVariations.autoProgression) return baseWeight;
    
    switch (loadProgression.type) {
      case 'linear':
        return baseWeight + (loadProgression.increment * (setNumber - 1));
      case 'percentage':
        return baseWeight * (1 + (loadProgression.increment / 100) * (setNumber - 1));
      case 'rpe_based':
        // Lógica baseada em RPE - simplificada
        return setNumber <= 2 ? baseWeight : baseWeight + loadProgression.increment;
      default:
        return baseWeight;
    }
  }, [currentVariations.autoProgression, loadProgression]);

  const suggestNextWeight = useCallback((lastSet: WorkoutSet | null, targetRpe: number = 8): number => {
    if (!lastSet) return 0;
    
    const rpeAdjustment = targetRpe - lastSet.rpe;
    let increment = 0;
    
    if (rpeAdjustment > 1) {
      increment = 5; // RPE muito baixo, aumentar mais
    } else if (rpeAdjustment > 0) {
      increment = 2.5; // RPE baixo, aumentar pouco
    } else if (rpeAdjustment < -1) {
      increment = -5; // RPE muito alto, diminuir
    } else if (rpeAdjustment < 0) {
      increment = -2.5; // RPE alto, diminuir pouco
    }
    
    return Math.max(0, lastSet.weight + increment);
  }, []);

  const enableVariation = useCallback((variation: keyof ExerciseVariations, enabled: boolean) => {
    setCurrentVariations(prev => ({
      ...prev,
      [variation]: enabled
    }));
  }, []);

  const resetWorkout = useCallback(() => {
    setSets([]);
    setCurrentVariations({
      dropSets: false,
      restPause: false,
      clusters: false,
      mechanicalDrops: false,
      tempoWork: false,
      autoProgression: false,
    });
  }, []);

  const getWorkoutSummary = useCallback(() => {
    const totalVolume = sets
      .filter(set => set.completed)
      .reduce((total, set) => total + (set.weight * set.reps), 0);
    
    const averageRpe = sets
      .filter(set => set.completed && set.rpe > 0)
      .reduce((sum, set, _, arr) => sum + set.rpe / arr.length, 0);
    
    const variationsUsed = sets
      .filter(set => set.variation.type !== 'normal')
      .map(set => set.variation.type);
    
    return {
      totalSets: sets.filter(set => set.completed).length,
      totalVolume,
      averageRpe: Math.round(averageRpe * 10) / 10,
      variationsUsed: [...new Set(variationsUsed)],
      duration: sets.length > 0 ? 
        (new Date().getTime() - new Date(sets[0].timestamp).getTime()) / 60000 : 0
    };
  }, [sets]);

  return {
    sets,
    currentVariations,
    loadProgression,
    addSet,
    updateSet,
    addDropSet,
    calculateProgressiveLoad,
    suggestNextWeight,
    enableVariation,
    setLoadProgression,
    resetWorkout,
    getWorkoutSummary
  };
}