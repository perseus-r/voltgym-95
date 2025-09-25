import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { VoltChatInterface, VoltChatMessage } from '@/components/VoltTypewriter';
import { VoltCard } from '@/components/VoltCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Camera, 
  ChefHat,
  Calculator,
  Target,
  Sparkles,
  Image,
  Bot,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  id: string;
  text: string;
  isAI: boolean;
  timestamp: string;
  analysisType?: string;
  hasImage?: boolean;
}

interface NutritionAIChatProps {
  className?: string;
}

const NutritionAIChat = ({ className = '' }: NutritionAIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize conversation and load persistent memory
  useEffect(() => {
    initializeConversation();
    loadConversationHistory();
  }, []);

  const loadConversationHistory = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Buscar conversas existentes de nutrição
      const { data: conversations } = await supabase
        .from('ai_conversations')
        .select('id, title, created_at')
        .eq('user_id', user.id)
        .ilike('title', '%Nutricional%')
        .order('created_at', { ascending: false })
        .limit(1);

      if (conversations && conversations.length > 0) {
        const lastConversation = conversations[0];
        setConversationId(lastConversation.id);
        
        // Carregar mensagens da última conversa
        const { data: lastMessages } = await supabase
          .from('ai_messages')
          .select('content, role, created_at')
          .eq('conversation_id', lastConversation.id)
          .order('created_at', { ascending: true })
          .limit(10);

        if (lastMessages && lastMessages.length > 1) { // Mais de uma mensagem (não só boas-vindas)
          const formattedMessages = lastMessages.map((msg, index) => ({
            id: `history_${index}`,
            text: msg.content,
            isAI: msg.role === 'assistant',
            timestamp: new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
          }));

          setMessages(formattedMessages);
          return;
        }
      }
    } catch (error) {
      console.error('Error loading conversation history:', error);
    }
  };

  const initializeConversation = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create new conversation
      const { data: conversation, error } = await supabase
        .from('ai_conversations')
        .insert({
          user_id: user.id,
          title: 'Consulta Nutricional - ' + new Date().toLocaleDateString('pt-BR')
        })
        .select()
        .single();

      if (error) throw error;

      setConversationId(conversation.id);
      
      // Add welcome message
      const welcomeMessage: Message = {
        id: 'welcome',
        text: `🥗 Olá! Sou o Dr. Nutri, seu nutricionista IA!

Estou aqui para te ajudar com:
• 🧮 Cálculo de macronutrientes
• 📸 Análise de fotos de refeições
• 🎯 Planejamento alimentar personalizado
• 💪 Estratégias nutricionais para seus objetivos

Como posso te ajudar hoje?`,
        isAI: true,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
        analysisType: 'welcome'
      };

      setMessages([welcomeMessage]);
      
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast.error('Erro ao inicializar chat');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Imagem muito grande. Máximo 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setSelectedImage(e.target?.result as string);
      toast.success('Imagem carregada! Digite sua pergunta e envie.');
    };
    reader.readAsDataURL(file);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message || 'Análise de foto de refeição',
      isAI: false,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      hasImage: !!selectedImage
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

      try {
        // Salvar mensagem do usuário na conversa
        if (conversationId) {
          await supabase
            .from('ai_messages')
            .insert({
              conversation_id: conversationId,
              role: 'user',
              content: message || 'Análise de foto de refeição'
            });
        }

        const analysisType = selectedImage ? 'photo_analysis' : 'chat';
      
      // Prepare image data
      let imageBase64 = null;
      if (selectedImage) {
        imageBase64 = selectedImage.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      }

      console.log('🤖 Calling nutrition AI with:', { message, analysisType, hasImage: !!imageBase64 });
      
      const { data, error } = await supabase.functions.invoke('nutrition-ai-chat', {
        body: {
          message: message,
          conversationId,
          imageBase64,
          analysisType
        }
      });

      if (error) {
        console.error('❌ Nutrition AI error:', error);
        toast.error('Não foi possível contatar a IA de nutrição. Tente novamente em instantes.');
        setIsTyping(false);
        return;
      }

      if (data.success) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isAI: true,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          analysisType
        };

        setMessages(prev => [...prev, aiMessage]);
        
        // Salvar resposta da IA na conversa
        if (conversationId) {
          await supabase
            .from('ai_messages')
            .insert({
              conversation_id: conversationId,
              role: 'assistant',
              content: data.response,
              analysis_type: analysisType
            });
        }
        
        if (selectedImage) {
          toast.success('Análise da refeição concluída!');
        }
      } else {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.error || 'A IA não pôde responder agora. Tente novamente em instantes.',
          isAI: true,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, aiMessage]);
        toast.error(data.error || 'Falha ao obter resposta da IA');
      }

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro. Tente novamente.',
        isAI: true,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Erro ao enviar mensagem. Tente novamente.');
    } finally {
      setSelectedImage(null);
      setIsTyping(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  const quickQuestions = [
    'Calcular macros para ganho de massa',
    'Plano alimentar 1800 calorias',  
    'Receita rica em proteínas',
    'Análise nutricional completa'
  ];

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Header Card - Mobile Optimized */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-4"
      >
        <VoltCard className="p-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                className="w-8 h-8 bg-green-500/20 rounded-xl flex items-center justify-center"
              >
                <ChefHat className="w-4 h-4 text-green-400" />
              </motion.div>
            </div>
            <h1 className="text-lg font-bold text-white">Dr. Nutri IA</h1>
            <Zap className="w-4 h-4 text-accent" />
          </div>
          <p className="text-txt-2 text-sm">
            Seu nutricionista pessoal inteligente com memória persistente!
          </p>
          
          <div className="flex justify-center mt-3">
            <Badge className="bg-green-500/20 text-green-400 border-green-400/50 text-xs">
              <Sparkles className="w-3 h-3 mr-1" />
              Online
            </Badge>
          </div>
        </VoltCard>
      </motion.div>

      {/* Image Upload Section - Mobile Optimized */}
      {selectedImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3"
        >
          <VoltCard className="p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Image className="w-4 h-4 text-accent" />
                <span className="text-sm text-accent">Imagem para análise</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
                className="text-txt-2 hover:text-white h-8 w-8 p-0"
              >
                ×
              </Button>
            </div>
          </VoltCard>
        </motion.div>
      )}

      {/* Quick Questions - Mobile Compact */}
      {messages.length <= 1 && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-3"
        >
          <VoltCard className="p-3">
            <p className="text-xs text-txt-2 mb-2">Perguntas rápidas:</p>
            <div className="grid grid-cols-2 gap-2">
              {quickQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSendMessage(question)}
                  className="text-xs p-2 bg-surface hover:bg-card rounded-xl text-txt-2 transition-colors border border-accent/20 hover:border-accent/40"
                >
                  {question}
                </button>
              ))}
            </div>
          </VoltCard>
        </motion.div>
      )}

      {/* Chat Interface - Mobile Enhanced */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
        className="relative min-h-[60vh]"
      >
        {/* Mobile Camera Upload Button */}
        <div className="absolute top-2 right-2 z-10">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            className="border-accent/30 text-accent hover:bg-accent/10 h-8 px-2 text-xs"
            disabled={isTyping}
          >
            <Camera className="w-3 h-3 mr-1" />
            Foto
          </Button>
        </div>

        <VoltChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isTyping={isTyping}
        />
      </motion.div>
    </div>
  );
};

export default NutritionAIChat;