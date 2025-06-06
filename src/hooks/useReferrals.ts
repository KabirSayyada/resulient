
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Referral {
  id: string;
  referred_user_id: string;
  referral_code: string;
  status: string;
  created_at: string;
  converted_at: string | null;
  subscription_purchase_id: string | null;
}

export interface ReferralReward {
  id: string;
  reward_type: string;
  status: string;
  earned_at: string;
  granted_at: string | null;
  expires_at: string | null;
  referral_count: number;
}

export function useReferrals() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [referralCode, setReferralCode] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchReferrals = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      
      // Fetch user's referral code
      const { data: profile } = await supabase
        .from('profiles')
        .select('referral_code')
        .eq('id', user.id)
        .single();
      
      if (profile?.referral_code) {
        setReferralCode(profile.referral_code);
      }
      
      // Fetch referrals made by this user
      const { data: referralsData, error: referralsError } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (referralsError) {
        console.error("Error fetching referrals:", referralsError);
        return;
      }
      
      setReferrals(referralsData || []);
      
      // Fetch referral rewards
      const { data: rewardsData, error: rewardsError } = await supabase
        .from('referral_rewards')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false });
      
      if (rewardsError) {
        console.error("Error fetching referral rewards:", rewardsError);
        return;
      }
      
      setRewards(rewardsData || []);
    } catch (error) {
      console.error("Error in fetchReferrals:", error);
    } finally {
      setLoading(false);
    }
  };

  const processReferralCode = async (code: string) => {
    if (!user || !code) return;
    
    try {
      // Check if user was already referred
      const { data: existingReferral } = await supabase
        .from('referrals')
        .select('id')
        .eq('referred_user_id', user.id)
        .single();
      
      if (existingReferral) {
        toast({
          title: "Already Referred",
          description: "You've already been referred by someone else.",
          variant: "destructive",
        });
        return;
      }
      
      // Find the referrer by code
      const { data: referrer } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', code.toUpperCase())
        .single();
      
      if (!referrer) {
        toast({
          title: "Invalid Code",
          description: "The referral code you entered is not valid.",
          variant: "destructive",
        });
        return;
      }
      
      if (referrer.id === user.id) {
        toast({
          title: "Self Referral",
          description: "You cannot refer yourself.",
          variant: "destructive",
        });
        return;
      }
      
      // Create referral record
      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_user_id: referrer.id,
          referred_user_id: user.id,
          referral_code: code.toUpperCase(),
          status: 'pending'
        });
      
      if (error) {
        console.error("Error creating referral:", error);
        toast({
          title: "Error",
          description: "Failed to process referral code.",
          variant: "destructive",
        });
        return;
      }
      
      toast({
        title: "Referral Processed",
        description: "You've been successfully referred! When you upgrade to a paid plan, your referrer will be credited.",
      });
    } catch (error) {
      console.error("Error processing referral code:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (user) {
      fetchReferrals();
    }
  }, [user]);

  const successfulReferrals = referrals.filter(r => r.status === 'successful').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const pendingRewards = rewards.filter(r => r.status === 'pending').length;

  return {
    referrals,
    rewards,
    referralCode,
    loading,
    successfulReferrals,
    pendingReferrals,
    pendingRewards,
    fetchReferrals,
    processReferralCode,
  };
}
