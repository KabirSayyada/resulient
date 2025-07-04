
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";

interface ScoreMetricProps {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  maxValue: number;
  missing?: boolean;
}

export const ScoreMetric = ({ icon, label, value, maxValue, missing }: ScoreMetricProps) => {
  const normalizedScore = value ? Math.min(100, Math.max(0, (value / maxValue) * 100)) : 0;
  const displayValue = value || 0;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBg = (score: number) => {
    if (score >= 80) return "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800";
    if (score >= 60) return "bg-yellow-50 border-yellow-200 dark:bg-yellow-950/20 dark:border-yellow-800";
    return "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800";
  };

  return (
    <Card className={`${getScoreBg(normalizedScore)} border shadow-sm hover:shadow-md transition-all duration-300`}>
      <CardContent className="p-2 sm:p-3 text-center">
        <div className="flex items-center justify-center mb-1 sm:mb-2">
          {icon}
        </div>
        <div className={`text-lg sm:text-2xl font-bold ${getScoreColor(normalizedScore)} mb-0.5 sm:mb-1`}>
          {displayValue}
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 mb-1 sm:mb-2">/{maxValue}</div>
        <h3 className="font-semibold text-gray-800 dark:text-gray-200 text-xs break-words leading-tight">
          {label}
        </h3>
        {missing && (
          <div className="text-xs text-red-600 dark:text-red-400 mt-1 font-medium">
            Missing
          </div>
        )}
      </CardContent>
    </Card>
  );
};
