import { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, BarChart3, Calendar, 
  Target, Clock, Zap, Activity 
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getStorage } from '@/lib/storage';

interface AdvancedStatsProps {
  className?: string;
}

export function AdvancedStats({ className = "" }: AdvancedStatsProps) {
  const [activeTab, setActiveTab] = useState('overview');

  const workoutHistory = getStorage('bora_hist_v1', []);

  const stats = useMemo(() => {
    if (workoutHistory.length === 0) {
      return {
        totalWorkouts: 0,
        totalVolume: 0,
        avgDuration: 0,
        avgRPE: 0,
        consistency: 0,
        favoriteExercises: [],
        weeklyData: [],
        volumeProgression: [],
        exerciseDistribution: [],
        monthlyComparison: [],
        strengthProgress: {}
      };
    }

    // Basic metrics
    const totalWorkouts = workoutHistory.length;
    const totalVolume = workoutHistory.reduce((sum: number, session: any) => {
      return sum + (session.items?.reduce((s: number, item: any) => s + (item.carga || 0), 0) || 0);
    }, 0);

    const avgRPE = workoutHistory.reduce((sum: number, session: any) => {
      const sessionAvgRPE = session.items?.reduce((s: number, item: any) => s + (item.rpe || 0), 0) / (session.items?.length || 1);
      return sum + sessionAvgRPE;
    }, 0) / totalWorkouts;

    // Weekly consistency data
    const last12Weeks = Array.from({ length: 12 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (i * 7));
      const startOfWeek = new Date(date);
      startOfWeek.setDate(date.getDate() - date.getDay());
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      const weekWorkouts = workoutHistory.filter((session: any) => {
        const sessionDate = new Date(session.ts);
        return sessionDate >= startOfWeek && sessionDate <= endOfWeek;
      });

      return {
        week: `Sem ${12 - i}`,
        workouts: weekWorkouts.length,
        volume: weekWorkouts.reduce((sum: number, session: any) => 
          sum + (session.items?.reduce((s: number, item: any) => s + (item.carga || 0), 0) || 0), 0),
        target: 4
      };
    }).reverse();

    // Volume progression over time
    const volumeProgression = workoutHistory.slice(-30).map((session: any, index: number) => ({
      session: `#${index + 1}`,
      volume: session.items?.reduce((sum: number, item: any) => sum + (item.carga || 0), 0) || 0,
      date: new Date(session.ts).toLocaleDateString()
    }));

    // Exercise distribution
    const exerciseCount: Record<string, number> = {};
    workoutHistory.forEach((session: any) => {
      session.items?.forEach((item: any) => {
        if (item.name) {
          exerciseCount[item.name] = (exerciseCount[item.name] || 0) + 1;
        }
      });
    });

    const exerciseDistribution = Object.entries(exerciseCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 8)
      .map(([name, count], index) => ({
        name: name.length > 15 ? name.substring(0, 15) + '...' : name,
        value: count,
        fill: `hsl(${(index * 45) % 360}, 70%, 60%)`
      }));

    // Strength progress for main lifts
    const mainLifts = ['supino', 'agachamento', 'levantamento terra', 'desenvolvimento'];
    const strengthProgress: Record<string, any[]> = {};

    mainLifts.forEach(lift => {
      const liftData = workoutHistory
        .filter((session: any) => 
          session.items?.some((item: any) => 
            item.name?.toLowerCase().includes(lift.toLowerCase())
          )
        )
        .map((session: any) => {
          const liftItem = session.items.find((item: any) => 
            item.name?.toLowerCase().includes(lift.toLowerCase())
          );
          return {
            date: new Date(session.ts).toLocaleDateString(),
            weight: liftItem?.carga || 0,
            rpe: liftItem?.rpe || 0
          };
        })
        .slice(-10);

      if (liftData.length > 0) {
        strengthProgress[lift] = liftData;
      }
    });

    return {
      totalWorkouts,
      totalVolume,
      avgRPE: Math.round(avgRPE * 10) / 10,
      consistency: Math.round((totalWorkouts / Math.max(1, getWeeksSinceStart(workoutHistory))) * 10) / 10,
      weeklyData: last12Weeks,
      volumeProgression,
      exerciseDistribution,
      strengthProgress
    };
  }, [workoutHistory]);

  const getWeeksSinceStart = (history: any[]) => {
    if (history.length === 0) return 1;
    const firstWorkout = new Date(history[0].ts);
    const now = new Date();
    return Math.max(1, Math.ceil((now.getTime() - firstWorkout.getTime()) / (7 * 24 * 60 * 60 * 1000)));
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, trend }: any) => (
    <Card className="glass-card p-4">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-txt-3">
            <Icon className="w-4 h-4" />
            <span className="text-sm font-medium">{title}</span>
          </div>
          <div className="text-2xl font-bold text-txt">{value}</div>
          {subtitle && (
            <div className="text-sm text-txt-2">{subtitle}</div>
          )}
        </div>
        {trend && (
          <Badge className={`${trend > 0 ? 'bg-success/20 text-success' : 'bg-error/20 text-error'}`}>
            {trend > 0 ? <TrendingUp className="w-3 h-3 mr-1" /> : <TrendingDown className="w-3 h-3 mr-1" />}
            {Math.abs(trend)}%
          </Badge>
        )}
      </div>
    </Card>
  );

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gradient">
          Estatísticas Avançadas
        </h2>
        <Badge className="glass-button">
          {stats.totalWorkouts} treinos analisados
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 glass-card">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="progress">Progressão</TabsTrigger>
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="exercises">Exercícios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
              icon={BarChart3}
              title="Total de Treinos"
              value={stats.totalWorkouts}
              subtitle="Desde o início"
            />
            <StatCard
              icon={Target}
              title="Volume Total"
              value={`${(stats.totalVolume / 1000).toFixed(1)}t`}
              subtitle="Peso levantado"
            />
            <StatCard
              icon={Zap}
              title="RPE Médio"
              value={stats.avgRPE}
              subtitle="Intensidade"
            />
            <StatCard
              icon={Activity}
              title="Consistência"
              value={`${stats.consistency}/sem`}
              subtitle="Treinos por semana"
            />
          </div>

          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-txt">Consistência Semanal</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={stats.weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="week" stroke="#8892b0" />
                <YAxis stroke="#8892b0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--line))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="workouts" 
                  stroke="hsl(var(--accent))" 
                  fill="hsl(var(--accent) / 0.3)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="hsl(var(--accent-2))" 
                  strokeDasharray="5 5"
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <div className="grid gap-4">
            {Object.entries(stats.strengthProgress).map(([exercise, data]) => (
              <Card key={exercise} className="glass-card p-6">
                <h3 className="text-lg font-semibold mb-4 text-txt capitalize">
                  Progresso - {exercise}
                </h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="date" stroke="#8892b0" />
                    <YAxis stroke="#8892b0" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))', 
                        border: '1px solid hsl(var(--line))',
                        borderRadius: '8px'
                      }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="weight" 
                      stroke="hsl(var(--accent))" 
                      strokeWidth={3}
                      dot={{ fill: 'hsl(var(--accent))', strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="volume" className="space-y-4">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-txt">Evolução do Volume</h3>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart data={stats.volumeProgression}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis dataKey="session" stroke="#8892b0" />
                <YAxis stroke="#8892b0" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))', 
                    border: '1px solid hsl(var(--line))',
                    borderRadius: '8px'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="volume" 
                  stroke="hsl(var(--accent-2))" 
                  fill="hsl(var(--accent-2) / 0.3)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </TabsContent>

        <TabsContent value="exercises" className="space-y-4">
          <Card className="glass-card p-6">
            <h3 className="text-lg font-semibold mb-4 text-txt">Distribuição de Exercícios</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={stats.exerciseDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={120}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {stats.exerciseDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="space-y-2">
                {stats.exerciseDistribution.map((exercise, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded bg-surface/50">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-3 h-3 rounded-full" 
                        style={{ backgroundColor: exercise.fill }}
                      />
                      <span className="text-sm text-txt-2">{exercise.name}</span>
                    </div>
                    <span className="text-sm font-medium text-txt">{exercise.value}x</span>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}