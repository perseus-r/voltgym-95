import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key não configurada');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { prompt, userGoals, experience, equipment } = await req.json();
    const { data: { user } } = await supabaseClient.auth.getUser();

    console.log('AI Coach creating workout for:', user?.id);
    console.log('Prompt:', prompt);

    // Get available exercises from database
    const { data: exercises, error: exercisesError } = await supabaseClient
      .from('exercises')
      .select('id, name, primary_muscles, secondary_muscles, equipment, difficulty_level, instructions, form_tips')
      .limit(100);

    if (exercisesError) {
      console.error('Error fetching exercises:', exercisesError);
      throw exercisesError;
    }

    // Create AI prompt for workout generation
    const workoutPrompt = `
Você é um personal trainer expert criando um treino personalizado.

Informações do usuário:
- Objetivo: ${userGoals || 'ganho de massa muscular'}
- Experiência: ${experience || 'intermediário'}
- Equipamentos disponíveis: ${equipment || 'academia completa'}

Solicitação específica: ${prompt}

Exercícios disponíveis na base de dados:
${exercises.map(ex => `- ${ex.name} (${ex.primary_muscles?.join(', ')}) - ${ex.equipment || 'geral'} - Nível ${ex.difficulty_level || 3}`).join('\n')}

Crie um treino seguindo EXATAMENTE este formato JSON:

{
  "template": {
    "name": "Nome do treino (máximo 50 caracteres)",
    "description": "Descrição detalhada do treino e seus benefícios",
    "category": "strength|cardio|hiit|flexibility|custom",
    "difficulty": "iniciante|intermediario|avancado",
    "duration_minutes": número_em_minutos,
    "focus": "Foco principal do treino (ex: Peito e Tríceps)",
    "tags": ["tag1", "tag2", "tag3"]
  },
  "exercises": [
    {
      "exercise_id": "id_do_exercicio_da_base",
      "sets": número_de_séries,
      "reps_min": número_mínimo_reps,
      "reps_max": número_máximo_reps,
      "reps_target": "8-12",
      "weight_suggestion": peso_sugerido_kg,
      "rest_seconds": tempo_descanso_segundos,
      "notes": "Dicas específicas de execução"
    }
  ]
}

Regras importantes:
1. Use APENAS exercícios que existem na base de dados (IDs exatos)
2. Crie entre 6-10 exercícios
3. Séries entre 3-5, reps entre 6-20
4. Tempo de descanso: 60-120s para hipertrofia, 30-60s para resistência
5. Peso sugerido realista baseado na experiência
6. Notas específicas e úteis para cada exercício

Responda APENAS com o JSON válido, sem texto adicional.
`;

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'Você é um personal trainer expert que cria treinos personalizados em formato JSON.' 
          },
          { role: 'user', content: workoutPrompt }
        ],
        max_tokens: 2000,
        temperature: 0.7
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('AI Response:', aiResponse);

    // Parse AI response
    let workoutData;
    try {
      workoutData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      throw new Error('Erro ao processar resposta da IA');
    }

    // Validate that exercises exist in database
    const validExercises = [];
    for (const ex of workoutData.exercises) {
      const foundExercise = exercises.find(e => e.id === ex.exercise_id);
      if (foundExercise) {
        validExercises.push({
          ...ex,
          exercise_name: foundExercise.name
        });
      } else {
        console.warn('Exercise not found:', ex.exercise_id);
      }
    }

    if (validExercises.length === 0) {
      throw new Error('Nenhum exercício válido encontrado no treino gerado');
    }

    // Create template in database
    const { data: newTemplate, error: templateError } = await supabaseClient
      .from('workout_templates')
      .insert({
        name: workoutData.template.name,
        description: workoutData.template.description,
        category: workoutData.template.category || 'custom',
        difficulty: workoutData.template.difficulty || 'intermediario',
        duration_minutes: workoutData.template.duration_minutes || 45,
        focus: workoutData.template.focus,
        tags: workoutData.template.tags || [],
        is_public: false,
        created_by: user?.id
      })
      .select()
      .single();

    if (templateError) {
      console.error('Error creating template:', templateError);
      throw templateError;
    }

    // Add exercises to template
    const templateExercises = validExercises.map((ex, index) => ({
      template_id: newTemplate.id,
      exercise_id: ex.exercise_id,
      sets: ex.sets || 3,
      reps_min: ex.reps_min || 8,
      reps_max: ex.reps_max || 12,
      reps_target: ex.reps_target || '8-12',
      weight_suggestion: ex.weight_suggestion || 20,
      rest_seconds: ex.rest_seconds || 90,
      order_index: index + 1,
      notes: ex.notes || 'Foque na execução controlada'
    }));

    const { error: exercisesError2 } = await supabaseClient
      .from('workout_template_exercises')
      .insert(templateExercises);

    if (exercisesError2) {
      console.error('Error adding exercises to template:', exercisesError2);
      throw exercisesError2;
    }

    // Fetch complete template with exercises for response
    const { data: completeTemplate, error: fetchError } = await supabaseClient
      .from('workout_templates')
      .select(`
        *,
        workout_template_exercises (
          *,
          exercises (
            id,
            name,
            primary_muscles,
            equipment
          )
        )
      `)
      .eq('id', newTemplate.id)
      .single();

    if (fetchError) {
      console.error('Error fetching complete template:', fetchError);
      throw fetchError;
    }

    console.log('AI-generated workout created successfully:', newTemplate.id);

    return new Response(JSON.stringify({
      success: true,
      template: completeTemplate,
      message: `🤖 Treino "${newTemplate.name}" criado com sucesso pelo IA Coach!`,
      exercises_count: validExercises.length
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-coach-create-workout function:', error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : 'Erro interno do servidor',
      details: error instanceof Error ? error.toString() : String(error)
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});