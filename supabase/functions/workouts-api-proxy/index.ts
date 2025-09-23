import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Max-Age': '86400',
};

// Create Supabase client for JWT verification (using anon key is sufficient)
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? ''
);

// External API configuration
const EXTERNAL_API_BASE = 'https://papaya-custard-389cca.netlify.app/api';
const PROXY_SECRET = Deno.env.get('PROXY_SECRET');

if (!PROXY_SECRET) {
  console.error('PROXY_SECRET environment variable is required');
  throw new Error('PROXY_SECRET environment variable is required');
}

// Generate secure pseudonymous ID using HMAC-SHA256
async function generatePseudonymousId(userId: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(PROXY_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    new TextEncoder().encode(userId)
  );
  
  const hashArray = Array.from(new Uint8Array(signature));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  
  return `proxy_${hashHex.substring(0, 16)}`;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract JWT from Authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('Missing or invalid authorization header');
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const jwt = authHeader.split(' ')[1];
    
    // Verify JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      console.error('JWT verification failed:', authError);
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate pseudonymous ID for external API
    const pseudonymousId = await generatePseudonymousId(user.id);
    
    // Parse the URL path to determine the endpoint
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/').filter(Boolean);
    
    // Remove 'functions', 'v1', and function name from path
    // Expected path: /functions/v1/workouts-api-proxy/workout/today
    const functionIndex = pathSegments.findIndex(segment => segment === 'workouts-api-proxy');
    const apiPath = functionIndex >= 0 && functionIndex + 1 < pathSegments.length 
      ? pathSegments.slice(functionIndex + 1).join('/') 
      : '';
    
    // Reduce logging in production
    const isProduction = Deno.env.get('ENVIRONMENT') === 'production';
    if (!isProduction) {
      console.log('Full path:', url.pathname);
      console.log('Path segments:', pathSegments);
      console.log('API path extracted:', apiPath);
    }
    
    if (!apiPath) {
      console.log('No API path found, generating fallback workout');
      // Return fallback workout directly
      const fallbackWorkout = {
        id: `fallback_${await generatePseudonymousId('fallback')}_${new Date().toISOString().split('T')[0]}`,
        date: new Date().toISOString().split('T')[0],
        focus: 'Peito & Tríceps',
        exercises: [
          {
            name: 'Supino reto',
            sets: 4,
            reps: '8-10',
            rest_s: 90
          },
          {
            name: 'Supino inclinado',
            sets: 3,
            reps: '10-12',
            rest_s: 90
          },
          {
            name: 'Mergulho',
            sets: 3,
            reps: 'AMRAP',
            rest_s: 120
          },
          {
            name: 'Tríceps testa',
            sets: 3,
            reps: '12',
            rest_s: 60
          }
        ]
      };
      
      return new Response(
        JSON.stringify(fallbackWorkout),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build external API URL with pseudonymous ID (ignore any client-provided user_id)
    const externalUrl = new URL(`${EXTERNAL_API_BASE}/${apiPath}`);
    
    // Always set our pseudonymous ID, ignore any client-provided user_id
    externalUrl.searchParams.set('user_id', pseudonymousId);
    
    // Copy other search parameters (excluding user_id for security)
    url.searchParams.forEach((value, key) => {
      if (key !== 'user_id') {
        externalUrl.searchParams.set(key, value);
      }
    });

    // Prepare request for external API
    const requestInit: RequestInit = {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Volt-Workout-Proxy/1.0'
      }
    };

    // Handle request body for POST requests
    if (req.method === 'POST') {
      const body = await req.text();
      if (body) {
        try {
          const parsedBody = JSON.parse(body);
          // Always use our pseudonymous ID, ignore any client-provided user_id
          parsedBody.user_id = pseudonymousId;
          requestInit.body = JSON.stringify(parsedBody);
        } catch {
          // For non-JSON body, create a JSON body with our pseudonymous ID
          requestInit.body = JSON.stringify({ user_id: pseudonymousId });
        }
      } else {
        // Empty body, create JSON with our pseudonymous ID
        requestInit.body = JSON.stringify({ user_id: pseudonymousId });
      }
    }

    // Secure logging - only in development
    if (!isProduction) {
      console.log(`Proxying ${req.method} ${apiPath} for user ${user.id.slice(0, 8)}... -> ${pseudonymousId}`);
    }

    // Make request to external API
    const response = await fetch(externalUrl.toString(), requestInit);
    
    if (!response.ok) {
      console.error(`External API error: ${response.status} ${response.statusText}`);
      
      // Generate fallback response for workout data
      if (apiPath.includes('workout/today')) {
        const fallbackWorkout = {
          id: `fallback_${pseudonymousId}_${new Date().toISOString().split('T')[0]}`,
          date: new Date().toISOString().split('T')[0],
          focus: 'Treino Personalizado',
          exercises: [
            {
              name: 'Aquecimento',
              sets: 1,
              reps: '5-10',
              rest_s: 30
            },
            {
              name: 'Exercício Principal',
              sets: 3,
              reps: '8-12',
              rest_s: 90
            },
            {
              name: 'Exercício Acessório',
              sets: 2,
              reps: '12-15',
              rest_s: 60
            }
          ]
        };
        
        return new Response(
          JSON.stringify(fallbackWorkout),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (apiPath.includes('workout/complete')) {
        const fallbackResponse = {
          ok: true,
          xp_awarded: Math.floor(Math.random() * 20) + 20
        };
        
        return new Response(
          JSON.stringify(fallbackResponse),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const responseData = await response.json();
    
    // Log success (without sensitive data) - only in development
    if (!isProduction) {
      console.log(`✅ Proxy success for ${apiPath}`);
    }
    
    return new Response(
      JSON.stringify(responseData),
      { 
        status: response.status,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Proxy error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal proxy error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});