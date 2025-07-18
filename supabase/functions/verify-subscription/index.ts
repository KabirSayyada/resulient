
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

    // Log for debugging
    console.log("Verifying subscription for user:", user.id, "Requested tier:", requestedTier);

    // Query directly for active subscriptions that haven't expired
    const now = new Date().toISOString();
    const { data: subscription, error: subError } = await supabase
      .from("user_subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .or(`end_date.is.null,end_date.gt.${now}`)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    // Log subscription data for debugging
    console.log("Subscription data:", subscription, "Error:", subError);

    // Determine subscription status
    let hasAccess = false
    let subscriptionTier = "free"
    let expiresAt = null
    
    if (subscription) {
      subscriptionTier = subscription.subscription_tier
      expiresAt = subscription.end_date
      
      // Check if a specific tier was requested
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
      
      console.log("Subscription is active. Has access:", hasAccess, "Tier:", subscriptionTier);
    } else {
      // No active subscription found
      console.log("No active subscription found for user ID:", user.id);
      hasAccess = false
    }

    // Get daily limits based on subscription tier
    const limits = getDailyLimits(subscriptionTier)

    // Add cache control headers to prevent caching
    return new Response(
      JSON.stringify({
        hasAccess,
        tier: subscriptionTier,
        expiresAt,
        limits,
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        } 
      }
    )
  } catch (error) {
    console.error("Error verifying subscription:", error)
    
    return new Response(
      JSON.stringify({ 
        error: error.message,
        tier: "free",  // Default to free tier on error
        hasAccess: false,
        limits: getDailyLimits("free")
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        } 
      }
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
        resumeScorings: 0, // No free resume scoring
        resumeOptimizations: 0, // No free resume optimization
        reportDownloads: 0,
      }
  }
}
