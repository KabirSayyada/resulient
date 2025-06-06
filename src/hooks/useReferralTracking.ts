
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export function useReferralTracking() {
  const { user, session } = useAuth();

  useEffect(() => {
    if (!user || !session) return;

    const handleSubscriptionChange = async () => {
      try {
        // Check if user has any successful subscription
        const { data: subscription } = await supabase
          .from('user_subscriptions')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .single();

        if (subscription) {
          // Check if this user was referred
          const { data: referral } = await supabase
            .from('referrals')
            .select('*')
            .eq('referred_user_id', user.id)
            .eq('status', 'pending')
            .single();

          if (referral) {
            // Update referral status to successful
            await supabase
              .from('referrals')
              .update({
                status: 'successful',
                converted_at: new Date().toISOString(),
                subscription_purchase_id: subscription.gumroad_purchase_id || subscription.id
              })
              .eq('id', referral.id);

            // Check if referrer should get rewards
            await supabase.rpc('check_referral_rewards', {
              referrer_id: referral.referrer_user_id
            });

            console.log('Referral tracking updated for successful subscription');
          }
        }
      } catch (error) {
        console.error('Error tracking referral:', error);
      }
    };

    // Check immediately
    handleSubscriptionChange();
  }, [user, session]);

  const processReferralFromUrl = async () => {
    if (!user) return;

    try {
      // Check for referral code in URL params
      const urlParams = new URLSearchParams(window.location.search);
      const referralCode = urlParams.get('ref');
      
      if (referralCode) {
        // Check if user was already referred
        const { data: existingReferral } = await supabase
          .from('referrals')
          .select('id')
          .eq('referred_user_id', user.id)
          .single();

        if (!existingReferral) {
          // Find the referrer by code
          const { data: referrer } = await supabase
            .from('profiles')
            .select('id')
            .eq('referral_code', referralCode.toUpperCase())
            .single();

          if (referrer && referrer.id !== user.id) {
            // Create referral record
            await supabase
              .from('referrals')
              .insert({
                referrer_user_id: referrer.id,
                referred_user_id: user.id,
                referral_code: referralCode.toUpperCase(),
                status: 'pending'
              });

            console.log('Referral created from URL parameter');
          }
        }

        // Clean up URL
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete('ref');
        window.history.replaceState({}, '', newUrl.toString());
      }
    } catch (error) {
      console.error('Error processing referral from URL:', error);
    }
  };

  useEffect(() => {
    if (user) {
      processReferralFromUrl();
    }
  }, [user]);
}
