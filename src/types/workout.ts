export interface SetVariation {
  type: 'normal' | 'drop' | 'rest_pause' | 'cluster' | 'mechanical' | 'tempo';
  data?: {
    drops?: { weight: number; reps: number }[];
    restPauseReps?: number[];
    clusterRests?: number[];
    tempoPattern?: string; // "3-1-2-1" formato
  };
}

export interface WorkoutSet {
  id: string;
  setNumber: number;
  weight: number;
  reps: number;
  rpe: number;
  notes: string;
  completed: boolean;
  variation: SetVariation;
  timestamp: string;
}

export interface ExerciseVariations {
  dropSets: boolean;
  restPause: boolean;
  clusters: boolean;
  mechanicalDrops: boolean;
  tempoWork: boolean;
  autoProgression: boolean;
}

export interface LoadProgression {
  type: 'linear' | 'percentage' | 'rpe_based' | 'custom';
  increment: number;
  maxWeight?: number;
  targetRpe?: number;
}

export interface WorkoutPhase {
  name: string;
  sets: WorkoutSet[];
  loadProgression?: LoadProgression;
  variations: ExerciseVariations;
}