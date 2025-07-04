
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
            <Card className="bg-blue-50 border-2 border-blue-200 dark:bg-blue-950/20 dark:border-blue-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Building className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-2">
                  {scoreData.Industry}
                </div>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Industry</h3>
              </CardContent>
            </Card>

            {/* Standing Card */}
            <Card className="bg-purple-50 border-2 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-600 text-white border-0 shadow-md mb-2">
                  <Award className="h-3 w-3 mr-1" />
                  {scoreData.percentile}
                </Badge>
                <h3 className="font-semibold text-gray-800 dark:text-gray-200">Standing</h3>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Enhanced Score Breakdown */}
        <div className="mb-10">
          <ScoreBreakdown scoreData={scoreData} />
        </div>

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
