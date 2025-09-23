import { getStorage, setStorage } from '@/lib/storage';

export interface Goal {
  id: string;
  title: string;
  description?: string;
  type: 'strength' | 'endurance' | 'weight' | 'consistency' | 'custom';
  targetValue: number;
  currentValue: number;
  unit?: string;
  deadline?: Date;
  priority: 'low' | 'medium' | 'high';
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  tags?: string[];
}

export class GoalService {
  private static readonly STORAGE_KEY = 'bora_goals_v1';

  static getAllGoals(): Goal[] {
    const goals = getStorage<any[]>(this.STORAGE_KEY, []);
    
    return goals.map(goal => ({
      ...goal,
      createdAt: new Date(goal.createdAt),
      updatedAt: new Date(goal.updatedAt),
      deadline: goal.deadline ? new Date(goal.deadline) : undefined,
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined
    }));
  }

  static createGoal(goalData: Omit<Goal, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Goal {
    const goals = this.getAllGoals();
    
    const newGoal: Goal = {
      ...goalData,
      id: this.generateId(),
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    goals.push(newGoal);
    setStorage(this.STORAGE_KEY, goals);
    
    return newGoal;
  }

  static updateGoal(goalId: string, updates: Partial<Goal>): Goal | null {
    const goals = this.getAllGoals();
    const goalIndex = goals.findIndex(g => g.id === goalId);
    
    if (goalIndex === -1) return null;
    
    goals[goalIndex] = {
      ...goals[goalIndex],
      ...updates,
      updatedAt: new Date()
    };
    
    setStorage(this.STORAGE_KEY, goals);
    return goals[goalIndex];
  }

  static updateProgress(goalId: string, newValue: number): Goal | null {
    const goals = this.getAllGoals();
    const goal = goals.find(g => g.id === goalId);
    
    if (!goal) return null;
    
    goal.currentValue = newValue;
    goal.updatedAt = new Date();
    
    // Check if goal is completed
    if (newValue >= goal.targetValue && goal.status === 'active') {
      goal.status = 'completed';
      goal.completedAt = new Date();
    } else if (newValue < goal.targetValue && goal.status === 'completed') {
      goal.status = 'active';
      goal.completedAt = undefined;
    }
    
    setStorage(this.STORAGE_KEY, goals);
    return goal;
  }

  static deleteGoal(goalId: string): boolean {
    const goals = this.getAllGoals();
    const filteredGoals = goals.filter(g => g.id !== goalId);
    
    if (filteredGoals.length === goals.length) return false;
    
    setStorage(this.STORAGE_KEY, filteredGoals);
    return true;
  }

  static getGoalsByType(type: Goal['type']): Goal[] {
    return this.getAllGoals().filter(goal => goal.type === type);
  }

  static getActiveGoals(): Goal[] {
    return this.getAllGoals().filter(goal => goal.status === 'active');
  }

  static getCompletedGoals(): Goal[] {
    return this.getAllGoals().filter(goal => goal.status === 'completed');
  }

  static getGoalsByPriority(priority: Goal['priority']): Goal[] {
    return this.getAllGoals().filter(goal => goal.priority === priority);
  }

  static getOverdueGoals(): Goal[] {
    const now = new Date();
    return this.getAllGoals().filter(goal => 
      goal.status === 'active' && 
      goal.deadline && 
      goal.deadline < now
    );
  }

  static getGoalsNearDeadline(daysAhead: number = 7): Goal[] {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + daysAhead);
    
    return this.getAllGoals().filter(goal =>
      goal.status === 'active' &&
      goal.deadline &&
      goal.deadline <= futureDate &&
      goal.deadline > new Date()
    );
  }

  static getGoalProgress(goalId: string): number | null {
    const goal = this.getAllGoals().find(g => g.id === goalId);
    if (!goal) return null;
    
    return (goal.currentValue / goal.targetValue) * 100;
  }

  static getOverallProgress(): {
    totalGoals: number;
    activeGoals: number;
    completedGoals: number;
    completionRate: number;
    averageProgress: number;
  } {
    const goals = this.getAllGoals();
    const activeGoals = goals.filter(g => g.status === 'active');
    const completedGoals = goals.filter(g => g.status === 'completed');
    
    const totalProgress = activeGoals.reduce((sum, goal) => 
      sum + (goal.currentValue / goal.targetValue) * 100, 0
    );
    
    return {
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      completionRate: goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0,
      averageProgress: activeGoals.length > 0 ? totalProgress / activeGoals.length : 0
    };
  }

  private static generateId(): string {
    return `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}