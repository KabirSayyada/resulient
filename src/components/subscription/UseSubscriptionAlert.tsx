
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { SubscriptionTier } from "@/hooks/useSubscription";

interface UseSubscriptionAlertProps {
  subscriptionTier: SubscriptionTier;
  requiredTier: SubscriptionTier;
  message?: string;
}

export function UseSubscriptionAlert({ subscriptionTier, requiredTier, message }: UseSubscriptionAlertProps) {
  const getTierName = (tier: SubscriptionTier) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };

  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Subscription Required</AlertTitle>
      <AlertDescription className="mt-2">
        <p>
          {message || 
            `This feature requires a ${getTierName(requiredTier)} subscription. You are currently on the ${getTierName(subscriptionTier)} plan.`
          }
        </p>
        <Button asChild className="mt-2" size="sm">
          <Link to="/pricing">Upgrade Now</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
}
