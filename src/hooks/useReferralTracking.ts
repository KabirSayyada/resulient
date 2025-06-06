
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function useReferralTracking() {
  const { user } = useAuth();

  useEffect(() => {
    const trackReferral = async () => {
      // Only track for new users (not already signed in)
      if (user) return;

      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');
      
      if (referralCode) {
        // Store referral code in localStorage for later use when user signs up
        localStorage.setItem('pendingReferralCode', referralCode);
        console.log('Referral code stored:', referralCode);
      }
    };

    trackReferral();
  }, [user]);

  const processReferralOnSignup = async (newUserId: string) => {
    const pendingReferralCode = localStorage.getItem('pendingReferralCode');
    
    if (!pendingReferralCode) return;

    try {
      // Find the referrer by their referral code
      const { data: referrerProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('referral_code', pendingReferralCode)
        .single();

      if (!referrerProfile) {
        console.error('Referrer not found for code:', pendingReferralCode);
        localStorage.removeItem('pendingReferralCode');
        return;
      }

      // Prevent self-referral
      if (referrerProfile.id === newUserId) {
        console.error('Self-referral attempted');
        localStorage.removeItem('pendingReferralCode');
        return;
      }

      // Create referral record
      const { error } = await supabase
        .from('referrals')
        .insert({
          referrer_user_id: referrerProfile.id,
          referred_user_id: newUserId,
          referral_code: pendingReferralCode,
          status: 'pending'
        });

      if (error) {
        console.error('Error creating referral record:', error);
      } else {
        console.log('Referral recorded successfully');
      }

      // Clean up
      localStorage.removeItem('pendingReferralCode');
    } catch (error) {
      console.error('Error processing referral:', error);
      localStorage.removeItem('pendingReferralCode');
    }
  };

  return { processReferralOnSignup };
}
