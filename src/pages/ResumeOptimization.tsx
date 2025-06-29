import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Sparkles, Target, Info, Wand2, ExternalLink } from "lucide-react";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { OptimizationHistory } from "@/components/resume/OptimizationHistory";
import { OptimizedResumeDisplay } from "@/components/resume/OptimizedResumeDisplay";
import { FileUploadSection } from "@/components/resume/FileUploadSection";
import { ResumeInputToggle } from "@/components/resume/ResumeInputToggle";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { useResumeOptimizationHistory } from "@/hooks/useResumeOptimizationHistory";
import { useSubscription } from "@/hooks/useSubscription";
import { UseSubscriptionAlert } from "@/components/subscription/UseSubscriptionAlert";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { OptimizationAnimation } from "@/components/resume/OptimizationAnimation";
import { AutoLoadAnimation } from "@/components/resume/AutoLoadAnimation";
import { supabase } from "@/integrations/supabase/client";

const ResumeOptimization = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resumeText, setResumeText] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [inputMode, setInputMode] = useState<"upload" | "paste">("paste");
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [isAutoLoading, setIsAutoLoading] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState<string | null>(null);
  const [jobFromJobsPage, setJobFromJobsPage] = useState<{
    jobTitle: string; 
    company: string; 
    externalUrl?: string;
  } | null>(null);
  
  const { saveOptimization, fetchOptimizationHistory, optimizationHistory } = useResumeOptimizationHistory(user?.id);
  const { subscription } = useSubscription();
  const { usage, showLimitReachedMessage } = useUsageLimits();

  // Fetch user's best scoring resume
  const fetchBestScoringResume = async () => {
    if (!user?.id) {
      console.log('No user ID available for fetching best resume');
      return null;
    }
    
    try {
      console.log('Fetching best scoring resume for user:', user.id);
      const { data, error } = await supabase
        .from("resume_scores")
        .select("resume_content, overall_score")
        .eq("user_id", user.id)
        .order("overall_score", { ascending: false })
        .limit(1);
      
      if (error) {
        console.error("Error fetching best resume:", error);
        return null;
      }
      
      console.log('Best resume data:', data);
      return data?.[0]?.resume_content || null;
    } catch (error) {
      console.error("Error fetching best resume:", error);
      return null;
    }
  };

  // Auto-load job description and resume content
  const autoLoadContent = async () => {
    console.log('autoLoadContent called');
    
    try {
      const optimizerData = sessionStorage.getItem('resumeOptimizerData');
      console.log('Raw session storage data:', optimizerData);
      
      if (!optimizerData) {
        console.log('No optimizer data found in session storage');
        return false;
      }

      const data = JSON.parse(optimizerData);
      console.log('Parsed optimizer data:', data);
      
      if (!data.needsAutoLoad) {
        console.log('needsAutoLoad is false, skipping auto-load');
        return false;
      }

      console.log('Starting auto-load process...');
      setIsAutoLoading(true);
      
      // Set job description immediately
      if (data.jobDescription) {
        console.log('Setting job description:', data.jobDescription.substring(0, 100) + '...');
        setJobDescription(data.jobDescription);
      }

      // Set job context
      if (data.jobTitle || data.company) {
        console.log('Setting job context:', { jobTitle: data.jobTitle, company: data.company });
        setJobFromJobsPage({
          jobTitle: data.jobTitle || '',
          company: data.company || '',
          externalUrl: data.externalUrl || ''
        });
      }

      // Fetch and set best resume
      console.log('Fetching best scoring resume...');
      const bestResume = await fetchBestScoringResume();
      console.log('Best resume result:', bestResume ? 'Found resume content' : 'No resume found');
      
      if (bestResume) {
        console.log('Setting resume text...');
        setResumeText(bestResume);
      }
      
      // Complete the auto-loading process
      setTimeout(() => {
        console.log('Auto-loading complete, stopping animation');
        setIsAutoLoading(false);
        // Clear the session storage to prevent re-triggering
        sessionStorage.removeItem('resumeOptimizerData');
      }, 2000);

      return true;
    } catch (error) {
      console.error('Error during auto-loading:', error);
      setIsAutoLoading(false);
      return false;
    }
  };

  // Fetch optimization history on component mount
  useEffect(() => {
    if (user?.id) {
      fetchOptimizationHistory();
    }
  }, [user?.id, fetchOptimizationHistory]);

  useEffect(() => {
    console.log('Auth loading:', authLoading, 'User:', user?.id);
    
    if (!authLoading && !user) {
      console.log('No user found, redirecting to auth');
      navigate("/auth");
      return;
    }

    if (user?.id) {
      console.log('User authenticated, checking for auto-load');
      autoLoadContent().catch(error => {
        console.error('Auto-load failed:', error);
      });
    }
  }, [user, authLoading, navigate]);

  const handleOptimizeResume = async () => {
    // Check if user has reached limit
    if (usage.resumeOptimizations.hasReachedLimit) {
      showLimitReachedMessage("resume optimization");
      return;
    }

    setIsOptimizing(true);
    // Simulate optimization process (replace with actual AI optimization)
    await new Promise(resolve => setTimeout(resolve, 2000));

    const optimizedContent = `Optimized Resume Content:\n${resumeText}\n\nBased on Job Description:\n${jobDescription}`;
    
    // Save optimization using the hook
    const savedOptimization = await saveOptimization({
      optimizedResume: optimizedContent,
      originalResume: resumeText,
      jobDescription: jobDescription,
      qualificationGaps: [],
      overallScore: 85,
      keywordScore: 90,
      structureScore: 80,
      atsScore: 88,
      suggestions: ["Improve keyword density", "Add more quantifiable achievements"]
    });

    if (savedOptimization) {
      setOptimizedResult(optimizedContent);
    }

    setIsOptimizing(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setResumeText(event.target.value);
  };

  const handleJobDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJobDescription(event.target.value);
  };

  const handleFileUpload = (content: string) => {
    setResumeText(content);
    setInputMode("paste");
  };

  const handleInputModeChange = (mode: "upload" | "paste") => {
    setInputMode(mode);
  };

  const handleApplyForJob = () => {
    if (jobFromJobsPage?.externalUrl) {
      window.open(jobFromJobsPage.externalUrl, '_blank');
    } else {
      // Fallback if no external URL is provided
      const jobSearchQuery = `${jobFromJobsPage?.jobTitle} ${jobFromJobsPage?.company}`;
      const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(jobSearchQuery + ' jobs')}`;
      window.open(searchUrl, '_blank');
    }
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  return (
    <>
      <AutoLoadAnimation 
        isLoading={isAutoLoading} 
        onComplete={() => {
          console.log('AutoLoadAnimation onComplete called');
          setIsAutoLoading(false);
        }} 
      />
      
      <OptimizationAnimation 
        isOptimizing={isOptimizing} 
        onComplete={() => setIsOptimizing(false)} 
        mode="optimization"
      />
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-950 dark:text-white py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/" className="flex items-center">
                <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                  Resulient
                </span>
              </Link>
              <span className="rounded-full px-2 py-1 text-xs sm:text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 shadow border border-purple-200 dark:border-purple-700 animate-fade-in whitespace-nowrap">
                Resume Optimizer
              </span>
            </div>
            <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <SubscriptionTierIndicator variant="badge" size="sm" />
                <UserMenuWithTheme />
              </div>
            </div>
          </div>

          {/* Job context info if coming from jobs page */}
          {jobFromJobsPage && (
            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-500 rounded-lg">
                  <Target className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-green-800 dark:text-green-300">
                    Optimizing for: {jobFromJobsPage.jobTitle}
                  </h3>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    at {jobFromJobsPage.company} - Job description and your best resume have been automatically loaded
                  </p>
                </div>
                {optimizedResult && (
                  <Button
                    onClick={handleApplyForJob}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply for Job
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Info block */}
          <div className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-purple-950 dark:via-indigo-950 dark:to-blue-950 border-purple-200 dark:border-purple-800 rounded-xl border shadow-md px-4 py-5 mb-6 sm:px-7 max-w-3xl mx-auto text-center transition-all duration-300">
            <div className="text-lg sm:text-xl font-semibold text-indigo-900 dark:text-indigo-200 leading-snug mb-0 flex flex-wrap items-center justify-center gap-2">
              <Wand2 className="h-6 w-6 text-purple-600" />
              <span className="text-purple-700 dark:text-purple-400 font-bold">
                AI-Powered Resume Optimizer
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 max-w-2xl mx-auto">
              Transform your resume to perfectly match any job description. Our AI analyzes the role requirements 
              and optimizes your resume content, keywords, and structure for maximum ATS compatibility and recruiter appeal.
            </p>
            {subscription.tier === "free" && (
              <div className="mt-3 text-sm font-medium text-purple-700 dark:text-purple-400">
                Free tier: {usage.resumeOptimizations.used}/{usage.resumeOptimizations.limit} optimizations used today
              </div>
            )}
          </div>

          {usage.resumeOptimizations.hasReachedLimit && subscription.tier === "free" && (
            <UseSubscriptionAlert 
              subscriptionTier={subscription.tier} 
              requiredTier="premium" 
              message="You've reached your daily limit for resume optimization. Free users can optimize 2 resumes per day. Upgrade to Premium or Platinum for unlimited usage."
            />
          )}

          <MainNavigation />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Input Section */}
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-purple-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-purple-700">
                    <FileText className="h-5 w-5" />
                    Optimize Your Resume
                  </CardTitle>
                  <CardDescription>
                    {jobFromJobsPage 
                      ? "Your resume and job description have been automatically loaded. Review and optimize!"
                      : "Paste your resume and the job description to get started."
                    }
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ResumeInputToggle 
                    resumeContent={resumeText}
                    setResumeContent={setResumeText}
                    userId={user?.id}
                  />
                  {inputMode === "paste" ? (
                    <textarea
                      placeholder="Paste your resume here..."
                      className="w-full h-64 p-3 rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      value={resumeText}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <FileUploadSection 
                      resumeContent={resumeText}
                      setResumeContent={setResumeText}
                    />
                  )}
                  <JobDescriptionInput
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                  />
                  <Button
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold"
                    onClick={handleOptimizeResume}
                    disabled={isOptimizing || usage.resumeOptimizations.hasReachedLimit}
                  >
                    {isOptimizing ? (
                      <>
                        <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                        Optimizing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Optimize Resume
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              {optimizedResult ? (
                <div className="space-y-4">
                  <OptimizedResumeDisplay optimizedResume={optimizedResult} />
                  {jobFromJobsPage && (
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2">
                            Resume Optimized Successfully!
                          </h3>
                          <p className="text-sm text-green-600 dark:text-green-400 mb-4">
                            Your resume has been tailored for the {jobFromJobsPage.jobTitle} position at {jobFromJobsPage.company}
                          </p>
                          <Button
                            onClick={handleApplyForJob}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Apply for This Job Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-indigo-700">
                      <Sparkles className="h-5 w-5" />
                      Optimization History
                    </CardTitle>
                    <CardDescription>
                      View your past resume optimizations and track your progress.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <OptimizationHistory userId={user?.id || ""} />
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <LegalFooter />
        </div>
      </div>
    </>
  );
};

export default ResumeOptimization;
