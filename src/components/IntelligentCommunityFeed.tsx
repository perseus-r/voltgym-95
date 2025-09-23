import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";
import { 
  Heart, MessageCircle, Share2, TrendingUp, Users, Bot, 
  Zap, Target, Trophy, Clock, Flame, Star, Award, User
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface CommunityPost {
  id: string;
  author: {
    name: string;
    level: number;
    xp: number;
    avatar: string;
    verified: boolean;
  };
  content: string;
  type: 'achievement' | 'tip' | 'motivation' | 'workout' | 'ai_insight';
  aiGenerated: boolean;
  likes: number;
  comments: number;
  timeAgo: string;
  tags: string[];
  engagement: number;
}

interface AIInsight {
  id: string;
  title: string;
  content: string;
  category: 'technique' | 'nutrition' | 'recovery' | 'motivation';
  confidence: number;
  sources: number;
}

export function IntelligentCommunityFeed() {
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'feed' | 'insights'>('feed');

  useEffect(() => {
    generateIntelligentContent();
  }, []);

  const generateIntelligentContent = async () => {
    setLoading(true);
    
    try {
      // Simular IA gerando conteúdo baseado em padrões da comunidade
      const intelligentPosts = await generateAIPosts();
      const intelligentInsights = await generateAIInsights();
      
      setPosts(intelligentPosts);
      setAiInsights(intelligentInsights);
      
      toast.success("Feed atualizado com IA!");
    } catch (error) {
      console.error('Erro ao gerar conteúdo:', error);
      setPosts(getFallbackPosts());
      setAiInsights(getFallbackInsights());
      toast.error("Usando conteúdo em cache");
    } finally {
      setLoading(false);
    }
  };

  const generateAIPosts = async (): Promise<CommunityPost[]> => {
    // Simular delay de IA processando
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return [
      {
        id: 'ai-1',
        author: {
          name: 'BORA Coach IA',
          level: 99,
          xp: 50000,
          avatar: '🤖',
          verified: true
        },
        content: 'Análise dos seus treinos mostra 23% de melhoria na consistência esta semana! Usuários que mantêm regularidade como a sua têm 3x mais chances de atingir seus objetivos. Continue firme! 💪',
        type: 'ai_insight',
        aiGenerated: true,
        likes: 47,
        comments: 12,
        timeAgo: '5min',
        tags: ['consistência', 'progresso', 'motivação'],
        engagement: 92
      },
      {
        id: 'ai-2',
        author: {
          name: 'Fitness Analytics',
          level: 85,
          xp: 35000,
          avatar: '📊',
          verified: true
        },
        content: 'Padrão identificado: Treinos realizados às 7h da manhã têm 67% mais aderência. Membros matutinos relatam +40% de energia durante o dia. Que tal experimentar?',
        type: 'tip',
        aiGenerated: true,
        likes: 156,
        comments: 34,
        timeAgo: '12min',
        tags: ['horário', 'energia', 'produtividade'],
        engagement: 87
      },
      {
        id: 'community-1',
        author: {
          name: 'Carlos M.',
          level: 12,
          xp: 2400,
          avatar: '💪',
          verified: false
        },
        content: 'Finalmente consegui fazer 3 séries de 10 flexões! Há 2 meses mal conseguia fazer 3 seguidas. O processo funciona mesmo! 🔥',
        type: 'achievement',
        aiGenerated: false,
        likes: 89,
        comments: 15,
        timeAgo: '25min',
        tags: ['flexões', 'progresso', 'persistência'],
        engagement: 78
      },
      {
        id: 'ai-3',
        author: {
          name: 'Nutrição IA',
          level: 77,
          xp: 28000,
          avatar: '🥗',
          verified: true
        },
        content: 'Baseado no seu perfil e objetivos: consumir 1.8g de proteína por kg de peso corporal 30min pós-treino pode acelerar sua recuperação em 25%. Que tal testar?',
        type: 'tip',
        aiGenerated: true,
        likes: 203,
        comments: 45,
        timeAgo: '1h',
        tags: ['proteína', 'recuperação', 'nutrição'],
        engagement: 95
      },
      {
        id: 'community-2',
        author: {
          name: 'Ana P.',
          level: 18,
          xp: 4200,
          avatar: '🏃‍♀️',
          verified: false
        },
        content: 'Dica que mudou meu jogo: focar na respiração durante o exercício. Agora consigo mais 2-3 reps por série! Simples mas funciona.',
        type: 'tip',
        aiGenerated: false,
        likes: 67,
        comments: 8,
        timeAgo: '2h',
        tags: ['respiração', 'técnica', 'performance'],
        engagement: 71
      }
    ];
  };

  const generateAIInsights = async (): Promise<AIInsight[]> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return [
      {
        id: 'insight-1',
        title: 'Otimização de Treino Personalizada',
        content: 'Com base nos seus dados, treinos de 45-55min com foco em exercícios compostos podem aumentar seus resultados em 31%. Considere ajustar a duração.',
        category: 'technique',
        confidence: 87,
        sources: 12
      },
      {
        id: 'insight-2',
        title: 'Janela Nutricional Inteligente',
        content: 'Seu perfil metabólico sugere que carboidratos 1h antes do treino e proteína imediatamente após maximizam performance e recuperação.',
        category: 'nutrition',
        confidence: 94,
        sources: 8
      },
      {
        id: 'insight-3',
        title: 'Padrão de Recuperação Identificado',
        content: 'Análise mostra que você recupera melhor com 48h entre treinos do mesmo grupo muscular. Considere ajustar sua frequência.',
        category: 'recovery',
        confidence: 79,
        sources: 15
      }
    ];
  };

  const getFallbackPosts = (): CommunityPost[] => [
    {
      id: 'fallback-1',
      author: { name: 'Comunidade BORA', level: 50, xp: 15000, avatar: '👥', verified: true },
      content: 'Bem-vindo à nossa comunidade fitness! Compartilhe suas conquistas e inspire outros membros.',
      type: 'motivation',
      aiGenerated: false,
      likes: 0,
      comments: 0,
      timeAgo: 'agora',
      tags: ['boas-vindas'],
      engagement: 0
    }
  ];

  const getFallbackInsights = (): AIInsight[] => [
    {
      id: 'fallback-insight',
      title: 'Sistema de IA em Desenvolvimento',
      content: 'Nossa inteligência artificial está aprendendo sobre você. Continue treinando para receber insights personalizados!',
      category: 'motivation',
      confidence: 100,
      sources: 1
    }
  ];

  const getTypeIcon = (type: CommunityPost['type']) => {
    const icons = {
      achievement: Trophy,
      tip: Zap,
      motivation: Heart,
      workout: Target,
      ai_insight: Bot
    };
    return icons[type] || Heart;
  };

  const getTypeColor = (type: CommunityPost['type']) => {
    const colors = {
      achievement: 'text-yellow-400',
      tip: 'text-blue-400',
      motivation: 'text-red-400',
      workout: 'text-green-400',
      ai_insight: 'text-purple-400'
    };
    return colors[type] || 'text-gray-400';
  };

  const getCategoryIcon = (category: AIInsight['category']) => {
    const icons = {
      technique: Zap,
      nutrition: Target,
      recovery: Clock,
      motivation: Flame
    };
    return icons[category] || Zap;
  };

  return (
    <Card className="p-6 bg-surface border-line">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-accent" />
          <div>
            <h3 className="text-lg font-semibold text-txt-1">Comunidade Inteligente</h3>
            <p className="text-sm text-txt-3">Feed personalizado com IA</p>
          </div>
        </div>
        
        <div className="flex bg-surface border border-line rounded-lg p-1">
          <Button
            size="sm"
            variant={activeTab === 'feed' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('feed')}
            className="text-xs"
          >
            Feed
          </Button>
          <Button
            size="sm"
            variant={activeTab === 'insights' ? 'default' : 'ghost'}
            onClick={() => setActiveTab('insights')}
            className="text-xs"
          >
            Insights IA
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2 text-txt-3">
            <Bot className="h-5 w-5 animate-bounce" />
            <span>IA analisando a comunidade...</span>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {activeTab === 'feed' ? (
            posts.map((post) => {
              const TypeIcon = getTypeIcon(post.type);
              
              return (
                <Card key={post.id} className="p-4 bg-card border-line">
                  <div className="flex items-start gap-3">
                     <div className="flex-shrink-0">
                       <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-lg overflow-hidden">
                         {post.aiGenerated ? (
                           post.author.avatar
                         ) : post.author.avatar && post.author.avatar.startsWith('http') ? (
                           <img 
                             src={post.author.avatar} 
                             alt={post.author.name}
                             className="w-full h-full object-cover"
                           />
                         ) : (
                           <User className="w-5 h-5 text-accent" />
                         )}
                       </div>
                     </div>
                    
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-txt-1">{post.author.name}</span>
                        {post.author.verified && (
                          <Badge className="bg-accent/20 text-accent text-xs">✓</Badge>
                        )}
                        <Badge variant="outline" className="text-xs">Nv.{post.author.level}</Badge>
                        <span className="text-xs text-txt-3">•</span>
                        <span className="text-xs text-txt-3">{post.timeAgo}</span>
                        {post.aiGenerated && (
                          <>
                            <span className="text-xs text-txt-3">•</span>
                            <Badge className="bg-purple-500/20 text-purple-400 text-xs">IA</Badge>
                          </>
                        )}
                      </div>
                      
                      <p className="text-txt-2 leading-relaxed">{post.content}</p>
                      
                        
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1 flex-wrap">
                            {post.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center gap-4 text-txt-3">
                            <button className="flex items-center gap-1 hover:text-red-400 transition-colors">
                              <Heart className="h-4 w-4" />
                              <span className="text-xs">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-blue-400 transition-colors">
                              <MessageCircle className="h-4 w-4" />
                              <span className="text-xs">{post.comments}</span>
                            </button>
                            <button className="flex items-center gap-1 hover:text-green-400 transition-colors">
                              <Share2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Seção de comentários */}
                        <div className="mt-3 pt-3 border-t border-line/50">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                                <User className="w-3 h-3 text-accent" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-medium text-txt">Mariana S.</div>
                                <div className="text-xs text-txt-2">Adorei a dica! Funciona mesmo 🔥</div>
                              </div>
                              <div className="text-xs text-txt-3">2h</div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center overflow-hidden">
                                <User className="w-3 h-3 text-accent" />
                              </div>
                              <div className="flex-1">
                                <div className="text-xs font-medium text-txt">Pedro M.</div>
                                <div className="text-xs text-txt-2">Vou testar no próximo treino!</div>
                              </div>
                              <div className="text-xs text-txt-3">30min</div>
                            </div>
                          </div>
                        </div>
                    </div>
                  </div>
                </Card>
              );
            })
          ) : (
            aiInsights.map((insight) => {
              const CategoryIcon = getCategoryIcon(insight.category);
              
              return (
                <Card key={insight.id} className="p-4 bg-card border-line">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-accent/20 rounded-lg">
                      <CategoryIcon className="h-5 w-5 text-accent" />
                    </div>
                    
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-txt-1">{insight.title}</h4>
                        <Badge className="bg-green-500/20 text-green-400 text-xs">
                          {insight.confidence}% confiança
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-txt-2">{insight.content}</p>
                      
                      <div className="flex items-center gap-2 text-xs text-txt-3">
                        <Star className="h-3 w-3" />
                        <span>Baseado em {insight.sources} fontes</span>
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })
          )}
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-line">
        <Button 
          onClick={generateIntelligentContent}
          disabled={loading}
          className="w-full flex items-center gap-2"
          variant="outline"
        >
          <Bot className="h-4 w-4" />
          Atualizar com IA
        </Button>
      </div>
    </Card>
  );
}

export default IntelligentCommunityFeed;