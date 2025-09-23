import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Brain, Sparkles, Target, Clock, ChefHat, 
  Plus, Check, X, Calendar, Utensils 
} from 'lucide-react';
import { toast } from 'sonner';

interface MealSuggestion {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  prepTime: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  tags: string[];
  ingredients: string[];
  instructions: string[];
}

export function SmartMealPlanner() {
  const [goalCalories, setGoalCalories] = useState(2200);
  const [dietPreference, setDietPreference] = useState('balanced');
  const [mealSuggestions, setMealSuggestions] = useState<MealSuggestion[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<string[]>([]);

  const dietTypes = [
    { id: 'balanced', name: 'Balanceada', emoji: '⚖️' },
    { id: 'protein', name: 'Rica em Proteína', emoji: '💪' },
    { id: 'lowcarb', name: 'Low Carb', emoji: '🥑' },
    { id: 'vegetarian', name: 'Vegetariana', emoji: '🥬' },
  ];

  const mockMeals: MealSuggestion[] = [
    {
      id: '1',
      name: 'Frango Grelhado com Batata Doce',
      calories: 420,
      protein: 35,
      carbs: 45,
      fat: 8,
      prepTime: 25,
      difficulty: 'Fácil',
      tags: ['proteína', 'massa muscular', 'pós-treino'],
      ingredients: ['200g peito de frango', '150g batata doce', 'temperos', 'azeite'],
      instructions: [
        'Tempere o frango com sal, pimenta e alho',
        'Corte a batata doce em cubos',
        'Grelhe o frango por 6-8 min cada lado',
        'Asse a batata doce por 20 min a 200°C'
      ]
    },
    {
      id: '2',
      name: 'Salada Proteica com Quinoa',
      calories: 350,
      protein: 28,
      carbs: 35,
      fat: 12,
      prepTime: 15,
      difficulty: 'Fácil',
      tags: ['vegetariano', 'fibras', 'antioxidantes'],
      ingredients: ['100g quinoa', '150g grão de bico', 'folhas verdes', 'tomate cereja'],
      instructions: [
        'Cozinhe a quinoa conforme embalagem',
        'Misture com grão de bico escorrido',
        'Adicione folhas verdes e tomates',
        'Tempere com azeite e limão'
      ]
    },
    {
      id: '3',
      name: 'Omelete de Claras com Aveia',
      calories: 280,
      protein: 25,
      carbs: 20,
      fat: 8,
      prepTime: 10,
      difficulty: 'Fácil',
      tags: ['café da manhã', 'proteína', 'rápido'],
      ingredients: ['4 claras de ovo', '30g aveia', 'espinafre', 'tomate'],
      instructions: [
        'Bata as claras com a aveia',
        'Adicione espinafre picado',
        'Cozinhe em frigideira antiaderente',
        'Sirva com tomate em cubos'
      ]
    }
  ];

  const generateMealPlan = async () => {
    setIsGenerating(true);
    
    // Simular chamada para IA
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Filtrar refeições baseado na preferência
    let filteredMeals = mockMeals;
    if (dietPreference === 'protein') {
      filteredMeals = mockMeals.filter(meal => meal.protein >= 25);
    } else if (dietPreference === 'vegetarian') {
      filteredMeals = mockMeals.filter(meal => meal.tags.includes('vegetariano'));
    }
    
    setMealSuggestions(filteredMeals);
    setIsGenerating(false);
    toast.success('Plano alimentar gerado com sucesso!');
  };

  const toggleMealSelection = (mealId: string) => {
    setSelectedMeals(prev => 
      prev.includes(mealId) 
        ? prev.filter(id => id !== mealId)
        : [...prev, mealId]
    );
  };

  const addSelectedMealsToDay = () => {
    if (selectedMeals.length === 0) {
      toast.error('Selecione pelo menos uma refeição');
      return;
    }
    
    toast.success(`${selectedMeals.length} refeições adicionadas ao seu dia!`);
    setSelectedMeals([]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass-card p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
            <Brain className="w-6 h-6 text-purple-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Planejador Inteligente</h2>
            <p className="text-txt-2">IA personalizada para suas refeições</p>
          </div>
        </div>

        {/* Configurações */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Meta Calórica Diária
            </label>
            <Input
              type="number"
              value={goalCalories}
              onChange={(e) => setGoalCalories(Number(e.target.value))}
              className="bg-input-bg border-input-border text-white"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium text-white mb-2 block">
              Preferência Alimentar
            </label>
            <div className="grid grid-cols-2 gap-2">
              {dietTypes.map(diet => (
                <Button
                  key={diet.id}
                  variant={dietPreference === diet.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setDietPreference(diet.id)}
                  className="justify-start text-xs"
                >
                  {diet.emoji} {diet.name}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <Button 
          onClick={generateMealPlan}
          disabled={isGenerating}
          className="w-full volt-button"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Gerando plano...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Gerar Plano com IA
            </>
          )}
        </Button>
      </Card>

      {/* Sugestões de Refeições */}
      {mealSuggestions.length > 0 && (
        <Card className="glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">Refeições Sugeridas</h3>
            <Badge className="bg-purple-500/20 text-purple-400">
              {mealSuggestions.length} sugestões
            </Badge>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {mealSuggestions.map((meal, index) => (
              <motion.div
                key={meal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border transition-all cursor-pointer ${
                  selectedMeals.includes(meal.id)
                    ? 'border-accent bg-accent/10'
                    : 'border-white/10 hover:border-white/20'
                }`}
                onClick={() => toggleMealSelection(meal.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h4 className="font-semibold text-white text-sm">{meal.name}</h4>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                    selectedMeals.includes(meal.id)
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-white/30'
                  }`}>
                    {selectedMeals.includes(meal.id) && <Check className="w-3 h-3" />}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                  <div className="text-accent">{meal.calories} kcal</div>
                  <div className="text-txt-2">{meal.prepTime} min</div>
                  <div className="text-blue-400">{meal.protein}g proteína</div>
                  <div className="text-txt-2">{meal.difficulty}</div>
                </div>

                <div className="flex flex-wrap gap-1 mb-3">
                  {meal.tags.slice(0, 2).map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="text-xs text-txt-2">
                  <div className="font-medium mb-1">Ingredientes:</div>
                  <div>{meal.ingredients.slice(0, 2).join(', ')}...</div>
                </div>
              </motion.div>
            ))}
          </div>

          {selectedMeals.length > 0 && (
            <div className="flex items-center justify-between p-4 bg-accent/10 rounded-lg border border-accent/30">
              <span className="text-white">
                {selectedMeals.length} refeições selecionadas
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedMeals([])}
                >
                  <X className="w-4 h-4 mr-1" />
                  Limpar
                </Button>
                <Button 
                  size="sm"
                  onClick={addSelectedMealsToDay}
                  className="bg-accent text-accent-ink hover:bg-accent/90"
                >
                  <Calendar className="w-4 h-4 mr-1" />
                  Adicionar ao Dia
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
}