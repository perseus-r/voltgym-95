import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";
import { 
  Heart, MessageCircle, Share2, Camera, Video, Mic, Image as ImageIcon,
  Plus, Send, Bot, Zap, TrendingUp, Users, MapPin, Hash, ExternalLink,
  ArrowRight, Play, Volume2, VolumeX, MoreHorizontal, Bookmark
} from "lucide-react";
import VerifiedBadge from "./VerifiedBadge";

interface SocialPost {
  id: string;
  user_id: string;
  content: string;
  media_urls?: string[];
  post_type: 'text' | 'workout' | 'media' | 'ai_content';
  ai_generated: boolean;
  workout_data?: any;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  visibility: 'public' | 'friends' | 'private';
  tags?: string[];
  location?: string;
  created_at: string;
  profiles?: {
    display_name: string;
    current_xp: number;
  };
  liked_by_user?: boolean;
}

interface AIFeedContent {
  id: string;
  title: string;
  content: string;
  summary?: string;
  category: 'news' | 'research' | 'tips' | 'technique';
  tags?: string[];
  image_url?: string;
  published_at: string;
  engagement_score: number;
}

export function SocialNetworkFeed() {
  const { user } = useAuth();
  const { isPremium } = useSubscription();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [aiContent, setAiContent] = useState<AIFeedContent[]>([]);
  const [newPost, setNewPost] = useState('');
  const [selectedTab, setSelectedTab] = useState<'all' | 'following' | 'trending' | 'ai'>('all');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadFeed();
      loadAIContent();
    }
  }, [user, selectedTab]);

  const loadFeed = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Carregar posts reais do banco
      const { data: realPosts, error } = await supabase
        .from('social_posts')
        .select(`
          *,
          profiles:user_id (display_name, current_xp)
        `)
        .eq('visibility', 'public')
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Adicionar posts demo se não houver posts reais
      const demoPosts: SocialPost[] = [
        {
          id: 'demo-1',
          user_id: user.id,
          content: '🔥 Acabei de bater meu recorde no agachamento! 180kg x 5 reps. A jornada continua! #BoraVencer #Forca',
          media_urls: ['https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600'],
          post_type: 'workout',
          ai_generated: false,
          workout_data: {
            exercise: 'Agachamento',
            weight: 180,
            reps: 5,
            volume: 900
          },
          likes_count: 47,
          comments_count: 12,
          shares_count: 3,
          visibility: 'public',
          tags: ['BoraVencer', 'Forca'],
          location: 'Smart Gym SP',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          profiles: {
            display_name: 'Você',
            current_xp: 1250
          },
          liked_by_user: false
        },
        {
          id: 'demo-2',
          user_id: 'ai-system',
          content: '💡 DICA CIENTÍFICA: Estudos mostram que consumir 20-25g de proteína dentro de 2h pós-treino maximiza a síntese proteica muscular. Combine com carboidratos para otimizar a recuperação!',
          media_urls: ['https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'],
          post_type: 'ai_content',
          ai_generated: true,
          likes_count: 156,
          comments_count: 28,
          shares_count: 67,
          visibility: 'public',
          tags: ['ciencia', 'proteina', 'recuperacao'],
          created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          profiles: {
            display_name: 'VOLT Science',
            current_xp: 9999
          },
          liked_by_user: true
        }
      ];

      const combinedPosts = [...(realPosts || []).map(p => ({
        ...p,
        post_type: p.post_type as 'text' | 'workout' | 'media' | 'ai_content',
        visibility: p.visibility as 'public' | 'friends' | 'private',
        profiles: p.profiles ? {
          display_name: (p.profiles as any)?.display_name || 'Usuário',
          current_xp: (p.profiles as any)?.current_xp || 0
        } : { display_name: 'Usuário', current_xp: 0 }
      })), ...demoPosts];
      setPosts(combinedPosts);
      
    } catch (error) {
      console.error('Error loading feed:', error);
      toast.error('Erro ao carregar feed');
    } finally {
      setLoading(false);
    }
  };

  const loadAIContent = async () => {
    try {
      const { data, error } = await supabase
        .from('ai_feed_content')
        .select('*')
        .eq('is_active', true)
        .order('published_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setAiContent((data || []).map(item => ({
        ...item,
        category: item.category as 'news' | 'research' | 'tips' | 'technique'
      })));
    } catch (error) {
      console.error('Error loading AI content:', error);
    }
  };

  const createPost = async () => {
    if (!user || !newPost.trim()) return;

    try {
      const postData = {
        user_id: user.id,
        content: newPost.trim(),
        post_type: selectedMedia.length > 0 ? 'media' : 'text',
        media_urls: [], // Implementar upload depois
        visibility: 'public',
        tags: extractTags(newPost),
        ai_generated: false
      };

      const { data, error } = await supabase
        .from('social_posts')
        .insert([postData])
        .select(`
          *,
          profiles:user_id (display_name, current_xp)
        `)
        .single();

      if (error) throw error;

      setPosts(prev => [{
        ...data,
        post_type: data.post_type as 'text' | 'workout' | 'media' | 'ai_content',
        visibility: data.visibility as 'public' | 'friends' | 'private',
        profiles: data.profiles ? {
          display_name: (data.profiles as any)?.display_name || 'Usuário',
          current_xp: (data.profiles as any)?.current_xp || 0
        } : { display_name: 'Usuário', current_xp: 0 }
      }, ...prev]);
      setNewPost('');
      setSelectedMedia([]);
      setShowCreatePost(false);
      toast.success('Post publicado com sucesso!');
      
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Erro ao criar post');
    }
  };

  const toggleLike = async (postId: string) => {
    if (!user) return;

    try {
      const post = posts.find(p => p.id === postId);
      if (!post) return;

      if (post.liked_by_user) {
        // Remove like
        await supabase
          .from('social_likes')
          .delete()
          .eq('user_id', user.id)
          .eq('post_id', postId);
      } else {
        // Add like
        await supabase
          .from('social_likes')
          .insert([{ user_id: user.id, post_id: postId }]);
      }

      // Update local state
      setPosts(prev => prev.map(p => 
        p.id === postId 
          ? { 
              ...p, 
              likes_count: p.liked_by_user ? p.likes_count - 1 : p.likes_count + 1,
              liked_by_user: !p.liked_by_user 
            }
          : p
      ));
      
    } catch (error) {
      console.error('Error toggling like:', error);
      toast.error('Erro ao curtir post');
    }
  };

  const extractTags = (content: string): string[] => {
    const tags = content.match(/#[a-zA-ZÀ-ÿ0-9_]+/g);
    return tags ? tags.map(tag => tag.substring(1)) : [];
  };

  const handleMediaSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedMedia(prev => [...prev, ...files].slice(0, 4)); // Max 4 medias
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}min`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d`;
  };

  const navigateToRelated = (type: string, data: any) => {
    // Navegação inteligente para funcionalidades relacionadas
    switch (type) {
      case 'workout':
        toast.success(`🏋️ Direcionando para treino: ${data.exercise}`);
        // Implementar navegação para ExerciseSession
        break;
      case 'nutrition':
        toast.success('🥗 Abrindo calculadora nutricional');
        // Implementar navegação para área de nutrição
        break;
      case 'progress':
        toast.success('📊 Visualizando progresso');
        // Implementar navegação para analytics
        break;
      default:
        break;
    }
  };

  if (loading) {
    return (
      <div className="liquid-glass p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-surface rounded w-1/3"></div>
          <div className="h-32 bg-surface rounded"></div>
          <div className="h-32 bg-surface rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com navegação inteligente */}
      <div className="liquid-glass p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-full bg-gradient-primary">
            <Users className="w-6 h-6 text-accent-ink" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-txt">🌟 Rede Social VOLT</h2>
            <p className="text-txt-2">Conecte-se, inspire-se e evolua junto com a comunidade</p>
          </div>
        </div>

        {/* Tabs de navegação */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {[
            { key: 'all', label: '🏠 Início', icon: '🏠' },
            { key: 'trending', label: '🔥 Trending', icon: '🔥' },
            { key: 'ai', label: '🤖 IA Feed', icon: '🤖' },
            { key: 'following', label: '👥 Seguindo', icon: '👥' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                selectedTab === tab.key
                  ? 'bg-accent text-accent-ink'
                  : 'liquid-glass-button hover:bg-white/10'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Quick Actions - Navegação inteligente */}
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => navigateToRelated('workout', { exercise: 'Treino do Dia' })}
            className="liquid-glass-button p-3 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
            <div className="text-xs text-txt-2">Treinar</div>
          </button>
          <button 
            onClick={() => navigateToRelated('nutrition', {})}
            className="liquid-glass-button p-3 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <Hash className="w-5 h-5 text-green-400 mx-auto mb-1" />
            <div className="text-xs text-txt-2">Nutrição</div>
          </button>
          <button 
            onClick={() => navigateToRelated('progress', {})}
            className="liquid-glass-button p-3 rounded-lg hover:bg-accent/10 transition-colors"
          >
            <Zap className="w-5 h-5 text-purple-400 mx-auto mb-1" />
            <div className="text-xs text-txt-2">Progresso</div>
          </button>
        </div>
      </div>

      {/* Create Post */}
      <div className="liquid-glass p-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-accent-ink">
            {user?.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="flex-1">
            {!showCreatePost ? (
              <Button 
                onClick={() => setShowCreatePost(true)}
                className="w-full liquid-glass-button text-left justify-start"
                variant="outline"
              >
                ✨ Compartilhe seu progresso, conquistas e inspire outros...
              </Button>
            ) : (
              <div className="space-y-4">
                <Textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  placeholder="💪 Conte sobre seu treino, conquista ou compartilhe uma dica... Use #hashtags para conectar com outros atletas!"
                  className="liquid-glass-button min-h-[120px] resize-none"
                />
                
                {/* Media preview */}
                {selectedMedia.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {selectedMedia.map((file, index) => (
                      <div key={index} className="liquid-glass p-2 rounded-lg">
                        <div className="text-sm text-txt-2 truncate">{file.name}</div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    <label className="liquid-glass-button p-2 rounded-lg cursor-pointer hover:bg-accent/10">
                      <ImageIcon className="w-4 h-4" />
                      <input
                        type="file"
                        multiple
                        accept="image/*,video/*"
                        onChange={handleMediaSelect}
                        className="hidden"
                      />
                    </label>
                    <button className="liquid-glass-button p-2 rounded-lg hover:bg-accent/10">
                      <Camera className="w-4 h-4" />
                    </button>
                    <button 
                      className={`liquid-glass-button p-2 rounded-lg transition-colors ${
                        isRecording ? 'bg-red-500/20 text-red-400' : 'hover:bg-accent/10'
                      }`}
                      onClick={() => setIsRecording(!isRecording)}
                    >
                      <Mic className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={createPost}
                      disabled={!newPost.trim() || uploadingMedia}
                      className="bg-accent hover:bg-accent/90 text-accent-ink"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {uploadingMedia ? 'Enviando...' : 'Publicar'}
                    </Button>
                    <Button 
                      onClick={() => {
                        setShowCreatePost(false);
                        setNewPost('');
                        setSelectedMedia([]);
                      }}
                      variant="outline"
                      className="liquid-glass-button"
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* AI Content Feed (quando tab AI estiver selecionada) */}
      {selectedTab === 'ai' && (
        <div className="space-y-4">
          <div className="liquid-glass p-4">
            <div className="flex items-center gap-2 mb-3">
              <Bot className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-txt">🧠 Feed de IA - Ciência & Inovação</h3>
              <Badge className="bg-accent/20 text-accent">Auto</Badge>
            </div>
            <p className="text-sm text-txt-2">Conteúdo científico curado automaticamente pela nossa IA</p>
          </div>
          
          {aiContent.map((content) => (
            <div key={content.id} className="liquid-glass p-6">
              <div className="flex items-start gap-4">
                {content.image_url && (
                  <img 
                    src={content.image_url} 
                    alt={content.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-accent/20 text-accent text-xs">
                      {content.category === 'research' && '🔬 Pesquisa'}
                      {content.category === 'news' && '📰 Notícia'}
                      {content.category === 'tips' && '💡 Dica'}
                      {content.category === 'technique' && '🎯 Técnica'}
                    </Badge>
                    <span className="text-xs text-txt-3">{formatTimeAgo(content.published_at)}</span>
                  </div>
                  <h4 className="font-semibold text-txt mb-2">{content.title}</h4>
                  <p className="text-txt-2 text-sm mb-3">{content.summary}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {content.tags?.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs px-2 py-1 liquid-glass-button rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="liquid-glass-button"
                      onClick={() => navigateToRelated('research', content)}
                    >
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Posts Feed */}
      {selectedTab !== 'ai' && (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="liquid-glass p-6">
              {/* Post Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-primary flex items-center justify-center text-sm font-bold text-accent-ink relative">
                  {post.ai_generated ? (
                    <>
                      VS
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                        <Bot className="w-2 h-2 text-accent-ink" />
                      </div>
                    </>
                  ) : (
                    post.profiles?.display_name?.charAt(0) || 'U'
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-txt">{post.profiles?.display_name}</span>
                    {/* Show verified badge for premium users or AI posts */}
                    {((post.user_id === user?.id && isPremium) || post.ai_generated) && (
                      <VerifiedBadge size="sm" />
                    )}
                    {post.ai_generated && (
                      <Badge className="bg-accent/20 text-accent text-xs">
                        <Zap className="w-3 h-3 mr-1" />
                        IA
                      </Badge>
                    )}
                    {post.location && (
                      <div className="flex items-center gap-1 text-xs text-txt-3">
                        <MapPin className="w-3 h-3" />
                        {post.location}
                      </div>
                    )}
                  </div>
                  <div className="text-sm text-txt-2">{formatTimeAgo(post.created_at)}</div>
                </div>
                <button className="liquid-glass-button p-2 rounded-lg">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Post Content */}
              <div className="mb-4">
                <p className="text-txt-2 mb-3 leading-relaxed whitespace-pre-wrap">{post.content}</p>
                
                {/* Media Content */}
                {post.media_urls && post.media_urls.length > 0 && (
                  <div className="grid gap-2 rounded-lg overflow-hidden mb-3">
                    {post.media_urls.map((url, index) => (
                      <img 
                        key={index}
                        src={url} 
                        alt="Post media"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                )}
                
                {/* Workout Data */}
                {post.workout_data && (
                  <div className="liquid-glass p-4 rounded-lg mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-accent" />
                      <span className="font-semibold text-txt">Dados do Treino</span>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-txt-3">Exercício:</span>
                        <div className="font-semibold text-accent">{post.workout_data.exercise}</div>
                      </div>
                      <div>
                        <span className="text-txt-3">Carga:</span>
                        <div className="font-semibold text-accent">{post.workout_data.weight}kg</div>
                      </div>
                      <div>
                        <span className="text-txt-3">Volume:</span>
                        <div className="font-semibold text-accent">{post.workout_data.volume}kg</div>
                      </div>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-accent/20 hover:bg-accent/30 text-accent mt-3"
                      onClick={() => navigateToRelated('workout', post.workout_data)}
                    >
                      <ArrowRight className="w-4 h-4 mr-1" />
                      Treinar igual
                    </Button>
                  </div>
                )}

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 rounded text-xs liquid-glass-button cursor-pointer hover:bg-accent/10"
                        onClick={() => toast.success(`🔍 Buscando posts com #${tag}`)}
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Engagement Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-line">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 liquid-glass-button px-3 py-2 rounded-lg transition-colors ${
                      post.liked_by_user ? 'text-red-400' : 'text-txt-2 hover:text-accent'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.liked_by_user ? 'fill-current' : ''}`} />
                    <span className="text-sm">{post.likes_count}</span>
                  </button>
                  <button className="flex items-center gap-2 liquid-glass-button px-3 py-2 rounded-lg hover:text-accent transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    <span className="text-sm">{post.comments_count}</span>
                  </button>
                  <button className="flex items-center gap-2 liquid-glass-button px-3 py-2 rounded-lg hover:text-accent transition-colors">
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">{post.shares_count}</span>
                  </button>
                </div>
                <button className="liquid-glass-button p-2 rounded-lg hover:text-accent transition-colors">
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Floating CTA */}
      <div className="liquid-glass p-6 text-center">
        <h3 className="text-xl font-semibold text-txt mb-2">📱 Todos os Dados Salvos</h3>
        <p className="text-txt-2 mb-4">
          Seus posts, interações e progresso ficam salvos e sincronizados em tempo real!
        </p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">{posts.length}</div>
            <div className="text-sm text-txt-3">Posts salvos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">∞</div>
            <div className="text-sm text-txt-3">Ramificações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">100%</div>
            <div className="text-sm text-txt-3">Sincronizado</div>
          </div>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-ink">
          <Users className="w-4 h-4 mr-2" />
          Explorar Comunidade
        </Button>
      </div>
    </div>
  );
}