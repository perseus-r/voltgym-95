import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[CHECK-SUBSCRIPTION] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header provided");
    logStep("Authorization header found");

    const token = authHeader.replace("Bearer ", "");
    logStep("Authenticating user with token");
    
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id });

    // Check subscription in database
    const { data: subscription, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (subError && subError.code !== "PGRST116") { // PGRST116 = no rows returned
      logStep("Error fetching subscription", { error: subError.message });
      throw subError;
    }

    if (!subscription) {
      logStep("No subscription found");
      return new Response(JSON.stringify({ 
        subscribed: false,
        status: "free",
        plan_id: null,
        plan_type: "free",
        trial_end: null,
        current_period_end: null
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    }

    const isActive = ["trialing", "active"].includes(subscription.status);
    const isPastDue = subscription.status === "past_due";
    
    // Check if past_due with grace period (3 days)
    let hasGracePeriod = false;
    if (isPastDue && subscription.current_period_end) {
      const gracePeriodEnd = new Date(subscription.current_period_end);
      gracePeriodEnd.setDate(gracePeriodEnd.getDate() + 3);
      hasGracePeriod = new Date() <= gracePeriodEnd;
    }

    const subscribed = isActive || hasGracePeriod;

    logStep("Subscription status checked", { 
      subscriptionId: subscription.id, 
      status: subscription.status,
      subscribed,
      hasGracePeriod
    });

    // Determinar plan_type baseado no plan_id e stripe_price_id
    let plan_type = "free";
    if (subscription.plan_id) {
      if (subscription.plan_id.includes("premium")) {
        plan_type = "premium";
      } else if (subscription.plan_id.includes("pro")) {
        plan_type = "pro";
      }
    }
    
    // Também verificar pelo stripe_price_id como fallback
    if (plan_type === "free" && subscription.stripe_price_id) {
      if (subscription.stripe_price_id === "price_1S6I6ABg6h6wj2YxTHGq8sRl") {
        plan_type = "premium";
      } else if (subscription.stripe_price_id === "price_1S6I4ABg6h6wj2YxBSC3GoRx") {
        plan_type = "pro";
      }
    }

    return new Response(JSON.stringify({
      subscribed,
      status: subscription.status,
      plan_id: subscription.plan_id,
      plan_type: plan_type,
      trial_end: subscription.trial_end,
      current_period_end: subscription.current_period_end,
      grace_period: hasGracePeriod
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in check-subscription", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});