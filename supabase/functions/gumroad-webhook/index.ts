
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1"

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// CORS headers for API responses
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

serve(async (req) => {
  // Generate a unique request ID for tracking this request through logs
  const requestId = crypto.randomUUID();
  console.log(`[${requestId}] Received request: ${req.method} ${req.url}`);
  console.log(`[${requestId}] Request headers:`, JSON.stringify(Object.fromEntries(req.headers.entries())));
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[${requestId}] Handling CORS preflight request`);
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Log raw request details first
    console.log(`[${requestId}] Processing ${req.method} request to ${req.url}`);
    
    let payload;
    let rawText = "";
    
    try {
      // Try to parse the webhook payload
      rawText = await req.text();
      console.log(`[${requestId}] Raw payload received:`, rawText);
      
      // Try to parse as JSON first
      try {
        payload = JSON.parse(rawText);
        console.log(`[${requestId}] Successfully parsed JSON payload:`, JSON.stringify(payload));
      } catch (jsonError) {
        console.log(`[${requestId}] Not valid JSON, trying to parse as form data...`);
        
        // If JSON parsing fails, check if it's form data
        const formData = new URLSearchParams(rawText);
        
        // Check if this looks like form data by checking for common Gumroad fields
        if (formData.has("email") || formData.has("sale_id") || formData.has("product_id") || formData.has("ping")) {
          // Convert form data to JSON object
          payload = Object.fromEntries(formData.entries());
          console.log(`[${requestId}] Successfully parsed form data:`, JSON.stringify(payload));
        } else {
          console.error(`[${requestId}] Could not parse payload as JSON or form data`);
          console.log(`[${requestId}] Form data entries:`, Array.from(formData.entries()));
          
          // This might be a test ping with a different format
          if (rawText.includes("ping") || rawText.toLowerCase().includes("test")) {
            console.log(`[${requestId}] Detected possible test ping:`, rawText);
            return new Response(
              JSON.stringify({ status: "success", message: "Test ping received" }),
              { 
                status: 200, 
                headers: { 
                  ...corsHeaders, 
                  "Content-Type": "application/json"
                } 
              }
            );
          }
          
          throw new Error("Could not parse payload as JSON or form data");
        }
      }
    } catch (parseError) {
      console.error(`[${requestId}] Failed to parse payload:`, parseError);
      
      // If this is a test ping, still return success
      if (rawText.includes("ping") || rawText.toLowerCase().includes("test")) {
        console.log(`[${requestId}] Treating as test ping despite parse error`);
        return new Response(
          JSON.stringify({ status: "success", message: "Test ping received" }),
          { 
            status: 200, 
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json"
            } 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ status: "error", message: "Failed to parse webhook payload" }),
        { 
          status: 200, // Still return 200 to Gumroad
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json"
          } 
        }
      );
    }
    
    // Check for test ping
    if (payload.ping === "true" || payload.ping === true || payload.test === "true" || payload.test === true) {
      console.log(`[${requestId}] Received test ping from Gumroad`);
      
      // For test pings, create a notification record
      try {
        await supabase
          .from("subscription_notifications")
          .insert({
            email: "test@ping.com",
            purchase_id: "test_ping",
            product_code: "test_ping",
            processed: true,
            user_id: null,
          });
        console.log(`[${requestId}] Created test ping notification record`);
      } catch (dbError) {
        console.error(`[${requestId}] Error recording test ping:`, dbError);
      }
      
      return new Response(
        JSON.stringify({ status: "success", message: "Test ping received" }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json"
          } 
        }
      );
    }
    
    // Log the event type if it exists
    const eventName = payload.event || payload.resource_name;
    console.log(`[${requestId}] Event type: ${eventName || "unknown"}`);
    
    // Verify this is a Gumroad webhook with required fields
    if (!payload.email) {
      console.error(`[${requestId}] Invalid webhook payload - missing email field`);
      return new Response(
        JSON.stringify({ status: "error", message: "Missing required field: email" }),
        { 
          status: 200, // Still return 200 to Gumroad
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json"
          } 
        }
      );
    }
    
    const saleId = payload.sale_id || payload.purchase_id || payload.subscription_id;
    if (!saleId) {
      console.error(`[${requestId}] Invalid webhook payload - missing sale/purchase/subscription ID`);
      return new Response(
        JSON.stringify({ status: "error", message: "Missing required ID field" }),
        { 
          status: 200, // Still return 200 to Gumroad
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json"
          } 
        }
      );
    }
    
    // Extract the product code (permalink is the product code in Gumroad)
    const productCode = payload.permalink || payload.product_permalink || payload.short_product_id || "";
    console.log(`[${requestId}] Product code:`, productCode);
    
    // Get subscription details based on product code
    const { tier, cycle } = getSubscriptionTier(productCode);
    console.log(`[${requestId}] Subscription tier: ${tier}, cycle: ${cycle}`);
    
    // Find the user associated with this email
    const userEmail = payload.email;
    if (!userEmail) {
      console.error(`[${requestId}] No email address provided in webhook payload`);
      return new Response(
        JSON.stringify({ status: "error", message: "No email address provided" }),
        { 
          status: 200, // Still return 200 to Gumroad
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json"
          } 
        }
      );
    }
    
    const userId = await findUserByEmail(userEmail);
    
    // Create notification record even if user is not found
    await supabase
      .from("subscription_notifications")
      .insert({
        email: userEmail,
        purchase_id: saleId,
        product_code: productCode,
        processed: userId !== null,
        user_id: userId,
      });
    
    console.log(`[${requestId}] Created notification record for email: ${userEmail}`);
    
    if (!userId) {
      console.error(`[${requestId}] Could not find user with email: ${userEmail}`);
      return new Response(
        JSON.stringify({ 
          status: "warning", 
          message: "Webhook received but user not found",
          email: userEmail,
          product: productCode
        }),
        { 
          status: 200, // Still return 200 to Gumroad  
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json"
          } 
        }
      );
    }
    
    // Parse the sale timestamp
    const saleTimestamp = safeParseDate(payload.sale_timestamp || payload.created_at || new Date().toISOString());
    if (!saleTimestamp) {
      console.error(`[${requestId}] Invalid sale timestamp:`, payload.sale_timestamp);
      return new Response(
        JSON.stringify({ status: "error", message: "Invalid sale timestamp" }),
        { 
          status: 200, // Still return 200 to Gumroad
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json"
          } 
        }
      );
    }
    
    // Calculate subscription end date
    let endDate: Date;
    if (cycle === "yearly") {
      endDate = addOneYear(saleTimestamp);
    } else {
      endDate = addOneMonth(saleTimestamp);
    }
    
    console.log(`[${requestId}] Creating subscription record:`, {
      user_id: userId,
      subscription_tier: tier,
      billing_cycle: cycle,
      start_date: saleTimestamp.toISOString(),
      end_date: endDate.toISOString(),
      sale_id: saleId
    });
    
    // Handle different webhook events
    const event = payload.event || payload.resource_name;
    
    // Handle subscription cancellation
    if (event === "subscription_cancelled" || event === "refund") {
      console.log(`[${requestId}] Handling cancellation/refund event:`, event);
      
      const { error } = await supabase
        .from("user_subscriptions")
        .update({ 
          status: "cancelled",
          updated_at: new Date().toISOString(),
          last_webhook_event: event
        })
        .eq("gumroad_purchase_id", saleId);
        
      if (error) {
        console.error(`[${requestId}] Error cancelling subscription:`, error);
        return new Response(
          JSON.stringify({ status: "error", message: "Failed to cancel subscription" }),
          { 
            status: 200, // Still return 200 to Gumroad
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json"
            } 
          }
        );
      }
      
      console.log(`[${requestId}] Successfully cancelled subscription for user:`, userId);
      return new Response(
        JSON.stringify({ status: "success", message: "Subscription cancelled" }),
        { 
          status: 200,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json"
          } 
        }
      );
    }
    
    // For subscription renewals or new sales, create/update subscription
    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        subscription_tier: tier,
        billing_cycle: cycle,
        status: "active",
        start_date: saleTimestamp.toISOString(),
        end_date: endDate.toISOString(),
        gumroad_product_id: payload.product_id,
        gumroad_purchase_id: saleId,
        gumroad_subscription_id: payload.subscription_id,
        last_webhook_event: event
      })
      .select("*")
      .maybeSingle();
      
    if (error) {
      console.error(`[${requestId}] Error creating/updating subscription:`, error);
      return new Response(
        JSON.stringify({ status: "error", message: "Failed to create subscription" }),
        { 
          status: 200, // Still return 200 to Gumroad
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json"
          } 
        }
      );
    }
    
    console.log(`[${requestId}] Successfully processed webhook. Subscription:`, subscription);
    
    // Return a simple success response
    return new Response(
      JSON.stringify({ 
        status: "success", 
        message: "Webhook processed successfully",
        subscription_id: subscription?.id || null
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate"
        } 
      }
    );
  } catch (error) {
    console.error(`[${requestId}] Error processing webhook:`, error);
    
    // Even on error, return a success response to Gumroad
    return new Response(
      JSON.stringify({ status: "error", message: error.message }),
      { 
        status: 200, // Still return 200 to Gumroad
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json"
        } 
      }
    );
  }
})
