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
      resumeScorings: 0, // No free resume scoring
      resumeOptimizations: 0, // No free resume optimization
      reportDownloads: 0,
    }
  });

  // Track if we already called verifySubscription to prevent loops
  const [verificationAttempted, setVerificationAttempted] = useState(false);

  // Direct database check for subscription status
  const checkSubscriptionInDatabase = useCallback(async () => {
    if (!user) return null;
    
    try {
      console.log("Checking database subscription for user:", user.id);
      
      // Query the user_subscriptions table directly with explicit conditions
      const now = new Date().toISOString();
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .or(`end_date.is.null,end_date.gt.${now}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error("Error checking subscription in database:", error);
        return null;
      }
      
      if (data) {
        console.log("Found active subscription in database:", data);
      } else {
        console.log("No active subscription found in database for user:", user.id);
      }
      
      return data;
    } catch (error) {
      console.error("Exception checking subscription:", error);
      return null;
    }
  }, [user]);

  const verifySubscription = useCallback(async () => {
    // Don't proceed if there's no user
    if (!user) {
      setSubscription(prev => ({ ...prev, isLoading: false }));
      setVerificationAttempted(true);
      return;
    }

    try {
      // First, check subscription directly in the database
      const dbSubscription = await checkSubscriptionInDatabase();
      
      // If we found an active subscription in the database, use that data
      if (dbSubscription) {
        console.log("Using subscription from database:", dbSubscription);
        
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
        setVerificationAttempted(true);
        return;
      }
      
      // As a fallback, check with the verify-subscription edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setSubscription(prev => ({ ...prev, isLoading: false }));
        setVerificationAttempted(true);
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
        setSubscription(prev => ({ ...prev, isLoading: false }));
        setVerificationAttempted(true);
        return;
      }

      // Get additional subscription details if we have a paid tier
      let subData = null;
      if (response.data.tier !== "free") {
        const { data } = await supabase
          .from('user_subscriptions')
          .select('billing_cycle, gumroad_purchase_id, status')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle();
          
        subData = data;
      }

      console.log("Setting subscription from edge function. Tier:", response.data.tier, 
                 "Extra data:", subData, "Response:", response.data);

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
      setVerificationAttempted(true);
    } catch (error) {
      console.error("Error in subscription verification:", error);
      setSubscription(prev => ({ ...prev, isLoading: false }));
      setVerificationAttempted(true);
    }
  }, [user, requiredTier, checkSubscriptionInDatabase]);

  useEffect(() => {
    // Only call verifySubscription if we haven't attempted it yet
    // or when location changes (page navigation)
    if (!verificationAttempted || location.pathname !== location.pathname) {
      verifySubscription();
    }
  }, [verifySubscription, location.pathname, verificationAttempted]);

  const checkout = async (productId: string) => {
    try {
      setSubscription(prev => ({ ...prev, isLoading: true }));
      
      // Use Paystack for new checkouts
      const response = await supabase.functions.invoke<{
        checkoutUrl: string;
        reference: string;
        amount: number;
      }>('paystack-checkout', {
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
    setVerificationAttempted(false); // Reset the flag to allow verification again
    // The useEffect will pick up this change and call verifySubscription
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
        resumeScorings: 0, // No free resume scoring
        resumeOptimizations: 0, // No free resume optimization
        reportDownloads: 0,
      };
  }
}
