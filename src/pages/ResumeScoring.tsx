import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useResumeScoring } from "@/hooks/useResumeScoring";
import { useSubscription } from "@/hooks/useSubscription";
import { ScoreHistory } from "@/components/resume/ScoreHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Diamond, Sparkles, Target, TrendingUp } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const ResumeScoring = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resumeContent, setResumeContent] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [hasScored, setHasScored] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [animateHeader, setAnimateHeader] = useState(false);
  const { scoreData, scoreHistory, setScoreHistory, isScoring, hasReachedLimit, handleScoreResume } = useResumeScoring(user?.id);
  const { subscription } = useSubscription();
  const { usage, showLimitReachedMessage, checkUsage } = useUsageLimits();

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateHeader(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <span className="text-lg font-semibold text-indigo-900 dark:text-indigo-100">Loading...</span>
        </div>
      </div>
    );
  }

  const onScore = async () => {
    if (usage.resumeScorings.hasReachedLimit || (subscription.tier === "free" && hasScored)) {
      showLimitReachedMessage("resume scoring");
      return;
    }

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

  const headerFeatures = [
    { icon: Sparkles, text: "AI Analysis", color: "text-yellow-500" },
    { icon: Target, text: "Industry Benchmarks", color: "text-blue-500" },
    { icon: TrendingUp, text: "Career Insights", color: "text-green-500" }
  ];

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-950 dark:text-white py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/ats-resume-builder" className="flex items-center">
                <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                  Resulient
                </span>
              </Link>
              <div className="flex items-center gap-2">
                <Badge className="rounded-full px-3 py-1 text-xs sm:text-sm font-semibold bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900 dark:text-fuchsia-300 shadow border border-fuchsia-200 dark:border-fuchsia-700 animate-fade-in">
                  Resume Score Analyzer
                </Badge>
                <div className={`transition-transform duration-300 ${animateHeader ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}>
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center gap-1 sm:hidden hover:bg-indigo-100 dark:hover:bg-indigo-900"
                asChild
              >
                <Link to="/ats-resume-builder">
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

          <div className={`relative overflow-hidden bg-gradient-to-br ${
            subscription.tier === "premium" 
              ? "from-blue-50 via-indigo-50 to-blue-100 dark:from-blue-950 dark:via-indigo-950 dark:to-blue-900 border-blue-200 dark:border-blue-800" 
              : subscription.tier === "platinum" 
                ? "from-purple-50 via-indigo-50 to-fuchsia-100 dark:from-purple-950 dark:via-indigo-950 dark:to-fuchsia-900 border-purple-200 dark:border-purple-800" 
                : "from-fuchsia-50 via-indigo-50 to-blue-50 dark:from-fuchsia-950 dark:via-indigo-950 dark:to-blue-950 border-indigo-100 dark:border-indigo-800"
          } rounded-xl border-2 shadow-lg px-4 py-6 mb-6 sm:px-7 max-w-2xl mx-auto text-center transition-all duration-300`}>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/20 to-blue-200/20 rounded-full -translate-y-16 translate-x-16 animate-pulse"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/20 to-purple-200/20 rounded-full translate-y-12 -translate-x-12 animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center justify-center gap-2 text-lg sm:text-xl font-semibold text-indigo-900 dark:text-indigo-200 leading-snug mb-2">
                {subscription.tier !== "free" && (
                  <SubscriptionTierIndicator variant="icon" size="lg" showTooltip={false} />
                )}
                <span className="text-fuchsia-700 dark:text-fuchsia-400 font-bold">
                  {subscription.tier !== "free" ? 
                    `${subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)} Unlimited Access` : 
                    "New!"
                  } 
                </span> 
                <span>Unlock insights with</span>
                <span className="text-fuchsia-700 dark:text-fuchsia-400 font-bold">Resulient Resume Scoring</span>
              </div>
              
              <div className="flex flex-wrap justify-center gap-2 mb-4">
                {headerFeatures.map((feature, index) => (
                  <Badge 
                    key={index}
                    variant="secondary" 
                    className="flex items-center gap-1 px-2 py-1 bg-white/80 dark:bg-gray-800/80 border"
                  >
                    <feature.icon className={`h-3 w-3 ${feature.color}`} />
                    <span className="text-xs font-medium">{feature.text}</span>
                  </Badge>
                ))}
              </div>
              
              <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 max-w-2xl mx-auto">
                Instantly compare your resume to <span className="font-bold text-indigo-700 dark:text-indigo-400">hundreds of thousands</span> of real career journeys. 
                Using Artificial Intelligence, Resulient shows you exactly where you stand among your competition—so you know how to outshine other applicants.
              </p>
              
              {subscription.tier !== "free" && (
                <div className="mt-3 text-sm font-medium text-indigo-700 dark:text-indigo-400">
                  {subscription.tier === "premium" ? 
                    "✨ You have unlimited resume scoring with your Premium plan!" : 
                    "🌟 You have unlimited resume scoring with your Platinum plan!"}
                </div>
              )}
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4 hidden sm:flex items-center gap-1 hover:bg-indigo-100 dark:hover:bg-indigo-900"
            asChild
          >
            <Link to="/ats-resume-builder">
              <ArrowLeft className="h-4 w-4" />
              Back to Resume Builder
            </Link>
          </Button>

          <MainNavigation />

          {showUpgradeAlert && (
            <UseSubscriptionAlert 
              subscriptionTier={subscription.tier} 
              requiredTier="premium" 
              message="You've reached your daily limit for resume scoring. Free users can perform 1 resume scoring per day. Upgrade to Premium or Platinum for unlimited usage."
            />
          )}

          <Tabs defaultValue="current" className="mb-8" onValueChange={setActiveTab}>
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 rounded-lg shadow-lg overflow-hidden border-2 border-indigo-200 dark:border-indigo-800 bg-white dark:bg-gray-800">
              <TabsTrigger value="current" className="font-semibold">New Analysis</TabsTrigger>
              <TabsTrigger value="history" className="font-semibold">Score History</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-6 mt-6">
              <Card className={`bg-gradient-to-br ${
                subscription.tier === "premium" 
                  ? "from-white via-blue-50 to-indigo-100 border-t-blue-500" 
                  : subscription.tier === "platinum" 
                    ? "from-white via-purple-50 to-indigo-100 border-t-purple-500" 
                    : "from-white via-blue-50 to-indigo-100 border-t-indigo-500"
              } shadow-xl border-t-4 transition-all duration-300 hover:shadow-2xl`}>
                <CardContent className="space-y-6 pt-6">
                  {subscription.tier !== "free" && (
                    <div className="flex items-center justify-center gap-1 text-sm text-indigo-700 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-950/50 rounded-lg p-3">
                      <Diamond className="h-4 w-4" />
                      <span>
                        {subscription.tier === "premium" ? 
                          "🎯 Unlimited scoring with Premium" : 
                          "⭐ Unlimited scoring with Platinum"}
                      </span>
                    </div>
                  )}
                  {subscription.tier === "free" && (
                    <div className="flex items-center justify-center gap-1 text-sm text-gray-600 dark:text-gray-400 font-medium bg-gray-50 dark:bg-gray-900/50 rounded-lg p-3">
                      <span>
                        📊 Daily limit: {hasScored ? 1 : usage.resumeScorings.used}/{usage.resumeScorings.limit} resume scoring used
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

            <TabsContent value="history" className="mt-6">
              {scoreHistory.length > 0 ? (
                <ScoreHistory scores={scoreHistory} />
              ) : (
                <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950 dark:to-blue-950 shadow-lg border border-indigo-200 dark:border-indigo-800">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="p-4 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full mb-4 shadow-lg">
                      <FileText className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-indigo-900 dark:text-indigo-100 mb-2">No Score History</h3>
                    <p className="text-indigo-600 dark:text-indigo-300 text-center max-w-md leading-relaxed">
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
