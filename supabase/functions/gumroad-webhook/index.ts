
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

// Helper function to parse payload from different formats
async function parsePayload(req: Request): Promise<Record<string, any>> {
  const contentType = req.headers.get("content-type") || ""
  const rawBody = await req.text()
  console.log("Raw body received:", rawBody)
  
  try {
    // Try to parse as JSON
    if (contentType.includes("application/json")) {
      return JSON.parse(rawBody)
    } 
    // Parse form data
    else if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = new URLSearchParams(rawBody)
      return Object.fromEntries(formData.entries())
    } 
    // Last resort - try JSON anyway
    else {
      try {
        return JSON.parse(rawBody)
      } catch {
        // If JSON parsing fails, try to parse as form data
        const formData = new URLSearchParams(rawBody)
        return Object.fromEntries(formData.entries())
      }
    }
  } catch (error) {
    console.error("Failed to parse payload:", error)
    
    // Check if this is a test ping (special case)
    if (rawBody.includes("ping") || rawBody.toLowerCase().includes("test")) {
      return { ping: true }
    }
    
    throw new Error("Could not parse webhook payload")
  }
}

// Helper function to identify subscription tier
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
    console.log("No email provided to search for user")
    return null
  }
  
  try {
    console.log(`Searching for user with email: ${email}`)
    
    const { data, error } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000
    })
    
    if (error) {
      console.error("Error querying users:", error)
      return null
    }
    
    const user = data.users.find(u => u.email?.toLowerCase() === email.toLowerCase())
    
    if (user) {
      console.log(`Found user ID ${user.id} for email ${email}`)
      return user.id
    }
    
    console.log(`No user found with email: ${email}`)
    return null
  } catch (error) {
    console.error("Error finding user by email:", error)
    return null
  }
}

// Date handling helpers
function addDuration(date: Date, cycle: string): Date {
  const result = new Date(date)
  if (cycle === "yearly") {
    result.setFullYear(result.getFullYear() + 1)
  } else {
    result.setMonth(result.getMonth() + 1)
  }
  return result
}

// Log request with an ID for traceability
function createRequestLogger(requestId: string) {
  return (message: string, data?: any) => {
    const logMessage = `[${requestId}] ${message}`
    if (data) {
      console.log(logMessage, JSON.stringify(data))
    } else {
      console.log(logMessage)
    }
  }
}

serve(async (req: Request) => {
  // Generate a unique ID for this request for tracing in logs
  const requestId = crypto.randomUUID()
  const log = createRequestLogger(requestId)
  
  log(`Received ${req.method} request to ${req.url}`)
  log("Headers", Object.fromEntries(req.headers.entries()))
  
  // Handle CORS preflight request
  if (req.method === "OPTIONS") {
    log("Handling CORS preflight request")
    return new Response(null, { 
      status: 204, 
      headers: corsHeaders 
    })
  }
  
  try {
    // Parse the webhook payload
    const payload = await parsePayload(req)
    log("Parsed payload", payload)
    
    // Check for test ping
    if (payload.ping === "true" || payload.ping === true || 
        payload.test === "true" || payload.test === true) {
      log("Received test ping from Gumroad")
      
      // Create a record of the test ping
      try {
        await supabase
          .from("subscription_notifications")
          .insert({
            email: "test@ping.com",
            purchase_id: "test_ping_" + new Date().toISOString(),
            product_code: "test_ping",
            processed: true,
            user_id: null,
          })
        
        log("Created test ping notification record")
      } catch (error) {
        log(`Error recording test ping: ${error.message}`)
      }
      
      return new Response(
        JSON.stringify({ 
          status: "success", 
          message: "Test ping received successfully" 
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
    
    // Required fields check for regular webhook
    const userEmail = payload.email
    if (!userEmail) {
      log("Invalid webhook payload - missing email field")
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Missing required field: email" 
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
    
    // Get sale/purchase ID
    const saleId = payload.sale_id || payload.purchase_id || 
                  payload.subscription_id || payload.id
    if (!saleId) {
      log("Invalid webhook payload - missing sale/purchase ID")
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Missing required ID field" 
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
    
    // Extract the product code
    const productCode = payload.permalink || payload.product_permalink || 
                       payload.product_id || payload.short_product_id || ""
    log(`Product code: ${productCode}`)
    
    // Get subscription tier details
    const { tier, cycle } = getSubscriptionTier(productCode)
    log(`Subscription tier: ${tier}, cycle: ${cycle}`)
    
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
      log(`Error creating notification record: ${notificationError.message}`)
    } else {
      log("Created notification record", notificationData)
    }
    
    // If user not found, we can't proceed with subscription updates
    if (!userId) {
      log(`Could not find user with email: ${userEmail}`)
      return new Response(
        JSON.stringify({ 
          status: "warning", 
          message: "Webhook received but user not found",
          email: userEmail,
          product: productCode
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
    
    // Parse the timestamp
    const timestamp = payload.sale_timestamp || payload.created_at || 
                     payload.purchase_time || new Date().toISOString()
    const saleTimestamp = new Date(timestamp)
    if (isNaN(saleTimestamp.getTime())) {
      log(`Invalid sale timestamp: ${timestamp}`)
      saleTimestamp.setTime(Date.now()) // Default to current time if invalid
    }
    
    // Calculate subscription end date
    const endDate = addDuration(saleTimestamp, cycle)
    
    // Get the event type
    const event = payload.event || payload.resource_name || payload.action || "sale"
    log(`Event type: ${event}`)
    
    // Handle different webhook events
    if (event === "subscription_cancelled" || event === "refund" || 
        event === "dispute" || event === "charge_refunded") {
      log(`Handling cancellation/refund event: ${event}`)
      
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
        log(`Error cancelling subscription: ${error.message}`)
        return new Response(
          JSON.stringify({ 
            status: "error", 
            message: "Failed to cancel subscription", 
            error: error.message 
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
      
      log("Successfully cancelled subscription", data)
      return new Response(
        JSON.stringify({ 
          status: "success", 
          message: "Subscription cancelled successfully" 
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
    log("Creating/updating subscription", {
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
      log(`Error creating/updating subscription: ${error.message}`)
      return new Response(
        JSON.stringify({ 
          status: "error", 
          message: "Failed to create/update subscription", 
          error: error.message 
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
    
    log("Successfully processed webhook", subscription)
    
    // Return success response
    return new Response(
      JSON.stringify({ 
        status: "success", 
        message: "Webhook processed successfully",
        subscription_id: subscription?.id
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
    console.error(`[${requestId}] Unhandled error:`, error)
    
    // Always return a 200 response to Gumroad, even on error
    return new Response(
      JSON.stringify({ 
        status: "error", 
        message: "Internal server error", 
        error: error.message 
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
