import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { MessageSquare, Star, TrendingUp, Target, Zap, CheckCircle, AlertCircle, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getWorkoutHistory, saveWorkoutHistory, HistoryEntry } from '@/lib/storage';

interface WorkoutFeedbackProps {
  isOpen: boolean;
  onClose: () => void;
  weekWorkouts?: string[];
}

interface FeedbackData {
  rating: number;
  difficulty: 'easy' | 'medium' | 'hard';
  energy: 'low' | 'medium' | 'high';
  recovery: 'poor' | 'good' | 'excellent';
  motivation: 'low' | 'medium' | 'high';
  comments: string;
  improvements: string[];
  nextWeekGoals: string;
}

const IMPROVEMENT_OPTIONS = [
  'Aumentar cargas',
  'Melhorar técnica',
  'Mais consistência',
  'Variar exercícios',
  'Melhor descanso',
  'Nutrição adequada',
  'Mais cardio',
  'Flexibilidade',
  'Sono melhor',
  'Menos stress'
];

export function WorkoutFeedback({ isOpen, onClose, weekWorkouts = [] }: WorkoutFeedbackProps) {
  const { user } = useAuth();
  const [feedback, setFeedback] = useState<FeedbackData>({
    rating: 0,
    difficulty: 'medium',
    energy: 'medium',
    recovery: 'good',
    motivation: 'medium',
    comments: '',
    improvements: [],
    nextWeekGoals: ''
  });

  const handleSubmit = () => {
    if (feedback.rating === 0) {
      toast.error('Por favor, dê uma nota para a semana!');
      return;
    }

    // Save feedback to localStorage
    const feedbackEntry: HistoryEntry = {
      ts: new Date().toISOString(),
      user: user?.id || 'demo',
      focus: 'Feedback Semanal',
      items: [{
        name: 'Avaliação da Semana',
        carga: feedback.rating,
        rpe: feedback.rating,
        nota: JSON.stringify({
          difficulty: feedback.difficulty,
          energy: feedback.energy,
          recovery: feedback.recovery,
          motivation: feedback.motivation,
          comments: feedback.comments,
          improvements: feedback.improvements,
          nextWeekGoals: feedback.nextWeekGoals,
          weekWorkouts: weekWorkouts
        })
      }]
    };

    saveWorkoutHistory(feedbackEntry);

    toast.success('🎯 Feedback salvo! Dados importantes para sua evolução!');
    onClose();
    
    // Reset form
    setFeedback({
      rating: 0,
      difficulty: 'medium',
      energy: 'medium',
      recovery: 'good',
      motivation: 'medium',
      comments: '',
      improvements: [],
      nextWeekGoals: ''
    });
  };

  const toggleImprovement = (improvement: string) => {
    setFeedback(prev => ({
      ...prev,
      improvements: prev.improvements.includes(improvement)
        ? prev.improvements.filter(i => i !== improvement)
        : [...prev.improvements, improvement]
    }));
  };

  const getWeekSummary = () => {
    const history = getWorkoutHistory(user?.id || 'demo');
    const lastWeek = history.filter(entry => {
      const entryDate = new Date(entry.ts);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return entryDate >= weekAgo;
    });

    const totalWorkouts = lastWeek.length;
    const totalVolume = lastWeek.reduce((sum, entry) => 
      sum + entry.items.reduce((itemSum, item) => itemSum + (item.carga || 0), 0), 0
    );
    const avgRpe = lastWeek.length > 0 
      ? lastWeek.reduce((sum, entry) => 
          sum + entry.items.reduce((itemSum, item) => itemSum + (item.rpe || 0), 0), 0
        ) / lastWeek.reduce((sum, entry) => sum + entry.items.length, 0)
      : 0;

    return { totalWorkouts, totalVolume, avgRpe, workouts: lastWeek };
  };

  const weekSummary = getWeekSummary();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-surface text-txt-2';
    }
  };

  const getEnergyIcon = (energy: string) => {
    switch (energy) {
      case 'low': return <AlertCircle className="w-4 h-4" />;
      case 'medium': return <Target className="w-4 h-4" />;
      case 'high': return <Zap className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="p-3 rounded-xl bg-gradient-to-r from-accent to-accent-2">
              <MessageSquare className="w-6 h-6 text-accent-ink" />
            </div>
            Feedback da Semana
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Week Summary */}
          <Card className="p-4 bg-surface/30">
            <h3 className="font-semibold text-txt mb-3">Resumo da Semana</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{weekSummary.totalWorkouts}</div>
                <div className="text-sm text-txt-2">Treinos</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{Math.round(weekSummary.totalVolume)}</div>
                <div className="text-sm text-txt-2">Volume (kg)</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{weekSummary.avgRpe.toFixed(1)}</div>
                <div className="text-sm text-txt-2">RPE Médio</div>
              </div>
            </div>
          </Card>

          {/* Rating */}
          <div className="space-y-3">
            <Label className="text-txt font-semibold text-lg">Como você avalia sua semana de treinos?</Label>
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  key={star}
                  onClick={() => setFeedback(prev => ({ ...prev, rating: star }))}
                  className={`p-2 rounded-lg transition-all duration-300 ${
                    star <= feedback.rating 
                      ? 'text-yellow-400 scale-110' 
                      : 'text-txt-3 hover:text-yellow-400'
                  }`}
                >
                  <Star className={`w-8 h-8 ${star <= feedback.rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
            <div className="text-center text-sm text-txt-2">
              {feedback.rating > 0 && (
                <span className="text-accent font-medium">
                  {feedback.rating === 5 ? 'Excelente!' : 
                   feedback.rating === 4 ? 'Muito Bom!' :
                   feedback.rating === 3 ? 'Bom!' :
                   feedback.rating === 2 ? 'Regular' :
                   'Precisa Melhorar'}
                </span>
              )}
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label className="text-sm text-txt-2">Dificuldade</Label>
              <div className="flex gap-1">
                {['easy', 'medium', 'hard'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFeedback(prev => ({ ...prev, difficulty: level as any }))}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      feedback.difficulty === level 
                        ? getDifficultyColor(level)
                        : 'bg-surface text-txt-3 hover:bg-surface/80'
                    }`}
                  >
                    {level === 'easy' ? 'Fácil' : level === 'medium' ? 'Médio' : 'Difícil'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-txt-2">Energia</Label>
              <div className="flex gap-1">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFeedback(prev => ({ ...prev, energy: level as any }))}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1 ${
                      feedback.energy === level 
                        ? 'bg-accent/20 text-accent'
                        : 'bg-surface text-txt-3 hover:bg-surface/80'
                    }`}
                  >
                    {getEnergyIcon(level)}
                    {level === 'low' ? 'Baixa' : level === 'medium' ? 'Média' : 'Alta'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-txt-2">Recuperação</Label>
              <div className="flex gap-1">
                {['poor', 'good', 'excellent'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFeedback(prev => ({ ...prev, recovery: level as any }))}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      feedback.recovery === level 
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-surface text-txt-3 hover:bg-surface/80'
                    }`}
                  >
                    {level === 'poor' ? 'Ruim' : level === 'good' ? 'Boa' : 'Excelente'}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm text-txt-2">Motivação</Label>
              <div className="flex gap-1">
                {['low', 'medium', 'high'].map(level => (
                  <button
                    key={level}
                    onClick={() => setFeedback(prev => ({ ...prev, motivation: level as any }))}
                    className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                      feedback.motivation === level 
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-surface text-txt-3 hover:bg-surface/80'
                    }`}
                  >
                    {level === 'low' ? 'Baixa' : level === 'medium' ? 'Média' : 'Alta'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Improvements */}
          <div className="space-y-3">
            <Label className="text-txt font-semibold">Áreas para melhorar na próxima semana:</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {IMPROVEMENT_OPTIONS.map(improvement => (
                <button
                  key={improvement}
                  onClick={() => toggleImprovement(improvement)}
                  className={`p-3 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                    feedback.improvements.includes(improvement)
                      ? 'bg-accent/20 text-accent border border-accent/30'
                      : 'bg-surface text-txt-2 hover:bg-surface/80 border border-line/20'
                  }`}
                >
                  {feedback.improvements.includes(improvement) ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <div className="w-4 h-4 border border-txt-3 rounded" />
                  )}
                  {improvement}
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-3">
            <Label className="text-txt font-semibold">Comentários adicionais:</Label>
            <Textarea
              value={feedback.comments}
              onChange={(e) => setFeedback(prev => ({ ...prev, comments: e.target.value }))}
              placeholder="Como foi a semana? O que funcionou bem? O que pode melhorar?"
              className="min-h-24"
            />
          </div>

          {/* Next Week Goals */}
          <div className="space-y-3">
            <Label className="text-txt font-semibold">Meta para a próxima semana:</Label>
            <Textarea
              value={feedback.nextWeekGoals}
              onChange={(e) => setFeedback(prev => ({ ...prev, nextWeekGoals: e.target.value }))}
              placeholder="Ex: Aumentar 2.5kg no supino, treinar 4x na semana..."
              className="min-h-20"
            />
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-gradient-to-r from-accent to-accent-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Salvar Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}