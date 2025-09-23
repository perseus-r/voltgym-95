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
  TrendingUp, Clock, Flame, Plus, Filter,
  Image as ImageIcon, Video, Award, Crown
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import VerifiedBadge from "@/components/VerifiedBadge";
import { CommunityComments } from "@/components/CommunityComments";
import { AvatarUpload } from "@/components/AvatarUpload";
import { useSubscription } from "@/hooks/useSubscription";
import { motion, AnimatePresence } from "framer-motion";

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

export function EnhancedCommunityFeed() {
  const { user } = useAuth();
  const { isPremium, isPro } = useSubscription();
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showComments, setShowComments] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('todos');
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [showProfileEdit, setShowProfileEdit] = useState(false);

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
      content: 'Acabei de completar meu treino de peito e tríceps! 💪 Consegui aumentar 5kg no supino inclinado. A constância realmente compensa! #NovaRP #Progresso',
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
      content: 'Dica para quem está começando: foquem na técnica antes do peso! Melhor fazer com menos carga e forma perfeita. 🎯 A progressão vem naturalmente quando a base está sólida.',
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
      content: '🔥 30 dias consecutivos de treino! O hábito se tornou parte da minha rotina. Quem mais está numa sequência? Vamos manter essa energia! #consistency #VoltTeam',
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
      loadCommunityPosts();
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
      case 'achievement': return <Award className="w-4 h-4 text-yellow-400" />;
      default: return <User className="w-4 h-4 text-txt-3" />;
    }
  };

  const getPostTypeColor = (type: string) => {
    switch (type) {
      case 'workout': return 'border-l-accent';
      case 'tip': return 'border-l-blue-400';
      case 'achievement': return 'border-l-yellow-400';
      default: return 'border-l-txt-3';
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
    loadCommunityPosts(); // Recarregar para atualizar posts do usuário
  };

  return (
    <div className="space-y-6">
      {/* Header Aprimorado */}
      <Card className="liquid-glass p-6 border-l-4 border-l-accent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-primary">
              <Users className="w-6 h-6 text-accent-ink" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-txt flex items-center gap-2">
                Comunidade VOLT
                <Badge className="bg-accent/20 text-accent border-accent/30">
                  <Flame className="w-3 h-3 mr-1" />
                  Ativa
                </Badge>
              </h2>
              <p className="text-txt-2">Conecte-se, compartilhe e inspire a comunidade fitness</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {posts.length} posts
            </Badge>
            <Badge variant="outline" className="text-xs">
              {posts.reduce((acc, post) => acc + post.likes_count, 0)} curtidas
            </Badge>
          </div>
        </div>

        {/* Filtros por Abas */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 w-full bg-surface/30">
            <TabsTrigger value="todos" className="text-xs">
              <TrendingUp className="w-3 h-3 mr-1" />
              Todos
            </TabsTrigger>
            <TabsTrigger value="treinos" className="text-xs">
              <Trophy className="w-3 h-3 mr-1" />
              Treinos
            </TabsTrigger>
            <TabsTrigger value="dicas" className="text-xs">
              <Zap className="w-3 h-3 mr-1" />
              Dicas
            </TabsTrigger>
            <TabsTrigger value="conquistas" className="text-xs">
              <Award className="w-3 h-3 mr-1" />
              Conquistas
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </Card>

      {/* Criar Post Aprimorado */}
      {user && (
        <Card className="liquid-glass p-6">
          <div className="flex gap-4">
            <div className="relative">
              <Avatar className="w-12 h-12 ring-2 ring-accent/30">
                <AvatarImage src={userProfile?.avatar_url || undefined} />
                <AvatarFallback className="bg-gradient-primary text-accent-ink font-semibold">
                  {userProfile?.display_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              
              <button
                onClick={() => setShowProfileEdit(!showProfileEdit)}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-accent text-accent-ink rounded-full flex items-center justify-center hover:bg-accent/80 transition-colors shadow-lg"
              >
                <Camera className="w-3 h-3" />
              </button>
            </div>
            
            <div className="flex-1 space-y-4">
              <Textarea
                placeholder="Compartilhe seu treino, dica ou conquista com a comunidade..."
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                className="min-h-24 resize-none border-line/30 focus:border-accent/50 transition-colors"
                maxLength={500}
              />
              
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" className="text-txt-3 hover:text-accent">
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Foto
                  </Button>
                  {(isPremium || isPro) && (
                    <Button variant="ghost" size="sm" className="text-txt-3 hover:text-purple-400">
                      <Video className="w-4 h-4 mr-1" />
                      Vídeo
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`text-xs ${newPostContent.length > 450 ? 'text-red-400' : 'text-txt-3'}`}>
                    {newPostContent.length}/500
                  </span>
                  <Button
                    onClick={createPost}
                    disabled={!newPostContent.trim() || submitting}
                    className="btn-premium px-6"
                  >
                    {submitting ? (
                      <div className="w-4 h-4 border-2 border-accent-ink/30 border-t-accent-ink rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Postar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Editor de Avatar */}
          <AnimatePresence>
            {showProfileEdit && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-line/30"
              >
                <AvatarUpload
                  currentAvatarUrl={userProfile?.avatar_url}
                  onAvatarUpdate={handleAvatarUpdate}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      )}

      {/* Lista de Posts Aprimorada */}
      <div className="space-y-4">
        {loading ? (
          <Card className="liquid-glass p-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-txt-2">Carregando posts da comunidade...</p>
            </div>
          </Card>
        ) : getFilteredPosts().length === 0 ? (
          <Card className="liquid-glass p-8">
            <div className="text-center">
              <Users className="w-16 h-16 text-txt-3 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-txt mb-2">
                {activeTab === 'todos' ? 'Seja o primeiro a postar!' : `Nenhum post de ${activeTab} ainda`}
              </h3>
              <p className="text-txt-2 mb-6">
                Compartilhe seu progresso e inspire a comunidade VOLT.
              </p>
              {!user && (
                <Button className="btn-premium">
                  Entrar para Participar
                </Button>
              )}
            </div>
          </Card>
        ) : (
          <motion.div layout className="space-y-4">
            <AnimatePresence>
              {getFilteredPosts().map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className={`liquid-glass p-6 border-l-4 ${getPostTypeColor(post.post_type)} hover:shadow-lg transition-all duration-300`}>
                    {/* Header do Post */}
                    <div className="flex items-start gap-4 mb-4">
                      <Avatar className="w-14 h-14 ring-2 ring-accent/20">
                        <AvatarImage src={post.user_profile?.avatar_url || undefined} />
                        <AvatarFallback className="bg-gradient-primary text-accent-ink font-semibold">
                          {post.user_profile?.display_name?.[0]?.toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-bold text-txt">
                            {post.user_profile?.display_name}
                          </h4>
                          {post.user_profile?.verified && <VerifiedBadge size="sm" />}
                          {(isPremium || isPro) && post.user_id === user?.id && (
                            <Crown className="w-4 h-4 text-accent" />
                          )}
                          <span className="text-txt-3">•</span>
                          <span className="text-sm text-txt-3 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatTimeAgo(post.created_at)}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          {getPostTypeIcon(post.post_type)}
                          <Badge variant="outline" className="text-xs">
                            {post.post_type === 'workout' && 'Treino'}
                            {post.post_type === 'tip' && 'Dica'}
                            {post.post_type === 'achievement' && 'Conquista'}
                            {post.post_type === 'text' && 'Geral'}
                          </Badge>
                          {post.ai_generated && (
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                              IA
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <Button variant="ghost" size="sm" className="text-txt-3">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Conteúdo do Post */}
                    <div className="mb-6 pl-[4.5rem]">
                      <p className="text-txt leading-relaxed whitespace-pre-wrap mb-4">
                        {post.content}
                      </p>
                      
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs hover:bg-accent/10 cursor-pointer">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Ações do Post */}
                    <div className="flex items-center justify-between pt-4 border-t border-line/20">
                      <div className="flex items-center gap-8">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleLike(post.id)}
                          className="flex items-center gap-2 text-txt-3 hover:text-red-400 transition-colors"
                        >
                          <Heart className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.likes_count}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowComments(showComments === post.id ? null : post.id)}
                          className="flex items-center gap-2 text-txt-3 hover:text-blue-400 transition-colors"
                        >
                          <MessageCircle className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.comments_count}</span>
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => sharePost(post)}
                          className="flex items-center gap-2 text-txt-3 hover:text-accent transition-colors"
                        >
                          <Share2 className="w-5 h-5" />
                          <span className="text-sm font-medium">{post.shares_count}</span>
                        </motion.button>
                      </div>
                    </div>

                    {/* Seção de Comentários */}
                    <AnimatePresence>
                      {showComments === post.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t border-line/20"
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

      {/* CTA para usuários não logados */}
      {!user && (
        <Card className="liquid-glass p-8 text-center border-accent/30">
          <Crown className="w-16 h-16 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-bold text-txt mb-2">
            Junte-se à Comunidade VOLT
          </h3>
          <p className="text-txt-2 mb-6 max-w-md mx-auto">
            Faça login para postar, curtir, comentar e se conectar com outros atletas da comunidade.
          </p>
          <Button className="btn-premium">
            <User className="w-4 h-4 mr-2" />
            Entrar para Participar
          </Button>
        </Card>
      )}
    </div>
  );
}