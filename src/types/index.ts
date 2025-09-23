// Core Types following the master prompt specification

export interface UserProfile {
  id: string;
  objetivo: 'massa' | 'gordura' | 'forca';
  nivel: number;
  peso: number;
  altura: number;
  sexo: 'M' | 'F';
  preferenciaMusica: string;
}

export interface Plan {
  id: string;
  nome: string;
  foco: string;
  diasSemana: number;
  createdAt: string;
}

export interface Exercise {
  id?: string;
  name?: string;
  nome?: string;
  grupo?: string;
  sets?: number;
  reps?: string;
  rest_s?: number;
  videoURL?: string;
  dicaCurta?: string;
}

export interface PlanExercise {
  id: string;
  planId: string;
  exerciseId: string;
  series: number;
  reps: string;
  pesoInicial: number;
  restSeg: number;
}

export interface Session {
  id: string;
  date: string;
  planId: string;
  duracaoMin: number;
  kcalEstimadas: number;
  playlistName: string;
}

export interface SetEntry {
  id: string;
  sessionId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  peso: number;
  rpe: number;
  nota: string;
}

export interface VibeLog {
  id: string;
  date: string;
  humor: number;
  fadiga: number;
  motivacao: number;
  observacao?: string;
}

export interface AIChat {
  id: string;
  date: string;
  pergunta: string;
  resposta: string;
  tags: string[];
  insights?: string[];
  recommendations?: string[];
}

export interface ProgressMetric {
  id: string;
  semanaISO: string;
  totalVolume: number;
  bestLiftsJSON: string;
  streakAtual: number;
}

export interface HistoryEntry {
  ts: string;
  user: string;
  focus: string;
  items: {
    name: string;
    carga: number;
    rpe: number;
    nota: string;
  }[];
}

export type SessionIntensity = 'leve' | 'moderado' | 'alto';

export interface OverloadHint {
  exerciseId: string;
  suggestion: 'increase_weight' | 'increase_reps' | 'maintain';
  amount?: number;
  reason: string;
}

export interface PlanRecommendation {
  originalPlan: Plan;
  adaptedExercises: PlanExercise[];
  reasoning: string;
}