import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Bot, 
  User, 
  Mic, 
  MicOff, 
  Brain, 
  Zap, 
  Target,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  insights?: string[];
  recommendations?: string[];
  tags?: string[];
  isLoading?: boolean;
}

interface EnhancedAIInterfaceProps {
  workoutData?: any;
  onSuggestion?: (text: string) => void;
}

export const EnhancedAIInterface: React.FC<EnhancedAIInterfaceProps> = ({
  workoutData,
  onSuggestion
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Welcome message
    const welcomeMessage: Message = {
      id: 'welcome',
      role: 'assistant',
      content: `🔥 Coach IA Premium Ativado

E aí, parceiro! Sou seu coach pessoal especialista em fitness. Tenho conhecimento científico atualizado e vou te ajudar com:

• Técnica de exercícios - execução perfeita
• Planejamento - rotinas personalizadas  
• Nutrição - dietas e suplementação
• Análises - progressão e correções

Fale comigo sobre qualquer tema fitness!`,
      timestamp: new Date().toISOString(),
      insights: [
        'Técnica perfeita > Peso alto',
        'Consistência é a chave do sucesso',
        'Nutrição representa 70% dos resultados'
      ],
      recommendations: [
        'Conte sobre seu objetivo atual',
        'Pergunte sobre técnica de exercícios',
        'Solicite análise do seu treino'
      ],
      tags: ['welcome', 'coach-ia', 'fitness']
    };
    setMessages([welcomeMessage]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (overrideText?: string) => {
    const messageText = overrideText || inputMessage.trim();
    if (!messageText) return;

    setInputMessage('');
    setIsLoading(true);

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);

    // Add loading message
    const loadingMessage: Message = {
      id: `loading-${Date.now()}`,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      isLoading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    try {
      // Simulate API call (replace with actual API)
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Generate response based on message content
      const response = generateAIResponse(messageText, workoutData);

      // Remove loading message and add response
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        return [...filtered, response];
      });

      toast({
        title: "Resposta gerada!",
        description: "Coach IA respondeu sua pergunta.",
      });

    } catch (error) {
      console.error('Error:', error);
      
      // Remove loading message and add error
      setMessages(prev => {
        const filtered = prev.filter(msg => !msg.isLoading);
        const errorMessage: Message = {
          id: `error-${Date.now()}`,
          role: 'assistant',
          content: 'Desculpe, tive um problema técnico. Tente novamente em alguns segundos.',
          timestamp: new Date().toISOString(),
          tags: ['error']
        };
        return [...filtered, errorMessage];
      });

      toast({
        title: "Erro na IA",
        description: "Tente novamente em alguns segundos.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applySuggestion = (text: string) => {
    if (!text || text.trim().length === 0) return;
    setInputMessage(text);
    setTimeout(() => handleSendMessage(text), 100);
  };

  const quickActions = [
    {
      icon: TrendingUp,
      label: 'Analisar Progressão',
      action: () => applySuggestion('Analise minha progressão nos últimos treinos'),
      color: 'bg-green-500'
    },
    {
      icon: Target,
      label: 'Plano Personalizado',
      action: () => applySuggestion('Crie um plano de treino personalizado para meus objetivos'),
      color: 'bg-blue-500'
    },
    {
      icon: Activity,
      label: 'Técnica de Exercício',
      action: () => applySuggestion('Explique a técnica perfeita do supino reto'),
      color: 'bg-orange-500'
    },
    {
      icon: Brain,
      label: 'Dúvida sobre Nutrição',
      action: () => applySuggestion('Como devo me alimentar para ganhar massa muscular?'),
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="h-full flex flex-col bg-bg">
      {/* Mobile-First Header */}
      <div className="safe-area-top p-4 border-b border-line/20 bg-surface/50 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
              <Bot className="w-5 h-5 text-accent" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-bg"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-txt text-lg">🤖 Coach IA Premium</h3>
            <p className="text-xs text-txt-2">Especialista em Fitness • Online</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-green-500 font-medium">Ativo</span>
          </div>
        </div>
      </div>

      {/* Mobile Quick Actions */}
      <div className="p-3 border-b border-line/20 bg-surface/30">
        <div className="grid grid-cols-2 gap-2">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              disabled={isLoading}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-surface/50 border border-line/40 hover:bg-accent/10 transition-all active:scale-95 disabled:opacity-50"
            >
              <div className={`w-5 h-5 rounded ${action.color} flex items-center justify-center flex-shrink-0`}>
                <action.icon className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs text-txt font-medium truncate">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Messages - Mobile Optimized */}
      <ScrollArea className="flex-1 px-3 py-2">
        <div className="space-y-3">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {message.role === 'assistant' && (
                <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-accent" />
                </div>
              )}

              <div className={`max-w-[82%] ${message.role === 'user' ? 'order-1' : ''}`}>
                <div 
                  className={`p-3 rounded-2xl ${
                    message.role === 'user' 
                      ? 'bg-accent text-accent-ink rounded-br-md shadow-sm' 
                      : 'bg-surface border border-line/40 rounded-bl-md shadow-sm'
                  }`}
                >
                  {message.isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-1.5 h-1.5 bg-accent rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                      <span className="text-xs text-txt-2">Coach escrevendo...</span>
                    </div>
                  ) : (
                    <>
                      <div className={`text-sm leading-relaxed ${message.role === 'user' ? 'text-accent-ink font-semibold' : 'text-txt'}`}>
                        {formatMessage(message.content)}
                      </div>

                      {/* Insights - Mobile Optimized */}
                      {message.insights && message.insights.length > 0 && (
                        <div className="mt-3 p-2.5 rounded-lg bg-accent/5 border border-accent/20">
                          <div className="flex items-center gap-1 mb-2">
                            <Sparkles className="w-3 h-3 text-accent" />
                            <span className="text-xs font-medium text-accent">💡 Insights</span>
                          </div>
                          <div className="space-y-1.5">
                            {message.insights.map((insight, idx) => (
                              <button
                                key={idx}
                                onClick={() => applySuggestion(insight)}
                                className="block w-full text-left text-xs p-2 rounded-md hover:bg-accent/10 transition-colors text-txt-2 bg-surface/30 border border-line/20 active:scale-95"
                                disabled={isLoading}
                              >
                                💭 {insight}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Recommendations - Mobile Optimized */}
                      {message.recommendations && message.recommendations.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <div className="flex items-center gap-1 mb-2">
                            <Target className="w-3 h-3 text-accent" />
                            <span className="text-xs font-medium text-accent">🎯 Sugestões</span>
                          </div>
                          {message.recommendations.map((rec, idx) => (
                            <button
                              key={idx}
                              onClick={() => applySuggestion(rec)}
                              className="block w-full text-left text-xs p-2 rounded-md bg-accent/10 hover:bg-accent/20 transition-colors text-txt border border-accent/30 active:scale-95"
                              disabled={isLoading}
                            >
                              ✨ {rec}
                            </button>
                          ))}
                        </div>
                      )}

                      {/* Tags - Mobile Compact */}
                      {message.tags && message.tags.length > 0 && (
                        <div className="mt-2 flex gap-1 flex-wrap">
                          {message.tags.slice(0, 3).map((tag, idx) => (
                            <span key={idx} className="text-[10px] px-1.5 py-0.5 rounded-full bg-line/20 text-txt-3">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
                
                {/* Timestamp - Mobile */}
                <div className="flex items-center gap-1 mt-1 px-2">
                  <span className="text-[10px] text-txt-3">
                    {new Date(message.timestamp).toLocaleTimeString('pt-BR', { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {message.role === 'user' && (
                    <CheckCircle2 className="w-3 h-3 text-green-500 ml-auto" />
                  )}
                </div>
              </div>

              {message.role === 'user' && (
                <div className="w-7 h-7 rounded-full bg-accent flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4 text-accent-ink" />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Mobile Input Area */}
      <div className="safe-area-bottom p-3 border-t border-line/20 bg-surface/50 backdrop-blur-sm">
        <div className="flex gap-2 items-end">
          <div className="flex-1 relative">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="💭 Digite sua pergunta..."
              disabled={isLoading}
              className="pr-10 bg-input border-input-border text-txt rounded-xl h-12 text-sm"
            />
            <button
              onClick={() => setIsListening(!isListening)}
              disabled={isLoading}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-surface/50 flex items-center justify-center hover:bg-accent/20 transition-colors"
            >
              {isListening ? (
                <MicOff className="w-4 h-4 text-red-500" />
              ) : (
                <Mic className="w-4 h-4 text-txt-2" />
              )}
            </button>
          </div>
          <button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !inputMessage.trim()}
            className="bg-accent text-accent-ink hover:bg-accent/90 w-12 h-12 rounded-xl flex items-center justify-center disabled:opacity-50 transition-all active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Format message to remove markdown and improve readability
const formatMessage = (content: string): React.ReactNode => {
  if (!content) return '';
  
  // Remove markdown asterisks and format text properly
  const parts = content.split('\n').map((line, index) => {
    // Clean markdown formatting
    let cleanLine = line
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold markdown
      .replace(/\*(.*?)\*/g, '$1')     // Remove italic markdown
      .replace(/~~(.*?)~~/g, '$1')     // Remove strikethrough
      .trim();
    
    // Style different types of content
    if (cleanLine.startsWith('🔥') || cleanLine.startsWith('📈') || cleanLine.startsWith('💪') || cleanLine.startsWith('🥗')) {
      return (
        <div key={index} className="font-semibold text-accent mb-2 text-base">
          {cleanLine}
        </div>
      );
    }
    
    if (cleanLine.startsWith('•')) {
      return (
        <div key={index} className="ml-2 mb-1 flex items-start gap-2">
          <span className="text-accent text-xs mt-1">●</span>
          <span className="text-txt-2">{cleanLine.substring(1).trim()}</span>
        </div>
      );
    }
    
    if (cleanLine.includes(':') && cleanLine.length < 50) {
      return (
        <div key={index} className="font-medium text-txt mb-1">
          {cleanLine}
        </div>
      );
    }
    
    if (cleanLine.length > 0) {
      return (
        <div key={index} className="mb-2 text-txt-2 leading-relaxed">
          {cleanLine}
        </div>
      );
    }
    
    return <div key={index} className="h-1" />;
  });
  
  return <div className="space-y-0.5">{parts}</div>;
};

// Enhanced AI Response Generator with cleaner responses
function generateAIResponse(message: string, workoutData?: any): Message {
  const lowerMessage = message.toLowerCase();
  
  // Analyze message intent
  let response = '';
  let insights: string[] = [];
  let recommendations: string[] = [];
  let tags: string[] = [];

  if (lowerMessage.includes('progressão') || lowerMessage.includes('evolução')) {
    response = `📈 Análise de Progressão

Analisando seus dados, vejo uma evolução consistente! Isso é excelente - progressão linear sustentável é muito melhor que saltos grandes e insustentáveis.

Suas cargas estão aumentando de forma inteligente, e o RPE se mantém controlado. Continue assim que os ganhos vão se acumular ao longo do tempo.`;
    insights = [
      'Progressão gradual é mais sustentável',
      'Consistência supera intensidade extrema',
      'RPE controlado indica boa periodização'
    ];
    recommendations = [
      'Mantenha a progressão atual',
      'Monitore sinais de overtraining',
      'Varie exercícios a cada 6-8 semanas'
    ];
    tags = ['progressão', 'análise', 'treino'];
  } else if (lowerMessage.includes('supino') || lowerMessage.includes('técnica')) {
    response = `💪 Técnica do Supino Reto

Vou te ensinar a execução perfeita:

Setup:
• Escápulas retraídas e fixas
• Pés firmes no chão
• Barra na linha do mamilo

Execução:
• Movimento em J invertido
• Explosivo na subida, controlado na descida
• Ritmo 2-0-2 (2s desc, 0s pausa, 2s subida)`;
    insights = [
      'Setup correto = 50% do sucesso',
      'Trajetória em J maximiza força',
      'Controle excêntrico desenvolve mais força'
    ];
    recommendations = [
      'Filme sua execução para análise',
      'Comece com peso mais leve',
      'Pratique o setup várias vezes'
    ];
    tags = ['técnica', 'supino', 'execução'];
  } else if (lowerMessage.includes('nutrição') || lowerMessage.includes('dieta')) {
    response = `🥗 Nutrição para Hipertrofia

Para ganhar massa de qualidade:

Proteína: 2-2.5g/kg peso corporal
Carboidratos: 4-6g/kg (energia para treinos)
Gorduras: 1g/kg (hormônios)

Timing:
• Pré-treino: carbo + pouca proteína
• Pós-treino: proteína + carbo de alto IG`;
    insights = [
      'Proteína é fundamental mas não é tudo',
      'Carboidratos são essenciais para performance',
      'Timing pode otimizar resultados'
    ];
    recommendations = [
      'Calcule suas macros baseado no peso',
      'Priorize comida real antes de suplementos',
      'Hidrate-se adequadamente'
    ];
    tags = ['nutrição', 'hipertrofia', 'macros'];
  } else {
    response = `🔥 Coach IA Respondendo

Perfeito! Vou te ajudar com essa questão. Com base na sua pergunta, posso oferecer várias abordagens científicas e práticas.

Me conte mais detalhes sobre sua situação específica para eu dar conselhos mais personalizados!`;
    insights = [
      'Especificidade melhora a qualidade da resposta',
      'Contexto individual é fundamental',
      'Ciência aplicada > teoria pura'
    ];
    recommendations = [
      'Seja mais específico na pergunta',
      'Conte sobre sua rotina atual',
      'Mencione seus objetivos principais'
    ];
    tags = ['geral', 'coach-ia', 'ajuda'];
  }

  return {
    id: `ai-${Date.now()}`,
    role: 'assistant',
    content: response,
    timestamp: new Date().toISOString(),
    insights,
    recommendations,
    tags
  };
}