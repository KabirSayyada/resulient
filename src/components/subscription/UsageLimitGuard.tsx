
import { ReactNode } from "react";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Crown } from "lucide-react";
import { Link } from "react-router-dom";

interface UsageLimitGuardProps {
  feature: 'resumeScorings' | 'resumeOptimizations' | 'resumeBuilds' | 'reportDownloads';
  children: ReactNode;
  fallbackMessage?: string;
}

export const UsageLimitGuard = ({ 
  feature, 
  children, 
  fallbackMessage 
}: UsageLimitGuardProps) => {
  const { checkLimit, subscription, isLoading } = useUsageLimits();

  if (isLoading || subscription.isLoading) {
    return (
      <Card className="bg-yellow-50 dark:bg-yellow-950 border-yellow-200 dark:border-yellow-800">
        <CardContent className="p-6 text-center">
          <div className="animate-spin h-6 w-6 border-2 border-yellow-500 border-t-transparent rounded-full mx-auto mb-3"></div>
          <p className="text-yellow-800 dark:text-yellow-200">Checking subscription limits...</p>
        </CardContent>
      </Card>
    );
  }

  const { allowed, message } = checkLimit(feature);

  if (!allowed) {
    return (
      <Card className="bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-orange-800 dark:text-orange-200 mb-2">
            Limit Reached
          </h3>
          <p className="text-orange-700 dark:text-orange-300 mb-4">
            {message || fallbackMessage || "You've reached your usage limit for this feature."}
          </p>
          <Button asChild className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600">
            <Link to="/pricing">
              <Crown className="h-4 w-4 mr-2" />
              Upgrade to Premium
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
};
