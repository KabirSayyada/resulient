
import React from 'react';
import { Card } from "@/components/ui/card";
import { MainNavigation } from "@/components/resume/MainNavigation";
import { LeaderboardSection } from "@/components/resume/components/LeaderboardSection";
import { BenchmarkGraph } from "@/components/resume/BenchmarkGraph";
import { useLocation } from 'react-router-dom';

const IndustryLeaderboard = () => {
  const location = useLocation();
  const scoreData = location.state?.scoreData;

  if (!scoreData) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <MainNavigation />
          <Card className="mt-8 p-6 text-center">
            <h2 className="text-xl font-semibold text-indigo-700 mb-4">No Leaderboard Data Available</h2>
            <p className="text-gray-600">
              Score your resume first to see how you rank against other professionals in your industry.
            </p>
          </Card>
        </div>
      </div>
    );
  }

  const percentileToNumber = (percentile: string): number => {
    switch (percentile) {
      case "Top 1%": return 99;
      case "Top 5%": return 95;
      case "Top 10%": return 90;
      case "Top 25%": return 75;
      case "Above Average": return 65;
      case "Average": return 50;
      case "Below Average": return 35;
      case "Bottom 25%": return 25;
      default: return 50;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <MainNavigation />
        
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">Industry Leaderboard</h1>
          <p className="text-gray-600">
            See how you rank among professionals in {scoreData.Industry}
          </p>
        </div>

        <BenchmarkGraph 
          percentile={percentileToNumber(scoreData.percentile)} 
          numSimilar={scoreData.numSimilarResumes} 
        />
        
        <LeaderboardSection scoreData={scoreData} />
      </div>
    </div>
  );
};

export default IndustryLeaderboard;
