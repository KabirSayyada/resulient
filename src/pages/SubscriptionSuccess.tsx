
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2, RefreshCw } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "@/hooks/use-toast";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const { subscription, refreshSubscription } = useSubscription();
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [refreshAttempts, setRefreshAttempts] = useState(0);
  const [retryTimeoutId, setRetryTimeoutId] = useState<number | null>(null);
  
  // Enhanced polling logic with progressive backoff
  useEffect(() => {
    // Clear any existing timer when component unmounts or when effect reruns
    return () => {
      if (retryTimeoutId !== null) {
        clearTimeout(retryTimeoutId);
      }
    };
  }, [retryTimeoutId]);
  
  useEffect(() => {
    // Refresh subscription status immediately when page loads
    refreshSubscription();
    
    // Set up initial polling interval
    const initialCheckDelay = 800; // First check after 800ms
    
    const initialTimer = setTimeout(() => {
      setLoading(false);
      checkSubscriptionStatus();
    }, initialCheckDelay);
    
    setRetryTimeoutId(initialTimer as unknown as number);
    
    return () => {
      if (initialTimer) clearTimeout(initialTimer);
    };
  }, []);
  
  // Function to check subscription status and handle polling logic
  const checkSubscriptionStatus = () => {
    console.log(`Checking subscription status (attempt ${refreshAttempts + 1}/10)...`);
    refreshSubscription();
    setRefreshAttempts(prev => prev + 1);
    
    // Check subscription data validity
    if (subscription.tier !== "free") {
      console.log("Subscription active, stopping polling");
      setLoading(false);
      toast({
        title: "Subscription Activated",
        description: `Your ${subscription.tier} subscription is now active.`,
        variant: "default",
      });
      return;
    }
    
    // Continue polling with progressive backoff if needed
    if (refreshAttempts < 10) {
      // Calculate next retry delay with progressive backoff
      const nextDelay = Math.min(1000 * Math.pow(1.5, refreshAttempts), 10000); 
      console.log(`Will retry in ${nextDelay}ms`);
      
      const timerId = setTimeout(() => {
        setRetryCount(prev => prev + 1);
        checkSubscriptionStatus();
      }, nextDelay);
      
      setRetryTimeoutId(timerId as unknown as number);
    } else {
      // Stop polling after max attempts
      setLoading(false);
      console.log("Max polling attempts reached");
    }
  };

  const redirectToDashboard = () => {
    navigate("/");
    
    // Show welcome toast if subscription is active
    if (subscription.tier !== "free") {
      toast({
        title: `Welcome to ${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}!`,
        description: "You now have access to all premium features.",
      });
    }
  };

  const getProductName = (productId: string | null) => {
    if (!productId) return "Premium";
    
    if (productId === "premium-monthly" || productId === "ylaia" || 
        productId === "premium-yearly" || productId === "dencp") {
      return "Premium";
    } else if (productId === "platinum-monthly" || productId === "tbfapo" || 
               productId === "platinum-yearly" || productId === "dcfjt") {
      return "Platinum";
    }
    
    return "Premium";
  };
  
  const isBillingCycleYearly = (productId: string | null) => {
    return productId?.includes("yearly") || productId === "dencp" || productId === "dcfjt" || false;
  };

  const handleManualRefresh = () => {
    setLoading(true);
    refreshSubscription();
    setTimeout(() => {
      setLoading(false);
      checkSubscriptionStatus();
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Thank You!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-12 w-12 text-indigo-500 animate-spin" />
              <p className="text-center text-gray-600 dark:text-gray-300">
                Processing your subscription...
              </p>
            </div>
          ) : subscription.tier !== "free" ? (
            <div className="space-y-4">
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              
              <p className="text-center text-lg font-semibold">
                Your subscription is active!
              </p>
              
              <div className="rounded-lg bg-indigo-50 dark:bg-indigo-900 p-4">
                <p className="font-medium text-center">
                  {getProductName(productId)}{" "}
                  <span className="text-sm">
                    ({isBillingCycleYearly(productId) ? "Yearly" : "Monthly"})
                  </span>
                </p>
              </div>
              
              <p className="text-center text-gray-600 dark:text-gray-300 text-sm">
                You now have full access to all {getProductName(productId)} tier features.
              </p>
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-amber-600 dark:text-amber-400 font-medium">
                Your subscription is being processed.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                It may take a few minutes to activate. Please refresh the app or check back later.
              </p>
              <Button 
                onClick={handleManualRefresh} 
                variant="outline" 
                size="sm"
                className="mt-2"
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                Refresh Status
              </Button>
            </div>
          )}
          
          <Button 
            onClick={redirectToDashboard} 
            className="w-full mt-8"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Return to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionSuccess;
