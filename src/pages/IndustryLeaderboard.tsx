
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { IndustryLeaderboardSection } from "@/components/resume/components/IndustryLeaderboardSection";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { supabase } from "@/integrations/supabase/client";
import { ScoreData } from "@/types/resume";
import { useState } from "react";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";

const IndustryLeaderboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [latestScore, setLatestScore] = useState<ScoreData | null>(null);
  const { subscription } = useSubscription();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchLatestScore();
    }
  }, [user, loading, navigate]);

  const fetchLatestScore = async () => {
    try {
      const { data, error } = await supabase
        .from("resume_scores")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;

      if (data) {
        const formattedScore: ScoreData = {
          overallScore: data.overall_score,
          skillsAlignment: data.skills_breadth,
          WorkExperience: data.experience_duration,
          Achievements: data.experience_duration,
          EducationQuality: data.content_structure,
          Certifications: data.ats_readiness,
          ContentStructure: data.content_structure,
          keywordRelevance: data.keyword_relevance,
          Industry: data.industry,
          percentile: getPercentileString(data.percentile),
          numSimilarResumes: data.percentile || 12000,
          suggestedSkills: data.suggested_skills || [],
          eliteIndicatorsFound: data.suggested_skills || [],
          improvementTips: data.suggested_skills?.map(s => `Add ${s} to your resume`) || [],
          timestamp: new Date(data.created_at).toLocaleString(),
          id: data.id,
          scoringMode: "resumeOnly"
        };
        setLatestScore(formattedScore);
      }
    } catch (error) {
      console.error("Error fetching latest score:", error);
    }
  };

  const getPercentileString = (percentile: number | null): string => {
    if (!percentile) return "Average";
    if (percentile >= 99) return "Top 1%";
    if (percentile >= 95) return "Top 5%";
    if (percentile >= 90) return "Top 10%";
    if (percentile >= 75) return "Top 25%";
    if (percentile >= 65) return "Above Average";
    if (percentile >= 45) return "Average";
    if (percentile >= 30) return "Below Average";
    return "Bottom 25%";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${
      subscription.tier === "premium" 
        ? "from-indigo-100 via-blue-50 to-indigo-100 dark:from-indigo-950 dark:via-blue-950 dark:to-indigo-950" 
        : subscription.tier === "platinum" 
          ? "from-purple-50 via-indigo-100 to-purple-50 dark:from-purple-950 dark:via-indigo-950 dark:to-purple-950" 
          : "from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-950"
    } py-4 sm:py-8 px-3 sm:px-6 lg:px-8 transition-colors duration-300`}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
              Resulient
            </span>
            <span className="rounded-full px-2 py-1 text-xs sm:text-sm font-semibold bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300 shadow border border-fuchsia-200 dark:border-fuchsia-800 animate-fade-in whitespace-nowrap">
              Industry Leaderboard
            </span>
          </div>
          <div className="flex items-center gap-2">
            <SubscriptionTierIndicator variant="badge" size="md" className="animate-fade-in" />
            <UserMenuWithTheme />
          </div>
        </div>

        {/* Subscription Tier Banner - highly visible */}
        {subscription.tier !== "free" && (
          <div className={`mb-6 py-2 px-4 rounded-lg shadow-md border animate-fade-in text-center ${
            subscription.tier === "premium" 
              ? "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200" 
              : "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200"
          }`}>
            <SubscriptionTierIndicator variant="full" size="lg" showTooltip={false} className="justify-center" />
          </div>
        )}

        <MainNavigation />

        {latestScore ? (
          <IndustryLeaderboardSection scoreData={latestScore} />
        ) : (
          <div className="text-center py-8">
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">No Resume Scores Yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Score your first resume to see where you stand in your industry!</p>
          </div>
        )}
      </div>
      <div className="mt-8">
        <LegalFooter />
      </div>
    </div>
  );
};

export default IndustryLeaderboard;
