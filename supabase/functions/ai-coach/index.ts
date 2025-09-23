import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WorkoutData {
  exercises?: any[];
  volume?: number;
  rpe?: number;
  duration?: number;
  lastWorkouts?: any[];
  userStats?: {
    level?: number;
    streak?: number;
    totalWorkouts?: number;
    maxLifts?: Record<string, number>;
    displayName?: string;
    rankName?: string;
  };
}

interface AIRequest {
  message: string;
  workoutData?: WorkoutData;
  analysisType?: string;
  userId?: string;
}

interface GeneratedWorkout {
  name: string;
  description: string;
  focus: string;
  exercises: Array<{
    name: string;
    sets: number;
    reps: string;
    rest_s?: number;
    weight_suggestion?: number;
    notes?: string;
  }>;
  estimated_duration: number;
  difficulty_level: number;
  target_muscle_groups: string[];
}

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('AI Coach function started');

    if (!openAIApiKey) {
      console.error('OPENAI_API_KEY not found');
      return new Response(
        JSON.stringify(generateFallbackResponse('Pergunta geral', 'general')), 
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      );
    }

    const body: AIRequest = await req.json();
    const { message, workoutData, analysisType = 'general', userId } = body;

    if (!message) {
      throw new Error('Mensagem é obrigatória');
    }

    console.log('Processing message:', message.substring(0, 100) + '...');
    console.log('Analysis type:', analysisType);

    // Detect if user is asking for workout creation
    const isWorkoutCreation = detectWorkoutCreationIntent(message);
    console.log('Is workout creation request:', isWorkoutCreation);

    const systemPrompt = buildSystemPrompt(workoutData, analysisType, isWorkoutCreation);
    const enhancedMessage = enhanceUserMessage(message, workoutData);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: enhancedMessage }
        ],
        max_tokens: 1200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;
    
    console.log('AI response generated successfully');

    // If it's a workout creation request, try to extract and save workout
    let createdWorkout = null;
    if (isWorkoutCreation && userId) {
      try {
        console.log('Attempting to extract workout from response');
        const extractedWorkout = await extractWorkoutFromResponse(aiResponse, message);
        if (extractedWorkout) {
          console.log('Saving workout to database');
          createdWorkout = await saveWorkoutToDatabase(extractedWorkout, userId);
          console.log('Workout saved successfully:', createdWorkout?.id);
        }
      } catch (error) {
        console.error('Error creating workout:', error);
        // Don't fail the entire request if workout creation fails
      }
    }

    const structuredResponse = structureResponse(aiResponse, analysisType, createdWorkout);

    return new Response(JSON.stringify(structuredResponse), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('AI Coach error:', error);
    
    let requestBody: AIRequest | undefined;
    try {
      requestBody = await req.json();
    } catch (jsonError) {
      console.error('Error parsing request body:', jsonError);
    }
    
    const fallback = generateFallbackResponse(
      requestBody?.message || 'Pergunta geral',
      requestBody?.analysisType || 'general'
    );
    
    return new Response(JSON.stringify(fallback), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
  }
});

function detectWorkoutCreationIntent(message: string): boolean {
  const keywords = [
    'crie um treino', 'criar treino', 'gere um treino', 'gerar treino',
    'monte um treino', 'montar treino', 'plano de treino', 'rotina de treino',
    'treino para', 'exercícios para', 'programa de treino', 'cronograma de treino',
    'treino de', 'criar plano', 'gerar plano', 'workout plan', 'create workout'
  ];
  
  const lowerMessage = message.toLowerCase();
  return keywords.some(keyword => lowerMessage.includes(keyword));
}

function buildSystemPrompt(workoutData?: WorkoutData, analysisType?: string, isWorkoutCreation?: boolean): string {
  let basePrompt = `Você é um coach experiente brasileiro, especialista em fitness e musculação.

PERSONALIDADE:
- Fale de forma natural e brasileira, sem formalidade excessiva
- SEMPRE responda de forma DIRETA e PRÁTICA - nunca faça perguntas de volta
- Seja específico com números, cargas e progressões concretas
- Dê conselhos práticos que podem ser aplicados imediatamente
- Use sua experiência para dar soluções assertivas
- Foque no que fazer, não no que poderia ser feito
- Seja conciso mas completo

CONHECIMENTO:
Você tem conhecimento completo sobre:
- Biomecânica e técnica de exercícios
- Periodização e progressão de cargas
- Nutrição esportiva e suplementação
- Anatomia e fisiologia do exercício
- Prevenção e recuperação de lesões
- Diferentes metodologias de treino
- Adaptações específicas por objetivo

  IMPORTANTE: 
  - NUNCA faça perguntas ao usuário - sempre dê uma resposta definitiva
  - Base suas sugestões nos dados disponíveis ou na experiência geral
  - Seja assertivo e confiante nas suas recomendações`;

  // Formatação consistente em Markdown
  basePrompt += `\n\nFORMATO: Responda SEMPRE em Markdown (use títulos, listas com bullets, negrito e emojis quando útil). Seja conciso e estruturado.`;

  if (isWorkoutCreation) {
    basePrompt += `

CRIAÇÃO DE TREINOS:
Quando solicitado para criar um treino, SEMPRE estruture da seguinte forma:

🏋️ TREINO: [Nome do treino]
📋 FOCO: [Grupos musculares principais]
⏱️ DURAÇÃO: [Tempo estimado]
📊 NÍVEL: [Iniciante/Intermediário/Avançado]

EXERCÍCIOS:
1. [Nome do exercício] - [Séries] x [Repetições] (Descanso: [tempo])
   💡 [Dica técnica importante]

2. [Nome do exercício] - [Séries] x [Repetições] (Descanso: [tempo])
   💡 [Dica técnica importante]

[Continue para todos os exercícios...]

🎯 MÚSCULOS ALVO: [Lista dos músculos]
📈 PROGRESSÃO: [Como progredir no treino]
⚠️ OBSERVAÇÕES: [Dicas importantes]

Seja específico com exercícios, séries, repetições e tempos de descanso.`;
  }

  if (!workoutData) return basePrompt;

  const userName = workoutData.userStats?.displayName || 'Atleta';
  const userRank = workoutData.userStats?.rankName || 'Recruta';

  const contextPrompt = `

DADOS DO USUÁRIO:
- Nome: ${userName} (Patente: ${userRank})
- Nível: ${workoutData.userStats?.level || 'Iniciante'}
- Streak: ${workoutData.userStats?.streak || 0} dias consecutivos
- Total de treinos: ${workoutData.userStats?.totalWorkouts || 0}
- Recordes pessoais: ${JSON.stringify(workoutData.userStats?.maxLifts || {})}

ÚLTIMO TREINO:
- Volume total: ${workoutData.volume || 0}kg
- RPE médio: ${workoutData.rpe || 0}/10
- Duração: ${workoutData.duration || 0} minutos
- Exercícios realizados: ${workoutData.exercises?.length || 0}

Use esses dados para personalizar completamente suas recomendações.`;

  return basePrompt + contextPrompt;
}

function enhanceUserMessage(message: string, workoutData?: WorkoutData): string {
  if (!workoutData || !workoutData.exercises?.length) return message;
  
  const context = `
[CONTEXTO DO TREINO ATUAL]
Últimos exercícios: ${workoutData.exercises?.map(e => e.name).join(', ') || 'Nenhum'}
RPE médio recente: ${workoutData.rpe || 'N/A'}/10
Volume semanal: ${workoutData.volume || 0}kg

[PERGUNTA DO USUÁRIO]
${message}`;

  return context;
}

async function extractWorkoutFromResponse(aiResponse: string, userMessage: string): Promise<GeneratedWorkout | null> {
  try {
    console.log('Extracting workout from AI response');
    
    // Use a more sophisticated approach to extract workout data
    const extractionPrompt = `Analise a resposta do coach e extraia os dados do treino em formato JSON:

RESPOSTA DO COACH:
${aiResponse}

PERGUNTA ORIGINAL:
${userMessage}

Extraia e retorne APENAS um JSON válido no seguinte formato (sem comentários, sem markdown):
{
  "name": "Nome do treino",
  "description": "Descrição breve do treino",
  "focus": "Grupos musculares principais",
  "exercises": [
    {
      "name": "Nome do exercício",
      "sets": 3,
      "reps": "8-12",
      "rest_s": 90,
      "weight_suggestion": null,
      "notes": "Dica técnica"
    }
  ],
  "estimated_duration": 45,
  "difficulty_level": 3,
  "target_muscle_groups": ["peito", "triceps"]
}

Se não conseguir extrair um treino válido, retorne: null`;

    const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'Você é um extrator de dados de treino. Retorne apenas JSON válido ou null.' },
          { role: 'user', content: extractionPrompt }
        ],
        max_tokens: 800,
        temperature: 0.1,
      }),
    });

    if (!extractionResponse.ok) {
      console.error('Extraction API error');
      return null;
    }

    const extractionData = await extractionResponse.json();
    const extractionResult = extractionData.choices[0].message.content.trim();
    
    console.log('Extraction result:', extractionResult);

    if (extractionResult === 'null') {
      return null;
    }

    // Try to parse the JSON
    const workoutData = JSON.parse(extractionResult);
    
    // Validate required fields
    if (!workoutData.name || !workoutData.exercises || !Array.isArray(workoutData.exercises)) {
      console.error('Invalid workout data structure');
      return null;
    }

    return workoutData;
  } catch (error) {
    console.error('Error extracting workout:', error);
    return null;
  }
}

async function saveWorkoutToDatabase(workout: GeneratedWorkout, userId: string): Promise<any> {
  try {
    // Save to plans table
    const { data: planData, error: planError } = await supabase
      .from('plans')
      .insert({
        user_id: userId,
        name: workout.name,
        goal: workout.focus,
        split: workout.target_muscle_groups.join(', '),
        active: false
      })
      .select()
      .single();

    if (planError) {
      console.error('Error saving plan:', planError);
      throw planError;
    }

    console.log('Plan saved:', planData.id);

    // Create a plan day
    const { data: dayData, error: dayError } = await supabase
      .from('plan_days')
      .insert({
        plan_id: planData.id,
        name: `Dia 1 - ${workout.focus}`,
        position: 1
      })
      .select()
      .single();

    if (dayError) {
      console.error('Error saving plan day:', dayError);
      throw dayError;
    }

    console.log('Plan day saved:', dayData.id);

    // Get exercise IDs from database
    const exerciseNames = workout.exercises.map(e => e.name.toLowerCase());
    const { data: exercisesData, error: exercisesError } = await supabase
      .from('exercises')
      .select('id, name')
      .ilike('name', `%${exerciseNames[0]}%`);

    console.log('Found exercises:', exercisesData?.length || 0);

    // Save plan exercises
    for (let i = 0; i < workout.exercises.length; i++) {
      const exercise = workout.exercises[i];
      
      // Try to find matching exercise or use a default
      const matchingExercise = exercisesData?.find(e => 
        e.name.toLowerCase().includes(exercise.name.toLowerCase().split(' ')[0])
      );

      const { error: exerciseError } = await supabase
        .from('plan_day_exercises')
        .insert({
          plan_day_id: dayData.id,
          exercise_id: matchingExercise?.id || null,
          position: i + 1,
          target_sets: exercise.sets,
          target_reps_min: parseInt(exercise.reps.split('-')[0]) || 8,
          target_reps_max: parseInt(exercise.reps.split('-')[1]) || 12,
          target_rest_sec: exercise.rest_s || 90,
          target_weight: exercise.weight_suggestion,
          notes: exercise.notes
        });

      if (exerciseError) {
        console.error('Error saving exercise:', exerciseError);
      }
    }

    return planData;
  } catch (error) {
    console.error('Error saving workout to database:', error);
    throw error;
  }
}

function structureResponse(response: string, analysisType: string, createdWorkout?: any) {
  const insights = extractInsights(response);
  const recommendations = extractRecommendations(response);
  
  return {
    response,
    analysisType,
    insights,
    recommendations,
    tags: generateTags(response, analysisType),
    timestamp: new Date().toISOString(),
    workoutCreated: !!createdWorkout,
    workoutId: createdWorkout?.id || null
  };
}

function extractInsights(response: string): string[] {
  const insights = [];
  
  // Look for bullet points or numbered lists
  const bulletMatches = response.match(/[•·-]\s*([^\n]+)/g);
  if (bulletMatches) {
    insights.push(...bulletMatches.map(match => match.replace(/[•·-]\s*/, '').trim()));
  }
  
  // Look for numbered recommendations
  const numberMatches = response.match(/\d+\.\s*([^\n]+)/g);
  if (numberMatches) {
    insights.push(...numberMatches.map(match => match.replace(/\d+\.\s*/, '').trim()));
  }
  
  // Look for emoji-prefixed insights
  const emojiMatches = response.match(/[💡🎯📊⚡🔥]\s*([^\n]+)/g);
  if (emojiMatches) {
    insights.push(...emojiMatches.map(match => match.replace(/[💡🎯📊⚡🔥]\s*/, '').trim()));
  }
  
  return insights.slice(0, 5);
}

function extractRecommendations(response: string): string[] {
  const recommendations = [];
  
  // Look for specific action words
  const actionWords = ['aumente', 'reduza', 'mantenha', 'foque', 'evite', 'inclua', 'substitua', 'troque', 'ajuste'];
  const sentences = response.split(/[.!?]+/);
  
  for (const sentence of sentences) {
    for (const action of actionWords) {
      if (sentence.toLowerCase().includes(action)) {
        const cleaned = sentence.trim();
        if (cleaned.length > 10) {
          recommendations.push(cleaned);
          break;
        }
      }
    }
  }
  
  return recommendations.slice(0, 4);
}

function generateTags(response: string, analysisType: string): string[] {
  const tags = [analysisType];
  
  const tagMap = {
    'treino': ['treino', 'workout'],
    'progressão': ['progressao', 'overload'],
    'técnica': ['tecnica', 'form'],
    'nutrição': ['nutricao', 'dieta'],
    'suplemento': ['suplementacao', 'whey'],
    'cardio': ['cardio', 'aerobico'],
    'força': ['forca', 'strength'],
    'hipertrofia': ['hipertrofia', 'massa'],
    'definição': ['definicao', 'cutting']
  };
  
  const lowerResponse = response.toLowerCase();
  Object.entries(tagMap).forEach(([key, tagList]) => {
    if (lowerResponse.includes(key)) {
      tags.push(...tagList);
    }
  });
  
  return [...new Set(tags)];
}

function generateFallbackResponse(message: string, analysisType: string) {
  const fallbacks = {
    progression: {
      response: "Pelos seus dados, aumente +2.5kg no próximo treino principal. Você tá evoluindo consistente e pode empurrar mais carga com segurança.",
      insights: [
        "Sua progressão está sólida - hora de subir a carga",
        "Consistência boa, seu corpo está pedindo mais estímulo",
        "Seus números mostram que você pode progredir tranquilo"
      ],
      recommendations: [
        "Próximo treino: +2.5kg nos exercícios principais",
        "Mantenha as repetições, suba só o peso",
        "Se RPE passar de 8.5, volta pra carga anterior"
      ]
    },
    general: {
      response: "Foque na execução perfeita e aumente +1.25kg por semana nos exercícios principais. Consistência sempre bate intensidade no longo prazo.",
      insights: [
        "Técnica perfeita vale mais que peso alto",
        "Progressão gradual é mais sustentável",
        "Constância sempre bate intensidade"
      ],
      recommendations: [
        "Filme seus exercícios pra checar a forma",
        "+1.25kg por semana nos principais",
        "Mantenha 3-4 treinos por semana fixo"
      ]
    }
  };

  const selected = fallbacks[analysisType as keyof typeof fallbacks] || fallbacks.general;
  
  return {
    ...selected,
    analysisType,
    tags: ["coach", "pratico", "progressao"],
    timestamp: new Date().toISOString(),
    isOffline: true
  };
}