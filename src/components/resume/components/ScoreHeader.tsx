
import { Award } from "lucide-react";
import { CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSubscription } from "@/hooks/useSubscription";
import { SubscriptionTierIndicator } from "@/components/subscription/SubscriptionTierIndicator";

interface ScoreHeaderProps {
  industry: string;
  percentile: number | string;
  scoringMode: "resumeOnly" | "jobDescription";
}

export const ScoreHeader: React.FC<ScoreHeaderProps> = ({
  industry,
  percentile,
  scoringMode
}) => {
  const { subscription } = useSubscription();

  // Map percentile number to appropriate text
  const getPercentileText = (value: number): string => {
    if (value >= 99) return "Top 1%";
    if (value >= 95) return "Top 5%";
    if (value >= 90) return "Top 10%";
    if (value >= 75) return "Top 25%";
    if (value >= 65) return "Above Average";
    if (value >= 50) return "Average";
    if (value >= 30) return "Below Average";
    return "Bottom 25%";
  };

  // Display the percentile text directly if it's a string, or calculate it if it's a number
  const displayPercentile = (percentile: number | string): string => {
    if (typeof percentile === 'string') {
      return percentile;
    }
    return getPercentileText(percentile);
  };

  const getBgGradient = () => {
    if (subscription.tier === "platinum") {
      return "from-slate-600 via-gray-700 to-slate-800";
    } else if (subscription.tier === "premium") {
      return "from-slate-600 via-gray-700 to-slate-800";
    }
    return "from-slate-600 via-gray-700 to-slate-800";
  };

  return (
    <CardHeader 
      className={`pdf-header flex flex-col items-center justify-center gap-2 bg-gradient-to-r ${getBgGradient()} py-6 animate-fade-in`}
      style={{ backgroundColor: '#64748b' }} // Modern slate backup color for PDF export
    >
      <div className="flex items-center gap-2">
        <Award className="text-yellow-400 w-12 h-12 drop-shadow-lg" />
        {subscription.tier !== "free" && (
          <SubscriptionTierIndicator variant="badge" size="lg" showTooltip={false} />
        )}
      </div>
      <CardTitle className="text-2xl font-black text-white drop-shadow">
        Resume Scorecard
      </CardTitle>
      <span className="font-semibold text-slate-200 text-lg">
        {industry}
      </span>
      <Badge variant="secondary" className="mt-1 bg-white/90 text-slate-700 font-bold text-xs rounded-full px-4 py-1 shadow animate-pulse">
        {scoringMode === "resumeOnly"
          ? displayPercentile(percentile)
          : "Job Fit Score"}
      </Badge>
    </CardHeader>
  );
};
