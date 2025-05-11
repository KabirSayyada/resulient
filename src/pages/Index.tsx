import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { FileUploadSection } from "@/components/resume/FileUploadSection";
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
import { ArrowRight, BookOpen, CheckCircle, FileText, Users } from "lucide-react";

const Index = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { subscription } = useSubscription();
  const isMobile = useIsMobile();

  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const [optimizedResume, setOptimizedResume] = useState("");
  const [qualificationGaps, setQualificationGaps] = useState<QualificationGap[]>([]);
  const [optimizing, setOptimizing] = useState(false);

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
    "description": "AI-powered resume optimization tool that helps job seekers get past ATS systems and land more interviews.",
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
          "text": "Resulient uses AI to analyze your resume against job descriptions, identifying missing keywords, improving formatting, and providing actionable suggestions to increase your chances of getting past ATS systems."
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

    setOptimizing(true);

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
      setOptimizing(false);
    }
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
      quote: "Resulient helped me get past the ATS and land interviews at 3 different Fortune 500 companies after months of silence. The optimization engine knows exactly what recruiters are looking for.",
      author: "Michael T., Software Engineer"
    },
    {
      quote: "I was getting rejected immediately after submitting applications. After using Resulient to optimize my resume, I started getting callbacks within days. The qualification gap analysis was a game-changer.",
      author: "Sarah K., Marketing Director"
    },
    {
      quote: "As someone changing careers, I struggled to highlight my transferable skills. Resulient showed me exactly how to reframe my experience to match job descriptions. I landed my dream job in a new industry!",
      author: "David L., Career Changer"
    }
  ];

  // If user is logged in, show the app dashboard
  if (user) {
    return (
      <>
        <Helmet>
          <title>Resulient | AI-Powered Resume Optimization & ATS Scoring</title>
          <meta name="description" content="Transform your job search with Resulient's AI-powered resume optimization tool. Get past ATS systems and land more interviews with data-driven improvements." />
          <link rel="canonical" href="https://resulient.com/" />
          
          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://resulient.com/" />
          <meta property="og:title" content="Resulient | AI-Powered Resume Optimization & ATS Scoring" />
          <meta property="og:description" content="Transform your job search with Resulient's AI-powered resume optimization tool. Get past ATS systems and land more interviews with data-driven improvements." />
          <meta property="og:image" content="/lovable-uploads/2f15a536-6c8b-4812-b04f-13e247804a93.png" />
          <meta property="og:image:width" content="1200" />
          <meta property="og:image:height" content="1200" />
          <meta property="og:site_name" content="Resulient" />
          
          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:site" content="@lovable_dev" />
          <meta name="twitter:title" content="Resulient | AI-Powered Resume Optimization" />
          <meta name="twitter:description" content="Beat ATS systems and land more interviews with our AI-powered tool" />
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
            {/* Brand Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-2">
              <div className="flex items-center gap-4">
                <span className="font-brand text-4xl sm:text-5xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
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

            {/* NEW: About section, styled and responsive */}
            <div className="bg-gradient-to-br from-fuchsia-50 via-indigo-50 to-yellow-50 dark:from-fuchsia-950 dark:via-indigo-950 dark:to-yellow-950 rounded-xl border border-indigo-100 dark:border-indigo-800 shadow-md px-4 py-5 mb-5 sm:mb-8 sm:px-6 mx-auto max-w-2xl text-center">
              <p className="text-lg sm:text-xl font-semibold text-indigo-900 dark:text-indigo-200 leading-snug mb-2">
                <span className="text-fuchsia-700 dark:text-fuchsia-400 font-bold">Resulient</span> is on a mission to make your resume shine&nbsp;
                <span className="hidden sm:inline">—</span>
                <span className="block sm:inline text-base sm:text-lg font-normal text-indigo-700 dark:text-indigo-300">
                  We give everyone a fighting chance against unfair machines and "black box" ATS gatekeepers.
                </span>
              </p>
              <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                Upload your resume and the job description — we help you stand out, get noticed, and get hired, no matter what automated system tries to stop you.
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
                <FileUploadSection 
                  resumeContent={resumeContent} 
                  setResumeContent={setResumeContent} 
                />
              </div>
              
              <div className="flex justify-center">
                <Button 
                  onClick={handleOptimizeResume} 
                  disabled={optimizing || !resumeContent || !jobDescription}
                  className={`px-7 py-3 text-lg font-bold rounded-full shadow transition-all ${
                    subscription.tier === "premium" 
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600" 
                      : subscription.tier === "platinum" 
                        ? "bg-gradient-to-r from-purple-500 to-indigo-400 hover:from-purple-600 hover:to-indigo-500" 
                        : "bg-gradient-to-r from-fuchsia-500 to-indigo-400 hover:from-fuchsia-600 hover:to-indigo-500"
                  }`}
                >
                  {optimizing ? "Optimizing..." : "Optimize Resume"}
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
        <title>Resulient | AI-Powered Resume Optimization That Beats Every ATS System</title>
        <meta name="description" content="Discover how Resulient's AI-powered resume optimization tool can help you beat ATS systems and land more interviews. Get personalized resume recommendations based on job descriptions." />
        <link rel="canonical" href="https://resulient.com/" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://resulient.com/" />
        <meta property="og:title" content="Resulient | AI-Powered Resume Optimization That Beats Every ATS System" />
        <meta property="og:description" content="Discover how Resulient's AI-powered resume optimization tool can help you beat ATS systems and land more interviews. Get personalized resume recommendations based on job descriptions." />
        <meta property="og:image" content="/lovable-uploads/2f15a536-6c8b-4812-b04f-13e247804a93.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="1200" />
        <meta property="og:site_name" content="Resulient" />
        
        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lovable_dev" />
        <meta name="twitter:title" content="Resulient | AI-Powered Resume Optimization" />
        <meta name="twitter:description" content="Beat ATS systems and land more interviews with our AI-powered tool" />
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
                <span className="font-brand text-3xl font-extrabold text-transparent bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-yellow-400 bg-clip-text animate-fade-in drop-shadow-lg tracking-tight select-none">
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
                  Beat the ATS.
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-600 to-indigo-600">
                    Land More Interviews.
                  </span>
                </h1>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
                  Resulient's AI-powered resume optimization ensures your application makes it past 
                  Applicant Tracking Systems (ATS) and into human hands. Don't let algorithms reject 
                  your dream job application.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/auth" className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform transition-all duration-300 hover:scale-105">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link to="/blog/how-ats-systems-reject-resumes" className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-base font-medium rounded-full shadow-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Learn How ATS Works
                </Link>
              </div>

              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span>Over 100,000 professionals trust Resulient</span>
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

        {/* Features Section */}
        <section className="py-16 bg-white dark:bg-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl">
                <span className="block">Why Resulient Outperforms Other Tools</span>
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Our AI doesn't just check for keywords—it understands context, formatting, 
                and what makes resumes stand out to both machines and humans.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: <FileText className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                  title: "ATS-Optimized Formatting",
                  description: "We restructure your resume to ensure it's parsed correctly by every ATS, eliminating the risk of data misinterpretation."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                  title: "Advanced Keyword Analysis",
                  description: "Our AI identifies missing skills and experience from job descriptions and intelligently integrates them into your resume."
                },
                {
                  icon: <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />,
                  title: "Qualification Gap Detection",
                  description: "We pinpoint areas where your experience differs from requirements and suggest how to bridge those gaps effectively."
                }
              ].map((feature, i) => (
                <Card key={i} className="border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
                  <CardContent className="p-6 flex flex-col items-center text-center">
                    <div className="rounded-full bg-indigo-100 dark:bg-indigo-900 p-3 mb-4">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-indigo-50 dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">
                Trusted by Job Seekers Worldwide
              </h2>
              <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                See how Resulient has transformed the job search experience for professionals across industries.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-md">
                  <CardContent className="p-6">
                    <div className="flex mb-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg key={star} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
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

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold sm:text-4xl mb-6">
              Ready to Transform Your Job Search?
            </h2>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
              Join over 100,000 professionals who have used Resulient to land interviews at top companies.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth" className="px-8 py-3 border-2 border-white text-white font-bold rounded-full hover:bg-white hover:text-indigo-600 transition-all duration-300 transform hover:scale-105">
                Start Free Optimization
              </Link>
              <Link to="/blog" className="px-8 py-3 bg-white text-indigo-600 font-bold rounded-full hover:bg-opacity-90 transition-all duration-300">
                Read Our Blog <BookOpen className="inline-block ml-2 h-5 w-5" />
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
