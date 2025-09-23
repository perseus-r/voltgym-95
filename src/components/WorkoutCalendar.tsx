import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { CalendarIcon, Dumbbell, TrendingUp, Zap, Trophy, Clock, Target } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { getWorkoutHistory, HistoryEntry } from '@/lib/storage';
import { WorkoutService } from '@/services/WorkoutService';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface WorkoutCalendarProps {
  className?: string;
}

interface CalendarWorkout {
  date: Date;
  workouts: HistoryEntry[];
  totalVolume: number;
  avgRpe: number;
  exerciseCount: number;
}

export function WorkoutCalendar({ className = "" }: WorkoutCalendarProps) {
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [workoutData, setWorkoutData] = useState<CalendarWorkout[]>([]);
  const [selectedWorkout, setSelectedWorkout] = useState<CalendarWorkout | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    if (user) {
      loadWorkoutData();
    }
  }, [user, currentMonth]);

  const loadWorkoutData = async () => {
    try {
      // Get both local and Supabase data
      const localHistory = getWorkoutHistory(user?.id || 'demo');
      const supabaseHistory = await WorkoutService.getUserWorkoutHistory(100);
      
      // Combine and process data
      const allWorkouts = [...localHistory];
      
      // Add Supabase data (avoiding duplicates)
      supabaseHistory.forEach(session => {
        const existsInLocal = localHistory.some(local => 
          Math.abs(new Date(local.ts).getTime() - new Date(session.started_at).getTime()) < 60000
        );
        
        if (!existsInLocal) {
          allWorkouts.push({
            ts: session.started_at,
            user: session.user_id,
            focus: session.focus,
            items: session.exercise_logs?.map(log => ({
              name: log.exercises.name,
              carga: log.set_logs?.[0]?.weight || 0,
              rpe: log.set_logs?.[0]?.rpe || 0,
              nota: log.notes || ''
            })) || []
          });
        }
      });

      // Group workouts by date
      const workoutsByDate = new Map<string, HistoryEntry[]>();
      
      allWorkouts.forEach(workout => {
        const dateKey = format(new Date(workout.ts), 'yyyy-MM-dd');
        if (!workoutsByDate.has(dateKey)) {
          workoutsByDate.set(dateKey, []);
        }
        workoutsByDate.get(dateKey)!.push(workout);
      });

      // Create calendar data for current month
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(currentMonth);
      const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

      const calendarData: CalendarWorkout[] = daysInMonth.map(date => {
        const dateKey = format(date, 'yyyy-MM-dd');
        const dayWorkouts = workoutsByDate.get(dateKey) || [];
        
        const totalVolume = dayWorkouts.reduce((sum, workout) => 
          sum + workout.items.reduce((itemSum, item) => itemSum + (item.carga || 0), 0), 0
        );
        
        const totalRpe = dayWorkouts.reduce((sum, workout) => 
          sum + workout.items.reduce((itemSum, item) => itemSum + (item.rpe || 0), 0), 0
        );
        const totalItems = dayWorkouts.reduce((sum, workout) => sum + workout.items.length, 0);
        const avgRpe = totalItems > 0 ? totalRpe / totalItems : 0;
        
        return {
          date,
          workouts: dayWorkouts,
          totalVolume,
          avgRpe,
          exerciseCount: totalItems
        };
      });

      setWorkoutData(calendarData);
    } catch (error) {
      console.error('Error loading workout data:', error);
    }
  };

  const getWorkoutForDate = (date: Date): CalendarWorkout | undefined => {
    return workoutData.find(workout => isSameDay(workout.date, date));
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    
    setSelectedDate(date);
    const workoutForDate = getWorkoutForDate(date);
    
    if (workoutForDate && workoutForDate.workouts.length > 0) {
      setSelectedWorkout(workoutForDate);
      setIsDetailModalOpen(true);
    }
  };

  const getDayClass = (date: Date) => {
    const workout = getWorkoutForDate(date);
    if (!workout || workout.workouts.length === 0) return '';
    
    // Color based on volume/intensity
    if (workout.totalVolume > 1000) return 'bg-accent text-accent-ink';
    if (workout.totalVolume > 500) return 'bg-yellow-500/20 text-yellow-400';
    return 'bg-green-500/20 text-green-400';
  };

  const getWorkoutSummary = () => {
    const thisMonth = workoutData.filter(day => day.workouts.length > 0);
    const totalWorkouts = thisMonth.reduce((sum, day) => sum + day.workouts.length, 0);
    const totalVolume = thisMonth.reduce((sum, day) => sum + day.totalVolume, 0);
    const avgRpe = thisMonth.length > 0 
      ? thisMonth.reduce((sum, day) => sum + day.avgRpe, 0) / thisMonth.length 
      : 0;

    return { totalWorkouts, totalVolume, avgRpe, activeDays: thisMonth.length };
  };

  const summary = getWorkoutSummary();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/20">
              <Dumbbell className="w-5 h-5 text-accent" />
            </div>
            <div>
              <div className="text-2xl font-bold text-txt">{summary.totalWorkouts}</div>
              <div className="text-sm text-txt-2">Treinos</div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-500/20">
              <Target className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-txt">{summary.activeDays}</div>
              <div className="text-sm text-txt-2">Dias Ativos</div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-500/20">
              <Trophy className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-txt">{Math.round(summary.totalVolume).toLocaleString()}</div>
              <div className="text-sm text-txt-2">Volume (kg)</div>
            </div>
          </div>
        </Card>

        <Card className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-red-500/20">
              <Zap className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-txt">{summary.avgRpe.toFixed(1)}</div>
              <div className="text-sm text-txt-2">RPE Médio</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <CalendarIcon className="w-6 h-6 text-accent" />
          <h2 className="text-xl font-bold text-txt">Calendário de Treinos</h2>
          <Badge className="bg-accent/20 text-accent">
            {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
          </Badge>
        </div>

        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
          month={currentMonth}
          onMonthChange={setCurrentMonth}
          className="rounded-md border-0"
          classNames={{
            day: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
            day_selected: "bg-accent text-accent-ink hover:bg-accent hover:text-accent-ink focus:bg-accent focus:text-accent-ink",
            day_today: "bg-surface text-accent-foreground font-semibold",
            day_outside: "text-txt-3",
            day_disabled: "text-txt-3 opacity-50",
            day_range_middle: "aria-selected:bg-accent/50 aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            ...Object.fromEntries(
              workoutData.map(workout => [
                `day_${format(workout.date, 'yyyy-MM-dd')}`,
                getDayClass(workout.date)
              ])
            )
          }}
          modifiers={{
            workout: workoutData
              .filter(day => day.workouts.length > 0)
              .map(day => day.date)
          }}
          modifiersClassNames={{
            workout: "relative after:absolute after:bottom-1 after:left-1/2 after:transform after:-translate-x-1/2 after:w-1 after:h-1 after:bg-accent after:rounded-full"
          }}
          locale={ptBR}
        />

        <div className="mt-6 p-4 bg-surface/30 rounded-lg">
          <h3 className="text-sm font-semibold text-txt mb-2">Legenda:</h3>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent"></div>
              <span className="text-txt-2">Volume Alto (&gt;1000kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-yellow-500"></div>
              <span className="text-txt-2">Volume Médio (500-1000kg)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500"></div>
              <span className="text-txt-2">Volume Baixo (&lt;500kg)</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Workout Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <CalendarIcon className="w-6 h-6 text-accent" />
              Treinos de {selectedWorkout && format(selectedWorkout.date, "d 'de' MMMM, yyyy", { locale: ptBR })}
            </DialogTitle>
          </DialogHeader>

          {selectedWorkout && (
            <div className="space-y-6">
              {/* Day Summary */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-accent">{selectedWorkout.workouts.length}</div>
                  <div className="text-sm text-txt-2">Sessões</div>
                </div>
                <div className="text-center p-3 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">{Math.round(selectedWorkout.totalVolume)}</div>
                  <div className="text-sm text-txt-2">Volume (kg)</div>
                </div>
                <div className="text-center p-3 bg-surface rounded-lg">
                  <div className="text-2xl font-bold text-green-400">{selectedWorkout.avgRpe.toFixed(1)}</div>
                  <div className="text-sm text-txt-2">RPE Médio</div>
                </div>
              </div>

              {/* Workout Sessions */}
              <div className="space-y-4">
                {selectedWorkout.workouts.map((workout, index) => (
                  <Card key={index} className="p-4 bg-surface/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-txt">{workout.focus}</h3>
                      <Badge variant="outline">
                        {format(new Date(workout.ts), 'HH:mm')}
                      </Badge>
                    </div>

                    <div className="space-y-2">
                      {workout.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="flex items-center justify-between p-2 bg-card/50 rounded">
                          <div className="flex items-center gap-2">
                            <Dumbbell className="w-4 h-4 text-accent" />
                            <span className="text-txt font-medium">{item.name}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-txt-2">
                            <span>{item.carga}kg</span>
                            <span>RPE {item.rpe}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {workout.items.some(item => item.nota) && (
                      <div className="mt-3 p-2 bg-accent/10 rounded text-sm">
                        <strong className="text-accent">Notas:</strong>
                        <div className="mt-1 text-txt-2">
                          {workout.items.filter(item => item.nota).map(item => item.nota).join('; ')}
                        </div>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}