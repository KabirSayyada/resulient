
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
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      // Process referral when user signs up
      if (event === 'SIGNED_IN' && session?.user) {
        await processReferralOnSignup(session.user.id);
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
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
