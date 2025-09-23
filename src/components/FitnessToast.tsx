import { useToast } from '@/hooks/use-toast';

// Fitness-themed toast messages following the authentic language guide
export const useFitnessToast = () => {
  const { toast } = useToast();

  const workoutCompleted = (xp: number) => {
    toast({
      title: "🔥 Treino esmagado, monstro!",
      description: `XP ganho: ${xp}. O pump foi só o começo!`
    });
  };

  const seriesCompleted = (setNumber: number, totalSets: number) => {
    const messages = [
      `${setNumber}/${totalSets} sets concluídos! O pump já bateu?`,
      `Mais uma série de monstro! ${setNumber}/${totalSets}`,
      `Serie ${setNumber} esmagada! Sinta o músculo queimando!`
    ];
    toast({
      title: messages[Math.floor(Math.random() * messages.length)],
      description: totalSets - setNumber > 0 ? `Faltam ${totalSets - setNumber} séries para completar` : "Exercício finalizado!"
    });
  };

  const restCompleted = () => {
    const messages = [
      "Descanso concluído! Deu tempo de recuperar mas não virou um Enzo. Bora para a próxima!",
      "Tempo acabou, rato de academia! Vamos monstrar!",
      "Recovery finalizado! Hora de meter mais uma série!"
    ];
    toast({
      title: messages[Math.floor(Math.random() * messages.length)]
    });
  };

  const motivational = () => {
    const messages = [
      "O que não te desafia, não te transforma!",
      "Treinar não fica mais fácil, é você que fica melhor!",
      "O monstro de amanhã se constrói hoje!",
      "Faça o seu eu do futuro ter orgulho!",
      "Não seja um frango, seu shape agradece!"
    ];
    toast({
      title: "💪 Lembrete de Marombeiro",
      description: messages[Math.floor(Math.random() * messages.length)]
    });
  };

  const planCreated = (planName: string) => {
    toast({
      title: "Plano criado! ✨",
      description: `${planName} está pronto para ser esmagado!`
    });
  };

  const planCloned = (planName: string) => {
    toast({
      title: "Plano clonado! ✨",
      description: `Criada cópia de ${planName}. Mais treinos, mais shape!`
    });
  };

  const apiConfigured = () => {
    toast({
      title: "🔧 API configurada!",
      description: "Agora o pump pode te encontrar, marombeiro!"
    });
  };

  const apiError = () => {
    toast({
      title: "❌ Erro na API",
      description: "Não foi possível carregar o treino. Usando modo demo para você não perder o shape!"
    });
  };

  return {
    workoutCompleted,
    seriesCompleted,
    restCompleted,
    motivational,
    planCreated,
    planCloned,
    apiConfigured,
    apiError
  };
};