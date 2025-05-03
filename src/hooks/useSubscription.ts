
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type SubscriptionTier = "free" | "premium" | "platinum";
export type BillingCycle = "monthly" | "yearly";

export interface SubscriptionLimits {
  resumeScorings: number;
  resumeOptimizations: number;
  reportDownloads: number;
}

export interface Subscription {
  tier: SubscriptionTier;
  hasAccess: boolean;
  isLoading: boolean;
  expiresAt: string | null;
  limits: SubscriptionLimits;
  billingCycle?: BillingCycle;
  purchaseId?: string;
  status?: string;
}

export function useSubscription(requiredTier?: SubscriptionTier) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [subscription, setSubscription] = useState<Subscription>({
    tier: "free",
    hasAccess: false,
    isLoading: true,
    expiresAt: null,
    limits: {
      resumeScorings: 3,
      resumeOptimizations: 2,
      reportDownloads: 0,
    }
  });

  useEffect(() => {
    if (!user) {
      setSubscription(prev => ({ ...prev, isLoading: false }));
      return;
    }

    async function verifySubscription() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const queryParams = requiredTier ? `?tier=${requiredTier}` : '';
        
        const response = await supabase.functions.invoke<{
          hasAccess: boolean;
          tier: SubscriptionTier;
          expiresAt: string | null;
          limits: SubscriptionLimits;
        }>('verify-subscription' + queryParams);

        if (response.error) {
          console.error("Error verifying subscription:", response.error);
          toast({
            title: "Subscription Error",
            description: "Failed to verify your subscription status. Please try again.",
            variant: "destructive",
          });
          return;
        }

        // Get additional subscription details
        const { data: subData } = await supabase
          .from('user_subscriptions')
          .select('billing_cycle, gumroad_purchase_id, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        setSubscription({
          tier: response.data.tier,
          hasAccess: response.data.hasAccess,
          isLoading: false,
          expiresAt: response.data.expiresAt,
          limits: response.data.limits,
          billingCycle: subData?.billing_cycle as BillingCycle,
          purchaseId: subData?.gumroad_purchase_id,
          status: subData?.status,
        });
      } catch (error) {
        console.error("Error in subscription verification:", error);
        setSubscription(prev => ({ ...prev, isLoading: false }));
      }
    }

    verifySubscription();
  }, [user, requiredTier, toast]);

  const checkout = async (productId: string) => {
    try {
      setSubscription(prev => ({ ...prev, isLoading: true }));
      
      const response = await supabase.functions.invoke<{
        checkoutUrl: string;
        price: number;
      }>('gumroad-checkout', {
        body: { productId }
      });

      if (response.error) {
        console.error("Error generating checkout URL:", response.error);
        toast({
          title: "Checkout Error",
          description: "Failed to start the checkout process. Please try again.",
          variant: "destructive",
        });
        setSubscription(prev => ({ ...prev, isLoading: false }));
        return null;
      }

      return response.data;
    } catch (error) {
      console.error("Error in checkout process:", error);
      setSubscription(prev => ({ ...prev, isLoading: false }));
      return null;
    }
  };

  return {
    subscription,
    checkout,
  };
}
