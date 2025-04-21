
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
}) => (
  <CardHeader className="flex flex-col items-center justify-center gap-2 bg-gradient-to-r from-indigo-400 via-fuchsia-300 to-blue-300 py-6 animate-fade-in">
    <Award className="text-yellow-400 w-12 h-12 drop-shadow-lg mb-1" />
    <CardTitle className="text-2xl font-black text-indigo-900 drop-shadow">
      Resume Scorecard
    </CardTitle>
    <span className="font-semibold text-indigo-700 text-lg">
      {industry}
    </span>
    <Badge variant="secondary" className="mt-1 bg-fuchsia-100 text-fuchsia-700 font-bold text-xs rounded-full px-4 py-1 shadow animate-pulse">
      {scoringMode === "resumeOnly"
        ? `Top ${percentile}%`
        : "Job Fit Score"}
    </Badge>
  </CardHeader>
);
