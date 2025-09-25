import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Configurar templates de e-mail
    const emailTemplates = {
      confirmation: {
        subject: "🔥 Bem-vindo ao VOLT - Confirme seu e-mail",
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Bem-vindo ao VOLT</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0b1020; color: #e9efff; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #7bdcff, #2ecc71); border-radius: 16px; margin-bottom: 30px; }
              .header h1 { font-size: 32px; font-weight: bold; color: #001018; margin: 0; }
              .header p { color: #001018; opacity: 0.8; margin: 10px 0 0; }
              .content { background: #111831; border-radius: 16px; padding: 30px; margin-bottom: 30px; }
              .button { display: inline-block; background: linear-gradient(135deg, #7bdcff, #2ecc71); color: #001018; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; margin: 20px 0; }
              .footer { text-align: center; color: #c8d2ff; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>⚡ VOLT</h1>
                <p>Seu treino inteligente chegou</p>
              </div>
              
              <div class="content">
                <h2>🔥 Bem-vindo, Atleta!</h2>
                <p>Você acabou de se juntar à elite fitness do VOLT. Estamos empolgados para te ajudar a alcançar seus objetivos!</p>
                
                <p><strong>O que te espera:</strong></p>
                <ul>
                  <li>🤖 IA Coach personalizada</li>
                  <li>📊 Análises avançadas de progresso</li>
                  <li>💪 Planos de treino científicos</li>
                  <li>⚡ Tecnologia de ponta para resultados</li>
                </ul>
                
                <p>Clique no botão abaixo para confirmar seu e-mail e começar sua jornada:</p>
                
                <a href="{{ .ConfirmationURL }}" class="button">
                  ✅ Confirmar E-mail & Começar
                </a>
              </div>
              
              <div class="footer">
                <p>💪 VOLT - Transformando corpos com ciência e tecnologia</p>
                <p>Se você não se cadastrou, ignore este e-mail.</p>
              </div>
            </div>
          </body>
          </html>
        `
      },
      welcome: {
        subject: "🚀 Sua conta VOLT está ativa - Vamos treinar!",
        body: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <title>Conta Ativa - VOLT</title>
            <style>
              body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0b1020; color: #e9efff; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { text-align: center; padding: 40px 0; background: linear-gradient(135deg, #7bdcff, #2ecc71); border-radius: 16px; margin-bottom: 30px; }
              .header h1 { font-size: 32px; font-weight: bold; color: #001018; margin: 0; }
              .content { background: #111831; border-radius: 16px; padding: 30px; margin-bottom: 30px; }
              .button { display: inline-block; background: linear-gradient(135deg, #7bdcff, #2ecc71); color: #001018; text-decoration: none; padding: 16px 32px; border-radius: 12px; font-weight: bold; margin: 20px 0; }
              .feature-list { list-style: none; padding: 0; }
              .feature-list li { background: #141b34; padding: 15px; margin: 10px 0; border-radius: 12px; border-left: 4px solid #7bdcff; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>🔥 CONTA ATIVA!</h1>
                <p>Prepare-se para a transformação</p>
              </div>
              
              <div class="content">
                <h2>🚀 Tudo Pronto, {{ .Name }}!</h2>
                <p>Sua conta VOLT está 100% ativa. Agora você tem acesso completo à nossa plataforma fitness mais avançada do Brasil!</p>
                
                <h3>🎯 Primeiros Passos:</h3>
                <ul class="feature-list">
                  <li><strong>1. Configure seu Perfil</strong><br>Defina objetivos, experiência e preferências</li>
                  <li><strong>2. Converse com a IA Coach</strong><br>Tire dúvidas sobre treino, nutrição e técnica</li>
                  <li><strong>3. Crie seu Primeiro Plano</strong><br>Planos personalizados baseados em ciência</li>
                  <li><strong>4. Registre seu Treino</strong><br>Acompanhe progresso e evolução</li>
                </ul>
                
                <a href="{{ .SiteURL }}/dashboard" class="button">
                  🏋️ Acessar VOLT Dashboard
                </a>
              </div>
              
              <div class="footer">
                <p>💪 VOLT - Evolução científica para seu corpo</p>
                <p>Alguma dúvida? Nossa IA Coach está sempre disponível!</p>
              </div>
            </div>
          </body>
          </html>
        `
      }
    }

    return new Response(JSON.stringify({ 
      message: "Email templates configured",
      templates: Object.keys(emailTemplates)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})