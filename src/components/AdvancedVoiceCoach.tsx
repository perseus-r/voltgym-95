import { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, MicOff, Volume2, VolumeX, Brain, 
  Activity, MessageSquare, Settings, Zap,
  Play, Pause, Square
} from 'lucide-react';
import { toast } from 'sonner';

interface VoiceCommand {
  command: string;
  action: () => void;
  description: string;
  category: 'workout' | 'navigation' | 'data';
}

interface AdvancedVoiceCoachProps {
  onCommand?: (command: string, data?: any) => void;
  isVisible?: boolean;
}


export function AdvancedVoiceCoach({ onCommand, isVisible = true }: AdvancedVoiceCoachProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [confidence, setConfidence] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [volume, setVolume] = useState([80]);
  const [aiMode, setAiMode] = useState<'coach' | 'companion' | 'trainer'>('coach');
  const [sessionStats, setSessionStats] = useState({
    commandsRecognized: 0,
    responsesGiven: 0,
    sessionTime: 0
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const sessionStartRef = useRef<Date>(new Date());

  const voiceCommands: VoiceCommand[] = [
    // Workout commands
    { command: 'próxima série', action: () => handleCommand('next-set'), description: 'Avançar para próxima série', category: 'workout' },
    { command: 'concluir exercício', action: () => handleCommand('complete-exercise'), description: 'Finalizar exercício atual', category: 'workout' },
    { command: 'pausar treino', action: () => handleCommand('pause-workout'), description: 'Pausar sessão de treino', category: 'workout' },
    { command: 'iniciar descanso', action: () => handleCommand('start-rest'), description: 'Iniciar timer de descanso', category: 'workout' },
    { command: 'adicionar peso', action: () => handleCommand('add-weight', 2.5), description: 'Aumentar peso em 2.5kg', category: 'workout' },
    { command: 'diminuir peso', action: () => handleCommand('reduce-weight', 2.5), description: 'Diminuir peso em 2.5kg', category: 'workout' },
    
    // Data commands
    { command: 'registrar rpe', action: () => handleCommand('record-rpe'), description: 'Registrar escala de esforço', category: 'data' },
    { command: 'salvar série', action: () => handleCommand('save-set'), description: 'Salvar dados da série', category: 'data' },
    { command: 'mostrar histórico', action: () => handleCommand('show-history'), description: 'Exibir histórico de treinos', category: 'data' },
    
    // Navigation commands
    { command: 'ir para dashboard', action: () => handleCommand('navigate', 'dashboard'), description: 'Navegar para dashboard', category: 'navigation' },
    { command: 'abrir planilha', action: () => handleCommand('navigate', 'spreadsheet'), description: 'Abrir planilha de treinos', category: 'navigation' },
    { command: 'mostrar exercícios', action: () => handleCommand('navigate', 'exercises'), description: 'Mostrar biblioteca de exercícios', category: 'navigation' }
  ];

  useEffect(() => {
    initializeSpeechRecognition();
    initializeSpeechSynthesis();
    
    const timer = setInterval(() => {
      setSessionStats(prev => ({
        ...prev,
        sessionTime: Math.floor((Date.now() - sessionStartRef.current.getTime()) / 1000)
      }));
    }, 1000);

    return () => {
      clearInterval(timer);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const initializeSpeechRecognition = () => {
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition: SpeechRecognition = new SpeechRecognitionCtor();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';
      // recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        toast.success('🎤 Assistente ativado', { description: 'Fale comandos de voz' });
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognition.onresult = (event) => {
        const lastResult = event.results[event.results.length - 1];
        const transcriptText = lastResult[0].transcript.toLowerCase().trim();
        const confidenceLevel = lastResult[0].confidence;
        
        setTranscript(transcriptText);
        setConfidence(confidenceLevel);
        
        if (lastResult.isFinal && confidenceLevel > 0.7) {
          processVoiceCommand(transcriptText);
          setSessionStats(prev => ({ ...prev, commandsRecognized: prev.commandsRecognized + 1 }));
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        
        if (event.error === 'not-allowed') {
          toast.error('Permissão de microfone necessária');
        }
      };

      recognitionRef.current = recognition;
    } else {
      toast.error('Reconhecimento de voz não suportado neste navegador');
    }
  };

  const initializeSpeechSynthesis = () => {
    if ('speechSynthesis' in window) {
      synthesisRef.current = window.speechSynthesis;
    }
  };

  const processVoiceCommand = (command: string) => {
    const matchedCommand = voiceCommands.find(cmd => 
      command.includes(cmd.command) || 
      cmd.command.split(' ').every(word => command.includes(word))
    );

    if (matchedCommand) {
      matchedCommand.action();
      
      // AI Coach responses based on mode
      const responses = generateAIResponse(matchedCommand, aiMode);
      if (voiceEnabled && responses.length > 0) {
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        speak(randomResponse);
      }
      
      toast.success(`✅ ${matchedCommand.description}`);
    } else {
      // AI-powered natural language processing fallback
      handleNaturalLanguageCommand(command);
    }
  };

  const handleNaturalLanguageCommand = (command: string) => {
    // Enhanced AI processing for natural commands
    const aiResponses = {
      weight: ['peso', 'carga', 'quilos'],
      rest: ['descanso', 'pausa', 'intervalo'],
      rpe: ['esforço', 'intensidade', 'dificuldade', 'rpe'],
      motivation: ['motivação', 'encorajamento', 'força', 'vamos'],
      help: ['ajuda', 'como', 'não entendi']
    };

    let category = '';
    let response = '';

    for (const [key, keywords] of Object.entries(aiResponses)) {
      if (keywords.some(keyword => command.includes(keyword))) {
        category = key;
        break;
      }
    }

    switch (category) {
      case 'weight':
        response = getWeightResponse(command);
        break;
      case 'rest':
        response = "Iniciando descanso. Use este tempo para se hidratar!";
        handleCommand('start-rest');
        break;
      case 'rpe':
        response = "Em uma escala de 1 a 10, qual foi o esforço desta série?";
        break;
      case 'motivation':
        response = getMotivationalResponse();
        break;
      case 'help':
        response = "Posso ajudar com comandos como 'próxima série', 'adicionar peso', 'iniciar descanso'. O que precisa?";
        break;
      default:
        response = "Não compreendi. Tente comandos como 'próxima série' ou 'aumentar peso'.";
    }

    if (voiceEnabled) {
      speak(response);
    }
    
    toast.info(response);
  };

  const getWeightResponse = (command: string) => {
    const numberMatch = command.match(/\d+/);
    if (numberMatch) {
      const weight = parseFloat(numberMatch[0]);
      handleCommand('set-weight', weight);
      return `Peso ajustado para ${weight} quilos.`;
    } else if (command.includes('aumentar') || command.includes('mais')) {
      handleCommand('add-weight', 2.5);
      return "Peso aumentado em 2.5 quilos.";
    } else if (command.includes('diminuir') || command.includes('menos')) {
      handleCommand('reduce-weight', 2.5);
      return "Peso reduzido em 2.5 quilos.";
    }
    return "Qual peso você gostaria de usar?";
  };

  const getMotivationalResponse = () => {
    const responses = [
      "Você está arrasando! Continue assim!",
      "Força! Cada repetição te deixa mais forte!",
      "Excelente trabalho! Vamos para a próxima!",
      "Você está no caminho certo para seus objetivos!",
      "Impressionante! Mantenha o foco!"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const generateAIResponse = (command: VoiceCommand, mode: string) => {
    const responses: Record<string, string[]> = {
      coach: [
        "Perfeito! Continue com essa intensidade!",
        "Excelente execução! Próximo passo!",
        "Muito bem! Vamos manter o ritmo!"
      ],
      companion: [
        "Ótimo trabalho! Estou aqui com você!",
        "Você consegue! Vamos juntos!",
        "Essa é a atitude! Continue forte!"
      ],
      trainer: [
        "Comando executado. Foque na forma!",
        "Registrado. Mantenha a postura correta!",
        "Confirmado. Respiração controlada!"
      ]
    };
    
    return responses[mode] || responses.coach;
  };

  const speak = (text: string) => {
    if (synthesisRef.current && voiceEnabled) {
      setIsSpeaking(true);
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.volume = volume[0] / 100;
      utterance.rate = 0.9;
      utterance.pitch = 1.0;
      
      utterance.onend = () => {
        setIsSpeaking(false);
        setSessionStats(prev => ({ ...prev, responsesGiven: prev.responsesGiven + 1 }));
      };
      
      utterance.onerror = () => {
        setIsSpeaking(false);
      };
      
      synthesisRef.current.speak(utterance);
    }
  };

  const handleCommand = (command: string, data?: any) => {
    onCommand?.(command, data);
  };

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  };

  const stopSpeaking = () => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isVisible) return null;

  return (
    <Card className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-gradient-primary">
            <Brain className="w-5 h-5 text-accent-ink" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-txt">Coach IA por Voz</h3>
            <p className="text-sm text-txt-2">Assistente inteligente de treino</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge className={`${isListening ? 'bg-success/20 text-success' : 'bg-surface text-txt-3'}`}>
            {isListening ? 'Ouvindo' : 'Inativo'}
          </Badge>
          
          {isSpeaking && (
            <Badge className="bg-accent/20 text-accent animate-pulse">
              Falando
            </Badge>
          )}
        </div>
      </div>

      {/* Voice Controls */}
      <div className="grid grid-cols-2 gap-4">
        <Button
          onClick={toggleListening}
          variant={isListening ? "default" : "outline"}
          className={`glass-button h-12 ${isListening ? 'bg-accent text-accent-ink' : ''}`}
        >
          {isListening ? <MicOff className="w-5 h-5 mr-2" /> : <Mic className="w-5 h-5 mr-2" />}
          {isListening ? 'Parar' : 'Ouvir'}
        </Button>
        
        <Button
          onClick={isSpeaking ? stopSpeaking : () => speak("Olá! Seu coach IA está pronto para ajudar!")}
          variant="outline"
          className="glass-button h-12"
        >
          {isSpeaking ? <Square className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
          {isSpeaking ? 'Parar' : 'Testar'}
        </Button>
      </div>

      {/* AI Mode Selector */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-txt-2">Modo do Coach IA:</label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'coach', name: 'Coach', icon: Activity },
            { id: 'companion', name: 'Companheiro', icon: MessageSquare },
            { id: 'trainer', name: 'Treinador', icon: Zap }
          ].map(({ id, name, icon: Icon }) => (
            <Button
              key={id}
              variant={aiMode === id ? "default" : "outline"}
              size="sm"
              onClick={() => setAiMode(id as any)}
              className={`glass-button ${aiMode === id ? 'bg-accent text-accent-ink' : ''}`}
            >
              <Icon className="w-4 h-4 mr-1" />
              {name}
            </Button>
          ))}
        </div>
      </div>

      {/* Audio Settings */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-txt-2">Respostas por voz:</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setVoiceEnabled(!voiceEnabled)}
            className="glass-button"
          >
            {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
        
        {voiceEnabled && (
          <div className="space-y-2">
            <label className="text-sm text-txt-2">Volume: {volume[0]}%</label>
            <Slider
              value={volume}
              onValueChange={setVolume}
              max={100}
              step={10}
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Current Transcript */}
      {transcript && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-txt-2">Última fala detectada:</label>
          <div className="p-3 rounded-lg bg-surface/30 border border-line/20">
            <p className="text-sm text-txt">{transcript}</p>
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-txt-3">
                Confiança: {Math.round(confidence * 100)}%
              </span>
              <div className="w-16 bg-surface rounded-full h-1">
                <div 
                  className="bg-accent h-1 rounded-full transition-all"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-line/20">
        <div className="text-center">
          <div className="text-lg font-semibold text-accent">{sessionStats.commandsRecognized}</div>
          <div className="text-xs text-txt-3">Comandos</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-accent">{sessionStats.responsesGiven}</div>
          <div className="text-xs text-txt-3">Respostas</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-semibold text-accent">
            {Math.floor(sessionStats.sessionTime / 60)}:{(sessionStats.sessionTime % 60).toString().padStart(2, '0')}
          </div>
          <div className="text-xs text-txt-3">Sessão</div>
        </div>
      </div>

      {/* Quick Commands Reference */}
      <details className="group">
        <summary className="text-sm font-medium text-txt-2 cursor-pointer hover:text-txt">
          Comandos disponíveis ▼
        </summary>
        <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
          {voiceCommands.slice(0, 6).map((cmd, index) => (
            <div key={index} className="flex justify-between text-xs">
              <span className="text-accent">{cmd.command}</span>
              <span className="text-txt-3">{cmd.description}</span>
            </div>
          ))}
        </div>
      </details>
    </Card>
  );
}