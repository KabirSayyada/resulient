import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, BarChart3, Zap, Sparkles, FileText, ArrowRight, Crown, Star, CheckCircle, User, Settings } from "lucide-react";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { SubscriptionStatus } from "@/components/subscription/SubscriptionStatus";
import { ResumeInputToggle } from "@/components/resume/ResumeInputToggle";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { ResumeScoringForm } from "@/components/resume/ResumeScoringForm";
import { OptimizedResumeContent } from "@/components/resume/components/OptimizedResumeContent";
import { ScoreResultSection } from "@/components/resume/ScoreResultSection";
import { useResumeScoring } from "@/hooks/useResumeScoring";
import { useResumeOptimization } from "@/hooks/useResumeOptimization";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { UsageLimitGuard } from "@/components/subscription/UsageLimitGuard";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resumeContent, setResumeContent] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [optimizedContent, setOptimizedContent] = useState("");
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const { subscription } = useSubscription();
  const { scoreData, setScoreHistory } = useResumeScoring(user?.id);
  const { isOptimizing, optimizeResume } = useResumeOptimization();

  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  const handleResumeSelected = () => {
    setSelectedResume(resumeContent);
  };

  const handleOptimizeResume = async () => {
    if (!resumeContent || !jobDescription) {
      return;
    }

    await optimizeResume(resumeContent, jobDescription);
    setOptimizedContent(resumeContent);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-blue-50 dark:from-indigo-950 dark:to-blue-950 dark:text-white py-4 sm:py-8 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 sm:gap-4">
            <Link to="/" className="flex items-center">
              <span className="font-brand text-3xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                Resulient
              </span>
            </Link>
            <span className="rounded-full px-2 py-1 text-xs sm:text-sm font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 shadow border border-emerald-200 dark:border-emerald-700 animate-fade-in whitespace-nowrap">
              Dashboard
            </span>
          </div>
          <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
            <div className="flex items-center gap-2 sm:gap-3">
              <SubscriptionTierIndicator variant="badge" size="sm" />
              <UserMenuWithTheme />
            </div>
          </div>
        </div>

        <MainNavigation />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          {/* Subscription Status Section */}
          <SubscriptionStatus className="col-span-1 lg:col-span-1" />

          {/* Resume Scoring Section */}
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-blue-200 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-blue-700 dark:text-blue-300">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
                  <Target className="h-5 w-5" />
                </div>
                Resume Benchmarking
                <BarChart3 className="h-4 w-4 text-blue-500" />
              </CardTitle>
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                See how your resume stacks up against industry standards
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ResumeInputToggle
                resumeContent={resumeContent}
                setResumeContent={setResumeContent}
                userId={user?.id}
                onResumeSelected={handleResumeSelected}
              />
              
              <ResumeScoringForm
                resumeContent={resumeContent}
                selectedResume={selectedResume}
              />
              
              {scoreData && (
                <ScoreResultSection 
                  scoreData={scoreData} 
                  setScoreHistory={setScoreHistory}
                  userId={user?.id}
                />
              )}
            </CardContent>
          </Card>

          {/* Resume Optimization Section */}
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-purple-700 dark:text-purple-300">
                <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg">
                  <Zap className="h-5 w-5" />
                </div>
                Resume Optimization
                <Sparkles className="h-4 w-4 text-purple-500" />
              </CardTitle>
              <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">
                AI-powered resume tailoring for specific job descriptions
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <UsageLimitGuard feature="resumeOptimizations">
                <div className="space-y-4">
                  <ResumeInputToggle
                    resumeContent={resumeContent}
                    setResumeContent={setResumeContent}
                    userId={user?.id}
                    onResumeSelected={handleResumeSelected}
                  />
                  
                  <JobDescriptionInput
                    jobDescription={jobDescription}
                    setJobDescription={setJobDescription}
                  />
                  
                  <Button
                    onClick={handleOptimizeResume}
                    disabled={!resumeContent || !jobDescription || isOptimizing}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    {isOptimizing ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Optimizing Resume...
                      </>
                    ) : (
                      <>
                        <Zap className="h-4 w-4" />
                        Optimize My Resume
                      </>
                    )}
                  </Button>
                </div>
              </UsageLimitGuard>
              
              {optimizedContent && (
                <OptimizedResumeContent content={optimizedContent} />
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="mt-8">
        <LegalFooter />
      </div>
    </div>
  );
};

export default Index;
