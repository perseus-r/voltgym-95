import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  Calendar, 
  Trash2, 
  Eye,
  Camera,
  Calculator,
  ChefHat,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  message_count: number;
  last_message: string;
  has_images: boolean;
}

interface NutritionConversationHistoryProps {
  onSelectConversation: (conversationId: string) => void;
  className?: string;
}

const NutritionConversationHistory = ({ 
  onSelectConversation, 
  className = '' 
}: NutritionConversationHistoryProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Get conversations with message stats
      const { data: convs, error } = await supabase
        .from('ai_conversations')
        .select(`
          id,
          title,
          created_at,
          ai_messages (
            id,
            content,
            analysis_type,
            created_at
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedConversations: Conversation[] = convs?.map(conv => {
        const messages = conv.ai_messages || [];
        const lastMessage = messages
          .filter(m => m.content)
          .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];
        
        const hasImages = messages.some(m => m.analysis_type === 'photo_analysis');
        
        return {
          id: conv.id,
          title: conv.title,
          created_at: conv.created_at,
          message_count: messages.length,
          last_message: lastMessage?.content?.substring(0, 100) || 'Conversa iniciada',
          has_images: hasImages
        };
      }) || [];

      setConversations(processedConversations);
    } catch (error) {
      console.error('Error loading conversations:', error);
      toast.error('Erro ao carregar conversas');
    } finally {
      setLoading(false);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      const { error } = await supabase
        .from('ai_conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.filter(c => c.id !== conversationId));
      toast.success('Conversa excluída');
    } catch (error) {
      console.error('Error deleting conversation:', error);
      toast.error('Erro ao excluir conversa');
    }
  };

  const getConversationIcon = (conversation: Conversation) => {
    if (conversation.has_images) return Camera;
    if (conversation.title.toLowerCase().includes('macro')) return Calculator;
    if (conversation.title.toLowerCase().includes('receita')) return ChefHat;
    return MessageCircle;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Hoje';
    if (diffDays === 2) return 'Ontem';
    if (diffDays <= 7) return `${diffDays - 1} dias atrás`;
    
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card className={`glass-card p-6 ${className}`}>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`glass-card ${className}`}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-accent" />
            Conversas Salvas
          </h3>
          <Badge className="bg-accent/20 text-accent border-accent/50">
            {conversations.length} conversas
          </Badge>
        </div>

        {conversations.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-txt-2 mx-auto mb-4" />
            <p className="text-txt-2">Nenhuma conversa salva ainda</p>
            <p className="text-sm text-txt-2 mt-2">
              Inicie uma conversa com Dr. Nutri para vê-la aqui
            </p>
          </div>
        ) : (
          <ScrollArea className="h-96">
            <div className="space-y-3 pr-4">
              <AnimatePresence>
                {conversations.map((conversation) => {
                  const IconComponent = getConversationIcon(conversation);
                  
                  return (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className="group"
                    >
                      <Card className="p-4 bg-surface/30 border border-white/10 hover:border-accent/30 transition-all duration-200 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div 
                            className="flex-1 min-w-0"
                            onClick={() => onSelectConversation(conversation.id)}
                          >
                            <div className="flex items-center gap-2 mb-2">
                              <IconComponent className="w-4 h-4 text-accent flex-shrink-0" />
                              <h4 className="text-sm font-medium text-white truncate">
                                {conversation.title}
                              </h4>
                              {conversation.has_images && (
                                <Badge variant="outline" className="text-xs">
                                  <Camera className="w-3 h-3 mr-1" />
                                  Fotos
                                </Badge>
                              )}
                            </div>
                            
                            <p className="text-xs text-txt-2 mb-2 line-clamp-2">
                              {conversation.last_message}
                            </p>
                            
                            <div className="flex items-center justify-between text-xs text-txt-2">
                              <div className="flex items-center gap-3">
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatDate(conversation.created_at)}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MessageCircle className="w-3 h-3" />
                                  {conversation.message_count} mensagens
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => onSelectConversation(conversation.id)}
                              className="h-8 w-8 p-0 text-accent hover:bg-accent/10"
                            >
                              <Eye className="w-3 h-3" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 text-red-400 hover:bg-red-400/10"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="liquid-glass border-accent/20">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-txt">Excluir Conversa</AlertDialogTitle>
                                  <AlertDialogDescription className="text-txt-2">
                                    Tem certeza que deseja excluir "{conversation.title}"? Esta ação não pode ser desfeita.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="border-line text-txt-2">Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteConversation(conversation.id)}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                  >
                                    Excluir
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </ScrollArea>
        )}
      </div>
    </Card>
  );
};

export default NutritionConversationHistory;