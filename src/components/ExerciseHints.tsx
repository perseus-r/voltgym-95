import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";
import { getHintForExercise } from "@/lib/hints";
import { useState } from "react";

interface ExerciseHintsProps {
  exerciseName: string | null;
}

export function ExerciseHints({ exerciseName }: ExerciseHintsProps) {
  const [expanded, setExpanded] = useState(false);
  
  if (!exerciseName) {
    return (
      <div className="glass-card p-4 md:p-6">
        <div className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-lg transition-colors"
             onClick={() => setExpanded(!expanded)}>
          <div className="flex items-center gap-2 text-txt-3">
            <Lightbulb className="w-5 h-5" />
            <span className="text-sm font-medium">Dicas de Treino</span>
          </div>
          <Button variant="ghost" size="sm" className="text-accent hover:bg-accent/20">
            Ver Dicas Gerais
          </Button>
        </div>
        
        {expanded && (
          <div className="mt-4 pt-4 border-t border-line/20">
            <div className="space-y-3">
              <div className="text-sm text-txt-2">
                <h4 className="font-semibold text-accent mb-2">💡 Dicas Gerais de Treino</h4>
                <ul className="space-y-1">
                  <li>• Mantenha a postura correta durante todo o movimento</li>
                  <li>• Respire adequadamente: expire no esforço, inspire no relaxamento</li>
                  <li>• Foque na conexão mente-músculo</li>
                  <li>• Respeite o tempo de descanso entre as séries</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  const hint = getHintForExercise(exerciseName);

  if (!hint) {
    return (
      <div className="glass-card p-6">
        <div className="flex items-center gap-2 text-txt-3">
          <Lightbulb className="w-5 h-5" />
          <span className="text-sm">Nenhuma dica disponível para este exercício</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div 
        className="flex items-center justify-between cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-accent" />
          <span className="font-semibold text-txt">{hint.exercise}</span>
          <Badge variant="outline" className="text-xs bg-surface border-line text-txt-2">
            {hint.focus}
          </Badge>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-txt-2" />
        ) : (
          <ChevronDown className="w-4 h-4 text-txt-2" />
        )}
      </div>
      
      {expanded && (
        <div className="mt-4 space-y-4">
          <div>
            <h4 className="text-sm font-semibold text-accent mb-2">✅ Dicas de Execução</h4>
            <ul className="text-sm text-txt-2 space-y-1">
              {hint.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-sm font-semibold text-error mb-2">❌ Evite</h4>
            <ul className="text-sm text-txt-2 space-y-1">
              {hint.common_mistakes.map((mistake, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-error">•</span>
                  <span>{mistake}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}