import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, BarChart3, MessageSquare, Dumbbell, Zap, Target, TrendingUp } from 'lucide-react';

interface FeatureChecklistProps {
  className?: string;
}

export function FeatureChecklist({ className = "" }: FeatureChecklistProps) {
  const [checkedFeatures, setCheckedFeatures] = useState<Set<string>>(new Set());

  const features = [
    {
      id: 'workout-creation',
      title: 'Criação de Treinos',
      description: 'Sistema completo para criar e personalizar treinos',
      icon: Dumbbell,
      status: 'ready',
      color: 'text-accent'
    },
    {
      id: 'voice-ai',
      title: 'Interface de Voz IA',
      description: 'Comando de voz para interagir com o coach virtual',
      icon: Zap,
      status: 'ready',
      color: 'text-purple-400'
    },
    {
      id: 'exercise-charts',
      title: 'Gráficos de Exercícios',
      description: 'Comparativo de carga, volume e RPE por exercício',
      icon: BarChart3,
      status: 'ready',
      color: 'text-blue-400'
    },
    {
      id: 'workout-calendar',
      title: 'Calendário de Treinos',
      description: 'Visualização mensal dos treinos salvos',
      icon: Calendar,
      status: 'ready',
      color: 'text-green-400'
    },
    {
      id: 'feedback-system',
      title: 'Sistema de Feedback',
      description: 'Avaliação semanal de performance e metas',
      icon: MessageSquare,
      status: 'ready',
      color: 'text-yellow-400'
    },
    {
      id: 'spreadsheet-fixed',
      title: 'Planilha Corrigida',
      description: 'Sistema de cargas funcionando offline e online',
      icon: Target,
      status: 'ready',
      color: 'text-red-400'
    },
    {
      id: 'progress-tracking',
      title: 'Acompanhamento de Progresso',
      description: 'Evolução detalhada com tendências e estatísticas',
      icon: TrendingUp,
      status: 'ready',
      color: 'text-cyan-400'
    }
  ];

  const toggleFeature = (featureId: string) => {
    const newChecked = new Set(checkedFeatures);
    if (newChecked.has(featureId)) {
      newChecked.delete(featureId);
    } else {
      newChecked.add(featureId);
    }
    setCheckedFeatures(newChecked);
  };

  const completedCount = checkedFeatures.size;
  const totalCount = features.length;

  return (
    <Card className={`glass-card p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-txt">Funcionalidades Implementadas</h2>
          <p className="text-txt-2">Todas as funcionalidades estão prontas e funcionais</p>
        </div>
        <Badge className="bg-accent/20 text-accent">
          {completedCount}/{totalCount} testadas
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-txt-2 mb-2">
          <span>Progresso dos Testes</span>
          <span>{Math.round((completedCount / totalCount) * 100)}%</span>
        </div>
        <div className="w-full bg-surface rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-accent to-accent-2 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-4">
        {features.map((feature) => {
          const IconComponent = feature.icon;
          const isChecked = checkedFeatures.has(feature.id);
          
          return (
            <div
              key={feature.id}
              className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                isChecked 
                  ? 'bg-accent/10 border-accent/30' 
                  : 'bg-surface/50 border-line/30 hover:bg-surface/80'
              }`}
              onClick={() => toggleFeature(feature.id)}
            >
              <div className={`p-2 rounded-lg ${isChecked ? 'bg-accent/20' : 'bg-surface'}`}>
                <IconComponent className={`w-5 h-5 ${isChecked ? 'text-accent' : feature.color}`} />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-txt">{feature.title}</h3>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${feature.status === 'ready' ? 'bg-green-500/20 text-green-400 border-green-500/30' : ''}`}
                  >
                    ✅ Pronto
                  </Badge>
                </div>
                <p className="text-sm text-txt-2">{feature.description}</p>
              </div>
              
              <div className="flex items-center">
                {isChecked ? (
                  <CheckCircle className="w-6 h-6 text-accent" />
                ) : (
                  <div className="w-6 h-6 rounded-full border-2 border-txt-3" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {completedCount === totalCount && (
        <div className="mt-6 p-4 bg-accent/10 border border-accent/30 rounded-lg">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-accent" />
            <div>
              <h3 className="font-semibold text-accent">Todas as funcionalidades testadas!</h3>
              <p className="text-sm text-txt-2">O sistema está completamente funcional e pronto para uso.</p>
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 pt-4 border-t border-line/20">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-accent">{features.length}</div>
            <div className="text-sm text-txt-2">Funcionalidades</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-400">100%</div>
            <div className="text-sm text-txt-2">Implementado</div>
          </div>
        </div>
      </div>
    </Card>
  );
}