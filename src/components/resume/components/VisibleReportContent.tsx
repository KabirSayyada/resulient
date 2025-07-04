
import React from 'react';
import { ScoreData } from "@/types/resume";
import { ScoreBreakdown } from "../ScoreBreakdown";
import { QualificationGaps } from './QualificationGaps';
import { TrendingUp, Calendar, Building, Award, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VisibleReportContentProps {
  scoreData: ScoreData;
}

export const VisibleReportContent = ({ scoreData }: VisibleReportContentProps) => {
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
