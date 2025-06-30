
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface HighestScoringResume {
  id: string;
  resume_content: string;
  overall_score: number;
  industry: string;
}

export const useHighestScoringResume = (userId: string | undefined) => {
  const [highestScoringResume, setHighestScoringResume] = useState<HighestScoringResume | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchHighestScoringResume = async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("resume_scores")
        .select("id, resume_content, overall_score, industry")
        .eq("user_id", userId)
        .order("overall_score", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching highest scoring resume:", error);
        return;
      }

      if (data && data.length > 0) {
        setHighestScoringResume(data[0]);
      }
    } catch (error) {
      console.error("Error fetching highest scoring resume:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHighestScoringResume();
  }, [userId]);

  return {
    highestScoringResume,
    loading,
    refetch: fetchHighestScoringResume
  };
};
