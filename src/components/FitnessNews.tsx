import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, TrendingUp, Clock, Brain, Zap } from "lucide-react";

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

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'Novo estudo revela intervalo ideal entre séries para hipertrofia',
    summary: 'Pesquisadores descobriram que intervalos de 2-3 minutos maximizam o crescimento muscular em exercícios compostos, enquanto 90 segundos são suficientes para exercícios isolados.',
    category: 'research',
    source: 'Journal of Strength Research',
    publishedAt: '2h',
    readTime: 3,
    tags: ['hipertrofia', 'descanso', 'ciência'],
    aiGenerated: true
  },
  {
    id: '2',
    title: 'Técnica de respiração que aumenta performance em 15%',
    summary: 'O método "Box Breathing" aplicado antes dos exercícios pesados mostrou melhora significativa na ativação do core e estabilidade durante levantamentos.',
    category: 'technique',
    source: 'Strength & Conditioning Quarterly',
    publishedAt: '4h',
    readTime: 2,
    tags: ['respiração', 'performance', 'core'],
    aiGenerated: true
  },
  {
    id: '3',
    title: 'Proteína vegetal vs animal: novo comparativo surpreende',
    summary: 'Estudo de 12 semanas mostra que proteínas vegetais bem combinadas resultam em ganhos similares às proteínas animais quando a leucina é otimizada.',
    category: 'nutrition',
    source: 'International Nutrition Review',
    publishedAt: '6h',
    readTime: 4,
    tags: ['proteína', 'vegetariano', 'leucina'],
    aiGenerated: true
  },
  {
    id: '4',
    title: 'Levantamento terra: variação que reduz lesões em 40%',
    summary: 'A técnica "Romanian Deadlift com pausa" mostrou menor stress na coluna lombar mantendo ativação muscular máxima, segundo biomecânicos da Stanford.',
    category: 'technique',
    source: 'Biomechanics Today',
    publishedAt: '8h',
    readTime: 3,
    tags: ['terra', 'lesões', 'biomecânica'],
    aiGenerated: true
  },
  {
    id: '5',
    title: 'IA prevê platô muscular com 87% de precisão',
    summary: 'Algoritmo analisa volume, intensidade e RPE para prever quando o atleta entrará em platô, permitindo ajustes preventivos no treino.',
    category: 'trends',
    source: 'AI Fitness Lab',
    publishedAt: '12h',
    readTime: 2,
    tags: ['IA', 'platô', 'predição'],
    aiGenerated: true
  }
];

export function FitnessNews() {
  const [news] = useState<NewsItem[]>(mockNews);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = {
    all: { name: 'Todas', icon: '📰', color: '#7bdcff' },
    research: { name: 'Pesquisas', icon: '🔬', color: '#2ECC71' },
    technique: { name: 'Técnicas', icon: '💪', color: '#3498DB' },
    nutrition: { name: 'Nutrição', icon: '🥗', color: '#E74C3C' },
    equipment: { name: 'Equipamentos', icon: '🏋️', color: '#9B59B6' },
    trends: { name: 'Tendências', icon: '📈', color: '#F39C12' }
  };

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    return categories[category as keyof typeof categories]?.color || '#7bdcff';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-accent/20">
            <Brain className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-txt">🧠 Fitness News IA</h2>
            <p className="text-txt-2">Últimas descobertas científicas e tendências</p>
          </div>
        </div>

        {/* AI Badge */}
        <div className="flex items-center gap-2 mb-4">
          <Badge className="bg-accent/20 text-accent flex items-center gap-1">
            <Zap className="w-3 h-3" />
            Curadoria por IA
          </Badge>
          <span className="text-xs text-txt-3">Atualizado em tempo real</span>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {Object.entries(categories).map(([key, category]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                selectedCategory === key
                  ? 'text-white'
                  : 'glass-button'
              }`}
              style={{
                backgroundColor: selectedCategory === key ? category.color : undefined
              }}
            >
              {category.icon} {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-4">
        {filteredNews.map((item) => (
          <div key={item.id} className="glass-card p-6 hover:bg-white/5 transition-all">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Badge 
                  className="text-white text-xs"
                  style={{ backgroundColor: getCategoryColor(item.category) }}
                >
                  {categories[item.category as keyof typeof categories]?.icon} {categories[item.category as keyof typeof categories]?.name}
                </Badge>
                {item.aiGenerated && (
                  <Badge variant="outline" className="text-xs bg-accent/10 text-accent border-accent/20">
                    <Zap className="w-3 h-3 mr-1" />
                    IA
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs text-txt-3">
                <Clock className="w-3 h-3" />
                {item.readTime}min
              </div>
            </div>

            {/* Content */}
            <h3 className="text-lg font-semibold text-txt mb-2">{item.title}</h3>
            <p className="text-txt-2 mb-4 leading-relaxed">{item.summary}</p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              {item.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 rounded text-xs glass-button"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-line">
              <div className="flex items-center gap-2 text-sm text-txt-3">
                <span>{item.source}</span>
                <span>•</span>
                <span>{item.publishedAt} atrás</span>
              </div>
              
              {item.link && (
                <Button 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ExternalLink className="w-3 h-3" />
                  Ler mais
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Info */}
      <div className="glass-card p-6 text-center">
        <Brain className="w-12 h-12 text-accent mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-txt mb-2">🤖 Curadoria Inteligente</h3>
        <p className="text-txt-2 mb-4">
          Nossa IA analisa milhares de estudos, artigos e vídeos para trazer apenas o que realmente importa para sua evolução.
        </p>
        <div className="flex gap-2 justify-center text-sm text-txt-3">
          <span>• Fontes verificadas</span>
          <span>• Resumos precisos</span>
          <span>• Aplicação prática</span>
        </div>
      </div>
    </div>
  );
}