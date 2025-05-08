
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1"

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const appUrl = Deno.env.get("APP_URL") || "https://resulient.com"
const supabase = createClient(supabaseUrl, supabaseKey)

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Helper function to safely parse a date string
function safeParseDate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error("Error parsing date:", error);
    return null;
  }
}

// Helper function to map Gumroad product codes to subscription tiers
function getSubscriptionTier(productCode: string): { tier: string; cycle: string } {
  const productMap: Record<string, { tier: string; cycle: string }> = {
    // Premium Monthly
    "ylaia": { tier: "premium", cycle: "monthly" },
    "premium-monthly": { tier: "premium", cycle: "monthly" },
    
    // Premium Yearly
    "dencp": { tier: "premium", cycle: "yearly" },
    "premium-yearly": { tier: "premium", cycle: "yearly" },
    
    // Platinum Monthly
    "tbfapo": { tier: "platinum", cycle: "monthly" },
    "platinum-monthly": { tier: "platinum", cycle: "monthly" },
    
    // Platinum Yearly
    "dcfjt": { tier: "platinum", cycle: "yearly" },
    "platinum-yearly": { tier: "platinum", cycle: "yearly" },
  };
  
  return productMap[productCode] || { tier: "premium", cycle: "monthly" };
}

// Helper function to find a user by email
async function findUserByEmail(email: string): Promise<string | null> {
  try {
    console.log("Looking up user by email:", email);
    
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    });
    
    if (error) {
      console.error("Error querying users:", error);
      return null;
    }
    
    const user = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    
    if (user) {
      console.log("Found user ID for email:", user.id);
      return user.id;
    }
    
    console.log("No user found with email:", email);
    return null;
  } catch (error) {
    console.error("Error finding user by email:", error);
    return null;
  }
}

// Date helper functions
function addOneYear(date: Date): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + 1);
  return result;
}

function addOneMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
}

// Simple redirect HTML
function getRedirectHtml(redirectUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  <title>Redirecting...</title>
</head>
<body>
  <p>Redirecting to <a href="${redirectUrl}">${redirectUrl}</a>...</p>
  <script>window.location.href = "${redirectUrl}";</script>
</body>
</html>
  `;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    console.log("Received webhook request:", req.method, req.url);
    
    // Parse the webhook payload as JSON - Gumroad always sends JSON
    let payload;
    try {
      payload = await req.json();
      console.log("Received webhook payload:", JSON.stringify(payload));
    } catch (error) {
      console.error("Error parsing JSON payload:", error);
      // If JSON parsing fails, try to get the raw text
      const text = await req.text();
      console.log("Raw payload text:", text);
      throw new Error("Failed to parse webhook payload as JSON");
    }
    
    // Verify this is a Gumroad webhook with required fields
    if (!payload.email || !payload.sale_id) {
      console.error("Invalid webhook payload - missing required fields");
      throw new Error("Invalid webhook payload - missing required fields");
    }
    
    // Extract the product code (permalink is the product code in Gumroad)
    const productCode = payload.permalink || payload.short_product_id || "";
    console.log("Product code:", productCode);
    
    // Get subscription details based on product code
    const { tier, cycle } = getSubscriptionTier(productCode);
    console.log("Subscription tier:", tier, "cycle:", cycle);
    
    // Find the user associated with this email
    const userEmail = payload.email;
    if (!userEmail) {
      throw new Error("No email address provided in webhook payload");
    }
    
    const userId = await findUserByEmail(userEmail);
    
    if (!userId) {
      console.error("Could not find user with email:", userEmail);
      // Create notification record even if user is not found
      await supabase
        .from("subscription_notifications")
        .insert({
          email: userEmail,
          purchase_id: payload.sale_id,
          product_code: productCode,
          processed: false,
          user_id: null,
        });
      
      throw new Error("Could not find user with email: " + userEmail);
    }
    
    // Parse the sale timestamp
    const saleTimestamp = safeParseDate(payload.sale_timestamp || new Date().toISOString());
    if (!saleTimestamp) {
      throw new Error("Invalid sale timestamp: " + payload.sale_timestamp);
    }
    
    // Calculate subscription end date
    let endDate: Date;
    if (cycle === "yearly") {
      endDate = addOneYear(saleTimestamp);
    } else {
      endDate = addOneMonth(saleTimestamp);
    }
    
    console.log("Creating subscription record:", {
      user_id: userId,
      subscription_tier: tier,
      billing_cycle: cycle,
      start_date: saleTimestamp.toISOString(),
      end_date: endDate.toISOString(),
      sale_id: payload.sale_id
    });
    
    // Create a subscription record in the database
    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .insert({
        user_id: userId,
        subscription_tier: tier,
        billing_cycle: cycle,
        status: "active",
        start_date: saleTimestamp.toISOString(),
        end_date: endDate.toISOString(),
        gumroad_product_id: payload.product_id,
        gumroad_purchase_id: payload.sale_id,
        gumroad_subscription_id: payload.subscription_id,
        last_webhook_event: payload.resource_name
      })
      .select("*")
      .single();
      
    if (error) {
      console.error("Error creating subscription:", error);
      throw new Error("Failed to create subscription: " + error.message);
    }
    
    console.log("Created subscription:", subscription);
    
    // Create a notification record for tracking
    await supabase
      .from("subscription_notifications")
      .insert({
        email: userEmail,
        purchase_id: payload.sale_id,
        product_code: productCode,
        processed: true,
        user_id: userId,
      });
    
    // Return a success response with redirect
    const redirectUrl = payload.success_url || 
                       `${appUrl}/subscription-success?product=${productCode}`;
    
    console.log("Redirecting to:", redirectUrl);
    
    return new Response(
      getRedirectHtml(redirectUrl),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/html",
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Location": redirectUrl
        } 
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    // Even on error, return a success response to Gumroad
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { 
        status: 200,  // Still return 200 to Gumroad
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json"
        } 
      }
    );
  }
})
