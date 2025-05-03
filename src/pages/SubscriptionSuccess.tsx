
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";

const SubscriptionSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("product");
  const { subscription } = useSubscription();
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Give time for the webhook to process and subscription to update
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);
    
    return () => clearTimeout(timer);
  }, []);

  const redirectToDashboard = () => {
    navigate("/");
  };

  const getProductName = (productId: string | null) => {
    if (!productId) return "Premium";
    
    if (productId.startsWith("premium")) {
      return "Premium";
    } else if (productId.startsWith("platinum")) {
      return "Platinum";
    }
    
    return "Premium";
  };
  
  const isBillingCycleYearly = (productId: string | null) => {
    return productId?.includes("yearly") ?? false;
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
