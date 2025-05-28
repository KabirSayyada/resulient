
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Star, FileText, CheckCircle, TrendingUp } from "lucide-react";

interface AnalysisCardsProps {
  overallScore: number;
  atsScore: number;
  keywordScore: number;
  structureScore: number;
}

export const AnalysisCards = ({ 
  overallScore, 
  atsScore, 
  keywordScore, 
  structureScore 
}: AnalysisCardsProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="mb-3">
        <p className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">
          Analysis for your optimized resume:
        </p>
      </div>
      
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <Star className="h-5 w-5 text-blue-600 mr-2" />
              <h3 className="font-semibold text-blue-900">Overall Score</h3>
            </div>
            <span className="text-xl font-bold text-blue-700">
              {overallScore}%
            </span>
          </div>
          <Progress value={overallScore} className="h-2" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 border-purple-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <FileText className="h-5 w-5 text-purple-600 mr-2" />
              <h3 className="font-semibold text-purple-900">ATS Readiness</h3>
            </div>
            <span className="text-xl font-bold text-purple-700">
              {atsScore}%
            </span>
          </div>
          <Progress value={atsScore} className="h-2" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
              <h3 className="font-semibold text-green-900">Keyword Optimization</h3>
            </div>
            <span className="text-xl font-bold text-green-700">
              {keywordScore}%
            </span>
          </div>
          <Progress value={keywordScore} className="h-2" />
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-200">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <TrendingUp className="h-5 w-5 text-amber-600 mr-2" />
              <h3 className="font-semibold text-amber-900">Content Structure</h3>
            </div>
            <span className="text-xl font-bold text-amber-700">
              {structureScore}%
            </span>
          </div>
          <Progress value={structureScore} className="h-2" />
        </CardContent>
      </Card>
    </div>
  );
};
