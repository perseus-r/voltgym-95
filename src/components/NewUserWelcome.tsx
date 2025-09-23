import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Star, Target, TrendingUp, Zap, Heart } from "lucide-react";
import { toast } from "sonner";

interface NewUserWelcomeProps {
  onComplete: () => void;
}

export function NewUserWelcome({ onComplete }: NewUserWelcomeProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const welcomeSteps = [
    {
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      title: "Bem-vindo ao VOLT FITNESS! ⚡",
      description: "Você acabou de se juntar à plataforma de treinos mais avançada do Brasil.",
      content: "Aqui você vai encontrar treinos personalizados, acompanhamento de progresso em tempo real e uma comunidade incrível para te motivar!"
    },
    {
      icon: <Target className="w-8 h-8 text-accent" />,
      title: "Defina seus objetivos",
      description: "Vamos personalizar sua experiência de acordo com seus objetivos fitness.",
      content: "Seja para ganhar massa muscular, perder gordura ou melhorar o condicionamento, temos o plano perfeito para você."
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-400" />,
      title: "Acompanhe seu progresso",
      description: "Monitore cada treino, cada carga e cada conquista.",
      content: "Nossa planilha inteligente registra automaticamente seu progresso e sugere evoluções baseadas na sua performance."
    },
    {
      icon: <Heart className="w-8 h-8 text-red-400" />,
      title: "Junte-se à comunidade",
      description: "Conecte-se com outros atletas e compartilhe sua jornada.",
      content: "Troque experiências, tire dúvidas e celebre conquistas com nossa comunidade ativa de fitness enthusiasts."
    }
  ];

  const handleNextStep = () => {
    if (currentStep < welcomeSteps.length - 1) {
      setCurrentStep(currentStep + 1);
      setProgress(((currentStep + 1) / welcomeSteps.length) * 100);
    } else {
      // Finalizar onboarding
      toast.success("Bem-vindo ao VOLT FITNESS! 🚀", {
        description: "Você ganhou 100 XP para começar sua jornada!"
      });
      onComplete();
    }
  };

  const handleSkip = () => {
    toast.info("Onboarding pulado", {
      description: "Você pode acessar o tutorial a qualquer momento nas configurações."
    });
    onComplete();
  };

  const currentStepData = welcomeSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg via-surface to-bg flex items-center justify-center p-4">
      <Card className="liquid-glass max-w-2xl w-full">
        <CardHeader className="text-center pb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center shadow-2xl animate-pulse-glow">
              <Zap className="w-10 h-10 text-accent-ink" />
            </div>
          </div>
          
          <CardTitle className="text-3xl font-bold text-txt mb-2">
            VOLT FITNESS
          </CardTitle>
          
          <div className="flex items-center justify-center gap-4 mb-6">
            <Badge variant="outline" className="text-accent border-accent/30">
              Passo {currentStep + 1} de {welcomeSteps.length}
            </Badge>
            <Badge variant="outline" className="text-txt-2">
              {Math.round(progress)}% completo
            </Badge>
          </div>
          
          <Progress value={progress} className="h-2 mb-4" />
        </CardHeader>

        <CardContent className="space-y-8">
          {/* Step Content */}
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              {currentStepData.icon}
            </div>
            
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-txt">
                {currentStepData.title}
              </h2>
              <p className="text-lg text-accent font-medium">
                {currentStepData.description}
              </p>
              <p className="text-txt-2 leading-relaxed max-w-lg mx-auto">
                {currentStepData.content}
              </p>
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-xl bg-accent/10 border border-accent/20">
              <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xs text-txt-2 font-medium">Treinos IA</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-accent/10 border border-accent/20">
              <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xs text-txt-2 font-medium">Planilhas</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-accent/10 border border-accent/20">
              <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xs text-txt-2 font-medium">Comunidade</p>
            </div>
            <div className="text-center p-4 rounded-xl bg-accent/10 border border-accent/20">
              <CheckCircle className="w-6 h-6 text-accent mx-auto mb-2" />
              <p className="text-xs text-txt-2 font-medium">Analytics</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={handleSkip}
              className="liquid-glass-button"
            >
              Pular tutorial
            </Button>
            <Button
              onClick={handleNextStep}
              className="bg-accent hover:bg-accent/90 text-accent-ink px-8"
              size="lg"
            >
              {currentStep === welcomeSteps.length - 1 ? (
                <>
                  <Zap className="w-5 h-5 mr-2" />
                  Começar agora!
                </>
              ) : (
                "Próximo"
              )}
            </Button>
          </div>

          {/* Tips */}
          <div className="text-center">
            <p className="text-xs text-txt-3">
              💡 Dica: Você pode acessar este tutorial novamente em Configurações → Ajuda
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}