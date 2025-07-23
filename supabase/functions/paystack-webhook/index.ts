
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.43.1"
import { createHash } from "https://deno.land/std@0.168.0/hash/mod.ts"

const supabaseUrl = Deno.env.get("SUPABASE_URL") || ""
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || ""
const paystackSecretKey = Deno.env.get("PAYSTACK_SECRET_KEY") || ""
const supabase = createClient(supabaseUrl, supabaseKey)

serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get("x-paystack-signature")

    // Verify webhook signature
    const hash = createHash("sha512")
    hash.update(body)
    const expectedSignature = hash.toString("hex")

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature")
      return new Response("Invalid signature", { status: 400 })
    }

    const event = JSON.parse(body)
    console.log("Paystack webhook received:", event.event, event.data?.reference)

    if (event.event === "charge.success") {
      const { data } = event
      const reference = data.reference
      const amount = data.amount
      const status = data.status
      const authorization = data.authorization

      // Update transaction status
      const { data: transaction, error: transactionError } = await supabase
        .from("paystack_transactions")
        .update({
          status: status === "success" ? "completed" : "failed",
          paystack_transaction_id: data.id,
          authorization_code: authorization?.authorization_code,
          verified_at: new Date().toISOString(),
          metadata: data,
        })
        .eq("reference", reference)
        .select()
        .single()

      if (transactionError) {
        console.error("Error updating transaction:", transactionError)
        return new Response("Error updating transaction", { status: 500 })
      }

      if (status === "success" && transaction) {
        // Create or update user subscription
        const endDate = transaction.billing_cycle === "yearly"
          ? new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()

        const { error: subscriptionError } = await supabase
          .from("user_subscriptions")
          .insert({
            user_id: transaction.user_id,
            subscription_tier: transaction.subscription_tier,
            billing_cycle: transaction.billing_cycle,
            status: "active",
            start_date: new Date().toISOString(),
            end_date: endDate,
            payment_provider: "paystack",
            paystack_reference: reference,
          })

        if (subscriptionError) {
          console.error("Error creating subscription:", subscriptionError)
          // Try to update existing subscription instead
          const { error: updateError } = await supabase
            .from("user_subscriptions")
            .update({
              subscription_tier: transaction.subscription_tier,
              billing_cycle: transaction.billing_cycle,
              status: "active",
              start_date: new Date().toISOString(),
              end_date: endDate,
              payment_provider: "paystack",
              paystack_reference: reference,
            })
            .eq("user_id", transaction.user_id)

          if (updateError) {
            console.error("Error updating subscription:", updateError)
            return new Response("Error updating subscription", { status: 500 })
          }
        }

        console.log("Subscription activated successfully for user:", transaction.user_id)
      }
    }

    return new Response("Webhook processed", { status: 200 })

  } catch (error) {
    console.error("Error processing webhook:", error)
    return new Response("Internal server error", { status: 500 })
  }
})
