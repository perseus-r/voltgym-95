import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Minus } from "lucide-react";
import { Exercise } from "@/lib/api";

interface ExerciseSessionProps {
  exercise: Exercise;
  onUpdate?: (exercise: Exercise) => void;
  onComplete: () => void;
  onNextExercise: () => void;
}

export function ExerciseSession({ exercise, onUpdate, onComplete, onNextExercise }: ExerciseSessionProps) {
  const [currentWeight, setCurrentWeight] = useState(exercise.weight || 0);
  const [rpe, setRpe] = useState(exercise.rpe || 7);
  const [notes, setNotes] = useState(exercise.notes || '');

  const weightIncrements = [2.5, 5, 10, 20];

  const updateWeight = (increment: number) => {
    const newWeight = currentWeight + increment;
    setCurrentWeight(newWeight);
    onUpdate?.({ ...exercise, weight: newWeight, rpe, notes });
  };

  const handleRpeChange = (newRpe: number) => {
    setRpe(newRpe);
    onUpdate?.({ ...exercise, weight: currentWeight, rpe: newRpe, notes });
  };

  const handleNotesChange = (newNotes: string) => {
    setNotes(newNotes);
    onUpdate?.({ ...exercise, weight: currentWeight, rpe, notes: newNotes });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--txt)' }}>{exercise.name}</h3>
        <div 
          className="inline-block px-3 py-1 rounded-full text-sm font-medium"
          style={{ 
            backgroundColor: 'rgba(255,255,255,0.1)', 
            color: 'var(--txt-2)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {exercise.sets} séries × {exercise.reps} reps
        </div>
      </div>

      {/* Enhanced Weight Control */}
      <div className="glass-card p-6">
        <label className="text-lg font-semibold mb-4 block text-txt">💪 Carga</label>
        
        {/* Current Weight Display */}
        <div className="text-center mb-6">
          <div className="text-5xl font-bold text-gradient mb-2">
            {currentWeight}
            <span className="text-2xl text-txt-2 ml-2">kg</span>
          </div>
          <div className="text-sm text-txt-3">Peso atual</div>
        </div>

        {/* Quick Weight Selector */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[40, 50, 60, 70, 80, 90, 100, 120].map((weight) => (
            <button
              key={weight}
              className={`p-3 rounded-xl font-medium transition-all ${
                currentWeight === weight 
                  ? 'bg-accent text-accent-ink' 
                  : 'glass-button hover:bg-white/10'
              }`}
              onClick={() => setCurrentWeight(weight)}
            >
              {weight}kg
            </button>
          ))}
        </div>

        {/* Fine Adjustments */}
        <div className="flex justify-center gap-2 mb-4">
          {weightIncrements.map((increment) => (
            <button
              key={`minus-${increment}`}
              className="glass-button p-3 rounded-xl font-medium transition-all hover:scale-105"
              onClick={() => updateWeight(-increment)}
            >
              <Minus className="w-4 h-4 mr-1 inline" />
              {increment}
            </button>
          ))}
          {weightIncrements.map((increment) => (
            <button
              key={increment}
              className="glass-button p-3 rounded-xl font-medium transition-all hover:scale-105"
              onClick={() => updateWeight(increment)}
            >
              <Plus className="w-4 h-4 mr-1 inline" />
              {increment}
            </button>
          ))}
        </div>

        {/* Manual Input */}
        <div className="flex items-center justify-center gap-2">
          <input
            type="number"
            value={currentWeight}
            onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 0)}
            className="w-20 text-center font-bold text-lg rounded-lg px-3 py-2 bg-input-bg border border-input-border text-txt focus:border-accent"
            placeholder="kg"
          />
          <span className="text-txt-2">kg (manual)</span>
        </div>
      </div>

      {/* RPE */}
      <div>
        <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--txt)' }}>RPE (1-10)</label>
        <div className="flex gap-1 flex-wrap">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((value) => (
            <button
              key={value}
              className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                rpe === value 
                  ? 'text-white' 
                  : 'glass hover:bg-white/5'
              }`}
              style={rpe === value ? {
                backgroundColor: 'var(--accent)',
                color: 'var(--accent-ink)'
              } : {
                color: 'var(--txt)'
              }}
              onClick={() => handleRpeChange(value)}
            >
              {value}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--txt)' }}>Notas</label>
        <textarea
          value={notes}
          onChange={(e) => handleNotesChange(e.target.value)}
          placeholder="Observações sobre a série..."
          className="w-full min-h-[80px] rounded-lg px-3 py-2 resize-none"
          style={{ 
            backgroundColor: 'var(--glass-bg)', 
            border: '1px solid var(--glass-brd)',
            color: 'var(--txt)'
          }}
        />
      </div>

      <div className="flex gap-3">
        <button 
          onClick={onComplete}
          className="flex-1 py-3 px-4 rounded-xl font-semibold transition-all hover:bg-white/90"
          style={{ 
            backgroundColor: 'var(--accent)', 
            color: 'var(--accent-ink)'
          }}
        >
          Finalizar Exercício
        </button>
        <button 
          onClick={onNextExercise}
          className="glass py-3 px-4 rounded-xl font-medium transition-all hover:bg-white/5"
          style={{ color: 'var(--txt)' }}
        >
          Próximo Exercício
        </button>
      </div>
      
      <div className="flex justify-center">
        <button 
          onClick={onComplete}
          className="text-sm text-txt-3 hover:text-txt-2 transition-colors"
        >
          Fechar Sessão
        </button>
      </div>
    </div>
  );
}