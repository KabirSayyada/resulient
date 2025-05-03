
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
      resource_name,
      url_params
    } = body;
    
    // Get success URL from url_params if available
    let successUrl = `${APP_URL}/subscription-success`;
    
    // Try to get product code from url_params for redirect
    let redirectProductCode = null;
    
    // Check if url_params exists and contains success_url
    if (url_params && url_params.success_url) {
      // Direct access if it's already a string
      successUrl = url_params.success_url;
    } else if (body["url_params[success_url]"]) {
      // Form data format: url_params[success_url]
      successUrl = body["url_params[success_url]"];
    }

    // Extract product code from success URL if present
    const urlProductMatch = successUrl.match(/[?&]product=([^&]+)/);
    if (urlProductMatch && urlProductMatch[1]) {
      redirectProductCode = urlProductMatch[1];
    }
    
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
      productCode = permalinkMatch ? permalinkMatch[1] : permalink;
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
    
    // Query auth.users directly using service role
    console.log("Looking up user by email in auth.users:", userEmail);
    const { data: authUserData, error: authUserError } = await supabase.auth.admin.listUsers({
      filters: {
        email: userEmail
      }
    });
    
    if (authUserError || !authUserData || authUserData.users.length === 0) {
      console.error("Error finding user by email:", authUserError);
      return new Response(
        JSON.stringify({ error: "User not found", email: userEmail }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }
    
    const supabaseUserId = authUserData.users[0].id;
    console.log("Found user ID for email:", supabaseUserId);
    
    // Check if subscription already exists for this purchase
    const { data: existingSub, error: lookupError } = await supabase
      .from("user_subscriptions")
      .select("id, status")
      .eq("gumroad_purchase_id", purchase_id)
      .maybeSingle()
      
    let result;
    
    // Calculate end date safely
    const calculateEndDate = (cycle) => {
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
          gumroad_purchase_id: purchase_id,
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
      const endDate = calculateEndDate(cycle);
      
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
    
    // Use the product code from the URL parameters for redirection if available
    // This ensures we redirect to the right product page
    const redirectWithProduct = redirectProductCode || productCode;
    const fullRedirectUrl = `${APP_URL}/subscription-success?product=${redirectWithProduct}`;
    
    console.log("Redirecting to:", fullRedirectUrl);
    
    // Create HTML response with auto-redirect
    if (req.headers.get("Accept")?.includes("text/html")) {
      // If this is accessed directly in a browser, redirect immediately
      const htmlResponse = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Redirecting to Resulient</title>
            <meta http-equiv="refresh" content="0; URL=${fullRedirectUrl}">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <script>
              // Direct browser to redirect immediately
              window.location.href = "${fullRedirectUrl}";
            </script>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
                line-height: 1.4;
                max-width: 800px;
                margin: 20px auto;
                padding: 0 20px;
                color: #333;
                background-color: #f9f9f9;
                text-align: center;
              }
              h1 { color: #4338ca; }
              p { margin: 1em 0; }
              .redirect-box {
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                padding: 20px;
                margin-top: 30px;
              }
              .btn {
                display: inline-block;
                background-color: #4338ca;
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                text-decoration: none;
                margin-top: 20px;
                border: none;
                cursor: pointer;
              }
            </style>
          </head>
          <body>
            <div class="redirect-box">
              <h1>Your purchase was successful!</h1>
              <p>You're being redirected to Resulient. If you aren't redirected automatically, please click the button below.</p>
              <a href="${fullRedirectUrl}" class="btn">Continue to Resulient</a>
            </div>
          </body>
        </html>
      `;
      
      return new Response(htmlResponse, { 
        status: 200,
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/html",
          "Location": fullRedirectUrl 
        } 
      });
    }
    
    // Default JSON response for API clients
    return new Response(
      JSON.stringify({ 
        success: true, 
        data: result,
        redirectUrl: fullRedirectUrl
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Location": fullRedirectUrl 
        } 
      }
    )
  } catch (error) {
    console.error("Error processing webhook:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
