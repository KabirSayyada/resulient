
import { MainNavigation } from "@/components/resume/MainNavigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, Zap, Search, Globe, Calendar, TrendingUp, ArrowRight, Crown, Sparkles } from "lucide-react";

export default function Jobs() {
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
                <span className="text-white font-bold text-lg">REVOLUTIONARY TECHNOLOGY</span>
                <Sparkles className="h-5 w-5 text-yellow-300 animate-pulse" />
              </div>
              
              <h1 className="text-6xl md:text-7xl font-bold text-white mb-8 leading-tight">
                The Future of
                <span className="block bg-gradient-to-r from-yellow-300 via-orange-300 to-pink-300 bg-clip-text text-transparent">
                  Job Matching
                </span>
                <span className="block text-5xl md:text-6xl">Is Coming Soon</span>
              </h1>
              
              <p className="text-2xl text-white/95 max-w-4xl mx-auto mb-12 leading-relaxed">
                We're building the <span className="font-bold text-yellow-300">first-of-its-kind</span> AI-powered job matching platform 
                that will <span className="font-bold text-orange-300">completely transform</span> how you find and apply to jobs forever.
              </p>
              
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full px-8 py-4 shadow-2xl">
                <Crown className="h-6 w-6 text-yellow-200" />
                <span className="text-white font-bold text-xl">COMING SOON</span>
                <Crown className="h-6 w-6 text-yellow-200" />
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Revolutionary Features */}
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 text-lg px-6 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              🚀 World's First Technology
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent mb-6">
              What Makes This Revolutionary
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We're not just another job board. We're creating technology that has never existed before.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            <Card className="relative overflow-hidden border-2 border-gradient-to-r from-blue-200 to-purple-200 dark:from-blue-800 dark:to-purple-800 hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30"></div>
              <CardContent className="relative p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  10,000+ Job Boards
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  We scan every corner of the internet - from major job sites to company career pages, 
                  ensuring you never miss an opportunity.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-gradient-to-r from-emerald-200 to-teal-200 dark:from-emerald-800 dark:to-teal-800 hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30"></div>
              <CardContent className="relative p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Search className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Millions of Fresh Jobs
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Access millions of job postings updated in real-time, giving you first access 
                  to opportunities as they become available.
                </p>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden border-2 border-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 hover:shadow-2xl transition-all duration-300 group">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30"></div>
              <CardContent className="relative p-8 text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl mx-auto flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Perfect Fit Matching
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  Our AI only shows you jobs you're genuinely qualified for, dramatically 
                  increasing your chances of getting hired.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* The Transformation */}
          <div className="relative">
            <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 border-2 border-indigo-200 dark:border-indigo-800">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-400/20 via-transparent to-transparent"></div>
              <CardContent className="relative p-12">
                <div className="text-center max-w-4xl mx-auto">
                  <div className="inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full px-8 py-3 mb-8">
                    <TrendingUp className="h-6 w-6 text-white" />
                    <span className="text-white font-bold text-xl">GAME CHANGER</span>
                  </div>
                  
                  <h2 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                    This Will Transform Everything
                  </h2>
                  
                  <div className="space-y-6 text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                    <p className="text-xl">
                      🎯 <span className="font-bold">No more applying to hundreds of irrelevant jobs.</span> 
                      Our AI ensures every job matches your exact skills and experience.
                    </p>
                    
                    <p className="text-xl">
                      ⚡ <span className="font-bold">Dramatically increase your success rate.</span> 
                      When jobs are truly hiring and you're genuinely qualified, your chances skyrocket.
                    </p>
                    
                    <p className="text-xl">
                      🚀 <span className="font-bold">Get there first.</span> 
                      Real-time job discovery means you apply before the competition even knows the job exists.
                    </p>
                  </div>
                  
                  <div className="mt-12 p-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm rounded-2xl border border-purple-200 dark:border-purple-800">
                    <p className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-4">
                      The Promise We're Making
                    </p>
                    <p className="text-xl text-gray-600 dark:text-gray-400">
                      This platform will only show you jobs you're <span className="font-bold text-green-600 dark:text-green-400">actually qualified for</span> 
                      from companies that are <span className="font-bold text-blue-600 dark:text-blue-400">actively hiring right now</span>.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Coming Soon CTA */}
          <div className="text-center py-16">
            <div className="inline-block p-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-3xl shadow-2xl">
              <div className="bg-white dark:bg-gray-900 rounded-3xl px-12 py-10">
                <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Get Ready for the Revolution
                </h3>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                  We're putting the finishing touches on technology that will change how job searching works forever. 
                  Stay tuned for the launch that will transform your career.
                </p>
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold px-12 py-6 text-xl rounded-full shadow-2xl transform transition-all duration-300 hover:scale-105"
                  disabled
                >
                  <Calendar className="h-6 w-6 mr-3" />
                  Coming Soon
                  <ArrowRight className="h-6 w-6 ml-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
