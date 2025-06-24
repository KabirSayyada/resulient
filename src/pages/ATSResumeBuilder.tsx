import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, FileText, Download } from "lucide-react";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { ATSResumeForm } from "@/components/resume/ATSResumeForm";
import { ATSResumePreview } from "@/components/resume/ATSResumePreview";
import { useATSResumeBuilder } from "@/hooks/useATSResumeBuilder";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { UseSubscriptionAlert } from "@/components/subscription/UseSubscriptionAlert";
import { OptimizationAnimation } from "@/components/resume/OptimizationAnimation";

const ATSResumeBuilder = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const { resumeData, isGenerating, generateResume, downloadResume, downloadResumePDF } = useATSResumeBuilder(user?.id);
  const { subscription } = useSubscription();
  const { usage, checkUsage, showLimitReachedMessage } = useUsageLimits();

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

  const handleGenerate = async (formData: any) => {
    // Check if user has reached limit
    if (usage.resumeBuilding.hasReachedLimit) {
      showLimitReachedMessage("resume building");
      return;
    }

    await generateResume(formData);
    // Refresh usage after generating resume
    await checkUsage();
  };

  return (
    <>
      {/* Add the OptimizationAnimation component */}
      <OptimizationAnimation 
        isOptimizing={isGenerating} 
        onComplete={() => {}} 
        mode="ats-building"
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
              <span className="rounded-full px-2 py-1 text-xs sm:text-sm font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 shadow border border-emerald-200 dark:border-emerald-700 animate-fade-in whitespace-nowrap">
                ATS Resume Builder
              </span>
            </div>
            <div className="flex justify-between items-center w-full sm:w-auto mt-2 sm:mt-0">
              <div className="flex items-center gap-2 sm:gap-3">
                <SubscriptionTierIndicator variant="badge" size="sm" />
                <UserMenuWithTheme />
              </div>
            </div>
          </div>

          {/* Info block */}
          <div className="bg-gradient-to-br from-emerald-50 via-indigo-50 to-blue-50 dark:from-emerald-950 dark:via-indigo-950 dark:to-blue-950 border-emerald-200 dark:border-emerald-800 rounded-xl border shadow-md px-4 py-5 mb-6 sm:px-7 max-w-3xl mx-auto text-center transition-all duration-300">
            <div className="text-lg sm:text-xl font-semibold text-indigo-900 dark:text-indigo-200 leading-snug mb-0 flex flex-wrap items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-emerald-600" />
              <span className="text-emerald-700 dark:text-emerald-400 font-bold">
                AI-Powered Resume Builder
              </span>
            </div>
            <p className="text-gray-700 dark:text-gray-300 text-sm mt-3 max-w-2xl mx-auto">
              Create a professional ATS-optimized resume in minutes. Simply describe yourself in natural sentences, 
              and our AI will automatically organize your information into the perfect resume format.
            </p>
            {subscription.tier === "free" && (
              <div className="mt-3 text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Free tier: {usage.resumeBuilding.used}/{usage.resumeBuilding.limit} resume builds used (lifetime limit)
              </div>
            )}
          </div>

          {usage.resumeBuilding.hasReachedLimit && subscription.tier === "free" && (
            <UseSubscriptionAlert 
              subscriptionTier={subscription.tier} 
              requiredTier="premium" 
              message="You've reached your lifetime limit for resume building. Free users can build 1 resume. Upgrade to Premium or Platinum for unlimited resume building."
            />
          )}

          <MainNavigation />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Form Section */}
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-emerald-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-emerald-700">
                    <FileText className="h-5 w-5" />
                    Build Your Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ATSResumeForm 
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    disabled={usage.resumeBuilding.hasReachedLimit && subscription.tier === "free"}
                  />
                </CardContent>
              </Card>
            </div>

            {/* Preview Section */}
            <div className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm shadow-lg border-indigo-200">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 justify-between text-indigo-700">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Preview
                    </div>
                    {resumeData && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={downloadResume}
                          size="sm"
                          variant="outline"
                          className="text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          TXT
                        </Button>
                        <Button 
                          onClick={downloadResumePDF}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          PDF
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ATSResumePreview resumeData={resumeData} />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      
      <div className="mt-8">
        <LegalFooter />
      </div>
    </>
  );
};

export default ATSResumeBuilder;
