import React, { useState, useEffect } from 'react';
import { TrendingUp, Target, Flame, BarChart3, Calendar, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ProgressEngine } from '@/services/ProgressEngine';
import { StrengthBarView } from '@/components/StrengthBarView';
import { WeeklyRing } from '@/components/WeeklyRing';
import MiniChart from '@/components/MiniChart';

export function ProgressOverview() {
  const [currentXP, setCurrentXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    loadProgressData();
  }, []);

  const loadProgressData = () => {
    setCurrentXP(ProgressEngine.currentXP());
    setCurrentLevel(ProgressEngine.currentLevel());
    setCurrentStreak(ProgressEngine.currentStreak());
  };

  const mainMetrics = [
    {
      icon: TrendingUp,
      title: "Volume Total",
      value: "52.3 ton",
      description: "Peso total movimentado este mês",
      change: "+8.5%",
      changeType: "positive"
    },
    {
      icon: Target,
      title: "1RM Estimado",
      value: "Supino 95kg",
      description: "Sua força máxima estimada",
      change: "+5kg",
      changeType: "positive"
    },
    {
      icon: Flame,
      title: "Streak Atual",
      value: `${currentStreak} dias`,
      description: "Sequência de treinos consecutivos",
      change: "Recorde: 12 dias",
      changeType: "neutral"
    },
    {
      icon: BarChart3,
      title: "Média RPE",
      value: "7.8",
      description: "Intensidade média dos treinos",
      change: "Zona ideal",
      changeType: "positive"
    }
  ];

  const weeklyGoals = [
    { name: "Treinos", current: 3, target: 4, color: "hsl(var(--accent))" },
    { name: "Volume", current: 12500, target: 15000, color: "hsl(var(--accent-2))" },
    { name: "Consistência", current: 75, target: 80, color: "hsl(var(--success))" }
  ];

  return (
    <div className="space-y-6">
      {/* Level Card */}
      <Card className="glass border-accent/20">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl text-txt">Nível {currentLevel}</CardTitle>
              <p className="text-txt-2 text-sm">Guerreiro do Ferro</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-accent to-accent-2"></div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <StrengthBarView />
        </CardContent>
      </Card>

      {/* Main Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {mainMetrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <Card key={metric.title} className="glass hover:bg-white/5 transition-all cursor-pointer group">
              <CardContent className="p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-accent/20 group-hover:scale-110 transition-transform">
                    <Icon className="w-4 h-4 text-accent" />
                  </div>
                  <span className="text-sm font-medium text-txt-2 flex-1 truncate">
                    {metric.title}
                  </span>
                </div>
                
                <div className="space-y-1">
                  <div className="text-xl font-bold text-accent">
                    {metric.value}
                  </div>
                  <p className="text-xs text-txt-2">
                    {metric.description}
                  </p>
                  <div className="flex items-center gap-1">
                    <Badge 
                      className={`text-xs ${
                        metric.changeType === 'positive' 
                          ? 'bg-success/20 text-success' 
                          : metric.changeType === 'negative'
                            ? 'bg-error/20 text-error'
                            : 'bg-accent/20 text-accent'
                      }`}
                    >
                      {metric.change}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Progress Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Goals */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-txt">
              <Calendar className="w-5 h-5 text-accent" />
              Metas Semanais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <WeeklyRing />
            
            <div className="space-y-3">
              {weeklyGoals.map((goal) => (
                <div key={goal.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-txt-2">{goal.name}</span>
                    <span className="text-txt">
                      {goal.name === 'Volume' 
                        ? `${(goal.current / 1000).toFixed(1)}k / ${(goal.target / 1000).toFixed(1)}k kg`
                        : `${goal.current} / ${goal.target}${goal.name === 'Consistência' ? '%' : ''}`
                      }
                    </span>
                  </div>
                  <Progress 
                    value={(goal.current / goal.target) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Strength Progress */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-txt">
              <Zap className="w-5 h-5 text-accent" />
              Evolução de Força
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MiniChart
              series={[{
                name: "Supino Reto",
                data: [85, 88, 90, 87, 92, 95]
              }]}
            />
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="glass text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent mb-1">28</div>
            <div className="text-xs text-txt-2">Treinos este mês</div>
          </CardContent>
        </Card>
        
        <Card className="glass text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent mb-1">93%</div>
            <div className="text-xs text-txt-2">Consistência</div>
          </CardContent>
        </Card>
        
        <Card className="glass text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent mb-1">12</div>
            <div className="text-xs text-txt-2">Recordes pessoais</div>
          </CardContent>
        </Card>
        
        <Card className="glass text-center">
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-accent mb-1">4.8</div>
            <div className="text-xs text-txt-2">Avaliação média</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}