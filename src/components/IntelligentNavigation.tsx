import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { 
  ArrowRight, Target, TrendingUp, Brain, Zap, Users, ShoppingBag,
  Calendar, BarChart3, Camera, Mic, Video, MapPin, Hash, Star,
  PlayCircle, BookOpen, Award, Compass, Lightbulb, Rocket
} from "lucide-react";

interface NavigationSuggestion {
  id: string;
  title: string;
  description: string;
  category: 'workout' | 'nutrition' | 'progress' | 'social' | 'shop' | 'ai';
  icon: any;
  action: string;
  relevance: number;
  context?: any;
}

interface IntelligentNavigationProps {
  currentContext?: {
    page: string;
    data?: any;
    userActivity?: string[];
  };
  onNavigate: (destination: string, context?: any) => void;
}

export function IntelligentNavigation({ currentContext, onNavigate }: IntelligentNavigationProps) {
  const { user } = useAuth();
  const [suggestions, setSuggestions] = useState<NavigationSuggestion[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    generateSuggestions();
  }, [currentContext, user]);

  const generateSuggestions = () => {
    if (!user) return;

    const baseSuggestions: NavigationSuggestion[] = [
      // Workout suggestions
      {
        id: 'start-workout',
        title: '🏋️ Iniciar Treino do Dia',
        description: 'Seu treino personalizado está pronto. Vamos começar!',
        category: 'workout',
        icon: PlayCircle,
        action: 'dashboard',
        relevance: 95
      },
      {
        id: 'custom-workout',
        title: '⚡ Criar Treino Personalizado',
        description: 'Monte seu próprio treino com nossa IA',
        category: 'workout',
        icon: Target,
        action: 'custom-workout',
        relevance: 80
      },
      {
        id: 'exercise-library',
        title: '📚 Biblioteca de Exercícios',
        description: 'Explore mais de 500 exercícios com vídeos 3D',
        category: 'workout',
        icon: BookOpen,
        action: 'exercises',
        relevance: 70
      },

      // Social suggestions
      {
        id: 'share-progress',
        title: '📸 Compartilhar Progresso',
        description: 'Inspire outros atletas com suas conquistas',
        category: 'social',
        icon: Camera,
        action: 'community',
        relevance: 85
      },
      {
        id: 'upload-media',
        title: '🎥 Upload de Mídia Inteligente',
        description: 'IA analisa suas fotos e vídeos automaticamente',
        category: 'social',
        icon: Video,
        action: 'media-upload',
        relevance: 75
      },
      {
        id: 'voice-diary',
        title: '🎙️ Diário de Voz',
        description: 'Grave suas reflexões pós-treino',
        category: 'social',
        icon: Mic,
        action: 'voice-diary',
        relevance: 60
      },

      // Progress suggestions  
      {
        id: 'weekly-report',
        title: '📊 Relatório Semanal',
        description: 'Veja seu progresso detalhado da semana',
        category: 'progress',
        icon: BarChart3,
        action: 'analytics',
        relevance: 70
      },
      {
        id: 'strength-analysis',
        title: '💪 Análise de Força',
        description: 'Compare sua evolução nos principais exercícios',
        category: 'progress',
        icon: TrendingUp,
        action: 'strength-analysis',
        relevance: 65
      },

      // AI suggestions
      {
        id: 'ai-coach',
        title: '🤖 Conversar com IA Coach',
        description: 'Tire dúvidas e receba dicas personalizadas',
        category: 'ai',
        icon: Brain,
        action: 'ia-coach',
        relevance: 90
      },
      {
        id: 'ai-nutrition',
        title: '🥗 Plano Nutricional IA',
        description: 'Nutrição personalizada baseada nos seus objetivos',
        category: 'nutrition',
        icon: Lightbulb,
        action: 'ai-nutrition',
        relevance: 80
      },

      // Shop suggestions
      {
        id: 'supplements',
        title: '💊 Suplementos Recomendados',
        description: 'Produtos selecionados para seu perfil',
        category: 'shop',
        icon: ShoppingBag,
        action: 'shop',
        relevance: 55
      }
    ];

    // Ajustar relevância baseado no contexto
    const contextualSuggestions = baseSuggestions.map(suggestion => {
      let adjustedRelevance = suggestion.relevance;

      // Boost baseado na página atual
      if (currentContext?.page === 'dashboard' && suggestion.category === 'workout') {
        adjustedRelevance += 10;
      }
      if (currentContext?.page === 'community' && suggestion.category === 'social') {
        adjustedRelevance += 15;
      }
      if (currentContext?.page === 'analytics' && suggestion.category === 'progress') {
        adjustedRelevance += 12;
      }

      // Boost baseado na atividade do usuário
      if (currentContext?.userActivity?.includes('completed-workout')) {
        if (suggestion.id === 'share-progress') adjustedRelevance += 20;
        if (suggestion.id === 'weekly-report') adjustedRelevance += 15;
      }

      return {
        ...suggestion,
        relevance: Math.min(100, adjustedRelevance)
      };
    });

    // Ordenar por relevância e pegar top suggestions
    const sortedSuggestions = contextualSuggestions
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, 8);

    setSuggestions(sortedSuggestions);
  };

  const handleSuggestionClick = (suggestion: NavigationSuggestion) => {
    toast.success(`🚀 Navegando para: ${suggestion.title}`);
    onNavigate(suggestion.action, suggestion.context);
    
    // Log da navegação inteligente
    console.log('Smart Navigation:', {
      from: currentContext?.page,
      to: suggestion.action,
      relevance: suggestion.relevance,
      category: suggestion.category
    });
  };

  const categories = [
    { key: 'all', label: '🌟 Todos', color: 'accent' },
    { key: 'workout', label: '💪 Treino', color: 'blue-500' },
    { key: 'social', label: '👥 Social', color: 'purple-500' },
    { key: 'progress', label: '📈 Progresso', color: 'green-500' },
    { key: 'ai', label: '🤖 IA', color: 'yellow-500' },
    { key: 'nutrition', label: '🥗 Nutrição', color: 'orange-500' },
    { key: 'shop', label: '🛒 Loja', color: 'pink-500' }
  ];

  const filteredSuggestions = activeCategory === 'all' 
    ? suggestions 
    : suggestions.filter(s => s.category === activeCategory);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="liquid-glass p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 rounded-full bg-gradient-primary">
            <Compass className="w-6 h-6 text-accent-ink" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-txt">🧭 Navegação Inteligente</h2>
            <p className="text-txt-2">Sugestões personalizadas baseadas no seu contexto</p>
          </div>
        </div>

        {/* Context Info */}
        {currentContext && (
          <div className="liquid-glass p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-txt">Contexto Atual</span>
            </div>
            <div className="text-sm text-txt-2">
              📍 Página: <span className="text-accent font-medium">{currentContext.page}</span>
              {currentContext.userActivity && (
                <div className="mt-1">
                  🔥 Atividade: {currentContext.userActivity.join(', ')}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.key}
              onClick={() => setActiveCategory(category.key)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm font-medium transition-all ${
                activeCategory === category.key
                  ? 'bg-accent text-accent-ink'
                  : 'liquid-glass-button hover:bg-white/10'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSuggestions.map((suggestion) => (
          <Card 
            key={suggestion.id} 
            className="liquid-glass p-6 hover:bg-white/5 transition-all cursor-pointer group"
            onClick={() => handleSuggestionClick(suggestion)}
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-full bg-accent/20 group-hover:bg-accent/30 transition-colors">
                <suggestion.icon className="w-6 h-6 text-accent" />
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-txt group-hover:text-accent transition-colors">
                    {suggestion.title}
                  </h3>
                  <Badge 
                    className="text-xs"
                    style={{ 
                      backgroundColor: `hsl(${suggestion.relevance}, 70%, 50%, 0.2)`,
                      color: `hsl(${suggestion.relevance}, 70%, 50%)`
                    }}
                  >
                    {suggestion.relevance}% relevante
                  </Badge>
                </div>
                
                <p className="text-txt-2 text-sm mb-3">{suggestion.description}</p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3 text-txt-3" />
                    <span className="text-xs text-txt-3 capitalize">{suggestion.category}</span>
                  </div>
                  
                  <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Smart Suggestions Info */}
      <div className="liquid-glass p-6">
        <div className="flex items-center gap-3 mb-4">
          <Brain className="w-8 h-8 text-accent" />
          <div>
            <h3 className="font-semibold text-txt">🧠 Como funciona?</h3>
            <p className="text-sm text-txt-2">IA analisa seu contexto e sugere próximos passos</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="liquid-glass p-3 rounded-lg">
            <MapPin className="w-5 h-5 text-accent mx-auto mb-2" />
            <div className="text-xs text-txt-2">Localização</div>
          </div>
          <div className="liquid-glass p-3 rounded-lg">
            <Star className="w-5 h-5 text-yellow-400 mx-auto mb-2" />
            <div className="text-xs text-txt-2">Histórico</div>
          </div>
          <div className="liquid-glass p-3 rounded-lg">
            <Target className="w-5 h-5 text-green-400 mx-auto mb-2" />
            <div className="text-xs text-txt-2">Objetivos</div>
          </div>
          <div className="liquid-glass p-3 rounded-lg">
            <Rocket className="w-5 h-5 text-purple-400 mx-auto mb-2" />
            <div className="text-xs text-txt-2">Próximos Passos</div>
          </div>
        </div>
      </div>
    </div>
  );
}