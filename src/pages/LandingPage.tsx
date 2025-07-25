
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star, Clock, TrendingUp, Users, Shield, Award, Target, Rocket, Menu, X, Zap, Diamond, Search, Building, MapPin, DollarSign, Database, Brain, Sparkles, Layers, BarChart3, BookOpen, Lightbulb } from "lucide-react";
import { LegalFooter } from "@/components/layout/LegalFooter";
import { Helmet } from "react-helmet-async";
import { useReferralTracking } from "@/hooks/useReferralTracking";

const LandingPage = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize referral tracking
  useReferralTracking();

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
        "name": "How does Resulient's job matching work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Resulient scans over 10,000 job boards daily, analyzing millions of fresh job postings. Our AI matches each user with positions that truly fit their profile, ensuring you only apply to jobs where you have a strong chance of success."
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

  const testimonials = [
    {
      quote: "After optimizing my resume with Resulient, I went from 2% response rate to landing interviews at 3 different Fortune 500 companies. The difference was night and day - I got 5 interview invitations in just two weeks!",
      author: "Michael T., Software Engineer",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=64&h=64&fit=crop&crop=face&auto=format",
      company: "Google"
    },
    {
      quote: "I was getting rejected immediately after submitting applications. After using Resulient, my interview rate increased by 400%. I got callbacks from companies that previously ignored me, and landed my dream job in 6 weeks.",
      author: "Sarah K., Marketing Director",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=64&h=64&fit=crop&crop=face&auto=format",
      company: "Meta"
    },
    {
      quote: "Changing careers seemed impossible until I used Resulient. The tool helped me get 8 interviews in my target industry within a month. I successfully transitioned to tech and increased my salary by 60%!",
      author: "David L., Career Changer",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face&auto=format",
      company: "Apple"
    }
  ];

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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
        {/* Dynamic background patterns */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-gradient-to-r from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-gradient-to-r from-amber-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
          
          {/* Hexagonal pattern overlay */}
          <div className="absolute inset-0 opacity-10">
            <svg width="100%" height="100%" className="absolute inset-0">
              <defs>
                <pattern id="hexagons" x="0" y="0" width="100" height="87" patternUnits="userSpaceOnUse">
                  <polygon points="50,1 85,25 85,62 50,86 15,62 15,25" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hexagons)" />
            </svg>
          </div>
        </div>

        {/* Navigation */}
        <header className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/30 dark:border-gray-700/30 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-300">
                    <Rocket className="h-7 w-7 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="font-bold text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
                    Resulient
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">AI-Powered</div>
                </div>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex gap-2 items-center">
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium mx-3 transition-all duration-200 hover:scale-105">
                  Blog
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium mx-3 transition-all duration-200 hover:scale-105">
                  Pricing
                </Link>
                <Link to="/auth" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200">
                  Login
                </Link>
                <Link to="/auth" className="ml-2 inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                  Get Started
                </Link>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200/30 dark:border-gray-700/30 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-b-2xl">
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/blog" 
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors px-4 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    to="/auth" 
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium px-4 py-2 transition-colors border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/auth" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-2xl shadow-xl transition-all duration-300 mx-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 px-6 py-3 rounded-full border border-blue-200/50 dark:border-blue-800/50 shadow-lg">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">AI-Powered Resume Optimization</span>
                </div>
                
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-tight">
                  Land Your
                  <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-emerald-600 bg-clip-text text-transparent">
                    Dream Job
                  </span>
                  <span className="block text-5xl sm:text-6xl lg:text-7xl mt-2 bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">5x Faster</span>
                </h1>
                
                <p className="text-2xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed font-medium">
                  Transform your job search from <span className="font-bold text-red-600 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-lg">months of rejection</span> to 
                  <span className="font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg ml-1"> multiple interview offers</span> in weeks. 
                  Our AI doesn't just beat ATS systems—it creates resumes that make recruiters excited to meet you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/auth" className="group relative inline-flex items-center justify-center px-10 py-5 text-xl font-bold rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-30 group-hover:opacity-50 transition-opacity"></div>
                  <span className="relative">Start Getting Interviews</span>
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform relative" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-12 pt-6">
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face&auto=format",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face&auto=format",
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face&auto=format"
                    ].map((src, i) => (
                      <img key={i} src={src} alt={`User ${i + 1}`} className="w-12 h-12 rounded-full border-3 border-white dark:border-gray-800 shadow-xl" />
                    ))}
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-bold">
                      4.9/5 from 2,000+ reviews
                    </p>
                  </div>
                </div>
                
                <div className="hidden sm:block h-12 w-px bg-gradient-to-b from-gray-300 to-transparent dark:from-gray-600"></div>
                
                <div className="flex items-center">
                  <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-600 dark:text-gray-400">
                    Free to start • No credit card required
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Enhanced Dashboard Preview */}
              <div className="relative bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden backdrop-blur-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5"></div>
                <div className="relative p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                        <Target className="h-8 w-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">ATS Score</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Real-time analysis</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-4xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">94%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 font-bold">Optimized</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl border border-emerald-200/50 dark:border-emerald-800/60 shadow-lg">
                      <span className="text-sm font-bold text-emerald-800 dark:text-emerald-300">Keywords Match</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-emerald-200 dark:bg-emerald-800 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transform scale-x-90 origin-left"></div>
                        </div>
                        <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">92%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-2xl border border-blue-200/50 dark:border-blue-800/60 shadow-lg">
                      <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Format Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                        </div>
                        <span className="text-sm font-black text-blue-600 dark:text-blue-400">98%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-2xl border border-purple-200/50 dark:border-purple-800/60 shadow-lg">
                      <span className="text-sm font-bold text-purple-800 dark:text-purple-300">Impact Score</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-2 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden">
                          <div className="w-full h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transform scale-x-90 origin-left"></div>
                        </div>
                        <span className="text-sm font-black text-purple-600 dark:text-purple-400">91%</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 dark:from-emerald-700 dark:to-teal-700 p-6 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-lg">Interview Prediction</p>
                      <p className="text-sm text-emerald-100">Based on current optimization</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-black">87%</div>
                      <div className="text-sm text-emerald-100">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Enhanced floating stats */}
              <div className="absolute -top-8 -left-8 bg-gradient-to-br from-white to-emerald-50 dark:from-gray-800 dark:to-emerald-900/20 rounded-2xl shadow-2xl border border-emerald-200/50 dark:border-emerald-700/50 p-6 backdrop-blur-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">5x</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-bold">More Interviews</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -right-8 bg-gradient-to-br from-white to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl shadow-2xl border border-blue-200/50 dark:border-blue-700/50 p-6 backdrop-blur-xl">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">2 weeks</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-bold">To Interview</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Matching Section */}
        <section className="py-24 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-blue-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 px-6 py-3 rounded-full border border-purple-200/50 dark:border-purple-800/50 shadow-lg mb-8">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent">Revolutionary Job Matching</span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-8">
                The World's First Intelligent 
                <span className="block bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent">
                  Job Matching Platform
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                We've revolutionized job searching forever. No more endless scrolling through irrelevant postings. 
                <span className="font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30 px-2 py-1 rounded-lg"> Resulient is the only platform</span> that scans over 
                <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-1 rounded-lg"> 10,000 job boards daily</span>, analyzing millions of fresh opportunities 
                to match you with positions where you'll actually succeed.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Benefits */}
              <div className="space-y-10">
                <div className="space-y-8">
                  {[
                    {
                      icon: <Database className="h-10 w-10 text-white" />,
                      title: "10,000+ Job Boards Scanned Daily",
                      description: "Our AI continuously monitors every major job platform, company career pages, and hidden job boards to find opportunities others miss.",
                      gradient: "from-blue-500 to-cyan-500"
                    },
                    {
                      icon: <Brain className="h-10 w-10 text-white" />,
                      title: "Intelligent Fit Analysis",
                      description: "Advanced algorithms analyze your skills, experience, and career goals against millions of job requirements to find your perfect matches.",
                      gradient: "from-purple-500 to-pink-500"
                    },
                    {
                      icon: <Target className="h-10 w-10 text-white" />,
                      title: "Apply Only Where You'll Succeed",
                      description: "Stop wasting time on jobs you won't get. Our platform ensures you only see positions where you have a genuine competitive advantage.",
                      gradient: "from-emerald-500 to-teal-500"
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-6 group">
                      <div className={`flex-shrink-0 w-20 h-20 bg-gradient-to-r ${benefit.gradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 border border-emerald-200/50 dark:border-emerald-800/50 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h4 className="text-xl font-bold text-emerald-800 dark:text-emerald-300">The Result?</h4>
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium text-lg">
                    Users report spending 90% less time job hunting while getting 400% more interview invitations. 
                    <span className="font-bold"> This is the future of job searching.</span>
                  </p>
                </div>
              </div>

              {/* Enhanced Job Match Preview */}
              <div className="relative">
                <div className="relative bg-gradient-to-br from-white to-purple-50 dark:from-gray-800 dark:to-purple-900/20 rounded-3xl shadow-2xl border border-purple-200/50 dark:border-purple-700/50 overflow-hidden backdrop-blur-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5"></div>
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-700 dark:to-pink-700 p-8 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">Perfect Job Matches</h3>
                        <p className="text-purple-100 font-medium">Curated just for you</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black">98%</div>
                        <div className="text-sm text-purple-100">Match Score</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative p-8 space-y-6">
                    {[
                      {
                        title: "Senior Software Engineer",
                        company: "TechCorp Inc.",
                        location: "San Francisco, CA",
                        salary: "$140k - $180k",
                        match: "98%",
                        gradient: "from-emerald-500 to-teal-500"
                      },
                      {
                        title: "Full Stack Developer",
                        company: "InnovateLab",
                        location: "Remote",
                        salary: "$120k - $160k",
                        match: "95%",
                        gradient: "from-blue-500 to-purple-500"
                      },
                      {
                        title: "Lead Developer",
                        company: "StartupXYZ",
                        location: "New York, NY",
                        salary: "$130k - $170k",
                        match: "92%",
                        gradient: "from-purple-500 to-pink-500"
                      }
                    ].map((job, i) => (
                      <div key={i} className="p-6 bg-gradient-to-r from-gray-50 to-white dark:from-gray-700/50 dark:to-gray-600/50 rounded-2xl border border-gray-200/50 dark:border-gray-600/50 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white">{job.title}</h4>
                            <p className="text-gray-600 dark:text-gray-300 font-semibold">{job.company}</p>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-bold bg-gradient-to-r ${job.gradient} text-white shadow-lg`}>
                            {job.match} Match
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-medium">{job.salary}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 p-6 border-t border-purple-200/50 dark:border-purple-700/50">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        3 new perfect matches today
                      </span>
                      <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg">
                        View All Matches
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-3xl"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-8">
                Why Job Seekers Choose Resulient
              </h2>
              <p className="text-2xl text-blue-100 max-w-3xl mx-auto font-medium">
                Real results from real professionals who transformed their job search
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { stat: "5x", description: "More interview invitations", icon: Target, gradient: "from-emerald-400 to-teal-400" },
                { stat: "87%", description: "Success rate for our users", icon: TrendingUp, gradient: "from-blue-400 to-cyan-400" },
                { stat: "2 weeks", description: "Average time to first interview", icon: Clock, gradient: "from-purple-400 to-pink-400" },
                { stat: "50k+", description: "Professionals transformed", icon: Users, gradient: "from-amber-400 to-orange-400" }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${item.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                    <item.icon className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-white mb-3">{item.stat}</div>
                  <p className="text-blue-100 font-semibold text-lg">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-gray-900 dark:text-white sm:text-6xl mb-8">
                The Complete Interview-Winning System
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto font-medium">
                We don't just optimize resumes—we engineer interview opportunities through proven psychological and technical strategies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Zap className="h-12 w-12 text-white" />,
                  title: "ATS Domination",
                  description: "Our advanced algorithms ensure your resume not only passes every ATS filter but ranks at the top of recruiter searches, guaranteeing human eyes see your application.",
                  features: ["98% ATS pass rate", "Keyword optimization", "Format perfection"],
                  gradient: "from-blue-500 to-cyan-500"
                },
                {
                  icon: <Target className="h-12 w-12 text-white" />,
                  title: "Psychological Impact",
                  description: "We craft compelling narratives that trigger recruiter psychology, making them think 'I MUST interview this person' within the critical first 6 seconds of review.",
                  features: ["Story-driven content", "Impact metrics", "Achievement highlighting"],
                  gradient: "from-purple-500 to-pink-500"
                },
                {
                  icon: <Rocket className="h-12 w-12 text-white" />,
                  title: "Interview Acceleration",
                  description: "Strategic positioning that addresses employer pain points directly, making you the obvious solution they've been searching for, leading to faster interview invitations.",
                  features: ["Need-based positioning", "Gap analysis", "Solution framing"],
                  gradient: "from-emerald-500 to-teal-500"
                }
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  <Card className="border-2 border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-2xl group-hover:-translate-y-2 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 rounded-3xl overflow-hidden">
                    <CardContent className="p-10">
                      <div className={`rounded-2xl bg-gradient-to-r ${feature.gradient} p-4 mb-8 w-fit group-hover:scale-110 transition-transform duration-300 shadow-xl`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed text-lg">{feature.description}</p>
                      <ul className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center mr-4">
                              <CheckCircle className="h-4 w-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-800/50 dark:via-blue-900/20 dark:to-purple-900/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-8">
                Success Stories That Inspire
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium">
                From rejection to multiple offers—see how professionals transformed their careers with Resulient
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-10">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="group relative">
                  <Card className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 border border-gray-200/50 dark:border-gray-700/50 shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 rounded-3xl overflow-hidden">
                    <CardContent className="p-10">
                      <div className="flex mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-6 w-6 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed text-lg">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author}
                          className="w-16 h-16 rounded-full border-3 border-gray-200 dark:border-gray-600 mr-6 shadow-xl"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.author}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-bold">Now at {testimonial.company}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-gray-900 dark:text-white mb-8">
                Everything You Need to Know
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">
                Get answers to the most common questions about transforming your job search
              </p>
            </div>

            <div className="space-y-8">
              {[
                {
                  question: "How does Resulient increase my interview rate by 5x?",
                  answer: "Resulient combines advanced ATS optimization with psychological persuasion techniques. While other tools only focus on getting past automated filters, we optimize your resume to capture recruiter attention and create compelling narratives that make hiring managers excited to interview you. Our users typically see interview rates jump from 2% to 10-15%."
                },
                {
                  question: "How does Resulient's job matching work?",
                  answer: "Resulient scans over 10,000 job boards daily, analyzing millions of fresh job postings using advanced AI algorithms. We match each user with positions that truly fit their profile by analyzing skills, experience, career goals, and job requirements. This ensures you only apply to jobs where you have a strong chance of success, saving time and increasing your success rate."
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
                <div key={i} className="group">
                  <div className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-700/50 rounded-2xl p-10 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-xl group-hover:border-blue-300 dark:group-hover:border-blue-600 group-hover:-translate-y-1">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-500 dark:to-purple-500 rounded-full flex items-center justify-center mr-6 text-white font-bold text-sm shadow-lg">
                        {i + 1}
                      </div>
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-16 text-lg">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-28 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-700 dark:via-purple-700 dark:to-pink-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-3xl"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-6xl sm:text-7xl font-black text-white mb-10">
                Ready to Transform Your Career?
              </h2>
              <p className="text-2xl text-blue-100 mb-16 leading-relaxed font-medium">
                Join thousands of professionals who went from <span className="font-bold text-red-300 bg-red-500/20 px-3 py-1 rounded-lg">job search frustration</span> to 
                <span className="font-bold text-emerald-300 bg-emerald-500/20 px-3 py-1 rounded-lg ml-2"> multiple interview offers</span> with Resulient's proven system.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-8 mb-16">
                <Link to="/auth" className="group relative inline-flex items-center justify-center px-16 py-6 text-2xl font-black rounded-2xl bg-white hover:bg-gray-100 text-blue-600 transition-all duration-300 transform hover:scale-105 shadow-2xl">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative">Start Your Transformation</span>
                  <ArrowRight className="ml-4 h-8 w-8 group-hover:translate-x-1 transition-transform relative" />
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-blue-100">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">Free to start</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">No credit card required</span>
                </div>
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center mr-3">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-bold text-lg">Results in 2 weeks</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <LegalFooter />
      </div>
    </>
  );
};

export default LandingPage;
