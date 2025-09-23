import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRIPE-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    logStep("Webhook received");

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not set");
    if (!webhookSecret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      throw new Error("No Stripe signature found");
    }

    const event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    logStep("Event verified", { type: event.type, id: event.id });

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        logStep("Processing checkout.session.completed", { sessionId: session.id });
        
        if (session.mode === "subscription" && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const customerId = session.customer as string;
          const userId = session.metadata?.user_id;

          if (!userId) {
            throw new Error("No user_id in session metadata");
          }

          // Determinar plan_id baseado no price_id
          const priceId = subscription.items.data[0].price.id;
          let planId = "free";
          if (priceId === "price_1S6I7wBg6h6wj2YxfYHVZJnP") {
            planId = "premium_mensal_brl_149";
          } else if (priceId === "price_1S6I4ABg6h6wj2YxBSC3GoRx") {
            planId = "pro_mensal_brl_99";
          }

          // Upsert subscription in database
          const { error } = await supabaseClient
            .from("subscriptions")
            .upsert({
              user_id: userId,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscription.id,
              stripe_price_id: priceId,
              plan_id: planId,
              status: subscription.status,
              trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            }, {
              onConflict: "user_id"
            });

          if (error) {
            logStep("Error upserting subscription", { error: error.message });
            throw error;
          }

          logStep("Subscription created/updated successfully", { userId, subscriptionId: subscription.id });
        }
        break;
      }

      case "customer.subscription.created":
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep(`Processing ${event.type}`, { subscriptionId: subscription.id });

        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (!customer || customer.deleted) {
          throw new Error("Customer not found");
        }

        const email = (customer as Stripe.Customer).email;
        if (!email) {
          throw new Error("Customer email not found");
        }

        // Find user by email
        const { data: userData, error: userError } = await supabaseClient.auth.admin.listUsers();
        if (userError) throw userError;

        const user = userData.users.find(u => u.email === email);
        if (!user) {
          throw new Error(`User with email ${email} not found`);
        }

        // Determinar plan_id baseado no price_id
        const priceId = subscription.items.data[0].price.id;
        let planId = "free";
        if (priceId === "price_1S6I7wBg6h6wj2YxfYHVZJnP") {
          planId = "premium_mensal_brl_149";
        } else if (priceId === "price_1S6I4ABg6h6wj2YxBSC3GoRx") {
          planId = "pro_mensal_brl_99";
        }

        // Update subscription
        const { error } = await supabaseClient
          .from("subscriptions")
          .upsert({
            user_id: user.id,
            stripe_customer_id: subscription.customer as string,
            stripe_subscription_id: subscription.id,
            stripe_price_id: priceId,
            plan_id: planId,
            status: subscription.status,
            trial_end: subscription.trial_end ? new Date(subscription.trial_end * 1000).toISOString() : null,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          }, {
            onConflict: "user_id"
          });

        if (error) {
          logStep("Error updating subscription", { error: error.message });
          throw error;
        }

        logStep("Subscription updated successfully", { userId: user.id, subscriptionId: subscription.id });
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        logStep("Processing customer.subscription.deleted", { subscriptionId: subscription.id });

        const { error } = await supabaseClient
          .from("subscriptions")
          .update({ status: "canceled" })
          .eq("stripe_subscription_id", subscription.id);

        if (error) {
          logStep("Error canceling subscription", { error: error.message });
          throw error;
        }

        logStep("Subscription canceled successfully", { subscriptionId: subscription.id });
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        logStep("Processing invoice.payment_failed", { invoiceId: invoice.id });

        if (invoice.subscription) {
          const { error } = await supabaseClient
            .from("subscriptions")
            .update({ status: "past_due" })
            .eq("stripe_subscription_id", invoice.subscription);

          if (error) {
            logStep("Error updating subscription to past_due", { error: error.message });
            throw error;
          }

          logStep("Subscription marked as past_due", { subscriptionId: invoice.subscription });
        }
        break;
      }

      default:
        logStep("Unhandled event type", { type: event.type });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR in stripe-webhook", { message: errorMessage });
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});