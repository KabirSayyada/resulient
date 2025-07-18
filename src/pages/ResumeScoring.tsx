
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { useResumeScoring } from "@/hooks/useResumeScoring";
import { useSubscription } from "@/hooks/useSubscription";
import { ScoreHistory } from "@/components/resume/ScoreHistory";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, FileText, Diamond, Sparkles, Target, Zap, TrendingUp, BarChart3, Clock, Shield, Brain, Award, CheckCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";

const ResumeScoring = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resumeContent, setResumeContent] = useState("");
  const [activeTab, setActiveTab] = useState("current");
  const [showScoreModal, setShowScoreModal] = useState(false);
  const { scoreData, scoreHistory, setScoreHistory, isScoring, hasReachedLimit, handleScoreResume } = useResumeScoring(user?.id);
  const { subscription } = useSubscription();

  // Check if user has subscription access (no free tier for resume scoring)
  const hasSubscription = subscription.tier === "premium" || subscription.tier === "platinum";

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
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 to-blue-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-16 h-16 border-4 border-purple-300 border-b-transparent rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-purple-600 bg-clip-text text-transparent">
              Loading Resume Analyzer
            </h3>
            <p className="text-slate-600 dark:text-slate-400">Preparing your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  const onScore = async () => {
    setShowScoreModal(true);
    await handleScoreResume(resumeContent, hasSubscription);
  };

  // Always show upgrade alert for free users
  const showUpgradeAlert = subscription.tier === "free";

  const features = [
    { icon: Brain, text: "AI Analysis", color: "from-emerald-400 to-teal-500", description: "Advanced machine learning" },
    { icon: BarChart3, text: "Industry Insights", color: "from-blue-400 to-indigo-500", description: "Compare against thousands" },
    { icon: Shield, text: "ATS Compatible", color: "from-purple-400 to-pink-500", description: "Optimized for systems" },
    { icon: Target, text: "Job Optimized", color: "from-orange-400 to-red-500", description: "Tailored recommendations" }
  ];

  const stats = [
    { value: "500K+", label: "Resumes Analyzed", icon: FileText },
    { value: "95%", label: "Success Rate", icon: CheckCircle },
    { value: "15M+", label: "Data Points", icon: Brain },
    { value: "24/7", label: "AI Analysis", icon: Zap }
  ];

  return (
    <>
      <div className={`min-h-screen relative overflow-hidden transition-all duration-700 ${
        subscription.tier === "premium" 
          ? "bg-gradient-to-br from-blue-50 via-indigo-50/80 to-purple-50 dark:from-blue-950 dark:via-indigo-950/80 dark:to-purple-950" 
          : subscription.tier === "platinum" 
            ? "bg-gradient-to-br from-purple-50 via-indigo-50/80 to-pink-50 dark:from-purple-950 dark:via-indigo-950/80 dark:to-pink-950" 
            : "bg-gradient-to-br from-emerald-50 via-blue-50/80 to-indigo-50 dark:from-emerald-950 dark:via-blue-950/80 dark:to-indigo-950"
      }`}>
        
        {/* Enhanced animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-emerald-200/20 via-blue-200/15 to-purple-200/20 dark:from-emerald-800/10 dark:via-blue-800/8 dark:to-purple-800/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-200/20 via-pink-200/15 to-indigo-200/20 dark:from-purple-800/10 dark:via-pink-800/8 dark:to-indigo-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-200/10 to-emerald-200/10 dark:from-blue-800/5 dark:to-emerald-800/5 rounded-full blur-2xl animate-pulse delay-2000"></div>
        </div>
        
        <div className="relative z-10 py-6 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Enhanced Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="flex items-center gap-4">
                <Link to="/ats-resume-builder" className="group">
                  <div className="flex items-center gap-3">
                    <span className="font-brand text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text drop-shadow-lg tracking-tight select-none group-hover:scale-105 transition-transform duration-300">
                      Resulient
                    </span>
                    <div className="flex flex-col gap-2">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-4 py-2 text-sm font-semibold">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Resume Analyzer
                      </Badge>
                    </div>
                  </div>
                </Link>
              </div>
              
              <div className="flex items-center gap-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="flex items-center gap-2 hover:scale-105 transition-all duration-200 hover:bg-white/20 dark:hover:bg-gray-800/20 backdrop-blur-sm rounded-xl border border-white/20 dark:border-gray-700/20"
                  asChild
                >
                  <Link to="/ats-resume-builder">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="hidden sm:inline">Back to Builder</span>
                    <span className="sm:hidden">Back</span>
                  </Link>
                </Button>
                <SubscriptionTierIndicator variant="badge" size="sm" className="animate-fade-in" />
                <UserMenuWithTheme />
              </div>
            </div>

            {/* Revolutionary Hero Section */}
            <div className="relative mb-8">
              <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl ${
                subscription.tier === "premium" 
                  ? "bg-gradient-to-br from-white/95 via-blue-50/70 to-indigo-50/95 dark:from-slate-900/95 dark:via-blue-950/70 dark:to-indigo-950/95 border-blue-200/60 dark:border-blue-800/60" 
                  : subscription.tier === "platinum" 
                    ? "bg-gradient-to-br from-white/95 via-purple-50/70 to-pink-50/95 dark:from-slate-900/95 dark:via-purple-950/70 dark:to-pink-950/95 border-purple-200/60 dark:border-purple-800/60" 
                    : "bg-gradient-to-br from-white/95 via-emerald-50/70 to-blue-50/95 dark:from-slate-900/95 dark:via-emerald-950/70 dark:to-blue-950/95 border-emerald-200/60 dark:border-emerald-800/60"
              } shadow-2xl border-2 backdrop-blur-sm`}>
                
                {/* Animated background pattern */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute -top-16 -right-16 w-32 h-32 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 dark:from-emerald-800/10 dark:to-blue-800/10 rounded-full blur-2xl animate-pulse"></div>
                  <div className="absolute -bottom-16 -left-16 w-28 h-28 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
                  <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-gradient-to-br from-yellow-200/15 to-orange-200/15 dark:from-yellow-800/8 dark:to-orange-800/8 rounded-full blur-xl animate-pulse delay-2000"></div>
                </div>
                
                <CardContent className="p-8 sm:p-12 relative z-10">
                  <div className="text-center space-y-10">
                    {/* Main Title Section */}
                    <div className="space-y-6">
                      <div className="flex items-center justify-center gap-4 mb-8">
                        <div className="relative">
                          <div className="p-5 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-3xl shadow-2xl animate-pulse">
                            <Brain className="h-10 w-10 text-white" />
                          </div>
                          <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full shadow-lg animate-bounce">
                            <Award className="h-4 w-4 text-white" />
                          </div>
                        </div>
                        <div className="text-left">
                          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                            AI Resume
                          </h1>
                          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent leading-tight">
                            Analyzer
                          </h1>
                        </div>
                      </div>
                      
                      <div className="max-w-4xl mx-auto space-y-4">
                        <p className="text-xl sm:text-2xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                          Unlock your career potential with 
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 mx-2">AI-powered insights</span> 
                          that compare your resume against 
                          <span className="font-bold text-blue-600 dark:text-blue-400 mx-1">500,000+</span> 
                          real career profiles
                        </p>
                        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                          Discover exactly where you stand in your industry and get personalized recommendations to land your dream job
                        </p>
                      </div>
                    </div>

                    {/* Stats Section */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 my-10">
                      {stats.map((stat, index) => (
                        <div 
                          key={index}
                          className="group p-4 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 backdrop-blur-sm border border-white/30 dark:border-slate-700/30"
                        >
                          <stat.icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400 mx-auto mb-2 group-hover:animate-pulse" />
                          <div className="text-2xl font-bold text-slate-800 dark:text-slate-200">{stat.value}</div>
                          <div className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Softened Feature Pills */}
                    <div className="flex flex-wrap justify-center gap-3">
                      {features.map((feature, index) => (
                        <div 
                          key={index}
                          className="group relative"
                        >
                          <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-102 cursor-default backdrop-blur-sm">
                            <feature.icon className={`h-4 w-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:animate-pulse`} />
                            <div className="text-left">
                              <div className="font-medium text-slate-700 dark:text-slate-300 text-sm">{feature.text}</div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 opacity-80">{feature.description}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Subscription Status */}
                    <div className="pt-6">
                      {subscription.tier !== "free" ? (
                        <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-emerald-100 to-blue-100 dark:from-emerald-900/30 dark:to-blue-900/30 border-2 border-emerald-200 dark:border-emerald-700/50 rounded-2xl shadow-xl">
                          <Diamond className="h-6 w-6 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                          <div className="text-left">
                            <div className="font-bold text-emerald-700 dark:text-emerald-300 text-lg">
                              {subscription.tier === "premium" ? "Premium Unlimited" : "Platinum Unlimited"}
                            </div>
                            <div className="text-sm text-emerald-600 dark:text-emerald-400">
                              Advanced AI analysis with unlimited scoring
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-4 px-8 py-4 bg-gradient-to-r from-red-50 to-purple-50 dark:from-red-950/30 dark:to-purple-950/30 border-2 border-red-200 dark:border-red-700/50 rounded-2xl shadow-xl">
                          <Clock className="h-6 w-6 text-red-600 dark:text-red-400" />
                          <div className="text-left">
                            <div className="font-bold text-red-700 dark:text-red-300 text-lg">
                              Subscription Required
                            </div>
                            <div className="text-sm text-red-600 dark:text-red-400">
                              Upgrade to Premium or Platinum for resume analysis
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <MainNavigation />

            {showUpgradeAlert && (
              <div className="mb-8 animate-fade-in">
                <UseSubscriptionAlert 
                  subscriptionTier={subscription.tier} 
                  requiredTier="premium" 
                  message="Resume analysis requires a Premium or Platinum subscription. Upgrade now for unlimited resume scoring and advanced career insights."
                />
              </div>
            )}

            {/* Enhanced Tabs */}
            <div className="mb-8">
              <Tabs defaultValue="current" onValueChange={setActiveTab}>
                <TabsList className={`grid w-full max-w-md mx-auto grid-cols-2 rounded-2xl shadow-xl overflow-hidden transition-all duration-300 h-14 ${
                  subscription.tier === "premium" 
                    ? "bg-gradient-to-r from-blue-100/80 to-indigo-100/80 dark:from-blue-900/50 dark:to-indigo-900/50 border-2 border-blue-200 dark:border-blue-700" 
                    : subscription.tier === "platinum" 
                      ? "bg-gradient-to-r from-purple-100/80 to-pink-100/80 dark:from-purple-900/50 dark:to-pink-900/50 border-2 border-purple-200 dark:border-purple-700" 
                      : "bg-gradient-to-r from-emerald-100/80 to-blue-100/80 dark:from-emerald-900/50 dark:to-blue-900/50 border-2 border-emerald-200 dark:border-emerald-700"
                } backdrop-blur-sm`}>
                  <TabsTrigger 
                    value="current" 
                    className="data-[state=active]:bg-white/90 dark:data-[state=active]:bg-gray-800/90 data-[state=active]:shadow-lg transition-all duration-200 font-semibold hover:scale-105 rounded-xl text-base"
                  >
                    <TrendingUp className="h-4 w-4 mr-2" />
                    New Analysis
                  </TabsTrigger>
                  <TabsTrigger 
                    value="history"
                    className="data-[state=active]:bg-white/90 dark:data-[state=active]:bg-gray-800/90 data-[state=active]:shadow-lg transition-all duration-200 font-semibold hover:scale-105 rounded-xl text-base"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Score History
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="current" className="space-y-8 mt-8">
                  <Card className={`relative overflow-hidden transition-all duration-500 hover:shadow-2xl animate-fade-in ${
                    subscription.tier === "premium" 
                      ? "bg-gradient-to-br from-white/90 via-blue-50/60 to-indigo-100/80 border-t-blue-500 shadow-blue-100/50 dark:shadow-blue-900/30" 
                      : subscription.tier === "platinum" 
                        ? "bg-gradient-to-br from-white/90 via-purple-50/60 to-pink-100/80 border-t-purple-500 shadow-purple-100/50 dark:shadow-purple-900/30" 
                        : "bg-gradient-to-br from-white/90 via-emerald-50/60 to-blue-100/80 border-t-emerald-500 shadow-emerald-100/50 dark:shadow-emerald-900/30"
                  } shadow-2xl border-t-4 backdrop-blur-sm`}>
                    
                    <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-100/20 to-blue-100/20 dark:from-purple-800/10 dark:to-blue-800/10 rounded-full -translate-y-24 translate-x-24 animate-pulse delay-500"></div>
                    
                    <CardContent className="p-8 relative z-10">
                      <ResumeScoringForm
                        scoringMode="resumeOnly"
                        setScoringMode={() => {}}
                        resumeContent={resumeContent}
                        setResumeContent={setResumeContent}
                        isScoring={isScoring}
                        onScore={onScore}
                        disableButton={!hasSubscription}
                        hasSubscription={hasSubscription}
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
                    <Card className="bg-gradient-to-br from-white/90 via-gray-50/60 to-blue-50/80 dark:from-gray-800/90 dark:via-gray-800/60 dark:to-blue-900/20 shadow-2xl backdrop-blur-sm animate-fade-in border-2 border-gray-200/60 dark:border-gray-700/60">
                      <CardContent className="flex flex-col items-center justify-center py-16 px-8">
                        <div className="relative mb-8">
                          <div className="p-6 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-full shadow-xl animate-pulse">
                            <BarChart3 className="h-16 w-16 text-indigo-500 dark:text-indigo-400" />
                          </div>
                          <div className="absolute -top-2 -right-2 p-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg">
                            <Sparkles className="h-5 w-5 text-white animate-pulse" />
                          </div>
                        </div>
                        <div className="text-center space-y-4">
                          <h3 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            No Analysis History
                          </h3>
                          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
                            You haven't analyzed any resumes yet. {hasSubscription ? 
                              "Start by uploading your resume to get detailed, actionable feedback and track your progress over time." :
                              "Upgrade to Premium or Platinum to unlock resume analysis and track your progress over time."
                            }
                          </p>
                          <Badge variant="outline" className="mt-6 border-indigo-300 text-indigo-600 dark:border-indigo-700 dark:text-indigo-400 px-4 py-2">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            {hasSubscription ? "Ready to get started" : "Subscription required"}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-16">
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
