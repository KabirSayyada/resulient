
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreData } from "@/pages/ResumeScoring";
import { Award, Star, Medal, BookOpen, Trophy, TrendingUp, BarChart } from "lucide-react";
import BenchmarkGraph from "./BenchmarkGraph";

interface ResumeScoreCardProps {
  scoreData: ScoreData;
}

export const ResumeScoreCard = ({ scoreData }: ResumeScoreCardProps) => {
  const numSimilar = scoreData.numSimilarResumes || 12000; // fallback if backend didn't provide
  const percentile = scoreData.percentile;

  return (
    <div className="max-w-md mx-auto shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-blue-100 p-0 border-4 border-indigo-200 relative scorecard-for-export">
      <CardHeader className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-indigo-400 via-fuchsia-300 to-blue-300 py-6 animate-fade-in">
        <Award className="text-yellow-400 w-12 h-12 drop-shadow-lg mb-1" />
        <CardTitle className="text-2xl font-black text-indigo-900 drop-shadow">
          Resume Scorecard
        </CardTitle>
        <span className="font-semibold text-indigo-700 text-lg">
          {scoreData.industry}
        </span>
        <Badge variant="secondary" className="mt-1 bg-fuchsia-100 text-fuchsia-700 font-bold text-xs rounded-full px-4 py-1 shadow animate-pulse">
          {scoreData.scoringMode === "resumeOnly"
            ? `Top ${scoreData.percentile}%`
            : `Job Fit Score`}
        </Badge>
      </CardHeader>
      <CardContent className="py-6 px-4 flex flex-col items-center gap-4">
        <div className="text-[56px] font-extrabold text-fuchsia-600 leading-none flex items-center gap-2">
          {scoreData.overall}
          <span className="text-xl text-indigo-700 font-bold">/100</span>
        </div>
        <div className="text-sm font-semibold text-indigo-600 -mt-2">
          Overall Resume Score
        </div>
        
        {scoreData.eliteIndicatorsFound && scoreData.eliteIndicatorsFound.length > 0 && (
          <div className="w-full mt-1 mb-2">
            <div className="text-xs font-semibold text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
              Notable achievements detected: {scoreData.eliteIndicatorsFound.join(", ")}
            </div>
          </div>
        )}
        
        {scoreData.scoringMode === "resumeOnly" && (
          <div className="w-full mt-2">
            <BenchmarkGraph percentile={percentile} numSimilar={numSimilar} />
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full mt-2">
          <ScoreMetric 
            icon={<Star className="w-4 h-4 text-yellow-500" />} 
            label="Skills (25%)" 
            value={scoreData.skillsBreadth}
          />
          <ScoreMetric 
            icon={<TrendingUp className="w-4 h-4 text-blue-500" />} 
            label="Experience (25%)" 
            value={scoreData.experienceDuration}
          />
          {scoreData.achievements && (
            <ScoreMetric 
              icon={<Trophy className="w-4 h-4 text-purple-500" />} 
              label="Achievements (20%)" 
              value={scoreData.achievements}
            />
          )}
          {scoreData.educationQuality && (
            <ScoreMetric 
              icon={<BookOpen className="w-4 h-4 text-indigo-500" />} 
              label="Education (15%)" 
              value={scoreData.educationQuality}
            />
          )}
          {scoreData.certifications && (
            <ScoreMetric 
              icon={<Award className="w-4 h-4 text-green-500" />} 
              label="Certifications (10%)" 
              value={scoreData.certifications}
            />
          )}
          <ScoreMetric 
            icon={<BarChart className="w-4 h-4 text-pink-500" />} 
            label="Structure (5%)" 
            value={scoreData.contentStructure}
          />
        </div>
        
        <div className="my-4 text-indigo-800 text-center">
          <div className="font-semibold text-sm mb-1">Suggested Skills to Add:</div>
          <div className="text-xs font-bold text-fuchsia-700 mb-1">
            {scoreData.suggestedSkills.join(", ")}
          </div>
        </div>
        
        <div className="rounded-md text-xs text-gray-600 bg-indigo-50 p-2 font-medium w-full">
          {scoreData.scoringMode === "resumeOnly" 
            ? `Benchmarked vs. others in "${scoreData.industry}" — Top ${scoreData.percentile}%`
            : "Compared against your target job description"}
        </div>
        
        <div className="flex items-center gap-2 justify-center text-xs text-indigo-900 mt-2 font-bold">
          <span>Generated on {scoreData.timestamp}</span>
        </div>
        
        <div className="w-full text-center mt-1">
          <span className="text-xs text-gray-500">Share your progress and help others improve their resumes!</span>
        </div>
      </CardContent>
    </div>
  );
};

const ScoreMetric = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) => (
  <div className="flex items-center gap-1 text-indigo-800">
    <span>{icon}</span>
    <span className="font-medium">{label}:</span>
    <span className="font-semibold text-[18px] text-indigo-900 ml-1">
      {value}
    </span>
    <span className="text-sm text-fuchsia-800 font-extrabold">/100</span>
  </div>
);

export default ResumeScoreCard;
