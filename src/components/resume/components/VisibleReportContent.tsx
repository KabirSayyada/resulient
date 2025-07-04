
import React from 'react';
import { ScoreData } from "@/types/resume";
import { ScoreBreakdown } from "../ScoreBreakdown";
import { QualificationGaps } from './QualificationGaps';
import { SuggestedSkills } from './SuggestedSkills';
import { ImprovementSuggestions } from './ImprovementSuggestions';
import { TrendingUp, Calendar, Building, Award, Sparkles, Target, BarChart3, Star, Trophy, Crown, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface VisibleReportContentProps {
  scoreData: ScoreData;
}

export const VisibleReportContent = ({ scoreData }: VisibleReportContentProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800";
    if (score >= 60) return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800";
    return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800";
  };

  return (
    <div className="relative overflow-hidden">
      {/* Enhanced background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50/80 to-blue-50/60 dark:from-gray-900 dark:via-gray-800/80 dark:to-blue-950/60"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 dark:from-emerald-800/10 dark:to-blue-800/10 rounded-full -translate-y-32 translate-x-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full translate-y-24 -translate-x-24 blur-3xl"></div>
      
      <div className="relative z-10 p-6 sm:p-8 mx-3 sm:mx-6 mb-6 rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        {/* Enhanced Header Section */}
        <div className="text-center mb-10 space-y-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                Complete Resume Analysis
              </h1>
              <div className="flex items-center justify-center gap-2 mt-2">
                <Calendar className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                  Generated on {scoreData.timestamp}
                </p>
              </div>
            </div>
          </div>
          
          {/* Performance Badge */}
          <div className="flex justify-center">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg px-6 py-3 text-base font-semibold rounded-xl hover:shadow-xl transition-all duration-300">
              <Sparkles className="h-5 w-5 mr-2 animate-pulse" />
              Performance: {scoreData.percentile} • {scoreData.numSimilarResumes?.toLocaleString()} profiles analyzed
            </Badge>
          </div>

          {/* Modern Score Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {/* Overall Score Card */}
            <Card className={`${getScoreBg(scoreData.overallScore)} border-2 shadow-lg hover:shadow-xl transition-all duration-300`}>
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <BarChart3 className={`h-6 w-6 ${getScoreColor(scoreData.overallScore)}`} />
                </div>
                <div className={`text-3xl font-bold ${getScoreColor(scoreData.overallScore)} mb-1`}>
                  {scoreData.overallScore}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">/100</div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Overall Score</h3>
              </CardContent>
            </Card>

            {/* Industry Card */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 border-2 border-indigo-300 dark:from-indigo-950/30 dark:to-blue-950/30 dark:border-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-xl shadow-md">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                </div>
                <div className="text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-2">
                  {scoreData.Industry}
                </div>
                <h3 className="font-semibold text-indigo-700 dark:text-indigo-400">Industry Focus</h3>
              </CardContent>
            </Card>

            {/* Standing Card */}
            <Card className="bg-gradient-to-br from-violet-50 to-purple-100 border-2 border-violet-300 dark:from-violet-950/30 dark:to-purple-950/30 dark:border-violet-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <div className="p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-xl shadow-md">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-md mb-2 px-3 py-1">
                  <Award className="h-3 w-3 mr-1" />
                  {scoreData.percentile}
                </Badge>
                <h3 className="font-semibold text-violet-700 dark:text-violet-400">Market Standing</h3>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Score Breakdown */}
        <div className="mb-10">
          <ScoreBreakdown scoreData={scoreData} />
        </div>

        {/* Enhanced Suggested Skills Section */}
        {scoreData.suggestedSkills && scoreData.suggestedSkills.length > 0 && (
          <div className="mb-10">
            <Card className="relative overflow-hidden bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 dark:from-cyan-950/50 dark:via-blue-950/50 dark:to-indigo-950/50 border-2 border-cyan-200/60 dark:border-cyan-800/60 shadow-xl">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-cyan-200/30 to-blue-200/30 dark:from-cyan-800/20 dark:to-blue-800/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-tr from-indigo-200/30 to-cyan-200/30 dark:from-indigo-800/20 dark:to-cyan-800/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
              </div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-xl">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-2xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">
                      Recommended Skills
                    </CardTitle>
                    <p className="text-cyan-600 dark:text-cyan-400 font-medium text-sm mt-1">
                      Skills that could enhance your profile
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="bg-gradient-to-r from-white/80 via-cyan-50/80 to-blue-50/80 dark:from-gray-900/80 dark:via-cyan-950/50 dark:to-blue-950/50 p-6 rounded-xl backdrop-blur-sm border border-cyan-200/40 dark:border-cyan-800/40 shadow-inner">
                  <SuggestedSkills skills={scoreData.suggestedSkills} />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Enhanced Elite Indicators Section */}
        {scoreData.eliteIndicatorsFound && scoreData.eliteIndicatorsFound.length > 0 && (
          <div className="mb-10">
            {/* Modern Card Above Elite Indicators */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-amber-950/50 dark:via-yellow-950/50 dark:to-orange-950/50 border-2 border-amber-200/60 dark:border-amber-800/60 shadow-xl mb-6">
              {/* Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-yellow-200/30 dark:from-amber-800/20 dark:to-yellow-800/20 rounded-full blur-2xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-tr from-orange-200/30 to-amber-200/30 dark:from-orange-800/20 dark:to-amber-800/20 rounded-full blur-2xl animate-pulse delay-500"></div>
              </div>
              
              <CardContent className="p-6 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl shadow-xl">
                    <Star className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
                      Excellence Recognition
                    </h3>
                    <p className="text-amber-700 dark:text-amber-300 leading-relaxed">
                      We've identified standout elements in your resume that demonstrate exceptional achievements and qualifications. These elite indicators set you apart from other candidates.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Elite Indicators */}
            <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-yellow-950/50 dark:via-amber-950/50 dark:to-orange-950/50 border-2 border-yellow-300/60 dark:border-yellow-700/60 shadow-2xl">
              {/* Golden Background Elements */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-300/30 to-amber-300/30 dark:from-yellow-700/20 dark:to-amber-700/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-tr from-orange-300/30 to-yellow-300/30 dark:from-orange-700/20 dark:to-yellow-700/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-amber-400/20 to-yellow-400/20 dark:from-amber-600/15 dark:to-yellow-600/15 rounded-full blur-2xl animate-pulse delay-500"></div>
              </div>
              
              <CardHeader className="relative z-10 pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-yellow-500 via-amber-500 to-orange-500 rounded-3xl shadow-2xl">
                    <Crown className="h-8 w-8 text-white drop-shadow-lg" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600 bg-clip-text text-transparent drop-shadow-sm">
                      Notable Achievements Detected
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <Trophy className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                      <p className="text-amber-700 dark:text-amber-300 font-semibold">
                        Elite indicators that make you stand out
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="bg-gradient-to-r from-white/90 via-yellow-50/90 to-amber-50/90 dark:from-gray-900/90 dark:via-yellow-950/60 dark:to-amber-950/60 p-8 rounded-2xl backdrop-blur-sm border-2 border-yellow-200/50 dark:border-yellow-700/50 shadow-inner">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {scoreData.eliteIndicatorsFound.map((indicator, index) => (
                      <div 
                        key={index} 
                        className="group relative overflow-hidden bg-gradient-to-br from-yellow-100/80 via-amber-100/80 to-orange-100/80 dark:from-yellow-900/40 dark:via-amber-900/40 dark:to-orange-900/40 p-6 rounded-xl border-2 border-yellow-300/60 dark:border-yellow-700/60 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                      >
                        {/* Individual Card Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/30 to-amber-200/30 dark:from-yellow-800/20 dark:to-amber-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="relative z-10 flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl shadow-xl group-hover:scale-110 transition-transform duration-300">
                            <Award className="h-6 w-6 text-white drop-shadow-md" />
                          </div>
                          <div className="flex-1">
                            <p className="text-amber-800 dark:text-amber-200 font-semibold text-lg leading-relaxed">
                              {indicator}
                            </p>
                          </div>
                        </div>
                        
                        {/* Sparkle Effect */}
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Sparkles className="h-5 w-5 text-yellow-500 animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Improvement Suggestions */}
        {scoreData.improvementTips && scoreData.improvementTips.length > 0 && (
          <div className="mb-10">
            <ImprovementSuggestions suggestions={scoreData.improvementTips} />
          </div>
        )}

        {/* Qualification Gaps */}
        {scoreData.missingQualifications && scoreData.missingQualifications.length > 0 && (
          <div className="mt-8">
            <QualificationGaps qualifications={scoreData.missingQualifications} />
          </div>
        )}
      </div>
    </div>
  );
};
