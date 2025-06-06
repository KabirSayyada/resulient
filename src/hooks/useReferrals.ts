
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Referral {
  id: string;
  referred_user_id: string;
  referral_code: string;
  status: 'pending' | 'successful' | 'expired';
  created_at: string;
  converted_at: string | null;
}

export interface ReferralReward {
  id: string;
  reward_type: string;
  status: 'pending' | 'granted' | 'used' | 'expired';
  earned_at: string;
  granted_at: string | null;
  expires_at: string | null;
  referral_count: number;
}

export interface ReferralStats {
  referralCode: string;
  totalReferrals: number;
  successfulReferrals: number;
  pendingReferrals: number;
  referrals: Referral[];
  rewards: ReferralReward[];
  progressToNextReward: number;
}

export function useReferrals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<ReferralStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReferralStats = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get user's referral code from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (!profile?.referral_code) {
        console.error("User profile or referral code not found");
        setLoading(false);
        return;
      }

      // Get referrals made by this user
      const { data: referrals } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('created_at', { ascending: false });

      // Get rewards earned by this user
      const { data: rewards } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });

      const totalReferrals = referrals?.length || 0;
      const successfulReferrals = referrals?.filter(r => r.status === 'successful').length || 0;
      const pendingReferrals = referrals?.filter(r => r.status === 'pending').length || 0;
      const progressToNextReward = successfulReferrals % 3;

      setStats({
        referralCode: profile.referral_code,
        totalReferrals,
        successfulReferrals,
        pendingReferrals,
        referrals: referrals || [],
        rewards: rewards || [],
        progressToNextReward,
      });
    } catch (error) {
      console.error("Error fetching referral stats:", error);
      toast({
        title: "Error",
        description: "Failed to load referral information",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const generateReferralLink = (baseUrl: string = window.location.origin) => {
    if (!stats?.referralCode) return '';
    return `${baseUrl}?ref=${stats.referralCode}`;
  };

  const copyReferralLink = async () => {
    const link = generateReferralLink();
    if (link) {
      try {
        await navigator.clipboard.writeText(link);
        toast({
          title: "Success",
          description: "Referral link copied to clipboard!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy referral link",
          variant: "destructive",
        });
      }
    }
  };

  useEffect(() => {
    fetchReferralStats();
  }, [user]);

  return {
    stats,
    loading,
    generateReferralLink,
    copyReferralLink,
    refreshStats: fetchReferralStats,
  };
}
