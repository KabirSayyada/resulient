
import React from 'react';
import { ScoreData } from "@/types/resume";
import { ScoreBreakdown } from "../ScoreBreakdown";
import { QualificationGaps } from './QualificationGaps';

interface VisibleReportContentProps {
  scoreData: ScoreData;
}

export const VisibleReportContent = ({ scoreData }: VisibleReportContentProps) => {
  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg mx-3 sm:mx-6 mb-6 shadow-inner overflow-hidden">
      <div className="text-center mb-6 sm:mb-10">
        <h1 className="text-xl sm:text-3xl font-bold text-indigo-800 mb-2">Complete Resume Analysis Report</h1>
        <p className="text-fuchsia-600 font-medium text-sm sm:text-base">Generated on {scoreData.timestamp}</p>
        <div className="mt-4 inline-block bg-indigo-50 px-3 sm:px-4 py-2 rounded-full text-indigo-700 font-semibold text-sm sm:text-base">
          <span className="whitespace-normal">Overall Score: {scoreData.overallScore}/100 • Industry: {scoreData.Industry}</span>
        </div>
      </div>

      <ScoreBreakdown scoreData={scoreData} />

      {scoreData.missingQualifications && scoreData.missingQualifications.length > 0 && (
        <QualificationGaps qualifications={scoreData.missingQualifications} />
      )}
    </div>
  );
};
