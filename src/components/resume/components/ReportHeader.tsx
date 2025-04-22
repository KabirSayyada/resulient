
import React from 'react';

interface ReportHeaderProps {
  date: string;
  time: string;
  overallScore: number;
}

export const ReportHeader = ({ date, time, overallScore }: ReportHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-indigo-800 mb-2">Resume Optimization Report</h1>
      <p className="text-gray-600 mb-3">
        Generated on {date} at {time}
      </p>
      <div className="inline-block bg-indigo-50 px-4 py-2 rounded-full text-indigo-700 font-semibold">
        Overall Score: {overallScore}/100
      </div>
    </div>
  );
};
