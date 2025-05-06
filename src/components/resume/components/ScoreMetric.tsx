
import { AlertTriangle, CheckCircle } from "lucide-react";
import React from "react";

interface ScoreMetricProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  maxValue: number;
  missing?: boolean;
  isAtsScore?: boolean; // New prop to identify ATS scores
}

export const ScoreMetric = ({
  icon,
  label,
  value,
  maxValue,
  missing = false,
  isAtsScore = false
}: ScoreMetricProps) => {
  // Calculate if this score is excellent (≥80% of max value)
  // For ATS, scores of 8-10 are considered excellent
  const isExcellent = isAtsScore ? 
    value >= 8 : 
    (value / maxValue) >= 0.8;
  
  // Determine color based on score quality
  const textColor = missing ? 'text-red-600 dark:text-red-400' : 
                    isExcellent ? 'text-green-600 dark:text-green-400' : 
                    (value / maxValue) >= 0.5 ? 'text-indigo-800 dark:text-indigo-300' : 'text-red-600 dark:text-red-400';
  
  // Value text color
  const valueColor = missing ? 'text-red-700 dark:text-red-300' : 
                     isExcellent ? 'text-green-700 dark:text-green-300' : 
                     (value / maxValue) >= 0.5 ? 'text-indigo-900 dark:text-indigo-200' : 'text-red-700 dark:text-red-300';
  
  // Max value text color
  const maxValueColor = missing ? 'text-red-600 dark:text-red-400' : 
                        isExcellent ? 'text-green-600 dark:text-green-400' : 
                        (value / maxValue) >= 0.5 ? 'text-fuchsia-800 dark:text-fuchsia-300' : 'text-red-600 dark:text-red-400';

  return (
    <div className={`flex items-center gap-1 ${textColor}`}>
      <span>{icon}</span>
      <span className="font-medium">{label}:</span>
      <span className={`font-semibold text-[18px] ${valueColor} ml-1`}>
        {value}
      </span>
      <span className={`text-sm ${maxValueColor} font-extrabold`}>/{maxValue}</span>
      {missing && <AlertTriangle className="w-3 h-3 text-red-500 dark:text-red-400 ml-1" />}
      {isExcellent && !missing && <CheckCircle className="w-3 h-3 text-green-500 dark:text-green-400 ml-1" />}
    </div>
  );
};
