
import React from 'react';
import { ScoreData } from "@/types/resume";
import { ScoreBreakdown } from "../ScoreBreakdown";
import { QualificationGaps } from './QualificationGaps';
import { TrendingUp, Calendar, Building, Award, Sparkles, Target, BarChart3, Star, Trophy } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

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

        {/* Elite Achievements Section with Enhanced Golden Design */}
        {scoreData.eliteIndicators && scoreData.eliteIndicators.length > 0 && (
          <div className="mb-10">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:via-amber-900/30 dark:to-orange-900/20 border-2 border-amber-200 dark:border-amber-700/50 shadow-lg">
              {/* Decorative background elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 via-yellow-100/30 to-orange-100/50 dark:from-amber-800/10 dark:via-yellow-800/10 dark:to-orange-800/10"></div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-300/20 to-yellow-400/20 dark:from-amber-600/10 dark:to-yellow-700/10 rounded-full -translate-y-16 translate-x-16 blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-orange-300/20 to-amber-400/20 dark:from-orange-600/10 dark:to-amber-700/10 rounded-full translate-y-12 -translate-x-12 blur-2xl"></div>
              
              <div className="relative z-10 p-8">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-amber-400 via-yellow-500 to-orange-500 rounded-2xl shadow-xl">
                    <Trophy className="h-7 w-7 text-white drop-shadow-sm" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-700 via-yellow-600 to-orange-600 dark:from-amber-400 dark:via-yellow-300 dark:to-orange-400 bg-clip-text text-transparent">
                      Notable Achievements Detected
                    </h3>
                    <p className="text-amber-700/80 dark:text-amber-300/80 text-sm font-medium">
                      Elite indicators found in your profile
                    </p>
                  </div>
                </div>
                
                <div className="grid gap-4">
                  {scoreData.eliteIndicators.map((achievement, index) => (
                    <div 
                      key={index}
                      className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-100/80 via-yellow-100/60 to-orange-100/80 dark:from-amber-800/30 dark:via-yellow-800/20 dark:to-orange-800/30 border border-amber-300/50 dark:border-amber-600/30 p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                    >
                      {/* Subtle shimmer effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-200/20 to-transparent dark:via-amber-400/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                      
                      <div className="relative flex items-center gap-4">
                        <div className="flex-shrink-0 p-2 bg-gradient-to-br from-amber-300 to-yellow-400 dark:from-amber-600 dark:to-yellow-600 rounded-lg shadow-md">
                          <Star className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="text-amber-900 dark:text-amber-100 font-semibold leading-relaxed">
                            {achievement}
                          </p>
                        </div>
                        <div className="flex-shrink-0">
                          <Sparkles className="h-5 w-5 text-amber-600 dark:text-amber-400 animate-pulse" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
