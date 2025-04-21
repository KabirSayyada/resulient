
import { useState } from "react";
import { ScoreData } from "@/pages/ResumeScoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScoreBreakdown } from "./ScoreBreakdown";
import { ChevronDown, ChevronUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { ChartContainer } from "@/components/ui/chart";
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

interface ScoreHistoryProps {
  scores: ScoreData[];
}

export const ScoreHistory = ({ scores }: ScoreHistoryProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Prepare data for the chart - last 10 entries only
  const chartData = scores
    .slice(0, 10)
    .map((score, index) => ({
      name: `Score ${scores.length - index}`,
      Overall: score.overall,
      Keywords: score.keywordRelevance,
      Skills: score.skillsBreadth,
      Experience: score.experienceDuration,
      Structure: score.contentStructure,
      date: new Date(score.timestamp).toLocaleDateString()
    }))
    .reverse();

  return (
    <div className="space-y-6">
      <Card className="border-t-4 border-t-indigo-500">
        <CardHeader>
          <CardTitle>Your Progress Over Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
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
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
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
        <h2 className="text-xl font-semibold text-gray-800">Previous Resume Scores</h2>
        
        {scores.map((score, index) => (
          <Card key={score.id || index} className="overflow-hidden">
            <div 
              className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-50"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center">
                <div className="mr-4">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    score.overall >= 80 ? 'bg-green-100 text-green-600' : 
                    score.overall >= 60 ? 'bg-yellow-100 text-yellow-600' : 
                    'bg-red-100 text-red-600'
                  }`}>
                    {score.overall}
                  </div>
                </div>

                <div>
                  <div className="font-medium">
                    Resume Score #{scores.length - index}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {score.timestamp}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="hidden sm:block mr-4">
                  <div className="w-32">
                    <Progress 
                      value={score.overall} 
                      className="h-2" 
                      indicatorClassName={getProgressColor(score.overall)} 
                    />
                  </div>
                </div>
                {expandedIndex === index ? (
                  <ChevronUp className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                )}
              </div>
            </div>

            {expandedIndex === index && (
              <div className="border-t border-gray-200">
                <CardContent className="pt-4">
                  <ScoreBreakdown scoreData={score} />
                </CardContent>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
