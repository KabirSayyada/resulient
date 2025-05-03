
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
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
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
    // Query auth.users directly to find user by email
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000 // Adjust based on expected number of users
    });
    
    if (error) {
      console.error("Error querying users:", error);
      return null;
    }
    
    // Find the user with the matching email
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

// Helper function to add 1 year to a date
function addOneYear(date: Date): Date {
  const result = new Date(date);
  result.setFullYear(result.getFullYear() + 1);
  return result;
}

// Helper function to add 1 month to a date
function addOneMonth(date: Date): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
}

// Enhanced HTML template for immediate redirect
function getRedirectHtml(redirectUrl: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Redirecting to Resulient...</title>
  <meta http-equiv="refresh" content="0;url=${redirectUrl}">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100vh;
      margin: 0;
      background: linear-gradient(to bottom right, #eef2ff, #e0e7ff);
      color: #4338ca;
      text-align: center;
      padding: 0 20px;
    }
    .logo {
      font-size: 2.5rem;
      font-weight: 800;
      margin-bottom: 1rem;
      background: linear-gradient(to right, #4338ca, #6366f1, #ec4899);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
    }
    .container {
      background-color: white;
      padding: 2rem;
      border-radius: 0.75rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      max-width: 500px;
      width: 100%;
    }
    .message {
      font-size: 1.125rem;
      margin-bottom: 1.5rem;
    }
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border-left-color: #4338ca;
      animation: spin 1s linear infinite;
      margin: 0 auto 1.5rem auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Resulient</div>
    <div class="spinner"></div>
    <div class="message">Payment successful! Redirecting you now...</div>
    <p>If you're not redirected automatically, <a href="${redirectUrl}">click here</a>.</p>
  </div>
  
  <script>
    // Immediate redirect
    window.location.href = "${redirectUrl}";
  </script>
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
    // Log that we received a webhook
    console.log("Received webhook");
    
    // Process webhook payload
    const formData = await req.formData();
    console.log("Received form data:", formData);
    
    // Convert FormData to a regular object
    const payload: Record<string, string> = {};
    for (const [key, value] of formData.entries()) {
      payload[key] = value.toString();
    }
    
    console.log("Processed webhook payload:", JSON.stringify(payload));
    
    // Extract the product code from the permalink
    const productCode = payload.permalink || payload.short_product_id || "";
    console.log("Extracted product code:", productCode);
    
    // Get subscription details based on product code
    const { tier, cycle } = getSubscriptionTier(productCode);
    
    // Find the user associated with this email
    const userEmail = payload.email;
    if (!userEmail) {
      throw new Error("No email address provided in webhook payload");
    }
    
    console.log("Looking up user by email in auth.users:", userEmail);
    const userId = await findUserByEmail(userEmail);
    
    if (!userId) {
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
    
    // Get the success URL from the payload or use default with product code
    const redirectUrl = payload["url_params[success_url]"] || 
                       `${appUrl}/subscription-success?product=${productCode}`;
    console.log("Redirecting to:", redirectUrl);
    
    // Return an HTML page that will IMMEDIATELY redirect the user to the success page
    return new Response(
      getRedirectHtml(redirectUrl),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/html",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        } 
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    // Even on error, return a success response to Gumroad with redirect
    // But include an HTML page with error information for debugging
    return new Response(
      getRedirectHtml(`${appUrl}/subscription-success`),
      { 
        status: 200,  // Still return 200 to Gumroad
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/html",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        } 
      }
    );
  }
})
