import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trophy, Star, TrendingUp, List, BarChart, BookOpen, Award, Medal } from "lucide-react";
import { ScoreData } from "@/pages/ResumeScoring";

interface ScoreBreakdownProps {
  scoreData: ScoreData;
}

export const ScoreBreakdown = ({ scoreData }: ScoreBreakdownProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    if (score >= 40) return "Below Average";
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
              <span className={`text-4xl font-bold ${getScoreColor(scoreData.overallScore)}`}>
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
            <span className="text-sm text-gray-500">Ranking: </span>
            <span className="font-medium">Top {scoreData.percentile}%</span>
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
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.skillsAlignment)}`}>
                {scoreData.skillsAlignment}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.skillsAlignment)}
              </span>
            </div>
            <Progress 
              value={scoreData.skillsAlignment} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.skillsAlignment)} 
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
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.WorkExperience)}`}>
                {scoreData.WorkExperience}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.WorkExperience)}
              </span>
            </div>
            <Progress 
              value={scoreData.WorkExperience} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.WorkExperience)} 
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
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.Achievements)}`}>
                {scoreData.Achievements}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.Achievements)}
              </span>
            </div>
            <Progress 
              value={scoreData.Achievements} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.Achievements)} 
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
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.EducationQuality)}`}>
                {scoreData.EducationQuality}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.EducationQuality)}
              </span>
            </div>
            <Progress 
              value={scoreData.EducationQuality} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.EducationQuality)} 
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
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.Certifications)}`}>
                {scoreData.Certifications}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.Certifications)}
              </span>
            </div>
            <Progress 
              value={scoreData.Certifications} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.Certifications)} 
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
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.ContentStructure)}`}>
                {scoreData.ContentStructure}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.ContentStructure)}
              </span>
            </div>
            <Progress 
              value={scoreData.ContentStructure} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.ContentStructure)} 
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <BarChart className="h-5 w-5 text-cyan-500 mr-2" />
              <h3 className="font-medium">ATS Compatibility</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.atsReadiness)}`}>
                {scoreData.atsReadiness}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.atsReadiness)}
              </span>
            </div>
            <Progress 
              value={scoreData.atsReadiness} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.atsReadiness)} 
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
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              </div>
              <span>Add the suggested skills to your resume if you have experience with them</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              </div>
              <span>Use more keywords from the job description</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              </div>
              <span>Quantify your achievements with specific metrics</span>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 rounded-full p-1 mr-2 mt-0.5">
                <span className="block h-1.5 w-1.5 rounded-full bg-blue-600"></span>
              </div>
              <span>Improve your content structure with clear sections and bullet points</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};
