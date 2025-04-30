
import React, { useRef } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScoreData } from "@/types/resume";
import ResumeScoreCard from "./ResumeScoreCard";
import { ResumeActions } from './components/ResumeActions';
import { CachedResultIndicator } from './components/CachedResultIndicator';
import { HiddenScoreCard } from './components/HiddenScoreCard';
import { FullReportPdfTemplate } from './components/FullReportPdfTemplate';
import { VisibleReportContent } from './components/VisibleReportContent';
import { DownloadReportSection } from './components/DownloadReportSection';

interface ScoreResultSectionProps {
  scoreData: ScoreData;
}

export const ScoreResultSection = ({ scoreData }: ScoreResultSectionProps) => {
  const scoreCardRef = useRef<HTMLDivElement | null>(null);
  const completeReportRef = useRef<HTMLDivElement | null>(null);

  const isCachedResult = scoreData.id && !scoreData.id.includes("newly-generated");

  return (
    <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 relative mt-10 animate-fade-in overflow-hidden">
      <CachedResultIndicator isCached={isCachedResult} />
      
      <div className="flex flex-col items-center justify-center py-6 px-2 sm:px-6">
        <HiddenScoreCard scoreCardRef={scoreCardRef} scoreData={scoreData} />
        
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

      <FullReportPdfTemplate 
        completeReportRef={completeReportRef}
        scoreData={scoreData}
      />
      
      <VisibleReportContent scoreData={scoreData} />

      <DownloadReportSection completeReportRef={completeReportRef} />
    </Card>
  );
};
