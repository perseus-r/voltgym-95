import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, Target, Zap, Calculator } from 'lucide-react';
import { LoadProgression } from '@/types/workout';

interface LoadProgressionControlsProps {
  progression: LoadProgression;
  onUpdate: (progression: LoadProgression) => void;
  autoEnabled: boolean;
  onAutoToggle: (enabled: boolean) => void;
  currentSet: number;
  lastRpe?: number;
  suggestedWeight: number;
  onApplySuggestion: () => void;
}

export function LoadProgressionControls({
  progression,
  onUpdate,
  autoEnabled,
  onAutoToggle,
  currentSet,
  lastRpe,
  suggestedWeight,
  onApplySuggestion
}: LoadProgressionControlsProps) {

  const getProgressionDescription = () => {
    switch (progression.type) {
      case 'linear':
        return `+${progression.increment}kg por série`;
      case 'percentage':
        return `+${progression.increment}% por série`;
      case 'rpe_based':
        return `Baseado no RPE (meta: ${progression.targetRpe || 8})`;
      case 'custom':
        return 'Configuração manual';
      default:
        return '';
    }
  };

  const getRpeAdvice = () => {
    if (!lastRpe) return null;
    
    if (lastRpe <= 6) {
      return { type: 'increase', message: 'RPE baixo - considere aumentar a carga', color: 'text-green-400' };
    } else if (lastRpe >= 9) {
      return { type: 'decrease', message: 'RPE alto - considere diminuir a carga', color: 'text-red-400' };
    } else {
      return { type: 'maintain', message: 'RPE ideal - manter ou aumentar levemente', color: 'text-accent' };
    }
  };

  const rpeAdvice = getRpeAdvice();

  return (
    <Card className="glass-card p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          <h4 className="font-medium text-txt">Progressão de Carga</h4>
        </div>
        <Switch
          checked={autoEnabled}
          onCheckedChange={onAutoToggle}
        />
      </div>

      {autoEnabled && (
        <>
          {/* Progression Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-txt-2">Tipo de Progressão</label>
            <Select
              value={progression.type}
              onValueChange={(value: LoadProgression['type']) => 
                onUpdate({ ...progression, type: value })
              }
            >
              <SelectTrigger className="glass-card border-glass-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linear">Linear (kg fixo)</SelectItem>
                <SelectItem value="percentage">Percentual (%)</SelectItem>
                <SelectItem value="rpe_based">Baseado em RPE</SelectItem>
                <SelectItem value="custom">Personalizado</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-txt-2">{getProgressionDescription()}</p>
          </div>

          {/* Increment Control */}
          {(progression.type === 'linear' || progression.type === 'percentage') && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-txt-2">
                Incremento {progression.type === 'percentage' ? '(%)' : '(kg)'}
              </label>
              <div className="px-3">
                <Slider
                  value={[progression.increment]}
                  onValueChange={([value]) => onUpdate({ ...progression, increment: value })}
                  min={progression.type === 'percentage' ? 1 : 1.25}
                  max={progression.type === 'percentage' ? 20 : 10}
                  step={progression.type === 'percentage' ? 1 : 1.25}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-txt-2">
                <span>{progression.type === 'percentage' ? '1%' : '1.25kg'}</span>
                <span className="font-medium">{progression.increment}{progression.type === 'percentage' ? '%' : 'kg'}</span>
                <span>{progression.type === 'percentage' ? '20%' : '10kg'}</span>
              </div>
            </div>
          )}

          {/* RPE Target */}
          {progression.type === 'rpe_based' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-txt-2">RPE Alvo</label>
              <div className="px-3">
                <Slider
                  value={[progression.targetRpe || 8]}
                  onValueChange={([value]) => onUpdate({ ...progression, targetRpe: value })}
                  min={6}
                  max={10}
                  step={0.5}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between text-xs text-txt-2">
                <span>6 (Fácil)</span>
                <span className="font-medium">RPE {progression.targetRpe || 8}</span>
                <span>10 (Máximo)</span>
              </div>
            </div>
          )}

          {/* Current Set Info */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-surface/50">
            <div className="flex items-center gap-1">
              <Target className="w-4 h-4 text-txt-2" />
              <span className="text-sm text-txt-2">Série {currentSet}</span>
            </div>
            
            {lastRpe && (
              <div className="flex items-center gap-1">
                <span className="text-sm text-txt-2">Último RPE:</span>
                <Badge variant="secondary" className="bg-accent/20 text-accent">
                  {lastRpe}
                </Badge>
              </div>
            )}
          </div>

          {/* RPE Advice */}
          {rpeAdvice && (
            <div className={`text-sm ${rpeAdvice.color} bg-surface/30 p-2 rounded-lg flex items-center gap-2`}>
              <Zap className="w-4 h-4" />
              {rpeAdvice.message}
            </div>
          )}

          {/* Weight Suggestion */}
          {suggestedWeight > 0 && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-accent/10 border border-accent/20">
              <div className="flex items-center gap-2">
                <Calculator className="w-4 h-4 text-accent" />
                <span className="text-sm text-txt">Peso sugerido: <strong>{suggestedWeight}kg</strong></span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onApplySuggestion}
                className="glass-button text-accent border-accent/50 hover:bg-accent/10"
              >
                Aplicar
              </Button>
            </div>
          )}
        </>
      )}
    </Card>
  );
}