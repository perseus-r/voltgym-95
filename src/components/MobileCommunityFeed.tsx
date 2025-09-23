import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Heart, MessageCircle, Share2, Camera, Trophy, 
  Zap, Target, Users, Send, User, MoreVertical,
  TrendingUp, Clock, Flame, Filter, Plus,
  Image as ImageIcon, Award, Crown, ChevronDown
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";
import { CommunityComments } from "@/components/CommunityComments";
import { AvatarUpload } from "@/components/AvatarUpload";
import { useSubscription } from "@/hooks/useSubscription";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";

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

interface UserProfile {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  verified: boolean;
}

export function MobileCommunityFeed() {
  const { user } = useAuth();
  const { isPremium, isPro } = useSubscription();
  const isMobile = useIsMobile();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('todos');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);

  useEffect(() => {
    loadCommunityPosts();
    if (user) {
      loadUserProfile();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('user_id, display_name, avatar_url, verified')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setUserProfile(data);
      } else {
        // Criar perfil se não existir
        const { data: newProfile, error: createError } = await supabase
          .from('profiles')
          .insert({
            user_id: user.id,
            display_name: user.user_metadata?.display_name || user.email?.split('@')[0] || 'Usuário VOLT',
            avatar_url: null,
            verified: isPremium || isPro
          })
          .select()
          .single();

        if (createError) throw createError;
        setUserProfile(newProfile);
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  };

  const loadCommunityPosts = async () => {
    try {
      setLoading(true);

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
      content: '🔥 30 dias consecutivos de treino! O hábito se tornou parte da minha rotina. Quem mais está numa sequência?',
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
      setShowCreatePost(false);
      loadCommunityPosts();
      toast.success('Post publicado!');
    } catch (error) {
      console.error('Erro ao criar post:', error);
      toast.error('Erro ao publicar post');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) {
      toast.error('Faça login para curtir');
      return;
    }

    try {
      const { data: existingLike } = await supabase
        .from('social_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single();

      if (existingLike) {
        await supabase
          .from('social_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id);
        
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: Math.max(0, post.likes_count - 1) }
            : post
        ));
      } else {
        await supabase
          .from('social_likes')
          .insert({
            post_id: postId,
            user_id: user.id
          });
        
        setPosts(posts.map(post => 
          post.id === postId 
            ? { ...post, likes_count: post.likes_count + 1 }
            : post
        ));
      }
    } catch (error) {
      console.error('Erro ao curtir:', error);
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
      toast.success('Copiado!');
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
      case 'workout': return <Trophy className="w-3 h-3 text-accent" />;
      case 'tip': return <Zap className="w-3 h-3 text-blue-400" />;
      case 'achievement': return <Award className="w-3 h-3 text-yellow-400" />;
      default: return <User className="w-3 h-3 text-txt-3" />;
    }
  };

  const getFilteredPosts = () => {
    switch (activeTab) {
      case 'treinos': return posts.filter(p => p.post_type === 'workout');
      case 'dicas': return posts.filter(p => p.post_type === 'tip');
      case 'conquistas': return posts.filter(p => p.post_type === 'achievement');
      default: return posts;
    }
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    if (userProfile) {
      setUserProfile({ ...userProfile, avatar_url: newAvatarUrl });
    }
    loadCommunityPosts();
    setShowProfileEdit(false);
  };

  // Se não for mobile, usar versão desktop
  if (!isMobile) {
    return null;
  }

  return (
    <div className="space-y-4 pb-20">
      {/* Header Mobile */}
      <div className="sticky top-0 z-10 bg-bg/80 backdrop-blur-xl border-b border-line/20 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
              <Users className="w-4 h-4 text-accent-ink" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-txt">Comunidade</h1>
              <p className="text-xs text-txt-2">{posts.length} posts ativos</p>
            </div>
          </div>
          
          {user && (
            <Button
              onClick={() => setShowCreatePost(true)}
              size="sm"
              className="btn-premium"
            >
              <Plus className="w-4 h-4 mr-1" />
              Postar
            </Button>
          )}
        </div>

        {/* Filtros Mobile */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { id: 'todos', label: 'Todos', icon: TrendingUp },
            { id: 'treinos', label: 'Treinos', icon: Trophy },
            { id: 'dicas', label: 'Dicas', icon: Zap },
            { id: 'conquistas', label: 'Conquistas', icon: Award }
          ].map((tab) => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? "default" : "outline"}
              size="sm"
              className={`flex-shrink-0 text-xs ${
                activeTab === tab.id 
                  ? 'bg-accent text-accent-ink' 
                  : 'bg-card/50 text-txt-2'
              }`}
            >
              <tab.icon className="w-3 h-3 mr-1" />
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {showCreatePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 flex items-end"
            onClick={() => setShowCreatePost(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 500 }}
              className="w-full bg-card rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-txt">Novo Post</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowCreatePost(false)}
                >
                  ✕
                </Button>
              </div>

              <div className="flex gap-3 mb-4">
                <Avatar className="w-10 h-10 ring-2 ring-accent/20">
                  <AvatarImage src={userProfile?.avatar_url || undefined} />
                  <AvatarFallback className="bg-gradient-primary text-accent-ink font-semibold">
                    {userProfile?.display_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-medium text-txt text-sm">
                    {userProfile?.display_name || user?.email?.split('@')[0] || 'Usuário'}
                  </p>
                  {userProfile?.verified && (
                    <div className="flex items-center gap-1">
                      <VerifiedBadge size="sm" />
                      <span className="text-xs text-txt-2">Verificado</span>
                    </div>
                  )}
                </div>
              </div>

              <Textarea
                placeholder="Compartilhe seu treino, conquista ou dica..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-32 resize-none border-line/30 mb-4"
                maxLength={500}
              />

              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-txt-3">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Foto
                  </Button>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${newPostContent.length > 450 ? 'text-red-400' : 'text-txt-3'}`}>
                    {newPostContent.length}/500
                  </span>
                  <Button
                    onClick={createPost}
                    disabled={!newPostContent.trim() || submitting}
                    className="btn-premium"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-accent-ink/30 border-t-accent-ink rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-1" />
                        Postar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Edit Modal */}
      <AnimatePresence>
        {showProfileEdit && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm p-4 flex items-center justify-center"
            onClick={() => setShowProfileEdit(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-sm bg-card rounded-2xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-txt">Foto de Perfil</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowProfileEdit(false)}
                >
                  ✕
                </Button>
              </div>
              <AvatarUpload
                currentAvatarUrl={userProfile?.avatar_url}
                onAvatarUpdate={handleAvatarUpdate}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Posts Feed */}
      <div className="px-4 space-y-4">
        {loading ? (
          <Card className="glass-card p-6">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-3" />
              <p className="text-txt-2 text-sm">Carregando...</p>
            </div>
          </Card>
        ) : getFilteredPosts().length === 0 ? (
          <Card className="glass-card p-6">
            <div className="text-center">
              <Users className="w-12 h-12 text-txt-3 mx-auto mb-3" />
              <h3 className="font-semibold text-txt mb-2">Nenhum post ainda</h3>
              <p className="text-txt-2 text-sm mb-4">
                Seja o primeiro a compartilhar na comunidade!
              </p>
              {user && (
                <Button
                  onClick={() => setShowCreatePost(true)}
                  className="btn-premium"
                >
                  Criar Post
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <motion.div layout className="space-y-3">
            <AnimatePresence>
              {getFilteredPosts().map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="glass-card p-4">
                    {/* Header do Post */}
                    <div className="flex items-start gap-3 mb-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10 ring-1 ring-accent/20">
                          <AvatarImage src={post.user_profile?.avatar_url || undefined} />
                          <AvatarFallback className="bg-gradient-primary text-accent-ink font-semibold text-sm">
                            {post.user_profile?.display_name?.[0]?.toUpperCase() || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        {user?.id === post.user_id && (
                          <button
                            onClick={() => setShowProfileEdit(true)}
                            className="absolute -bottom-1 -right-1 w-5 h-5 bg-accent text-accent-ink rounded-full flex items-center justify-center text-xs"
                          >
                            <Camera className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-txt text-sm truncate">
                            {post.user_profile?.display_name}
                          </h4>
                          {post.user_profile?.verified && <VerifiedBadge size="sm" />}
                          <span className="text-txt-3 text-xs">•</span>
                          <span className="text-xs text-txt-3 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            {formatTimeAgo(post.created_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {getPostTypeIcon(post.post_type)}
                          <Badge variant="outline" className="text-xs h-5">
                            {post.post_type === 'workout' && 'Treino'}
                            {post.post_type === 'tip' && 'Dica'}
                            {post.post_type === 'achievement' && 'Conquista'}
                            {post.post_type === 'text' && 'Geral'}
                          </Badge>
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="w-3 h-3" />
                      </Button>
                    </div>

                    {/* Conteúdo */}
                    <div className="mb-3 ml-13">
                      <p className="text-txt text-sm leading-relaxed">
                        {post.content}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-1 mt-2 flex-wrap">
                          {post.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs h-5">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ações */}
                    <div className="flex items-center justify-between pt-3 border-t border-line/20">
                      <div className="flex items-center gap-4">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-1 text-txt-3 hover:text-red-400 transition-colors"
                        >
                          <Heart className="w-4 h-4" />
                          <span className="text-xs">{post.likes_count}</span>
                        </motion.button>
                        
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                          className="flex items-center gap-1 text-txt-3 hover:text-blue-400 transition-colors"
                        >
                          <MessageCircle className="w-4 h-4" />
                          <span className="text-xs">{post.comments_count}</span>
                        </motion.button>
                        
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => sharePost(post)}
                          className="flex items-center gap-1 text-txt-3 hover:text-accent transition-colors"
                        >
                          <Share2 className="w-4 h-4" />
                          <span className="text-xs">{post.shares_count}</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Comentários */}
                    <AnimatePresence>
                      {showComments === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 pt-3 border-t border-line/20"
                        >
                          <CommunityComments
                            postId={post.id}
                            postType="social_posts"
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* CTA para login */}
      {!user && (
        <div className="px-4">
          <Card className="glass-card p-6 text-center">
            <Crown className="w-12 h-12 text-accent mx-auto mb-3" />
            <h3 className="font-bold text-txt mb-2">Junte-se à Comunidade</h3>
            <p className="text-txt-2 text-sm mb-4">
              Faça login para postar, curtir e comentar
            </p>
            <Button className="btn-premium w-full">
              Entrar
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}