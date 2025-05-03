
import { useSubscription, SubscriptionTier } from "@/hooks/useSubscription";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarIcon, CheckCircle, CreditCard, Loader2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface SubscriptionStatusProps {
  className?: string;
}

export function SubscriptionStatus({ className }: SubscriptionStatusProps) {
  const { subscription, checkout } = useSubscription();
  const [isUpgrading, setIsUpgrading] = useState(false);

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

  const handleUpgrade = async () => {
    setIsUpgrading(true);
    try {
      // Redirect to pricing page for now
      window.location.href = "/pricing";
    } catch (error) {
      console.error("Error upgrading:", error);
    } finally {
      setIsUpgrading(false);
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
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>Your Subscription</span>
          <Badge className={getTierColor(subscription.tier)}>
            {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
          </Badge>
        </CardTitle>
        <CardDescription>
          Manage your subscription and view your benefits
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {subscription.tier !== "free" ? (
          <>
            <div className="flex items-center space-x-2 text-sm">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>
                <span className="font-medium">Active subscription</span> - {subscription.billingCycle} billing
              </span>
            </div>
            {subscription.expiresAt && (
              <div className="flex items-center space-x-2 text-sm">
                <CalendarIcon className="h-4 w-4 text-gray-500" />
                <span>Renews on {formatDate(subscription.expiresAt)}</span>
              </div>
            )}
            <div className="pt-2">
              <h4 className="text-sm font-medium mb-2">Your Benefits:</h4>
              <ul className="text-sm space-y-1 pl-5 list-disc">
                {subscription.tier === "premium" || subscription.tier === "platinum" ? (
                  <>
                    <li>Unlimited resume scorings</li>
                    <li>Unlimited resume optimizations</li>
                    {subscription.tier === "platinum" ? (
                      <li>Unlimited report downloads</li>
                    ) : (
                      <li>10 report downloads daily</li>
                    )}
                    <li>Priority support</li>
                  </>
                ) : null}
                {subscription.tier === "platinum" && (
                  <li>Early access to new features</li>
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
              <h4 className="text-sm font-medium mb-2">Free Tier Limits:</h4>
              <ul className="text-sm space-y-1 pl-5 list-disc">
                <li>{subscription.limits.resumeScorings} resume scorings daily</li>
                <li>{subscription.limits.resumeOptimizations} resume optimizations daily</li>
                <li>Reports viewable online only (no downloads)</li>
              </ul>
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        {subscription.tier === "free" ? (
          <Button onClick={handleUpgrade} disabled={isUpgrading} className="w-full">
            {isUpgrading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="mr-2 h-4 w-4" />
                Upgrade Your Plan
              </>
            )}
          </Button>
        ) : (
          <Button asChild variant="outline" className="w-full">
            <Link to="/pricing">
              View Plans
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
