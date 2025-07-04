import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useResumeScoring } from "@/hooks/useResumeScoring";
import { useSubscription } from "@/hooks/useSubscription";
import { ScoreHistory } from "@/components/resume/ScoreHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Diamond } from "lucide-react";
import { ResumeScoringForm } from "@/components/resume/ResumeScoringForm";
import { ResumeScoreModal } from "@/components/resume/ResumeScoreModal";
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
  const [hasScored, setHasScored] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const { scoreData, scoreHistory, setScoreHistory, isScoring, hasReachedLimit, handleScoreResume } = useResumeScoring(user?.id);
  const { subscription } = useSubscription();
  const { usage, showLimitReachedMessage, checkUsage } = useUsageLimits();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    } else if (user) {
      fetchScoreHistory();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    if (scoreData && subscription.tier === "free") {
      setHasScored(true);
    }
  }, [scoreData, subscription.tier]);

  useEffect(() => {
    if (usage.resumeScorings.used === 0 && subscription.tier === "free") {
      setHasScored(false);
    }
  }, [usage.resumeScorings.used, subscription.tier]);

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

          return {
            overallScore: item.overall_score,
            skillsAlignment: item.skills_breadth || 0,
            WorkExperience: item.experience_duration || 0,
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

  const onScore = async () => {
    if (usage.resumeScorings.hasReachedLimit || (subscription.tier === "free" && hasScored)) {
      showLimitReachedMessage("resume scoring");
      return;
    }

    // Show modal when scoring starts
    setShowScoreModal(true);
    
    const dailyLimit = subscription.limits.resumeScorings;
    await handleScoreResume(resumeContent, dailyLimit);
    
    if (subscription.tier === "free") {
      setHasScored(true);
    }
    
    await checkUsage();
  };

  const showUpgradeAlert = (usage.resumeScorings.hasReachedLimit || hasScored) && subscription.tier === "free";
  const isButtonDisabled = usage.resumeScorings.hasReachedLimit || (subscription.tier === "free" && hasScored);

  return (
    <>
      <div className={`min-h-screen transition-all duration-500 py-4 sm:py-8 px-3 sm:px-6 lg:px-8 ${
        subscription.tier === "premium" 
          ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950" 
          : subscription.tier === "platinum" 
            ? "bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:from-purple-950 dark:via-indigo-950 dark:to-pink-950" 
            : "bg-gradient-to-br from-fuchsia-50 via-indigo-50 to-blue-50 dark:from-fuchsia-950 dark:via-indigo-950 dark:to-blue-950"
      }`}>
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-96 h-96 bg-gradient-to-br from-purple-200/10 to-blue-200/10 rounded-full -translate-y-48 -translate-x-48 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-to-tl from-indigo-200/10 to-fuchsia-200/10 rounded-full translate-y-40 translate-x-40 animate-pulse delay-1000"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/ats-resume-builder" className="flex items-center group">
                <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-fuchsia-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none group-hover:scale-105 transition-transform duration-300">
                  Resulient
                </span>
              </Link>
              <div className="relative">
                <span className="rounded-full px-3 py-2 text-xs sm:text-sm font-semibold bg-gradient-to-r from-fuchsia-100 to-purple-100 text-fuchsia-700 dark:from-fuchsia-900/60 dark:to-purple-900/60 dark:text-fuchsia-300 shadow-lg border border-fuchsia-200 dark:border-fuchsia-700 animate-fade-in whitespace-nowrap backdrop-blur-sm">
                  ✨ Resume Score Analyzer
                </span>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-fuchsia-500 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 sm:hidden hover:scale-105 transition-transform duration-200"
                asChild
              >
                <Link to="/ats-resume-builder">
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Link>
              </Button>
              <div className="flex items-center gap-2 sm:gap-3">
                <SubscriptionTierIndicator variant="badge" size="sm" className="animate-fade-in" />
                <UserMenuWithTheme />
              </div>
            </div>
          </div>

          {/* Enhanced Hero Section */}
          <div className={`relative overflow-hidden transition-all duration-500 ${
            subscription.tier === "premium" 
              ? "bg-gradient-to-br from-blue-50/80 via-indigo-50/60 to-purple-50/80 dark:from-blue-950/80 dark:via-indigo-950/60 dark:to-purple-950/80 border-blue-200/60 dark:border-blue-800/60" 
              : subscription.tier === "platinum" 
                ? "bg-gradient-to-br from-purple-50/80 via-indigo-50/60 to-pink-50/80 dark:from-purple-950/80 dark:via-indigo-950/60 dark:to-pink-950/80 border-purple-200/60 dark:border-purple-800/60" 
                : "bg-gradient-to-br from-fuchsia-50/80 via-indigo-50/60 to-blue-50/80 dark:from-fuchsia-950/80 dark:via-indigo-950/60 dark:to-blue-950/80 border-fuchsia-200/60 dark:border-fuchsia-800/60"
          } rounded-2xl border shadow-xl backdrop-blur-sm px-6 py-8 mb-8 text-center max-w-3xl mx-auto`}>
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-fuchsia-200/20 to-purple-200/20 rounded-full -translate-y-16 -translate-x-16 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-gradient-to-tl from-indigo-200/20 to-blue-200/20 rounded-full translate-y-12 translate-x-12 animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-fuchsia-500 to-purple-600 rounded-xl shadow-lg animate-pulse">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="text-lg sm:text-xl font-bold text-indigo-900 dark:text-indigo-200 leading-snug flex flex-wrap items-center justify-center gap-2">
                  {subscription.tier !== "free" && (
                    <SubscriptionTierIndicator variant="icon" size="lg" showTooltip={false} className="animate-bounce" />
                  )}
                  <span className="text-fuchsia-700 dark:text-fuchsia-400 font-extrabold">
                    {subscription.tier !== "free" ? 
                      `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Unlimited Access` : 
                      "New!"
                    } 
                  </span>
                </div>
              </div>
              
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-fuchsia-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                Unlock insights with Resulient Resume Scoring
              </h1>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
                Instantly compare your resume to <span className="font-bold text-indigo-700 dark:text-indigo-400">hundreds of thousands</span> of real career journeys. 
                Using Artificial Intelligence, Resulient shows you exactly where you stand among your competition—so you know how to outshine other applicants.
              </p>
              
              {subscription.tier !== "free" && (
                <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-700 dark:text-indigo-400 bg-white/60 dark:bg-gray-800/60 px-4 py-2 rounded-full backdrop-blur-sm">
                  <Diamond className="h-4 w-4 animate-pulse" />
                  <span>
                    {subscription.tier === "premium" ? 
                      "You have unlimited resume scoring with your Premium plan!" : 
                      "You have unlimited resume scoring with your Platinum plan!"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Back Button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-6 hidden sm:flex items-center gap-2 hover:scale-105 transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-800/20 backdrop-blur-sm"
            asChild
          >
            <Link to="/ats-resume-builder">
              <ArrowLeft className="h-4 w-4" />
              Back to Resume Builder
            </Link>
          </Button>

          <MainNavigation />

          {showUpgradeAlert && (
            <div className="mb-6 animate-fade-in">
              <UseSubscriptionAlert 
                subscriptionTier={subscription.tier} 
                requiredTier="premium" 
                message="You've reached your daily limit for resume scoring. Free users can perform 1 resume scoring per day. Upgrade to Premium or Platinum for unlimited usage."
              />
            </div>
          )}

          {/* Enhanced Tabs */}
          <Tabs defaultValue="current" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className={`grid w-full max-w-md mx-auto grid-cols-2 rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
              subscription.tier === "premium" 
                ? "bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 border-blue-200 dark:border-blue-700" 
                : subscription.tier === "platinum" 
                  ? "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 border-purple-200 dark:border-purple-700" 
                  : "bg-gradient-to-r from-fuchsia-100 to-indigo-100 dark:from-fuchsia-900/50 dark:to-indigo-900/50 border-fuchsia-200 dark:border-fuchsia-700"
            } border backdrop-blur-sm`}>
              <TabsTrigger 
                value="current" 
                className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-md transition-all duration-200 font-semibold hover:scale-105"
              >
                New Analysis
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-white/80 dark:data-[state=active]:bg-gray-800/80 data-[state=active]:shadow-md transition-all duration-200 font-semibold hover:scale-105"
              >
                Score History
              </TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6 mt-8">
              <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-xl animate-fade-in ${
                subscription.tier === "premium" 
                  ? "bg-gradient-to-br from-white via-blue-50/80 to-indigo-100/80 border-t-blue-500 shadow-blue-100/50 dark:shadow-blue-900/30" 
                  : subscription.tier === "platinum" 
                    ? "bg-gradient-to-br from-white via-purple-50/80 to-pink-100/80 border-t-purple-500 shadow-purple-100/50 dark:shadow-purple-900/30" 
                    : "bg-gradient-to-br from-white via-fuchsia-50/80 to-indigo-100/80 border-t-fuchsia-500 shadow-fuchsia-100/50 dark:shadow-fuchsia-900/30"
              } shadow-lg border-t-4 backdrop-blur-sm`}>
                {/* Subtle animated background */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-purple-100/20 to-blue-100/20 rounded-full -translate-y-20 translate-x-20 animate-pulse delay-500"></div>
                
                <CardContent className="space-y-6 pt-6 relative z-10">
                  {subscription.tier !== "free" && (
                    <div className="flex items-center justify-center gap-2 text-sm font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 text-indigo-700 dark:text-indigo-300 px-4 py-2 rounded-full shadow-sm animate-fade-in">
                      <Diamond className="h-4 w-4 animate-pulse" />
                      <span>
                        {subscription.tier === "premium" ? 
                          "Unlimited scoring with Premium" : 
                          "Unlimited scoring with Platinum"}
                      </span>
                    </div>
                  )}
                  {subscription.tier === "free" && (
                    <div className="flex items-center justify-center gap-2 text-sm font-medium bg-gradient-to-r from-gray-100 to-blue-100 dark:from-gray-800/50 dark:to-blue-800/50 text-gray-600 dark:text-gray-400 px-4 py-2 rounded-full shadow-sm animate-fade-in">
                      <span>
                        Daily limit: {hasScored ? 1 : usage.resumeScorings.used}/{usage.resumeScorings.limit} resume scoring used
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
                    disableButton={isButtonDisabled}
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="mt-8">
              {scoreHistory.length > 0 ? (
                <div className="animate-fade-in">
                  <ScoreHistory scores={scoreHistory} />
                </div>
              ) : (
                <Card className="bg-gradient-to-br from-white via-gray-50/80 to-blue-50/80 dark:from-gray-800 dark:via-gray-800/80 dark:to-blue-900/20 shadow-lg backdrop-blur-sm animate-fade-in">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="p-4 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full mb-6 animate-pulse">
                      <FileText className="h-12 w-12 text-indigo-500 dark:text-indigo-400" />
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-3">No Score History</h3>
                    <p className="text-indigo-600 dark:text-indigo-300 text-center max-w-md leading-relaxed">
                      You haven't analyzed any resumes yet. Start by uploading your resume to get detailed, actionable feedback and colorful charts tracking your progress.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
        <div className="mt-12 relative z-10">
          <LegalFooter />
        </div>
        <GuidedTour />
      </div>

      {/* Score Modal */}
      <ResumeScoreModal
        isOpen={showScoreModal}
        onClose={() => setShowScoreModal(false)}
        scoreData={scoreData}
        isScoring={isScoring}
      />
    </>
  );
};

export default ResumeScoring;
