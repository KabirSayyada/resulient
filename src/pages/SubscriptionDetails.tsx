
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { useSubscriptionTracking } from "@/hooks/useSubscriptionTracking";

const SubscriptionDetails = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { subscriptionData, usageData, refreshData } = useSubscriptionTracking();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading || subscriptionData.isLoading || usageData.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never expires";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getProgressColor = (used: number, limit: number) => {
    if (limit === -1) return "bg-green-500"; // Unlimited
    const percentage = (used / limit) * 100;
    if (percentage >= 90) return "bg-red-500";
    if (percentage >= 70) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const getProgressValue = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited, show as 0%
    return Math.min((used / limit) * 100, 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-950 dark:text-white py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center">
              <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                Resulient
              </span>
            </Link>
            <span className="rounded-full px-2 py-1 text-xs sm:text-sm font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shadow border border-indigo-200 dark:border-indigo-700 animate-fade-in whitespace-nowrap">
              Subscription Details
            </span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <SubscriptionTierIndicator variant="badge" size="sm" />
            <UserMenuWithTheme />
          </div>
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-6 flex items-center gap-1"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <div className="grid gap-6">
          {/* Subscription Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Current Subscription
                  <Badge variant={subscriptionData.tier === "free" ? "secondary" : "default"}>
                    {subscriptionData.tier.charAt(0).toUpperCase() + subscriptionData.tier.slice(1)}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  Your current plan and subscription details
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={refreshData}
                className="flex items-center gap-1"
              >
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</p>
                    <p className="text-lg font-semibold capitalize">{subscriptionData.status}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      {subscriptionData.tier === "free" ? "Plan Type" : "Expires On"}
                    </p>
                    <p className="text-lg font-semibold">
                      {subscriptionData.tier === "free" ? "Free Plan" : formatDate(subscriptionData.expiresAt)}
                    </p>
                  </div>
                </div>
                
                {subscriptionData.tier === "free" && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Upgrade to Premium or Platinum for unlimited access to all features and priority support.
                    </p>
                    <Button asChild className="mt-2" size="sm">
                      <Link to="/pricing">View Pricing Plans</Link>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Usage Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
              <CardDescription>
                Your current usage for today and lifetime limits
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Resume Scoring */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Resume Scoring</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subscriptionData.tier === "free" 
                        ? `${usageData.dailyUsage.resume_scoring}/2 today`
                        : "Unlimited"
                      }
                    </span>
                  </div>
                  {subscriptionData.tier === "free" && (
                    <Progress 
                      value={getProgressValue(usageData.dailyUsage.resume_scoring, 2)} 
                      className="h-2"
                    />
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {subscriptionData.tier === "free" 
                      ? "Resets daily at midnight UTC"
                      : "Premium/Platinum: Unlimited resume scoring"
                    }
                  </p>
                </div>

                {/* Resume Optimization */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Resume Optimization</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subscriptionData.tier === "free" 
                        ? `${usageData.dailyUsage.resume_optimization}/1 today`
                        : "Unlimited"
                      }
                    </span>
                  </div>
                  {subscriptionData.tier === "free" && (
                    <Progress 
                      value={getProgressValue(usageData.dailyUsage.resume_optimization, 1)} 
                      className="h-2"
                    />
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {subscriptionData.tier === "free" 
                      ? "Resets daily at midnight UTC"
                      : "Premium/Platinum: Unlimited resume optimization"
                    }
                  </p>
                </div>

                {/* Resume Building */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Resume Building</h4>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {subscriptionData.tier === "free" 
                        ? `${usageData.totalUsage.resume_building}/1 lifetime`
                        : "Unlimited"
                      }
                    </span>
                  </div>
                  {subscriptionData.tier === "free" && (
                    <Progress 
                      value={getProgressValue(usageData.totalUsage.resume_building, 1)} 
                      className="h-2"
                    />
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {subscriptionData.tier === "free" 
                      ? "One-time limit for free users"
                      : "Premium/Platinum: Unlimited resume building"
                    }
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Plan Benefits */}
          <Card>
            <CardHeader>
              <CardTitle>Plan Benefits</CardTitle>
              <CardDescription>
                What's included in your current plan
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {subscriptionData.tier === "free" && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>2 resume scorings per day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>1 resume optimization per day</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>1 resume build (lifetime)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                      <span className="text-gray-500">No report downloads</span>
                    </div>
                  </div>
                )}
                
                {(subscriptionData.tier === "premium" || subscriptionData.tier === "platinum") && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Unlimited resume scoring</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Unlimited resume optimization</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Unlimited resume building</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>
                        {subscriptionData.tier === "platinum" ? "Unlimited" : "10"} report downloads daily
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>Priority support</span>
                    </div>
                    {subscriptionData.tier === "platinum" && (
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <span>Early access to new features</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDetails;
