
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1"

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

// Gumroad product IDs with permalinks
const GUMROAD_PRODUCTS = {
  "premium-monthly": "https://garbaverse.gumroad.com/l/ylaia",
  "premium-yearly": "https://garbaverse.gumroad.com/l/dencp",
  "platinum-monthly": "https://garbaverse.gumroad.com/l/tbfapo",
  "platinum-yearly": "https://garbaverse.gumroad.com/l/dcfjt",
}

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

    // Get the product from the query params
    const url = new URL(req.url)
    const productId = url.searchParams.get("product")

    if (!productId || !GUMROAD_PRODUCTS[productId]) {
      return new Response(
        JSON.stringify({ error: "Invalid product" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Get the user profile to include name in checkout
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("id", user.id)
      .single()

    if (profileError) {
      console.error("Error fetching profile:", profileError)
    }

    // Construct the checkout URL with pre-filled data
    const checkoutUrl = new URL(GUMROAD_PRODUCTS[productId])
    
    // Add optional params for custom fields
    const params = new URLSearchParams()
    params.append("email", user.email || "")
    
    if (profile) {
      if (profile.first_name) params.append("first_name", profile.first_name)
      if (profile.last_name) params.append("last_name", profile.last_name)
    }
    
    // Return the checkout URL
    return new Response(
      JSON.stringify({ 
        checkoutUrl: `${checkoutUrl.toString()}?${params.toString()}`,
        price: getPriceFromProductId(productId)
      }),
      { 
        status: 200, 
        headers: { 
          ...corsHeaders, 
          "Content-Type": "application/json" 
        } 
      }
    )
  } catch (error) {
    console.error("Error generating checkout URL:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})

// Helper function to get price from product ID
function getPriceFromProductId(productId: string): number {
  switch (productId) {
    case "premium-monthly":
      return 10;
    case "premium-yearly":
      return 99;
    case "platinum-monthly":
      return 18;
    case "platinum-yearly":
      return 180;
    default:
      return 0;
  }
}
