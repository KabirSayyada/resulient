import { useState } from "react";
import { ScoreData } from "@/types/resume";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { ChevronDown, ChevronUp, Calendar, ArrowLeft, ArrowRight, GitCompare, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChartContainer } from "@/components/ui/chart";
import { CompareResumes } from "./CompareResumes";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ScoreHistoryProps {
  scores: ScoreData[];
}

export const ScoreHistory = ({ scores }: ScoreHistoryProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [compareOpen, setCompareOpen] = useState(false);
  const [selectedScores, setSelectedScores] = useState<ScoreData[]>([]);
  const isMobile = useIsMobile();

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const toggleScoreSelection = (score: ScoreData) => {
    if (selectedScores.find(s => s.id === score.id)) {
      setSelectedScores(selectedScores.filter(s => s.id !== score.id));
    } else {
      // Only allow two scores at a time
      if (selectedScores.length >= 2) {
        setSelectedScores([selectedScores[1], score]);
        toast({
          title: "Selection Updated",
          description: "You can only compare two scores at a time.",
        });
      } else {
        setSelectedScores([...selectedScores, score]);
      }
    }
  };

  const handleCompare = () => {
    if (selectedScores.length === 2) {
      setCompareOpen(true);
    } else if (selectedScores.length === 1) {
      // If only one score is selected, automatically select the most recent other score
      const otherScores = scores.filter(s => s.id !== selectedScores[0].id);
      if (otherScores.length > 0) {
        setSelectedScores([selectedScores[0], otherScores[0]]);
        setCompareOpen(true);
      }
    } else {
      // If no scores selected, select the two most recent scores
      if (scores.length >= 2) {
        setSelectedScores([scores[0], scores[1]]);
        setCompareOpen(true);
      }
    }
  };

  // Prepare data for the chart - last 10 entries only
  const chartData = scores
    .slice(0, 10)
    .map((score, index) => ({
      name: `Score ${scores.length - index}`,
      Overall: score.overallScore,
      Keywords: score.keywordRelevance,
      Skills: score.skillsAlignment,
      Experience: score.WorkExperience,
      Structure: score.ContentStructure,
      date: new Date(score.timestamp).toLocaleDateString()
    }))
    .reverse();

  return (
    <div className="space-y-8">
      {isMobile && (
        <Alert variant="default" className="bg-blue-50 text-blue-800 dark:bg-blue-900 dark:text-blue-200 mb-4 border-blue-200 dark:border-blue-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            For the best experience viewing these charts, consider using a desktop device which provides a more detailed visualization.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="border-t-4 border-t-indigo-500 shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Progress Over Time</CardTitle>
          {scores.length >= 2 && (
            <Button 
              onClick={handleCompare} 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-2 animate-fade-in"
            >
              <GitCompare className="h-4 w-4" />
              <span>Compare Scores</span>
            </Button>
          )}
        </CardHeader>
        <CardContent className="p-4">
          <div className="h-[300px] sm:h-[350px] md:h-[380px] w-full">
            <ChartContainer 
              config={{
                overall: { label: "Overall", color: "#4f46e5" },
                keywords: { label: "Keywords", color: "#f59e0b" },
                skills: { label: "Skills", color: "#10b981" },
                experience: { label: "Experience", color: "#3b82f6" },
                structure: { label: "Structure", color: "#8b5cf6" }
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={chartData}
                  margin={{ top: 20, right: 20, left: 0, bottom: 40 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="date" 
                    padding={{ left: 10, right: 10 }}
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    padding={{ top: 20, bottom: 20 }}
                    tick={{ fontSize: 12 }}
                    width={35}
                  />
                  <Tooltip 
                    contentStyle={{ fontSize: 12 }} 
                    wrapperStyle={{ zIndex: 10 }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: 20, fontSize: 12 }} 
                    verticalAlign="bottom" 
                    height={36}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="Overall" 
                    stroke="#4f46e5" 
                    strokeWidth={2} 
                    dot={{ r: 4 }} 
                    activeDot={{ r: 6 }}
                  />
                  <Line type="monotone" dataKey="Keywords" stroke="#f59e0b" />
                  <Line type="monotone" dataKey="Skills" stroke="#10b981" />
                  <Line type="monotone" dataKey="Experience" stroke="#3b82f6" />
                  <Line type="monotone" dataKey="Structure" stroke="#8b5cf6" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Previous Resume Scores</h2>
          {selectedScores.length > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {selectedScores.length} selected
              </span>
              <Button 
                onClick={handleCompare} 
                size="sm" 
                variant="outline"
                disabled={selectedScores.length < 1}
                className="flex items-center gap-1 animate-fade-in"
              >
                Compare Selected
              </Button>
            </div>
          )}
        </div>
        
        {scores.map((score, index) => (
          <Card 
            key={score.id || index} 
            className={`overflow-hidden transition-all duration-300 ${
              selectedScores.find(s => s.id === score.id) 
                ? 'border-l-4 border-l-indigo-500 shadow-md' 
                : 'hover:border-l-2 hover:border-l-indigo-200 dark:hover:border-l-indigo-800'
            }`}
          >
            <div 
              className={`p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center hover:bg-gray-50 dark:hover:bg-gray-800 gap-2 transition-all duration-200 ${
                selectedScores.find(s => s.id === score.id) 
                  ? 'bg-indigo-50 dark:bg-indigo-900/20' 
                  : ''
              }`}
            >
              <div 
                className="flex items-center w-full sm:w-auto cursor-pointer"
                onClick={() => toggleScoreSelection(score)}
              >
                <div className="mr-4 flex-shrink-0">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                    score.overallScore >= 80 ? 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400' : 
                    score.overallScore >= 60 ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400' : 
                    'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400'
                  }`}>
                    {score.overallScore}
                  </div>
                </div>

                <div className="flex-grow min-w-0">
                  <div className="font-medium truncate">
                    Resume Score #{scores.length - index}
                  </div>
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{score.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0 gap-3">
                <div className="w-full sm:w-32 mr-2">
                  <Progress 
                    value={score.overallScore} 
                    className="h-2" 
                    indicatorClassName={getProgressColor(score.overallScore)} 
                  />
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => toggleExpand(index)}
                  className="p-0 h-8 w-8 rounded-full transition-transform duration-200"
                >
                  {expandedIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-400" />
                  )}
                </Button>
              </div>
            </div>

            {expandedIndex === index && (
              <div className="border-t border-gray-200 dark:border-gray-700 animate-fade-in">
                <CardContent className="pt-4 overflow-x-auto">
                  <ScoreBreakdown scoreData={score} />
                </CardContent>
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Compare Resume Dialog */}
      <CompareResumes 
        open={compareOpen} 
        onOpenChange={setCompareOpen} 
        scores={scores}
        preSelectedScores={selectedScores.length === 2 ? [selectedScores[0].id, selectedScores[1].id] : undefined}
      />
    </div>
  );
};
