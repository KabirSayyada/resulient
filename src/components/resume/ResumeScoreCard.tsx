import { Card, CardContent } from "@/components/ui/card";
import { ScoreData } from "@/types/resume";
import { useAuth } from "@/hooks/useAuth";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Star, Medal, BookOpen, Trophy, TrendingUp, BarChart, Award, Sparkles, Target } from "lucide-react";
import { ScoreMetric } from "./components/ScoreMetric";
import { ResumeWarnings } from "./components/ResumeWarnings";
import { ScoreHeader } from "./components/ScoreHeader";
import { useIsMobile } from "@/hooks/use-mobile";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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

  const shouldShowAvatar =
    !!profile?.avatar_url &&
    typeof profile.avatar_url === "string" &&
    profile.avatar_url.length > 10 &&
    !profile.avatar_url.includes("placeholder") &&
    !profile.avatar_url.endsWith(".svg");

  const getScoreGradient = (score: number) => {
    if (score >= 80) return "from-emerald-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-orange-500";
    return "from-red-500 to-pink-600";
  };

  const getScoreRing = (score: number) => {
    if (score >= 80) return "border-emerald-400";
    if (score >= 60) return "border-yellow-400";
    return "border-red-400";
  };

  return (
    <div className="w-full max-w-xs sm:max-w-md mx-auto relative scorecard-for-export">
      {/* Enhanced Card with Modern Design */}
      <Card className="overflow-hidden bg-gradient-to-br from-white via-blue-50/80 to-indigo-100/60 dark:from-gray-900 dark:via-blue-950/80 dark:to-indigo-950/60 shadow-2xl border-0 relative">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 sm:-top-20 -right-10 sm:-right-20 w-20 sm:w-40 h-20 sm:h-40 bg-gradient-to-br from-blue-200/30 to-purple-200/30 dark:from-blue-800/20 dark:to-purple-800/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-10 sm:-bottom-20 -left-10 sm:-left-20 w-16 sm:w-32 h-16 sm:h-32 bg-gradient-to-tr from-emerald-200/30 to-teal-200/30 dark:from-emerald-800/20 dark:to-teal-800/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Compact Header with Modern Profile Section */}
        <div className="relative z-10 pt-4 sm:pt-8 pb-2 sm:pb-4 px-3 sm:px-6">
          <div className="flex flex-col items-center space-y-2 sm:space-y-4">
            {shouldShowAvatar && (
              <div className="relative">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getScoreGradient(scoreData.overallScore)} p-0.5 sm:p-1 animate-pulse`}>
                  <div className="w-full h-full rounded-full bg-white dark:bg-gray-900"></div>
                </div>
                <Avatar className="pdf-avatar w-12 sm:w-20 h-12 sm:h-20 relative border-2 sm:border-4 border-white dark:border-gray-800 shadow-xl">
                  <AvatarImage
                    src={profile.avatar_url}
                    alt="User avatar"
                    className="object-cover pdf-image"
                    crossOrigin="anonymous"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 text-blue-600 dark:text-blue-300" />
                </Avatar>
              </div>
            )}
            
            <div className="text-center space-y-1 sm:space-y-2">
              <h2 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent break-words px-1">
                {profile?.first_name || "Your Name"}
              </h2>
              {profile?.job_title && (
                <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 shadow-lg text-xs px-1 sm:px-2 py-0.5 sm:py-1">
                  <Target className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                  <span className="truncate max-w-[120px] sm:max-w-none">{profile.job_title}</span>
                </Badge>
              )}
            </div>
          </div>
        </div>

        <ScoreHeader 
          industry={scoreData.Industry}
          percentile={scoreData.percentile}
          scoringMode={scoreData.scoringMode || "resumeOnly"}
        />

        <CardContent className="py-3 sm:py-6 px-3 sm:px-6 relative z-10">
          {/* Compact Score Display */}
          <div className="text-center mb-3 sm:mb-6">
            <div className="relative inline-block">
              <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${getScoreGradient(scoreData.overallScore)} opacity-20 animate-pulse scale-110`}></div>
              <div className={`relative w-20 sm:w-32 h-20 sm:h-32 mx-auto rounded-full border-4 sm:border-8 ${getScoreRing(scoreData.overallScore)} bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 flex items-center justify-center shadow-2xl`}>
                <div className="text-center">
                  <div className={`text-2xl sm:text-4xl font-extrabold bg-gradient-to-r ${getScoreGradient(scoreData.overallScore)} bg-clip-text text-transparent`}>
                    {scoreData.overallScore}
                  </div>
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">/100</div>
                </div>
              </div>
            </div>
            <div className="mt-2 sm:mt-4">
              <h3 className="text-sm sm:text-lg font-bold text-gray-800 dark:text-gray-200">Overall Resume Score</h3>
              <Badge className={`mt-1 sm:mt-2 bg-gradient-to-r ${getScoreGradient(scoreData.overallScore)} text-white border-0 shadow-lg text-xs px-2 py-1`}>
                <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 mr-1 animate-pulse" />
                <span className="truncate">{scoreData.percentile}</span>
              </Badge>
            </div>
          </div>

          <ResumeWarnings
            completenessWarning={completenessWarning}
            missingOrLowSections={missingOrLowSections}
            eliteIndicators={scoreData.eliteIndicatorsFound}
          />

          {/* Compact Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-4 mt-3 sm:mt-6">
            <ScoreMetric
              icon={<Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />}
              label="Skills"
              value={scoreData.skillsAlignment}
              maxValue={25}
              missing={!scoreData.skillsAlignment || scoreData.skillsAlignment < 10}
            />
            <ScoreMetric
              icon={<TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />}
              label="Experience"
              value={scoreData.WorkExperience}
              maxValue={25}
              missing={!scoreData.WorkExperience || scoreData.WorkExperience < 10}
            />
            <ScoreMetric
              icon={<Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />}
              label="Achievements"
              value={scoreData.Achievements}
              maxValue={20}
              missing={!scoreData.Achievements || scoreData.Achievements < 8}
            />
            <ScoreMetric
              icon={<BookOpen className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-500" />}
              label="Education"
              value={scoreData.EducationQuality}
              maxValue={15}
              missing={!scoreData.EducationQuality || scoreData.EducationQuality < 6}
            />
            <ScoreMetric
              icon={<Medal className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />}
              label="Certifications"
              value={scoreData.Certifications}
              maxValue={10}
              missing={!scoreData.Certifications || scoreData.Certifications < 4}
            />
            <ScoreMetric
              icon={<BarChart className="w-3 h-3 sm:w-4 sm:h-4 text-pink-500" />}
              label="Structure"
              value={scoreData.ContentStructure}
              maxValue={5}
              missing={!scoreData.ContentStructure || scoreData.ContentStructure < 2}
            />
          </div>

          {/* Compact Skills Section */}
          <div className="mt-3 sm:mt-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/50 dark:to-purple-950/50 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-blue-100 dark:border-blue-800">
              <div className="flex items-center gap-1 sm:gap-2 mb-1 sm:mb-3">
                <Award className="h-3 w-3 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
                <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-xs sm:text-base">Suggested Skills</h4>
              </div>
              <div className="text-xs sm:text-sm font-medium text-blue-700 dark:text-blue-300 pdf-skills-text leading-relaxed break-words">
                {scoreData.suggestedSkills && scoreData.suggestedSkills.length > 0 
                  ? scoreData.suggestedSkills.join(", ") 
                  : "No additional skills suggested"}
              </div>
            </div>
          </div>

          {/* Compact Footer */}
          <div className="mt-3 sm:mt-6 space-y-2 sm:space-y-3">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/50 rounded-lg p-2 sm:p-3 text-center border border-gray-200 dark:border-gray-700">
              <div className="text-xs font-medium text-gray-700 dark:text-gray-300 break-words px-1">
                {scoreData.scoringMode === "resumeOnly"
                  ? `Benchmarked vs. others in "${scoreData.Industry}" — ${scoreData.percentile}`
                  : "Compared against your target job description"}
              </div>
            </div>

            <div className="text-center">
              <div className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                Generated on {scoreData.timestamp}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-1 px-2 break-words">
                Share your progress and help others improve their resumes!
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeScoreCard;
