import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VoltChatInterface } from '@/components/VoltTypewriter';
import { VoltCard } from '@/components/VoltCard';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Bot, Zap, MessageCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { WorkoutCreationNotification } from '@/components/WorkoutCreationNotification';
import { ConversationManager } from '@/components/ConversationManager';
import { AICoachService } from '@/services/AICoachService';
import { toast } from 'sonner';
import { ErrorBoundary } from '@/components/ErrorFallback';
import { LoadingOverlay } from '@/components/SmoothTransitions';

export default function IACoachPage() {
  const [messages, setMessages] = useState([
    {
      id: '1',
      text: 'Olá! Sou seu IA Coach pessoal. Posso criar treinos personalizados, dar dicas de exercícios e responder suas dúvidas sobre fitness. Como posso te ajudar hoje?',
      isAI: true,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [workoutCreated, setWorkoutCreated] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<string>('');
  const [conversations, setConversations] = useState<any[]>([]);

  // Carregar conversas salvas e mensagens persistentes
  React.useEffect(() => {
    console.log('🤖 IA Coach Page loaded');
    
    const loadConversations = async () => {
      try {
        const convs = await AICoachService.getConversations();
        setConversations(convs || []);
        console.log('📊 Conversations loaded:', convs?.length || 0);
      } catch (error) {
        console.error('❌ Error loading conversations:', error);
      }
    };
    
    // Carregar última conversa se existir
    const loadLastConversation = async () => {
      try {
        const convs = await AICoachService.getConversations();
        if (convs && convs.length > 0) {
          const lastConversation = convs[0]; // Mais recente
          setCurrentConversationId(lastConversation.id);
          
          const conversationMessages = await AICoachService.getConversationMessages(lastConversation.id);
          
          if (conversationMessages && conversationMessages.length > 0) {
            const formattedMessages = conversationMessages.map((msg, index) => ({
              id: `${msg.id}_${index}`,
              text: msg.content,
              isAI: msg.role === 'assistant',
              timestamp: new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            }));

            setMessages(formattedMessages);
            console.log('💬 Messages loaded:', formattedMessages.length);
          }
        }
      } catch (error) {
        console.error('❌ Error loading conversation:', error);
      }
    };
    
    loadConversations();
    loadLastConversation();
  }, []);

  const handleSendMessage = async (message: string) => {
    console.log('📤 Sending message:', message);
    
    // Criar conversa se não existe
    if (!currentConversationId) {
      try {
        const newConversation = await AICoachService.createConversation('Chat IA Coach');
        if (newConversation) {
          setCurrentConversationId(newConversation.id);
          console.log('🆕 New conversation created:', newConversation.id);
        }
      } catch (error) {
        console.error('❌ Error creating conversation:', error);
      }
    }

    const userMessage = {
      id: Date.now().toString(),
      text: message,
      isAI: false,
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Salvar mensagem do usuário
      if (currentConversationId) {
        await AICoachService.saveMessage(currentConversationId, 'user', message);
      }

      console.log('🤖 Calling AI Coach function...');
      
      const { data, error } = await supabase.functions.invoke('ai-coach', {
        body: { 
          message, 
          conversation_history: messages,
          userId: (await supabase.auth.getUser()).data.user?.id 
        }
      });

      console.log('📥 AI Coach response:', data);
      console.log('❌ AI Coach error:', error);

      if (error) {
        console.error('🚨 AI Coach function error:', error);
        throw error;
      }

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: data.response || 'Desculpe, não consegui processar sua solicitação no momento.',
        isAI: true,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMessage]);

      // Salvar resposta da IA
      if (currentConversationId) {
        await AICoachService.saveMessage(
          currentConversationId, 
          'assistant', 
          data.response,
          data.analysisType,
          data.insights,
          data.recommendations,
          data.tags
        );
      }

      if (data.workout_created || data.workoutCreated) {
        console.log('🏋️ Workout created!');
        setWorkoutCreated(true);
        setTimeout(() => setWorkoutCreated(false), 5000);
        toast.success('Treino criado com sucesso!');
      }

    } catch (error) {
      console.error('❌ Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Desculpe, ocorreu um erro. Verifique sua conexão e tente novamente. Se o problema persistir, a API pode estar temporariamente indisponível.',
        isAI: true,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
      toast.error('Erro ao enviar mensagem. Verifique os logs do console.');
    } finally {
      setIsTyping(false);
    }
  };

  const handleSelectConversation = async (conversationId: string) => {
    if (!conversationId) {
      // Nova conversa
      setCurrentConversationId('');
      setMessages([
        {
          id: '1',
          text: 'Olá! Sou seu IA Coach pessoal. Posso criar treinos personalizados, dar dicas de exercícios e responder suas dúvidas sobre fitness. Como posso te ajudar hoje?',
          isAI: true,
          timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      return;
    }

    setCurrentConversationId(conversationId);
    
    // Carregar mensagens da conversa
    const conversationMessages = await AICoachService.getConversationMessages(conversationId);
    
    const formattedMessages = conversationMessages.map((msg, index) => ({
      id: `${msg.id}_${index}`,
      text: msg.content,
      isAI: msg.role === 'assistant',
      timestamp: new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
    }));

    // Adicionar mensagem de boas-vindas se não há mensagens
    if (formattedMessages.length === 0) {
      formattedMessages.unshift({
        id: '1',
        text: 'Olá! Sou seu IA Coach pessoal. Posso criar treinos personalizados, dar dicas de exercícios e responder suas dúvidas sobre fitness. Como posso te ajudar hoje?',
        isAI: true,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      });
    }

    setMessages(formattedMessages);
    toast.success('Conversa carregada!');
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-bg">
        <div className="container-custom pt-6 pb-24">
          <LoadingOverlay isLoading={isTyping}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="mb-6"
              >
                <VoltCard className="p-6 text-center">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="relative">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center"
                      >
                        <Bot className="w-6 h-6 text-accent" />
                      </motion.div>
                    </div>
                    <h1 className="text-2xl font-bold text-white">IA Coach</h1>
                    <Zap className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-txt-2">
                    Seu treinador pessoal inteligente com memória de conversas. Peça treinos personalizados, dicas de exercícios e muito mais!
                  </p>
                  
                  {/* Botão Chats */}
                  <div className="flex justify-center mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent/10">
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Chats ({conversations.length})
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden liquid-glass border-accent/20">
                        <DialogHeader>
                          <DialogTitle className="text-txt flex items-center gap-2">
                            <MessageCircle className="w-5 h-5 text-accent" />
                            Conversas Salvas
                          </DialogTitle>
                        </DialogHeader>
                        <div className="mt-4">
                          <ConversationManager
                            onSelectConversation={handleSelectConversation}
                            selectedConversationId={currentConversationId}
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </VoltCard>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <VoltChatInterface
                  messages={messages}
                  onSendMessage={handleSendMessage}
                  isTyping={isTyping}
                />
              </motion.div>
            </motion.div>
          </LoadingOverlay>
        </div>

        {workoutCreated && (
          <WorkoutCreationNotification 
            workoutName="Treino Personalizado"
            onDismiss={() => setWorkoutCreated(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}