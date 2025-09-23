import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { MessageCircle, Plus, Trash2, Edit3, Clock } from 'lucide-react';
import { AICoachService } from '@/services/AICoachService';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface AIConversation {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface ConversationManagerProps {
  onSelectConversation: (conversationId: string) => void;
  selectedConversationId?: string;
}

export const ConversationManager: React.FC<ConversationManagerProps> = ({
  onSelectConversation,
  selectedConversationId
}) => {
  const [conversations, setConversations] = useState<AIConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newConversationTitle, setNewConversationTitle] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const data = await AICoachService.getConversations();
      setConversations(data);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateConversation = async () => {
    if (!newConversationTitle.trim()) {
      toast({
        title: "Erro",
        description: "Digite um título para a conversa",
        variant: "destructive"
      });
      return;
    }

    try {
      const newConversation = await AICoachService.createConversation(newConversationTitle);
      if (newConversation) {
        await loadConversations();
        onSelectConversation(newConversation.id);
        setNewConversationTitle('');
        setIsCreateDialogOpen(false);
        toast({
          title: "Sucesso",
          description: "Nova conversa criada!"
        });
      }
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar a conversa",
        variant: "destructive"
      });
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      const success = await AICoachService.deleteConversation(conversationId);
      if (success) {
        await loadConversations();
        if (selectedConversationId === conversationId) {
          onSelectConversation('');
        }
        toast({
          title: "Sucesso",
          description: "Conversa excluída!"
        });
      }
    } catch (error) {
      console.error('Erro ao deletar conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conversa",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="h-full liquid-glass border-accent/20">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-txt flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-accent" />
            Conversas
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="outline" className="border-accent/40 hover:bg-accent/10">
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent className="liquid-glass border-accent/20">
              <DialogHeader>
                <DialogTitle className="text-txt">Nova Conversa</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={newConversationTitle}
                  onChange={(e) => setNewConversationTitle(e.target.value)}
                  placeholder="Digite o título da conversa..."
                  className="bg-input border-input-border text-txt"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateConversation();
                    }
                  }}
                />
                <div className="flex gap-2 justify-end">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="border-line text-txt-2"
                  >
                    Cancelar
                  </Button>
                  <Button
                    onClick={handleCreateConversation}
                    className="bg-accent text-accent-ink hover:bg-accent/90"
                  >
                    Criar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="text-center text-txt-2 py-8">
              Carregando conversas...
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center text-txt-2 py-8">
              <MessageCircle className="w-12 h-12 mx-auto mb-4 text-accent/50" />
              Nenhuma conversa ainda
              <p className="text-sm mt-2">Clique no + para criar sua primeira conversa</p>
            </div>
          ) : (
            <div className="space-y-2">
              {conversations.map((conversation) => (
                <Card
                  key={conversation.id}
                  className={`cursor-pointer transition-all border-line/40 ${
                    selectedConversationId === conversation.id
                      ? 'bg-accent/20 border-accent/40'
                      : 'hover:bg-surface/80 border-line/20'
                  }`}
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-txt truncate">
                          {conversation.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Clock className="w-3 h-3 text-txt-2" />
                          <span className="text-xs text-txt-2">
                            {format(new Date(conversation.updated_at), 'dd/MM HH:mm', { locale: ptBR })}
                          </span>
                        </div>
                      </div>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => e.stopPropagation()}
                            className="h-6 w-6 p-0 text-txt-2 hover:text-red-400 hover:bg-red-400/10"
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
                              onClick={() => handleDeleteConversation(conversation.id)}
                              className="bg-red-500 hover:bg-red-600 text-white"
                            >
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};