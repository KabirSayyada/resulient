
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface UsageLimits {
  resumeScorings: { used: number; limit: number; hasReachedLimit: boolean };
  resumeOptimizations: { used: number; limit: number; hasReachedLimit: boolean };
  resumeBuilding: { used: number; limit: number; hasReachedLimit: boolean };
}

export const useUsageLimits = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const [usage, setUsage] = useState<UsageLimits>({
    resumeScorings: { used: 0, limit: 3, hasReachedLimit: false }, // Updated to 3
    resumeOptimizations: { used: 0, limit: 1, hasReachedLimit: false },
    resumeBuilding: { used: 0, limit: 1, hasReachedLimit: false }
  });
  const [isLoading, setIsLoading] = useState(true);

  const checkUsage = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Get TOTAL resume scorings (not daily) for free tier
      let scoringCount = 0;
      if (subscription.tier === "free") {
        // For free tier, count all resume scorings ever
        const { count } = await supabase
          .from("resume_scores")
          .select("id", { count: 'exact', head: true })
          .eq("user_id", user.id);
        scoringCount = count || 0;
      } else {
        // For paid tiers, we don't need to count since they have unlimited
        scoringCount = 0;
      }

      // Get daily resume optimizations
      const { count: optimizationCount } = await supabase
        .from("resume_optimizations")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .gte("created_at", today.toISOString());

      // Get lifetime resume building count using the usage tracking table
      const { data: buildingData } = await supabase.rpc('get_user_total_usage_count', {
        p_user_id: user.id,
        p_feature_type: 'resume_building'
      });

      // Set limits based on subscription tier
      const limits = {
        resumeScorings: subscription.tier === "free" ? 3 : -1, // 3 total for free, unlimited for paid
        resumeOptimizations: subscription.tier === "free" ? 1 : -1, // unlimited for paid
        resumeBuilding: subscription.tier === "free" ? 1 : -1 // unlimited for paid
      };

      setUsage({
        resumeScorings: {
          used: scoringCount,
          limit: limits.resumeScorings,
          hasReachedLimit: limits.resumeScorings !== -1 && scoringCount >= limits.resumeScorings
        },
        resumeOptimizations: {
          used: optimizationCount || 0,
          limit: limits.resumeOptimizations,
          hasReachedLimit: limits.resumeOptimizations !== -1 && (optimizationCount || 0) >= limits.resumeOptimizations
        },
        resumeBuilding: {
          used: buildingData || 0,
          limit: limits.resumeBuilding,
          hasReachedLimit: limits.resumeBuilding !== -1 && (buildingData || 0) >= limits.resumeBuilding
        }
      });
    } catch (error) {
      console.error("Error checking usage limits:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkUsage();
  }, [user, subscription.tier]);

  const incrementUsage = async (featureType: 'resumeScorings' | 'resumeOptimizations' | 'resumeBuilding') => {
    await checkUsage(); // Refresh usage after action
  };

  const showLimitReachedMessage = (featureType: string) => {
    toast({
      title: "Limit Reached",
      description: `You've used all your ${featureType} credits. Upgrade to Premium or Platinum for unlimited access.`,
      variant: "destructive",
    });
  };

  return {
    usage,
    isLoading,
    checkUsage,
    incrementUsage,
    showLimitReachedMessage
  };
};
