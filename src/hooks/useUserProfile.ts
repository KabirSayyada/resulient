
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export type UserProfile = {
  id: string;
  first_name: string;
  last_name: string;
  job_title?: string | null;
  avatar_url?: string | null;
  show_avatar_on_scorecard?: boolean;
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
        .select("id, username, first_name, last_name, avatar_url, job_title, show_avatar_on_scorecard")
        .eq("id", userId)
        .maybeSingle();

      if (data) {
        // For backward compatibility with existing profiles
        let firstName = data.first_name || "";
        let lastName = data.last_name || "";
        
        // If first_name or last_name are not set but username is, parse from username
        if ((!firstName || !lastName) && data.username && typeof data.username === 'string') {
          const nameParts = data.username.split(" ");
          firstName = firstName || nameParts[0] || "";
          lastName = lastName || nameParts.slice(1).join(" ") || "";
        }
        
        setProfile({
          id: data.id,
          first_name: firstName,
          last_name: lastName,
          job_title: data.job_title || "",
          avatar_url: data.avatar_url,
          show_avatar_on_scorecard: data.show_avatar_on_scorecard ?? true,
        });
      }
      setLoading(false);
    };
    fetchProfile();
  }, [userId]);

  return { profile, setProfile, loading };
}
