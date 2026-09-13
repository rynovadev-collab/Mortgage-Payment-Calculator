import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const logStep = (step: string, details?: any) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[PROCESS-REFUND] ${step}${detailsStr}`);
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    logStep("Function started");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError) throw new Error(`Authentication error: ${userError.message}`);
    const adminUser = userData.user;
    logStep("Admin authenticated", { adminId: adminUser.id });

    const { requestId, action, adminNotes } = await req.json();
    if (!requestId || !action || !['approve', 'reject'].includes(action)) {
      throw new Error("Invalid request parameters");
    }
    logStep("Request validated", { requestId, action });

    // Get refund request
    const { data: refundRequest, error: fetchError } = await supabaseClient
      .from('refund_requests')
      .select('*')
      .eq('id', requestId)
      .single();

    if (fetchError) throw fetchError;
    if (!refundRequest) throw new Error("Refund request not found");
    logStep("Refund request found", { requestId: refundRequest.id });

    // Calculate days since subscription start
    const subscriptionStart = new Date(refundRequest.subscription_start_date);
    const now = new Date();
    const daysSinceStart = Math.floor((now.getTime() - subscriptionStart.getTime()) / (1000 * 60 * 60 * 24));
    logStep("Calculated days since subscription start", { daysSinceStart });

    // Enforce 14-day cooling-off period
    if (daysSinceStart > 14 && action === 'approve') {
      throw new Error(`Cannot approve refund: subscription is ${daysSinceStart} days old (cooling-off period is 14 days)`);
    }

    if (action === 'reject') {
      // Just update status to rejected
      const { error: updateError } = await supabaseClient
        .from('refund_requests')
        .update({
          status: 'rejected',
          admin_notes: adminNotes,
          processed_by: adminUser.id,
          processed_at: new Date().toISOString(),
        })
        .eq('id', requestId);

      if (updateError) throw updateError;
      logStep("Refund request rejected");

      return new Response(
        JSON.stringify({ success: true, message: "Refund request rejected" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Process refund in Stripe
    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const refund = await stripe.refunds.create({
      payment_intent: refundRequest.stripe_payment_intent_id,
      reason: 'requested_by_customer',
    });
    logStep("Refund created in Stripe", { refundId: refund.id, amount: refund.amount });

    // Cancel subscription if not already cancelled (for end_of_period requests)
    if (refundRequest.request_type === 'end_of_period') {
      try {
        await stripe.subscriptions.cancel(refundRequest.stripe_subscription_id);
        logStep("Subscription cancelled");
      } catch (e) {
        logStep("Subscription already cancelled or not found");
      }
    }

    // Update refund request status
    const { error: updateError } = await supabaseClient
      .from('refund_requests')
      .update({
        status: 'processed',
        admin_notes: adminNotes,
        processed_by: adminUser.id,
        processed_at: new Date().toISOString(),
      })
      .eq('id', requestId);

    if (updateError) throw updateError;
    logStep("Refund request marked as processed");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Refund processed successfully",
        refundId: refund.id,
        amount: refund.amount / 100,
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