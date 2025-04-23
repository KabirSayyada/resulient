
import { Award } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScoreHeaderProps {
  industry: string;
  percentile: number;
  scoringMode: "resumeOnly" | "jobDescription";
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  industry,
  percentile,
  scoringMode
}) => {
  // Map percentile number to appropriate text
  const getPercentileText = (value: number): string => {
    if (value <= 1) return "Top 1%";
    if (value <= 5) return "Top 5%";
    if (value <= 10) return "Top 10%";
    if (value <= 25) return "Top 25%";
    if (value <= 50) return "Above Average";
    if (value <= 65) return "Average";
    if (value <= 75) return "Below Average";
    return "Bottom 25%";
  };

  return (
    <CardHeader 
      className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-indigo-400 via-fuchsia-300 to-blue-300 py-6 animate-fade-in"
      style={{ backgroundColor: '#9b87f5' }} // Backup color for PDF export
    >
      <Award className="text-yellow-400 w-12 h-12 drop-shadow-lg mb-1" />
      <CardTitle className="text-2xl font-black text-indigo-900 drop-shadow">
        Resume Scorecard
      </CardTitle>
      <span className="font-semibold text-indigo-700 text-lg">
        {industry}
      </span>
      <Badge variant="secondary" className="mt-1 bg-fuchsia-100 text-fuchsia-700 font-bold text-xs rounded-full px-4 py-1 shadow animate-pulse">
        {scoringMode === "resumeOnly"
          ? getPercentileText(percentile)
          : "Job Fit Score"}
      </Badge>
    </CardHeader>
  );
};
