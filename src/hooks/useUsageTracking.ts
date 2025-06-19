
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useSubscription } from '@/hooks/useSubscription';
import { supabase } from '@/integrations/supabase/client';

export type FeatureType = 'resume_scoring' | 'resume_optimization' | 'resume_building';

interface UsageData {
  dailyUsage: Record<FeatureType, number>;
  totalUsage: Record<FeatureType, number>;
  isLoading: boolean;
}

export function useUsageTracking() {
  const { user } = useAuth();
  const { subscription } = useSubscription();
  const [usageData, setUsageData] = useState<UsageData>({
    dailyUsage: {
      resume_scoring: 0,
      resume_optimization: 0,
      resume_building: 0,
    },
    totalUsage: {
      resume_scoring: 0,
      resume_optimization: 0,
      resume_building: 0,
    },
    isLoading: true,
  });

  const fetchUsageData = useCallback(async () => {
    if (!user?.id) {
      setUsageData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      // Get daily usage for all features
      const dailyPromises = (['resume_scoring', 'resume_optimization', 'resume_building'] as FeatureType[]).map(
        async (feature) => {
          const { data, error } = await supabase.rpc('get_user_usage_count', {
            p_user_id: user.id,
            p_feature_type: feature,
          });
          if (error) throw error;
          return { feature, count: data || 0 };
        }
      );

      // Get total usage for all features
      const totalPromises = (['resume_scoring', 'resume_optimization', 'resume_building'] as FeatureType[]).map(
        async (feature) => {
          const { data, error } = await supabase.rpc('get_user_total_usage_count', {
            p_user_id: user.id,
            p_feature_type: feature,
          });
          if (error) throw error;
          return { feature, count: data || 0 };
        }
      );

      const [dailyResults, totalResults] = await Promise.all([
        Promise.all(dailyPromises),
        Promise.all(totalPromises),
      ]);

      const dailyUsage = dailyResults.reduce((acc, { feature, count }) => {
        acc[feature] = count;
        return acc;
      }, {} as Record<FeatureType, number>);

      const totalUsage = totalResults.reduce((acc, { feature, count }) => {
        acc[feature] = count;
        return acc;
      }, {} as Record<FeatureType, number>);

      setUsageData({
        dailyUsage,
        totalUsage,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error fetching usage data:', error);
      setUsageData(prev => ({ ...prev, isLoading: false }));
    }
  }, [user?.id]);

  useEffect(() => {
    fetchUsageData();
  }, [fetchUsageData]);

  const trackUsage = useCallback(async (featureType: FeatureType): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      const { data, error } = await supabase.rpc('increment_user_usage', {
        p_user_id: user.id,
        p_feature_type: featureType,
      });

      if (error) throw error;

      // Refresh usage data after tracking
      fetchUsageData();
      
      return true;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return false;
    }
  }, [user?.id, fetchUsageData]);

  const canUseFeature = useCallback((featureType: FeatureType): boolean => {
    if (subscription.isLoading || usageData.isLoading) return false;
    
    // Premium and Platinum users have unlimited access
    if (subscription.tier === 'premium' || subscription.tier === 'platinum') {
      return true;
    }

    // Free tier limits
    switch (featureType) {
      case 'resume_scoring':
        return usageData.dailyUsage.resume_scoring < 2;
      case 'resume_optimization':
        return usageData.dailyUsage.resume_optimization < 1;
      case 'resume_building':
        return usageData.totalUsage.resume_building < 1; // Lifetime limit
      default:
        return false;
    }
  }, [subscription.tier, subscription.isLoading, usageData]);

  const getRemainingUsage = useCallback((featureType: FeatureType): number => {
    if (subscription.tier === 'premium' || subscription.tier === 'platinum') {
      return -1; // Unlimited
    }

    switch (featureType) {
      case 'resume_scoring':
        return Math.max(0, 2 - usageData.dailyUsage.resume_scoring);
      case 'resume_optimization':
        return Math.max(0, 1 - usageData.dailyUsage.resume_optimization);
      case 'resume_building':
        return Math.max(0, 1 - usageData.totalUsage.resume_building);
      default:
        return 0;
    }
  }, [subscription.tier, usageData]);

  return {
    usageData,
    trackUsage,
    canUseFeature,
    getRemainingUsage,
    refreshUsage: fetchUsageData,
  };
}
