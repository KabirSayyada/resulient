
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  job_title?: string | null;
  avatar_url?: string | null;
};

export function useUserProfile(userId?: string) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(!!userId);

  useEffect(() => {
    if (!userId) return;
    const fetchProfile = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, avatar_url")
        .eq("id", userId)
        .single();

      if (data) {
        // Handle backwards compatibility, username used for "First Last"
        let firstName = "";
        let lastName = "";
        if (data.username?.includes(" ")) {
          [firstName, ...lastName] = data.username.split(" ");
          lastName = lastName.join(" ");
        } else {
          firstName = data.username || "";
        }
        setProfile({
          id: data.id,
          first_name: firstName,
          last_name: lastName,
          avatar_url: data.avatar_url,
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  return { profile, setProfile, loading };
}
