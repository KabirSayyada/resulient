
import { ScoreData } from "@/types/resume";
import { LeaderboardSection } from "./LeaderboardSection";
import { Card } from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateLeaderboardData } from "@/utils/leaderboardUtils";
import { useIsMobile } from "@/hooks/use-mobile";
import { AlertCircle, TrendingUp, BarChart3, Award, Target } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

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
    <div className="space-y-8 mt-6">
      {isMobile && (
        <Alert variant="default" className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 text-blue-800 dark:text-blue-200 mb-6 border-2 border-blue-200 dark:border-blue-700 shadow-lg rounded-xl backdrop-blur-sm">
          <AlertCircle className="h-5 w-5" />
          <AlertDescription className="text-base font-medium">
            📱 Charts display better on desktop devices. For the best experience viewing these analytics, consider using a larger screen.
          </AlertDescription>
        </Alert>
      )}
      
      {/* Enhanced Performance Overview Card */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-white/90 via-blue-50/60 to-indigo-50/90 dark:from-gray-900/90 dark:via-blue-950/60 dark:to-indigo-950/90 shadow-2xl border-2 border-indigo-200/60 dark:border-indigo-800/60 hover:shadow-3xl transition-all duration-500 backdrop-blur-sm">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200/20 to-purple-200/20 dark:from-indigo-800/10 dark:to-purple-800/10 rounded-full -translate-y-20 translate-x-20 blur-2xl animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-emerald-200/20 to-teal-200/20 dark:from-emerald-800/10 dark:to-teal-800/10 rounded-full translate-y-16 -translate-x-16 blur-2xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 p-6 sm:p-8">
          {/* Enhanced Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Industry Performance Overview
                </h2>
                <p className="text-indigo-600 dark:text-indigo-400 font-medium mt-1">
                  See how you rank against {scoreData.numSimilarResumes?.toLocaleString()} professionals
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg px-4 py-2 font-semibold">
                <Award className="h-4 w-4 mr-2" />
                {scoreData.percentile}
              </Badge>
              <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg px-4 py-2 font-semibold">
                <Target className="h-4 w-4 mr-2" />
                {scoreData.Industry}
              </Badge>
            </div>
          </div>

          {/* Enhanced Chart Container */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-gray-50/80 dark:from-gray-800/80 dark:to-gray-900/80 rounded-2xl shadow-inner"></div>
            <div className="relative z-10 h-[350px] sm:h-[450px] w-full p-4 rounded-2xl">
              <ChartContainer
                config={{
                  score: {
                    color: "#6366f1",
                    label: "Score",
                  },
                  userScore: {
                    color: "#10b981",
                    label: "Your Score",
                  },
                }}
              >
                <BarChart 
                  data={chartData} 
                  margin={isMobile ? 
                    { top: 20, right: 15, left: 5, bottom: 80 } :
                    { top: 30, right: 30, left: 20, bottom: 70 }
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30 dark:stroke-gray-600" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={isMobile ? 90 : 70} 
                    interval={0} 
                    tick={{ fontSize: isMobile ? 11 : 13, fontWeight: '500' }}
                    tickMargin={isMobile ? 20 : 15}
                    className="dark:fill-gray-300"
                  />
                  <YAxis 
                    domain={[0, 100]} 
                    width={isMobile ? 35 : 45}
                    tick={{ fontSize: isMobile ? 11 : 13, fontWeight: '500' }}
                    className="dark:fill-gray-300"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      backdropFilter: 'blur(10px)',
                      borderColor: 'rgba(99, 102, 241, 0.3)',
                      borderRadius: '12px',
                      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                      color: '#1f2937',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                    labelStyle={{ fontWeight: '600', color: '#4f46e5' }}
                  />
                  <Bar 
                    dataKey="score" 
                    fill="#6366f1" 
                    radius={[6, 6, 0, 0]}
                    maxBarSize={isMobile ? 30 : 65}
                  >
                    {chartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.isUser ? 
                          "url(#userGradient)" : 
                          "url(#defaultGradient)"
                        } 
                      />
                    ))}
                  </Bar>
                  <defs>
                    <linearGradient id="userGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={0.9}/>
                      <stop offset="100%" stopColor="#059669" stopOpacity={0.7}/>
                    </linearGradient>
                    <linearGradient id="defaultGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity={0.6}/>
                    </linearGradient>
                  </defs>
                </BarChart>
              </ChartContainer>
            </div>
          </div>
        </div>
      </Card>

      <LeaderboardSection scoreData={scoreData} />
    </div>
  );
};
