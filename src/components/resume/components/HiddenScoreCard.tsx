
import React from 'react';
import { ScoreData } from "@/types/resume";
import ResumeScoreCard from "../ResumeScoreCard";

interface HiddenScoreCardProps {
  scoreCardRef: React.RefObject<HTMLDivElement>;
  scoreData: ScoreData;
}

export const HiddenScoreCard = ({ scoreCardRef, scoreData }: HiddenScoreCardProps) => {
  return (
    <div 
      ref={scoreCardRef} 
      className="fixed left-[-9999px] top-0 z-[-1] bg-white p-4 print-scorecard"
      style={{ overflow: 'hidden' }}
    >
      <ResumeScoreCard scoreData={scoreData} />
    </div>
  );
};
