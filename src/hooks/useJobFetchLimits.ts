
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface JobFetchLimits {
  used: number;
  limit: number;
  hasReachedLimit: boolean;
  canFetch: boolean;
}

export const useJobFetchLimits = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const [limits, setLimits] = useState<JobFetchLimits>({
    used: 0,
    limit: 1,
    hasReachedLimit: false,
    canFetch: false
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkUsage = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      // Get lifetime job fetch count
      const { data: fetchCount } = await supabase.rpc('get_user_total_usage_count', {
        p_user_id: user.id,
        p_feature_type: 'job_fetching'
      });

      // Set limits based on subscription tier
      let limit = 1; // Free tier - 1 lifetime fetch
      let canFetch = true;

      if (subscription.tier === "premium") {
        limit = 20; // Premium - 20 fetches total
      } else if (subscription.tier === "platinum") {
        limit = -1; // Platinum - unlimited
      }

      const used = fetchCount || 0;
      const hasReachedLimit = limit !== -1 && used >= limit;

      // For non-premium/platinum users, they can only access if they haven't used their limit
      if (subscription.tier === "free") {
        canFetch = !hasReachedLimit;
      } else {
        canFetch = true; // Premium and Platinum can always access (but may have fetch limits)
      }

      setLimits({
        used,
        limit,
        hasReachedLimit,
        canFetch
      });
    } catch (error) {
      console.error("Error checking job fetch limits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementUsage = async () => {
    if (!user) return;
    
    try {
      await supabase.rpc('increment_user_usage', {
        p_user_id: user.id,
        p_feature_type: 'job_fetching'
      });
      await checkUsage(); // Refresh usage after increment
    } catch (error) {
      console.error("Error incrementing job fetch usage:", error);
    }
  };

  const showUpgradeMessage = () => {
    if (subscription.tier === "free") {
      toast({
        title: "Upgrade Required",
        description: "You've used your free job fetch. Upgrade to Premium for 20 fetches or Platinum for unlimited access.",
        variant: "destructive",
      });
    } else if (subscription.tier === "premium") {
      toast({
        title: "Fetch Limit Reached",
        description: "You've used all 20 job fetches. Upgrade to Platinum for unlimited access.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    checkUsage();
  }, [user, subscription.tier]);

  return {
    limits,
    isLoading,
    checkUsage,
    incrementUsage,
    showUpgradeMessage
  };
};
