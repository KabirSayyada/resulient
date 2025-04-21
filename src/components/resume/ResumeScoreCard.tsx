
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScoreData } from "@/pages/ResumeScoring";
import { Award, Star, Medal, BookOpen, Trophy, TrendingUp, BarChart, AlertTriangle } from "lucide-react";

interface ResumeScoreCardProps {
  scoreData: ScoreData;
}

export const ResumeScoreCard = ({ scoreData }: ResumeScoreCardProps) => {
  const numSimilar = scoreData.numSimilarResumes || 12000; // fallback if backend didn't provide
  const percentile = scoreData.percentile;

  // Calculate normalized percentage (0-100) for display purposes
  const normalizeScore = (score: number, weight: number) => {
    // Convert score to percentage of its weight
    return Math.min(100, Math.max(0, (score / weight) * 100));
  };

  // Check for missing or low-scoring sections
  const missingOrLowSections = [];
  if (!scoreData.skillsAlignment || normalizeScore(scoreData.skillsAlignment, 25) < 40) {
    missingOrLowSections.push("Skills");
  }
  if (!scoreData.WorkExperience || normalizeScore(scoreData.WorkExperience, 25) < 40) {
    missingOrLowSections.push("Work Experience");
  }
  if (!scoreData.Achievements || normalizeScore(scoreData.Achievements, 20) < 40) {
    missingOrLowSections.push("Achievements");
  }
  if (!scoreData.EducationQuality || normalizeScore(scoreData.EducationQuality, 15) < 40) {
    missingOrLowSections.push("Education");
  }

  // Count actual sections present
  let sectionCount = 0;
  if (scoreData.skillsAlignment && scoreData.skillsAlignment > 0) sectionCount++;
  if (scoreData.WorkExperience && scoreData.WorkExperience > 0) sectionCount++;
  if (scoreData.Achievements && scoreData.Achievements > 0) sectionCount++;
  if (scoreData.EducationQuality && scoreData.EducationQuality > 0) sectionCount++;
  if (scoreData.Certifications && scoreData.Certifications > 0) sectionCount++;

  // Resume completeness warning
  let completenessWarning = null;
  if (sectionCount === 0) {
    completenessWarning = "Your resume appears empty. Please add content to receive an accurate score.";
  } else if (sectionCount === 1) {
    completenessWarning = "Your resume has only one section. A complete resume should include skills, experience, education, and achievements.";
  } else if (sectionCount <= 2) {
    completenessWarning = "Your resume is missing multiple important sections. A complete resume needs skills, experience, education, and achievements.";
  }

  return (
    <div className="max-w-md mx-auto shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-blue-100 p-0 border-4 border-indigo-200 relative scorecard-for-export">
      <CardHeader className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-indigo-400 via-fuchsia-300 to-blue-300 py-6 animate-fade-in">
        <Award className="text-yellow-400 w-12 h-12 drop-shadow-lg mb-1" />
        <CardTitle className="text-2xl font-black text-indigo-900 drop-shadow">
          Resume Scorecard
        </CardTitle>
        <span className="font-semibold text-indigo-700 text-lg">
          {scoreData.Industry}
        </span>
        <Badge variant="secondary" className="mt-1 bg-fuchsia-100 text-fuchsia-700 font-bold text-xs rounded-full px-4 py-1 shadow animate-pulse">
          {scoreData.scoringMode === "resumeOnly"
            ? `Top ${scoreData.percentile}%`
            : "Job Fit Score"}
        </Badge>
      </CardHeader>
      <CardContent className="py-6 px-4 flex flex-col items-center gap-4">
        <div className="text-[56px] font-extrabold text-fuchsia-600 leading-none flex items-center gap-2">
          {scoreData.overallScore}
          <span className="text-xl text-indigo-700 font-bold">/100</span>
        </div>
        <div className="text-sm font-semibold text-indigo-600 -mt-2">
          Overall Resume Score
        </div>
        {completenessWarning && (
          <div className="w-full mt-1 mb-2">
            <div className="text-xs font-semibold text-red-700 bg-red-50 p-3 rounded-md border border-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Critical Issue:</strong> {completenessWarning}
              </span>
            </div>
          </div>
        )}
        {missingOrLowSections.length > 0 && !completenessWarning && (
          <div className="w-full mt-1 mb-2">
            <div className="text-xs font-semibold text-red-700 bg-red-50 p-2 rounded-md border border-red-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <span>
                Missing or underdeveloped sections: {missingOrLowSections.join(", ")}
              </span>
            </div>
          </div>
        )}
        {scoreData.eliteIndicatorsFound && scoreData.eliteIndicatorsFound.length > 0 && (
          <div className="w-full mt-1 mb-2">
            <div className="text-xs font-semibold text-amber-700 bg-amber-50 p-2 rounded-md border border-amber-200">
              Notable achievements detected: {scoreData.eliteIndicatorsFound.join(", ")}
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full mt-2">
          <ScoreMetric
            icon={<Star className="w-4 h-4 text-yellow-500" />}
            label="Skills (25%)"
            value={scoreData.skillsAlignment}
            maxValue={25}
            missing={!scoreData.skillsAlignment || scoreData.skillsAlignment < 10}
          />
          <ScoreMetric
            icon={<TrendingUp className="w-4 h-4 text-blue-500" />}
            label="Experience (25%)"
            value={scoreData.WorkExperience}
            maxValue={25}
            missing={!scoreData.WorkExperience || scoreData.WorkExperience < 10}
          />
          <ScoreMetric
            icon={<Trophy className="w-4 h-4 text-purple-500" />}
            label="Achievements (20%)"
            value={scoreData.Achievements}
            maxValue={20}
            missing={!scoreData.Achievements || scoreData.Achievements < 8}
          />
          <ScoreMetric
            icon={<BookOpen className="w-4 h-4 text-indigo-500" />}
            label="Education (15%)"
            value={scoreData.EducationQuality}
            maxValue={15}
            missing={!scoreData.EducationQuality || scoreData.EducationQuality < 6}
          />
          <ScoreMetric
            icon={<Award className="w-4 h-4 text-green-500" />}
            label="Certifications (10%)"
            value={scoreData.Certifications}
            maxValue={10}
            missing={!scoreData.Certifications || scoreData.Certifications < 4}
          />
          <ScoreMetric
            icon={<BarChart className="w-4 h-4 text-pink-500" />}
            label="Content Structure"
            value={scoreData.ContentStructure}
            maxValue={5}
            missing={!scoreData.ContentStructure || scoreData.ContentStructure < 2}
          />
        </div>
        <div className="my-4 text-indigo-800 text-center">
          <div className="font-semibold text-sm mb-1">Suggested Skills to Add:</div>
          <div className="text-xs font-bold text-fuchsia-700 mb-1">
            {scoreData.suggestedSkills && scoreData.suggestedSkills.length > 0 
              ? scoreData.suggestedSkills.join(", ") 
              : "No additional skills suggested"}
          </div>
        </div>
        <div className="rounded-md text-xs text-gray-600 bg-indigo-50 p-2 font-medium w-full">
          {scoreData.scoringMode === "resumeOnly"
            ? `Benchmarked vs. others in "${scoreData.Industry}" — Top ${scoreData.percentile}%`
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
  maxValue,
  missing = false
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  maxValue: number;
  missing?: boolean;
}) => (
  <div className={`flex items-center gap-1 ${missing ? 'text-red-600' : 'text-indigo-800'}`}>
    <span>{icon}</span>
    <span className="font-medium">{label}:</span>
    <span className={`font-semibold text-[18px] ${missing ? 'text-red-700' : 'text-indigo-900'} ml-1`}>
      {value}
    </span>
    <span className={`text-sm ${missing ? 'text-red-600' : 'text-fuchsia-800'} font-extrabold`}>/{maxValue}</span>
    {missing && <AlertTriangle className="w-3 h-3 text-red-500 ml-1" />}
  </div>
);

export default ResumeScoreCard;
