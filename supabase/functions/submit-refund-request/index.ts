import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SUBMIT-REFUND-REQUEST] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const user = userData.user;
    if (!user?.email) throw new Error("User not authenticated");
    logStep("User authenticated", { userId: user.id, email: user.email });

    const { requestType, reason } = await req.json();
    if (!requestType || !['immediate', 'end_of_period'].includes(requestType)) {
      throw new Error("Invalid request type");
    }
    logStep("Request data validated", { requestType, reason });

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find customer
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    if (customers.data.length === 0) {
      throw new Error("No Stripe customer found");
    }
    const customerId = customers.data[0].id;
    logStep("Found customer", { customerId });

    // Get active subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      throw new Error("No active subscription found");
    }

    const subscription = subscriptions.data[0];
    logStep("Found subscription", { subscriptionId: subscription.id });

    // Get the latest invoice to find payment intent
    const latestInvoice = await stripe.invoices.retrieve(subscription.latest_invoice as string);
    const paymentIntentId = latestInvoice.payment_intent as string;
    logStep("Found payment intent", { paymentIntentId });

    // Calculate subscription start date (first invoice)
    const subscriptionStartDate = new Date(subscription.created * 1000);
    logStep("Subscription start date", { subscriptionStartDate: subscriptionStartDate.toISOString() });

    // If immediate cancellation requested, cancel in Stripe
    if (requestType === 'immediate') {
      await stripe.subscriptions.cancel(subscription.id);
      logStep("Subscription cancelled in Stripe");
    }

    // Create refund request in database
    const { data: refundRequest, error: insertError } = await supabaseClient
      .from('refund_requests')
      .insert({
        user_id: user.id,
        stripe_subscription_id: subscription.id,
        stripe_payment_intent_id: paymentIntentId,
        request_type: requestType,
        subscription_start_date: subscriptionStartDate.toISOString(),
        reason: reason || null,
        refund_amount: latestInvoice.amount_paid / 100, // Convert from cents
      })
      .select()
      .single();

    if (insertError) throw insertError;
    logStep("Refund request created", { requestId: refundRequest.id });

    return new Response(
      JSON.stringify({
        success: true,
        requestId: refundRequest.id,
        message: requestType === 'immediate' 
          ? "Subscription cancelled and refund request submitted"
          : "Cancellation scheduled for end of billing period"
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});