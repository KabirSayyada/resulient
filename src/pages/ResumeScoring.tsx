
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, Target, BarChart3 } from "lucide-react";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { ResumeInputToggle } from "@/components/resume/ResumeInputToggle";
import { ResumeScoringForm } from "@/components/resume/ResumeScoringForm";
import { ScoreResultSection } from "@/components/resume/ScoreResultSection";
import { useResumeScoring } from "@/hooks/useResumeScoring";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { UsageLimitGuard } from "@/components/subscription/UsageLimitGuard";

const ResumeScoring = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [resumeContent, setResumeContent] = useState("");
  const [selectedResume, setSelectedResume] = useState<any>(null);
  const { subscription } = useSubscription();
  const { 
    scoreData, 
    isScoring, 
    hasReachedLimit, 
    handleScoreResume, 
    setScoreHistory 
  } = useResumeScoring(user?.id);
  const { refreshUsage } = useUsageLimits();

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

  const onScoreSubmit = async () => {
    await handleScoreResume(resumeContent, subscription.limits.resumeScorings);
    refreshUsage(); // Refresh usage counts after scoring
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
              Resume Benchmarking
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

        <div className="bg-gradient-to-br from-emerald-50 via-indigo-50 to-blue-50 dark:from-emerald-950 dark:via-indigo-950 dark:to-blue-950 border-emerald-200 dark:border-emerald-800 rounded-xl border shadow-md px-4 py-5 mb-6 sm:px-7 max-w-3xl mx-auto text-center transition-all duration-300">
          <div className="text-lg sm:text-xl font-semibold text-indigo-900 dark:text-indigo-200 leading-snug mb-0 flex flex-wrap items-center justify-center gap-2">
            <Target className="h-6 w-6 text-emerald-600" />
            <span className="text-emerald-700 dark:text-emerald-400 font-bold">
              Benchmark Your Resume
            </span>
            <BarChart3 className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 max-w-2xl mx-auto">
            Get an in-depth analysis of your resume's strength compared to industry standards. 
            Discover optimization opportunities and see how you rank against similar professionals.
          </p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="space-y-6">
            <UsageLimitGuard feature="resumeScorings">
              <ResumeInputToggle
                resumeContent={resumeContent}
                setResumeContent={setResumeContent}
                userId={user?.id}
                onResumeSelected={handleResumeSelected}
              />
              
              <ResumeScoringForm
                resumeContent={resumeContent}
                onScore={onScoreSubmit}
                isScoring={isScoring}
                hasReachedLimit={hasReachedLimit}
              />
            </UsageLimitGuard>
          </div>

          <div className="space-y-6">
            <ScoreResultSection 
              scoreData={scoreData} 
              isScoring={isScoring}
              setScoreHistory={setScoreHistory}
              userId={user?.id}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <LegalFooter />
      </div>
    </div>
  );
};

export default ResumeScoring;
