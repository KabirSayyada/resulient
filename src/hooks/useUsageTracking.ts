
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
      console.log('Fetching usage data for user:', user.id);
      
      // Get daily usage for all features
      const dailyPromises = (['resume_scoring', 'resume_optimization', 'resume_building'] as FeatureType[]).map(
        async (feature) => {
          const { data, error } = await supabase.rpc('get_user_usage_count', {
            p_user_id: user.id,
            p_feature_type: feature,
          });
          if (error) {
            console.error(`Error getting daily usage for ${feature}:`, error);
            throw error;
          }
          console.log(`Daily usage for ${feature}:`, data);
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
          if (error) {
            console.error(`Error getting total usage for ${feature}:`, error);
            throw error;
          }
          console.log(`Total usage for ${feature}:`, data);
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

      console.log('Final usage data:', { dailyUsage, totalUsage });

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
    if (!user?.id) {
      console.error('No user ID available for tracking usage');
      return false;
    }

    try {
      console.log(`Tracking usage for ${featureType} for user ${user.id}`);
      
      const { data, error } = await supabase.rpc('increment_user_usage', {
        p_user_id: user.id,
        p_feature_type: featureType,
      });

      if (error) {
        console.error('Error tracking usage:', error);
        throw error;
      }

      console.log(`Usage tracked successfully. New count: ${data}`);

      // Refresh usage data after tracking
      await fetchUsageData();
      
      return true;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return false;
    }
  }, [user?.id, fetchUsageData]);

  const canUseFeature = useCallback((featureType: FeatureType): boolean => {
    if (subscription.isLoading || usageData.isLoading) {
      console.log('Still loading subscription or usage data');
      return false;
    }
    
    console.log(`Checking if user can use ${featureType}. Subscription tier: ${subscription.tier}`);
    console.log('Current usage data:', usageData);
    
    // Premium and Platinum users have unlimited access
    if (subscription.tier === 'premium' || subscription.tier === 'platinum') {
      console.log('User has premium/platinum access - unlimited');
      return true;
    }

    // Free tier limits
    switch (featureType) {
      case 'resume_scoring':
        const canScore = usageData.dailyUsage.resume_scoring < 2;
        console.log(`Resume scoring: used ${usageData.dailyUsage.resume_scoring}/2, can use: ${canScore}`);
        return canScore;
      case 'resume_optimization':
        const canOptimize = usageData.dailyUsage.resume_optimization < 1;
        console.log(`Resume optimization: used ${usageData.dailyUsage.resume_optimization}/1, can use: ${canOptimize}`);
        return canOptimize;
      case 'resume_building':
        const canBuild = usageData.totalUsage.resume_building < 1; // Lifetime limit
        console.log(`Resume building: used ${usageData.totalUsage.resume_building}/1 (lifetime), can use: ${canBuild}`);
        return canBuild;
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
