import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Target, Zap } from "lucide-react";

interface ExerciseInstructionsProps {
  exerciseName: string;
  instructions?: string[];
  formTips?: string[];
  equipment?: string;
  difficulty?: number;
  primaryMuscles?: string[];
  secondaryMuscles?: string[];
}

export function ExerciseInstructions({ 
  exerciseName, 
  instructions = [], 
  formTips = [],
  equipment,
  difficulty = 2,
  primaryMuscles = [],
  secondaryMuscles = []
}: ExerciseInstructionsProps) {
  
  const getDifficultyColor = (level: number) => {
    if (level <= 1) return 'bg-green-500/10 text-green-500 border-green-500/20';
    if (level <= 2) return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
    if (level <= 3) return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    return 'bg-red-500/10 text-red-500 border-red-500/20';
  };

  const getDifficultyText = (level: number) => {
    if (level <= 1) return 'Iniciante';
    if (level <= 2) return 'Básico';
    if (level <= 3) return 'Intermediário';
    return 'Avançado';
  };

  // Instruções padrão baseadas no nome do exercício
  const getDefaultInstructions = (name: string): string[] => {
    const nameUpper = name.toUpperCase();
    
    if (nameUpper.includes('SUPINO')) {
      return [
        'Deite-se no banco com os pés firmes no chão',
        'Posicione as mãos na barra com pegada firme',
        'Mantenha as escápulas retraídas e peito para fora',
        'Abaixe a barra controladamente até o peito',
        'Empurre a barra para cima em linha reta',
        'Mantenha respiração controlada durante o movimento'
      ];
    }
    
    if (nameUpper.includes('AGACHAMENTO')) {
      return [
        'Posicione os pés na largura dos ombros',
        'Mantenha a coluna ereta e core contraído',
        'Desça flexionando quadris e joelhos simultaneamente',
        'Desça até os quadris ficarem abaixo dos joelhos',
        'Suba empurrando o chão com os pés',
        'Mantenha os joelhos alinhados com os pés'
      ];
    }
    
    if (nameUpper.includes('REMADA')) {
      return [
        'Posicione-se com coluna neutra',
        'Segure a barra/peso com pegada firme',
        'Puxe o peso em direção ao abdômen/peito',
        'Contraia as escápulas no final do movimento',
        'Volte controladamente à posição inicial',
        'Mantenha o core contraído durante todo movimento'
      ];
    }
    
    if (nameUpper.includes('ROSCA')) {
      return [
        'Mantenha os cotovelos fixos ao lado do corpo',
        'Segure o peso com pegada firme',
        'Flexione os antebraços controladamente',
        'Contraia o bíceps no topo do movimento',
        'Volte lentamente à posição inicial',
        'Evite balançar o corpo para ajudar'
      ];
    }
    
    return [
      'Posicione-se corretamente para o exercício',
      'Mantenha boa postura durante todo movimento',
      'Execute o movimento com controle total',
      'Respire adequadamente durante a execução',
      'Mantenha a técnica correta em todas as repetições'
    ];
  };

  const getDefaultTips = (name: string): string[] => {
    const nameUpper = name.toUpperCase();
    
    if (nameUpper.includes('SUPINO')) {
      return [
        'Não arqueie excessivamente as costas',
        'Mantenha os pés sempre no chão',
        'Use um spotter para cargas pesadas',
        'Aqueça bem antes de começar'
      ];
    }
    
    if (nameUpper.includes('AGACHAMENTO')) {
      return [
        'Não deixe os joelhos colapsarem para dentro',
        'Olhe sempre para frente, nunca para baixo',
        'Comece com peso do corpo antes de adicionar carga',
        'Use tênis apropriado com boa aderência'
      ];
    }
    
    if (nameUpper.includes('ROSCA')) {
      return [
        'Foque na contração muscular, não no peso',
        'Evite usar impulso do corpo',
        'Varie a pegada ocasionalmente',
        'Não trave os cotovelos totalmente'
      ];
    }
    
    return [
      'Comece sempre com aquecimento adequado',
      'Foque na qualidade, não na quantidade',
      'Hidrate-se durante o treino',
      'Descanse adequadamente entre séries'
    ];
  };

  const finalInstructions = instructions.length > 0 ? instructions : getDefaultInstructions(exerciseName);
  const finalTips = formTips.length > 0 ? formTips : getDefaultTips(exerciseName);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-txt">{exerciseName}</h3>
        
        <div className="flex flex-wrap gap-3">
          {equipment && (
            <Badge variant="outline" className="border-accent/30 text-accent">
              {equipment}
            </Badge>
          )}
          <Badge className={`${getDifficultyColor(difficulty)} border font-medium`}>
            {getDifficultyText(difficulty)}
          </Badge>
        </div>
      </div>

      {/* Muscle Groups */}
      {(primaryMuscles.length > 0 || secondaryMuscles.length > 0) && (
        <Card className="liquid-glass p-4 border border-line/20">
          <div className="space-y-3">
            {primaryMuscles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-accent" />
                  <span className="text-sm font-semibold text-txt">Músculos Principais</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {primaryMuscles.map((muscle, idx) => (
                    <Badge key={idx} className="bg-accent/20 text-accent border-accent/30">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {secondaryMuscles.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-txt-2" />
                  <span className="text-sm font-semibold text-txt-2">Músculos Secundários</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {secondaryMuscles.map((muscle, idx) => (
                    <Badge key={idx} variant="outline" className="border-line/50 text-txt-2">
                      {muscle}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Execution Steps */}
      <Card className="liquid-glass p-6 border border-line/20">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle className="w-5 h-5 text-accent" />
          <h4 className="text-lg font-semibold text-txt">Como Executar</h4>
        </div>
        
        <div className="space-y-3">
          {finalInstructions.map((instruction, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent text-sm font-bold flex items-center justify-center mt-0.5">
                {index + 1}
              </div>
              <p className="text-txt-2 leading-relaxed">{instruction}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Safety Tips */}
      <Card className="liquid-glass p-6 border border-line/20">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="w-5 h-5 text-yellow-500" />
          <h4 className="text-lg font-semibold text-txt">Dicas Importantes</h4>
        </div>
        
        <div className="space-y-3">
          {finalTips.map((tip, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="flex-shrink-0 w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
              <p className="text-txt-2 leading-relaxed">{tip}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* 3D Visualization Note */}
      <Card className="liquid-glass p-4 border border-accent/20 bg-gradient-to-r from-accent/5 to-accent-2/5">
        <div className="flex items-center gap-2 text-accent">
          <Zap className="w-4 h-4" />
          <span className="text-sm font-medium">
            Visualização 3D em desenvolvimento - Em breve você poderá ver demonstrações em 3D!
          </span>
        </div>
      </Card>
    </div>
  );
}