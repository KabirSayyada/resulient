
import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";
import { useReferralTracking } from "@/hooks/useReferralTracking";

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
  const { processReferralOnSignup } = useReferralTracking();

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
  }, [processReferralOnSignup]);

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
