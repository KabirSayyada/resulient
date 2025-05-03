
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
      short_product_id,
      purchaser_id,
      purchase_id,
      subscriber_id,
      user_id,
      user_email,
      email,
      sale_id,
      refunded,
      sale_timestamp,
      event,
      seller_id,
      resource_name
    } = body;
    
    // Use resource_name as event if event is not provided
    const eventName = event || resource_name || "sale";
    
    // Verify this is from our Gumroad account
    if (seller_id && seller_id !== "pdzGrB3urFjHJyCfq4fMFg==") {
      console.error("Invalid seller ID:", seller_id);
      return new Response(
        JSON.stringify({ error: "Invalid seller" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract the product short code - try multiple possible sources
    let productCode = short_product_id || null;
    
    // If direct short_product_id not available, try to extract from permalinks
    if (!productCode && permalink) {
      const permalinkMatch = permalink.match(/\/l\/([^\/]+)/);
      productCode = permalinkMatch ? permalinkMatch[1] : null;
    } 
    
    if (!productCode && product_permalink) {
      const permalinkMatch = product_permalink.match(/\/l\/([^\/]+)/);
      productCode = permalinkMatch ? permalinkMatch[1] : null;
    }
    
    // Last resort - extract directly if permalink is just the code
    if (!productCode && permalink && !permalink.includes('/')) {
      productCode = permalink;
    }
    
    console.log("Extracted product code:", productCode);
    
    if (!productCode || !PRODUCT_TIERS[productCode]) {
      console.error("Unknown product code:", productCode);
      return new Response(
        JSON.stringify({ error: "Unknown product", productCode, permalinkData: { permalink, product_permalink, short_product_id } }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Get subscription details from product code
    const { tier, cycle } = PRODUCT_TIERS[productCode]
    
    // Get status from event name
    const status = EVENT_TO_STATUS[eventName] || "active"
    
    // Get user email - could be in different fields depending on Gumroad's payload
    const userEmail = email || user_email;
    
    if (!userEmail) {
      console.error("No user email provided in webhook payload");
      return new Response(
        JSON.stringify({ error: "Missing user email" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    // Get Supabase user ID from email
    const { data: userData, error: userError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", userEmail)
      .maybeSingle()
      
    if (userError || !userData) {
      console.error("Error finding user by email:", userError);
      
      // Try querying auth.users directly using service role
      const { data: authUserData, error: authUserError } = await supabase.auth.admin.listUsers({
        filters: {
          email: userEmail
        }
      });
      
      if (authUserError || !authUserData || authUserData.users.length === 0) {
        console.error("Error finding user in auth.users:", authUserError);
        return new Response(
          JSON.stringify({ error: "User not found", email: userEmail }),
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
    
    // Calculate end date safely
    const calculateEndDate = (cycle, timestamp) => {
      try {
        const now = new Date();
        if (cycle === "yearly") {
          const endDate = new Date(now);
          endDate.setDate(now.getDate() + 365); // Add 1 year
          return endDate.toISOString();
        } else if (cycle === "monthly") {
          const endDate = new Date(now);
          endDate.setDate(now.getDate() + 30); // Add 30 days
          return endDate.toISOString();
        }
        return null;
      } catch (error) {
        console.error("Error calculating end date:", error);
        return null;
      }
    };
    
    // Parse timestamp safely
    const parseTimestamp = (timestampStr) => {
      try {
        if (!timestampStr) return new Date().toISOString();
        
        // Check if it's a numeric timestamp (seconds since epoch)
        if (/^\d+$/.test(timestampStr)) {
          return new Date(Number(timestampStr) * 1000).toISOString();
        }
        
        // Try parsing as ISO string
        return new Date(timestampStr).toISOString();
      } catch (error) {
        console.error("Error parsing timestamp:", error, "Using current time instead");
        return new Date().toISOString();
      }
    };
    
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
          last_webhook_event: eventName,
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
      const startDate = parseTimestamp(sale_timestamp);
      const endDate = calculateEndDate(cycle, startDate);
      
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
          last_webhook_event: eventName,
          start_date: startDate,
          end_date: endDate,
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
