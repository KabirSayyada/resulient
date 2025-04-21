import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trophy, Star, TrendingUp, List, BarChart, BookOpen, Award, Medal } from "lucide-react";
import { ScoreData } from "@/types/resume";

export const ScoreBreakdown = ({ scoreData }: { scoreData: ScoreData }) => {
  // Helper function to calculate normalized percentage (0-100) for display purposes
  const normalizeScore = (score: number, weight: number) => {
    // Convert score to percentage of its weight
    return Math.min(100, Math.max(0, (score / weight) * 100));
  };

  const getScoreColor = (score: number, weight: number) => {
    const normalizedScore = normalizeScore(score, weight);
    if (normalizedScore >= 80) return "text-green-600";
    if (normalizedScore >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number, weight: number) => {
    const normalizedScore = normalizeScore(score, weight);
    if (normalizedScore >= 80) return "bg-green-500";
    if (normalizedScore >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number, weight: number) => {
    const normalizedScore = normalizeScore(score, weight);
    if (normalizedScore >= 80) return "Excellent";
    if (normalizedScore >= 70) return "Good";
    if (normalizedScore >= 60) return "Average";
    if (normalizedScore >= 40) return "Below Average";
    return "Needs Improvement";
  };

  return (
    <div className="space-y-6 mb-6">
      <div className="flex flex-col sm:flex-row items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border border-blue-100">
        <div className="flex items-center mb-4 sm:mb-0">
          <Trophy className="h-10 w-10 text-blue-500 mr-4" />
          <div>
            <h3 className="text-lg font-medium text-gray-700">Overall Score</h3>
            <div className="flex items-baseline">
              <span className={`text-4xl font-bold ${getScoreColor(scoreData.overallScore, 100)}`}>
                {scoreData.overallScore}
              </span>
              <span className="text-xl ml-1">/100</span>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white px-4 py-2 rounded-md border border-gray-200 text-center">
            <span className="text-sm text-gray-500">Industry: </span>
            <span className="font-medium">{scoreData.Industry}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-md border border-gray-200 mt-2 text-center">
            <span className="text-sm text-gray-500">Standing: </span>
            <span className="font-medium">{scoreData.percentile}</span>
          </div>
        </div>
      </div>

      {scoreData.eliteIndicatorsFound && scoreData.eliteIndicatorsFound.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-yellow-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center mb-3">
              <Medal className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="font-medium text-amber-800">Notable Achievements Detected</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {scoreData.eliteIndicatorsFound.map((indicator, index) => (
                <span key={index} className="bg-amber-100 text-amber-800 px-2 py-1 rounded-md text-sm">
                  {indicator}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="font-medium">Skills Alignment (25%)</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.skillsAlignment, 25)}`}>
                {scoreData.skillsAlignment}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.skillsAlignment, 25)}
              </span>
            </div>
            <Progress 
              value={normalizeScore(scoreData.skillsAlignment, 25)} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.skillsAlignment, 25)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">Work Experience (25%)</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.WorkExperience, 25)}`}>
                {scoreData.WorkExperience}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.WorkExperience, 25)}
              </span>
            </div>
            <Progress 
              value={normalizeScore(scoreData.WorkExperience, 25)} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.WorkExperience, 25)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Trophy className="h-5 w-5 text-purple-500 mr-2" />
              <h3 className="font-medium">Achievements (20%)</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.Achievements, 20)}`}>
                {scoreData.Achievements}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.Achievements, 20)}
              </span>
            </div>
            <Progress 
              value={normalizeScore(scoreData.Achievements, 20)} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.Achievements, 20)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="font-medium">Education Quality (15%)</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.EducationQuality, 15)}`}>
                {scoreData.EducationQuality}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.EducationQuality, 15)}
              </span>
            </div>
            <Progress 
              value={normalizeScore(scoreData.EducationQuality, 15)} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.EducationQuality, 15)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Award className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="font-medium">Certifications (10%)</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.Certifications, 10)}`}>
                {scoreData.Certifications}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.Certifications, 10)}
              </span>
            </div>
            <Progress 
              value={normalizeScore(scoreData.Certifications, 10)} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.Certifications, 10)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <List className="h-5 w-5 text-pink-500 mr-2" />
              <h3 className="font-medium">Content Structure (5%)</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.ContentStructure, 5)}`}>
                {scoreData.ContentStructure}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.ContentStructure, 5)}
              </span>
            </div>
            <Progress 
              value={normalizeScore(scoreData.ContentStructure, 5)} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.ContentStructure, 5)} 
            />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-3">Suggested Skills to Add</h3>
          {scoreData.suggestedSkills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {scoreData.suggestedSkills.map((skill, index) => (
                <span 
                  key={index} 
                  className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No additional skills suggested.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <h3 className="font-medium mb-3">Improvement Tips</h3>
          <ul className="space-y-2">
            {scoreData.improvementTips?.map((tip, index) => (
              <li key={index} className="flex items-start">
                <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                  <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                </div>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
