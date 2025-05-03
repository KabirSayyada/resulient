
import { useSubscription, SubscriptionTier } from "@/hooks/useSubscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CreditCard, Loader2, RefreshCw, Crown, Diamond, Star, BadgeCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface SubscriptionStatusProps {
  className?: string;
}

export function SubscriptionStatus({ className }: SubscriptionStatusProps) {
  const { subscription, checkout, refreshSubscription } = useSubscription();
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case "platinum":
        return "bg-gradient-to-r from-purple-500 to-indigo-600 text-white";
      case "premium":
        return "bg-gradient-to-r from-blue-500 to-indigo-500 text-white";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const getTierBgColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case "platinum":
        return "bg-gradient-to-br from-purple-50 via-indigo-50 to-fuchsia-50 dark:from-purple-950 dark:via-indigo-950 dark:to-fuchsia-950 border-purple-200 dark:border-purple-800";
      case "premium":
        return "bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 dark:from-blue-950 dark:via-indigo-950 dark:to-sky-950 border-blue-200 dark:border-blue-800";
      default:
        return "bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800";
    }
  };

  const getTierIcon = (tier: SubscriptionTier) => {
    switch (tier) {
      case "platinum":
        return <Crown className="h-6 w-6 text-purple-500 dark:text-purple-400" />;
      case "premium":
        return <Diamond className="h-6 w-6 text-blue-500 dark:text-blue-400" />;
      default:
        return <Star className="h-6 w-6 text-gray-400 dark:text-gray-600" />;
    }
  };

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      const checkoutData = await checkout("premium-monthly");
      if (checkoutData?.checkoutUrl) {
        window.location.href = checkoutData.checkoutUrl;
      } else {
        // Fallback to pricing page if checkout fails
        window.location.href = "/pricing";
        toast({
          title: "Redirecting to Plans",
          description: "You'll be able to choose your subscription plan.",
        });
      }
    } catch (error) {
      console.error("Error upgrading:", error);
      window.location.href = "/pricing";
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      refreshSubscription();
      toast({
        title: "Subscription Status Refreshed",
        description: "Your subscription information has been updated.",
      });
    } catch (error) {
      console.error("Error refreshing subscription:", error);
    } finally {
      setTimeout(() => {
        setIsRefreshing(false);
      }, 1000);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (subscription.isLoading) {
    return (
      <Card className={className}>
        <CardContent className="pt-6 flex justify-center items-center h-48">
          <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className} ${getTierBgColor(subscription.tier)}`}>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            {getTierIcon(subscription.tier)}
            <CardTitle>Your Subscription</CardTitle>
            <button 
              onClick={handleRefresh} 
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
              title="Refresh subscription status"
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 text-gray-500 ${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
          <Badge className={`${getTierColor(subscription.tier)} shadow-sm`}>
            {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
          </Badge>
        </div>
        <CardDescription>
          Manage your subscription and view your benefits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription.tier !== "free" ? (
          <>
            <div className="flex items-center space-x-2 text-sm">
              <BadgeCheck className="h-4 w-4 text-green-500" />
              <span>
                <span className="font-medium">Active subscription</span> - {subscription.billingCycle} billing
              </span>
            </div>
            {subscription.purchaseId && (
              <div className="flex items-center space-x-2 text-sm">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span>Purchase ID: {subscription.purchaseId.substring(0, 8)}...</span>
              </div>
            )}
            {subscription.expiresAt && (
              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>Renews on {formatDate(subscription.expiresAt)}</span>
              </div>
            )}
            <div className="pt-2 mt-4">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Star className="h-4 w-4 mr-1 text-amber-500" /> 
                Your Benefits:
              </h4>
              <ul className="text-sm space-y-2 pl-5">
                {subscription.tier === "premium" || subscription.tier === "platinum" ? (
                  <>
                    <li className="flex items-start">
                      <BadgeCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>Unlimited resume scorings</span>
                    </li>
                    <li className="flex items-start">
                      <BadgeCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>Unlimited resume optimizations</span>
                    </li>
                    {subscription.tier === "platinum" ? (
                      <li className="flex items-start">
                        <BadgeCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                        <span>Unlimited report downloads</span>
                      </li>
                    ) : (
                      <li className="flex items-start">
                        <BadgeCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                        <span>10 report downloads daily</span>
                      </li>
                    )}
                    <li className="flex items-start">
                      <BadgeCheck className="h-4 w-4 text-green-500 mr-2 mt-0.5 shrink-0" />
                      <span>Priority support</span>
                    </li>
                  </>
                ) : null}
                {subscription.tier === "platinum" && (
                  <li className="flex items-start">
                    <BadgeCheck className="h-4 w-4 text-purple-500 mr-2 mt-0.5 shrink-0" />
                    <span>Early access to new features</span>
                  </li>
                )}
              </ul>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center space-x-2 text-sm">
              <span className="font-medium">Free Plan</span>
            </div>
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2 flex items-center">
                <Star className="h-4 w-4 mr-1 text-gray-400" /> 
                Free Tier Limits:
              </h4>
              <ul className="text-sm space-y-2 pl-5">
                <li className="flex items-start">
                  <BadgeCheck className="h-4 w-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                  <span>{subscription.limits.resumeScorings} resume scorings daily</span>
                </li>
                <li className="flex items-start">
                  <BadgeCheck className="h-4 w-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                  <span>{subscription.limits.resumeOptimizations} resume optimizations daily</span>
                </li>
                <li className="flex items-start">
                  <BadgeCheck className="h-4 w-4 text-gray-400 mr-2 mt-0.5 shrink-0" />
                  <span>Reports viewable online only (no downloads)</span>
                </li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {subscription.tier === "free" ? (
          <Button onClick={handleUpgrade} disabled={isUpgrading} className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
            {isUpgrading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Diamond className="mr-2 h-4 w-4" />
                Upgrade Your Plan
              </>
            )}
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link to="/pricing">
              <Diamond className="mr-2 h-4 w-4" />
              View Plans
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
