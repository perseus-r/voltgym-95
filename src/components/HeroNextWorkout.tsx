import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Play, Zap, Target, Clock, Dumbbell, Users } from "lucide-react";

interface HeroNextWorkoutProps {
  focus?: string;
  onStart: () => void;
  workout?: {
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest_s: number;
    }>;
  };
}

export function HeroNextWorkout({ focus = "Carregando...", onStart, workout }: HeroNextWorkoutProps) {
  const workoutTime = workout?.exercises 
    ? Math.round(workout.exercises.length * 15 + workout.exercises.reduce((acc, ex) => acc + (ex.rest_s * ex.sets / 60), 0))
    : 45;

  return (
    <div className="relative overflow-hidden liquid-glass p-6 md:p-8 border border-accent/20">
      {/* Enhanced background with animated particles */}
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-accent-2/5"></div>
      <div className="absolute top-4 right-4 w-32 h-32 bg-gradient-primary opacity-20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-4 left-4 w-24 h-24 bg-accent/30 rounded-full blur-2xl animate-pulse delay-1000"></div>
      
      <div className="relative">
        <div className="mb-8">
          {/* Status badge with animation */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 border border-accent/30 mb-6 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
            <span className="text-sm font-semibold text-accent">TREINO PREPARADO</span>
          </div>
          
          {/* Enhanced title with gradient */}
          <h1 className="text-4xl md:text-5xl font-black mb-4 bg-gradient-to-r from-txt via-accent to-txt bg-clip-text text-transparent leading-tight">
            {focus}
          </h1>
          <p className="text-xl text-txt-2 max-w-lg mx-auto mb-6">
            Seu corpo está pronto para evoluir. Que tal começar agora?
          </p>

          {/* Quick workout stats */}
          <div className="flex justify-center gap-6 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{workout?.exercises?.length || 0}</div>
              <div className="text-xs text-txt-3 font-medium">EXERCÍCIOS</div>
            </div>
            <div className="w-px bg-line/50"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{workoutTime}</div>
              <div className="text-xs text-txt-3 font-medium">MINUTOS</div>
            </div>
            <div className="w-px bg-line/50"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">HIGH</div>
              <div className="text-xs text-txt-3 font-medium">INTENSIDADE</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            onClick={onStart}
            size="lg"
            className="bg-gradient-to-r from-accent to-accent-2 hover:from-accent/90 hover:to-accent-2/90 text-accent-ink font-black px-12 py-6 text-xl rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-accent/30 relative z-10 group overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <Play className="w-6 h-6 mr-3 relative z-10" />
            <span className="relative z-10">COMEÇAR AGORA</span>
          </Button>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                variant="outline"
                size="lg"
                className="glass-button border-glass-border text-txt hover:text-txt px-6 py-4"
              >
                <Zap className="w-5 h-5 mr-2" />
                Ver Detalhes
              </Button>
            </DialogTrigger>
            <DialogContent className="liquid-glass border border-line/20 max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-txt flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Detalhes do Treino: {focus}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Resumo do Treino */}
                <Card className="liquid-glass p-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Dumbbell className="w-4 h-4 text-accent" />
                        <span className="text-sm text-txt-2">Exercícios</span>
                      </div>
                      <div className="text-lg font-bold text-txt">
                        {workout?.exercises?.length || 0}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Clock className="w-4 h-4 text-accent" />
                        <span className="text-sm text-txt-2">Duração</span>
                      </div>
                      <div className="text-lg font-bold text-txt">
                        {workout?.exercises 
                          ? Math.round(workout.exercises.length * 15 + workout.exercises.reduce((acc, ex) => acc + (ex.rest_s * ex.sets / 60), 0))
                          : 45
                        } min
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-center gap-1 mb-1">
                        <Users className="w-4 h-4 text-accent" />
                        <span className="text-sm text-txt-2">Nível</span>
                      </div>
                      <Badge className="bg-accent/20 text-accent">
                        Intermediário
                      </Badge>
                    </div>
                  </div>
                </Card>

                {/* Lista de Exercícios */}
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-txt flex items-center gap-2">
                    <Dumbbell className="w-5 h-5 text-accent" />
                    Exercícios Planejados
                  </h3>
                  
                  {workout?.exercises?.length ? (
                    <div className="space-y-2">
                      {workout.exercises.map((exercise, index) => (
                        <Card key={index} className="liquid-glass p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent font-bold text-sm">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-medium text-txt">{exercise.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-txt-2">
                                  <span>{exercise.sets} séries</span>
                                  <span>{exercise.reps} reps</span>
                                  <span>{exercise.rest_s}s descanso</span>
                                </div>
                              </div>
                            </div>
                            <Badge variant="outline" className="border-accent/30 text-accent">
                              {exercise.sets}x{exercise.reps}
                            </Badge>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="liquid-glass p-6 text-center">
                      <div className="text-txt-3">Carregando exercícios...</div>
                    </Card>
                  )}
                </div>

                {/* Dicas e Observações */}
                <Card className="liquid-glass p-4">
                  <h4 className="font-medium text-txt mb-2">💡 Dicas para este treino:</h4>
                  <ul className="text-sm text-txt-2 space-y-1">
                    <li>• Faça um aquecimento de 5-10 minutos antes de começar</li>
                    <li>• Mantenha a técnica sempre em primeiro lugar</li>
                    <li>• Respeite os tempos de descanso para melhor performance</li>
                    <li>• Hidrate-se entre as séries</li>
                    <li>• Se sentir dor, pare imediatamente</li>
                  </ul>
                </Card>

                {/* Botão para Iniciar */}
                <div className="flex justify-center pt-4">
                  <Button 
                    onClick={() => {
                      onStart();
                      // Fechar dialog - será fechado automaticamente
                    }}
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-ink font-semibold px-8 py-4 text-lg"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Começar Treino Agora
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}