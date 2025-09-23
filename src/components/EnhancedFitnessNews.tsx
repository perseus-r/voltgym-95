import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Clock, Brain, Zap, RefreshCw, Bot } from "lucide-react";
import { toast } from "sonner";

interface NewsItem {
  id: string;
  title: string;
  summary: string;
  category: 'research' | 'technique' | 'nutrition' | 'equipment' | 'trends';
  source: string;
  publishedAt: string;
  readTime: number;
  tags: string[];
  aiGenerated: boolean;
  link?: string;
}

// Dados base que serão enriquecidos com IA
const baseTopics = [
  'hipertrofia muscular', 'técnicas de treino', 'nutrição esportiva', 
  'suplementação', 'recuperação muscular', 'periodização', 'biomecânica',
  'treinamento funcional', 'cardio vs musculação', 'lesões prevenção'
];

export function EnhancedFitnessNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    generateAINews();
  }, []);

  const generateAINews = async () => {
    setLoading(true);
    try {
      // Simulação de IA gerando conteúdo baseado em tópicos atuais
      const aiGeneratedNews: NewsItem[] = await Promise.all(
        baseTopics.slice(0, 6).map(async (topic, index) => {
          // Simular delay de IA
          await new Promise(resolve => setTimeout(resolve, 200 * (index + 1)));
          
          return generateNewsFromTopic(topic, index);
        })
      );
      
      setNews(aiGeneratedNews);
      toast.success("Notícias atualizadas pela IA!");
    } catch (error) {
      console.error('Erro ao gerar notícias:', error);
      setNews(getFallbackNews());
      toast.error("Usando notícias em cache");
    } finally {
      setLoading(false);
    }
  };

  const generateNewsFromTopic = (topic: string, index: number): NewsItem => {
    const categories: NewsItem['category'][] = ['research', 'technique', 'nutrition', 'equipment', 'trends'];
    const currentTime = new Date();
    currentTime.setHours(currentTime.getHours() - (index + 1));

    const newsTemplates = {
      hipertrofia: {
        title: 'Novo protocolo de treino aumenta hipertrofia em 23%',
        summary: 'Pesquisadores desenvolveram método que combina drop sets com pausa-descanso, resultando em maior ativação das fibras tipo II.',
        tags: ['hipertrofia', 'drop-sets', 'ciência']
      },
      técnicas: {
        title: 'Técnica "Tempo sob Tensão" revoluciona resultados',
        summary: 'Estudo mostra que controlar a velocidade excêntrica por 3-4 segundos maximiza os ganhos de força e massa muscular.',
        tags: ['técnica', 'tempo', 'excêntrica']
      },
      nutrição: {
        title: 'Janela anabólica: mito ou realidade? Nova descoberta',
        summary: 'Pesquisa de Harvard revela que a "janela" pode durar até 6 horas, mudando como pensamos sobre timing de proteína.',
        tags: ['nutrição', 'proteína', 'anabólica']
      },
      suplementação: {
        title: 'Creatina + Beta-Alanina: combinação potencializa performance',
        summary: 'Protocolo de suplementação cruzada mostra aumento de 18% na performance e 12% na recuperação muscular.',
        tags: ['suplementos', 'creatina', 'beta-alanina']
      },
      recuperação: {
        title: 'Sono e crescimento muscular: conexão é mais forte que imaginado',
        summary: 'Estudo longitudinal comprova que menos de 7h de sono reduz síntese proteica em 40%, mesmo com treino otimizado.',
        tags: ['sono', 'recuperação', 'hormônios']
      }
    };

    const template = Object.values(newsTemplates)[index % Object.values(newsTemplates).length];
    
    return {
      id: `ai-${Date.now()}-${index}`,
      title: template.title,
      summary: template.summary,
      category: categories[index % categories.length],
      source: 'BORA AI Research',
      publishedAt: formatTimeAgo(currentTime),
      readTime: Math.floor(Math.random() * 4) + 2,
      tags: template.tags,
      aiGenerated: true,
      link: `#research-${index}`
    };
  };

  const getFallbackNews = (): NewsItem[] => [
    {
      id: '1',
      title: 'Intervalos de descanso: 2-3min para hipertrofia máxima',
      summary: 'Meta-análise de 23 estudos confirma que intervalos mais longos resultam em maior volume total e crescimento muscular.',
      category: 'research',
      source: 'Journal of Strength Research',
      publishedAt: '2h',
      readTime: 3,
      tags: ['hipertrofia', 'descanso', 'volume'],
      aiGenerated: false
    },
    {
      id: '2',
      title: 'Respiração Box: melhore sua performance em 15%',
      summary: 'Técnica 4-4-4-4 aplicada entre séries mostra aumento significativo na ativação neural e estabilidade do core.',
      category: 'technique',
      source: 'Performance Science Daily',
      publishedAt: '4h',
      readTime: 2,
      tags: ['respiração', 'performance', 'core'],
      aiGenerated: false
    }
  ];

  const formatTimeAgo = (date: Date): string => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Agora';
    if (diffInHours === 1) return '1h';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const getCategoryIcon = (category: NewsItem['category']) => {
    const icons = {
      research: Brain,
      technique: Zap,
      nutrition: TrendingUp,
      equipment: ExternalLink,
      trends: Clock
    };
    return icons[category] || Brain;
  };

  const getCategoryColor = (category: NewsItem['category']) => {
    const colors = {
      research: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      technique: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      nutrition: 'bg-green-500/20 text-green-400 border-green-500/30',
      equipment: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      trends: 'bg-pink-500/20 text-pink-400 border-pink-500/30'
    };
    return colors[category] || colors.research;
  };

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  return (
    <Card className="p-6 bg-surface border-line">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Bot className="h-6 w-6 text-accent" />
          <div>
            <h3 className="text-lg font-semibold text-txt-1">Notícias Fitness IA</h3>
            <p className="text-sm text-txt-3">Conteúdo atualizado por inteligência artificial</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-input-bg border border-input-border rounded-lg px-3 py-2 text-sm text-txt-2"
          >
            <option value="all">Todas</option>
            <option value="research">Pesquisa</option>
            <option value="technique">Técnica</option>
            <option value="nutrition">Nutrição</option>
            <option value="equipment">Equipamentos</option>
            <option value="trends">Tendências</option>
          </select>
          
          <Button
            onClick={generateAINews}
            disabled={loading}
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="flex items-center gap-2 text-txt-3">
              <Bot className="h-5 w-5 animate-bounce" />
              <span>IA gerando notícias personalizadas...</span>
            </div>
          </div>
        ) : (
          filteredNews.map((item) => {
            const CategoryIcon = getCategoryIcon(item.category);
            
            return (
              <Card key={item.id} className="p-4 bg-card border-line hover:bg-card/80 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getCategoryColor(item.category)}`}>
                    <CategoryIcon className="h-4 w-4" />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-txt-3">
                      <span>{item.source}</span>
                      <span>•</span>
                      <span>{item.publishedAt}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{item.readTime} min</span>
                      {item.aiGenerated && (
                        <>
                          <span>•</span>
                          <Badge className="bg-accent/20 text-accent border-accent/30 text-xs">
                            IA
                          </Badge>
                        </>
                      )}
                    </div>
                    
                    <h4 className="font-medium text-txt-1 leading-tight">{item.title}</h4>
                    <p className="text-sm text-txt-2 leading-relaxed">{item.summary}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {item.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="outline" 
                            className="text-xs bg-surface/50 border-line/50"
                          >
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      {item.link && (
                        <Button size="sm" variant="ghost" className="text-accent">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </Card>
  );
}

export default EnhancedFitnessNews;