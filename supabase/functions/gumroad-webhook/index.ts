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
    const body = await req.text()
    console.log("Webhook body:", body)

    if (!body) {
      return new Response(JSON.stringify({ message: 'No body provided' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    // Verify the webhook secret
    const webhookSecret = req.headers.get("X-Gumroad-Hmac-Sha256")
    const secret = Deno.env.get("GUMROAD_WEBHOOK_SECRET")
    if (!secret) {
      console.warn("Gumroad webhook secret not set.")
    }

    if (secret && webhookSecret) {
      const encoder = new TextEncoder()
      const key = await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign", "verify"],
      )

      const signature = await crypto.subtle.sign(
        "HMAC",
        key,
        encoder.encode(body),
      )

      const expectedSignature = btoa(
        String.fromCharCode(...new Uint8Array(signature)),
      )

      if (expectedSignature !== webhookSecret) {
        return new Response(JSON.stringify({ message: 'Invalid signature' }), {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }
    } else {
      console.warn("Skipping webhook signature verification.")
    }

    const data = JSON.parse(body)
    console.log("Parsed webhook data:", data)

    // Extract user email and ID
    const userEmail = data?.custom_fields?.email || data?.customer?.email
    const userId = data?.custom_fields?.user_id

    if (!userEmail && !userId) {
      console.warn("No user email or ID found in webhook data.")
      return new Response(JSON.stringify({ message: 'No user email or ID found' }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      })
    }

    if (data.sale && data.sale.purchase_id) {
      const purchaseId = data.sale.purchase_id
      const productId = data.product_id
      const productName = data.product_name
      const eventType = data.event
      const subscriptionId = data.sale.subscription_id || null

      console.log(`Processing Gumroad webhook event: ${eventType} for purchase ID: ${purchaseId}, product: ${productName}`)

      // Determine subscription tier and billing cycle based on product
      let subscriptionTier = "free"
      let billingCycle = "monthly"

      if (productId === Deno.env.get("GUMROAD_PREMIUM_PRODUCT_ID")) {
        subscriptionTier = "premium"
        billingCycle = "monthly"
      } else if (productId === Deno.env.get("GUMROAD_PLATINUM_PRODUCT_ID")) {
        subscriptionTier = "platinum"
        billingCycle = "monthly"
      } else if (productId === Deno.env.get("GUMROAD_PREMIUM_YEARLY_PRODUCT_ID")) {
        subscriptionTier = "premium"
        billingCycle = "yearly"
      } else if (productId === Deno.env.get("GUMROAD_PLATINUM_YEARLY_PRODUCT_ID")) {
        subscriptionTier = "platinum"
        billingCycle = "yearly"
      }

      // Look up the user in the database
      let { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', userId)

      if (profileError) {
        console.error("Error fetching profile:", profileError)
        return new Response(JSON.stringify({ error: 'Error fetching profile' }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        })
      }

      let user_id = userId;

      if (!profiles || profiles.length === 0) {
        // If user doesn't exist, create a new profile
        const { data: newProfile, error: newProfileError } = await supabase
          .from('profiles')
          .insert({ id: userId, first_name: 'Gumroad User' })
          .select()
          .single()

        if (newProfileError) {
          console.error("Error creating profile:", newProfileError)
          return new Response(JSON.stringify({ error: 'Error creating profile' }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }
        user_id = newProfile.id;
        console.log("Created new profile for user:", user_id)
      }

      // Handle different Gumroad events
      if (data.event === 'sale.created') {
        // Create a new subscription
        const startDate = new Date().toISOString()
        let endDate = null

        if (billingCycle === "monthly") {
          endDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        } else if (billingCycle === "yearly") {
          endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        }

        const { data: newSubscription, error: newSubscriptionError } = await supabase
          .from('user_subscriptions')
          .insert({
            user_id: user_id,
            start_date: startDate,
            end_date: endDate,
            subscription_tier: subscriptionTier,
            billing_cycle: billingCycle,
            gumroad_purchase_id: purchaseId,
            gumroad_product_id: productId,
            gumroad_subscription_id: subscriptionId,
            status: 'active',
          })
          .select()
          .single()

        if (newSubscriptionError) {
          console.error("Error creating subscription:", newSubscriptionError)
          return new Response(JSON.stringify({ error: 'Error creating subscription' }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }

        console.log("Created new subscription:", newSubscription)
      } else if (data.event === 'sale.refunded') {
        // Mark the subscription as refunded
        const { data: updatedSubscription, error: updatedSubscriptionError } = await supabase
          .from('user_subscriptions')
          .update({ status: 'refunded' })
          .eq('gumroad_purchase_id', purchaseId)
          .select()
          .single()

        if (updatedSubscriptionError) {
          console.error("Error updating subscription:", updatedSubscriptionError)
          return new Response(JSON.stringify({ error: 'Error updating subscription' }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }

        console.log("Subscription marked as refunded:", updatedSubscription)
      } else if (data.event === 'subscription.cancelled') {
        // Mark the subscription as cancelled
        const { data: updatedSubscription, error: updatedSubscriptionError } = await supabase
          .from('user_subscriptions')
          .update({ status: 'cancelled', end_date: new Date().toISOString() })
          .eq('gumroad_subscription_id', subscriptionId)
          .select()
          .single()

        if (updatedSubscriptionError) {
          console.error("Error updating subscription:", updatedSubscriptionError)
          return new Response(JSON.stringify({ error: 'Error updating subscription' }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }

        console.log("Subscription marked as cancelled:", updatedSubscription)
      } else if (data.event === 'subscription.payment_success') {
        // Update the subscription end date
        let endDate = null

        if (billingCycle === "monthly") {
          endDate = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString()
        } else if (billingCycle === "yearly") {
          endDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString()
        }

        const { data: updatedSubscription, error: updatedSubscriptionError } = await supabase
          .from('user_subscriptions')
          .update({ status: 'active', end_date: endDate })
          .eq('gumroad_subscription_id', subscriptionId)
          .select()
          .single()

        if (updatedSubscriptionError) {
          console.error("Error updating subscription:", updatedSubscriptionError)
          return new Response(JSON.stringify({ error: 'Error updating subscription' }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          })
        }

        console.log("Subscription updated with new payment:", updatedSubscription)
      }

      // Check if this user was referred and update referral status
      if (userEmail) {
        try {
          // Find if this user was referred
          const { data: referralData } = await supabase
            .from('referrals')
            .select('*')
            .eq('referred_user_id', userId)
            .eq('status', 'pending')
            .single()

          if (referralData) {
            // Mark referral as successful
            await supabase
              .from('referrals')
              .update({
                status: 'successful',
                converted_at: new Date().toISOString(),
                subscription_purchase_id: data.sale.purchase_id
              })
              .eq('id', referralData.id)

            console.log('Referral marked as successful:', referralData.id)

            // Check and grant referral rewards to the referrer
            await supabase.rpc('check_referral_rewards', {
              referrer_id: referralData.referrer_user_id
            })

            console.log('Checked referral rewards for:', referralData.referrer_user_id)
          }
        } catch (referralError) {
          console.error('Error processing referral:', referralError)
          // Don't fail the webhook if referral processing fails
        }
      }

      return new Response(
        JSON.stringify({ message: 'Webhook processed successfully' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      )
    } else if (data.event === 'license_key.created') {
      // Handle license key creation (if needed)
      console.log("License key created:", data)
      return new Response(
        JSON.stringify({ message: 'License key created event processed' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      )
    } else {
      // Log unknown events
      console.warn("Unknown Gumroad event:", data.event)
      return new Response(
        JSON.stringify({ message: 'Unknown event' }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 },
      )
    }
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})
