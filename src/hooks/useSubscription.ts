
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
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

  // Direct database check for subscription status
  const checkSubscriptionInDatabase = useCallback(async () => {
    if (!user) return null;
    
    try {
      // Query the user_subscriptions table directly
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .lte('start_date', new Date().toISOString())
        .or(`end_date.is.null,end_date.gt.${new Date().toISOString()}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking subscription in database:", error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error("Exception checking subscription:", error);
      return null;
    }
  }, [user]);

  const verifySubscription = useCallback(async () => {
    if (!user) {
      setSubscription(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      // First, check subscription directly in the database
      const dbSubscription = await checkSubscriptionInDatabase();
      
      // If we found an active subscription in the database, use that data
      if (dbSubscription) {
        console.log("Found active subscription in database:", dbSubscription);
        
        // Determine tier limits
        const tierLimits = getTierLimits(dbSubscription.subscription_tier as SubscriptionTier);
        
        setSubscription({
          tier: dbSubscription.subscription_tier as SubscriptionTier,
          hasAccess: true,
          isLoading: false,
          expiresAt: dbSubscription.end_date,
          limits: tierLimits,
          billingCycle: dbSubscription.billing_cycle as BillingCycle,
          purchaseId: dbSubscription.gumroad_purchase_id,
          status: dbSubscription.status,
        });
        return;
      }
      
      // As a fallback, check with the verify-subscription edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSubscription(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const queryParams = requiredTier ? `?tier=${requiredTier}` : '';
      
      console.log("No subscription found in DB, verifying with edge function for user:", user.id);
      
      const response = await supabase.functions.invoke<{
        hasAccess: boolean;
        tier: SubscriptionTier;
        expiresAt: string | null;
        limits: SubscriptionLimits;
      }>('verify-subscription' + queryParams, {
        // Add a cache-busting timestamp to prevent caching issues
        headers: {
          'Cache-Control': 'no-cache',
          'X-Timestamp': Date.now().toString()
        }
      });

      if (response.error) {
        console.error("Error verifying subscription:", response.error);
        // Don't show toast to improve user experience
        setSubscription(prev => ({ ...prev, isLoading: false }));
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

      console.log("Subscription data:", subData, "Response data:", response.data);

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
  }, [user, requiredTier, toast, checkSubscriptionInDatabase]);

  useEffect(() => {
    verifySubscription();
  }, [verifySubscription, location.pathname]);

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

  const refreshSubscription = () => {
    console.log("Refreshing subscription...");
    setSubscription(prev => ({ ...prev, isLoading: true }));
    verifySubscription();
  };

  return {
    subscription,
    checkout,
    refreshSubscription
  };
}

// Helper function to get the tier limits based on the subscription tier
function getTierLimits(tier: SubscriptionTier): SubscriptionLimits {
  switch (tier) {
    case "platinum":
      return {
        resumeScorings: -1, // unlimited
        resumeOptimizations: -1, // unlimited
        reportDownloads: -1, // unlimited
      };
    case "premium":
      return {
        resumeScorings: -1, // unlimited
        resumeOptimizations: -1, // unlimited
        reportDownloads: 10,
      };
    case "free":
    default:
      return {
        resumeScorings: 3,
        resumeOptimizations: 2,
        reportDownloads: 0,
      };
  }
}
