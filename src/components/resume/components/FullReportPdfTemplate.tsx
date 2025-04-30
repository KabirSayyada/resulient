
import React from 'react';
import { ScoreData } from "@/types/resume";
import { ScoreBreakdown } from "../ScoreBreakdown";
import { QualificationGaps } from './QualificationGaps';

interface FullReportPdfTemplateProps {
  completeReportRef: React.RefObject<HTMLDivElement>;
  scoreData: ScoreData;
}

export const FullReportPdfTemplate = ({ completeReportRef, scoreData }: FullReportPdfTemplateProps) => {
  return (
    <div 
      ref={completeReportRef} 
      className="fixed left-[-9999px] top-0 z-[-1] bg-white p-8 rounded-lg max-w-3xl print-report" 
      style={{ overflow: 'hidden' }}
    >
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-800 mb-2">Complete Resume Analysis Report</h1>
        <p className="text-fuchsia-600 font-medium">Generated on {scoreData.timestamp}</p>
        <div className="mt-4 inline-block bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 font-semibold">
          Overall Score: {scoreData.overallScore}/100 • Industry: {scoreData.Industry}
        </div>
      </div>

      <ScoreBreakdown scoreData={scoreData} />

      {scoreData.missingQualifications && scoreData.missingQualifications.length > 0 && (
        <QualificationGaps qualifications={scoreData.missingQualifications} />
      )}
    </div>
  );
};
