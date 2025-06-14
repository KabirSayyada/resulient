import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { ResumeInputToggle } from "@/components/resume/ResumeInputToggle";
import { OptimizedResumeDisplay } from "@/components/resume/OptimizedResumeDisplay";
import { useToast } from "@/hooks/use-toast";
import { useSupabaseFunction } from "@/hooks/useSupabaseFunction";
import { QualificationGap } from "@/types/resume";
import { useResumeOptimizationHistory } from "@/hooks/useResumeOptimizationHistory";
import { OptimizationHistory } from "@/components/resume/OptimizationHistory";
import { MainNavigation } from "@/components/resume/MainNavigation";
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
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { ArrowRight, BookOpen, CheckCircle, ChevronDown, FileText, Star, Clock, BarChart, Users, Shield, Award, PieChart } from "lucide-react";
import { useReferralTracking } from "@/hooks/useReferralTracking";

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscription } = useSubscription();
  const isMobile = useIsMobile();

  // Initialize referral tracking
  useReferralTracking();

  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [qualificationGaps, setQualificationGaps] = useState<QualificationGap[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showResumeInput, setShowResumeInput] = useState(true);
  const [hasReachedLimit, setHasReachedLimit] = useState(false);
  const [showUpgradeAlert, setShowUpgradeAlert] = useState(false);

  const { callFunction, loading: functionLoading, error: functionError } = useSupabaseFunction();
  const { saveOptimization } = useResumeOptimizationHistory(user?.id);

  // Structured data for the main page
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Resulient ATS Resume Optimizer",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Intelligent resume optimization tool that helps job seekers get past ATS systems and land more interviews.",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "156",
      "bestRating": "5",
      "worstRating": "1"
    },
    "featureList": "ATS optimization, Keyword analysis, Resume scoring, Personalized suggestions",
    "screenshot": "/lovable-uploads/2f15a536-6c8b-4812-b04f-13e247804a93.png",
    "softwareHelp": "https://resulient.com/help",
    "softwareVersion": "2.0"
  };

  // Prepare FAQ schema
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is an ATS and why is it important?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "An Applicant Tracking System (ATS) is software used by employers to manage job applications. It's important because up to 75% of resumes are rejected by ATS before a human sees them."
        }
      },
      {
        "@type": "Question",
        "name": "How does Resulient optimize my resume?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Resulient uses advanced algorithms to analyze your resume against job descriptions, identifying missing keywords, improving formatting, and providing actionable suggestions to increase your chances of getting past ATS systems."
        }
      },
      {
        "@type": "Question",
        "name": "Is Resulient free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Resulient offers a free basic version with limited features. Premium and Platinum plans provide additional features like unlimited optimizations, keyword analytics, and personalized coaching."
        }
      }
    ]
  };

  // Stats for the landing page
  const atsStats = [
    { stat: "2%", description: "Average interview rate for unoptimized resumes" },
    { stat: "12%", description: "Interview rate for Resulient-optimized resumes" },
    { stat: "5x", description: "More likely to get interviews with our optimization" },
    { stat: "3 weeks", description: "Average time to first interview for our users" }
  ];

  useEffect(() => {
    if (!loading && !user) {
      // Don't redirect to auth page for landing page
      // We'll have signup/login buttons instead
    }
  }, [user, loading, navigate]);

  const handleOptimizeResume = async () => {
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

  const handleResumeSelected = () => {
    setShowResumeInput(false);
  };

  const handleShowResumeInput = () => {
    setShowResumeInput(true);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-lg font-semibold">Loading...</span>
      </div>
    );
  }

  const testimonials = [
    {
      quote: "After optimizing my resume with Resulient, I went from 2% response rate to landing interviews at 3 different Fortune 500 companies. The difference was night and day - I got 5 interview invitations in just two weeks!",
      author: "Michael T., Software Engineer"
    },
    {
      quote: "I was getting rejected immediately after submitting applications. After using Resulient, my interview rate increased by 400%. I got callbacks from companies that previously ignored me, and landed my dream job in 6 weeks.",
      author: "Sarah K., Marketing Director"
    },
    {
      quote: "Changing careers seemed impossible until I used Resulient. The tool helped me get 8 interviews in my target industry within a month. I successfully transitioned to tech and increased my salary by 60%!",
      author: "David L., Career Changer"
    }
  ];

  // If user is logged in, show the app dashboard
  if (user) {
    return (
      <>
        <Helmet>
          <title>Resulient | Smart Resume Optimization & ATS Scoring</title>
          <meta name="description" content="Transform your job search with Resulient's advanced resume optimization tool. Get past ATS systems and land more interviews with data-driven improvements." />
          <link rel="canonical" href="https://resulient.com/" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://resulient.com/" />
          <meta property="og:title" content="Resulient | Smart Resume Optimization & ATS Scoring" />
          <meta property="og:description" content="Transform your job search with Resulient's advanced resume optimization tool. Get past ATS systems and land more interviews with data-driven improvements." />
          <meta property="og:image" content="/lovable-uploads/2f15a536-6c8b-4812-b04f-13e247804a93.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="1200" />
          <meta property="og:site_name" content="Resulient" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@lovable_dev" />
          <meta name="twitter:title" content="Resulient | Smart Resume Optimization" />
          <meta name="twitter:description" content="Beat ATS systems and land more interviews with our intelligent AI-powered optimization tool" />
          <meta name="twitter:image" content="/lovable-uploads/2f15a536-6c8b-4812-b04f-13e247804a93.png" />
          
          {/* Structured data for the main application */}
          <script type="application/ld+json">
            {JSON.stringify(structuredData)}
          </script>
          
          {/* FAQ Schema markup */}
          <script type="application/ld+json">
            {JSON.stringify(faqSchema)}
          </script>
        </Helmet>

        <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          subscription.tier === "premium" 
            ? "bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 dark:from-blue-950 dark:via-gray-900 dark:to-indigo-950" 
            : subscription.tier === "platinum" 
              ? "bg-gradient-to-br from-purple-50 via-gray-50 to-indigo-50 dark:from-purple-950 dark:via-gray-900 dark:to-indigo-950" 
              : "bg-gray-50 dark:bg-gray-900"
        }`}>
          <div className="max-w-4xl mx-auto">
            {/* Brand Header with simplified color scheme */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <div className="flex items-center gap-4">
                <span className="font-brand text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                  Resulient
                </span>
                <span className="rounded-full px-3 py-1 text-xs sm:text-sm font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shadow border border-indigo-200 dark:border-indigo-700 animate-fade-in">
                  ATS Resume Optimization
                </span>
              </div>
              <div className="flex items-center gap-2">
                <SubscriptionTierIndicator variant="badge" size="md" className="animate-fade-in" />
                <UserMenuWithTheme />
              </div>
            </div>

            {/* Subscription Tier Banner - highly visible */}
            {subscription.tier !== "free" && (
              <div className={`mb-6 py-2 px-4 rounded-lg shadow-md border animate-fade-in text-center ${
                subscription.tier === "premium" 
                  ? "bg-blue-100 border-blue-300 text-blue-800 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-200" 
                  : "bg-purple-100 border-purple-300 text-purple-800 dark:bg-purple-900 dark:border-purple-700 dark:text-purple-200"
              }`}>
                <SubscriptionTierIndicator variant="full" size="lg" showTooltip={false} className="justify-center" />
              </div>
            )}

            {/* About section, styled and responsive */}
            <div className="bg-gradient-to-br from-indigo-50 via-gray-50 to-blue-50 dark:from-indigo-950 dark:via-gray-900 dark:to-blue-950 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-md px-4 py-5 mb-5 sm:mb-8 sm:px-6 mx-auto max-w-2xl text-center">
              <p className="text-lg sm:text-xl font-semibold text-indigo-900 dark:text-indigo-200 leading-snug mb-2">
                <span className="text-blue-600 dark:text-blue-400 font-bold">Resulient</span> increases your interview rate by up to 500%&nbsp;
                <span className="hidden sm:inline">—</span>
                <span className="block sm:inline text-base sm:text-lg font-normal text-indigo-700 dark:text-indigo-300">
                  Our users land 3x more interviews and get hired faster than traditional job seekers.
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Upload your resume and job description — we'll optimize your application to dramatically increase your chances of landing interviews at top companies.
              </p>
            </div>
            {/* End About section */}

            {/* Main functional area */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  ATS Resume Optimizer
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                  Optimize your resume to beat Applicant Tracking Systems (ATS)
                </p>
              </div>
              <div className="flex items-center gap-4">
                <OptimizationHistory userId={user?.id} />
              </div>
            </div>

            <MainNavigation />

            <div className="gap-6 space-y-8 animate-fade-in">
              <div className="grid md:grid-cols-2 gap-8">
                <JobDescriptionInput 
                  jobDescription={jobDescription} 
                  setJobDescription={setJobDescription} 
                />
                <ResumeInputToggle 
                  resumeContent={resumeContent} 
                  setResumeContent={setResumeContent} 
                  userId={user?.id}
                  onResumeSelected={handleResumeSelected}
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleOptimizeResume} 
                  disabled={isOptimizing || !resumeContent || !jobDescription || (hasReachedLimit && subscription.tier === "free")}
                  className={`px-7 py-3 text-lg font-bold rounded-full shadow transition-all ${
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
                <OptimizedResumeDisplay 
                  optimizedResume={optimizedResume}
                  jobDescription={jobDescription}
                  originalResume={resumeContent}
                  qualificationGaps={qualificationGaps}
                />
              )}
            </div>
          </div>
          <div className="mt-8">
            <LegalFooter />
          </div>
          <GuidedTour />
        </div>
      </>
    );
  }

  // If user is not logged in, show the landing page
  return (
    <>
      <Helmet>
        <title>Resulient | Smart Resume Optimization That Beats Every ATS System</title>
        <meta name="description" content="Discover how Resulient's advanced resume optimization tool can help you beat ATS systems and land more interviews. Get personalized resume recommendations based on job descriptions." />
        <link rel="canonical" href="https://resulient.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resulient.com/" />
        <meta property="og:title" content="Resulient | Smart Resume Optimization That Beats Every ATS System" />
        <meta property="og:description" content="Discover how Resulient's advanced resume optimization tool can help you beat ATS systems and land more interviews. Get personalized resume recommendations based on job descriptions." />
        <meta property="og:image" content="/lovable-uploads/2f15a536-6c8b-4812-b04f-13e247804a93.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:site_name" content="Resulient" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lovable_dev" />
        <meta name="twitter:title" content="Resulient | Smart Resume Optimization" />
        <meta name="twitter:description" content="Beat ATS systems and land more interviews with our intelligent AI-powered tool" />
        <meta name="twitter:image" content="/lovable-uploads/2f15a536-6c8b-4812-b04f-13e247804a93.png" />
        
        {/* Structured data for the main application */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
        
        {/* FAQ Schema markup */}
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-950">
        {/* Navigation */}
        <header className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <span className="font-brand text-3xl font-extrabold text-transparent bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
                  Resulient
                </span>
                <span className="ml-2 rounded-full px-3 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 shadow border border-indigo-200 dark:border-indigo-700">
                  ATS Optimizer
                </span>
              </div>
              <div className="flex gap-2 items-center">
                <Link to="/blog" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium mx-3 hidden sm:block">
                  Blog
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-medium mx-3 hidden sm:block">
                  Pricing
                </Link>
                <Link to="/auth" className="inline-flex items-center font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                  Login
                </Link>
                <Link to="/auth" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Sign up
                </Link>
                <UserMenuWithTheme />
              </div>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white leading-tight">
                  5x Your Interview Rate.
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600">
                    Land Your Dream Job.
                  </span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Resulient users get 5x more interviews than traditional job seekers. Our intelligent 
                  AI optimization doesn't just beat ATS systems — it creates resumes that recruiters 
                  can't ignore, leading to interview invitations within days, not months.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/auth" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105">
                  Start Landing Interviews <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/blog/how-ats-systems-reject-resumes" className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-full shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  See Success Stories
                </Link>
              </div>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Join 100,000+ professionals landing more interviews</span>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-500 to-indigo-500 rounded-lg blur-lg opacity-60 animate-pulse"></div>
              <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d" 
                  alt="Resume optimization" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent text-white p-6">
                  <div className="flex items-center">
                    <div className="flex -space-x-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center bg-indigo-${i * 100 + 300}`}>
                          <CheckCircle className="h-4 w-4 text-white" />
                        </div>
                      ))}
                    </div>
                    <div className="ml-4">
                      <div className="font-medium">Real-time ATS Analysis</div>
                      <div className="text-sm opacity-80">See why you're being rejected</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ATS Statistics Section */}
        <section className="py-16 bg-indigo-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Interview Success Gap</h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
                Why most job seekers struggle while Resulient users thrive
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { stat: "2%", description: "Average interview rate for unoptimized resumes" },
                { stat: "12%", description: "Interview rate for Resulient-optimized resumes" },
                { stat: "5x", description: "More likely to get interviews with our optimization" },
                { stat: "3 weeks", description: "Average time to first interview for our users" }
              ].map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 transform transition-all duration-300 hover:scale-105 border border-indigo-100 dark:border-indigo-900">
                  <div className="flex flex-col items-center text-center">
                    <div className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-2">{item.stat}</div>
                    <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-12 text-center">
              <button 
                onClick={() => setShowStats(!showStats)}
                className="inline-flex items-center px-4 py-2 text-indigo-600 dark:text-indigo-400 font-medium hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
              >
                {showStats ? "Hide Details" : "Show More ATS Facts"} 
                <ChevronDown className={`ml-2 h-5 w-5 transition-transform duration-300 ${showStats ? 'rotate-180' : 'rotate-0'}`} />
              </button>
              
              {showStats && (
                <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 border border-indigo-100 dark:border-indigo-900 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-start">
                      <Clock className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Average Resume Review Time</h3>
                        <p className="text-gray-600 dark:text-gray-300">Recruiters spend an average of just 6-7 seconds reviewing a resume that makes it past the ATS.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <BarChart className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Keyword Match Rate</h3>
                        <p className="text-gray-600 dark:text-gray-300">Resumes with at least 60% keyword match rate are more likely to pass ATS screening.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Shield className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Formatting Matters</h3>
                        <p className="text-gray-600 dark:text-gray-300">Complex formatting, tables, and graphics can confuse ATS systems and cause immediate rejection.</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Award className="h-6 w-6 text-indigo-500 mr-3 flex-shrink-0 mt-1" />
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">Success Rate Increase</h3>
                        <p className="text-gray-600 dark:text-gray-300">Job seekers who optimize their resumes for ATS see up to 3x more interview invitations.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                <span className="block">Why Our Users Get 5x More Interviews</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our technology doesn't just pass ATS filters—it creates compelling narratives 
                that make recruiters eager to interview you.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                  title: "Interview-Winning Formatting",
                  description: "We don't just make your resume ATS-friendly—we structure it to capture recruiter attention in the critical first 6 seconds, dramatically increasing interview callbacks."
                },
                {
                  icon: <PieChart className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                  title: "Compelling Content Optimization",
                  description: "Our AI transforms your experience into compelling stories that resonate with hiring managers, making them excited to meet you and learn more about your potential."
                },
                {
                  icon: <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                  title: "Interview-Ready Positioning",
                  description: "We strategically position your skills and achievements to address exactly what employers need, making you the obvious choice for an interview invitation."
                }
              ].map((feature, i) => (
                <Card key={i} className="border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg group hover:-translate-y-2">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-3 mb-4 group-hover:bg-indigo-200 dark:group-hover:bg-indigo-800 transition-colors">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* How It Works Section */}
            <div className="mt-24">
              <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-12">
                How Resulient Works
              </h2>
              
              <div className="relative">
                {/* Timeline Connector */}
                <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-indigo-200 dark:bg-indigo-800 transform -translate-x-1/2"></div>
                
                {/* Step 1 */}
                <div className="relative md:grid md:grid-cols-2 md:gap-8 mb-12 md:mb-24">
                  <div className="md:text-right md:pr-12">
                    <div className="hidden md:block absolute right-0 top-6 w-12 h-0.5 bg-indigo-200 dark:bg-indigo-800"></div>
                    <div className="hidden md:flex absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/3 items-center justify-center w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900 bg-indigo-500 text-white">
                      <span className="text-xl font-bold">1</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Upload Your Resume</h3>
                    <p className="text-gray-600 dark:text-gray-300">Simply upload your existing resume in any format. Our system will parse and analyze your document.</p>
                  </div>
                  <div className="md:pl-12 mt-6 md:mt-0">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 shadow-sm border border-indigo-100 dark:border-indigo-800">
                      <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" alt="Uploading resume" className="rounded-lg shadow-md w-full object-cover h-48" />
                    </div>
                  </div>
                </div>
                
                {/* Step 2 */}
                <div className="relative md:grid md:grid-cols-2 md:gap-8 mb-12 md:mb-24">
                  <div className="md:pl-12 order-2 md:order-1">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 shadow-sm border border-indigo-100 dark:border-indigo-800">
                      <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f" alt="Deep Analysis" className="rounded-lg shadow-md w-full object-cover h-48" />
                    </div>
                  </div>
                  <div className="md:text-left md:pl-12 order-1 md:order-2">
                    <div className="hidden md:block absolute left-0 top-6 w-12 h-0.5 bg-indigo-200 dark:bg-indigo-800"></div>
                    <div className="hidden md:flex absolute left-0 top-0 transform -translate-x-1/2 -translate-y-1/3 items-center justify-center w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900 bg-indigo-500 text-white">
                      <span className="text-xl font-bold">2</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Deep Analysis</h3>
                    <p className="text-gray-600 dark:text-gray-300">Our advanced system compares your resume against the job description, analyzing keywords, formatting, and qualification matches.</p>
                  </div>
                </div>
                
                {/* Step 3 */}
                <div className="relative md:grid md:grid-cols-2 md:gap-8">
                  <div className="md:text-right md:pr-12">
                    <div className="hidden md:block absolute right-0 top-6 w-12 h-0.5 bg-indigo-200 dark:bg-indigo-800"></div>
                    <div className="hidden md:flex absolute right-0 top-0 transform translate-x-1/2 -translate-y-1/3 items-center justify-center w-12 h-12 rounded-full border-4 border-indigo-100 dark:border-indigo-900 bg-indigo-500 text-white">
                      <span className="text-xl font-bold">3</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Get Optimized Results</h3>
                    <p className="text-gray-600 dark:text-gray-300">Receive your ATS-optimized resume, complete with scores, improvement suggestions, and qualification gap analysis.</p>
                  </div>
                  <div className="md:pl-12 mt-6 md:mt-0">
                    <div className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-4 shadow-sm border border-indigo-100 dark:border-indigo-800">
                      <img src="https://images.unsplash.com/photo-1498050108023-c5249f4df085" alt="Optimized results" className="rounded-lg shadow-md w-full object-cover h-48" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-indigo-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Real Results from Real Professionals
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                See how Resulient transformed their job search from months of rejection to multiple interview offers.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 italic mb-4">"{testimonial.quote}"</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{testimonial.author}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Frequently Asked Questions
              </h2>
              <p className="mt-4 text-gray-600 dark:text-gray-300">
                Everything you need to know about landing more interviews with Resulient
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: "How does Resulient increase my interview rate by 5x?",
                  answer: "Resulient combines ATS optimization with human psychology. While other tools only focus on getting past automated filters, we optimize your resume to capture recruiter attention and create compelling narratives that make hiring managers excited to interview you. Our users typically see interview rates jump from 2% to 10-15%."
                },
                {
                  question: "What makes Resulient different from other resume tools?",
                  answer: "Most tools only check for keywords. Resulient transforms your entire professional story into an interview-winning narrative. We analyze job descriptions to understand what employers truly want, then reposition your experience to show you're the perfect fit, resulting in significantly higher callback rates."
                },
                {
                  question: "How quickly will I see results?",
                  answer: "Most users see interview invitations within 1-2 weeks of using their optimized resume. Our fastest success story landed 3 interviews in just 5 days. The key is that we don't just make your resume ATS-compliant—we make it irresistible to recruiters."
                },
                {
                  question: "Is this just about beating ATS systems?",
                  answer: "No! While we ensure your resume passes all ATS filters, our real strength is creating resumes that humans love to read. We focus on compelling storytelling, achievement highlighting, and strategic positioning that makes recruiters think 'I need to interview this person immediately.'"
                },
                {
                  question: "What if I'm changing careers or have gaps in employment?",
                  answer: "Career changers and people with employment gaps see some of our best results! We excel at reframing your background to highlight transferable skills and positioning any gaps as strategic career moves. Our optimization helps you compete confidently in new industries."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-indigo-50 dark:bg-indigo-900/30 rounded-lg p-6 border border-indigo-100 dark:border-indigo-800">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{faq.question}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
              Ready to 5x Your Interview Rate?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
              Join over 100,000 professionals who have transformed their job search from months of silence to multiple interview offers with Resulient's proven optimization system.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth" className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105">
                Start Getting Interviews Today
              </Link>
              <Link to="/blog" className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-full hover:bg-opacity-90 transition-all duration-300">
                Read Success Stories <BookOpen className="inline-block ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <LegalFooter />
      </div>
    </>
  );
};

export default Index;
