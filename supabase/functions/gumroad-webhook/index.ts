
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1"

// Environment variables
const supabaseUrl = Deno.env.get("SUPABASE_URL")
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
const supabase = createClient(supabaseUrl || "", supabaseKey || "")

// CORS headers for the API
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

// Helper function to parse webhook payload from different formats
async function parsePayload(req: Request): Promise<Record<string, any>> {
  const contentType = req.headers.get("content-type") || ""
  const rawBody = await req.text()
  console.log(`[gumroad-webhook] Raw payload received:`, rawBody)
  
  try {
    // Try parsing based on content type
    if (contentType.includes("application/json")) {
      return JSON.parse(rawBody)
    } 
    else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = new URLSearchParams(rawBody)
      return Object.fromEntries(formData.entries())
    } 
    else {
      // Try JSON first, fall back to form data
      try {
        return JSON.parse(rawBody)
      } catch {
        const formData = new URLSearchParams(rawBody)
        return Object.fromEntries(formData.entries())
      }
    }
  } catch (error) {
    console.error(`[gumroad-webhook] Failed to parse payload:`, error)
    
    // Check if this is a test ping
    if (rawBody.includes("ping") || rawBody.toLowerCase().includes("test")) {
      console.log(`[gumroad-webhook] Detected test ping`)
      return { ping: true }
    }
    
    throw new Error("Could not parse webhook payload")
  }
}

// Helper function to determine subscription tier from product code
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
  }
  
  return productMap[productCode] || { tier: "premium", cycle: "monthly" }
}

// Helper function to find a user by email
async function findUserByEmail(email: string): Promise<string | null> {
  if (!email) {
    console.log(`[gumroad-webhook] No email provided to search for user`)
    return null
  }
  
  try {
    console.log(`[gumroad-webhook] Searching for user with email: ${email}`)
    
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    })
    
    if (error) {
      console.error(`[gumroad-webhook] Error querying users:`, error)
      return null
    }
    
    const user = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (user) {
      console.log(`[gumroad-webhook] Found user ID ${user.id} for email ${email}`)
      return user.id
    }
    
    console.log(`[gumroad-webhook] No user found with email: ${email}`)
    return null
  } catch (error) {
    console.error(`[gumroad-webhook] Error finding user by email:`, error)
    return null
  }
}

// Date handling helper
function addDuration(date: Date, cycle: string): Date {
  const result = new Date(date)
  if (cycle === "yearly") {
    result.setFullYear(result.getFullYear() + 1)
  } else {
    result.setMonth(result.getMonth() + 1)
  }
  return result
}

// Create a request ID for traceability in logs
function generateRequestId(): string {
  return crypto.randomUUID()
}

serve(async (req: Request) => {
  // Generate a unique request ID for tracing
  const requestId = generateRequestId()
  
  console.log(`[gumroad-webhook] [${requestId}] Received ${req.method} request`)
  console.log(`[gumroad-webhook] [${requestId}] Headers:`, 
    Object.fromEntries(req.headers.entries()))
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log(`[gumroad-webhook] [${requestId}] Handling CORS preflight request`)
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    })
  }
  
  try {
    // Parse the webhook payload
    const payload = await parsePayload(req)
    console.log(`[gumroad-webhook] [${requestId}] Parsed payload:`, payload)
    
    // Check for test ping
    if (payload.ping === "true" || payload.ping === true || 
        payload.test === "true" || payload.test === true) {
      console.log(`[gumroad-webhook] [${requestId}] Received test ping from Gumroad`)
      
      // Create a record of the test ping
      try {
        await supabase
          .from("subscription_notifications")
          .insert({
            email: "test@ping.com",
            purchase_id: `test_ping_${requestId}`,
            product_code: "test_ping",
            processed: true,
            user_id: null,
          })
        
        console.log(`[gumroad-webhook] [${requestId}] Created test ping notification record`)
      } catch (error) {
        console.error(`[gumroad-webhook] [${requestId}] Error recording test ping:`, error)
      }
      
      return new Response(
        JSON.stringify({ 
          status: "success", 
          message: "Test ping received successfully",
          requestId
        }),
        { 
          status: 200, 
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      )
    }
    
    // Check for required fields
    const userEmail = payload.email
    if (!userEmail) {
      console.log(`[gumroad-webhook] [${requestId}] Invalid webhook payload - missing email field`)
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Missing required field: email",
          requestId 
        }),
        { 
          status: 200, // Return 200 so Gumroad doesn't retry
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      )
    }
    
    // Extract sale/purchase ID from various possible fields
    const saleId = payload.sale_id || payload.purchase_id || 
                  payload.subscription_id || payload.id || 
                  payload.resource_id
                  
    if (!saleId) {
      console.log(`[gumroad-webhook] [${requestId}] Invalid webhook payload - missing sale/purchase ID`)
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Missing required ID field",
          requestId 
        }),
        { 
          status: 200, // Return 200 so Gumroad doesn't retry
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      )
    }
    
    // Extract the product code from various possible fields
    const productCode = payload.permalink || payload.product_permalink || 
                       payload.product_id || payload.short_product_id || ""
    console.log(`[gumroad-webhook] [${requestId}] Product code: ${productCode}`)
    
    // Get subscription tier details
    const { tier, cycle } = getSubscriptionTier(productCode)
    console.log(`[gumroad-webhook] [${requestId}] Subscription tier: ${tier}, cycle: ${cycle}`)
    
    // Find the user associated with this email
    const userId = await findUserByEmail(userEmail)
    
    // Always create notification record regardless of user match
    const { data: notificationData, error: notificationError } = await supabase
      .from("subscription_notifications")
      .insert({
        email: userEmail,
        purchase_id: saleId,
        product_code: productCode,
        processed: userId !== null,
        user_id: userId,
      })
      .select()
      .single()
    
    if (notificationError) {
      console.error(`[gumroad-webhook] [${requestId}] Error creating notification record:`, notificationError)
    } else {
      console.log(`[gumroad-webhook] [${requestId}] Created notification record:`, notificationData)
    }
    
    // If user not found, we can't proceed with subscription updates
    if (!userId) {
      console.log(`[gumroad-webhook] [${requestId}] Could not find user with email: ${userEmail}`)
      return new Response(
        JSON.stringify({ 
          status: "warning", 
          message: "Webhook received but user not found",
          email: userEmail,
          product: productCode,
          requestId
        }),
        { 
          status: 200, // Return 200 so Gumroad doesn't retry
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      )
    }
    
    // Parse the timestamp from various possible fields
    const timestamp = payload.sale_timestamp || payload.created_at || 
                     payload.purchase_time || new Date().toISOString()
    const saleTimestamp = new Date(timestamp)
    if (isNaN(saleTimestamp.getTime())) {
      console.log(`[gumroad-webhook] [${requestId}] Invalid sale timestamp: ${timestamp}, using current time`)
      saleTimestamp.setTime(Date.now())
    }
    
    // Calculate subscription end date
    const endDate = addDuration(saleTimestamp, cycle)
    
    // Get the event type from various possible fields
    const event = payload.event || payload.resource_name || payload.action || "sale"
    console.log(`[gumroad-webhook] [${requestId}] Event type: ${event}`)
    
    // Handle different webhook events
    if (event === "subscription_cancelled" || event === "refund" || 
        event === "dispute" || event === "charge_refunded" ||
        event.includes("cancel")) {
      console.log(`[gumroad-webhook] [${requestId}] Handling cancellation/refund event: ${event}`)
      
      const { data, error } = await supabase
        .from("user_subscriptions")
        .update({ 
          status: "cancelled",
          updated_at: new Date().toISOString(),
          last_webhook_event: event
        })
        .eq("gumroad_purchase_id", saleId)
        .select()
        .single()
        
      if (error) {
        console.error(`[gumroad-webhook] [${requestId}] Error cancelling subscription:`, error)
        return new Response(
          JSON.stringify({ 
            status: "error", 
            message: "Failed to cancel subscription", 
            error: error.message,
            requestId
          }),
          { 
            status: 200, // Return 200 so Gumroad doesn't retry
            headers: { 
              ...corsHeaders, 
              "Content-Type": "application/json" 
            } 
          }
        )
      }
      
      console.log(`[gumroad-webhook] [${requestId}] Successfully cancelled subscription:`, data)
      return new Response(
        JSON.stringify({ 
          status: "success", 
          message: "Subscription cancelled successfully",
          requestId
        }),
        { 
          status: 200,
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      )
    }
    
    // For new sales or renewals, update/create subscription
    console.log(`[gumroad-webhook] [${requestId}] Creating/updating subscription:`, {
      user_id: userId,
      subscription_tier: tier,
      billing_cycle: cycle,
      start_date: saleTimestamp.toISOString(),
      end_date: endDate.toISOString(),
      sale_id: saleId
    })
    
    const { data: subscription, error } = await supabase
      .from("user_subscriptions")
      .upsert({
        user_id: userId,
        subscription_tier: tier,
        billing_cycle: cycle,
        status: "active",
        start_date: saleTimestamp.toISOString(),
        end_date: endDate.toISOString(),
        gumroad_product_id: productCode,
        gumroad_purchase_id: saleId,
        gumroad_subscription_id: payload.subscription_id || null,
        last_webhook_event: event
      })
      .select()
      .single()
      
    if (error) {
      console.error(`[gumroad-webhook] [${requestId}] Error creating/updating subscription:`, error)
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Failed to create/update subscription", 
          error: error.message,
          requestId
        }),
        { 
          status: 200, // Return 200 so Gumroad doesn't retry
          headers: { 
            ...corsHeaders, 
            "Content-Type": "application/json" 
          } 
        }
      )
    }
    
    console.log(`[gumroad-webhook] [${requestId}] Successfully processed webhook:`, subscription)
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        status: "success", 
        message: "Webhook processed successfully",
        subscription_id: subscription?.id,
        requestId
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate"
        } 
      }
    )
  } catch (error) {
    console.error(`[gumroad-webhook] [${requestId}] Unhandled error:`, error)
    
    // Always return a 200 response to Gumroad, even on error
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: "Internal server error", 
        error: error.message,
        requestId
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    )
  }
})
