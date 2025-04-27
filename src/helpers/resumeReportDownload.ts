
import { ScoreData } from "@/types/resume";
import { handleDownloadTextReport } from "@/utils/reportGenerationUtils";
import { generateLeaderboardData } from "@/utils/leaderboardUtils";

export function handleDownloadReport(scoreData: ScoreData) {
  // Get leaderboard data for the report
  const leaderboardData = generateLeaderboardData(scoreData);
  
  // Add leaderboard data to the report
  const enrichedScoreData = {
    ...scoreData,
    leaderboardData
  };
  
  handleDownloadTextReport(enrichedScoreData);
}
