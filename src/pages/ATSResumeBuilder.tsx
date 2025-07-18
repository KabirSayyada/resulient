import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, FileText, Download, Zap, Target, Brain, Shield } from "lucide-react";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { UserMenuWithTheme } from "@/components/theme/UserMenuWithTheme";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";
import { ATSResumeForm } from "@/components/resume/ATSResumeForm";
import { ATSResumeModal } from "@/components/resume/ATSResumeModal";
import { useATSResumeBuilder } from "@/hooks/useATSResumeBuilder";
import { useSubscription } from "@/hooks/useSubscription";
import { useUsageLimits } from "@/hooks/useUsageLimits";
import { UseSubscriptionAlert } from "@/components/subscription/UseSubscriptionAlert";
import { OptimizationAnimation } from "@/components/resume/OptimizationAnimation";
import { Badge } from "@/components/ui/badge";

const ATSResumeBuilder = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { resumeData, isGenerating, generateResume, downloadResume, downloadResumePDF, downloadTextBasedPDF, downloadModernTemplatePDF } = useATSResumeBuilder(user?.id);
  const { subscription } = useSubscription();
  const { usage, checkUsage, showLimitReachedMessage } = useUsageLimits();

  if (!authLoading && !user) {
    navigate("/auth");
    return null;
  }

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 px-4">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-lg font-semibold text-slate-700 dark:text-slate-300 text-center">Loading your workspace...</span>
        </div>
      </div>
    );
  }

  const handleGenerate = async (formData: any) => {
    if (usage.resumeBuilding.hasReachedLimit) {
      showLimitReachedMessage("resume building");
      return;
    }

    await generateResume(formData);
    await checkUsage();
    
    // Open modal when resume is generated
    if (!isGenerating) {
      setIsModalOpen(true);
    }
  };

  const features = [
    { icon: Brain, text: "AI-Powered", color: "from-purple-500 to-indigo-600" },
    { icon: Shield, text: "ATS-Optimized", color: "from-emerald-500 to-teal-600" },
    { icon: Zap, text: "Lightning Fast", color: "from-yellow-500 to-orange-600" },
    { icon: Target, text: "Job-Targeted", color: "from-rose-500 to-pink-600" }
  ];

  return (
    <>
      <OptimizationAnimation 
        isOptimizing={isGenerating} 
        onComplete={() => setIsModalOpen(true)} 
        mode="ats-building"
      />
      
      <ATSResumeModal 
        isOpen={isModalOpen && !!resumeData}
        onClose={() => setIsModalOpen(false)}
        resumeData={resumeData || ""}
        onDownloadTXT={downloadResume}
        onDownloadPDF={downloadResumePDF}
        onDownloadTextBasedPDF={downloadTextBasedPDF}
        onDownloadModernTemplate={downloadModernTemplatePDF}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-x-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 dark:from-emerald-800/10 dark:to-blue-800/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 py-2 sm:py-6 px-2 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section - Mobile optimized */}
            <div className="flex flex-col gap-2 sm:gap-6 mb-3 sm:mb-8">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-4">
                  <Link to="/" className="flex items-center group">
                    <span className="font-brand text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none group-hover:scale-105 transition-transform duration-300">
                      Resulient
                    </span>
                  </Link>
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 px-2 py-1 text-xs font-semibold">
                      <Brain className="h-3 w-3 mr-1" />
                      ATS Resume Builder
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center gap-1 sm:gap-4 justify-between sm:justify-end">
                  <SubscriptionTierIndicator variant="badge" size="sm" />
                  <UserMenuWithTheme />
                </div>
              </div>
            </div>

            {/* Hero Info Section - Mobile optimized */}
            <div className="relative mb-3 sm:mb-8">
              <Card className="bg-gradient-to-br from-white/90 via-emerald-50/50 to-blue-50/50 dark:from-slate-900/90 dark:via-slate-800/50 dark:to-slate-900/50 border-2 border-emerald-200/60 dark:border-emerald-800/40 shadow-2xl backdrop-blur-sm">
                <CardContent className="p-3 sm:p-6 lg:p-8">
                  <div className="text-center space-y-2 sm:space-y-6">
                    <h1 className="text-lg sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-slate-800 via-emerald-700 to-blue-700 dark:from-slate-100 dark:via-emerald-300 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
                      Build Your Perfect ATS Resume
                    </h1>
                    
                    <p className="text-xs sm:text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed px-1 sm:px-2">
                      Create a professional, ATS-optimized resume in minutes using our AI-powered builder. 
                      Simply describe yourself in natural language, and we'll craft the perfect resume format.
                    </p>

                    {/* Feature Pills - Mobile optimized */}
                    <div className="flex flex-wrap justify-center gap-1 sm:gap-3 mt-3 sm:mt-8">
                      {features.map((feature, index) => (
                        <div 
                          key={index}
                          className={`flex items-center gap-1 px-2 sm:px-6 py-1.5 sm:py-3 bg-gradient-to-r ${feature.color} text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-default`}
                        >
                          <feature.icon className="h-3 w-3 sm:h-5 sm:w-5" />
                          <span className="font-semibold text-xs sm:text-base">{feature.text}</span>
                        </div>
                      ))}
                    </div>

                    {subscription.tier === "free" && (
                      <div className="mt-2 sm:mt-6 p-2 sm:p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-800/50 rounded-xl mx-1 sm:mx-0">
                        <div className="flex items-center justify-center gap-1 sm:gap-2 text-amber-700 dark:text-amber-300 font-semibold text-xs sm:text-base">
                          <Target className="h-3 w-3 sm:h-5 sm:w-5" />
                          Free tier: {usage.resumeBuilding.used}/{usage.resumeBuilding.limit} resume builds used
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {usage.resumeBuilding.hasReachedLimit && subscription.tier === "free" && (
              <div className="mb-3 sm:mb-8">
                <UseSubscriptionAlert 
                  subscriptionTier={subscription.tier} 
                  requiredTier="premium" 
                  message="You've reached your lifetime limit for resume building. Free users can build 1 resume. Upgrade to Premium or Platinum for unlimited resume building."
                />
              </div>
            )}

            <MainNavigation />

            {/* Main Content - Single Form Section - Mobile optimized */}
            <div className="max-w-4xl mx-auto mt-3 sm:mt-8">
              <Card className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm shadow-xl border-2 border-emerald-200/60 dark:border-emerald-800/40 hover:shadow-2xl transition-all duration-300">
                <CardHeader className="pb-2 sm:pb-6 px-3 sm:px-6 py-3 sm:py-6">
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 text-base sm:text-2xl font-bold">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl shadow-lg">
                        <FileText className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                      </div>
                      <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                        Build Your Resume
                      </span>
                    </div>
                    <Badge variant="secondary" className="sm:ml-auto bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300 px-2 py-1 text-xs w-fit">
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI-Enhanced
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
                  <ATSResumeForm 
                    onGenerate={handleGenerate}
                    isGenerating={isGenerating}
                    disabled={usage.resumeBuilding.hasReachedLimit && subscription.tier === "free"}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        
        <div className="relative z-10 mt-6 sm:mt-16">
          <LegalFooter />
        </div>
      </div>
    </>
  );
};

export default ATSResumeBuilder;
