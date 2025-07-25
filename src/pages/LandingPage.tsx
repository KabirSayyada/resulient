
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

      <div className="min-h-screen bg-white dark:bg-gray-900 relative overflow-hidden">
        {/* Modern geometric background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Geometric shapes */}
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/5 dark:bg-blue-400/10 rounded-full blur-xl"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/5 dark:bg-purple-400/10 transform rotate-45 blur-lg"></div>
          <div className="absolute bottom-40 left-20 w-40 h-40 bg-emerald-500/5 dark:bg-emerald-400/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-20 right-10 w-28 h-28 bg-amber-500/5 dark:bg-amber-400/10 transform rotate-12 blur-lg"></div>
          
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        </div>

        {/* Navigation */}
        <header className="fixed w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-600 dark:bg-blue-500 rounded-lg flex items-center justify-center shadow-lg">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <span className="font-bold text-2xl text-gray-900 dark:text-white tracking-tight">
                  Resulient
                </span>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex gap-2 items-center">
                <Link to="/blog" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium mx-3 transition-colors">
                  Blog
                </Link>
                <Link to="/pricing" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium mx-3 transition-colors">
                  Pricing
                </Link>
                <Link to="/auth" className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium px-3 py-2 transition-colors">
                  Login
                </Link>
                <Link to="/auth" className="ml-2 inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
                  Get Started
                </Link>
              </div>

              {/* Mobile Navigation */}
              <div className="md:hidden flex items-center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden py-4 border-t border-gray-200/50 dark:border-gray-700/50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg">
                <div className="flex flex-col space-y-4">
                  <Link 
                    to="/blog" 
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Blog
                  </Link>
                  <Link 
                    to="/pricing" 
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium transition-colors px-2 py-1"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Pricing
                  </Link>
                  <Link 
                    to="/auth" 
                    className="text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-medium px-3 py-2 transition-colors border border-gray-200 dark:border-gray-700 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/auth" 
                    className="inline-flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-200 mx-2"
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-800">
                  <Star className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">AI-Powered Resume Optimization</span>
                </div>
                
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight">
                  Land Your
                  <span className="block text-blue-600 dark:text-blue-400">
                    Dream Job
                  </span>
                  <span className="block text-4xl sm:text-5xl lg:text-6xl mt-2">5x Faster</span>
                </h1>
                
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl leading-relaxed">
                  Transform your job search from <span className="font-bold text-red-600">months of rejection</span> to 
                  <span className="font-bold text-emerald-600"> multiple interview offers</span> in weeks. 
                  Our AI doesn't just beat ATS systems—it creates resumes that make recruiters excited to meet you.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth" className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                  Start Getting Interviews
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 pt-4">
                <div className="flex items-center">
                  <div className="flex -space-x-2">
                    {[
                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face&auto=format",
                      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face&auto=format",
                      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face&auto=format"
                    ].map((src, i) => (
                      <img key={i} src={src} alt={`User ${i + 1}`} className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-800 shadow-lg" />
                    ))}
                  </div>
                  <div className="ml-4">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="h-4 w-4 text-amber-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                      4.9/5 from 2,000+ reviews
                    </p>
                  </div>
                </div>
                
                <div className="hidden sm:block h-8 w-px bg-gray-300 dark:bg-gray-600"></div>
                
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-emerald-600 mr-2" />
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Free to start • No credit card required
                  </span>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Dashboard Preview */}
              <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 rounded-xl flex items-center justify-center">
                        <Target className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">ATS Score</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Real-time analysis</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">94%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Optimized</div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800/60">
                      <span className="text-sm font-medium text-emerald-800 dark:text-emerald-300">Keywords Match</span>
                      <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">92%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800/60">
                      <span className="text-sm font-medium text-blue-800 dark:text-blue-300">Format Score</span>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">98%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200 dark:border-purple-800/60">
                      <span className="text-sm font-medium text-purple-800 dark:text-purple-300">Impact Score</span>
                      <span className="text-sm font-bold text-purple-600 dark:text-purple-400">91%</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-emerald-600 dark:bg-emerald-700 p-4 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">Interview Prediction</p>
                      <p className="text-sm opacity-90">Based on current optimization</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold">87%</div>
                      <div className="text-sm opacity-90">Success Rate</div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating stats */}
              <div className="absolute -top-6 -left-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">5x</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">More Interviews</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">2 weeks</div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">To Interview</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Job Matching Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/50 px-4 py-2 rounded-full border border-purple-200 dark:border-purple-800 mb-6">
                <Sparkles className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">Revolutionary Job Matching</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                The World's First Intelligent 
                <span className="block text-purple-600 dark:text-purple-400">
                  Job Matching Platform
                </span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
                We've revolutionized job searching forever. No more endless scrolling through irrelevant postings. 
                <span className="font-bold text-purple-600 dark:text-purple-400"> Resulient is the only platform</span> that scans over 
                <span className="font-bold text-emerald-600 dark:text-emerald-400"> 10,000 job boards daily</span>, analyzing millions of fresh opportunities 
                to match you with positions where you'll actually succeed.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-16 items-center">
              {/* Benefits */}
              <div className="space-y-8">
                <div className="space-y-6">
                  {[
                    {
                      icon: <Database className="h-8 w-8 text-blue-600 dark:text-blue-400" />,
                      title: "10,000+ Job Boards Scanned Daily",
                      description: "Our AI continuously monitors every major job platform, company career pages, and hidden job boards to find opportunities others miss."
                    },
                    {
                      icon: <Brain className="h-8 w-8 text-purple-600 dark:text-purple-400" />,
                      title: "Intelligent Fit Analysis",
                      description: "Advanced algorithms analyze your skills, experience, and career goals against millions of job requirements to find your perfect matches."
                    },
                    {
                      icon: <Target className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />,
                      title: "Apply Only Where You'll Succeed",
                      description: "Stop wasting time on jobs you won't get. Our platform ensures you only see positions where you have a genuine competitive advantage."
                    }
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start space-x-4 group">
                      <div className="flex-shrink-0 w-16 h-16 bg-white dark:bg-gray-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-200 border border-gray-200 dark:border-gray-700 shadow-lg">
                        {benefit.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{benefit.title}</h3>
                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                    </div>
                    <h4 className="font-bold text-emerald-800 dark:text-emerald-300">The Result?</h4>
                  </div>
                  <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                    Users report spending 90% less time job hunting while getting 400% more interview invitations. 
                    <span className="font-bold"> This is the future of job searching.</span>
                  </p>
                </div>
              </div>

              {/* Job Match Preview */}
              <div className="relative">
                <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="bg-purple-600 dark:bg-purple-700 p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold">Perfect Job Matches</h3>
                        <p className="text-purple-100">Curated just for you</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">98%</div>
                        <div className="text-sm text-purple-100">Match Score</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6 space-y-4">
                    {[
                      {
                        title: "Senior Software Engineer",
                        company: "TechCorp Inc.",
                        location: "San Francisco, CA",
                        salary: "$140k - $180k",
                        match: "98%",
                        color: "emerald"
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
                      <div key={i} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-shadow duration-200">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h4 className="font-bold text-gray-900 dark:text-white">{job.title}</h4>
                            <p className="text-gray-600 dark:text-gray-300 font-medium">{job.company}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-sm font-bold ${
                            job.color === 'emerald' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                            job.color === 'blue' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                            'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
                          }`}>
                            {job.match} Match
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            {job.salary}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-purple-50 dark:bg-purple-950/50 p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        3 new perfect matches today
                      </span>
                      <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-white">
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
        <section className="py-20 bg-blue-600 dark:bg-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-6">
                Why Job Seekers Choose Resulient
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                Real results from real professionals who transformed their job search
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { stat: "5x", description: "More interview invitations", icon: Target },
                { stat: "87%", description: "Success rate for our users", icon: TrendingUp },
                { stat: "2 weeks", description: "Average time to first interview", icon: Clock },
                { stat: "50k+", description: "Professionals transformed", icon: Users }
              ].map((item, index) => (
                <div key={index} className="text-center group">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-xl mb-4 group-hover:scale-110 transition-transform duration-200">
                    <item.icon className="h-8 w-8 text-white" />
                  </div>
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2">{item.stat}</div>
                  <p className="text-blue-100 font-medium">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-6">
                The Complete Interview-Winning System
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                We don't just optimize resumes—we engineer interview opportunities through proven psychological and technical strategies.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12">
              {[
                {
                  icon: <Zap className="h-10 w-10 text-blue-600 dark:text-blue-400" />,
                  title: "ATS Domination",
                  description: "Our advanced algorithms ensure your resume not only passes every ATS filter but ranks at the top of recruiter searches, guaranteeing human eyes see your application.",
                  features: ["98% ATS pass rate", "Keyword optimization", "Format perfection"]
                },
                {
                  icon: <Target className="h-10 w-10 text-purple-600 dark:text-purple-400" />,
                  title: "Psychological Impact",
                  description: "We craft compelling narratives that trigger recruiter psychology, making them think 'I MUST interview this person' within the critical first 6 seconds of review.",
                  features: ["Story-driven content", "Impact metrics", "Achievement highlighting"]
                },
                {
                  icon: <Rocket className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />,
                  title: "Interview Acceleration",
                  description: "Strategic positioning that addresses employer pain points directly, making you the obvious solution they've been searching for, leading to faster interview invitations.",
                  features: ["Need-based positioning", "Gap analysis", "Solution framing"]
                }
              ].map((feature, i) => (
                <div key={i} className="group relative">
                  <Card className="border-2 border-gray-200 dark:border-gray-700 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-600 hover:shadow-xl group-hover:-translate-y-2 bg-white dark:bg-gray-800">
                    <CardContent className="p-8">
                      <div className="rounded-xl bg-gray-50 dark:bg-gray-700/50 p-4 mb-6 w-fit group-hover:scale-110 transition-transform duration-200">
                        {feature.icon}
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">{feature.description}</p>
                      <ul className="space-y-2">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-center">
                            <CheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400 mr-3 flex-shrink-0" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item}</span>
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
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Success Stories That Inspire
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                From rejection to multiple offers—see how professionals transformed their careers with Resulient
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, i) => (
                <div key={i} className="group relative">
                  <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:-translate-y-2">
                    <CardContent className="p-8">
                      <div className="flex mb-6">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 text-amber-400 fill-current" />
                        ))}
                      </div>
                      <blockquote className="text-gray-700 dark:text-gray-300 italic mb-6 leading-relaxed">
                        "{testimonial.quote}"
                      </blockquote>
                      <div className="flex items-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.author}
                          className="w-12 h-12 rounded-full border-2 border-gray-200 dark:border-gray-600 mr-4 shadow-lg"
                        />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white">{testimonial.author}</p>
                          <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Now at {testimonial.company}</p>
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
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Everything You Need to Know
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Get answers to the most common questions about transforming your job search
              </p>
            </div>

            <div className="space-y-6">
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
                  <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-200 hover:shadow-lg group-hover:border-blue-300 dark:group-hover:border-blue-600">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <div className="w-8 h-8 bg-blue-600 dark:bg-blue-500 rounded-full flex items-center justify-center mr-4 text-white font-bold text-sm">
                        {i + 1}
                      </div>
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed ml-12">{faq.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-blue-600 dark:bg-blue-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-5xl sm:text-6xl font-bold text-white mb-8">
                Ready to Transform Your Career?
              </h2>
              <p className="text-2xl text-blue-100 mb-12 leading-relaxed">
                Join thousands of professionals who went from <span className="font-bold text-red-300">job search frustration</span> to 
                <span className="font-bold text-emerald-300"> multiple interview offers</span> with Resulient's proven system.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
                <Link to="/auth" className="group inline-flex items-center justify-center px-12 py-5 text-xl font-semibold rounded-lg bg-white hover:bg-gray-100 text-blue-600 transition-all duration-200 transform hover:scale-105 shadow-xl">
                  Start Your Transformation
                  <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              <div className="flex items-center justify-center space-x-8 text-blue-100">
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span className="font-medium">Free to start</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-6 w-6 mr-2" />
                  <span className="font-medium">Results in 2 weeks</span>
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
