
import { useState } from "react";
import { useReferrals } from "@/hooks/useReferrals";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Users, Gift, Trophy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function ReferralDashboard() {
  const { 
    referrals, 
    rewards, 
    referralCode, 
    loading, 
    successfulReferrals, 
    pendingReferrals, 
    pendingRewards,
    processReferralCode 
  } = useReferrals();
  const { toast } = useToast();
  const [referralInput, setReferralInput] = useState("");

  const copyReferralCode = () => {
    if (referralCode) {
      navigator.clipboard.writeText(referralCode);
      toast({
        title: "Copied!",
        description: "Your referral code has been copied to clipboard.",
      });
    }
  };

  const handleProcessReferral = () => {
    if (referralInput.trim()) {
      processReferralCode(referralInput.trim());
      setReferralInput("");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'successful':
        return <Badge variant="default" className="bg-green-500">Successful</Badge>;
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRewardStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Pending</Badge>;
      case 'granted':
        return <Badge variant="default" className="bg-green-500">Granted</Badge>;
      case 'used':
        return <Badge variant="outline">Used</Badge>;
      case 'expired':
        return <Badge variant="destructive">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Your Referral Code</CardTitle>
            <Copy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <code className="text-2xl font-bold">{referralCode || "Loading..."}</code>
              <Button variant="outline" size="sm" onClick={copyReferralCode}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {pendingReferrals} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress to Reward</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successfulReferrals % 3}/3</div>
            <p className="text-xs text-muted-foreground">
              {3 - (successfulReferrals % 3)} more for next reward
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Rewards</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRewards}</div>
            <p className="text-xs text-muted-foreground">
              Premium month rewards
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enter Referral Code */}
      <Card>
        <CardHeader>
          <CardTitle>Enter Referral Code</CardTitle>
          <CardDescription>
            If someone referred you, enter their referral code here to give them credit when you upgrade.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="Enter referral code"
              value={referralInput}
              onChange={(e) => setReferralInput(e.target.value.toUpperCase())}
              className="uppercase"
            />
            <Button onClick={handleProcessReferral}>Submit</Button>
          </div>
        </CardContent>
      </Card>

      {/* Referral Rewards */}
      {rewards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Rewards</CardTitle>
            <CardDescription>
              Rewards earned from successful referrals
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {rewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{reward.reward_type.replace('_', ' ').toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      Earned on {new Date(reward.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {getRewardStatusBadge(reward.status)}
                    <p className="text-xs text-muted-foreground mt-1">
                      For {reward.referral_count} referrals
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Referrals List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referrals</CardTitle>
          <CardDescription>
            People you've referred to the platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No referrals yet. Share your referral code to start earning rewards!
            </p>
          ) : (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div key={referral.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">Referral #{referral.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      Referred on {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                    {referral.converted_at && (
                      <p className="text-sm text-muted-foreground">
                        Converted on {new Date(referral.converted_at).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {getStatusBadge(referral.status)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
