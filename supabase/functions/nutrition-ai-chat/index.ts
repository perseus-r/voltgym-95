import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const NUTRITION_SYSTEM_PROMPT = `Você é Dr. Nutri, um nutricionista especialista e direto, focado exclusivamente em nutrição, macronutrientes e calorias.

REGRAS FUNDAMENTAIS:
- Responda APENAS sobre nutrição, alimentação, macronutrientes, calorias e planejamento alimentar
- Seja direto, prático e preciso em suas respostas
- Sempre forneça valores numéricos quando possível (calorias, proteínas, carboidratos, gorduras)
- Use emojis relevantes para tornar as respostas mais visuais
- Mantenha o foco em resultados práticos e acionáveis

ESPECIALIDADES:
- Cálculo preciso de macronutrientes
- Análise de fotos de refeições
- Planejamento de refeições por objetivos
- Estratégias nutricionais para ganho de massa, perda de peso ou manutenção
- Sugestões de substituições alimentares
- Horários ideais para consumo de nutrientes

FORMATO:
- Responda SEMPRE em Markdown (títulos, listas, negrito, tabelas simples quando útil)
- Use bullets e destaque números com negrito
- Seja direto, sem rodeios

Exemplo de resposta (Markdown):
## 🍗 Frango grelhado (100g)
- Calorias: **165 kcal**
- Proteína: **31g**
- Carboidratos: **0g**
- Gorduras: **4g**

💡 Dica: Combine com 100g de batata doce (86 kcal) para um pós-treino perfeito!`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, imageBase64, analysisType = 'chat' } = await req.json();
    console.log('Processing nutrition request:', { analysisType, hasImage: !!imageBase64, conversationId });

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    let conversationMessages = [];

    // Load conversation history if conversationId provided
    if (conversationId) {
      const { data: messages } = await supabase
        .from('ai_messages')
        .select('role, content')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      conversationMessages = messages || [];
    }

    // Prepare messages for OpenAI
    const openaiMessages = [
      { role: 'system', content: NUTRITION_SYSTEM_PROMPT },
      ...conversationMessages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    // Handle different analysis types
    if (analysisType === 'photo_analysis' && imageBase64) {
      openaiMessages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analise esta foto de refeição e forneça:
            1. Identificação dos alimentos
            2. Estimativa de porções em gramas
            3. Cálculo detalhado de macronutrientes
            4. Total de calorias
            5. Sugestões de melhoria nutricional

            ${message ? `Contexto adicional: ${message}` : ''}`
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${imageBase64}`
            }
          }
        ]
      });
    } else {
      openaiMessages.push({
        role: 'user',
        content: message
      });
    }

    console.log('Sending request to OpenAI with', openaiMessages.length, 'messages');

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: openaiMessages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Received response from OpenAI');

    // Save messages to database if conversationId provided
    if (conversationId) {
      // Save user message
      await supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: message || 'Análise de foto de refeição',
        analysis_type: analysisType
      });

      // Save AI response
      await supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        role: 'assistant',
        content: aiResponse,
        analysis_type: analysisType
      });

      console.log('Messages saved to database');
    }

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in nutrition-ai-chat function:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      success: false
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});