
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";

export interface UsageLimits {
  resumeScoring: {
    used: number;
    limit: number;
    hasReachedLimit: boolean;
  };
  resumeOptimization: {
    used: number;
    limit: number;
    hasReachedLimit: boolean;
  };
  resumeBuilding: {
    used: number;
    limit: number;
    hasReachedLimit: boolean;
  };
  reportDownloads: {
    used: number;
    limit: number;
    hasReachedLimit: boolean;
  };
  jobFetching: {
    used: number;
    limit: number;
    hasReachedLimit: boolean;
  };
}

export const useUsageLimits = () => {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const [usage, setUsage] = useState<UsageLimits>({
    resumeScoring: { used: 0, limit: 0, hasReachedLimit: true },
    resumeOptimization: { used: 0, limit: 0, hasReachedLimit: true },
    resumeBuilding: { used: 0, limit: 0, hasReachedLimit: true },
    reportDownloads: { used: 0, limit: 0, hasReachedLimit: true },
    jobFetching: { used: 0, limit: 30, hasReachedLimit: false }
  });

  const checkUsage = async () => {
    if (!user) return;

    try {
      const { data: usageData, error } = await supabase
        .from('user_usage_tracking')
        .select('feature_type, usage_count')
        .eq('user_id', user.id)
        .eq('usage_date', new Date().toISOString().split('T')[0]);

      if (error) {
        console.error('Error fetching usage data:', error);
        return;
      }

      // Create a map of current usage
      const currentUsage: { [key: string]: number } = {};
      usageData?.forEach(item => {
        currentUsage[item.feature_type] = item.usage_count;
      });

      // Determine limits based on subscription tier
      let limits = {
        resumeScoring: 0,
        resumeOptimization: 0,
        resumeBuilding: 0,
        reportDownloads: 0,
        jobFetching: 30
      };

      if (subscription.tier === "premium") {
        limits = {
          resumeScoring: -1, // unlimited
          resumeOptimization: -1, // unlimited
          resumeBuilding: -1, // unlimited
          reportDownloads: 10,
          jobFetching: 100
        };
      } else if (subscription.tier === "platinum") {
        limits = {
          resumeScoring: -1, // unlimited
          resumeOptimization: -1, // unlimited
          resumeBuilding: -1, // unlimited
          reportDownloads: -1, // unlimited
          jobFetching: -1 // unlimited
        };
      }

      setUsage({
        resumeScoring: {
          used: currentUsage.resume_scoring || 0,
          limit: limits.resumeScoring,
          hasReachedLimit: limits.resumeScoring !== -1 && (currentUsage.resume_scoring || 0) >= limits.resumeScoring
        },
        resumeOptimization: {
          used: currentUsage.resume_optimization || 0,
          limit: limits.resumeOptimization,
          hasReachedLimit: limits.resumeOptimization !== -1 && (currentUsage.resume_optimization || 0) >= limits.resumeOptimization
        },
        resumeBuilding: {
          used: currentUsage.resume_building || 0,
          limit: limits.resumeBuilding,
          hasReachedLimit: limits.resumeBuilding !== -1 && (currentUsage.resume_building || 0) >= limits.resumeBuilding
        },
        reportDownloads: {
          used: currentUsage.report_downloads || 0,
          limit: limits.reportDownloads,
          hasReachedLimit: limits.reportDownloads !== -1 && (currentUsage.report_downloads || 0) >= limits.reportDownloads
        },
        jobFetching: {
          used: currentUsage.job_fetching || 0,
          limit: limits.jobFetching,
          hasReachedLimit: limits.jobFetching !== -1 && (currentUsage.job_fetching || 0) >= limits.jobFetching
        }
      });
    } catch (error) {
      console.error('Error checking usage limits:', error);
    }
  };

  useEffect(() => {
    checkUsage();
  }, [user, subscription.tier]);

  const showLimitReachedMessage = (featureType: string) => {
    const tierName = subscription.tier === "free" ? "Free" : 
                    subscription.tier === "premium" ? "Premium" : "Platinum";
    
    toast({
      title: "Feature Requires Subscription",
      description: `This feature requires a Premium or Platinum subscription. You are currently on the ${tierName} plan.`,
      variant: "destructive"
    });
  };

  return {
    usage,
    checkUsage,
    showLimitReachedMessage
  };
};
