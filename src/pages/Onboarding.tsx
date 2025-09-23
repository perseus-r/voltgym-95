import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { autoSecurityService } from '@/services/AutoSecurityService';
import { 
  User, Target, Calendar, Activity, 
  ChevronLeft, ChevronRight, Check,
  Dumbbell, Heart, Zap, TrendingUp
} from 'lucide-react';

interface OnboardingData {
  age: number | '';
  gender: 'masculino' | 'feminino' | 'outro' | '';
  height: number | '';
  weight: number | '';
  experience_level: 'iniciante' | 'intermediario' | 'avancado' | '';
  goal: 'massa' | 'gordura' | 'forca' | 'resistencia' | '';
  workout_frequency: number | '';
  workout_location: 'academia' | 'casa' | 'crossfit' | 'parque' | 'hibrido' | '';
  medical_conditions: string;
}

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    age: '',
    gender: '',
    height: '',
    weight: '',
    experience_level: '',
    goal: '',
    workout_frequency: '',
    workout_location: '',
    medical_conditions: ''
  });

  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps = [
    { title: 'Informações Pessoais', icon: User },
    { title: 'Experiência', icon: Activity },
    { title: 'Objetivos', icon: Target },
    { title: 'Frequência', icon: Calendar },
    { title: 'Local de Treino', icon: Dumbbell }
  ];

  const totalSteps = steps.length;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  const updateData = (field: keyof OnboardingData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  // Função removida pois não usamos mais equipamentos

  const isStepValid = () => {
    switch (currentStep) {
      case 0: return data.age && data.gender && data.height && data.weight;
      case 1: return data.experience_level;
      case 2: return data.goal;
      case 3: return data.workout_frequency;
      case 4: return data.workout_location;
      default: return false;
    }
  };

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Verifica se já existe perfil
      const { data: existingProfile, error: selectError } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', user.id)
        .maybeSingle();

      const payload = {
        user_id: user.id,
        age: data.age as number,
        height: data.height as number,
        weight: data.weight as number,
        experience_level: data.experience_level as string,
        goal: data.goal as string,
        workout_location: data.workout_location as string
      } as const;

      if (!existingProfile || selectError) {
        // Cria perfil se não existir
        const { error: insertError } = await supabase
          .from('profiles')
          .insert(payload);
        if (insertError) throw insertError;
      } else {
        // Atualiza perfil existente
        const { error: updateError } = await supabase
          .from('profiles')
          .update({
            age: payload.age,
            height: payload.height,
            weight: payload.weight,
            experience_level: payload.experience_level,
            goal: payload.goal,
            workout_location: payload.workout_location
          })
          .eq('user_id', user.id);
        if (updateError) throw updateError;
      }

      // Personalização automática via IA (silenciosa)
      await autoSecurityService.personalizeForUser({
        experience_level: data.experience_level,
        goal: data.goal,
        workout_frequency: data.workout_frequency
      });

      toast({
        title: "⚡ Perfil configurado!",
        description: "Bem-vindo ao seu sistema premium personalizado!",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao salvar perfil:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar seu perfil. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <User className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-txt mb-2">⚡ Configure seu perfil</h2>
              <p className="text-txt-2">Essas informações nos ajudam a personalizar seu sistema</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-text">Idade</Label>
                <Input
                  type="number"
                  value={data.age}
                  onChange={(e) => updateData('age', parseInt(e.target.value))}
                  placeholder="25"
                  className="bg-input-bg border-input-border"
                />
              </div>
              <div>
                <Label className="text-text">Altura (cm)</Label>
                <Input
                  type="number"
                  value={data.height}
                  onChange={(e) => updateData('height', parseInt(e.target.value))}
                  placeholder="175"
                  className="bg-input-bg border-input-border"
                />
              </div>
            </div>

            <div>
              <Label className="text-text">Peso (kg)</Label>
              <Input
                type="number"
                step="0.1"
                value={data.weight}
                onChange={(e) => updateData('weight', parseFloat(e.target.value))}
                placeholder="70.5"
                className="bg-input-bg border-input-border"
              />
            </div>

            <div>
              <Label className="text-text mb-3 block">Gênero</Label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'masculino', label: 'Masculino' },
                  { value: 'feminino', label: 'Feminino' },
                  { value: 'outro', label: 'Outro' }
                ].map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={data.gender === option.value ? "default" : "outline"}
                    onClick={() => updateData('gender', option.value)}
                    className={data.gender === option.value 
                      ? "bg-accent text-accent-ink" 
                      : "border-input-border hover:border-accent"
                    }
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Activity className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Qual sua experiência?</h2>
              <p className="text-text-2">Isso nos ajuda a ajustar a intensidade dos treinos</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'iniciante', label: 'Iniciante', desc: 'Novo nos treinos ou sem experiência recente' },
                { value: 'intermediario', label: 'Intermediário', desc: 'Treino há alguns meses, conhece os exercícios básicos' },
                { value: 'avancado', label: 'Avançado', desc: 'Treino há anos, domina técnicas avançadas' }
              ].map((level) => (
                <Card 
                  key={level.value}
                  className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    data.experience_level === level.value 
                      ? 'border-accent bg-accent/5' 
                      : 'border-line hover:border-accent/50'
                  }`}
                  onClick={() => updateData('experience_level', level.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-text">{level.label}</h3>
                        <p className="text-sm text-text-2">{level.desc}</p>
                      </div>
                      {data.experience_level === level.value && (
                        <Check className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Target className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Qual seu objetivo?</h2>
              <p className="text-text-2">Vamos focar no que é mais importante para você</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 'massa', label: 'Ganhar Massa', icon: TrendingUp, color: 'from-blue-500 to-purple-600' },
                { value: 'gordura', label: 'Perder Gordura', icon: Zap, color: 'from-red-500 to-pink-600' },
                { value: 'forca', label: 'Aumentar Força', icon: Dumbbell, color: 'from-orange-500 to-red-600' },
                { value: 'resistencia', label: 'Resistência', icon: Heart, color: 'from-green-500 to-blue-600' }
              ].map((goal) => {
                const Icon = goal.icon;
                const isSelected = data.goal === goal.value;
                
                return (
                  <Card 
                    key={goal.value}
                    className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
                      isSelected ? 'border-accent ring-2 ring-accent/20' : 'border-line hover:border-accent/50'
                    }`}
                    onClick={() => updateData('goal', goal.value)}
                  >
                    <CardContent className="p-6 text-center">
                      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${goal.color} flex items-center justify-center mx-auto mb-3`}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-text">{goal.label}</h3>
                      {isSelected && (
                        <Check className="w-5 h-5 text-accent mx-auto mt-2" />
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Calendar className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">Quantos dias por semana?</h2>
              <p className="text-text-2">Planeje sua rotina de treinos</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {[2, 3, 4, 5, 6, 7].map((days) => (
                <Button
                  key={days}
                  type="button"
                  variant={data.workout_frequency === days ? "default" : "outline"}
                  onClick={() => updateData('workout_frequency', days)}
                  className={`aspect-square text-lg font-bold ${
                    data.workout_frequency === days 
                      ? "bg-accent text-accent-ink" 
                      : "border-input-border hover:border-accent"
                  }`}
                >
                  {days}
                </Button>
              ))}
            </div>

            <div className="text-center text-sm text-text-2">
              {data.workout_frequency && (
                <p>
                  Perfeito! {data.workout_frequency} {data.workout_frequency === 1 ? 'dia' : 'dias'} por semana é um ótimo começo.
                </p>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center mb-6">
              <Dumbbell className="w-16 h-16 text-accent mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-text mb-2">⚡ Onde você treina?</h2>
              <p className="text-text-2">Escolha seu ambiente de treino principal</p>
            </div>

            <div className="space-y-3">
              {[
                { value: 'academia', label: '🏋️ Academia', desc: 'Equipamentos completos e variedade' },
                { value: 'casa', label: '🏠 Casa', desc: 'Treinos funcionais e práticos' },
                { value: 'crossfit', label: '⚡ CrossFit Box', desc: 'Treinos intensos e funcionais' },
                { value: 'parque', label: '🌳 Parque/Ar livre', desc: 'Exercícios ao ar livre e calistenia' },
                { value: 'hibrido', label: '🔄 Híbrido', desc: 'Combinação de ambientes' }
              ].map((location) => (
                <Card 
                  key={location.value}
                  className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] ${
                    data.workout_location === location.value 
                      ? 'border-accent bg-accent/5 volt-glow' 
                      : 'border-line hover:border-accent/50'
                  }`}
                  onClick={() => updateData('workout_location', location.value)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-text">{location.label}</h3>
                        <p className="text-sm text-text-2">{location.desc}</p>
                      </div>
                      {data.workout_location === location.value && (
                        <Check className="w-5 h-5 text-accent" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div>
              <Label className="text-text">⚡ Limitações ou condições especiais (opcional)</Label>
              <Textarea
                value={data.medical_conditions}
                onChange={(e) => updateData('medical_conditions', e.target.value)}
                placeholder="Ex: problemas no joelho, dores nas costas, alergias..."
                className="bg-input-bg border-input-border"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-surface to-card flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-line shadow-elegant">
          <CardHeader className="pb-6">
            <div className="flex items-center justify-between mb-4">
              <CardTitle className="text-lg font-semibold text-text">
                {steps[currentStep].title}
              </CardTitle>
              <span className="text-sm text-text-2">
                {currentStep + 1} de {totalSteps}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </CardHeader>

          <CardContent className="pb-8">
            {renderStep()}

            <div className="flex justify-between mt-8 pt-6 border-t border-line">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(prev => prev - 1)}
                disabled={currentStep === 0}
                className="border-input-border hover:border-accent"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid() || loading}
                className="bg-accent text-accent-ink hover:bg-accent/90"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-accent-ink/30 border-t-accent-ink rounded-full animate-spin" />
                ) : (
                  <>
                    {currentStep === totalSteps - 1 ? 'Finalizar' : 'Próximo'}
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;