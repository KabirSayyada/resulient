
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1"

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// CORS headers
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Get the JWT from the request
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Verify the JWT token
    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Check requested tier from query parameter (optional)
    const url = new URL(req.url)
    const requestedTier = url.searchParams.get("tier")

    // Get the user's active subscription
    const { data: subscription, error: subError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    // Determine subscription status
    let hasAccess = false
    let subscriptionTier = "free"
    let expiresAt = null
    
    if (subscription) {
      subscriptionTier = subscription.subscription_tier
      expiresAt = subscription.end_date
      
      // Check if the subscription has expired
      if (expiresAt && new Date(expiresAt) < new Date()) {
        // Subscription has expired
        hasAccess = false
      } else {
        // If a specific tier was requested, check if the user has access to that tier
        if (requestedTier) {
          if (requestedTier === "premium") {
            // Premium tier requires premium or platinum subscription
            hasAccess = ["premium", "platinum"].includes(subscriptionTier)
          } else if (requestedTier === "platinum") {
            // Platinum tier requires platinum subscription
            hasAccess = subscriptionTier === "platinum"
          }
        } else {
          // No specific tier requested, user has access if they have any active subscription
          hasAccess = true
        }
      }
    } else {
      // No active subscription found
      hasAccess = false
    }

    // Get daily limits based on subscription tier
    const limits = getDailyLimits(subscriptionTier)

    return new Response(
      JSON.stringify({
        hasAccess,
        tier: subscriptionTier,
        expiresAt,
        limits,
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    )
  } catch (error) {
    console.error("Error verifying subscription:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

// Helper function to get daily limits based on subscription tier
function getDailyLimits(tier: string) {
  switch (tier) {
    case "platinum":
      return {
        resumeScorings: -1, // unlimited
        resumeOptimizations: -1, // unlimited
        reportDownloads: -1, // unlimited
      }
    case "premium":
      return {
        resumeScorings: -1, // unlimited
        resumeOptimizations: -1, // unlimited
        reportDownloads: 10,
      }
    case "free":
    default:
      return {
        resumeScorings: 3,
        resumeOptimizations: 2,
        reportDownloads: 0,
      }
  }
}
