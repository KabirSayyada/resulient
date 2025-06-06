
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useReferrals } from "@/hooks/useReferrals";
import { Copy, Users, Gift, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export const ReferralDashboard = () => {
  const { stats, loading, copyReferralLink, generateReferralLink } = useReferrals();

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Unable to load referral information</p>
      </div>
    );
  }

  const progressPercentage = (stats.progressToNextReward / 3) * 100;
  const referralsNeeded = 3 - stats.progressToNextReward;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Referral Program</h2>
        <p className="text-muted-foreground">
          Refer 3 friends who subscribe and get 1 month of premium free!
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingReferrals} pending
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful Referrals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.successfulReferrals}</div>
            <p className="text-xs text-muted-foreground">
              Converted to subscriptions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rewards.length}</div>
            <p className="text-xs text-muted-foreground">
              Free premium months
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Referral Link */}
      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={generateReferralLink()}
              readOnly
              className="flex-1 px-3 py-2 border border-input bg-background rounded-md text-sm"
            />
            <Button onClick={copyReferralLink} size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this link with friends. When they sign up and subscribe, you'll get credit!
          </p>
        </CardContent>
      </Card>

      {/* Progress to Next Reward */}
      <Card>
        <CardHeader>
          <CardTitle>Progress to Next Reward</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span>{stats.progressToNextReward} of 3 successful referrals</span>
            <span>{referralsNeeded} more needed</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          {referralsNeeded === 0 ? (
            <p className="text-sm font-medium text-green-600">
              🎉 You've earned a free premium month! Check your rewards below.
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">
              Refer {referralsNeeded} more friend{referralsNeeded > 1 ? 's' : ''} who subscribe to earn 1 month of premium free!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Recent Referrals */}
      {stats.referrals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Referrals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.referrals.slice(0, 5).map((referral) => (
                <div key={referral.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      Referral #{referral.id.slice(0, 8)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(referral.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      referral.status === 'successful' 
                        ? 'default' 
                        : referral.status === 'pending' 
                        ? 'secondary' 
                        : 'destructive'
                    }
                  >
                    {referral.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rewards History */}
      {stats.rewards.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Rewards History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.rewards.map((reward) => (
                <div key={reward.id} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">
                      1 Month Premium
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Earned {new Date(reward.earned_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge 
                    variant={
                      reward.status === 'granted' 
                        ? 'default' 
                        : reward.status === 'pending' 
                        ? 'secondary' 
                        : 'destructive'
                    }
                  >
                    {reward.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
