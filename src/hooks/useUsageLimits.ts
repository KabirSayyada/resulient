
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useSubscription } from "@/hooks/useSubscription";

export interface UsageCounts {
  resumeScorings: number;
  resumeOptimizations: number;
  resumeBuilds: number;
  reportDownloads: number;
}

export const useUsageLimits = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [usageCounts, setUsageCounts] = useState<UsageCounts>({
    resumeScorings: 0,
    resumeOptimizations: 0,
    resumeBuilds: 0,
    reportDownloads: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get today's date at midnight for consistent daily limit checking
  const getTodayStart = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString();
  };

  const fetchUsageCounts = async () => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    try {
      const todayStart = getTodayStart();

      // Count resume scorings today
      const { count: scoringCount } = await supabase
        .from("resume_scores")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .gte("created_at", todayStart);

      // Count resume optimizations today
      const { count: optimizationCount } = await supabase
        .from("resume_optimizations")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id)
        .gte("created_at", todayStart);

      // Count resume builds (lifetime for free users, daily doesn't matter for premium)
      const { count: resumeBuildsCount } = await supabase
        .from("user_resume_data")
        .select("id", { count: 'exact', head: true })
        .eq("user_id", user.id);

      setUsageCounts({
        resumeScorings: scoringCount || 0,
        resumeOptimizations: optimizationCount || 0,
        resumeBuilds: resumeBuildsCount || 0,
        reportDownloads: 0, // This would need separate tracking if implemented
      });
    } catch (error) {
      console.error("Error fetching usage counts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsageCounts();
  }, [user, subscription.tier]);

  const checkLimit = (feature: keyof UsageCounts): { allowed: boolean; message?: string } => {
    if (subscription.isLoading || isLoading) {
      return { allowed: false, message: "Checking subscription..." };
    }

    const limits = subscription.limits;
    const currentUsage = usageCounts[feature];

    // For premium/platinum users, most limits are unlimited (-1)
    if (limits[feature] === -1) {
      return { allowed: true };
    }

    // Special case for resume building - free users get 1 lifetime build
    if (feature === 'resumeBuilds') {
      if (subscription.tier === 'free' && currentUsage >= 1) {
        return { 
          allowed: false, 
          message: "Free users can create only 1 resume. Upgrade to Premium for unlimited resume building." 
        };
      }
      return { allowed: true };
    }

    // Check daily limits for other features
    if (currentUsage >= limits[feature]) {
      const featureNames = {
        resumeScorings: 'resume scoring',
        resumeOptimizations: 'resume optimization',
        reportDownloads: 'report downloads'
      };

      return { 
        allowed: false, 
        message: `Daily limit reached for ${featureNames[feature]}. You've used ${currentUsage}/${limits[feature]} today. Upgrade for unlimited access.` 
      };
    }

    return { allowed: true };
  };

  const refreshUsage = () => {
    fetchUsageCounts();
  };

  return {
    usageCounts,
    isLoading,
    checkLimit,
    refreshUsage,
    subscription
  };
};
