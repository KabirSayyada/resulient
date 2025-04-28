import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { ScoreData } from "@/types/resume";
import ResumeScoreCard from "./ResumeScoreCard";
import { History, Download } from "lucide-react";
import { QualificationGaps } from './components/QualificationGaps';
import { ResumeActions } from './components/ResumeActions';
import { ImprovementSuggestions } from './components/ImprovementSuggestions';
import { SuggestedSkills } from './components/SuggestedSkills';
import { Button } from "@/components/ui/button";
import { generatePDFFromElement } from "@/utils/reportGenerationUtils";
import { toast } from "@/components/ui/sonner";

interface ScoreResultSectionProps {
  scoreData: ScoreData;
}

export const ScoreResultSection = ({ scoreData }: ScoreResultSectionProps) => {
  const scoreCardRef = useRef<HTMLDivElement | null>(null);
  const completeReportRef = useRef<HTMLDivElement | null>(null);

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
        <div 
          ref={scoreCardRef} 
          className="fixed left-[-9999px] top-0 z-[-1] bg-white p-4 print-scorecard"
          style={{ overflow: 'hidden' }}
        >
          <ResumeScoreCard scoreData={scoreData} />
        </div>
        
        <div className="w-full max-w-md mx-auto">
          <ResumeScoreCard scoreData={scoreData} />
        </div>
      </div>
      
      <CardContent className="px-3 sm:px-6 pb-6">
        <ResumeActions 
          scoreCardRef={scoreCardRef} 
          completeReportRef={completeReportRef} 
          scoreData={scoreData}
        />
      </CardContent>

      <div ref={completeReportRef} className="fixed left-[-9999px] top-0 z-[-1] bg-white p-8 rounded-lg max-w-3xl print-report" style={{ overflow: 'hidden' }}>
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
          <ImprovementSuggestions suggestions={scoreData.improvementTips} />
        </div>

        <div className="mt-8 mb-6">
          <SuggestedSkills skills={scoreData.suggestedSkills} />
        </div>
      </div>
      
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
      </div>

      <div className="px-3 sm:px-6 pb-6">
        <div className="flex justify-center mt-4 w-full">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100 w-full sm:w-auto">
            <div className="text-center mb-2">
              <p className="text-sm text-gray-600">Save this report for your records or to share with others</p>
            </div>
            <Button 
              size="lg"
              onClick={() => {
                const handleFullReportDownload = async () => {
                  if (!completeReportRef.current) return;
                  const success = await generatePDFFromElement(
                    completeReportRef.current,
                    `resume-full-report-${new Date().toISOString().split("T")[0]}.pdf`,
                    false
                  );
                  
                  if (success) {
                    toast.success("Full Report PDF Downloaded", {
                      description: "Your full analysis has been downloaded as PDF."
                    });
                  } else {
                    toast.error("PDF Export Failed", {
                      description: "There was an error downloading your full analysis as PDF."
                    });
                  }
                };
                handleFullReportDownload();
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center"
            >
              <Download className="h-5 w-5" />
              Download Full Report (PDF)
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
