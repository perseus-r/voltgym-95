import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  TrendingDown, 
  Pause, 
  Zap, 
  RotateCcw, 
  Clock, 
  Settings,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { ExerciseVariations } from '@/types/workout';

interface AdvancedSetControlsProps {
  variations: ExerciseVariations;
  onVariationToggle: (variation: keyof ExerciseVariations, enabled: boolean) => void;
  onDropSetStart: () => void;
  onRestPauseStart: () => void;
  onClusterStart: () => void;
  currentWeight: number;
  currentReps: number;
}

export function AdvancedSetControls({
  variations,
  onVariationToggle,
  onDropSetStart,
  onRestPauseStart,
  onClusterStart,
  currentWeight,
  currentReps
}: AdvancedSetControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [restPauseReps, setRestPauseReps] = useState(3);
  const [clusterRest, setClusterRest] = useState(15);
  const [tempoPattern, setTempoPattern] = useState("3-1-2-1");

  const variationOptions = [
    {
      key: 'dropSets' as const,
      label: 'Drop Sets',
      description: 'Reduzir peso após falha',
      icon: TrendingDown,
      color: 'text-red-400',
      action: onDropSetStart
    },
    {
      key: 'restPause' as const,
      label: 'Rest-Pause',
      description: 'Pausas curtas para reps extras',
      icon: Pause,
      color: 'text-yellow-400',
      action: onRestPauseStart
    },
    {
      key: 'clusters' as const,
      label: 'Cluster Sets',
      description: 'Mini-pausas intra-série',
      icon: Zap,
      color: 'text-blue-400',
      action: onClusterStart
    },
    {
      key: 'mechanicalDrops' as const,
      label: 'Drop Mecânico',
      description: 'Variar exercício para continuar',
      icon: RotateCcw,
      color: 'text-purple-400',
      action: () => {}
    },
    {
      key: 'tempoWork' as const,
      label: 'Trabalho de Tempo',
      description: 'Controle específico de cadência',
      icon: Clock,
      color: 'text-green-400',
      action: () => {}
    }
  ];

  const activeVariations = variationOptions.filter(option => variations[option.key]);

  return (
    <Card className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Settings className="w-4 h-4 text-accent" />
          <h4 className="font-medium text-txt">Variações Avançadas</h4>
          {activeVariations.length > 0 && (
            <Badge variant="secondary" className="bg-accent/20 text-accent text-xs">
              {activeVariations.length} ativa{activeVariations.length !== 1 ? 's' : ''}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-txt-2 hover:text-txt"
        >
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
      </div>

      {/* Quick Action Buttons - Always Visible */}
      {activeVariations.length > 0 && (
        <div className="flex gap-2 mb-3">
          {activeVariations.map((variation) => {
            const Icon = variation.icon;
            return (
              <Button
                key={variation.key}
                variant="outline"
                size="sm"
                onClick={variation.action}
                className={`glass-button ${variation.color} border-current`}
                disabled={!currentWeight || !currentReps}
              >
                <Icon className="w-3 h-3 mr-1" />
                {variation.label}
              </Button>
            );
          })}
        </div>
      )}

      {isExpanded && (
        <>
          <Separator className="mb-4" />
          
          {/* Variation Toggles */}
          <div className="space-y-3">
            {variationOptions.map((option) => {
              const Icon = option.icon;
              const isActive = variations[option.key];
              
              return (
                <div key={option.key} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? option.color : 'text-txt-2'}`} />
                    <div>
                      <div className={`text-sm font-medium ${isActive ? 'text-txt' : 'text-txt-2'}`}>
                        {option.label}
                      </div>
                      <div className="text-xs text-txt-2">
                        {option.description}
                      </div>
                    </div>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => onVariationToggle(option.key, checked)}
                  />
                </div>
              );
            })}
          </div>

          {/* Configuration Options */}
          {(variations.restPause || variations.clusters || variations.tempoWork) && (
            <>
              <Separator className="my-4" />
              <div className="space-y-3">
                <h5 className="text-sm font-medium text-txt-2">Configurações</h5>
                
                {variations.restPause && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-txt-2">Reps por pausa:</span>
                    <Input
                      type="number"
                      value={restPauseReps}
                      onChange={(e) => setRestPauseReps(Number(e.target.value))}
                      className="w-16 text-center h-8"
                      min={1}
                      max={10}
                    />
                  </div>
                )}
                
                {variations.clusters && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-txt-2">Descanso (seg):</span>
                    <Input
                      type="number"
                      value={clusterRest}
                      onChange={(e) => setClusterRest(Number(e.target.value))}
                      className="w-16 text-center h-8"
                      min={5}
                      max={60}
                    />
                  </div>
                )}
                
                {variations.tempoWork && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-txt-2">Padrão tempo:</span>
                    <Input
                      type="text"
                      value={tempoPattern}
                      onChange={(e) => setTempoPattern(e.target.value)}
                      className="w-20 text-center h-8 text-xs"
                      placeholder="3-1-2-1"
                    />
                  </div>
                )}
              </div>
            </>
          )}

          {/* Tips */}
          {isExpanded && (
            <>
              <Separator className="my-4" />
              <div className="text-xs text-txt-2 space-y-1">
                <div className="font-medium">Dicas:</div>
                <div>• Drop Sets: Execute até a falha, depois reduza 10-20% do peso</div>
                <div>• Rest-Pause: Pause 10-15s entre mini-séries</div>
                <div>• Clusters: Divida a série em blocos menores com descanso</div>
              </div>
            </>
          )}
        </>
      )}
    </Card>
  );
}