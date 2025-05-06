
import { Card, CardContent } from "@/components/ui/card";
import { ScoreData } from "@/types/resume";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Star, Medal, BookOpen, Trophy, TrendingUp, BarChart, Image } from "lucide-react";
import { ScoreMetric } from "./components/ScoreMetric";
import { ResumeWarnings } from "./components/ResumeWarnings";
import { ScoreHeader } from "./components/ScoreHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ResumeScoreCardProps {
  scoreData: ScoreData;
}

export const ResumeScoreCard = ({ scoreData }: ResumeScoreCardProps) => {
  const { user } = useAuth();
  const { profile } = useUserProfile(user?.id);
  const isMobile = useIsMobile();

  const normalizeScore = (score: number, weight: number) => {
    return Math.min(100, Math.max(0, (score / weight) * 100));
  };

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

  let sectionCount = 0;
  if (scoreData.skillsAlignment && scoreData.skillsAlignment > 0) sectionCount++;
  if (scoreData.WorkExperience && scoreData.WorkExperience > 0) sectionCount++;
  if (scoreData.Achievements && scoreData.Achievements > 0) sectionCount++;
  if (scoreData.EducationQuality && scoreData.EducationQuality > 0) sectionCount++;
  if (scoreData.Certifications && scoreData.Certifications > 0) sectionCount++;

  let completenessWarning = null;
  if (sectionCount === 0) {
    completenessWarning = "Your resume appears empty. Please add content to receive an accurate score.";
  } else if (sectionCount === 1) {
    completenessWarning = "Your resume has only one section. A complete resume should include skills, experience, education, and achievements.";
  } else if (sectionCount <= 2) {
    completenessWarning = "Your resume is missing multiple important sections. A complete resume needs skills, experience, education, and achievements.";
  }

  const getPercentileNumeric = (percentile: string): number => {
    switch(percentile) {
      case "Top 1%": return 1;
      case "Top 5%": return 5;
      case "Top 10%": return 10;
      case "Top 25%": return 25;
      case "Above Average": return 50;
      case "Average": return 65;
      case "Below Average": return 75;
      case "Bottom 25%": return 90;
      default: return 50;
    }
  };

  // Only show avatar if the profile avatar_url exists and is a valid user-uploaded photo
  // (we treat long base64 or uploaded URL as valid; ignore placeholder or empty string)
  const shouldShowAvatar =
    !!profile?.avatar_url &&
    typeof profile.avatar_url === "string" &&
    profile.avatar_url.length > 10 &&
    !profile.avatar_url.includes("placeholder") &&
    !profile.avatar_url.endsWith(".svg");

  return (
    <div className="w-full max-w-md mx-auto shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-white via-indigo-50 to-blue-100 p-0 border-4 border-indigo-200 relative scorecard-for-export">
      <div className="profile-header flex flex-col items-center pt-8 pb-2 bg-gradient-to-r from-indigo-100 to-blue-100 border-b border-indigo-200 relative"
           style={{ backgroundColor: '#9b87f5' }}>
        {/* Only show the avatar if the user actually uploaded one */}
        {shouldShowAvatar && (
          <Avatar className="pdf-avatar w-20 h-20 relative border-4 border-fuchsia-300 shadow-xl mb-2">
            <AvatarImage
              src={profile.avatar_url}
              alt="User avatar"
              className="object-cover pdf-image"
              crossOrigin="anonymous"
            />
            <AvatarFallback className="bg-indigo-50 text-indigo-300" />
          </Avatar>
        )}
        <div className="text-xl font-bold text-indigo-900 drop-shadow-sm">
          {profile?.first_name || "Your Name"}
        </div>
        {profile?.job_title && (
          <div className="text-sm text-indigo-700 font-medium">{profile.job_title}</div>
        )}
      </div>
      <ScoreHeader 
        industry={scoreData.Industry}
        percentile={scoreData.percentile}
        scoringMode={scoreData.scoringMode || "resumeOnly"}
      />
      <CardContent className="py-6 px-4 flex flex-col items-center gap-4">
        <div className="text-[56px] font-extrabold text-fuchsia-600 leading-none flex items-center gap-2">
          {scoreData.overallScore}
          <span className="text-xl text-indigo-700 font-bold">/100</span>
        </div>
        <div className="text-sm font-semibold text-indigo-600 -mt-2">
          Overall Resume Score
        </div>

        <ResumeWarnings
          completenessWarning={completenessWarning}
          missingOrLowSections={missingOrLowSections}
          eliteIndicators={scoreData.eliteIndicatorsFound}
        />

        <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-x-8 gap-y-2 w-full mt-2`}>
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
            icon={<Medal className="w-4 h-4 text-green-500" />}
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

        <div className="my-4 text-indigo-800 text-center w-full">
          <div className="font-semibold text-sm mb-1">Suggested Skills to Add:</div>
          <div className="text-xs font-bold text-fuchsia-700 mb-1 px-2 w-full pdf-skills-text"
               style={{ whiteSpace: 'normal', wordBreak: 'break-word', overflowWrap: 'break-word' }}>
            {scoreData.suggestedSkills && scoreData.suggestedSkills.length > 0 
              ? scoreData.suggestedSkills.join(", ") 
              : "No additional skills suggested"}
          </div>
        </div>

        <div className="rounded-md text-xs text-gray-600 bg-indigo-50 p-2 font-medium w-full text-center">
          {scoreData.scoringMode === "resumeOnly"
            ? `Benchmarked vs. others in "${scoreData.Industry}" — ${scoreData.percentile}`
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

export default ResumeScoreCard;
