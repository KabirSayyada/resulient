
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { QualificationGap } from "@/types/resume";
import { AlertTriangle, FileText, Target, CheckCircle, XCircle, Sparkles, TrendingUp } from "lucide-react";

interface OptimizedResumeDisplayProps {
  optimizedResume: string;
  jobDescription: string;
  originalResume: string;
  qualificationGaps: QualificationGap[];
}

export const OptimizedResumeDisplay = ({ 
  optimizedResume, 
  jobDescription, 
  originalResume,
  qualificationGaps 
}: OptimizedResumeDisplayProps) => {
  const [activeTab, setActiveTab] = useState("optimized");

  return (
    <div className="space-y-2 sm:space-y-4">
      {/* Enhanced Header */}
      <div className="text-center space-y-1 sm:space-y-3">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          <div className="p-1 sm:p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg">
            <Sparkles className="h-3 w-3 sm:h-5 sm:w-5 text-white" />
          </div>
          <h1 className="text-base sm:text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent break-words">
            Resume Optimization Complete
          </h1>
        </div>
        <p className="text-xs sm:text-base text-gray-600 dark:text-gray-400 px-2">
          Your resume has been optimized for the target position
        </p>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
        <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border-2 border-emerald-200 dark:border-emerald-800">
          <CardContent className="p-2 sm:p-4 text-center">
            <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-emerald-600 mx-auto mb-1" />
            <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm mb-1">
              Optimization Success
            </h3>
            <p className="text-xs text-emerald-600 dark:text-emerald-400">
              Resume enhanced for better ATS compatibility
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-200 dark:border-blue-800">
          <CardContent className="p-2 sm:p-4 text-center">
            <Target className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600 mx-auto mb-1" />
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 text-xs sm:text-sm mb-1">
              Job Match Improved
            </h3>
            <p className="text-xs text-blue-600 dark:text-blue-400">
              Keywords and skills aligned with job requirements
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Qualification Gaps Warning */}
      {qualificationGaps && qualificationGaps.length > 0 && (
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/50 dark:to-orange-950/50 border-2 border-amber-200 dark:border-amber-800">
          <CardContent className="p-2 sm:p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <h3 className="font-semibold text-amber-800 dark:text-amber-200 text-xs sm:text-sm mb-1 sm:mb-2">
                  Qualification Gaps Identified
                </h3>
                <div className="space-y-1">
                  {qualificationGaps.slice(0, 3).map((gap, index) => (
                    <div key={index} className="text-xs text-amber-700 dark:text-amber-300 break-words">
                      • {gap.skill}
                    </div>
                  ))}
                  {qualificationGaps.length > 3 && (
                    <div className="text-xs text-amber-600 dark:text-amber-400 italic">
                      +{qualificationGaps.length - 3} more gaps identified
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-7 sm:h-9">
          <TabsTrigger 
            value="optimized" 
            className="text-xs px-1 sm:px-3 flex items-center gap-1"
          >
            <TrendingUp className="h-3 w-3" />
            <span className="hidden sm:inline">Optimized Resume</span>
            <span className="sm:hidden">Optimized</span>
          </TabsTrigger>
          <TabsTrigger 
            value="comparison" 
            className="text-xs px-1 sm:px-3 flex items-center gap-1"
          >
            <FileText className="h-3 w-3" />
            <span className="hidden sm:inline">Side by Side</span>
            <span className="sm:hidden">Compare</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="optimized" className="mt-2 sm:mt-4">
          <Card className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-xl">
            <CardContent className="p-2 sm:p-4">
              <div className="space-y-1 mb-2 sm:mb-4">
                <div className="flex items-center gap-1 sm:gap-2">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 text-xs px-1 sm:px-2 py-0.5">
                    <Sparkles className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                    Optimized Version
                  </Badge>
                </div>
                <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800"></div>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-2 sm:p-4 border border-slate-200 dark:border-slate-700">
                <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 max-h-[250px] sm:max-h-[400px] overflow-y-auto custom-scrollbar break-words">
                  {optimizedResume}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="mt-2 sm:mt-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-4">
            {/* Original Resume */}
            <Card className="bg-red-50 dark:bg-red-950/20 border-2 border-red-200 dark:border-red-800">
              <CardContent className="p-2 sm:p-4">
                <div className="flex items-center gap-1 sm:gap-2 mb-2">
                  <XCircle className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
                  <h3 className="font-semibold text-red-800 dark:text-red-200 text-xs sm:text-sm">Original Resume</h3>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-1 sm:p-3 border border-red-200 dark:border-red-700">
                  <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 max-h-[150px] sm:max-h-[250px] overflow-y-auto custom-scrollbar break-words">
                    {originalResume}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Optimized Resume */}
            <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800">
              <CardContent className="p-2 sm:p-4">
                <div className="flex items-center gap-1 sm:gap-2 mb-2">
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600" />
                  <h3 className="font-semibold text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm">Optimized Resume</h3>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-lg p-1 sm:p-3 border border-emerald-200 dark:border-emerald-700">
                  <div className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 max-h-[150px] sm:max-h-[250px] overflow-y-auto custom-scrollbar break-words">
                    {optimizedResume}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
