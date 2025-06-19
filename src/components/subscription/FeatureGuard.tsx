
import React from 'react';
import { useUsageTracking, FeatureType } from '@/hooks/useUsageTracking';
import { useSubscription } from '@/hooks/useSubscription';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { AlertCircle, Crown, Diamond } from 'lucide-react';

interface FeatureGuardProps {
  featureType: FeatureType;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const featureNames = {
  resume_scoring: 'Resume Scoring',
  resume_optimization: 'Resume Optimization',
  resume_building: 'Resume Building',
};

const featureLimits = {
  resume_scoring: '2 per day',
  resume_optimization: '1 per day',
  resume_building: '1 lifetime',
};

export function FeatureGuard({ featureType, children, fallback }: FeatureGuardProps) {
  const { canUseFeature, getRemainingUsage, usageData } = useUsageTracking();
  const { subscription } = useSubscription();

  if (usageData.isLoading || subscription.isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">
          Loading...
        </div>
      </div>
    );
  }

  const canUse = canUseFeature(featureType);
  const remaining = getRemainingUsage(featureType);

  if (canUse) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return (
    <div className="space-y-6">
      <Alert variant="destructive" className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle className="text-orange-800 dark:text-orange-200">
          Feature Limit Reached
        </AlertTitle>
        <AlertDescription className="text-orange-700 dark:text-orange-300">
          <p className="mb-3">
            You've reached your {featureLimits[featureType]} limit for{' '}
            <span className="font-medium">{featureNames[featureType]}</span> on the free plan.
          </p>
          <div className="space-y-2">
            <p className="text-sm">
              <span className="font-medium">Current usage:</span>
              {featureType === 'resume_building' 
                ? ` ${usageData.totalUsage[featureType]} / 1 (lifetime)`
                : ` ${usageData.dailyUsage[featureType]} / ${featureType === 'resume_scoring' ? '2' : '1'} (today)`
              }
            </p>
            {featureType !== 'resume_building' && (
              <p className="text-sm text-orange-600 dark:text-orange-400">
                Your daily limits reset at midnight UTC.
              </p>
            )}
          </div>
        </AlertDescription>
      </Alert>

      <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950 border border-indigo-200 dark:border-indigo-800 rounded-lg p-6">
        <div className="text-center space-y-4">
          <div className="flex justify-center space-x-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400">
              <Diamond className="h-5 w-5" />
              <span className="font-medium">Premium</span>
            </div>
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
              <Crown className="h-5 w-5" />
              <span className="font-medium">Platinum</span>
            </div>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Unlock Unlimited Access
          </h3>
          <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
            Upgrade to Premium or Platinum for unlimited {featureNames[featureType].toLowerCase()}, 
            plus all other premium features.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600">
              <Link to="/pricing">
                View Pricing Plans
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/subscription">
                Current Plan Details
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
