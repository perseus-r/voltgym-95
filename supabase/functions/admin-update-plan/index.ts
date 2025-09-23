import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = [
  "pedrosannger16@gmail.com",
  "sannger@proton.me"
];

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    // Verificar autenticação do administrador
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");

    // Verificar se é administrador
    if (!ADMIN_EMAILS.includes(user.email || "")) {
      throw new Error("Access denied: Admin privileges required");
    }

    const { userId, planType, verified } = await req.json();

    if (!userId || !planType) {
      throw new Error("userId and planType are required");
    }

    // Primeiro, verificar se o usuário existe na tabela profiles
    const { data: existingProfile, error: checkError } = await supabaseClient
      .from("profiles")
      .select("id, user_id")
      .eq("user_id", userId)
      .single();

    if (checkError && checkError.code !== "PGRST116") {
      console.error("Error checking profile:", checkError);
    }

    console.log("Found profile:", existingProfile);

    // Gerenciar assinatura
    if (planType !== "free") {
      const subscriptionData = {
        user_id: userId,
        status: "active",
        plan_id: planType === "premium" ? "premium_mensal_brl_199" : "pro_mensal_brl_99",
        current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: subError } = await supabaseClient
        .from("subscriptions")
        .upsert(subscriptionData, { onConflict: "user_id" });

      if (subError) {
        console.error("Subscription error:", subError);
        throw new Error(`Failed to update subscription: ${subError.message}`);
      }
      
      console.log(`Subscription updated to ${planType} for user ${userId}`);
    } else {
      // Remover assinatura para plano gratuito
      const { error: deleteError } = await supabaseClient
        .from("subscriptions")
        .delete()
        .eq("user_id", userId);

      if (deleteError && deleteError.code !== "PGRST116") {
        console.error("Delete subscription error:", deleteError);
      } else {
        console.log(`Subscription removed for user ${userId}`);
      }
    }

    // Gerenciar verificação através de admin_controls
    if (typeof verified === "boolean") {
      if (verified) {
        // Obter email do usuário para adicionar aos controles
        const { data: profile } = await supabaseClient
          .from("profiles")
          .select("user_id")
          .eq("user_id", userId)
          .single();

        if (profile) {
          // Buscar email do usuário autenticado
          const { data: authUser } = await supabaseClient.auth.admin.getUserById(userId);
          
          if (authUser?.user?.email) {
            const { error: controlError } = await supabaseClient
              .from("admin_controls")
              .upsert({
                target_user_email: authUser.user.email,
                free_access_granted: true,
                notes: `Verified by admin: ${user.email}`,
                granted_by: user.id,
                granted_at: new Date().toISOString()
              }, { onConflict: "target_user_email" });

            if (controlError) {
              console.error("Admin control error:", controlError);
            } else {
              console.log(`User ${authUser.user.email} verified`);
            }
          }
        }
      } else {
        // Remover verificação
        const { data: authUser } = await supabaseClient.auth.admin.getUserById(userId);
        
        if (authUser?.user?.email) {
          const { error: removeError } = await supabaseClient
            .from("admin_controls")
            .delete()
            .eq("target_user_email", authUser.user.email);

          if (removeError) {
            console.error("Remove verification error:", removeError);
          } else {
            console.log(`Verification removed for ${authUser.user.email}`);
          }
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      message: `User plan updated to ${planType}${verified ? " with verification" : ""}`
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : JSON.stringify(error);
    console.error("ERROR in admin-update-plan:", errorMessage);
    console.error("Full error object:", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return new Response(JSON.stringify({ 
      error: errorMessage,
      details: error instanceof Error ? error.stack : String(error)
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});