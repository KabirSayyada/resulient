
import React from 'react';
import { ScoreData } from "@/types/resume";
import { ScoreBreakdown } from "../ScoreBreakdown";
import { QualificationGaps } from './QualificationGaps';
import { TrendingUp, Calendar, Building, Award, Sparkles, Target, BarChart3 } from 'lucide-react';
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
      <div className="absolute top-0 right-0 w-32 sm:w-64 h-32 sm:h-64 bg-gradient-to-br from-emerald-200/20 to-blue-200/20 dark:from-emerald-800/10 dark:to-blue-800/10 rounded-full -translate-y-16 sm:-translate-y-32 translate-x-16 sm:translate-x-32 blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-24 sm:w-48 h-24 sm:h-48 bg-gradient-to-tr from-purple-200/20 to-pink-200/20 dark:from-purple-800/10 dark:to-pink-800/10 rounded-full translate-y-12 sm:translate-y-24 -translate-x-12 sm:-translate-x-24 blur-3xl"></div>
      
      <div className="relative z-10 p-2 sm:p-6 lg:p-8 mx-1 sm:mx-6 mb-3 sm:mb-6 rounded-xl sm:rounded-2xl shadow-2xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        {/* Enhanced Header Section */}
        <div className="text-center mb-4 sm:mb-10 space-y-2 sm:space-y-6">
          <div className="flex flex-col items-center justify-center gap-2 mb-2 sm:mb-6">
            <div className="p-2 sm:p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-xl sm:rounded-2xl shadow-xl">
              <TrendingUp className="h-4 w-4 sm:h-8 sm:w-8 text-white" />
            </div>
            <div className="text-center">
              <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight px-2">
                Complete Resume Analysis
              </h1>
              <div className="flex items-center justify-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400" />
                <p className="text-emerald-600 dark:text-emerald-400 font-medium text-xs sm:text-sm">
                  Generated on {scoreData.timestamp}
                </p>
              </div>
            </div>
          </div>
          
          {/* Performance Badge */}
          <div className="flex justify-center px-2">
            <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-lg px-2 sm:px-6 py-1 sm:py-3 text-xs sm:text-base font-semibold rounded-lg sm:rounded-xl hover:shadow-xl transition-all duration-300">
              <Sparkles className="h-3 w-3 sm:h-5 sm:w-5 mr-1 sm:mr-2 animate-pulse" />
              <span className="break-words">Performance: {scoreData.percentile} • {scoreData.numSimilarResumes?.toLocaleString()} profiles analyzed</span>
            </Badge>
          </div>

          {/* Modern Score Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 mt-3 sm:mt-8">
            {/* Overall Score Card */}
            <Card className={`${getScoreBg(scoreData.overallScore)} border-2 shadow-lg hover:shadow-xl transition-all duration-300 col-span-1 sm:col-span-2 lg:col-span-1`}>
              <CardContent className="p-3 sm:p-6 text-center">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <BarChart3 className={`h-4 w-4 sm:h-6 sm:w-6 ${getScoreColor(scoreData.overallScore)}`} />
                </div>
                <div className={`text-xl sm:text-3xl font-bold ${getScoreColor(scoreData.overallScore)} mb-1`}>
                  {scoreData.overallScore}
                </div>
                <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">/100</div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-xs sm:text-base">Overall Score</h3>
              </CardContent>
            </Card>

            {/* Industry Card */}
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-100 border-2 border-indigo-300 dark:from-indigo-950/30 dark:to-blue-950/30 dark:border-indigo-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-3 sm:p-6 text-center">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <div className="p-1 sm:p-2 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-lg sm:rounded-xl shadow-md">
                    <Building className="h-3 w-3 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <div className="text-xs sm:text-lg font-bold text-indigo-800 dark:text-indigo-300 mb-1 sm:mb-2 break-words px-1">
                  {scoreData.Industry}
                </div>
                <h3 className="font-semibold text-indigo-700 dark:text-indigo-400 text-xs sm:text-base">Industry Focus</h3>
              </CardContent>
            </Card>

            {/* Standing Card */}
            <Card className="bg-gradient-to-br from-violet-50 to-purple-100 border-2 border-violet-300 dark:from-violet-950/30 dark:to-purple-950/30 dark:border-violet-700 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <CardContent className="p-3 sm:p-6 text-center">
                <div className="flex items-center justify-center mb-2 sm:mb-3">
                  <div className="p-1 sm:p-2 bg-gradient-to-r from-violet-500 to-purple-600 rounded-lg sm:rounded-xl shadow-md">
                    <Target className="h-3 w-3 sm:h-6 sm:w-6 text-white" />
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-violet-500 to-purple-600 text-white border-0 shadow-md mb-1 sm:mb-2 px-2 sm:px-3 py-1 text-xs sm:text-sm">
                  <Award className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                  {scoreData.percentile}
                </Badge>
                <h3 className="font-semibold text-violet-700 dark:text-violet-400 text-xs sm:text-base">Market Standing</h3>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Score Breakdown */}
        <div className="mb-4 sm:mb-10">
          <ScoreBreakdown scoreData={scoreData} />
        </div>

        {/* Qualification Gaps */}
        {scoreData.missingQualifications && scoreData.missingQualifications.length > 0 && (
          <div className="mt-3 sm:mt-8">
            <QualificationGaps qualifications={scoreData.missingQualifications} />
          </div>
        )}
      </div>
    </div>
  );
};
