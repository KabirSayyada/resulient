import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useResumeScoring } from "@/hooks/useResumeScoring";
import { useSubscription } from "@/hooks/useSubscription";
import { ScoreResultSection } from "@/components/resume/ScoreResultSection";
import { ScoreHistory } from "@/components/resume/ScoreHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Diamond } from "lucide-react";
import { ResumeScoringForm } from "@/components/resume/ResumeScoringForm";
import { supabase } from "@/integrations/supabase/client";
import { ScoreData, ResumeScoreRecord } from "@/types/resume";
import { Button } from "@/components/ui/button";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { GuidedTour } from "@/components/onboarding/GuidedTour";
import { UseSubscriptionAlert } from "@/components/subscription/UseSubscriptionAlert";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { useUsageLimits } from "@/hooks/useUsageLimits";

const ResumeScoring = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resumeContent, setResumeContent] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const { scoreData, scoreHistory, setScoreHistory, isScoring, hasReachedLimit, handleScoreResume } = useResumeScoring(user?.id);
  const { subscription } = useSubscription();
  const { usage, showLimitReachedMessage } = useUsageLimits();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchScoreHistory();
    }
  }, [user, authLoading, navigate]);

  const fetchScoreHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("resume_scores")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      if (data) {
        const formattedHistory: ScoreData[] = data.map((item: ResumeScoreRecord) => {
          // Convert numeric percentile to text representation
          const percentileString = (() => {
            const percentile = item.percentile || 50;
            if (percentile >= 99) return "Top 1%";
            if (percentile >= 95) return "Top 5%";
            if (percentile >= 90) return "Top 10%";
            if (percentile >= 75) return "Top 25%";
            if (percentile >= 65) return "Above Average";
            if (percentile >= 45) return "Average";
            if (percentile >= 30) return "Below Average";
            return "Bottom 25%";
          })();

          console.log("Raw item data:", item);
          
          // Create a properly structured ScoreData object with all fields, handling missing fields
          return {
            overallScore: item.overall_score,
            skillsAlignment: item.skills_breadth || 0,
            WorkExperience: item.experience_duration || 0,
            // Map directly to the dedicated fields, now that we've added them to the database
            Achievements: item.achievements_score || 0,
            EducationQuality: item.education_score || 0,
            Certifications: item.certifications_score || 0,
            ContentStructure: item.content_structure || 0,
            keywordRelevance: item.keyword_relevance || 0,
            Industry: item.industry || "",
            percentile: percentileString,
            numSimilarResumes: item.similar_resumes || 12000,
            suggestedSkills: item.suggested_skills || [],
            eliteIndicatorsFound: item.elite_indicators || [],
            improvementTips: item.improvement_tips || 
              (item.suggested_skills?.map(s => `Add ${s} to your resume`) || []),
            missingQualifications: [],
            timestamp: new Date(item.created_at).toLocaleString(),
            id: item.id,
            scoringMode: (item.scoring_mode as "resumeOnly" | "jobDescription") || "resumeOnly",
          };
        });
        
        setScoreHistory(formattedHistory);
        console.log("Loaded score history:", formattedHistory);
      }
    } catch (error) {
      console.error("Error fetching score history:", error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  const onScore = () => {
    // Check if user has reached limit
    if (usage.resumeScorings.hasReachedLimit) {
      showLimitReachedMessage("resume scoring");
      return;
    }

    const dailyLimit = subscription.limits.resumeScorings;
    handleScoreResume(resumeContent, dailyLimit);
  };

  // Show upgrade alert if reached limit and on free tier
  const showUpgradeAlert = usage.resumeScorings.hasReachedLimit && subscription.tier === "free";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-950 dark:text-white py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center">
              <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                Resulient
              </span>
            </Link>
            <span className="rounded-full px-2 py-1 text-xs sm:text-sm font-semibold bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300 shadow border border-fuchsia-200 dark:border-fuchsia-700 animate-fade-in whitespace-nowrap">
              Resume Score Analyzer
            </span>
          </div>
          <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
            <Button 
              variant="ghost" 
              size="sm" 
              className="flex items-center gap-1 sm:hidden"
              asChild
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2 sm:gap-3">
              <SubscriptionTierIndicator variant="badge" size="sm" />
              <UserMenuWithTheme />
            </div>
          </div>
        </div>

        {/* Info block for Resume Scoring */}
        <div className={`bg-gradient-to-br ${subscription.tier === "premium" ? "from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-950 dark:via-indigo-950 dark:to-blue-900 border-blue-200 dark:border-blue-800" : subscription.tier === "platinum" ? "from-purple-50 via-indigo-50 to-fuchsia-100 dark:from-purple-950 dark:via-indigo-950 dark:to-fuchsia-900 border-purple-200 dark:border-purple-800" : "from-fuchsia-50 via-indigo-50 to-blue-50 dark:from-fuchsia-950 dark:via-indigo-950 dark:to-blue-950 border-indigo-100 dark:border-indigo-800"} rounded-xl border shadow-md px-4 py-5 mb-6 sm:px-7 max-w-2xl mx-auto text-center transition-all duration-300`}>
          <div className="text-lg sm:text-xl font-semibold text-indigo-900 dark:text-indigo-200 leading-snug mb-0 flex flex-wrap items-center justify-center gap-2">
            {subscription.tier !== "free" && (
              <SubscriptionTierIndicator variant="icon" size="lg" showTooltip={false} />
            )}
            <span className="text-fuchsia-700 dark:text-fuchsia-400 font-bold">
              {subscription.tier !== "free" ? 
                `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Unlimited Access` : 
                "New!"
              } 
            </span> 
            &nbsp;Unlock insights with <span className="text-fuchsia-700 dark:text-fuchsia-400 font-bold">Resulient Resume Scoring</span>
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 max-w-2xl mx-auto">
            Instantly compare your resume to <span className="font-bold text-indigo-700 dark:text-indigo-400">hundreds of thousands</span> of real career journeys. 
            Using Artificial Intelligence, Resulient shows you exactly where you stand among your competition—so you know how to outshine other applicants.
          </p>
          {subscription.tier !== "free" && (
            <div className="mt-3 text-sm font-medium text-indigo-700 dark:text-indigo-400">
              {subscription.tier === "premium" ? 
                "You have unlimited resume scoring with your Premium plan!" : 
                "You have unlimited resume scoring with your Platinum plan!"}
            </div>
          )}
        </div>
        {/* End info block */}

        <Button 
          variant="ghost" 
          size="sm" 
          className="mb-4 hidden sm:flex items-center gap-1"
          asChild
        >
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <MainNavigation />

        {showUpgradeAlert && (
          <UseSubscriptionAlert 
            subscriptionTier={subscription.tier} 
            requiredTier="premium" 
            message="You've reached your daily limit for resume scoring. Free users can perform 2 resume scorings per day. Upgrade to Premium or Platinum for unlimited usage."
          />
        )}

        <Tabs defaultValue="current" className="mb-8" onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-lg shadow overflow-hidden border border-indigo-200">
            <TabsTrigger value="current">New Analysis</TabsTrigger>
            <TabsTrigger value="history">Score History</TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="space-y-6 mt-6">
            <Card className={`bg-gradient-to-br ${subscription.tier === "premium" ? "from-white via-blue-50 to-indigo-100 border-t-blue-500" : subscription.tier === "platinum" ? "from-white via-purple-50 to-indigo-100 border-t-purple-500" : "from-white via-blue-50 to-indigo-100 border-t-indigo-500"} shadow-md border-t-4 transition-all duration-300`}>
              <CardContent className="space-y-6 pt-6">
                {subscription.tier !== "free" && (
                  <div className="flex items-center justify-center gap-1 text-sm text-indigo-700 dark:text-indigo-400 font-medium">
                    <Diamond className="h-4 w-4" />
                    <span>
                      {subscription.tier === "premium" ? 
                        "Unlimited scoring with Premium" : 
                        "Unlimited scoring with Platinum"}
                    </span>
                  </div>
                )}
                {subscription.tier === "free" && (
                  <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400 font-medium">
                    <span>
                      Daily limit: {usage.resumeScorings.used}/{usage.resumeScorings.limit} resume scorings used
                    </span>
                  </div>
                )}
                <ResumeScoringForm
                  scoringMode="resumeOnly"
                  setScoringMode={() => {}}
                  resumeContent={resumeContent}
                  setResumeContent={setResumeContent}
                  isScoring={isScoring}
                  onScore={onScore}
                  disableButton={usage.resumeScorings.hasReachedLimit && subscription.tier === "free"}
                />
              </CardContent>
            </Card>

            {scoreData && (
              <ScoreResultSection scoreData={scoreData} />
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-6">
            {scoreHistory.length > 0 ? (
              <ScoreHistory scores={scoreHistory} />
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-10">
                  <FileText className="h-12 w-12 text-indigo-400 mb-4" />
                  <h3 className="text-lg font-medium text-indigo-900 dark:text-indigo-100 mb-1">No Score History</h3>
                  <p className="text-indigo-600 dark:text-indigo-300 text-center max-w-md">
                    You haven't analyzed any resumes yet. Start by uploading your resume to get detailed, actionable feedback and colorful charts tracking your progress.
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="mt-8">
        <LegalFooter />
      </div>
      <GuidedTour />
    </div>
  );
};

export default ResumeScoring;
