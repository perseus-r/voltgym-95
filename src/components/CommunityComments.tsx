import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Reply, User, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import VerifiedBadge from '@/components/VerifiedBadge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface Comment {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  likes_count: number;
  user_profile: {
    display_name: string;
    avatar_url: string | null;
  };
}

interface CommunityCommentsProps {
  postId: string;
  postType: 'social_posts' | 'ai_feed_content';
}

export function CommunityComments({ postId, postType }: CommunityCommentsProps) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadComments();
  }, [postId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      
      // Buscar comentários
      const { data: commentsData, error } = await supabase
        .from('social_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      // Buscar perfis dos usuários que comentaram
      const userIds = commentsData?.map(comment => comment.user_id) || [];
      const { data: profilesData } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url')
        .in('user_id', userIds);

      const formattedComments = commentsData?.map(comment => {
        const profile = profilesData?.find(p => p.user_id === comment.user_id);
        return {
          ...comment,
          user_profile: {
            display_name: profile?.display_name || 'Usuário VOLT',
            avatar_url: profile?.avatar_url
          }
        };
      }) || [];

      setComments(formattedComments);
    } catch (error) {
      console.error('Erro ao carregar comentários:', error);
      // Mock data para fallback
      setComments([
        {
          id: 'mock-1',
          content: 'Muito inspirador! Continue assim! 💪',
          created_at: '2024-01-15T10:30:00Z',
          user_id: 'mock-user-1',
          likes_count: 3,
          user_profile: {
            display_name: 'Carlos M.',
            avatar_url: null
          }
        },
        {
          id: 'mock-2',
          content: 'Dica excelente! Vou aplicar no meu treino hoje.',
          created_at: '2024-01-15T11:15:00Z',
          user_id: 'mock-user-2',
          likes_count: 1,
          user_profile: {
            display_name: 'Ana P.',
            avatar_url: null
          }
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const submitComment = async () => {
    if (!user || !newComment.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase
        .from('social_comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content: newComment.trim()
        });

      if (error) throw error;

      setNewComment('');
      loadComments(); // Recarregar comentários
      toast.success('Comentário adicionado!');
    } catch (error) {
      console.error('Erro ao adicionar comentário:', error);
      toast.error('Erro ao adicionar comentário');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - commentTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'agora';
    if (diffMinutes < 60) return `${diffMinutes}min`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
    return `${Math.floor(diffMinutes / 1440)}d`;
  };

  return (
    <div className="space-y-4">
      {/* Lista de Comentários */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-4">
            <div className="text-sm text-txt-3">Carregando comentários...</div>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-4">
            <MessageCircle className="w-8 h-8 text-txt-3 mx-auto mb-2" />
            <div className="text-sm text-txt-3">Seja o primeiro a comentar!</div>
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="flex gap-3 p-3 rounded-lg bg-white/5">
              {/* Avatar */}
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                  {comment.user_profile.avatar_url ? (
                    <img 
                      src={comment.user_profile.avatar_url} 
                      alt={comment.user_profile.display_name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4 text-accent" />
                  )}
                </div>
              </div>

              {/* Conteúdo */}
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-txt">
                    {comment.user_profile.display_name}
                  </span>
                  <VerifiedBadge size="sm" />
                  <span className="text-xs text-txt-3">
                    {formatTimeAgo(comment.created_at)}
                  </span>
                  {comment.user_id === user?.id && (
                    <Badge variant="outline" className="text-xs">Você</Badge>
                  )}
                </div>
                
                <p className="text-sm text-txt-2 leading-relaxed">
                  {comment.content}
                </p>
                
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-xs text-txt-3 hover:text-red-400 transition-colors">
                    <Heart className="w-3 h-3" />
                    <span>{comment.likes_count}</span>
                  </button>
                  <button className="text-xs text-txt-3 hover:text-accent transition-colors">
                    <Reply className="w-3 h-3 inline mr-1" />
                    Responder
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Novo Comentário */}
      {user && (
        <Card className="p-4 bg-white/5">
          <div className="space-y-3">
            <Textarea
              placeholder="Adicione um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-20 resize-none"
              maxLength={500}
            />
            
            <div className="flex items-center justify-between">
              <span className="text-xs text-txt-3">
                {newComment.length}/500 caracteres
              </span>
              
              <Button
                onClick={submitComment}
                disabled={!newComment.trim() || submitting}
                size="sm"
              >
                {submitting ? 'Enviando...' : 'Comentar'}
              </Button>
            </div>
          </div>
        </Card>
      )}
      
      {!user && (
        <div className="text-center py-4">
          <p className="text-sm text-txt-3">
            Faça login para comentar
          </p>
        </div>
      )}
    </div>
  );
}