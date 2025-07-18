
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle, Star, Clock, TrendingUp, Users, Shield, Award, Target, Rocket, Menu, X, Zap, Diamond, Search, Building, MapPin, DollarSign, Database, Brain, Sparkles } from "lucide-react";
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

      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/80 to-indigo-100/60 dark:from-gray-900 dark:via-slate-800 dark:to-indigo-950 relative overflow-hidden">
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-gradient-to-br from-indigo-400/15 to-purple-600/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-indigo-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
        </div>

        {/* Navigation */}
        <header className="fixed w-full z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl border-b border-gray-200/30 dark:border-gray-700/30 shadow-xl shadow-indigo-500/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-5">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/25 ring-1 ring-white/20">
                  <Rocket className="h-7 w-7 text-white drop-shadow-sm" />
                </div>
                <span className="font-brand text-3xl font-black text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 bg-clip-text animate-fade-in drop-shadow-xl tracking-tight select-none">
                  Resulient
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex gap-2 items-center">
                <Link to="/blog" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-semibold mx-4 transition-all duration-300 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full">
                  Blog
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-semibold mx-4 transition-all duration-300 hover:scale-105 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-indigo-600 after:transition-all after:duration-300 hover:after:w-full">
                  Pricing
                </Link>
                <Link to="/auth" className="inline-flex items-center font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 px-4 py-2 transition-all duration-300 hover:scale-105 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30">
                  Login
                </Link>
                <Link to="/auth" className="ml-3 inline-flex items-center px-8 py-4 border border-transparent text-sm font-bold rounded-2xl shadow-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 ring-1 ring-white/20">
                  Start Free Trial
                </Link>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors"
                >
                  {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-6 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-b-2xl">
                <div className="flex flex-col space-y-5">
                  <Link 
                    to="/blog" 
                    className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-semibold transition-colors px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="text-gray-600 hover:text-indigo-600 dark:text-gray-300 dark:hover:text-indigo-400 font-semibold transition-colors px-4 py-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    to="/auth" 
                    className="inline-flex items-center justify-center font-semibold text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 px-4 py-3 transition-colors border-2 border-indigo-200 dark:border-indigo-700 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/auth" 
                    className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-sm font-bold rounded-2xl shadow-xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all duration-300 mx-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Start Free Trial
                  </Link>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Enhanced Hero Section */}
        <section className="pt-40 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center relative">
            <div className="space-y-10 animate-fade-in">
              <div className="space-y-8">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black text-gray-900 dark:text-white leading-[0.9] tracking-tight">
                  Land Your
                  <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 animate-pulse drop-shadow-lg">
                    Dream Job
                  </span>
                  <span className="block text-5xl sm:text-6xl lg:text-7xl mt-3 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">5x Faster</span>
                </h1>
                
                <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed font-medium">
                  Transform your job search from <span className="font-bold text-red-500 bg-red-50 dark:bg-red-950/30 px-2 py-1 rounded-lg">months of rejection</span> to 
                  <span className="font-bold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-lg"> multiple interview offers</span> in weeks. 
                  Our AI doesn't just beat ATS systems—it creates resumes that make recruiters excited to meet you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link to="/auth" className="group inline-flex items-center justify-center px-12 py-5 text-xl font-bold rounded-2xl shadow-2xl text-white bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-indigo-500/25 ring-2 ring-white/20">
                  Start Getting Interviews
                  <ArrowRight className="ml-4 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-6 sm:space-y-0 sm:space-x-10 pt-6">
                <div className="flex items-center">
                  <div className="flex -space-x-3">
                    {[
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format",
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
                    ].map((src, i) => (
                      <img key={i} src={src} alt={`User ${i + 1}`} className="w-12 h-12 rounded-full border-3 border-white shadow-xl ring-2 ring-indigo-100 dark:ring-indigo-900" />
                    ))}
                  </div>
                  <div className="ml-6">
                    <div className="flex items-center mb-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-5 w-5 text-yellow-400 fill-current drop-shadow-sm" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">
                      4.9/5 from 2,000+ reviews
                    </p>
                  </div>
                </div>
                
                <div className="hidden sm:block h-10 w-px bg-gradient-to-b from-gray-300 to-gray-100 dark:from-gray-600 dark:to-gray-800"></div>
                
                <div className="flex items-center bg-green-50 dark:bg-green-950/30 px-4 py-3 rounded-xl border border-green-200 dark:border-green-800">
                  <CheckCircle className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-sm font-semibold text-green-700 dark:text-green-300">
                    Free to start • No credit card required
                  </span>
                </div>
              </div>
            </div>

            <div className="relative animate-fade-in">
              {/* Floating cards showcasing features */}
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/20">
                  <div className="p-10">
                    <div className="flex items-center justify-between mb-8">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-xl ring-2 ring-white/20">
                          <Target className="h-8 w-8 text-white drop-shadow-sm" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900 dark:text-white">ATS Score</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Real-time analysis</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-4xl font-black text-green-600 drop-shadow-sm">94%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Optimized</div>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 rounded-xl border-2 border-green-200 dark:border-green-800 shadow-sm">
                        <span className="text-sm font-bold text-green-800 dark:text-green-300">Keywords Match</span>
                        <span className="text-sm font-black text-green-600 bg-green-100 dark:bg-green-900/50 px-3 py-1 rounded-full">92%</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl border-2 border-blue-200 dark:border-blue-800 shadow-sm">
                        <span className="text-sm font-bold text-blue-800 dark:text-blue-300">Format Score</span>
                        <span className="text-sm font-black text-blue-600 bg-blue-100 dark:bg-blue-900/50 px-3 py-1 rounded-full">98%</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 rounded-xl border-2 border-purple-200 dark:border-purple-800 shadow-sm">
                        <span className="text-sm font-bold text-purple-800 dark:text-purple-300">Impact Score</span>
                        <span className="text-sm font-black text-purple-600 bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-full">91%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-600 p-6 text-white shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-bold text-lg">Interview Prediction</p>
                        <p className="text-sm opacity-90 font-medium">Based on current optimization</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black drop-shadow-sm">87%</div>
                        <div className="text-sm opacity-90 font-semibold">Success Rate</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-8 -left-8 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 animate-pulse backdrop-blur-xl ring-1 ring-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg">
                    <TrendingUp className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-green-600">5x</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">More Interviews</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-8 -right-8 bg-white/95 dark:bg-gray-800/95 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6 animate-pulse delay-300 backdrop-blur-xl ring-1 ring-white/20">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="text-3xl font-black text-blue-600">2 weeks</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">To Interview</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Matching Revolution Section */}
        <section className="py-24 bg-gradient-to-br from-white via-indigo-50/50 to-purple-50/50 dark:from-gray-900 dark:via-indigo-950/50 dark:to-purple-950/50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/5 to-transparent"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-indigo-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-20">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-100 via-purple-100 to-blue-100 dark:from-indigo-900/50 dark:via-purple-900/50 dark:to-blue-900/50 px-6 py-3 rounded-full border-2 border-indigo-200 dark:border-indigo-700 mb-8 shadow-lg ring-1 ring-white/20">
                <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Revolutionary Job Matching</span>
              </div>
              <h2 className="text-5xl sm:text-6xl font-black text-gray-900 dark:text-white mb-8 leading-tight">
                The World's First Intelligent 
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 drop-shadow-lg">
                  Job Matching Platform
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed font-medium">
                We've revolutionized job searching forever. No more endless scrolling through irrelevant postings. 
                <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 px-2 py-1 rounded-lg"> Resulient is the only platform</span> that scans over 
                <span className="font-bold text-green-600 bg-green-50 dark:bg-green-950/30 px-2 py-1 rounded-lg"> 10,000 job boards daily</span>, analyzing millions of fresh opportunities 
                to match you with positions where you'll actually succeed.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-20 items-center">
              {/* Left side - Benefits */}
              <div className="space-y-10">
                <div className="space-y-8">
                  {[
                    {
                      icon: <Database className="h-8 w-8 text-blue-600" />,
                      title: "10,000+ Job Boards Scanned Daily",
                      description: "Our AI continuously monitors every major job platform, company career pages, and hidden job boards to find opportunities others miss."
                    },
                    {
                      icon: <Brain className="h-8 w-8 text-purple-600" />,
                      title: "Intelligent Fit Analysis",
                      description: "Advanced algorithms analyze your skills, experience, and career goals against millions of job requirements to find your perfect matches."
                    },
                    {
                      icon: <Target className="h-8 w-8 text-green-600" />,
                      title: "Apply Only Where You'll Succeed",
                      description: "Stop wasting time on jobs you won't get. Our platform ensures you only see positions where you have a genuine competitive advantage."
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-6 group">
                      <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-blue-950/50 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 border-2 border-indigo-100 dark:border-indigo-800 shadow-lg ring-1 ring-white/20">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-950/30 dark:via-emerald-950/30 dark:to-teal-950/30 rounded-2xl p-8 border-2 border-green-200 dark:border-green-800 shadow-xl ring-1 ring-white/20">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <h4 className="font-bold text-xl text-green-800 dark:text-green-300">The Result?</h4>
                  </div>
                  <p className="text-green-700 dark:text-green-400 font-semibold text-lg leading-relaxed">
                    Users report spending 90% less time job hunting while getting 400% more interview invitations. 
                    <span className="font-black"> This is the future of job searching.</span>
                  </p>
                </div>
              </div>

              {/* Right side - Job Match Preview */}
              <div className="relative">
                <div className="absolute -inset-6 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-3xl"></div>
                <div className="relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-2xl border border-gray-200/50 dark:border-gray-700/50 rounded-3xl shadow-2xl overflow-hidden ring-1 ring-white/20">
                  <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 p-8 text-white shadow-2xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">Perfect Job Matches</h3>
                        <p className="text-indigo-100 font-medium">Curated just for you</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-black drop-shadow-sm">98%</div>
                        <div className="text-sm text-indigo-100 font-semibold">Match Score</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8 space-y-5">
                    {[
                      {
                        title: "Senior Software Engineer",
                        company: "TechCorp Inc.",
                        location: "San Francisco, CA",
                        salary: "$140k - $180k",
                        match: "98%",
                        color: "green"
                      },
                      {
                        title: "Full Stack Developer",
                        company: "InnovateLab",
                        location: "Remote",
                        salary: "$120k - $160k",
                        match: "95%",
                        color: "blue"
                      },
                      {
                        title: "Lead Developer",
                        company: "StartupXYZ",
                        location: "New York, NY",
                        salary: "$130k - $170k",
                        match: "92%",
                        color: "purple"
                      }
                    ].map((job, i) => (
                      <div key={i} className="p-5 bg-gradient-to-r from-gray-50 to-gray-100/50 dark:from-gray-700/50 dark:to-gray-600/50 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h4 className="font-bold text-lg text-gray-900 dark:text-white">{job.title}</h4>
                            <p className="text-gray-600 dark:text-gray-300 font-semibold">{job.company}</p>
                          </div>
                          <div className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                            job.color === 'green' ? 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-400' :
                            job.color === 'blue' ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 dark:from-blue-900/30 dark:to-indigo-900/30 dark:text-blue-400' :
                            'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 dark:from-purple-900/30 dark:to-pink-900/30 dark:text-purple-400'
                          }`}>
                            {job.match} Match
                          </div>
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600 dark:text-gray-400 font-medium">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-2">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-blue-950/50 p-6 border-t-2 border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                        3 new perfect matches today
                      </span>
                      <Button size="sm" className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 hover:from-indigo-700 hover:via-purple-700 hover:to-blue-700 shadow-lg font-bold rounded-xl">
                        View All Matches
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Statistics Section */}
        <section className="py-24 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-white mb-8 drop-shadow-lg">
                Why Job Seekers Choose Resulient
              </h2>
              <p className="text-2xl text-indigo-100 max-w-3xl mx-auto font-medium">
                Real results from real professionals who transformed their careers
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {[
                { stat: "5x", description: "More interview invitations", icon: Target },
                { stat: "87%", description: "Success rate for our users", icon: TrendingUp },
                { stat: "2 weeks", description: "Average time to first interview", icon: Clock },
                { stat: "50k+", description: "Professionals transformed", icon: Users }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-xl rounded-3xl mb-6 group-hover:scale-110 transition-transform duration-300 shadow-2xl ring-2 ring-white/30">
                    <item.icon className="h-10 w-10 text-white drop-shadow-sm" />
                  </div>
                  <div className="text-5xl sm:text-6xl font-black text-white mb-3 drop-shadow-lg">{item.stat}</div>
                  <p className="text-indigo-100 font-semibold text-lg">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-80 h-80 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-20">
              <h2 className="text-5xl font-black text-gray-900 dark:text-white sm:text-6xl mb-8 leading-tight">
                The Complete Interview-Winning System
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto font-medium leading-relaxed">
                We don't just optimize resumes—we engineer interview opportunities through proven psychological and technical strategies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Zap className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
                  title: "ATS Domination",
                  description: "Our advanced algorithms ensure your resume not only passes every ATS filter but ranks at the top of recruiter searches, guaranteeing human eyes see your application.",
                  features: ["98% ATS pass rate", "Keyword optimization", "Format perfection"]
                },
                {
                  icon: <Target className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
                  title: "Psychological Impact",
                  description: "We craft compelling narratives that trigger recruiter psychology, making them think 'I MUST interview this person' within the critical first 6 seconds of review.",
                  features: ["Story-driven content", "Impact metrics", "Achievement highlighting"]
                },
                {
                  icon: <Rocket className="h-12 w-12 text-indigo-600 dark:text-indigo-400" />,
                  title: "Interview Acceleration",
                  description: "Strategic positioning that addresses employer pain points directly, making you the obvious solution they've been searching for, leading to faster interview invitations.",
                  features: ["Need-based positioning", "Gap analysis", "Solution framing"]
                }
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-blue-500/10 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Card className="relative border-2 border-gray-200 dark:border-gray-700 transition-all duration-500 hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-2xl group-hover:-translate-y-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
                    <CardContent className="p-10">
                      <div className="rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950 p-6 mb-8 w-fit group-hover:scale-110 transition-transform duration-300 shadow-xl ring-2 ring-white/50 dark:ring-gray-700/50">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-8 leading-relaxed font-medium text-lg">{feature.description}</p>
                      <ul className="space-y-3">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="h-6 w-6 text-green-500 mr-4 flex-shrink-0" />
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

        {/* Enhanced Testimonials Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 via-indigo-50/70 to-purple-50/70 dark:from-gray-900 dark:via-indigo-950/70 dark:to-purple-950/70 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 right-20 w-96 h-96 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-800/20 dark:to-purple-800/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-gradient-to-br from-blue-200/20 to-indigo-200/20 dark:from-blue-800/20 dark:to-indigo-800/20 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
                  <div className="absolute -inset-2 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-blue-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <Card className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border-2 border-gray-200 dark:border-gray-700 shadow-2xl group-hover:shadow-2xl transition-all duration-500 group-hover:-translate-y-3 ring-1 ring-white/50 dark:ring-gray-700/50">
                    <CardContent className="p-10">
                      <div className="flex mb-8">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-6 w-6 text-yellow-400 fill-current drop-shadow-sm" />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 dark:text-gray-300 italic mb-8 leading-relaxed text-lg font-medium">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author}
                          className="w-16 h-16 rounded-full border-3 border-indigo-200 dark:border-indigo-700 mr-5 shadow-xl ring-2 ring-white/50"
                        />
                        <div>
                          <p className="font-bold text-lg text-gray-900 dark:text-white">{testimonial.author}</p>
                          <p className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">Now at {testimonial.company}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced FAQ Section */}
        <section className="py-24 bg-white dark:bg-gray-900 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-40 left-40 w-80 h-80 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-40 right-40 w-80 h-80 bg-gradient-to-br from-blue-100/30 to-indigo-100/30 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full blur-3xl"></div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
                  <div className="bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950/50 dark:via-purple-950/50 dark:to-blue-950/50 rounded-3xl p-10 border-2 border-indigo-100 dark:border-indigo-800 transition-all duration-300 hover:shadow-2xl group-hover:border-indigo-300 dark:group-hover:border-indigo-600 hover:scale-105 ring-1 ring-white/50 dark:ring-gray-700/50">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-5 flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 rounded-full flex items-center justify-center mr-5 text-white font-bold text-sm shadow-lg">
                        {i + 1}
                      </div>
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-15 font-medium text-lg">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-32 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white/5 rounded-full blur-3xl animate-pulse delay-500"></div>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-6xl sm:text-7xl font-black text-white mb-10 drop-shadow-xl leading-tight">
                Ready to Transform Your Career?
              </h2>
              <p className="text-2xl text-indigo-100 mb-16 leading-relaxed font-medium">
                Join thousands of professionals who went from <span className="font-bold text-red-300">job search frustration</span> to 
                <span className="font-bold text-green-300"> multiple interview offers</span> with Resulient's proven system.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-8 mb-16">
                <Link to="/auth" className="group inline-flex items-center justify-center px-16 py-6 text-2xl font-bold rounded-2xl bg-white text-indigo-600 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/25 ring-2 ring-white/30">
                  Start Your Transformation
                  <ArrowRight className="ml-4 h-7 w-7 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-12 text-indigo-100">
                <div className="flex items-center bg-white/10 px-6 py-3 rounded-full backdrop-blur-xl">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  <span className="font-semibold">Free to start</span>
                </div>
                <div className="flex items-center bg-white/10 px-6 py-3 rounded-full backdrop-blur-xl">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  <span className="font-semibold">No credit card required</span>
                </div>
                <div className="flex items-center bg-white/10 px-6 py-3 rounded-full backdrop-blur-xl">
                  <CheckCircle className="h-6 w-6 mr-3" />
                  <span className="font-semibold">Results in 2 weeks</span>
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
