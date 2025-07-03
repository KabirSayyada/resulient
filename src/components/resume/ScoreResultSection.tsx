
import React, { useRef, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { ScoreData } from "@/types/resume";
import ResumeScoreCard from "./ResumeScoreCard";
import { ResumeActions } from './components/ResumeActions';
import { CachedResultIndicator } from './components/CachedResultIndicator';
import { HiddenScoreCard } from './components/HiddenScoreCard';
import { FullReportPdfTemplate } from './components/FullReportPdfTemplate';
import { VisibleReportContent } from './components/VisibleReportContent';
import { DownloadReportSection } from './components/DownloadReportSection';
import { ResumeScoreAnimations } from './components/ResumeScoreAnimations';
import { motion, AnimatePresence } from 'framer-motion';

interface ScoreResultSectionProps {
  scoreData: ScoreData;
}

export const ScoreResultSection = ({ scoreData }: ScoreResultSectionProps) => {
  const scoreCardRef = useRef<HTMLDivElement | null>(null);
  const completeReportRef = useRef<HTMLDivElement | null>(null);
  const [showAnimations, setShowAnimations] = useState(scoreData.id?.includes("newly-generated") || false);
  const [showScorecard, setShowScorecard] = useState(scoreData.id && !scoreData.id.includes("newly-generated"));

  const isCachedResult = scoreData.id && !scoreData.id.includes("newly-generated");

  const handleAnimationsComplete = () => {
    setShowAnimations(false);
    setShowScorecard(true);
  };

  return (
    <div className="space-y-6 mt-10 animate-fade-in">
      <AnimatePresence mode="wait">
        {showAnimations && !isCachedResult && (
          <motion.div
            key="animations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <ResumeScoreAnimations 
              score={scoreData.overallScore} 
              onComplete={handleAnimationsComplete}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showScorecard && (
          <motion.div
            key="scorecard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Card className="border-t-8 border-t-indigo-600 shadow-xl bg-gradient-to-bl from-white via-indigo-50 to-blue-100 dark:from-gray-800 dark:via-indigo-900/50 dark:to-blue-900/50 relative overflow-hidden">
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
