
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Target, Download, Diamond } from "lucide-react";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { UseSubscriptionAlert } from "@/components/subscription/UseSubscriptionAlert";

const ResumeOptimization = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { subscription } = useSubscription();
  const { usage, showLimitReachedMessage } = useUsageLimits();

  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  const handleOptimize = () => {
    // Check if user has reached limit
    if (usage.resumeOptimizations.hasReachedLimit) {
      showLimitReachedMessage("resume optimization");
      return;
    }

    // Add optimization logic here
    console.log("Starting resume optimization...");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-950 dark:text-white py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center">
              <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                Resulient
              </span>
            </Link>
            <span className="rounded-full px-2 py-1 text-xs sm:text-sm font-semibold bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300 shadow border border-orange-200 dark:border-orange-700 animate-fade-in whitespace-nowrap">
              Resume Optimization
            </span>
          </div>
          <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 sm:hidden"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <SubscriptionTierIndicator variant="badge" size="sm" />
              <UserMenuWithTheme />
            </div>
          </div>
        </div>

        {/* Info block */}
        <div className="bg-gradient-to-br from-orange-50 via-indigo-50 to-blue-50 dark:from-orange-950 dark:via-indigo-950 dark:to-blue-950 border-orange-200 dark:border-orange-800 rounded-xl border shadow-md px-4 py-5 mb-6 sm:px-7 max-w-3xl mx-auto text-center transition-all duration-300">
          <div className="text-lg sm:text-xl font-semibold text-indigo-900 dark:text-indigo-200 leading-snug mb-0 flex flex-wrap items-center justify-center gap-2">
            <Target className="h-6 w-6 text-orange-600" />
            <span className="text-orange-700 dark:text-orange-400 font-bold">
              AI-Powered Resume Optimization
            </span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 max-w-2xl mx-auto">
            Optimize your resume for specific job descriptions using advanced AI technology. 
            Get personalized suggestions to improve your chances of getting noticed by employers.
          </p>
          {subscription.tier === "free" && (
            <div className="mt-3 text-sm font-medium text-orange-700 dark:text-orange-400">
              Free tier: {usage.resumeOptimizations.used}/{usage.resumeOptimizations.limit} resume optimizations used today
            </div>
          )}
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 hidden sm:flex items-center gap-1"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        {usage.resumeOptimizations.hasReachedLimit && subscription.tier === "free" && (
          <UseSubscriptionAlert 
            subscriptionTier={subscription.tier} 
            requiredTier="premium" 
            message="You've reached your daily limit for resume optimization. Free users can optimize 1 resume per day. Upgrade to Premium or Platinum for unlimited optimization."
          />
        )}

        <MainNavigation />

        <div className="mt-6">
          <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Target className="h-5 w-5" />
                Resume Optimization
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription.tier !== "free" && (
                <div className="flex items-center justify-center gap-1 text-sm text-indigo-700 dark:text-indigo-400 font-medium mb-4">
                  <Diamond className="h-4 w-4" />
                  <span>
                    {subscription.tier === "premium" ? 
                      "Unlimited optimization with Premium" : 
                      "Unlimited optimization with Platinum"}
                  </span>
                </div>
              )}
              {subscription.tier === "free" && (
                <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400 font-medium mb-4">
                  <span>
                    Daily limit: {usage.resumeOptimizations.used}/{usage.resumeOptimizations.limit} resume optimizations used
                  </span>
                </div>
              )}
              
              <p className="text-center text-gray-600 mb-4">
                Resume optimization functionality will be implemented here.
              </p>
              
              <Button 
                onClick={handleOptimize}
                disabled={usage.resumeOptimizations.hasReachedLimit && subscription.tier === "free"}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                <Target className="h-4 w-4 mr-2" />
                Optimize Resume
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <LegalFooter />
      </div>
    </div>
  );
};

export default ResumeOptimization;
