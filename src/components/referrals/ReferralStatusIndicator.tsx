
import { useReferrals } from "@/hooks/useReferrals";
import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";

export function ReferralStatusIndicator() {
  const { pendingRewards, successfulReferrals } = useReferrals();

  if (pendingRewards === 0 && successfulReferrals === 0) {
    return null;
  }

  return (
    <div className="flex items-center space-x-2">
      {pendingRewards > 0 && (
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Gift className="w-3 h-3 mr-1" />
          {pendingRewards} Reward{pendingRewards > 1 ? 's' : ''} Pending
        </Badge>
      )}
      {successfulReferrals > 0 && (
        <Badge variant="outline">
          {successfulReferrals} Referral{successfulReferrals > 1 ? 's' : ''}
        </Badge>
      )}
    </div>
  );
}
