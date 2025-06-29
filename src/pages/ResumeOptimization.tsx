
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Sparkles, Target, Info, Wand2, ExternalLink, CheckCircle, TrendingUp, Users, Award } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";

const ResumeOptimization = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
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
    if (!resumeText.trim()) {
      toast({
        title: "Resume Required",
        description: "Please upload or paste your resume content before optimizing.",
        variant: "destructive",
      });
      return;
    }

    if (!jobDescription.trim()) {
      toast({
        title: "Job Description Required", 
        description: "Please add a job description to optimize your resume against.",
        variant: "destructive",
      });
      return;
    }

    // Check if user has reached limit
    if (usage.resumeOptimizations.hasReachedLimit) {
      showLimitReachedMessage("resume optimization");
      return;
    }

    setIsOptimizing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('optimize-resume', {
        body: {
          resume: resumeText,
          jobDescription: jobDescription,
          userId: user?.id
        }
      });

      if (error || !data) {
        console.error('Optimization error:', error);
        throw new Error(error?.message || 'Failed to optimize resume');
      }

      console.log('Optimization result:', data);

      // Save optimization using the hook
      const savedOptimization = await saveOptimization({
        optimizedResume: data.optimizedResume,
        originalResume: resumeText,
        jobDescription: jobDescription,
        qualificationGaps: data.qualificationGaps || [],
        overallScore: data.overallScore || 85,
        keywordScore: data.keywordScore || 90,
        structureScore: data.structureScore || 80,
        atsScore: data.atsScore || 88,
        suggestions: data.suggestions || ["Improve keyword density", "Add more quantifiable achievements"]
      });

      if (savedOptimization) {
        setOptimizedResult(data.optimizedResume);
        toast({
          title: "Resume Optimized!",
          description: "Your resume has been successfully optimized for the job description.",
        });
      }
    } catch (error) {
      console.error('Error optimizing resume:', error);
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : "Failed to optimize resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsOptimizing(false);
    }
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
      
      <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-950 dark:text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 sm:gap-4">
              <Link to="/" className="flex items-center">
                <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                  Resulient
                </span>
              </Link>
              <span className="rounded-full px-3 py-1 text-sm font-semibold bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300 shadow border border-purple-200 dark:border-purple-700 animate-fade-in whitespace-nowrap">
                Resume Optimizer
              </span>
            </div>
            <div className="flex items-center gap-3">
              <SubscriptionTierIndicator variant="badge" size="sm" />
              <UserMenuWithTheme />
            </div>
          </div>

          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl sm:text-6xl font-bold mb-6 text-gray-900 dark:text-white">
              AI-Powered Resume
              <span className="text-transparent bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text block">
                Optimization
              </span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              Transform your resume to perfectly match any job description. Our advanced AI analyzes requirements 
              and optimizes your content for maximum ATS compatibility and recruiter appeal.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="h-8 w-8 text-green-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">5x</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Higher callback rate</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-blue-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">50K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Resumes optimized</div>
              </div>
              <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-lg">
                <div className="flex items-center justify-center mb-2">
                  <Award className="h-8 w-8 text-purple-500" />
                </div>
                <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">ATS compatibility</div>
              </div>
            </div>
          </div>

          {/* Job context info if coming from jobs page */}
          {jobFromJobsPage && (
            <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl shadow-lg">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-xl">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-green-800 dark:text-green-300">
                    Optimizing for: {jobFromJobsPage.jobTitle}
                  </h3>
                  <p className="text-green-600 dark:text-green-400">
                    at {jobFromJobsPage.company} - Job description and your best resume have been automatically loaded
                  </p>
                </div>
                {optimizedResult && (
                  <Button
                    onClick={handleApplyForJob}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3"
                  >
                    <ExternalLink className="h-5 w-5 mr-2" />
                    Apply for Job
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Usage limits alert */}
          {usage.resumeOptimizations.hasReachedLimit && subscription.tier === "free" && (
            <div className="mb-8">
              <UseSubscriptionAlert 
                subscriptionTier={subscription.tier} 
                requiredTier="premium" 
                message="You've reached your daily limit for resume optimization. Free users can optimize 2 resumes per day. Upgrade to Premium or Platinum for unlimited usage."
              />
            </div>
          )}

          <MainNavigation />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-purple-200 dark:border-purple-800">
                <CardHeader className="pb-6">
                  <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300 text-xl">
                    <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                      <FileText className="h-6 w-6" />
                    </div>
                    Optimize Your Resume
                  </CardTitle>
                  <CardDescription className="text-base">
                    {jobFromJobsPage 
                      ? "Your resume and job description have been automatically loaded. Review and optimize!"
                      : "Upload your resume and add the job description to get started with AI-powered optimization."
                    }
                  </CardDescription>
                  {subscription.tier === "free" && (
                    <div className="text-sm font-medium text-purple-700 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-3 py-2 rounded-lg">
                      Free tier: {usage.resumeOptimizations.used}/{usage.resumeOptimizations.limit} optimizations used today
                    </div>
                  )}
                </CardHeader>
                <CardContent className="space-y-6">
                  <ResumeInputToggle 
                    resumeContent={resumeText}
                    setResumeContent={setResumeText}
                    userId={user?.id}
                  />
                  {inputMode === "paste" ? (
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Resume Content
                      </label>
                      <textarea
                        placeholder="Paste your resume here..."
                        className="w-full h-64 p-4 rounded-lg border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors resize-none"
                        value={resumeText}
                        onChange={handleInputChange}
                      />
                    </div>
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
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                    onClick={handleOptimizeResume}
                    disabled={isOptimizing || usage.resumeOptimizations.hasReachedLimit || !resumeText.trim() || !jobDescription.trim()}
                  >
                    {isOptimizing ? (
                      <>
                        <Sparkles className="mr-3 h-6 w-6 animate-spin" />
                        Optimizing Your Resume...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-3 h-6 w-6" />
                        Optimize Resume with AI
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              {optimizedResult ? (
                <div className="space-y-6">
                  <OptimizedResumeDisplay optimizedResume={optimizedResult} />
                  {jobFromJobsPage && (
                    <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border-green-200 dark:border-green-800 shadow-lg">
                      <CardContent className="p-6">
                        <div className="text-center">
                          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-green-800 dark:text-green-300 mb-2">
                            Resume Optimized Successfully!
                          </h3>
                          <p className="text-green-600 dark:text-green-400 mb-6">
                            Your resume has been perfectly tailored for the <strong>{jobFromJobsPage.jobTitle}</strong> position at <strong>{jobFromJobsPage.company}</strong>
                          </p>
                          <Button
                            onClick={handleApplyForJob}
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 text-lg rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105"
                          >
                            <ExternalLink className="h-5 w-5 mr-2" />
                            Apply for This Job Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ) : (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl border-indigo-200 dark:border-indigo-800">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-indigo-700 dark:text-indigo-300 text-xl">
                      <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-lg">
                        <Sparkles className="h-6 w-6" />
                      </div>
                      Optimization History
                    </CardTitle>
                    <CardDescription className="text-base">
                      View your past resume optimizations and track your progress over time.
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
        
        <div className="mt-16">
          <LegalFooter />
        </div>
      </div>
    </>
  );
};

export default ResumeOptimization;
