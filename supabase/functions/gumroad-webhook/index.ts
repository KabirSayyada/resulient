
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1"

// Supabase client setup with service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// App URL for redirects
const APP_URL = Deno.env.get("APP_URL") || "https://resulient.com"

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Define subscription tiers and product IDs
const PRODUCT_TIERS = {
  // Premium Monthly
  "ylaia": { tier: "premium", cycle: "monthly" },
  // Premium Yearly
  "dencp": { tier: "premium", cycle: "yearly" },
  // Platinum Monthly
  "tbfapo": { tier: "platinum", cycle: "monthly" },
  // Platinum Yearly
  "dcfjt": { tier: "platinum", cycle: "yearly" },
}

// Map Gumroad event names to our subscription status
const EVENT_TO_STATUS = {
  "sale": "active",
  "refund": "refunded",
  "subscription_cancelled": "canceled",
  "subscription_updated": "active",
  "subscription_restarted": "active",
  "subscription_failed": "failed",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get("X-Gumroad-Signature") || ""
    
    // For logging during development/debugging
    console.log("Received webhook with signature:", signature)
    
    // Determine content type and parse body accordingly
    const contentType = req.headers.get("content-type") || ""
    
    let formData;
    let body;
    
    if (contentType.includes("application/json")) {
      // Handle JSON data
      body = await req.json();
      console.log("Received JSON payload:", JSON.stringify(body));
    } else if (contentType.includes("application/x-www-form-urlencoded")) {
      // Handle form data
      formData = await req.formData();
      console.log("Received form data:", formData);
      
      // Convert form data to object
      body = {};
      for (const [key, value] of formData.entries()) {
        body[key] = value;
      }
    } else {
      // Try to get text body as a fallback
      const textBody = await req.text();
      console.log("Received raw text:", textBody);
      
      // Parse URL-encoded form data manually
      const params = new URLSearchParams(textBody);
      body = {};
      for (const [key, value] of params.entries()) {
        body[key] = value;
      }
    }
    
    console.log("Processed webhook payload:", JSON.stringify(body));
    
    // Extract fields from the body
    const {
      product_id,
      permalink,
      product_permalink,
      price,
      recurrence,
      purchaser_id,
      purchase_id,
      subscriber_id,
      user_id,
      user_email,
      sale_id,
      refunded,
      sale_timestamp,
      event,
      seller_id
    } = body;
    
    // Verify this is from our Gumroad account
    if (seller_id && seller_id !== "pdzGrB3urFjHJyCfq4fMFg==") {
      console.error("Invalid seller ID:", seller_id);
      return new Response(
        JSON.stringify({ error: "Invalid seller" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the product short code from permalink
    let productCode;
    if (permalink) {
      const permalinkMatch = permalink.match(/\/l\/([^\/]+)/);
      productCode = permalinkMatch ? permalinkMatch[1] : null;
    } else if (product_permalink) {
      const permalinkMatch = product_permalink.match(/\/l\/([^\/]+)/);
      productCode = permalinkMatch ? permalinkMatch[1] : null;
    }
    
    if (!productCode || !PRODUCT_TIERS[productCode]) {
      console.error("Unknown product code:", productCode);
      return new Response(
        JSON.stringify({ error: "Unknown product" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Get subscription details from product code
    const { tier, cycle } = PRODUCT_TIERS[productCode]
    
    // Get status from event name
    const status = EVENT_TO_STATUS[event] || "active"
    
    // Get Supabase user ID from email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", user_email)
      .maybeSingle()
      
    if (userError || !userData) {
      console.error("Error finding user by email:", userError);
      
      // Try querying auth.users directly using service role
      const { data: authUserData, error: authUserError } = await supabase.auth.admin.listUsers({
        filters: {
          email: user_email
        }
      });
      
      if (authUserError || !authUserData || authUserData.users.length === 0) {
        console.error("Error finding user in auth.users:", authUserError);
        return new Response(
          JSON.stringify({ error: "User not found" }),
          { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        )
      }
      
      var supabaseUserId = authUserData.users[0].id;
    } else {
      var supabaseUserId = userData.id;
    }
    
    console.log("Found user ID for email:", supabaseUserId);
    
    // Check if subscription already exists for this purchase
    const { data: existingSub, error: lookupError } = await supabase
      .from("user_subscriptions")
      .select("id, status")
      .eq("gumroad_purchase_id", purchase_id)
      .maybeSingle()
      
    let result;
    
    if (existingSub) {
      // Update existing subscription
      const { data, error } = await supabase
        .from("user_subscriptions")
        .update({
          status,
          subscription_tier: tier,
          billing_cycle: cycle,
          gumroad_subscription_id: subscriber_id,
          gumroad_product_id: product_id,
          last_webhook_event: event,
          updated_at: new Date().toISOString(),
          // Set end_date for canceled/refunded subscriptions
          ...(status === "canceled" || status === "refunded" 
            ? { end_date: new Date().toISOString() } 
            : {}),
        })
        .eq("id", existingSub.id)
        .select()
        .single()
        
      if (error) {
        console.error("Error updating subscription:", error);
        throw error;
      }
      
      result = data;
      console.log("Updated subscription:", result);
    } else {
      // Create new subscription
      const { data, error } = await supabase
        .from("user_subscriptions")
        .insert({
          user_id: supabaseUserId,
          subscription_tier: tier,
          billing_cycle: cycle,
          status,
          gumroad_purchase_id: purchase_id,
          gumroad_subscription_id: subscriber_id,
          gumroad_product_id: product_id,
          last_webhook_event: event,
          start_date: sale_timestamp ? new Date(Number(sale_timestamp) * 1000).toISOString() : new Date().toISOString(),
          // Calculate end_date for yearly subscriptions (1 year from now)
          ...(cycle === "yearly" 
            ? { end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() } 
            : // Calculate end_date for monthly subscriptions (1 month from now)
              cycle === "monthly" 
              ? { end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() } 
              : {}),
        })
        .select()
        .single()
        
      if (error) {
        console.error("Error creating subscription:", error);
        throw error;
      }
      
      result = data;
      console.log("Created subscription:", result);
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result,
        redirectUrl: `${APP_URL}/subscription-success?product=${productCode}`
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
