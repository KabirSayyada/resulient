
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { EnhancedJobDescriptionInput } from "@/components/resume/EnhancedJobDescriptionInput";
import { EnhancedResumeInputToggle } from "@/components/resume/EnhancedResumeInputToggle";
import { OptimizationAnimation } from "@/components/resume/OptimizationAnimation";
import { JobOptimizationAnimation } from "@/components/resume/JobOptimizationAnimation";
import { ResumeOptimizationModal } from "@/components/resume/ResumeOptimizationModal";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";
import { QualificationGap } from "@/types/resume";
import { useResumeOptimizationHistory } from "@/hooks/useResumeOptimizationHistory";
import { OptimizationHistory } from "@/components/resume/OptimizationHistory";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { useHighestScoringResume } from "@/hooks/useHighestScoringResume";
import { 
  calculateKeywordScore, 
  calculateStructureScore, 
  calculateATSScore,
  generateSuggestions 
} from "@/utils/resumeFormatters";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { Button } from "@/components/ui/button";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { GuidedTour } from "@/components/onboarding/GuidedTour";
import { useSubscription } from "@/hooks/useSubscription";
import { UseSubscriptionAlert } from "@/components/subscription/UseSubscriptionAlert";
import { supabase } from "@/integrations/supabase/client";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { Helmet } from "react-helmet-async";
import { useReferralTracking } from "@/hooks/useReferralTracking";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { Diamond, ExternalLink, Building, MapPin, DollarSign, ArrowRight, Sparkles, Zap, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscription } = useSubscription();
  const { usage, checkUsage, showLimitReachedMessage } = useUsageLimits();
  const { highestScoringResume } = useHighestScoringResume(user?.id);

  // Initialize referral tracking
  useReferralTracking();

  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [qualificationGaps, setQualificationGaps] = useState<QualificationGap[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showJobOptimizationAnimation, setShowJobOptimizationAnimation] = useState(false);
  const [sourceJobData, setSourceJobData] = useState<any>(null);
  const [showJobDetails, setShowJobDetails] = useState(false);
  const [showOptimizationModal, setShowOptimizationModal] = useState(false);

  const { callFunction, loading: functionLoading, error: functionError } = useSupabaseFunction();
  const { saveOptimization } = useResumeOptimizationHistory(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    console.log('Checking for stored optimizer data...');
    try {
      const storedData = sessionStorage.getItem('resumeOptimizerData');
      console.log('Raw stored data:', storedData);
      
      if (storedData) {
        const optimizerData = JSON.parse(storedData);
        console.log('Parsed optimizer data:', optimizerData);
        
        if (optimizerData.jobDescription) {
          console.log('Setting job description:', optimizerData.jobDescription);
          setJobDescription(optimizerData.jobDescription);
          
          if (optimizerData.jobData) {
            console.log('Setting source job data:', optimizerData.jobData);
            setSourceJobData(optimizerData.jobData);
          }
          
          setShowJobOptimizationAnimation(true);
          
          toast({
            title: "Job Description Loaded",
            description: "Job description has been automatically loaded from your job selection.",
          });
        }
        
        sessionStorage.removeItem('resumeOptimizerData');
      }
    } catch (error) {
      console.error('Error loading stored optimizer data:', error);
    }
  }, [toast]);

  useEffect(() => {
    console.log('sourceJobData changed:', sourceJobData);
    console.log('sourceJobData exists:', !!sourceJobData);
    console.log('sourceJobData details:', {
      title: sourceJobData?.title,
      company: sourceJobData?.company,
      location: sourceJobData?.location,
      salary: sourceJobData?.salary
    });
  }, [sourceJobData]);

  // Removed auto-loading of highest scoring resume

  const handleJobOptimizationAnimationComplete = () => {
    console.log('Job optimization animation completed');
    setShowJobOptimizationAnimation(false);
    if (sourceJobData) {
      setShowJobDetails(true);
    }
  };

  const handleOptimizeResume = async () => {
    if (usage.resumeOptimizations.hasReachedLimit) {
      showLimitReachedMessage("resume optimization");
      return;
    }

    if (!resumeContent) {
      toast({
        title: "Missing Content",
        description: "Please upload or paste your resume content.",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription) {
      toast({
        title: "Missing Job Description",
        description: "Please paste the job description to optimize against.",
        variant: "destructive",
      });
      return;
    }

    setIsOptimizing(true);

    try {
      const response = await callFunction("optimize-resume", {
        jobDescription,
        resumeContent,
      });

      if (response?.error) {
        throw new Error(response.error);
      }

      setOptimizedResume(response.optimizedResume);
      setQualificationGaps(response.qualificationGaps || []);

      const keywordScore = calculateKeywordScore(response.optimizedResume, jobDescription);
      const structureScore = calculateStructureScore(response.optimizedResume);
      const atsScore = calculateATSScore(response.optimizedResume);
      const overallScore = Math.round((keywordScore + structureScore + atsScore) / 3);
      const suggestions = generateSuggestions(keywordScore, structureScore, atsScore, response.optimizedResume, jobDescription);

      await saveOptimization({
        optimizedResume: response.optimizedResume,
        originalResume: resumeContent,
        jobDescription,
        qualificationGaps: response.qualificationGaps || [],
        overallScore,
        keywordScore,
        structureScore,
        atsScore,
        suggestions
      });

      if (user) {
        await supabase
          .from("resume_optimizations")
          .insert({
            user_id: user.id,
            original_resume: resumeContent,
            optimized_resume: response.optimizedResume,
            job_description: jobDescription,
            qualification_gaps: response.qualificationGaps || []
          });

        await supabase.rpc('increment_user_usage', {
          p_user_id: user.id,
          p_feature_type: 'resume_optimizations'
        });

        await checkUsage();
      }

      toast({
        title: "Resume Optimized",
        description: "Your resume has been successfully optimized for ATS.",
      });

      setShowOptimizationModal(true);
    } catch (error) {
      console.error("Error optimizing resume:", error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize resume",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return (
    <>
      <Helmet>
        <title>Resulient | Smart Resume Optimization & ATS Scoring</title>
        <meta name="description" content="Transform your job search with Resulient's advanced resume optimization tool. Get past ATS systems and land more interviews with data-driven improvements." />
        <link rel="canonical" href="https://resulient.com/resume-optimization" />
      </Helmet>

      <div className={`min-h-screen px-2 sm:px-4 lg:px-8 transition-all duration-500 ${
        subscription.tier === "premium" 
          ? "bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950" 
          : subscription.tier === "platinum" 
            ? "bg-gradient-to-br from-purple-50 via-indigo-50 to-pink-50 dark:from-purple-950 dark:via-indigo-950 dark:to-pink-950" 
            : "bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950"
      }`}>
        <div className="max-w-7xl mx-auto py-2 sm:py-4 lg:py-8">
          {/* Enhanced header with animations - Mobile optimized */}
          <div className="flex flex-col space-y-2 sm:space-y-4 mb-3 sm:mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 sm:gap-4 flex-1 min-w-0">
                <span className="font-brand text-lg sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none hover:scale-105 transition-transform duration-300 cursor-default">
                  Resulient
                </span>
                <span className="hidden sm:inline-block rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-300 shadow-lg border border-indigo-200 dark:border-indigo-700 animate-fade-in whitespace-nowrap backdrop-blur-sm">
                  ✨ ATS Resume Optimization
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <SubscriptionTierIndicator variant="badge" size="sm" className="animate-fade-in hidden sm:block" />
                <UserMenuWithTheme />
              </div>
            </div>

            <div className="sm:hidden">
              <span className="inline-block rounded-full px-2 py-0.5 text-xs font-semibold bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 dark:from-indigo-900 dark:to-purple-900 dark:text-indigo-300 shadow-lg border border-indigo-200 dark:border-indigo-700 animate-fade-in backdrop-blur-sm">
                ✨ ATS Resume Optimization
              </span>
            </div>

            {subscription.tier !== "free" && (
              <div className={`py-2 sm:py-3 px-3 sm:px-6 rounded-xl shadow-lg border animate-fade-in text-center backdrop-blur-sm ${
                subscription.tier === "premium" 
                  ? "bg-gradient-to-r from-blue-100/80 to-indigo-100/80 border-blue-300 text-blue-800 dark:from-blue-900/60 dark:to-indigo-900/60 dark:border-blue-700 dark:text-blue-200" 
                  : "bg-gradient-to-r from-purple-100/80 to-pink-100/80 border-purple-300 text-purple-800 dark:from-purple-900/60 dark:to-pink-900/60 dark:border-purple-700 dark:text-purple-200"
              }`}>
                <SubscriptionTierIndicator variant="full" size="lg" showTooltip={false} className="justify-center" />
              </div>
            )}
          </div>

          {/* Enhanced about section - Mobile optimized */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-purple-50/60 to-blue-50/80 dark:from-indigo-950/80 dark:via-purple-950/60 dark:to-blue-950/80 rounded-xl sm:rounded-2xl border border-indigo-200/60 dark:border-indigo-800/60 shadow-xl backdrop-blur-sm px-3 sm:px-6 py-4 sm:py-8 mb-4 sm:mb-8 text-center relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute top-0 left-0 w-16 sm:w-32 h-16 sm:h-32 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-8 sm:-translate-y-16 -translate-x-8 sm:-translate-x-16 animate-pulse"></div>
            <div className="absolute bottom-0 right-0 w-12 sm:w-24 h-12 sm:h-24 bg-gradient-to-tl from-indigo-200/20 to-blue-200/20 rounded-full translate-y-6 sm:translate-y-12 translate-x-6 sm:translate-x-12 animate-pulse delay-1000"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-1 sm:gap-2 mb-2 sm:mb-4">
                <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-500 animate-pulse" />
                <Target className="h-4 w-4 sm:h-6 sm:w-6 text-green-500 animate-bounce delay-300" />
                <Zap className="h-4 w-4 sm:h-6 sm:w-6 text-purple-500 animate-pulse delay-700" />
              </div>
              
              <p className="text-sm sm:text-base lg:text-xl font-bold text-indigo-900 dark:text-indigo-200 leading-snug mb-2 sm:mb-3">
                <span className="text-blue-600 dark:text-blue-400 font-extrabold">Resulient</span> increases your interview rate by up to 
                <span className="text-green-600 dark:text-green-400 font-extrabold"> 500%</span>
                <span className="block text-xs sm:text-sm lg:text-lg font-semibold text-indigo-700 dark:text-indigo-300 mt-1 sm:mt-2">
                  Our users land 3x more interviews and get hired faster than traditional job seekers.
                </span>
              </p>
              <p className="text-orange-700 dark:text-orange-400 text-xs sm:text-sm font-medium">
                🚀 Upload your resume and job description — we'll optimize your application to significantly increase your chances of landing interviews at top companies.
              </p>
              
              {subscription.tier === "free" && (
                <div className="mt-2 sm:mt-4 inline-flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-semibold text-orange-700 dark:text-orange-400 bg-orange-100/80 dark:bg-orange-900/30 px-2 sm:px-4 py-1 sm:py-2 rounded-full">
                  <span>Free tier: {usage.resumeOptimizations.used}/{usage.resumeOptimizations.limit} resume optimizations used today</span>
                </div>
              )}
              
              {subscription.tier !== "free" && (
                <div className="flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm text-indigo-700 dark:text-indigo-400 font-semibold mt-2 sm:mt-4 bg-white/60 dark:bg-gray-800/60 px-2 sm:px-4 py-1 sm:py-2 rounded-full backdrop-blur-sm">
                  <Diamond className="h-3 w-3 sm:h-4 sm:w-4 animate-pulse" />
                  <span>
                    {subscription.tier === "premium" ? 
                      "Unlimited optimization with Premium" : 
                      "Unlimited optimization with Platinum"}
                  </span>
                </div>
              )}
            </div>
          </div>

          {usage.resumeOptimizations.hasReachedLimit && subscription.tier === "free" && (
            <div className="mb-3 sm:mb-6">
              <UseSubscriptionAlert 
                subscriptionTier={subscription.tier} 
                requiredTier="premium" 
                message="You've reached your daily limit for resume optimization. Free users can optimize 1 resume per day. Upgrade to Premium or Platinum for unlimited optimization."
              />
            </div>
          )}

          <MainNavigation />

          <div className="mb-3 sm:mb-6">
            <div className="flex flex-col gap-2 sm:gap-4 mb-3 sm:mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-500 bg-clip-text text-transparent mb-1 sm:mb-2">
                  🎯 ATS Resume Optimizer
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-orange-700 dark:text-orange-400 font-medium">
                  Optimize your resume to beat Applicant Tracking Systems (ATS) and land more interviews
                </p>
              </div>
              <div className="flex justify-end">
                <OptimizationHistory userId={user?.id} />
              </div>
            </div>

            {sourceJobData && showJobDetails && (
              <Card className="mb-4 sm:mb-8 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/80 dark:to-indigo-950/80 shadow-xl animate-fade-in backdrop-blur-sm">
                <CardHeader className="pb-2 sm:pb-3 px-3 sm:px-6 py-2 sm:py-4">
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300 text-sm sm:text-base">
                    <Building className="h-4 w-4 sm:h-5 sm:w-5" />
                    Optimizing Resume for This Job
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                  <div className="space-y-1 sm:space-y-2">
                    <h3 className="text-base sm:text-lg font-semibold text-blue-900 dark:text-blue-100">{sourceJobData.title}</h3>
                    <p className="text-blue-700 dark:text-blue-300 font-medium text-sm sm:text-base">{sourceJobData.company}</p>
                    <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                      {sourceJobData.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          {sourceJobData.location}
                        </div>
                      )}
                      {sourceJobData.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                          {sourceJobData.salary}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-4 sm:space-y-8 animate-fade-in">
              <div className="grid grid-cols-1 gap-4 sm:gap-8">
                <EnhancedJobDescriptionInput 
                  jobDescription={jobDescription} 
                  setJobDescription={setJobDescription} 
                />
                <EnhancedResumeInputToggle 
                  resumeContent={resumeContent} 
                  setResumeContent={setResumeContent} 
                  userId={user?.id}
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleOptimizeResume} 
                  disabled={isOptimizing || !resumeContent || !jobDescription || (usage.resumeOptimizations.hasReachedLimit && subscription.tier === "free")}
                  className={`w-full sm:w-auto px-4 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold rounded-xl sm:rounded-2xl shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl group ${
                    subscription.tier === "premium" 
                      ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600" 
                      : subscription.tier === "platinum" 
                        ? "bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 hover:from-purple-600 hover:via-pink-600 hover:to-indigo-600" 
                        : "bg-gradient-to-r from-fuchsia-500 via-purple-500 to-indigo-500 hover:from-fuchsia-600 hover:via-purple-600 hover:to-indigo-600"
                  }`}
                >
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 mr-2 group-hover:animate-pulse" />
                  {isOptimizing ? "✨ Optimizing..." : "🚀 Optimize Resume"}
                </Button>
              </div>
              
              {sourceJobData && optimizedResume && (
                <Card className="border-t-4 border-t-green-500 bg-gradient-to-r from-green-50/80 to-emerald-50/80 dark:from-green-950/80 dark:to-emerald-950/80 shadow-xl animate-fade-in backdrop-blur-sm">
                  <CardHeader className="px-3 sm:px-6 py-3 sm:py-4">
                    <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300 text-sm sm:text-base">
                      <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      Ready to Apply?
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-3 sm:px-6 pb-3 sm:pb-4">
                    <div className="space-y-2 sm:space-y-4">
                      <p className="text-green-600 dark:text-green-400 text-xs sm:text-sm">
                        Your resume has been optimized for <span className="font-semibold">{sourceJobData.title}</span> at <span className="font-semibold">{sourceJobData.company}</span>. 
                        You're now ready to submit your application!
                      </p>
                      
                      <div className="flex flex-col gap-2 sm:gap-3">
                        {sourceJobData.external_url && (
                          <Button 
                            asChild 
                            className="bg-green-600 hover:bg-green-700 text-white hover:scale-105 transition-transform duration-200 text-sm sm:text-base py-2 sm:py-3"
                          >
                            <a 
                              href={sourceJobData.external_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 justify-center"
                            >
                              Apply to {sourceJobData.company}
                              <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                            </a>
                          </Button>
                        )}
                        
                        <Button 
                          variant="outline" 
                          onClick={() => navigate("/jobs")}
                          className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950 hover:scale-105 transition-transform duration-200 text-sm sm:text-base py-2 sm:py-3"
                        >
                          Find More Jobs
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 sm:mt-8">
          <LegalFooter />
        </div>
        <GuidedTour />
        
        <JobOptimizationAnimation 
          isVisible={showJobOptimizationAnimation}
          onComplete={handleJobOptimizationAnimationComplete}
        />
        
        <OptimizationAnimation 
          isOptimizing={isOptimizing}
          onComplete={() => {}}
        />

        <ResumeOptimizationModal
          isOpen={showOptimizationModal}
          onClose={() => setShowOptimizationModal(false)}
          optimizedResume={optimizedResume}
          jobDescription={jobDescription}
          originalResume={resumeContent}
          qualificationGaps={qualificationGaps}
          sourceJobData={sourceJobData}
        />
      </div>
    </>
  );
};

export default Index;
