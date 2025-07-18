
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
  const { resumeData, isGenerating, generateResume, downloadResume, downloadResumePDF, downloadTextBasedPDF, downloadFreshTemplatePDF } = useATSResumeBuilder(user?.id);
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
    { icon: Brain, text: "AI-Powered", color: "from-purple-400 to-indigo-500" },
    { icon: Shield, text: "ATS-Optimized", color: "from-emerald-400 to-teal-500" },
    { icon: Zap, text: "Lightning Fast", color: "from-yellow-400 to-orange-500" },
    { icon: Target, text: "Job-Targeted", color: "from-rose-400 to-pink-500" }
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
        onDownloadFreshTemplate={downloadFreshTemplatePDF}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 overflow-x-hidden">
        {/* Animated background elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 dark:from-emerald-800/10 dark:to-blue-800/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-20 sm:-bottom-40 -left-20 sm:-left-40 w-40 sm:w-80 h-40 sm:h-80 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative z-10 py-2 sm:py-6 px-2 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            {/* Enhanced Header Section */}
            <div className="flex flex-col gap-4 sm:gap-8 mb-6 sm:mb-12">
              {/* Top Navigation Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-4">
                  <Link to="/" className="flex items-center group">
                    <span className="font-brand text-xl sm:text-2xl md:text-4xl lg:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none group-hover:scale-105 transition-transform duration-300">
                      Resulient
                    </span>
                  </Link>
                </div>
                
                <div className="flex items-center gap-2 sm:gap-4 justify-between sm:justify-end">
                  <SubscriptionTierIndicator variant="badge" size="sm" />
                  <UserMenuWithTheme />
                </div>
              </div>

              {/* Enhanced Hero Section */}
              <div className="relative">
                <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 via-emerald-50/60 to-blue-50/60 dark:from-slate-900/95 dark:via-emerald-950/30 dark:to-blue-950/30 border-0 shadow-2xl backdrop-blur-sm">
                  {/* Subtle animated background */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-300/40 to-transparent rounded-full blur-2xl animate-pulse delay-300"></div>
                    <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-gradient-to-tl from-blue-300/40 to-transparent rounded-full blur-2xl animate-pulse delay-700"></div>
                  </div>
                  
                  <CardContent className="relative z-10 p-6 sm:p-8 lg:p-12">
                    <div className="text-center space-y-6 sm:space-y-8">
                      {/* Main Title with Badge */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3 mb-4">
                          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
                            <Brain className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
                          </div>
                          <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg px-4 py-2 text-sm font-semibold">
                            <Sparkles className="h-4 w-4 mr-1" />
                            ATS Resume Builder
                          </Badge>
                        </div>
                        
                        <h1 className="text-2xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-800 via-emerald-700 to-blue-700 dark:from-slate-100 dark:via-emerald-300 dark:to-blue-300 bg-clip-text text-transparent leading-tight">
                          Build Your Perfect
                          <br />
                          <span className="text-emerald-600 dark:text-emerald-400">ATS Resume</span>
                        </h1>
                      </div>
                      
                      {/* Enhanced Description */}
                      <div className="max-w-3xl mx-auto space-y-4">
                        <p className="text-base sm:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
                          Create a professional, ATS-optimized resume in minutes using our AI-powered builder.
                        </p>
                        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
                          Simply describe yourself in natural language, and we'll craft the perfect resume format that beats applicant tracking systems.
                        </p>
                      </div>

                      {/* Softened Feature Pills */}
                      <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8">
                        {features.map((feature, index) => (
                          <div 
                            key={index}
                            className="group relative"
                          >
                            <div className="flex items-center gap-2 px-4 py-2.5 bg-white/80 dark:bg-slate-800/80 border border-slate-200/60 dark:border-slate-700/60 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:scale-102 cursor-default backdrop-blur-sm">
                              <feature.icon className={`h-4 w-4 bg-gradient-to-r ${feature.color} bg-clip-text text-transparent group-hover:animate-pulse`} />
                              <span className="font-medium text-slate-700 dark:text-slate-300 text-sm">{feature.text}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Usage Statistics */}
                      {subscription.tier === "free" && (
                        <div className="mt-8 p-4 sm:p-6 bg-gradient-to-r from-amber-50/80 to-orange-50/80 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200/60 dark:border-amber-800/50 rounded-2xl backdrop-blur-sm">
                          <div className="flex items-center justify-center gap-2 text-amber-700 dark:text-amber-300 font-semibold">
                            <Target className="h-5 w-5" />
                            <span className="text-sm sm:text-base">
                              Free tier: {usage.resumeBuilding.used}/{usage.resumeBuilding.limit} resume builds used
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
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
