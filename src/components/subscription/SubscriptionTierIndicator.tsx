
import { useSubscription, SubscriptionTier } from "@/hooks/useSubscription";
import { Crown, Diamond, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface SubscriptionTierIndicatorProps {
  className?: string;
  showTooltip?: boolean;
  variant?: "badge" | "icon" | "full";
  size?: "sm" | "md" | "lg";
}

export function SubscriptionTierIndicator({ 
  className = "", 
  showTooltip = true,
  variant = "badge",
  size = "md"
}: SubscriptionTierIndicatorProps) {
  const { subscription } = useSubscription();
  
  const getTierIcon = (tier: SubscriptionTier) => {
    const sizeMap = {
      sm: "h-3.5 w-3.5",
      md: "h-4 w-4",
      lg: "h-5 w-5"
    };
    
    const iconSize = sizeMap[size];
    
    switch (tier) {
      case "platinum":
        return <Crown className={`${iconSize} text-purple-500 dark:text-purple-400`} />;
      case "premium":
        return <Diamond className={`${iconSize} text-blue-500 dark:text-blue-400`} />;
      default:
        return <Star className={`${iconSize} text-gray-400 dark:text-gray-600`} />;
    }
  };
  
  const getTierColor = (tier: SubscriptionTier) => {
    switch (tier) {
      case "platinum":
        return "from-purple-500 to-indigo-600 text-white border-purple-400";
      case "premium":
        return "from-blue-500 to-indigo-500 text-white border-blue-400";
      default:
        return "from-gray-200 to-gray-300 text-gray-700 dark:from-gray-700 dark:to-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600";
    }
  };
  
  const getBadgeText = (tier: SubscriptionTier) => {
    return tier.charAt(0).toUpperCase() + tier.slice(1);
  };
  
  const getTooltipText = (tier: SubscriptionTier) => {
    switch (tier) {
      case "platinum":
        return "Platinum tier - Unlimited access to all features";
      case "premium":
        return "Premium tier - Unlimited scorings and optimizations";
      default:
        return "Free tier - Limited daily usage";
    }
  };
  
  // Icon-only display
  if (variant === "icon") {
    const content = getTierIcon(subscription.tier);
    
    if (showTooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/pricing" className={className}>
                {content}
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipText(subscription.tier)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <Link to="/pricing" className={className}>
        {content}
      </Link>
    );
  }
  
  // Badge display
  if (variant === "badge") {
    const content = (
      <Badge 
        className={`bg-gradient-to-r ${getTierColor(subscription.tier)} hover:opacity-90 transition-opacity ${className}`}
      >
        {getTierIcon(subscription.tier)}
        <span className={`ml-1 ${size === "sm" ? "text-xs" : "text-sm"}`}>{getBadgeText(subscription.tier)}</span>
      </Badge>
    );
    
    if (showTooltip) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Link to="/pricing">
                {content}
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>{getTooltipText(subscription.tier)}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }
    
    return (
      <Link to="/pricing">
        {content}
      </Link>
    );
  }
  
  // Full display with text and icon
  const content = (
    <div className={`flex items-center gap-1.5 ${subscription.tier !== "free" ? "text-indigo-700 dark:text-indigo-300" : "text-gray-600 dark:text-gray-400"} ${className}`}>
      {getTierIcon(subscription.tier)}
      <span className={`font-medium ${size === "sm" ? "text-xs" : size === "lg" ? "text-base" : "text-sm"}`}>
        {getBadgeText(subscription.tier)} Plan
      </span>
    </div>
  );
  
  if (showTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to="/pricing" className="hover:opacity-80 transition-opacity">
              {content}
            </Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getTooltipText(subscription.tier)}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  
  return (
    <Link to="/pricing" className="hover:opacity-80 transition-opacity">
      {content}
    </Link>
  );
}
