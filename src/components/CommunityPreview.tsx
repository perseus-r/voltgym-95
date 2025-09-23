import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Share2, Trophy, Flame, Users, TrendingUp, Bot, ThumbsUp, Plus, Search, Filter } from "lucide-react";

interface CommunityPost {
  id: string;
  user: {
    name: string;
    level: string;
    avatar: string;
    isAI?: boolean;
  };
  workout: string;
  description: string;
  stats?: {
    volume: number;
    duration: number;
    exercises: number;
  };
  likes: number;
  comments: number;
  timestamp: string;
  type: 'user' | 'ai' | 'news';
  liked?: boolean;
}

const aiGeneratedPosts = [
  {
    id: 'ai-1',
    user: {
      name: 'BORA Science',
      level: 'IA Coach',
      avatar: 'BS',
      isAI: true
    },
    workout: 'Estudo Científico',
    description: 'Nova pesquisa revela que séries dropset podem aumentar hipertrofia em 23% comparado a séries tradicionais. O mecanismo está relacionado ao maior volume total e stress metabólico.',
    likes: 156,
    comments: 34,
    timestamp: '30min',
    type: 'ai' as const
  },
  {
    id: 'ai-2',
    user: {
      name: 'BORA Science',
      level: 'IA Coach',
      avatar: 'BS',
      isAI: true
    },
    workout: 'Dica Técnica',
    description: 'Range de movimento completo vs parcial: estudos mostram que amplitude completa gera 40% mais ativação muscular no supino. Priorize sempre a técnica perfeita!',
    likes: 89,
    comments: 12,
    timestamp: '1h',
    type: 'ai' as const
  }
];

const mockPosts: CommunityPost[] = [
  {
    id: '1',
    user: {
      name: 'Carlos Silva',
      level: 'Capitão',
      avatar: 'CS'
    },
    workout: 'Push Day Intenso',
    description: 'Hoje foi dia de peito e tríceps! Consegui aumentar 5kg no supino 💪',
    stats: {
      volume: 2450,
      duration: 75,
      exercises: 6
    },
    likes: 23,
    comments: 8,
    timestamp: '2h',
    type: 'user' as const
  },
  {
    id: '2',
    user: {
      name: 'Ana Costa',
      level: 'Soldado',
      avatar: 'AC'
    },
    workout: 'Legs & Glutes',
    description: 'Primeiro treino de pernas depois da lesão. Voltando aos poucos! 🦵',
    stats: {
      volume: 1850,
      duration: 60,
      exercises: 5
    },
    likes: 15,
    comments: 12,
    timestamp: '4h',
    type: 'user' as const
  }
];

export function CommunityPreview() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPost, setNewPost] = useState('');

  useEffect(() => {
    // Combinar posts reais com posts da IA
    const allPosts = [...aiGeneratedPosts, ...mockPosts].sort((a, b) => {
      const timeA = parseFloat(a.timestamp.replace(/[^0-9.]/g, ''));
      const timeB = parseFloat(b.timestamp.replace(/[^0-9.]/g, ''));
      return timeA - timeB;
    });
    setPosts(allPosts);

    // Auto-gerar posts da IA periodicamente
    const interval = setInterval(() => {
      generateAIPost();
    }, 300000); // A cada 5 minutos

    return () => clearInterval(interval);
  }, []);

  const generateAIPost = () => {
    const aiTopics = [
      'Nova pesquisa sobre periodização para hipertrofia máxima...',
      'Descoberta sobre timing de proteína pós-treino: o que mudou...',
      'Análise biomecânica do agachamento: erros que limitam seus ganhos...',
      'Estudo revela melhor frequência de treino para cada grupo muscular...',
      'Ciência da recuperação: estratégias baseadas em evidências...'
    ];

    const randomTopic = aiTopics[Math.floor(Math.random() * aiTopics.length)];
    
        const newAIPost: CommunityPost = {
          id: `ai-${Date.now()}`,
          user: {
            name: 'BORA Science',
            level: 'IA Coach',
            avatar: 'BS',
            isAI: true
          },
      workout: 'Nova Descoberta',
      description: randomTopic,
      likes: Math.floor(Math.random() * 200),
      comments: Math.floor(Math.random() * 50),
      timestamp: '1min',
      type: 'ai' as const
    };

    setPosts(prev => [newAIPost, ...prev]);
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.liked ? post.likes - 1 : post.likes + 1,
            liked: !post.liked 
          }
        : post
    ));
  };

  const handleShare = (post: CommunityPost) => {
    if (navigator.share) {
      navigator.share({
        title: `${post.workout} - BORA`,
        text: post.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(post.description);
      // Toast notification could be added here
    }
  };

  const handleCreatePost = () => {
    if (newPost.trim()) {
      // Add new post logic here
      setNewPost('');
      setShowCreatePost(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Community Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-accent/20">
            <Users className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-txt">🏆 Comunidade BORA</h2>
            <p className="text-txt-2">Compartilhe e se inspire com outros atletas</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-3 glass-card">
            <TrendingUp className="w-5 h-5 text-accent mx-auto mb-1" />
            <div className="text-lg font-bold text-txt">1.2k</div>
            <div className="text-xs text-txt-2">Posts hoje</div>
          </div>
          <div className="text-center p-3 glass-card">
            <Flame className="w-5 h-5 text-error mx-auto mb-1" />
            <div className="text-lg font-bold text-txt">456</div>
            <div className="text-xs text-txt-2">Streaks ativas</div>
          </div>
          <div className="text-center p-3 glass-card">
            <Trophy className="w-5 h-5 text-warning mx-auto mb-1" />
            <div className="text-lg font-bold text-txt">89</div>
            <div className="text-xs text-txt-2">Recordes hoje</div>
          </div>
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="glass-card p-6">
            {/* Post Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent/30 to-accent/10 border border-accent/20 flex items-center justify-center text-sm font-bold text-txt relative">
                {post.user.isAI ? post.user.avatar : post.user.avatar}
                {post.user.isAI && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center">
                    <Bot className="w-2 h-2 text-accent-ink" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-txt">{post.user.name}</span>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${post.user.isAI ? 'bg-accent/20 text-accent' : 'bg-accent/20 text-accent'}`}
                  >
                    {post.user.level}
                  </Badge>
                  {post.type === 'ai' && (
                    <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                      Auto
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-txt-2">{post.timestamp} atrás</div>
              </div>
            </div>

            {/* Workout Info */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-txt mb-2">{post.workout}</h3>
              <p className="text-txt-2 mb-3">{post.description}</p>
              
              {/* Stats - only for user posts */}
              {post.stats && (
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-1">
                    <span className="text-txt-3">Volume:</span>
                    <span className="font-semibold text-txt">{post.stats.volume}kg</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-txt-3">Tempo:</span>
                    <span className="font-semibold text-txt">{post.stats.duration}min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-txt-3">Exercícios:</span>
                    <span className="font-semibold text-txt">{post.stats.exercises}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Enhanced Engagement */}
            <div className="flex items-center gap-4 pt-4 border-t border-line">
              <button 
                onClick={() => handleLike(post.id)}
                className={`flex items-center gap-2 glass-button px-3 py-2 rounded-lg transition-colors ${
                  post.liked ? 'text-error' : 'text-txt-2 hover:text-accent'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.liked ? 'fill-current' : ''}`} />
                <span className="text-sm">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 glass-button px-3 py-2 rounded-lg hover:text-accent transition-colors">
                <MessageCircle className="w-4 h-4" />
                <span className="text-sm">{post.comments}</span>
              </button>
              <button 
                onClick={() => handleShare(post)}
                className="flex items-center gap-2 glass-button px-3 py-2 rounded-lg hover:text-accent transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-sm">Compartilhar</span>
              </button>
              {post.type === 'user' && (
                <button className="flex items-center gap-2 glass-button px-3 py-2 rounded-lg hover:text-accent transition-colors ml-auto">
                  <ThumbsUp className="w-4 h-4" />
                  <span className="text-sm">Apoiar</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Post Section */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-txt mb-4 flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-accent" />
          Compartilhar Treino
        </h3>
        
        {!showCreatePost ? (
          <Button 
            onClick={() => setShowCreatePost(true)}
            className="w-full btn-premium"
          >
            ✍️ Criar Nova Postagem
          </Button>
        ) : (
          <div className="space-y-4">
            <textarea
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="Compartilhe seu treino de hoje, conquistas ou dicas..."
              className="w-full p-3 rounded-lg bg-surface border border-line text-txt resize-none"
              rows={4}
            />
            <div className="flex gap-2">
              <Button 
                onClick={handleCreatePost}
                disabled={!newPost.trim()}
                className="btn-premium flex-1"
              >
                Publicar
              </Button>
              <Button 
                onClick={() => setShowCreatePost(false)}
                variant="outline"
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Join Community CTA */}
      <div className="glass-card p-6 text-center">
        <h3 className="text-xl font-semibold text-txt mb-2">💪 Comunidade Ativa</h3>
        <p className="text-txt-2 mb-4">
          Compartilhe seus treinos, inspire outros atletas e evolua junto com a comunidade BORA!
        </p>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">2.3k</div>
            <div className="text-sm text-txt-3">Membros ativos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-accent">156</div>
            <div className="text-sm text-txt-3">Posts hoje</div>
          </div>
        </div>
        <Button className="btn-premium">
          Ativar Comunidade Premium
        </Button>
        <p className="text-xs text-txt-3 mt-2">
          Disponível para usuários Soldado+ (XP 101+)
        </p>
      </div>
    </div>
  );
}