import { useState, useEffect } from 'react';
import { Target, Plus, Edit2, Trash2, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { GoalService, Goal } from '@/services/GoalService';
import { useVibration } from '@/hooks/useVibration';

interface GoalTrackerProps {
  className?: string;
}

export function GoalTracker({ className = "" }: GoalTrackerProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { vibrateSuccess, vibrateClick } = useVibration();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'strength' as Goal['type'],
    targetValue: '',
    currentValue: 0,
    deadline: '',
    priority: 'medium' as Goal['priority']
  });

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = () => {
    const goalsData = GoalService.getAllGoals();
    setGoals(goalsData);
  };

  const handleCreateGoal = () => {
    if (!formData.title || !formData.targetValue) return;

    const newGoal = {
      title: formData.title,
      description: formData.description,
      type: formData.type,
      targetValue: parseFloat(formData.targetValue),
      currentValue: formData.currentValue,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      priority: formData.priority
    };

    GoalService.createGoal(newGoal);
    loadGoals();
    resetForm();
    setIsCreateModalOpen(false);
    vibrateSuccess();
  };

  const handleUpdateGoal = () => {
    if (!editingGoal || !formData.title || !formData.targetValue) return;

    const updatedGoal = {
      ...editingGoal,
      title: formData.title,
      description: formData.description,
      type: formData.type,
      targetValue: parseFloat(formData.targetValue),
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
      priority: formData.priority
    };

    GoalService.updateGoal(editingGoal.id, updatedGoal);
    loadGoals();
    resetForm();
    setEditingGoal(null);
    vibrateSuccess();
  };

  const handleDeleteGoal = (goalId: string) => {
    GoalService.deleteGoal(goalId);
    loadGoals();
    vibrateClick();
  };

  const handleProgressUpdate = (goalId: string, newValue: number) => {
    GoalService.updateProgress(goalId, newValue);
    loadGoals();
    vibrateClick();
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'strength',
      targetValue: '',
      currentValue: 0,
      deadline: '',
      priority: 'medium'
    });
  };

  const startEditing = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      type: goal.type,
      targetValue: goal.targetValue.toString(),
      currentValue: goal.currentValue,
      deadline: goal.deadline ? goal.deadline.toISOString().split('T')[0] : '',
      priority: goal.priority
    });
  };

  const getTypeIcon = (type: Goal['type']) => {
    switch (type) {
      case 'strength': return '💪';
      case 'endurance': return '🏃';
      case 'weight': return '⚖️';
      case 'consistency': return '📅';
      default: return '🎯';
    }
  };

  const getTypeLabel = (type: Goal['type']) => {
    switch (type) {
      case 'strength': return 'Força';
      case 'endurance': return 'Resistência';
      case 'weight': return 'Peso Corporal';
      case 'consistency': return 'Consistência';
      default: return 'Personalizada';
    }
  };

  const getPriorityColor = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'bg-error/20 text-error';
      case 'medium': return 'bg-warning/20 text-warning';
      case 'low': return 'bg-success/20 text-success';
      default: return 'bg-surface text-txt-2';
    }
  };

  const getPriorityLabel = (priority: Goal['priority']) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
      default: return 'Normal';
    }
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-display font-bold text-gradient">
            Metas Personalizadas
          </h2>
          <p className="text-txt-2">
            {activeGoals.length} ativas • {completedGoals.length} concluídas
          </p>
        </div>
        
        <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
          <DialogTrigger asChild>
            <Button className="glass-button hover:scale-105 transition-transform">
              <Plus className="w-4 h-4 mr-2" />
              Nova Meta
            </Button>
          </DialogTrigger>
          <DialogContent className="glass-card border-line/50">
            <DialogHeader>
              <DialogTitle className="text-txt">Criar Nova Meta</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-txt-2">Título</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Ex: Supino 100kg"
                  className="bg-input-bg border-input-border focus:border-accent"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-txt-2">Descrição</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Detalhes sobre sua meta..."
                  className="bg-input-bg border-input-border focus:border-accent"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-txt-2">Tipo</label>
                  <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as Goal['type'] }))}>
                    <SelectTrigger className="bg-input-bg border-input-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="strength">💪 Força</SelectItem>
                      <SelectItem value="endurance">🏃 Resistência</SelectItem>
                      <SelectItem value="weight">⚖️ Peso Corporal</SelectItem>
                      <SelectItem value="consistency">📅 Consistência</SelectItem>
                      <SelectItem value="custom">🎯 Personalizada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-txt-2">Prioridade</label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value as Goal['priority'] }))}>
                    <SelectTrigger className="bg-input-bg border-input-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">🔴 Alta</SelectItem>
                      <SelectItem value="medium">🟡 Média</SelectItem>
                      <SelectItem value="low">🟢 Baixa</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-txt-2">Valor Meta</label>
                  <Input
                    type="number"
                    value={formData.targetValue}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                    placeholder="100"
                    className="bg-input-bg border-input-border focus:border-accent"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium text-txt-2">Prazo</label>
                  <Input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                    className="bg-input-bg border-input-border focus:border-accent"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="glass-button"
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleCreateGoal}
                  className="glass-button hover:scale-105 transition-transform"
                >
                  Criar Meta
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-txt">Metas Ativas</h3>
        {activeGoals.length === 0 ? (
          <Card className="glass-card p-8 text-center">
            <Target className="w-12 h-12 text-txt-3 mx-auto mb-4" />
            <div className="text-txt-2">Nenhuma meta ativa</div>
            <div className="text-sm text-txt-3">Crie sua primeira meta para começar!</div>
          </Card>
        ) : (
          <div className="grid gap-4">
            {activeGoals.map((goal) => {
              const progress = (goal.currentValue / goal.targetValue) * 100;
              const daysLeft = goal.deadline ? Math.ceil((goal.deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)) : null;
              
              return (
                <Card key={goal.id} className="glass-card p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{getTypeIcon(goal.type)}</span>
                          <h4 className="text-lg font-semibold text-txt">{goal.title}</h4>
                          <Badge className={getPriorityColor(goal.priority)}>
                            {getPriorityLabel(goal.priority)}
                          </Badge>
                        </div>
                        {goal.description && (
                          <p className="text-sm text-txt-2">{goal.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-txt-3">
                          <span>{getTypeLabel(goal.type)}</span>
                          {daysLeft && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {daysLeft > 0 ? `${daysLeft} dias restantes` : 'Prazo vencido'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => startEditing(goal)}
                          size="sm"
                          variant="ghost"
                          className="glass-button"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteGoal(goal.id)}
                          size="sm"
                          variant="ghost"
                          className="glass-button hover:bg-error/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-txt-2">Progresso</span>
                        <span className="text-txt font-medium">
                          {goal.currentValue} / {goal.targetValue}
                        </span>
                      </div>
                      <Progress value={progress} className="h-3 bg-surface" />
                      <div className="flex justify-between text-xs text-txt-3">
                        <span>{Math.round(progress)}% completo</span>
                        {progress >= 100 && (
                          <span className="text-success">✓ Meta atingida!</span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Atualizar progresso"
                        className="bg-input-bg border-input-border focus:border-accent flex-1"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            const value = parseFloat((e.target as HTMLInputElement).value);
                            if (!isNaN(value)) {
                              handleProgressUpdate(goal.id, value);
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                      <Button
                        onClick={() => {
                          const input = document.querySelector(`input[placeholder="Atualizar progresso"]`) as HTMLInputElement;
                          const value = parseFloat(input.value);
                          if (!isNaN(value)) {
                            handleProgressUpdate(goal.id, value);
                            input.value = '';
                          }
                        }}
                        size="sm"
                        className="glass-button"
                      >
                        Atualizar
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-txt">Metas Concluídas</h3>
          <div className="grid gap-4">
            {completedGoals.map((goal) => (
              <Card key={goal.id} className="glass-card p-4 opacity-75 border-success/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success" />
                    <div>
                      <div className="font-medium text-txt">{goal.title}</div>
                      <div className="text-sm text-txt-3">
                        Concluída em {goal.completedAt?.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-success/20 text-success">
                    {goal.targetValue} atingido
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Edit Goal Dialog */}
      <Dialog open={!!editingGoal} onOpenChange={() => setEditingGoal(null)}>
        <DialogContent className="glass-card border-line/50">
          <DialogHeader>
            <DialogTitle className="text-txt">Editar Meta</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-txt-2">Título</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="bg-input-bg border-input-border focus:border-accent"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-txt-2">Descrição</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-input-bg border-input-border focus:border-accent"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-txt-2">Valor Meta</label>
                <Input
                  type="number"
                  value={formData.targetValue}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetValue: e.target.value }))}
                  className="bg-input-bg border-input-border focus:border-accent"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-txt-2">Prazo</label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                  className="bg-input-bg border-input-border focus:border-accent"
                />
              </div>
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button 
                variant="outline" 
                onClick={() => setEditingGoal(null)}
                className="glass-button"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleUpdateGoal}
                className="glass-button hover:scale-105 transition-transform"
              >
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}