import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    const { method } = req;
    const url = new URL(req.url);
    const action = url.searchParams.get('action') || 'templates';

    console.log(`Workout Templates API - Method: ${method}, Action: ${action}`);

    if (method === 'GET') {
      if (action === 'templates') {
        // Get all available templates with exercises
        const { data: templates, error: templatesError } = await supabaseClient
          .from('workout_templates')
          .select(`
            *,
            workout_template_exercises (
              *,
              exercises (
                id,
                name,
                primary_muscles,
                equipment,
                difficulty_level
              )
            )
          `)
          .eq('is_public', true)
          .order('rating', { ascending: false });

        if (templatesError) {
          console.error('Error fetching templates:', templatesError);
          throw templatesError;
        }

        return new Response(JSON.stringify({ templates }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'schedule') {
        // Get user's weekly schedule
        const { data: schedule, error: scheduleError } = await supabaseClient
          .from('weekly_schedule')
          .select(`
            *,
            workout_templates (
              id,
              name,
              focus,
              duration_minutes,
              difficulty,
              category
            )
          `)
          .order('day_of_week');

        if (scheduleError) {
          console.error('Error fetching schedule:', scheduleError);
          throw scheduleError;
        }

        return new Response(JSON.stringify({ schedule }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'my-templates') {
        // Get user's custom templates
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        const { data: myTemplates, error: myError } = await supabaseClient
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
          .eq('created_by', user?.id)
          .order('created_at', { ascending: false });

        if (myError) {
          console.error('Error fetching user templates:', myError);
          throw myError;
        }

        return new Response(JSON.stringify({ templates: myTemplates }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (method === 'POST') {
      const body = await req.json();
      
      if (action === 'create-template') {
        const { data: { user } } = await supabaseClient.auth.getUser();
        
        const { template, exercises } = body;
        
        // Create template
        const { data: newTemplate, error: templateError } = await supabaseClient
          .from('workout_templates')
          .insert({
            name: template.name,
            description: template.description || '',
            category: template.category || 'custom',
            difficulty: template.difficulty || 'intermediario',
            duration_minutes: template.duration_minutes || 45,
            focus: template.focus,
            tags: template.tags || [],
            is_public: template.is_public || false,
            created_by: user?.id
          })
          .select()
          .single();

        if (templateError) {
          console.error('Error creating template:', templateError);
          throw templateError;
        }

        // Add exercises to template
        if (exercises && exercises.length > 0) {
          const templateExercises = exercises.map((ex: any, index: number) => ({
            template_id: newTemplate.id,
            exercise_id: ex.exercise_id,
            sets: ex.sets || 3,
            reps_min: ex.reps_min,
            reps_max: ex.reps_max,
            reps_target: ex.reps_target || '8-12',
            weight_suggestion: ex.weight_suggestion,
            rest_seconds: ex.rest_seconds || 90,
            order_index: index + 1,
            notes: ex.notes || ''
          }));

          const { error: exercisesError } = await supabaseClient
            .from('workout_template_exercises')
            .insert(templateExercises);

          if (exercisesError) {
            console.error('Error adding exercises to template:', exercisesError);
            throw exercisesError;
          }
        }

        console.log('Template created successfully:', newTemplate.id);

        return new Response(JSON.stringify({ 
          success: true, 
          template: newTemplate,
          message: 'Template criado com sucesso!' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'add-to-schedule') {
        const { data: { user } } = await supabaseClient.auth.getUser();
        const { template_id, day_of_week } = body;

        // Remove existing template for this day (if any)
        await supabaseClient
          .from('weekly_schedule')
          .delete()
          .eq('user_id', user?.id)
          .eq('day_of_week', day_of_week);

        // Add new template to schedule
        const { data: scheduleEntry, error: scheduleError } = await supabaseClient
          .from('weekly_schedule')
          .insert({
            user_id: user?.id,
            day_of_week,
            template_id,
            is_completed: false
          })
          .select()
          .single();

        if (scheduleError) {
          console.error('Error adding to schedule:', scheduleError);
          throw scheduleError;
        }

        return new Response(JSON.stringify({ 
          success: true, 
          entry: scheduleEntry,
          message: 'Treino adicionado à agenda!' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      if (action === 'start-workout') {
        const { template_id } = body;
        const { data: { user } } = await supabaseClient.auth.getUser();

        // Get template with exercises
        const { data: template, error: templateError } = await supabaseClient
          .from('workout_templates')
          .select(`
            *,
            workout_template_exercises (
              *,
              exercises (
                id,
                name,
                primary_muscles,
                equipment,
                instructions,
                form_tips
              )
            )
          `)
          .eq('id', template_id)
          .single();

        if (templateError) {
          console.error('Error fetching template:', templateError);
          throw templateError;
        }

        // Create workout session
        const { data: workoutSession, error: sessionError } = await supabaseClient
          .from('workout_sessions')
          .insert({
            user_id: user?.id,
            name: template.name,
            focus: template.focus,
            duration_minutes: template.duration_minutes,
            status: 'active',
            started_at: new Date().toISOString()
          })
          .select()
          .single();

        if (sessionError) {
          console.error('Error creating workout session:', sessionError);
          throw sessionError;
        }

        // Create exercise logs
        const exerciseLogs = [];
        for (const templateEx of template.workout_template_exercises) {
          const { data: exerciseLog, error: logError } = await supabaseClient
            .from('exercise_logs')
            .insert({
              session_id: workoutSession.id,
              exercise_id: templateEx.exercise_id,
              order_index: templateEx.order_index,
              notes: templateEx.notes
            })
            .select()
            .single();

          if (logError) {
            console.error('Error creating exercise log:', logError);
            continue;
          }

          exerciseLogs.push({
            ...exerciseLog,
            exercise: templateEx.exercises,
            sets: templateEx.sets,
            reps_target: templateEx.reps_target,
            weight_suggestion: templateEx.weight_suggestion,
            rest_seconds: templateEx.rest_seconds
          });
        }

        // Update template completion count
        await supabaseClient
          .from('workout_templates')
          .update({ completions: template.completions + 1 })
          .eq('id', template_id);

        console.log('Workout session started:', workoutSession.id);

        return new Response(JSON.stringify({ 
          success: true, 
          workout: {
            ...workoutSession,
            exercises: exerciseLogs
          },
          message: 'Treino iniciado com sucesso!' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    if (method === 'DELETE') {
      if (action === 'remove-from-schedule') {
        const { data: { user } } = await supabaseClient.auth.getUser();
        const { day_of_week, template_id } = await req.json();

        const { error: deleteError } = await supabaseClient
          .from('weekly_schedule')
          .delete()
          .eq('user_id', user?.id)
          .eq('day_of_week', day_of_week)
          .eq('template_id', template_id);

        if (deleteError) {
          console.error('Error removing from schedule:', deleteError);
          throw deleteError;
        }

        return new Response(JSON.stringify({ 
          success: true,
          message: 'Treino removido da agenda!' 
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    return new Response(JSON.stringify({ error: 'Ação não reconhecida' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in workout-templates function:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor',
      details: error.toString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});