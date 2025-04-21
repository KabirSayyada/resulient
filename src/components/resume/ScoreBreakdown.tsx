
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trophy, Star, TrendingUp, List, BarChart } from "lucide-react";
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
              <span className={`text-4xl font-bold ${getScoreColor(scoreData.overall)}`}>
                {scoreData.overall}
              </span>
              <span className="text-xl ml-1">/100</span>
            </div>
          </div>
        </div>
        <div>
          <div className="bg-white px-4 py-2 rounded-md border border-gray-200 text-center">
            <span className="text-sm text-gray-500">Industry: </span>
            <span className="font-medium">{scoreData.industry}</span>
          </div>
          <div className="bg-white px-4 py-2 rounded-md border border-gray-200 mt-2 text-center">
            <span className="text-sm text-gray-500">Ranking: </span>
            <span className="font-medium">Top {scoreData.percentile}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <Star className="h-5 w-5 text-amber-500 mr-2" />
              <h3 className="font-medium">Keyword Relevance</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.keywordRelevance)}`}>
                {scoreData.keywordRelevance}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.keywordRelevance)}
              </span>
            </div>
            <Progress 
              value={scoreData.keywordRelevance} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.keywordRelevance)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="font-medium">Skills Breadth</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.skillsBreadth)}`}>
                {scoreData.skillsBreadth}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.skillsBreadth)}
              </span>
            </div>
            <Progress 
              value={scoreData.skillsBreadth} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.skillsBreadth)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <BarChart className="h-5 w-5 text-indigo-500 mr-2" />
              <h3 className="font-medium">Experience Duration</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.experienceDuration)}`}>
                {scoreData.experienceDuration}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.experienceDuration)}
              </span>
            </div>
            <Progress 
              value={scoreData.experienceDuration} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.experienceDuration)} 
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center mb-2">
              <List className="h-5 w-5 text-green-500 mr-2" />
              <h3 className="font-medium">Content Structure</h3>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className={`text-2xl font-bold ${getScoreColor(scoreData.contentStructure)}`}>
                {scoreData.contentStructure}
              </span>
              <span className="text-sm text-gray-500">
                {getScoreLabel(scoreData.contentStructure)}
              </span>
            </div>
            <Progress 
              value={scoreData.contentStructure} 
              className="h-2" 
              indicatorClassName={getProgressColor(scoreData.contentStructure)} 
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
