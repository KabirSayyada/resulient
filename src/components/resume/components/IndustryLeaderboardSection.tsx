
import { ScoreData } from "@/types/resume";
import { LeaderboardSection } from "./LeaderboardSection";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateLeaderboardData } from "@/utils/leaderboardUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface IndustryLeaderboardSectionProps {
  scoreData: ScoreData;
}

export const IndustryLeaderboardSection = ({ scoreData }: IndustryLeaderboardSectionProps) => {
  const { leaderboard } = generateLeaderboardData(scoreData);
  const isMobile = useIsMobile();
  
  // Transform leaderboard data for the chart
  const chartData = leaderboard.map(entry => ({
    name: entry.isUser ? "You" : `Rank ${entry.position}`,
    score: entry.score,
    isUser: entry.isUser
  }));

  return (
    <div className="space-y-6 mt-6">
      {isMobile && (
        <Alert variant="default" className="bg-blue-50 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 mb-4 border-blue-200 dark:border-blue-700">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Charts display better on desktop devices. For the best experience viewing these charts, consider using a larger screen.
          </AlertDescription>
        </Alert>
      )}
      
      <Card className="p-4 sm:p-6 bg-white dark:bg-gray-800 shadow-lg border-t-4 border-t-indigo-500">
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 dark:text-indigo-200 mb-4">Industry Performance Overview</h2>
        <div className="h-[300px] sm:h-[400px] w-full">
          <ChartContainer
            config={{
              score: {
                color: "#818cf8",
                label: "Score",
              },
              userScore: {
                color: "#e879f9",
                label: "Your Score",
              },
            }}
          >
            <BarChart 
              data={chartData} 
              margin={isMobile ? 
                { top: 20, right: 10, left: 0, bottom: 70 } :
                { top: 20, right: 30, left: 20, bottom: 60 }
              }
            >
              <CartesianGrid strokeDasharray="3 3" className="dark:stroke-gray-700" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={isMobile ? 80 : 60} 
                interval={0} 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={isMobile ? 15 : 10}
                className="dark:fill-gray-300"
              />
              <YAxis 
                domain={[0, 100]} 
                width={isMobile ? 30 : 40}
                tick={{ fontSize: isMobile ? 10 : 12 }}
                className="dark:fill-gray-300"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
              <Bar 
                dataKey="score" 
                fill="#818cf8" 
                radius={[4, 4, 0, 0]}
                maxBarSize={isMobile ? 25 : 60}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.isUser ? "#e879f9" : "#818cf8"} />
                ))}
              </Bar>
            </BarChart>
          </ChartContainer>
        </div>
      </Card>

      <LeaderboardSection scoreData={scoreData} />
    </div>
  );
};
