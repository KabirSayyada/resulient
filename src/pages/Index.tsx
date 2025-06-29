
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChevronRight, FileText, Zap, Target, Users, Award, Star, CheckCircle, ArrowRight, Sparkles, TrendingUp, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { ResumeScoringForm } from "@/components/resume/ResumeScoringForm";
import { ScoreResultSection } from "@/components/resume/ScoreResultSection";
import { useResumeScoring } from "@/hooks/useResumeScoring";
import { JobDescriptionInput } from "@/components/resume/JobDescriptionInput";
import { useAuth } from "@/hooks/useAuth";

export default function Index() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeContent, setResumeContent] = useState("");
  const { user } = useAuth();
  
  const {
    scoreData,
    scoreHistory,
    isScoring,
    hasReachedLimit,
    handleScoreResume
  } = useResumeScoring(user?.id);

  // Check for pre-filled job description from job matching
  useEffect(() => {
    const prefilledJobDescription = localStorage.getItem('prefilledJobDescription');
    if (prefilledJobDescription) {
      setJobDescription(prefilledJobDescription);
      localStorage.removeItem('prefilledJobDescription'); // Clean up after use
    }
  }, []);

  const handleSubmit = async () => {
    if (!resumeContent.trim()) return;
    await handleScoreResume(resumeContent, -1); // -1 for unlimited (free tier)
  };

  const resetForm = () => {
    setResumeContent("");
    setJobDescription("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <MainNavigation />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge className="mb-4 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <Sparkles className="w-4 h-4 mr-2" />
              AI-Powered Resume Intelligence
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
              Transform Your Resume Into a 
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Job-Winning Machine</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
              Get AI-powered scoring, optimization suggestions, and personalized insights that help you land more interviews. Join thousands of professionals who've boosted their career success.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">95%</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">Higher Interview Rate</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">50K+</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">Resumes Optimized</div>
            </div>
            <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-gray-700/20">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">4.9★</div>
              <div className="text-gray-700 dark:text-gray-300 font-medium">User Rating</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300">
              Start Free Analysis
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" asChild className="px-8 py-3 text-lg font-semibold border-2 hover:bg-white/50 dark:hover:bg-gray-800/50">
              <Link to="/pricing">
                View Pricing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Resume Analysis Section */}
      <section className="py-20 px-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Get Your Free Resume Analysis
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our AI analyzes your resume against industry standards and provides actionable insights to help you stand out from the competition.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <ResumeScoringForm
                scoringMode="resumeOnly"
                setScoringMode={() => {}}
                resumeContent={resumeContent}
                setResumeContent={setResumeContent}
                isScoring={isScoring}
                onScore={handleSubmit}
                disableButton={hasReachedLimit}
              />
              
              <JobDescriptionInput 
                jobDescription={jobDescription}
                setJobDescription={setJobDescription}
              />
              
              <Button 
                onClick={handleSubmit} 
                disabled={!resumeContent.trim() || isScoring || hasReachedLimit}
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4"
              >
                {isScoring ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Analyzing Your Resume...
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-5 w-5" />
                    Analyze My Resume
                  </>
                )}
              </Button>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {scoreData ? (
                <ScoreResultSection scoreData={scoreData} />
              ) : (
                <Card className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 border-dashed border-2 border-gray-300 dark:border-gray-600">
                  <CardContent className="p-8 text-center">
                    <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                      Your Analysis Will Appear Here
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Upload your resume to get started with AI-powered insights and recommendations.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ResumeAI?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our comprehensive suite of tools helps you create, optimize, and track your resume's performance across different job applications.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200/50 dark:border-blue-800/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-blue-800 dark:text-blue-300">AI-Powered Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700 dark:text-blue-400">
                  Advanced algorithms analyze your resume against industry standards and provide personalized optimization suggestions.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/50 dark:to-pink-950/50 border-purple-200/50 dark:border-purple-800/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle className="text-purple-800 dark:text-purple-300">Job-Specific Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-purple-700 dark:text-purple-400">
                  Tailor your resume for specific job descriptions to maximize your chances of getting through ATS systems.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50 border-green-200/50 dark:border-green-800/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle className="text-green-800 dark:text-green-300">Performance Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-green-700 dark:text-green-400">
                  Track your resume's performance over time and see how optimizations impact your job search success.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/50 dark:to-red-950/50 border-orange-200/50 dark:border-orange-800/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                </div>
                <CardTitle className="text-orange-800 dark:text-orange-300">Industry Benchmarking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-orange-700 dark:text-orange-400">
                  Compare your resume against thousands of successful profiles in your industry and role level.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-950/50 dark:to-cyan-950/50 border-teal-200/50 dark:border-teal-800/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Award className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                </div>
                <CardTitle className="text-teal-800 dark:text-teal-300">Expert Recommendations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-teal-700 dark:text-teal-400">
                  Get actionable insights from career experts and hiring managers to make your resume stand out.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/50 dark:to-blue-950/50 border-indigo-200/50 dark:border-indigo-800/50 hover:shadow-xl transition-all duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <CardTitle className="text-indigo-800 dark:text-indigo-300">ATS Optimization</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-indigo-700 dark:text-indigo-400">
                  Ensure your resume passes through Applicant Tracking Systems with our ATS-friendly formatting and keyword optimization.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Land Your Dream Job?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of professionals who've transformed their careers with our AI-powered resume optimization platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              Start Free Trial
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg" className="border-white text-white hover:bg-white/10 px-8 py-3 text-lg font-semibold">
              View Success Stories
              <Star className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
