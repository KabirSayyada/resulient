
import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { ScoreData } from "@/types/resume";
import ResumeScoreCard from "./ResumeScoreCard";
import { History } from "lucide-react";
import { QualificationGaps } from './components/QualificationGaps';
import { ResumeActions } from './components/ResumeActions';

interface ScoreResultSectionProps {
  scoreData: ScoreData;
}

export const ScoreResultSection = ({ scoreData }: ScoreResultSectionProps) => {
  const scoreCardRef = useRef<HTMLDivElement | null>(null);
  const completeReportRef = useRef<HTMLDivElement | null>(null);

  // Check if this was a cached result by examining the id
  const isCachedResult = scoreData.id && !scoreData.id.includes("newly-generated");

  return (
    <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 relative mt-10 animate-fade-in overflow-hidden">
      {isCachedResult && (
        <div className="absolute top-0 left-0 m-4 z-10 flex gap-2 items-center">
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold flex items-center">
            <History className="w-3 h-3 mr-1" /> Cached Result
          </div>
        </div>
      )}
      
      <div className="flex flex-col items-center justify-center py-6 px-2 sm:px-6">
        {/* Hidden version for PDF export */}
        <div ref={scoreCardRef} className="fixed left-[-9999px] top-0 z-[-1] bg-white p-4 print-scorecard">
          <ResumeScoreCard scoreData={scoreData} />
        </div>
        
        {/* Visible version */}
        <div className="w-full max-w-md mx-auto">
          <ResumeScoreCard scoreData={scoreData} />
        </div>
      </div>
      
      {/* Export options section */}
      <CardContent className="px-3 sm:px-6 pb-6">
        <ResumeActions 
          scoreCardRef={scoreCardRef} 
          completeReportRef={completeReportRef} 
          scoreData={scoreData}
        />
      </CardContent>
      
      <div 
        ref={completeReportRef} 
        className="fixed left-[-9999px] top-0 z-[-1] bg-white p-8 rounded-lg max-w-3xl print-report"
      >
        {/* Complete report content for PDF export */}
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

        <div className="mt-8 mb-6">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">Improvement Suggestions</h2>
          <div className="bg-indigo-50 p-4 rounded-lg">
            <ul className="space-y-3">
              {scoreData.improvementTips.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-indigo-500 font-bold flex-shrink-0">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 mb-6">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">Suggested Skills</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {scoreData.suggestedSkills.map((skill, index) => (
              <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      {/* Visible Report Preview */}
      <div className="bg-white p-4 sm:p-6 rounded-lg mx-3 sm:mx-6 mb-6 shadow-inner overflow-x-hidden">
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-800 mb-2">Complete Resume Analysis Report</h1>
          <p className="text-fuchsia-600 font-medium">Generated on {scoreData.timestamp}</p>
          <div className="mt-4 inline-block bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 font-semibold text-sm sm:text-base">
            Overall Score: {scoreData.overallScore}/100 • Industry: {scoreData.Industry}
          </div>
        </div>

        <ScoreBreakdown scoreData={scoreData} />

        {scoreData.missingQualifications && scoreData.missingQualifications.length > 0 && (
          <QualificationGaps qualifications={scoreData.missingQualifications} />
        )}

        <div className="mt-8 mb-6">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">Improvement Suggestions</h2>
          <div className="bg-indigo-50 p-4 rounded-lg shadow-inner">
            <ul className="space-y-3">
              {scoreData.improvementTips.map((tip, index) => (
                <li key={index} className="flex gap-2">
                  <span className="text-indigo-500 font-bold flex-shrink-0">•</span>
                  <span className="text-sm sm:text-base">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 mb-6">
          <h2 className="text-xl font-bold text-indigo-700 mb-4">Suggested Skills</h2>
          <div className="flex flex-wrap gap-2 mb-4">
            {scoreData.suggestedSkills.map((skill, index) => (
              <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};
