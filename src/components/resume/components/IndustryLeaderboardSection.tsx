
import { ScoreData } from "@/types/resume";
import { LeaderboardSection } from "./LeaderboardSection";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateLeaderboardData } from "@/utils/leaderboardUtils";
import { useIsMobile } from "@/hooks/use-mobile";

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
      <Card className="p-4 sm:p-6 bg-white shadow-lg border-t-4 border-t-indigo-500">
        <h2 className="text-xl sm:text-2xl font-bold text-indigo-800 mb-4">Industry Performance Overview</h2>
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
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={isMobile ? 80 : 60} 
                interval={0} 
                tick={{ fontSize: isMobile ? 10 : 12 }}
                tickMargin={isMobile ? 15 : 10}
              />
              <YAxis 
                domain={[0, 100]} 
                width={isMobile ? 30 : 40}
                tick={{ fontSize: isMobile ? 10 : 12 }}
              />
              <Tooltip />
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
