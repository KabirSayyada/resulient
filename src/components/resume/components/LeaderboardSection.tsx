
import React from "react";
import { ScoreData } from "@/types/resume";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Trophy, Users, Star, TrendingUp } from "lucide-react";
import { generateLeaderboardData, formatNumber, getPercentileDescription } from "@/utils/leaderboardUtils";

interface LeaderboardSectionProps {
  scoreData: ScoreData;
}

export const LeaderboardSection = ({ scoreData }: LeaderboardSectionProps) => {
  const { leaderboard, totalProfessionals, userRank } = generateLeaderboardData(scoreData);
  const percentileDescription = getPercentileDescription(scoreData.percentile);
  const percentileRank = formatNumber(userRank);
  const totalFormatted = formatNumber(totalProfessionals);
  
  return (
    <Card className="border-t-4 border-t-fuchsia-500 shadow-lg mt-6 bg-gradient-to-br from-white via-fuchsia-50 to-indigo-100 animate-fade-in">
      <CardHeader className="pb-2">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <div>
            <CardTitle className="text-xl sm:text-2xl text-indigo-800 flex items-center gap-2">
              <Trophy className="h-6 w-6 text-amber-500" />
              Industry Leaderboard
            </CardTitle>
            <CardDescription className="text-fuchsia-700 font-medium">
              {scoreData.Industry} Industry • {scoreData.percentile}
            </CardDescription>
          </div>
          <div className="bg-indigo-100 rounded-full py-1 px-3 text-sm text-indigo-700 font-medium flex items-center">
            <Users className="h-4 w-4 mr-1 text-indigo-500" />
            <span>{totalFormatted} Professionals</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pb-6">
        <div className="mb-4 bg-white p-4 rounded-lg shadow-inner">
          <div className="text-sm text-indigo-700 mb-2">{percentileDescription}</div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-full bg-indigo-100 h-7 rounded-full overflow-hidden relative">
              <div 
                className="absolute h-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-full flex items-center justify-center text-xs text-white font-bold"
                style={{ 
                  width: `${Math.min(100, Math.max(0, (userRank / totalProfessionals) * 100))}%`,
                  minWidth: "40px"
                }}
              >
                You
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-indigo-500 font-medium">
            <span>Top Performers</span>
            <span>All Professionals</span>
          </div>
        </div>
        
        <div className="overflow-x-auto mb-2">
          <Table className="border rounded-lg overflow-hidden bg-white">
            <TableHeader className="bg-gradient-to-r from-indigo-100 to-fuchsia-100">
              <TableRow>
                <TableHead className="w-16 text-indigo-700">Rank</TableHead>
                <TableHead className="text-indigo-700">Professional</TableHead>
                <TableHead className="text-right text-indigo-700">Score</TableHead>
                <TableHead className="w-32 text-right text-indigo-700">Percentile</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((entry) => (
                <TableRow 
                  key={entry.id}
                  className={
                    entry.isUser 
                      ? "bg-fuchsia-50 animate-pulse-slow border-fuchsia-200 border" 
                      : "hover:bg-indigo-50"
                  }
                >
                  <TableCell className="font-medium">
                    {entry.position <= 3 ? (
                      <div className="flex items-center">
                        <div className={`
                          w-6 h-6 rounded-full flex items-center justify-center text-white
                          ${entry.position === 1 ? 'bg-amber-500' : 
                            entry.position === 2 ? 'bg-slate-400' : 
                            'bg-amber-700'}
                        `}>
                          {entry.position}
                        </div>
                      </div>
                    ) : (
                      entry.position
                    )}
                  </TableCell>
                  <TableCell className={entry.isUser ? "font-bold text-fuchsia-700" : ""}>
                    <div className="flex items-center gap-2">
                      {entry.isUser && <Star className="h-4 w-4 text-amber-500" />}
                      {entry.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className={entry.isUser ? "font-bold text-fuchsia-700" : ""}>
                        {entry.score}
                      </span>
                      <div className="w-20">
                        <Progress 
                          value={entry.score} 
                          className={entry.isUser ? "bg-fuchsia-200" : "bg-indigo-100"} 
                          indicatorClassName={
                            entry.isUser 
                              ? "bg-gradient-to-r from-fuchsia-500 to-indigo-500" 
                              : "bg-indigo-400"
                          }
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`
                      py-1 px-2 rounded-full text-xs inline-block
                      ${entry.isUser 
                        ? 'bg-fuchsia-100 text-fuchsia-700' 
                        : 'bg-indigo-100 text-indigo-700'}
                    `}>
                      {entry.position <= Math.round(totalProfessionals * 0.01) ? 'Top 1%' :
                       entry.position <= Math.round(totalProfessionals * 0.05) ? 'Top 5%' :
                       entry.position <= Math.round(totalProfessionals * 0.1) ? 'Top 10%' :
                       entry.position <= Math.round(totalProfessionals * 0.25) ? 'Top 25%' :
                       entry.position <= Math.round(totalProfessionals * 0.4) ? 'Above Avg' :
                       entry.position <= Math.round(totalProfessionals * 0.6) ? 'Average' :
                       entry.position <= Math.round(totalProfessionals * 0.75) ? 'Below Avg' :
                       'Bottom 25%'}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="mt-4 flex flex-col sm:flex-row gap-3 justify-between">
          <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100 flex-1">
            <div className="text-sm font-semibold text-indigo-700 mb-1 flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              Your Position
            </div>
            <div className="text-2xl font-bold text-fuchsia-600">
              {percentileRank} <span className="text-sm text-indigo-600">of {totalFormatted}</span>
            </div>
          </div>
          
          <div className="bg-white p-3 rounded-lg shadow-sm border border-indigo-100 flex-1">
            <div className="text-sm font-semibold text-indigo-700 mb-1">Next Milestone</div>
            <div className="text-indigo-800">
              {scoreData.percentile === "Top 1%" ? (
                <span className="text-green-600 font-medium">You've reached the top tier! 🏆</span>
              ) : scoreData.percentile === "Top 5%" ? (
                <div>
                  <span className="font-medium">+{Math.round(scoreData.overallScore * 0.05)} points</span>
                  <span className="text-xs text-indigo-600"> to reach Top 1%</span>
                </div>
              ) : scoreData.percentile === "Top 10%" ? (
                <div>
                  <span className="font-medium">+{Math.round(scoreData.overallScore * 0.07)} points</span>
                  <span className="text-xs text-indigo-600"> to reach Top 5%</span>
                </div>
              ) : scoreData.percentile === "Top 25%" ? (
                <div>
                  <span className="font-medium">+{Math.round(scoreData.overallScore * 0.1)} points</span>
                  <span className="text-xs text-indigo-600"> to reach Top 10%</span>
                </div>
              ) : scoreData.percentile === "Above Average" ? (
                <div>
                  <span className="font-medium">+{Math.round(scoreData.overallScore * 0.15)} points</span>
                  <span className="text-xs text-indigo-600"> to reach Top 25%</span>
                </div>
              ) : scoreData.percentile === "Average" ? (
                <div>
                  <span className="font-medium">+{Math.round(scoreData.overallScore * 0.2)} points</span>
                  <span className="text-xs text-indigo-600"> to reach Above Average</span>
                </div>
              ) : (
                <div>
                  <span className="font-medium">+{Math.round(scoreData.overallScore * 0.25)} points</span>
                  <span className="text-xs text-indigo-600"> to reach Average</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
