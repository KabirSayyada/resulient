
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type SubscriptionTier = 'free' | 'premium' | 'platinum';

interface SubscriptionData {
  tier: SubscriptionTier;
  status: string;
  expiresAt: string | null;
  isLoading: boolean;
}

interface UsageData {
  dailyUsage: {
    resume_scoring: number;
    resume_optimization: number;
    resume_building: number;
  };
  totalUsage: {
    resume_scoring: number;
    resume_optimization: number;
    resume_building: number;
  };
  isLoading: boolean;
}

export function useSubscriptionTracking() {
  const { user, setOnUserLogin } = useAuth();
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData>({
    tier: 'free',
    status: 'inactive',
    expiresAt: null,
    isLoading: true,
  });
  
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

  const checkSubscription = useCallback(async () => {
    if (!user?.id) {
      setSubscriptionData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      console.log('Checking subscription for user:', user.id);
      
      const now = new Date().toISOString();
      const { data: subscription, error } = await supabase
        .from('user_subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .or(`end_date.is.null,end_date.gt.${now}`)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.error('Error checking subscription:', error);
        throw error;
      }

      if (subscription) {
        console.log('Active subscription found:', subscription);
        setSubscriptionData({
          tier: subscription.subscription_tier as SubscriptionTier,
          status: subscription.status,
          expiresAt: subscription.end_date,
          isLoading: false,
        });
      } else {
        console.log('No active subscription found, user is on free tier');
        setSubscriptionData({
          tier: 'free',
          status: 'inactive',
          expiresAt: null,
          isLoading: false,
        });
      }
    } catch (error) {
      console.error('Error checking subscription:', error);
      setSubscriptionData(prev => ({ ...prev, isLoading: false }));
    }
  }, [user?.id]);

  const checkUsage = useCallback(async () => {
    if (!user?.id) {
      setUsageData(prev => ({ ...prev, isLoading: false }));
      return;
    }

    try {
      console.log('Checking usage for user:', user.id);
      
      const features = ['resume_scoring', 'resume_optimization', 'resume_building'] as const;
      
      const dailyPromises = features.map(async (feature) => {
        const { data, error } = await supabase.rpc('get_user_usage_count', {
          p_user_id: user.id,
          p_feature_type: feature,
        });
        if (error) throw error;
        return { feature, count: data || 0 };
      });

      const totalPromises = features.map(async (feature) => {
        const { data, error } = await supabase.rpc('get_user_total_usage_count', {
          p_user_id: user.id,
          p_feature_type: feature,
        });
        if (error) throw error;
        return { feature, count: data || 0 };
      });

      const [dailyResults, totalResults] = await Promise.all([
        Promise.all(dailyPromises),
        Promise.all(totalPromises),
      ]);

      const dailyUsage = dailyResults.reduce((acc, { feature, count }) => {
        acc[feature] = count;
        return acc;
      }, {} as any);

      const totalUsage = totalResults.reduce((acc, { feature, count }) => {
        acc[feature] = count;
        return acc;
      }, {} as any);

      console.log('Usage data fetched:', { dailyUsage, totalUsage });

      setUsageData({
        dailyUsage,
        totalUsage,
        isLoading: false,
      });
    } catch (error) {
      console.error('Error checking usage:', error);
      setUsageData(prev => ({ ...prev, isLoading: false }));
    }
  }, [user?.id]);

  const refreshData = useCallback(async () => {
    console.log('Refreshing subscription and usage data');
    await Promise.all([checkSubscription(), checkUsage()]);
  }, [checkSubscription, checkUsage]);

  // Set up login callback to check data immediately when user logs in
  useEffect(() => {
    if (setOnUserLogin) {
      setOnUserLogin(async (loggedInUser) => {
        console.log('User logged in, checking subscription and usage');
        await refreshData();
      });
    }
  }, [setOnUserLogin, refreshData]);

  // Check data when user changes
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Set up periodic checks every 2 minutes
  useEffect(() => {
    if (!user?.id) return;

    const interval = setInterval(() => {
      console.log('Periodic subscription/usage check');
      refreshData();
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(interval);
  }, [user?.id, refreshData]);

  const canUseFeature = useCallback((feature: 'resume_scoring' | 'resume_optimization' | 'resume_building'): boolean => {
    if (subscriptionData.isLoading || usageData.isLoading) {
      return false;
    }

    // Premium and Platinum users have unlimited access
    if (subscriptionData.tier === 'premium' || subscriptionData.tier === 'platinum') {
      return true;
    }

    // Free tier limits
    switch (feature) {
      case 'resume_scoring':
        return usageData.dailyUsage.resume_scoring < 2;
      case 'resume_optimization':
        return usageData.dailyUsage.resume_optimization < 1;
      case 'resume_building':
        return usageData.totalUsage.resume_building < 1;
      default:
        return false;
    }
  }, [subscriptionData, usageData]);

  const trackUsage = useCallback(async (feature: 'resume_scoring' | 'resume_optimization' | 'resume_building'): Promise<boolean> => {
    if (!user?.id) {
      console.error('No user ID available for tracking usage');
      return false;
    }

    try {
      console.log(`Tracking usage for ${feature} for user ${user.id}`);
      
      const { data, error } = await supabase.rpc('increment_user_usage', {
        p_user_id: user.id,
        p_feature_type: feature,
      });

      if (error) {
        console.error('Error tracking usage:', error);
        throw error;
      }

      console.log(`Usage tracked successfully. New count: ${data}`);
      
      // Refresh usage data after tracking
      await checkUsage();
      
      return true;
    } catch (error) {
      console.error('Error tracking usage:', error);
      return false;
    }
  }, [user?.id, checkUsage]);

  const getLimitMessage = useCallback((feature: 'resume_scoring' | 'resume_optimization' | 'resume_building'): string => {
    switch (feature) {
      case 'resume_scoring':
        return `You've reached your daily limit for resume scoring (${usageData.dailyUsage.resume_scoring}/2). Upgrade to Premium or Platinum for unlimited access.`;
      case 'resume_optimization':
        return `You've reached your daily limit for resume optimization (${usageData.dailyUsage.resume_optimization}/1). Upgrade to Premium or Platinum for unlimited access.`;
      case 'resume_building':
        return `You've reached your lifetime limit for resume building (${usageData.totalUsage.resume_building}/1). Upgrade to Premium or Platinum for unlimited access.`;
      default:
        return 'Feature limit reached. Upgrade for unlimited access.';
    }
  }, [usageData]);

  return {
    subscriptionData,
    usageData,
    canUseFeature,
    trackUsage,
    refreshData,
    getLimitMessage,
  };
}
