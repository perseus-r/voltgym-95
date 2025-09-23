import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { User, Target, Dumbbell, Clock, Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

interface QuestionnaireData {
  name: string;
  age: number;
  weight: number;
  height: number;
  experience: 'iniciante' | 'intermediario' | 'avancado';
  goal: 'massa' | 'definicao' | 'forca' | 'resistencia';
  trainingDays: number;
  trainingTime: number;
  healthConditions: string;
  preferences: string;
}

interface UserQuestionnaireProps {
  onComplete: () => void;
}

export function UserQuestionnaire({ onComplete }: UserQuestionnaireProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [data, setData] = useState<Partial<QuestionnaireData>>({});
  const [isLoading, setIsLoading] = useState(false);
  const totalSteps = 5;

  const updateData = (newData: Partial<QuestionnaireData>) => {
    setData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleComplete = async () => {
    if (!isDataComplete() || !user) return;
    
    setIsLoading(true);
    
    try {
      // Salvar dados no Supabase
      const { error } = await supabase
        .from('profiles')
        .upsert({
          user_id: user.id,
          display_name: data.name,
          age: data.age,
          weight: data.weight,
          height: data.height,
          experience_level: data.experience,
          goal: data.goal,
          workout_location: 'academia', // valor padrão
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        console.error('Erro ao salvar perfil:', error);
        toast.error("Erro ao salvar perfil. Tente novamente.");
        return;
      }

      // Salvar dados extras no localStorage para uso complementar
      const trainingData = {
        trainingDays: data.trainingDays,
        trainingTime: data.trainingTime,
        healthConditions: data.healthConditions,
        preferences: data.preferences
      };
      
      localStorage.setItem(`training_prefs_${user.id}`, JSON.stringify(trainingData));
      
      toast.success("Perfil configurado com sucesso!", {
        description: "Bem-vindo ao VOLT FITNESS!"
      });
      
      onComplete();
    } catch (error) {
      console.error('Erro inesperado:', error);
      toast.error("Erro inesperado. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDataComplete = () => {
    return data.name && data.age && data.weight && data.height && 
           data.experience && data.goal && data.trainingDays && data.trainingTime;
  };

  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Progress Header */}
        <div className="liquid-glass p-6 mb-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-full bg-accent/20">
              <User className="w-6 h-6 text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-txt">Configuração do Perfil</h2>
              <p className="text-txt-2">Passo {step} de {totalSteps}</p>
            </div>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="liquid-glass p-8">
        {/* Step 1: Personal Info */}
        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-txt mb-2">Informações Pessoais</h3>
              <p className="text-txt-2">Vamos conhecer você melhor</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-txt">Nome</Label>
                <Input
                  value={data.name || ''}
                  onChange={(e) => updateData({ name: e.target.value })}
                  placeholder="Seu nome"
                  className="bg-input-bg border-input-border text-txt"
                />
              </div>
              <div>
                <Label className="text-txt">Idade</Label>
                <Input
                  type="number"
                  value={data.age || ''}
                  onChange={(e) => updateData({ age: parseInt(e.target.value) })}
                  placeholder="Anos"
                  className="bg-input-bg border-input-border text-txt"
                />
              </div>
              <div>
                <Label className="text-txt">Peso (kg)</Label>
                <Input
                  type="number"
                  value={data.weight || ''}
                  onChange={(e) => updateData({ weight: parseFloat(e.target.value) })}
                  placeholder="70"
                  className="bg-input-bg border-input-border text-txt"
                />
              </div>
              <div>
                <Label className="text-txt">Altura (cm)</Label>
                <Input
                  type="number"
                  value={data.height || ''}
                  onChange={(e) => updateData({ height: parseInt(e.target.value) })}
                  placeholder="175"
                  className="bg-input-bg border-input-border text-txt"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Experience Level */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Dumbbell className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-txt mb-2">💪 Nível de Experiência</h3>
              <p className="text-txt-2">Isso define sua "patente" inicial no app</p>
            </div>
            
            <RadioGroup 
              value={data.experience} 
              onValueChange={(value) => updateData({ experience: value as any })}
            >
              <div className="glass-card p-4 hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="iniciante" id="iniciante" />
                  <Label htmlFor="iniciante" className="text-txt cursor-pointer flex-1">
                    <div className="font-semibold">🌟 Recruta (Iniciante)</div>
                    <div className="text-sm text-txt-2">0-6 meses de treino</div>
                  </Label>
                </div>
              </div>
              
              <div className="glass-card p-4 hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="intermediario" id="intermediario" />
                  <Label htmlFor="intermediario" className="text-txt cursor-pointer flex-1">
                    <div className="font-semibold">⚡ Soldado (Intermediário)</div>
                    <div className="text-sm text-txt-2">6 meses - 2 anos de treino</div>
                  </Label>
                </div>
              </div>
              
              <div className="glass-card p-4 hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="avancado" id="avancado" />
                  <Label htmlFor="avancado" className="text-txt cursor-pointer flex-1">
                    <div className="font-semibold">🏆 Capitão (Avançado)</div>
                    <div className="text-sm text-txt-2">2+ anos de treino consistente</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 3: Goals */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Target className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-txt mb-2">🎯 Objetivo Principal</h3>
              <p className="text-txt-2">Isso personalizará seus treinos</p>
            </div>
            
            <RadioGroup 
              value={data.goal} 
              onValueChange={(value) => updateData({ goal: value as any })}
            >
              <div className="glass-card p-4 hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="massa" id="massa" />
                  <Label htmlFor="massa" className="text-txt cursor-pointer flex-1">
                    <div className="font-semibold">💪 Ganho de Massa Muscular</div>
                    <div className="text-sm text-txt-2">Hipertrofia e volume muscular</div>
                  </Label>
                </div>
              </div>
              
              <div className="glass-card p-4 hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="definicao" id="definicao" />
                  <Label htmlFor="definicao" className="text-txt cursor-pointer flex-1">
                    <div className="font-semibold">🔥 Definição e Perda de Gordura</div>
                    <div className="text-sm text-txt-2">Redução de BF e definição muscular</div>
                  </Label>
                </div>
              </div>
              
              <div className="glass-card p-4 hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="forca" id="forca" />
                  <Label htmlFor="forca" className="text-txt cursor-pointer flex-1">
                    <div className="font-semibold">⚡ Ganho de Força</div>
                    <div className="text-sm text-txt-2">Powerlifting e força máxima</div>
                  </Label>
                </div>
              </div>
              
              <div className="glass-card p-4 hover:bg-white/5 transition-all">
                <div className="flex items-center space-x-3">
                  <RadioGroupItem value="resistencia" id="resistencia" />
                  <Label htmlFor="resistencia" className="text-txt cursor-pointer flex-1">
                    <div className="font-semibold">🏃 Resistência e Condicionamento</div>
                    <div className="text-sm text-txt-2">Capacidade cardiovascular</div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        )}

        {/* Step 4: Training Schedule */}
        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Clock className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-txt mb-2">⏰ Rotina de Treino</h3>
              <p className="text-txt-2">Definir sua disponibilidade</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-txt mb-3 block">Dias por semana</Label>
                <RadioGroup 
                  value={data.trainingDays?.toString()} 
                  onValueChange={(value) => updateData({ trainingDays: parseInt(value) })}
                >
                  {[3, 4, 5, 6].map(days => (
                    <div key={days} className="flex items-center space-x-2">
                      <RadioGroupItem value={days.toString()} id={`days-${days}`} />
                      <Label htmlFor={`days-${days}`} className="text-txt cursor-pointer">
                        {days} dias
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div>
                <Label className="text-txt mb-3 block">Tempo por sessão (minutos)</Label>
                <RadioGroup 
                  value={data.trainingTime?.toString()} 
                  onValueChange={(value) => updateData({ trainingTime: parseInt(value) })}
                >
                  {[45, 60, 75, 90].map(time => (
                    <div key={time} className="flex items-center space-x-2">
                      <RadioGroupItem value={time.toString()} id={`time-${time}`} />
                      <Label htmlFor={`time-${time}`} className="text-txt cursor-pointer">
                        {time} minutos
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Health & Preferences */}
        {step === 5 && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Heart className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-txt mb-2">🏥 Saúde e Preferências</h3>
              <p className="text-txt-2">Informações finais para personalização</p>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label className="text-txt">Condições de saúde ou lesões</Label>
                <Textarea
                  value={data.healthConditions || ''}
                  onChange={(e) => updateData({ healthConditions: e.target.value })}
                  placeholder="Ex: problemas no joelho, lesão no ombro..."
                  className="bg-input-bg border-input-border text-txt"
                />
              </div>
              
              <div>
                <Label className="text-txt">Preferências e observações</Label>
                <Textarea
                  value={data.preferences || ''}
                  onChange={(e) => updateData({ preferences: e.target.value })}
                  placeholder="Ex: gosto de treino pesado, prefiro exercícios livres..."
                  className="bg-input-bg border-input-border text-txt"
                />
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={step === 1}
            className="glass-button"
          >
            Anterior
          </Button>
          
          {step < totalSteps ? (
            <Button
              onClick={nextStep}
              className="btn-premium"
            >
              Próximo
            </Button>
          ) : (
            <Button
              onClick={handleComplete}
              disabled={!isDataComplete() || isLoading}
              className="btn-premium"
            >
              {isLoading ? "Salvando..." : "Finalizar Configuração"}
            </Button>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}