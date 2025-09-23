import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Minus, Trash2, TrendingDown } from 'lucide-react';

interface DropSetManagerProps {
  currentWeight: number;
  onDropComplete: (drops: { weight: number; reps: number }[]) => void;
  onClose: () => void;
}

export function DropSetManager({ currentWeight, onDropComplete, onClose }: DropSetManagerProps) {
  const [drops, setDrops] = useState<{ weight: number; reps: number }[]>([
    { weight: Math.max(0, currentWeight - 10), reps: 0 }
  ]);

  const addDrop = () => {
    const lastWeight = drops[drops.length - 1]?.weight || currentWeight;
    setDrops(prev => [...prev, {
      weight: Math.max(0, lastWeight - 10),
      reps: 0
    }]);
  };

  const removeDrop = (index: number) => {
    setDrops(prev => prev.filter((_, i) => i !== index));
  };

  const updateDrop = (index: number, field: 'weight' | 'reps', value: number) => {
    setDrops(prev => prev.map((drop, i) => 
      i === index ? { ...drop, [field]: Math.max(0, value) } : drop
    ));
  };

  const suggestWeight = (index: number) => {
    const baseWeight = index === 0 ? currentWeight : drops[index - 1].weight;
    return Math.max(0, baseWeight - 10);
  };

  const handleComplete = () => {
    const validDrops = drops.filter(drop => drop.weight > 0 && drop.reps > 0);
    if (validDrops.length > 0) {
      onDropComplete(validDrops);
    }
    onClose();
  };

  return (
    <Card className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingDown className="w-5 h-5 text-accent" />
          <h3 className="text-lg font-semibold text-txt">Drop Set</h3>
        </div>
        <Badge variant="secondary" className="bg-accent/20 text-accent">
          Peso inicial: {currentWeight}kg
        </Badge>
      </div>

      <div className="space-y-4">
        {drops.map((drop, index) => (
          <div key={index} className="flex items-center gap-3 p-3 rounded-lg glass-card">
            <div className="flex items-center gap-2 flex-1">
              <div className="text-sm font-medium text-txt-2 min-w-[60px]">
                Drop {index + 1}:
              </div>
              
              {/* Weight Input */}
              <div className="flex items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8 glass-button"
                  onClick={() => updateDrop(index, 'weight', drop.weight - 2.5)}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <Input
                  type="number"
                  value={drop.weight}
                  onChange={(e) => updateDrop(index, 'weight', Number(e.target.value))}
                  className="w-20 text-center h-8"
                  placeholder="Peso"
                />
                
                <Button
                  variant="outline"
                  size="icon" 
                  className="h-8 w-8 glass-button"
                  onClick={() => updateDrop(index, 'weight', drop.weight + 2.5)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
                
                <span className="text-xs text-txt-2">kg</span>
              </div>

              {/* Reps Input */}
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  value={drop.reps}
                  onChange={(e) => updateDrop(index, 'reps', Number(e.target.value))}
                  className="w-16 text-center h-8"
                  placeholder="Reps"
                />
                <span className="text-xs text-txt-2">reps</span>
              </div>
            </div>

            {/* Suggest Weight */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => updateDrop(index, 'weight', suggestWeight(index))}
              className="glass-button text-xs h-8"
            >
              Sugerir
            </Button>

            {/* Remove Drop */}
            {drops.length > 1 && (
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeDrop(index)}
                className="h-8 w-8 glass-button text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            )}
          </div>
        ))}

        {/* Add Drop Button */}
        <Button
          variant="outline"
          onClick={addDrop}
          className="w-full glass-button"
          disabled={drops.length >= 4}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Drop {drops.length < 4 ? `(${4 - drops.length} restantes)` : '(Máximo atingido)'}
        </Button>
      </div>

      <Separator className="my-4" />

      {/* Summary */}
      <div className="space-y-2 mb-4">
        <h4 className="text-sm font-medium text-txt-2">Resumo:</h4>
        <div className="text-sm text-txt-2">
          {drops.filter(d => d.weight > 0 && d.reps > 0).length > 0 ? (
            <div className="space-y-1">
              {drops
                .filter(d => d.weight > 0 && d.reps > 0)
                .map((drop, i) => (
                  <div key={i} className="flex justify-between">
                    <span>Drop {i + 1}:</span>
                    <span>{drop.weight}kg × {drop.reps} reps</span>
                  </div>
                ))
              }
              <div className="pt-2 border-t border-line font-medium">
                Volume total: {drops.reduce((sum, d) => sum + (d.weight * d.reps), 0)}kg
              </div>
            </div>
          ) : (
            "Configure os drops para ver o resumo"
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onClose}
          className="flex-1 glass-button"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleComplete}
          disabled={drops.filter(d => d.weight > 0 && d.reps > 0).length === 0}
          className="flex-1 bg-accent hover:bg-accent/90 text-accent-ink"
        >
          Confirmar Drop Set
        </Button>
      </div>
    </Card>
  );
}