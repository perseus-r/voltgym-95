import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Play, BookOpen, Target, Zap, Star, Filter, Dumbbell, Users, Heart, Activity, Zap as ZapIcon, Smile } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Exercise3DViewer } from './Exercise3DViewer';

// Utility functions
const getGroupIcon = (categoryId: string) => {
  const iconMap: { [key: string]: any } = {
    'chest': Users,
    'back': Activity,
    'shoulders': Target,
    'arms': ZapIcon,
    'legs': Heart,
    'core': Smile,
    'cardio': Activity
  };
  return iconMap[categoryId] || Dumbbell;
};

const getDifficultyText = (level: number) => {
  const difficultyMap: { [key: number]: string } = {
    1: 'Iniciante',
    2: 'Intermediário', 
    3: 'Avançado',
    4: 'Expert'
  };
  return difficultyMap[level] || 'N/A';
};

const getDifficultyColor = (level: number) => {
  const colorMap: { [key: number]: string } = {
    1: 'bg-green-500/20 text-green-400 border-green-500/30',
    2: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    3: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    4: 'bg-red-500/20 text-red-400 border-red-500/30'
  };
  return colorMap[level] || 'bg-surface border-line/50';
};

export const ExerciseLibrary = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExercises();
    loadCategories();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [searchTerm, selectedMuscle, selectedDifficulty, selectedCategory, difficultyFilter, exercises]);

  const loadExercises = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('exercises')
        .select(`
          *,
          exercise_categories (
            name,
            icon
          )
        `)
        .order('name');

      if (error) throw error;

      setExercises(data || []);
      setFilteredExercises(data || []);
    } catch (error) {
      console.error('Erro ao carregar exercícios:', error);
      toast.error('Erro ao carregar exercícios');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('exercise_categories')
        .select('*')
        .order('name');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Erro ao carregar categorias:', error);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (searchTerm) {
      filtered = filtered.filter(exercise =>
        exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.primary_muscles?.some(m => m.toLowerCase().includes(searchTerm.toLowerCase())) ||
        exercise.secondary_muscles?.some(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedMuscle) {
      filtered = filtered.filter(exercise =>
        exercise.primary_muscles?.includes(selectedMuscle) ||
        exercise.secondary_muscles?.includes(selectedMuscle)
      );
    }

    if (selectedCategory && selectedCategory !== '') {
      filtered = filtered.filter(exercise =>
        exercise.category_id === selectedCategory
      );
    }

    if (selectedDifficulty) {
      filtered = filtered.filter(exercise =>
        exercise.difficulty_level === parseInt(selectedDifficulty)
      );
    }

    if (difficultyFilter && difficultyFilter !== '') {
      filtered = filtered.filter(exercise =>
        exercise.difficulty_level === parseInt(difficultyFilter)
      );
    }

    setFilteredExercises(filtered);
  };

  const muscleGroups = [...new Set(exercises.flatMap(ex => 
    [...(ex.primary_muscles || []), ...(ex.secondary_muscles || [])]
  ))];
  const difficulties = [1, 2, 3, 4, 5]; // 1=Muito Fácil, 5=Muito Difícil

  if (selectedExercise) {
    return <Exercise3DViewer exercise={selectedExercise} onClose={() => setSelectedExercise(null)} />;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="liquid-glass p-8">
          <div className="animate-pulse space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-surface rounded-xl"></div>
              <div className="space-y-2">
                <div className="h-8 bg-surface rounded w-64"></div>
                <div className="h-4 bg-surface rounded w-96"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-64 bg-surface rounded-xl"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="liquid-glass p-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-gradient-to-r from-accent to-accent-2">
              <Dumbbell className="w-8 h-8 text-accent-ink" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-txt mb-2">Biblioteca de Exercícios</h1>
              <p className="text-txt-2 text-lg">Explore nossa coleção completa de exercícios para todos os grupos musculares</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-accent border-accent px-4 py-2 text-lg">
              {filteredExercises.length} exercícios
            </Badge>
          </div>
        </div>

        {/* Enhanced Search and Filters */}
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-txt-3" />
            <Input 
              placeholder="Buscar por exercício ou músculo alvo..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-14 text-lg bg-input-bg border-input-border text-txt rounded-xl"
            />
          </div>

          {/* Category Filter */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-txt flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Grupos Musculares
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                size="lg"
                variant={selectedCategory === '' ? 'default' : 'outline'}
                onClick={() => setSelectedCategory('')}
                className={selectedCategory === '' 
                  ? 'bg-accent text-accent-ink hover:bg-accent/90' 
                  : 'glass-button border-line/50 hover:bg-surface/80'
                }
              >
                <Dumbbell className="w-4 h-4 mr-2" />
                Todos
              </Button>
              {categories.map(category => {
                const IconComponent = getGroupIcon(category.id);
                return (
                  <Button
                    key={category.id}
                    size="lg"
                    variant={selectedCategory === category.id ? 'default' : 'outline'}
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id 
                      ? 'bg-accent text-accent-ink hover:bg-accent/90' 
                      : 'glass-button border-line/50 hover:bg-surface/80'
                    }
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {category.name}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-txt flex items-center gap-2">
              <Target className="w-5 h-5" />
              Nível de Dificuldade
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                size="sm"
                variant={difficultyFilter === '' ? 'default' : 'outline'}
                onClick={() => setDifficultyFilter('')}
                className={difficultyFilter === '' 
                  ? 'bg-accent text-accent-ink' 
                  : 'glass-button'
                }
              >
                Todos
              </Button>
              {[1, 2, 3, 4].map(level => (
                <Button
                  key={level}
                  size="sm"
                  variant={difficultyFilter === level.toString() ? 'default' : 'outline'}
                  onClick={() => setDifficultyFilter(level.toString())}
                  className={difficultyFilter === level.toString() 
                    ? 'bg-accent text-accent-ink' 
                    : 'glass-button'
                  }
                >
                  {getDifficultyText(level)}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Exercise Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredExercises.map(exercise => {
          const IconComponent = getGroupIcon(exercise.category_id);
          return (
            <Card key={exercise.id} className="liquid-glass p-6 group hover:scale-105 transition-all duration-300 border border-line/20 hover:border-accent/30">
              {/* Exercise Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <IconComponent className="w-5 h-5 text-accent" />
                  </div>
                  {exercise.model_3d_url && (
                    <div className="px-2 py-1 rounded-full bg-gradient-to-r from-accent to-accent-2 text-accent-ink text-xs font-bold">
                      3D
                    </div>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => toast.info(`${exercise.name} favoritado!`)}
                >
                  <Star className="w-4 h-4" />
                </Button>
              </div>

              {/* Exercise Title & Category */}
              <div className="mb-4">
                <h3 className="font-bold text-txt text-lg mb-1 line-clamp-2">{exercise.name}</h3>
                <p className="text-txt-2 text-sm">{exercise.exercise_categories?.name || 'Geral'}</p>
              </div>

              {/* Difficulty Badge */}
              <div className="mb-4">
                <Badge className={`${getDifficultyColor(exercise.difficulty_level)} border font-medium`}>
                  {getDifficultyText(exercise.difficulty_level)}
                </Badge>
              </div>

              {/* Equipment & Muscles Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-txt-3 font-medium">Equipamento:</span>
                  <Badge variant="secondary" className="text-xs bg-surface border-line/50">
                    {exercise.equipment}
                  </Badge>
                </div>
                
                {exercise.primary_muscles.length > 0 && (
                  <div className="space-y-1">
                    <span className="text-xs text-txt-3 font-medium block">Músculos principais:</span>
                    <div className="flex flex-wrap gap-1">
                      {exercise.primary_muscles.slice(0, 2).map((muscle, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-accent/30 text-accent">
                          {muscle}
                        </Badge>
                      ))}
                      {exercise.primary_muscles.length > 2 && (
                        <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                          +{exercise.primary_muscles.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Tips Preview */}
              {exercise.instructions && exercise.instructions.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm text-txt-2 line-clamp-2 bg-surface/50 p-3 rounded-lg border border-line/20">
                    💡 {exercise.instructions[0]}
                  </p>
                </div>
              )}

              {/* Action Button */}
              <Button 
                onClick={() => setSelectedExercise(exercise)} 
                className="w-full bg-gradient-to-r from-accent to-accent-2 hover:from-accent/90 hover:to-accent-2/90 text-accent-ink font-semibold"
                size="lg"
              >
                <Play className="w-4 h-4 mr-2" />
                {exercise.model_3d_url ? 'Visualizar 3D' : 'Ver Detalhes'}
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Enhanced Empty State */}
      {filteredExercises.length === 0 && (
        <div className="liquid-glass p-16 text-center">
          <div className="max-w-md mx-auto">
            <div className="p-4 rounded-full bg-accent/20 w-fit mx-auto mb-6">
              <Search className="w-12 h-12 text-accent" />
            </div>
            <h3 className="text-2xl font-bold text-txt mb-4">Nenhum exercício encontrado</h3>
            <p className="text-txt-2 mb-6 text-lg">
              Tente ajustar os filtros ou termo de busca para encontrar o exercício perfeito
            </p>
            <Button 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('');
                setDifficultyFilter('');
              }} 
              className="bg-gradient-to-r from-accent to-accent-2 text-accent-ink"
              size="lg"
            >
              <Filter className="w-4 h-4 mr-2" />
              Limpar Todos os Filtros
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}