
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
    console.log("Looking up user by email:", email);
    
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
    .button {
      display: inline-block;
      background: linear-gradient(to right, #4f46e5, #7c3aed);
      color: white;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 0.375rem;
      text-decoration: none;
      margin-top: 1rem;
      transition: transform 0.2s;
    }
    .button:hover {
      transform: translateY(-1px);
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">Resulient</div>
    <div class="spinner"></div>
    <div class="message">Payment successful! Redirecting you now...</div>
    <p>If you're not redirected automatically, <a href="${redirectUrl}" class="button">Click here to continue</a>.</p>
  </div>
  
  <script>
    // Try multiple redirect approaches
    setTimeout(function() {
      window.location.href = "${redirectUrl}";
    }, 500);
    
    // Fallback approach with form submission
    setTimeout(function() {
      var form = document.createElement('form');
      form.method = 'GET';
      form.action = "${redirectUrl}";
      document.body.appendChild(form);
      form.submit();
    }, 1500);
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
    console.log("Received webhook request:", req.method, req.url);
    
    // Get request content type
    const contentType = req.headers.get("content-type") || "";
    console.log("Content-Type:", contentType);
    
    let payload: Record<string, string> = {};
    
    // Process webhook payload based on content type
    if (contentType.includes("application/json")) {
      // Handle JSON payload
      const jsonData = await req.json();
      console.log("Received JSON data:", JSON.stringify(jsonData));
      
      // Convert JSON to expected format
      if (typeof jsonData === "object" && jsonData !== null) {
        for (const [key, value] of Object.entries(jsonData)) {
          payload[key] = String(value);
        }
      }
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      // Handle form data
      try {
        const formData = await req.formData();
        console.log("Received form data");
        
        // Convert FormData to a regular object
        for (const [key, value] of formData.entries()) {
          payload[key] = value.toString();
        }
      } catch (error) {
        console.error("Error parsing form data:", error);
        // Try fallback to text parsing if formData fails
        const text = await req.text();
        console.log("Received text data:", text);
        
        // Parse URL-encoded form data
        if (text) {
          const params = new URLSearchParams(text);
          for (const [key, value] of params.entries()) {
            payload[key] = value;
          }
        }
      }
    } else {
      // Fallback to text parsing
      const text = await req.text();
      console.log("Received text data:", text);
      
      try {
        // Try to parse as JSON first
        const jsonData = JSON.parse(text);
        for (const [key, value] of Object.entries(jsonData)) {
          payload[key] = String(value);
        }
      } catch (jsonError) {
        // If not JSON, try as URL-encoded
        try {
          const params = new URLSearchParams(text);
          for (const [key, value] of params.entries()) {
            payload[key] = value;
          }
        } catch (urlError) {
          console.error("Failed to parse payload:", urlError);
          throw new Error("Could not parse webhook payload in any supported format");
        }
      }
    }
    
    console.log("Processed webhook payload:", JSON.stringify(payload));
    
    // Verify this is a Gumroad webhook
    if (!payload.email && !payload.sale_id && !payload.product_id) {
      console.error("Invalid webhook payload - missing required fields");
      throw new Error("Invalid webhook payload - not a valid Gumroad webhook");
    }
    
    // Extract the product code from the permalink or product_id
    const productCode = payload.permalink || payload.short_product_id || "";
    console.log("Extracted product code:", productCode);
    
    // Get subscription details based on product code
    const { tier, cycle } = getSubscriptionTier(productCode);
    console.log("Subscription details:", { tier, cycle });
    
    // Find the user associated with this email
    const userEmail = payload.email;
    if (!userEmail) {
      throw new Error("No email address provided in webhook payload");
    }
    
    console.log("Looking up user by email in auth.users:", userEmail);
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
    
    console.log("Creating subscription record with data:", {
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
    
    // Also create a notification record for tracking
    await supabase
      .from("subscription_notifications")
      .insert({
        email: userEmail,
        purchase_id: payload.sale_id,
        product_code: productCode,
        processed: true,
        user_id: userId,
      });
    
    // Get the success URL from the payload or use default with product code
    const redirectUrl = payload["url_params[success_url]"] || 
                      `${appUrl}/subscription-success?product=${productCode}`;
    console.log("Redirecting to:", redirectUrl);
    
    // For Gumroad, we need to return a simple 200 success response
    // But we'll add a Location header to attempt a redirect
    return new Response(
      getRedirectHtml(redirectUrl),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/html",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "Location": redirectUrl // Add redirect header as a fallback
        } 
      }
    );
  } catch (error) {
    console.error("Error processing webhook:", error);
    
    // Even on error, return a success response to Gumroad with redirect
    return new Response(
      getRedirectHtml(`${appUrl}/subscription-success`),
      { 
        status: 200,  // Still return 200 to Gumroad
        headers: { 
          ...corsHeaders, 
          "Content-Type": "text/html",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "Location": `${appUrl}/subscription-success` // Add redirect header as a fallback
        } 
      }
    );
  }
})
