
import { AlertTriangle } from "lucide-react";
import React from "react";

interface ScoreMetricProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  maxValue: number;
  missing?: boolean;
}

export const ScoreMetric = ({
  icon,
  label,
  value,
  maxValue,
  missing = false
}: ScoreMetricProps) => (
  <div className={`flex items-center gap-1 ${missing ? 'text-red-600' : 'text-indigo-800'}`}>
    <span>{icon}</span>
    <span className="font-medium">{label}:</span>
    <span className={`font-semibold text-[18px] ${missing ? 'text-red-700' : 'text-indigo-900'} ml-1`}>
      {value}
    </span>
    <span className={`text-sm ${missing ? 'text-red-600' : 'text-fuchsia-800'} font-extrabold`}>/{maxValue}</span>
    {missing && <AlertTriangle className="w-3 h-3 text-red-500 ml-1" />}
  </div>
);
