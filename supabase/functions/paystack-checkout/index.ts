
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1"

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
}

interface CheckoutRequest {
  productId: string;
  email?: string;
}

const PRODUCT_PRICES = {
  "premium-monthly": { amount: 2000000, tier: "premium", cycle: "monthly", name: "Premium Monthly" }, // ₦20,000
  "premium-yearly": { amount: 20000000, tier: "premium", cycle: "yearly", name: "Premium Yearly" }, // ₦200,000
  "platinum-monthly": { amount: 5000000, tier: "platinum", cycle: "monthly", name: "Platinum Monthly" }, // ₦50,000
  "platinum-yearly": { amount: 50000000, tier: "platinum", cycle: "yearly", name: "Platinum Yearly" }, // ₦500,000
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get("Authorization")
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const token = authHeader.replace("Bearer ", "")
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const { productId, email }: CheckoutRequest = await req.json()

    if (!productId || !PRODUCT_PRICES[productId as keyof typeof PRODUCT_PRICES]) {
      return new Response(
        JSON.stringify({ error: "Invalid product ID" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    const product = PRODUCT_PRICES[productId as keyof typeof PRODUCT_PRICES]
    const userEmail = email || user.email || ""

    // Generate unique reference
    const reference = `res_${user.id.substring(0, 8)}_${Date.now()}`

    // Create transaction record
    const { error: dbError } = await supabase
      .from("paystack_transactions")
      .insert({
        user_id: user.id,
        reference,
        amount: product.amount,
        currency: "NGN",
        product_id: productId,
        subscription_tier: product.tier,
        billing_cycle: product.cycle,
        status: "pending"
      })

    if (dbError) {
      console.error("Database error:", dbError)
      return new Response(
        JSON.stringify({ error: "Failed to create transaction" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    // Initialize Paystack transaction
    const paystackResponse = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${paystackSecretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reference,
        amount: product.amount,
        email: userEmail,
        currency: "NGN",
        callback_url: `${Deno.env.get("APP_URL") || "http://localhost:3000"}/subscription-success?product=${productId}`,
        metadata: {
          user_id: user.id,
          product_id: productId,
          subscription_tier: product.tier,
          billing_cycle: product.cycle,
        },
      }),
    })

    const paystackData = await paystackResponse.json()

    if (!paystackResponse.ok || !paystackData.status) {
      console.error("Paystack error:", paystackData)
      return new Response(
        JSON.stringify({ error: "Failed to initialize payment" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      )
    }

    return new Response(
      JSON.stringify({
        checkoutUrl: paystackData.data.authorization_url,
        reference,
        amount: product.amount / 100, // Convert to naira for display
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )

  } catch (error) {
    console.error("Error in paystack-checkout:", error)
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    )
  }
})
