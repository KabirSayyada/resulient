
import { ScoreData } from "@/types/resume";

// Realistic industry size estimates (to make data look convincing)
const INDUSTRY_SIZE_RANGES = {
  "Technology": { min: 120000, max: 180000 },
  "Healthcare": { min: 90000, max: 150000 },
  "Finance": { min: 80000, max: 140000 },
  "Marketing": { min: 70000, max: 130000 },
  "Engineering": { min: 80000, max: 120000 },
  "Education": { min: 60000, max: 100000 },
  "Retail": { min: 70000, max: 110000 },
  "Manufacturing": { min: 60000, max: 90000 },
  "Hospitality": { min: 50000, max: 80000 },
  // Default range for other industries
  "default": { min: 50000, max: 200000 }
};

// Generates a realistic but random total based on industry
export const getIndustryTotalProfessionals = (industry: string): number => {
  const range = INDUSTRY_SIZE_RANGES[industry as keyof typeof INDUSTRY_SIZE_RANGES] || INDUSTRY_SIZE_RANGES.default;
  return Math.floor(range.min + Math.random() * (range.max - range.min));
};

// Converts percentile string to numeric value
export const percentileToNumber = (percentile: string): number => {
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

// Generate a list of professionals for the leaderboard
export const generateLeaderboardData = (scoreData: ScoreData, count: number = 15) => {
  const totalProfessionals = getIndustryTotalProfessionals(scoreData.Industry);
  const userPercentile = percentileToNumber(scoreData.percentile);
  const userRank = Math.max(1, Math.floor(totalProfessionals * (1 - userPercentile / 100)));
  
  // Generate random scores, biased toward the user's industry average
  const generateRandomScore = () => {
    const industryAverage = Math.min(75, Math.max(55, scoreData.overallScore - 15 + Math.random() * 30));
    return Math.max(40, Math.min(98, Math.floor(industryAverage + (Math.random() - 0.5) * 25)));
  };
  
  // Create leaderboard data
  const leaderboard = [];
  
  // How many professionals to show before user's position
  const professionalsBefore = Math.min(Math.floor(count / 2), userRank - 1);
  
  // Add professionals who rank higher than the user
  for (let i = 0; i < professionalsBefore; i++) {
    const position = userRank - professionalsBefore + i;
    leaderboard.push({
      id: `pro-${i}`,
      name: `Professional ${position}`,
      score: Math.max(scoreData.overallScore, generateRandomScore()),
      position,
      isUser: false
    });
  }
  
  // Add the user
  leaderboard.push({
    id: "user",
    name: "You",
    score: scoreData.overallScore,
    position: userRank,
    isUser: true
  });
  
  // How many professionals to show after user's position
  const professionalsAfter = count - professionalsBefore - 1;
  
  // Add professionals who rank lower than the user
  for (let i = 0; i < professionalsAfter; i++) {
    const position = userRank + i + 1;
    if (position <= totalProfessionals) {
      leaderboard.push({
        id: `pro-${professionalsBefore + i}`,
        name: `Professional ${position}`,
        score: Math.min(scoreData.overallScore, generateRandomScore()),
        position,
        isUser: false
      });
    }
  }
  
  return {
    leaderboard,
    totalProfessionals,
    userRank
  };
};

// Format large numbers with commas
export const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Get a description based on percentile
export const getPercentileDescription = (percentile: string): string => {
  switch (percentile) {
    case "Top 1%":
      return "You're among the elite! Only a handful of professionals have resumes this strong.";
    case "Top 5%":
      return "Exceptional resume! You're ahead of 95% of professionals in your industry.";
    case "Top 10%":
      return "Outstanding job! Your resume stands out from 90% of your competition.";
    case "Top 25%":
      return "Great work! Your resume is stronger than 75% of professionals in your field.";
    case "Above Average":
      return "You're ahead of the curve! Your resume is better than most in your industry.";
    case "Average":
      return "You're on par with the industry standard. Some targeted improvements could help you stand out.";
    case "Below Average":
      return "Your resume needs some work to stand out in your industry. Follow our suggestions to improve.";
    case "Bottom 25%":
      return "Your resume needs significant improvement to be competitive. Follow our recommendations closely.";
    default:
      return "Your resume has been evaluated against industry standards.";
  }
};
