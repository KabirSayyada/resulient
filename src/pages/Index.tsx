import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { ResumeInputToggle } from "@/components/resume/ResumeInputToggle";
import { OptimizedResumeDisplay } from "@/components/resume/OptimizedResumeDisplay";
import { OptimizationAnimation } from "@/components/resume/OptimizationAnimation";
import { JobOptimizationAnimation } from "@/components/resume/JobOptimizationAnimation";
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
import { Diamond, ExternalLink, Building, MapPin, DollarSign, ArrowRight } from "lucide-react";
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

  const { callFunction, loading: functionLoading, error: functionError } = useSupabaseFunction();
  const { saveOptimization } = useResumeOptimizationHistory(user?.id);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/");
      return;
    }
  }, [user, authLoading, navigate]);

  // Auto-load job data from session storage when component mounts
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
          
          // Show job optimization animation
          setShowJobOptimizationAnimation(true);
          
          // Show a toast to inform the user
          toast({
            title: "Job Description Loaded",
            description: "Job description has been automatically loaded from your job selection.",
          });
        }
        
        // Clear the session storage after loading
        sessionStorage.removeItem('resumeOptimizerData');
      }
    } catch (error) {
      console.error('Error loading stored optimizer data:', error);
    }
  }, [toast]);

  // Debug log for sourceJobData changes
  useEffect(() => {
    console.log('sourceJobData changed:', sourceJobData);
  }, [sourceJobData]);

  // Auto-populate resume content when highest scoring resume is available and job optimization animation completes
  useEffect(() => {
    if (highestScoringResume && jobDescription && !resumeContent) {
      setResumeContent(highestScoringResume.resume_content);
      
      toast({
        title: "Resume Auto-Loaded",
        description: `Your highest scoring resume (${highestScoringResume.overall_score}/100) has been loaded automatically.`,
      });
    }
  }, [highestScoringResume, jobDescription, resumeContent, toast]);

  const handleJobOptimizationAnimationComplete = () => {
    setShowJobOptimizationAnimation(false);
  };

  const handleOptimizeResume = async () => {
    // Check if user has reached limit
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

      // Store the optimization result
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

        // Increment usage count for resume optimization
        await supabase.rpc('increment_user_usage', {
          p_user_id: user.id,
          p_feature_type: 'resume_optimizations'
        });

        // Refresh usage after optimization
        await checkUsage();
      }

      toast({
        title: "Resume Optimized",
        description: "Your resume has been successfully optimized for ATS.",
      });
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

  // If user is not logged in, redirect to landing page
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

      <div className={`min-h-screen px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        subscription.tier === "premium" 
          ? "bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 dark:from-blue-950 dark:via-gray-900 dark:to-indigo-950" 
          : subscription.tier === "platinum" 
            ? "bg-gradient-to-br from-purple-50 via-gray-50 to-indigo-50 dark:from-purple-950 dark:via-gray-900 dark:to-indigo-950" 
            : "bg-gray-50 dark:bg-gray-900"
      }`}>
        <div className="max-w-7xl mx-auto py-4 sm:py-8">
          {/* Mobile-first brand header - Fixed for mobile */}
          <div className="flex flex-col space-y-3 sm:space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <span className="font-brand text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                  Resulient
                </span>
                <span className="hidden sm:inline-block rounded-full px-2 py-1 text-xs sm:text-sm font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shadow border border-indigo-200 dark:border-indigo-700 animate-fade-in whitespace-nowrap">
                  ATS Resume Optimization
                </span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <SubscriptionTierIndicator variant="badge" size="sm" className="animate-fade-in hidden sm:block" />
                <UserMenuWithTheme />
              </div>
            </div>

            {/* Mobile badge - shown below on mobile */}
            <div className="sm:hidden">
              <span className="inline-block rounded-full px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shadow border border-indigo-200 dark:border-indigo-700 animate-fade-in">
                ATS Resume Optimization
              </span>
            </div>

            {/* Subscription Tier Banner */}
            {subscription.tier !== "free" && (
              <div className={`py-2 px-4 rounded-lg shadow-md border animate-fade-in text-center ${
                subscription.tier === "premium" 
                  ? "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200" 
                  : "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200"
              }`}>
                <SubscriptionTierIndicator variant="full" size="lg" showTooltip={false} className="justify-center" />
              </div>
            )}
          </div>

          {/* About section with mobile-first design */}
          <div className="bg-gradient-to-br from-indigo-50 via-gray-50 to-blue-50 dark:from-indigo-950 dark:via-gray-900 dark:to-blue-950 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-md px-4 py-5 mb-6 text-center">
            <p className="text-base sm:text-lg lg:text-xl font-semibold text-indigo-900 dark:text-indigo-200 leading-snug mb-2">
              <span className="text-blue-600 dark:text-blue-400 font-bold">Resulient</span> increases your interview rate by up to 500%
              <span className="block text-sm sm:text-base lg:text-lg font-normal text-indigo-700 dark:text-indigo-300 mt-1">
                Our users land 3x more interviews and get hired faster than traditional job seekers.
              </span>
            </p>
            <p className="text-orange-700 dark:text-orange-400 text-sm mt-2">
              Upload your resume and job description — we'll optimize your application to significantly increase your chances of landing interviews at top companies.
            </p>
            
            {/* Usage indicator for free tier */}
            {subscription.tier === "free" && (
              <div className="mt-3 text-sm font-medium text-orange-700 dark:text-orange-400">
                Free tier: {usage.resumeOptimizations.used}/{usage.resumeOptimizations.limit} resume optimizations used today
              </div>
            )}
            
            {/* Premium/Platinum indicator */}
            {subscription.tier !== "free" && (
              <div className="flex items-center justify-center gap-1 text-sm text-indigo-700 dark:text-indigo-400 font-medium mt-3">
                <Diamond className="h-4 w-4" />
                <span>
                  {subscription.tier === "premium" ? 
                    "Unlimited optimization with Premium" : 
                    "Unlimited optimization with Platinum"}
                </span>
              </div>
            )}
          </div>

          {/* Usage limit alert */}
          {usage.resumeOptimizations.hasReachedLimit && subscription.tier === "free" && (
            <div className="mb-6">
              <UseSubscriptionAlert 
                subscriptionTier={subscription.tier} 
                requiredTier="premium" 
                message="You've reached your daily limit for resume optimization. Free users can optimize 1 resume per day. Upgrade to Premium or Platinum for unlimited optimization."
              />
            </div>
          )}

          <MainNavigation />

          {/* Main functional area with mobile-first layout */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-orange-700 dark:text-orange-400 mb-2">
                  ATS Resume Optimizer
                </h1>
                <p className="text-sm sm:text-base text-orange-700 dark:text-orange-400">
                  Optimize your resume to beat Applicant Tracking Systems (ATS)
                </p>
              </div>
              <div className="flex justify-center sm:justify-end">
                <OptimizationHistory userId={user?.id} />
              </div>
            </div>

            {/* Job Information Section - Show when user came from job card */}
            {sourceJobData && (
              <Card className="mb-6 border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                    <Building className="h-5 w-5" />
                    Optimizing Resume for This Job
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100">{sourceJobData.title}</h3>
                    <p className="text-blue-700 dark:text-blue-300 font-medium">{sourceJobData.company}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-blue-600 dark:text-blue-400">
                      {sourceJobData.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {sourceJobData.location}
                        </div>
                      )}
                      {sourceJobData.salary && (
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {sourceJobData.salary}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <JobDescriptionInput 
                  jobDescription={jobDescription} 
                  setJobDescription={setJobDescription} 
                />
                <ResumeInputToggle 
                  resumeContent={resumeContent} 
                  setResumeContent={setResumeContent} 
                  userId={user?.id}
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleOptimizeResume} 
                  disabled={isOptimizing || !resumeContent || !jobDescription || (usage.resumeOptimizations.hasReachedLimit && subscription.tier === "free")}
                  className={`w-full sm:w-auto px-6 sm:px-7 py-3 text-base sm:text-lg font-bold rounded-full shadow transition-all ${
                    subscription.tier === "premium" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600" 
                      : subscription.tier === "platinum" 
                        ? "bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500" 
                        : "bg-gradient-to-r from-fuchsia-500 to-indigo-400 hover:from-fuchsia-600 hover:to-indigo-500"
                  }`}
                >
                  {isOptimizing ? "Optimizing..." : "🚀 Optimize Resume"}
                </Button>
              </div>
              
              {optimizedResume && (
                <>
                  <OptimizedResumeDisplay 
                    optimizedResume={optimizedResume}
                    jobDescription={jobDescription}
                    originalResume={resumeContent}
                    qualificationGaps={qualificationGaps}
                  />
                  
                  {/* Continue to Job Application Section - Show when user came from job card */}
                  {sourceJobData && (
                    <Card className="border-t-4 border-t-green-500 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 shadow-lg">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                          <ArrowRight className="h-5 w-5" />
                          Ready to Apply?
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <p className="text-green-600 dark:text-green-400">
                            Your resume has been optimized for <span className="font-semibold">{sourceJobData.title}</span> at <span className="font-semibold">{sourceJobData.company}</span>. 
                            You're now ready to submit your application!
                          </p>
                          
                          <div className="flex flex-col sm:flex-row gap-3">
                            {sourceJobData.external_url && (
                              <Button 
                                asChild 
                                className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                              >
                                <a 
                                  href={sourceJobData.external_url} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2"
                                >
                                  Apply to {sourceJobData.company}
                                  <ExternalLink className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            
                            <Button 
                              variant="outline" 
                              onClick={() => navigate("/jobs")}
                              className="border-green-300 text-green-700 hover:bg-green-50 dark:border-green-700 dark:text-green-300 dark:hover:bg-green-950"
                            >
                              Find More Jobs
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
        <div className="mt-8">
          <LegalFooter />
        </div>
        <GuidedTour />
        
        {/* Job Optimization Animation */}
        <JobOptimizationAnimation 
          isVisible={showJobOptimizationAnimation}
          onComplete={handleJobOptimizationAnimationComplete}
        />
        
        {/* Optimization Animation */}
        <OptimizationAnimation 
          isOptimizing={isOptimizing}
          onComplete={() => {
            // Animation completes naturally when isOptimizing becomes false
          }}
        />
      </div>
    </>
  );
};

export default Index;
