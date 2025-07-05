import { MainNavigation } from "@/components/resume/MainNavigation";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Target } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Rocket } from "lucide-react";
import { Link } from "@nextui-org/react";
import { Monitor } from "lucide-react";
import { LayoutDashboard } from "lucide-react";
import { FileVideo } from "lucide-react";
import { GraduationCap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-indigo-900/20">
      <div className="container mx-auto px-4 py-8">
        <MainNavigation />

        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-transparent"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-yellow-400/20 to-transparent rounded-full blur-2xl"></div>

          <div className="relative px-8 py-20 text-center">
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-6 py-3 mb-8">
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
                <span className="text-white font-bold text-lg">
                  EMPOWERING YOUR CAREER JOURNEY
                </span>
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              </div>

              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                Unlock Your Potential
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  with AI-Driven Resumes
                </span>
                <span className="block text-5xl md:text-6xl">
                  and Career Tools
                </span>
              </h1>

              <p className="text-2xl text-white/95 max-w-4xl mx-auto mb-12 leading-relaxed">
                Resulient is your{" "}
                <span className="font-bold text-yellow-300">
                  AI-powered career copilot
                </span>
                , helping you craft the perfect resume, discover new job
                opportunities, and level up your skills.
              </p>

              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold px-8 py-4 text-xl rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105"
                >
                  <Rocket className="h-6 w-6 mr-3" />
                  Create My Free Resume
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Jobs Feature Preview */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 py-16 -mx-4 sm:-mx-6 lg:-mx-8 mb-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full px-6 py-3 mb-6">
              <Sparkles className="h-5 w-5 text-white" />
              <span className="text-white font-bold">COMING SOON</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
              Revolutionary Job Matching
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
              We're building an AI-powered job matching platform that scans
              10,000+ job boards to find millions of fresh opportunities - but
              only shows you jobs you're genuinely qualified for.
            </p>

            <Button
              size="lg"
              onClick={() => (window.location.href = "/jobs")}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-8 py-4 text-lg rounded-full shadow-xl transform transition-all duration-300 hover:scale-105"
            >
              <Target className="h-5 w-5 mr-2" />
              Learn More About Job Matching
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <Card className="relative overflow-hidden border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30"></div>
            <CardContent className="relative p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <Monitor className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Resume Builder
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Craft a professional resume in minutes with our AI-powered
                builder. Tailor your resume to specific jobs and showcase your
                skills effectively.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"></div>
            <CardContent className="relative p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <LayoutDashboard className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Dashboard Analytics
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Track your resume's performance and get insights into how
                recruiters are engaging with your profile. Optimize your resume
                for better results.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30"></div>
            <CardContent className="relative p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <FileVideo className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                Video Resume
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Create a compelling video resume to showcase your personality
                and skills. Stand out from the competition and make a lasting
                impression.
              </p>
            </CardContent>
          </Card>

          <Card className="relative overflow-hidden border-2 border-gradient-to-r from-orange-200 to-yellow-200 dark:from-orange-800 dark:to-yellow-800 hover:shadow-2xl transition-all duration-300 group">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-yellow-50 dark:from-orange-950/30 dark:to-yellow-950/30"></div>
            <CardContent className="relative p-8 text-center">
              <div className="mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                  <GraduationCap className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                AI-Driven Learning
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Upskill with personalized learning paths curated by AI. Master
                the skills you need to advance your career and stay ahead of
                the curve.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl py-16 px-8 md:px-16 mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Success Stories
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Testimonial 1 */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                "Resulient helped me create a resume that truly reflects my
                skills and experience. I landed my dream job within weeks!"
              </p>
              <div className="flex items-center">
                <div className="ml-4">
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    Alice Johnson
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Marketing Manager
                  </p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
              <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
                "The AI-driven learning paths have been a game-changer for me.
                I've been able to quickly upskill and take on new challenges."
              </p>
              <div className="flex items-center">
                <div className="ml-4">
                  <p className="font-bold text-blue-600 dark:text-blue-400">
                    Bob Williams
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Software Engineer
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-teal-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
            Ready to Transform Your Career?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto">
            Join Resulient today and unlock the tools you need to achieve your
            career goals. Create a standout resume, discover new
            opportunities, and level up your skills.
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 text-white font-bold px-12 py-6 text-xl rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="h-6 w-6 ml-3" />
          </Button>
        </div>
      </div>
    </div>
  );
}
