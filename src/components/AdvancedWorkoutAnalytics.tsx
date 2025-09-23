import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Zap, Calendar, Award, Users, Activity } from 'lucide-react';
import { getStorage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

export function AdvancedWorkoutAnalytics() {
  const { user } = useAuth();
  const [selectedTimeframe, setSelectedTimeframe] = useState('30d');
  
  const workoutHistory = getStorage('bora_hist_v1', []);
  
  const analytics = useMemo(() => {
    const now = new Date();
    let startDate = new Date();
    
    switch (selectedTimeframe) {
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const filteredSessions = workoutHistory.filter((session: any) => {
      const sessionDate = new Date(session.ts);
      return sessionDate >= startDate;
    });

    // Volume progression
    const volumeData = filteredSessions.map((session: any, index: number) => ({
      date: new Date(session.ts).toLocaleDateString('pt-BR'),
      volume: session.items?.reduce((sum: number, item: any) => sum + (item.carga || 0) * (parseInt(item.rpe) || 1), 0) || 0,
      session: index + 1
    }));

    // Muscle group distribution
    const muscleGroups: Record<string, number> = {};
    filteredSessions.forEach((session: any) => {
      const focus = session.focus || 'Geral';
      muscleGroups[focus] = (muscleGroups[focus] || 0) + 1;
    });

    const muscleGroupData = Object.entries(muscleGroups).map(([name, count]) => ({
      name,
      value: count,
      percentage: Math.round((count / filteredSessions.length) * 100)
    }));

    // Weekly consistency
    const weeklyData = [];
    for (let i = 0; i < 12; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - (i * 7));
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      const weekSessions = filteredSessions.filter((session: any) => {
        const sessionDate = new Date(session.ts);
        return sessionDate >= weekStart && sessionDate <= weekEnd;
      });

      weeklyData.unshift({
        week: `Sem ${12 - i}`,
        workouts: weekSessions.length,
        target: 4
      });
    }

    // RPE trends
    const rpeData = filteredSessions.map((session: any, index: number) => ({
      session: index + 1,
      avgRPE: session.items?.reduce((sum: number, item: any) => sum + (parseInt(item.rpe) || 7), 0) / (session.items?.length || 1) || 7,
      date: new Date(session.ts).toLocaleDateString('pt-BR')
    }));

    // Performance metrics
    const totalWorkouts = filteredSessions.length;
    const totalVolume = volumeData.reduce((sum, d) => sum + d.volume, 0);
    const avgRPE = rpeData.reduce((sum, d) => sum + d.avgRPE, 0) / (rpeData.length || 1);
    const consistency = Math.round((totalWorkouts / (selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : selectedTimeframe === '90d' ? 90 : 365)) * 100);

    return {
      volumeData,
      muscleGroupData,
      weeklyData,
      rpeData,
      metrics: {
        totalWorkouts,
        totalVolume: Math.round(totalVolume),
        avgRPE: Math.round(avgRPE * 10) / 10,
        consistency
      }
    };
  }, [workoutHistory, selectedTimeframe]);

  const colors = ['#7bdcff', '#00d4aa', '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-txt mb-2">Analytics Avançado</h2>
          <p className="text-txt-2">Insights detalhados do seu progresso</p>
        </div>
        
        <div className="flex gap-2">
          {['7d', '30d', '90d', '1y'].map((period) => (
            <Button
              key={period}
              variant={selectedTimeframe === period ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedTimeframe(period)}
              className={selectedTimeframe === period ? 'bg-accent text-accent-ink' : 'glass-button'}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="liquid-glass p-6 text-center border-accent/10">
          <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-3xl font-bold text-accent">{analytics.metrics.totalWorkouts}</div>
          <div className="text-sm text-txt-3">TREINOS</div>
        </Card>
        
        <Card className="liquid-glass p-6 text-center border-accent/10">
          <Zap className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-3xl font-bold text-accent">{analytics.metrics.totalVolume}kg</div>
          <div className="text-sm text-txt-3">VOLUME TOTAL</div>
        </Card>
        
        <Card className="liquid-glass p-6 text-center border-accent/10">
          <Target className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-3xl font-bold text-accent">{analytics.metrics.avgRPE}/10</div>
          <div className="text-sm text-txt-3">RPE MÉDIO</div>
        </Card>
        
        <Card className="liquid-glass p-6 text-center border-accent/10">
          <Award className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-3xl font-bold text-accent">{analytics.metrics.consistency}%</div>
          <div className="text-sm text-txt-3">CONSISTÊNCIA</div>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="volume" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="volume">Volume</TabsTrigger>
          <TabsTrigger value="consistency">Consistência</TabsTrigger>
          <TabsTrigger value="groups">Grupos</TabsTrigger>
          <TabsTrigger value="rpe">RPE</TabsTrigger>
        </TabsList>

        <TabsContent value="volume" className="space-y-4">
          <Card className="liquid-glass p-6">
            <h3 className="text-xl font-semibold text-txt mb-4">Progressão de Volume</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.volumeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a55" />
                  <XAxis dataKey="session" stroke="#c8d2ff" />
                  <YAxis stroke="#c8d2ff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141b34', 
                      border: '1px solid #1e2a55',
                      borderRadius: '8px',
                      color: '#e9efff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="volume" 
                    stroke="#7bdcff" 
                    strokeWidth={3}
                    dot={{ fill: '#7bdcff', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#7bdcff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="consistency" className="space-y-4">
          <Card className="liquid-glass p-6">
            <h3 className="text-xl font-semibold text-txt mb-4">Consistência Semanal</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={analytics.weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a55" />
                  <XAxis dataKey="week" stroke="#c8d2ff" />
                  <YAxis stroke="#c8d2ff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141b34', 
                      border: '1px solid #1e2a55',
                      borderRadius: '8px',
                      color: '#e9efff'
                    }} 
                  />
                  <Bar dataKey="workouts" fill="#7bdcff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="target" fill="#1e2a55" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="groups" className="space-y-4">
          <Card className="liquid-glass p-6">
            <h3 className="text-xl font-semibold text-txt mb-4">Distribuição por Grupo Muscular</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analytics.muscleGroupData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ percentage }) => `${percentage}%`}
                    >
                      {analytics.muscleGroupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#141b34', 
                        border: '1px solid #1e2a55',
                        borderRadius: '8px',
                        color: '#e9efff'
                      }} 
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              <div className="space-y-3">
                {analytics.muscleGroupData.map((group, index) => (
                  <div key={group.name} className="flex items-center justify-between p-3 bg-surface/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: colors[index % colors.length] }}
                      />
                      <span className="text-txt">{group.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="border-accent/30 text-accent">
                        {group.value} treinos
                      </Badge>
                      <span className="text-txt-3">{group.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="rpe" className="space-y-4">
          <Card className="liquid-glass p-6">
            <h3 className="text-xl font-semibold text-txt mb-4">Tendência de Intensidade (RPE)</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={analytics.rpeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e2a55" />
                  <XAxis dataKey="session" stroke="#c8d2ff" />
                  <YAxis domain={[1, 10]} stroke="#c8d2ff" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#141b34', 
                      border: '1px solid #1e2a55',
                      borderRadius: '8px',
                      color: '#e9efff'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="avgRPE" 
                    stroke="#00d4aa" 
                    strokeWidth={3}
                    dot={{ fill: '#00d4aa', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#00d4aa' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}