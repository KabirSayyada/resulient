
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useSubscription } from "@/hooks/useSubscription";
import { UseSubscriptionAlert } from "@/components/subscription/UseSubscriptionAlert";
import { supabase } from "@/integrations/supabase/client";

interface DownloadReportButtonProps {
  title: string;
  onClick: () => void;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
}

export function DownloadReportButton({
  title,
  onClick,
  className,
  variant = "default",
  size = "default"
}: DownloadReportButtonProps) {
  const [isDisabled, setIsDisabled] = useState(false);
  const { subscription } = useSubscription();
  const { toast } = useToast();
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  
  // Check if user has reached their daily download limit
  const checkDailyDownloadLimit = async (): Promise<boolean> => {
    if (!subscription || subscription.isLoading) return false;
    
    if (subscription.limits.reportDownloads === -1) {
      // User has unlimited downloads
      return true;
    }
    
    if (subscription.limits.reportDownloads === 0) {
      // User is not allowed to download reports
      return false;
    }
    
    try {
      // Check how many downloads occurred today
      // This would require a new table to track downloads, but for now 
      // we'll just use a localStorage approach for demonstration
      
      // In a production app, you would track this in the database
      const today = new Date().toLocaleDateString();
      const downloadsToday = Number(localStorage.getItem(`report_downloads_${today}`) || "0");
      
      return downloadsToday < subscription.limits.reportDownloads;
    } catch (error) {
      console.error("Error checking download limits:", error);
      return false;
    }
  };
  
  const handleDownloadClick = async () => {
    // Check if user has access to download feature
    const hasAccess = await checkDailyDownloadLimit();
    
    if (!hasAccess) {
      setHasReachedLimit(true);
      
      toast({
        title: "Download Limit Reached",
        description: subscription.tier === "free" 
          ? "Free users cannot download reports. Please upgrade to Premium or Platinum." 
          : "You've reached your daily download limit. Upgrade to Platinum for unlimited downloads.",
        variant: "destructive",
      });
      
      return;
    }
    
    // Increment download count in localStorage
    const today = new Date().toLocaleDateString();
    const downloadsToday = Number(localStorage.getItem(`report_downloads_${today}`) || "0");
    localStorage.setItem(`report_downloads_${today}`, String(downloadsToday + 1));
    
    // Call the original download function
    onClick();
  };
  
  if (hasReachedLimit) {
    return (
      <div className="space-y-3">
        <UseSubscriptionAlert 
          subscriptionTier={subscription.tier} 
          requiredTier={subscription.tier === "free" ? "premium" : "platinum"}
          message={
            subscription.tier === "free" 
              ? "Free users cannot download reports. Upgrade to Premium or Platinum to download reports." 
              : `Premium users can download up to ${subscription.limits.reportDownloads} reports per day. Upgrade to Platinum for unlimited downloads.`
          }
        />
        <Button 
          variant={variant} 
          size={size}
          className={className}
          disabled={true}
        >
          <DownloadIcon className="h-4 w-4 mr-2" />
          {title}
        </Button>
      </div>
    );
  }
  
  return (
    <Button 
      variant={variant} 
      size={size}
      className={className}
      onClick={handleDownloadClick}
      disabled={isDisabled}
    >
      <DownloadIcon className="h-4 w-4 mr-2" />
      {title}
    </Button>
  );
}
