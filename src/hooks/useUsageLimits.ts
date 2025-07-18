
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";

interface UsageLimit {
  used: number;
  limit: number;
  hasReachedLimit: boolean;
}

interface Usage {
  resumeScoring: UsageLimit;
  resumeOptimization: UsageLimit;
  resumeBuilding: UsageLimit;
  reportDownloads: UsageLimit;
}

export const useUsageLimits = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { subscription } = useSubscription();
  
  const [usage, setUsage] = useState<Usage>({
    resumeScoring: { used: 0, limit: 0, hasReachedLimit: true },
    resumeOptimization: { used: 0, limit: 0, hasReachedLimit: true },
    resumeBuilding: { used: 0, limit: 0, hasReachedLimit: true }, // No free resume building
    reportDownloads: { used: 0, limit: 0, hasReachedLimit: true }
  });

  const checkUsage = useCallback(async () => {
    if (!user) return;

    try {
      // Get current usage counts
      const today = new Date().toISOString().split('T')[0];
      
      const { data: usageData, error } = await supabase
        .from('user_usage')
        .select('*')
        .eq('user_id', user.id)
        .eq('date', today)
        .maybeSingle();

      if (error) {
        console.error('Error fetching usage:', error);
        return;
      }

      const currentUsage = usageData || {
        resume_scorings: 0,
        resume_optimizations: 0,
        resume_building: 0,
        report_downloads: 0
      };

      // Set limits based on subscription tier
      const limits = subscription.limits;

      setUsage({
        resumeScoring: {
          used: currentUsage.resume_scorings || 0,
          limit: limits.resumeScorings,
          hasReachedLimit: limits.resumeScorings !== -1 && (currentUsage.resume_scorings || 0) >= limits.resumeScorings
        },
        resumeOptimization: {
          used: currentUsage.resume_optimizations || 0,
          limit: limits.resumeOptimizations,
          hasReachedLimit: limits.resumeOptimizations !== -1 && (currentUsage.resume_optimizations || 0) >= limits.resumeOptimizations
        },
        resumeBuilding: {
          used: currentUsage.resume_building || 0,
          limit: 0, // No free resume building
          hasReachedLimit: subscription.tier === "free" // Always reached for free users
        },
        reportDownloads: {
          used: currentUsage.report_downloads || 0,
          limit: limits.reportDownloads,
          hasReachedLimit: limits.reportDownloads !== -1 && (currentUsage.report_downloads || 0) >= limits.reportDownloads
        }
      });
    } catch (error) {
      console.error('Error checking usage:', error);
    }
  }, [user, subscription.limits, subscription.tier]);

  useEffect(() => {
    checkUsage();
  }, [checkUsage]);

  const showLimitReachedMessage = (featureType: string) => {
    const featureMap: { [key: string]: string } = {
      "resume scoring": "resume scoring",
      "resume optimization": "resume optimization", 
      "resume building": "resume building",
      "report downloads": "report downloads"
    };

    const feature = featureMap[featureType] || featureType;
    
    toast({
      title: "Subscription Required",
      description: `${feature.charAt(0).toUpperCase() + feature.slice(1)} requires a Premium or Platinum subscription. Upgrade now to access this feature.`,
      variant: "destructive",
    });
  };

  return {
    usage,
    checkUsage,
    showLimitReachedMessage
  };
};
