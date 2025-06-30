
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

type AuthContextValue = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
  isAdmin: () => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// List of admin emails
const ADMIN_EMAILS = [
  'admin@resulient.com',
  'ringimkabir6@gmail.com',
  'sayyidgarba20@gmail.com'
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Handle referral tracking when user signs in/up
      if (session?.user) {
        setTimeout(() => {
          processReferralTracking(session.user);
        }, 0);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        setTimeout(() => {
          processReferralTracking(session.user);
        }, 0);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const processReferralTracking = async (user: User) => {
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

      // Check if user has active subscription and update referral status
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
      console.error('Error processing referral tracking:', error);
    }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    // Redirect to landing page after logout
    window.location.href = '/';
  };

  // Check if the current user is an admin
  const isAdmin = () => {
    if (!user || !user.email) return false;
    return ADMIN_EMAILS.includes(user.email);
  };

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
