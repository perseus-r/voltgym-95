import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, MessageCircle, Share2, Plus, Camera, Trophy, 
  Zap, Target, Users, Send, User, MoreVertical
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";
import { CommunityComments } from "@/components/CommunityComments";

interface CommunityPost {
  id: string;
  user_id: string;
  content: string;
  post_type: string;
  visibility: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  created_at: string;
  workout_data?: any;
  media_urls?: string[];
  tags?: string[];
  ai_generated: boolean;
  user_profile?: {
    display_name: string;
    avatar_url: string | null;
    user_id: string;
    verified?: boolean;
  };
}

export function RealCommunityFeed() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);

  useEffect(() => {
    loadCommunityPosts();
  }, []);

  const loadCommunityPosts = async () => {
    try {
      setLoading(true);

      // Buscar posts da comunidade
      const { data: postsData, error: postsError } = await supabase
        .from('social_posts')
        .select('*')
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (postsError && postsError.code !== 'PGRST116') {
        throw postsError;
      }

      if (postsData && postsData.length > 0) {
        // Buscar perfis dos usuários
        const userIds = [...new Set(postsData.map(post => post.user_id))];
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, display_name, avatar_url, verified')
          .in('user_id', userIds);

        const formattedPosts = postsData.map(post => ({
          ...post,
          user_profile: profilesData?.find(p => p.user_id === post.user_id) || {
            display_name: 'Usuário VOLT',
            avatar_url: null,
            user_id: post.user_id,
            verified: false
          }
        }));

        setPosts(formattedPosts);
      } else {
        // Dados mock se não houver posts
        setPosts(getMockPosts());
      }
    } catch (error) {
      console.error('Erro ao carregar posts:', error);
      setPosts(getMockPosts());
    } finally {
      setLoading(false);
    }
  };

  const getMockPosts = (): CommunityPost[] => [
    {
      id: 'mock-1',
      user_id: 'mock-user-1',
      content: 'Acabei de completar meu treino de peito e tríceps! 💪 Consegui aumentar 5kg no supino inclinado. A constância realmente compensa!',
      post_type: 'workout',
      visibility: 'public',
      likes_count: 24,
      comments_count: 8,
      shares_count: 3,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      tags: ['treino', 'peito', 'progresso'],
      ai_generated: false,
      user_profile: {
        display_name: 'Carlos Mendes',
        avatar_url: null,
        user_id: 'mock-user-1',
        verified: true
      }
    },
    {
      id: 'mock-2',
      user_id: 'mock-user-2',
      content: 'Dica para quem está começando: foquem na técnica antes do peso! Melhor fazer com menos carga e forma perfeita. 🎯',
      post_type: 'tip',
      visibility: 'public',
      likes_count: 42,
      comments_count: 15,
      shares_count: 12,
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      tags: ['dica', 'iniciantes', 'técnica'],
      ai_generated: false,
      user_profile: {
        display_name: 'Ana Paula Silva',
        avatar_url: null,
        user_id: 'mock-user-2',
        verified: false
      }
    },
    {
      id: 'mock-3',
      user_id: 'mock-user-3',
      content: '🔥 30 dias consecutivos de treino! O hábito se tornou parte da minha rotina. Quem mais está numa sequência? #consistency',
      post_type: 'achievement',
      visibility: 'public',
      likes_count: 67,
      comments_count: 23,
      shares_count: 8,
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      tags: ['consistência', 'motivação', 'streak'],
      ai_generated: false,
      user_profile: {
        display_name: 'João Pedro',
        avatar_url: null,
        user_id: 'mock-user-3',
        verified: true
      }
    }
  ];

  const createPost = async () => {
    if (!user || !newPostContent.trim()) return;

    setSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('social_posts')
        .insert({
          user_id: user.id,
          content: newPostContent.trim(),
          post_type: 'text',
          visibility: 'public',
          ai_generated: false
        })
        .select()
        .single();

      if (error) throw error;

      setNewPostContent('');
      loadCommunityPosts(); // Recarregar posts
      toast.success('Post publicado na comunidade!');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast.error('Erro ao publicar post');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast.error('Faça login para curtir posts');
      return;
    }

    try {
      // Verificar se já curtiu
      const { data: existingLike } = await supabase
        .from('social_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        // Remove like
        await supabase
          .from('social_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        // Atualizar estado local
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: Math.max(0, post.likes_count - 1) }
            : post
        ));
      } else {
        // Adicionar like
        await supabase
          .from('social_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        
        // Atualizar estado local
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: post.likes_count + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Erro ao curtir/descurtir:', error);
    }
  };

  const sharePost = async (post: CommunityPost) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Post de ${post.user_profile?.display_name}`,
          text: post.content,
          url: window.location.href
        });
      } catch (error) {
        console.log('Share cancelled');
      }
    } else {
      await navigator.clipboard.writeText(`${post.content}\n\n- ${post.user_profile?.display_name} no VOLT Fitness`);
      toast.success('Link copiado para área de transferência!');
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffMinutes = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60));
    
    if (diffMinutes < 1) return 'agora';
    if (diffMinutes < 60) return `${diffMinutes}min`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)}h`;
    return `${Math.floor(diffMinutes / 1440)}d`;
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'workout': return <Trophy className="w-4 h-4 text-accent" />;
      case 'tip': return <Zap className="w-4 h-4 text-blue-400" />;
      case 'achievement': return <Target className="w-4 h-4 text-yellow-400" />;
      default: return <User className="w-4 h-4 text-txt-3" />;
    }
  };

  return (
    <Card className="liquid-glass p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-6 h-6 text-accent" />
        <div>
          <h3 className="text-xl font-bold text-txt">Comunidade VOLT</h3>
          <p className="text-sm text-txt-2">Compartilhe seu progresso e inspire outros</p>
        </div>
      </div>

      {/* Criar Post */}
      {/* Qualquer um pode ver, mas só usuários logados podem postar */}
      {user && (
        <Card className="liquid-glass p-4 mb-6">
          <div className="flex gap-3">
            <Avatar className="w-10 h-10 flex-shrink-0">
              <AvatarImage src={user.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-accent/20 text-accent">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-3">
              <Textarea
                placeholder="Compartilhe seu treino, dica ou conquista..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-20 resize-none border-line/30"
                maxLength={500}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-txt-3">
                    <Camera className="w-4 h-4 mr-1" />
                    Foto
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-xs text-txt-3">
                    {newPostContent.length}/500
                  </span>
                  <Button
                    onClick={createPost}
                    disabled={!newPostContent.trim() || submitting}
                    size="sm"
                    className="bg-accent text-accent-ink hover:bg-accent/90"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-accent-ink/30 border-t-accent-ink rounded-full animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Lista de Posts */}
      <div className="space-y-6">
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-txt-2">Carregando posts da comunidade...</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-txt-3 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-txt mb-2">Seja o primeiro a postar!</h4>
            <p className="text-txt-2">Compartilhe seu treino ou dica e inspire a comunidade.</p>
          </div>
        ) : (
          posts.map((post) => (
            <Card key={post.id} className="liquid-glass p-6">
              {/* Header do Post */}
              <div className="flex items-start gap-3 mb-4">
                <Avatar className="w-12 h-12 flex-shrink-0">
                  <AvatarImage src={post.user_profile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-accent/20 text-accent">
                    {post.user_profile?.display_name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-txt">
                      {post.user_profile?.display_name}
                    </h4>
                    {post.user_profile?.verified && <VerifiedBadge size="sm" />}
                    <span className="text-txt-3">•</span>
                    <span className="text-sm text-txt-3">
                      {formatTimeAgo(post.created_at)}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {getPostTypeIcon(post.post_type)}
                    <Badge variant="outline" className="text-xs">
                      {post.post_type === 'workout' && 'Treino'}
                      {post.post_type === 'tip' && 'Dica'}
                      {post.post_type === 'achievement' && 'Conquista'}
                      {post.post_type === 'text' && 'Geral'}
                    </Badge>
                  </div>
                </div>
                
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              {/* Conteúdo do Post */}
              <div className="mb-4">
                <p className="text-txt leading-relaxed whitespace-pre-wrap">
                  {post.content}
                </p>
                
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 mt-3 flex-wrap">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              {/* Ações do Post */}
              <div className="flex items-center justify-between pt-4 border-t border-line/30">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className="flex items-center gap-2 text-txt-3 hover:text-red-400 transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span className="text-sm">{post.likes_count}</span>
                  </button>
                  
                  <button
                    onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                    className="flex items-center gap-2 text-txt-3 hover:text-blue-400 transition-colors"
                  >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">{post.comments_count}</span>
                  </button>
                  
                  <button
                    onClick={() => sharePost(post)}
                    className="flex items-center gap-2 text-txt-3 hover:text-accent transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                    <span className="text-sm">{post.shares_count}</span>
                  </button>
                </div>
              </div>

              {/* Seção de Comentários */}
              {showComments === post.id && (
                <div className="mt-4 pt-4 border-t border-line/30">
                  <CommunityComments
                    postId={post.id}
                    postType="social_posts"
                  />
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {!user && (
        <div className="text-center py-8 border-t border-line/30 mt-6">
          <p className="text-txt-2 mb-4">
            Comunidade pública - navegue livremente! Faça login para participar postando.
          </p>
          <Button variant="outline" className="liquid-glass-button">
            Entrar para Postar
          </Button>
        </div>
      )}
    </Card>
  );
}