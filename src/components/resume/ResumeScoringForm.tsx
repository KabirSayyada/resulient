
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileUploadSection } from './FileUploadSection';
import { useIsMobile } from "@/hooks/use-mobile";
import { 
  FileText, 
  Sparkles, 
  TrendingUp, 
  Zap, 
  Upload,
  Target,
  BarChart3,
  Wand2
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

interface ResumeScoringFormProps {
  scoringMode: "resumeOnly" | "jobDescription";
  setScoringMode: (mode: "resumeOnly" | "jobDescription") => void;
  resumeContent: string;
  setResumeContent: (content: string) => void;
  isScoring: boolean;
  onScore: () => void;
  disableButton?: boolean;
}

export const ResumeScoringForm = ({
  scoringMode,
  setScoringMode,
  resumeContent,
  setResumeContent,
  isScoring,
  onScore,
  disableButton = false,
}: ResumeScoringFormProps) => {
  const isMobile = useIsMobile();

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-white/95 via-blue-50/80 to-indigo-50/95 dark:from-slate-900/95 dark:via-blue-950/80 dark:to-indigo-950/95 shadow-2xl border-2 border-blue-200/50 dark:border-blue-800/50 backdrop-blur-sm hover:shadow-3xl transition-all duration-500">
      {/* Enhanced animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-emerald-200/30 via-blue-200/20 to-purple-200/30 dark:from-emerald-800/15 dark:via-blue-800/10 dark:to-purple-800/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-36 h-36 bg-gradient-to-tr from-purple-200/30 via-pink-200/20 to-indigo-200/30 dark:from-purple-800/15 dark:via-pink-800/10 dark:to-indigo-800/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-blue-200/15 to-emerald-200/15 dark:from-blue-800/8 dark:to-emerald-800/8 rounded-full blur-2xl animate-pulse delay-2000"></div>
      </div>

      <CardHeader className="relative z-10 pb-4">
        {/* Enhanced Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-blue-600 rounded-2xl shadow-xl">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight">
                Upload Your Resume
              </h2>
              <p className="text-slate-600 dark:text-slate-400 font-medium mt-1">
                Get instant AI-powered insights and scoring
              </p>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg px-3 py-2 font-semibold">
              <Sparkles className="h-4 w-4 mr-2" />
              AI Analysis
            </Badge>
            <Badge className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white border-0 shadow-lg px-3 py-2 font-semibold">
              <BarChart3 className="h-4 w-4 mr-2" />
              Industry Insights
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="relative z-10 space-y-8">
        {/* Enhanced File Upload Section */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-gray-800/60 dark:to-gray-900/60 rounded-2xl shadow-inner"></div>
          <div className="relative z-10 p-6 rounded-2xl border-2 border-dashed border-blue-300/60 dark:border-blue-700/60 hover:border-blue-400/80 dark:hover:border-blue-600/80 transition-all duration-300">
            <FileUploadSection resumeContent={resumeContent} setResumeContent={setResumeContent} />
          </div>
        </div>

        {/* Enhanced Text Area Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
              <Wand2 className="h-5 w-5 text-white" />
            </div>
            <Label 
              htmlFor="resume-content" 
              className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"
            >
              Or Paste Your Resume Text
            </Label>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-white/80 to-purple-50/80 dark:from-gray-800/80 dark:to-purple-950/80 rounded-2xl shadow-inner"></div>
            <Textarea
              id="resume-content"
              placeholder="Paste your resume content here... Include your work experience, skills, education, and achievements for the most accurate analysis."
              value={resumeContent}
              onChange={(e) => setResumeContent(e.target.value)}
              className="relative z-10 min-h-[200px] sm:min-h-[300px] resize-none border-2 border-purple-200/60 dark:border-purple-800/60 rounded-2xl bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-base leading-relaxed p-6 shadow-lg hover:shadow-xl focus:shadow-2xl transition-all duration-300 focus:border-purple-400 dark:focus:border-purple-600 focus:ring-4 focus:ring-purple-200/50 dark:focus:ring-purple-800/50"
              style={{ 
                fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
                fontSize: isMobile ? '14px' : '15px',
                lineHeight: '1.6'
              }}
            />
          </div>
          
          {/* Character count and tips */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-2">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {resumeContent.length > 0 && (
                <span className="inline-flex items-center gap-2">
                  <Target className="h-4 w-4 text-emerald-500" />
                  {resumeContent.length.toLocaleString()} characters entered
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <Badge variant="outline" className="border-emerald-300 text-emerald-600 dark:border-emerald-700 dark:text-emerald-400">
                <TrendingUp className="h-3 w-3 mr-1" />
                Include Skills
              </Badge>
              <Badge variant="outline" className="border-blue-300 text-blue-600 dark:border-blue-700 dark:text-blue-400">
                <Zap className="h-3 w-3 mr-1" />
                Add Achievements
              </Badge>
            </div>
          </div>
        </div>

        {/* Enhanced Action Button */}
        <div className="flex justify-center pt-4">
          <Button
            onClick={onScore}
            disabled={!resumeContent.trim() || isScoring || disableButton}
            size="lg"
            className={`
              group relative overflow-hidden px-8 py-4 text-lg font-bold rounded-2xl shadow-2xl 
              transition-all duration-300 hover:scale-105 hover:shadow-3xl
              ${!resumeContent.trim() || isScoring || disableButton 
                ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-emerald-500 via-blue-600 to-purple-600 hover:from-emerald-600 hover:via-blue-700 hover:to-purple-700 text-white border-0'
              }
            `}
          >
            {/* Button background animation */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            
            <div className="relative flex items-center gap-3">
              {isScoring ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-6 w-6 group-hover:animate-pulse" />
                  <span>Analyze My Resume</span>
                  <TrendingUp className="h-5 w-5 group-hover:animate-bounce" />
                </>
              )}
            </div>
          </Button>
        </div>

        {/* Enhanced Status Message */}
        {!resumeContent.trim() && (
          <div className="text-center">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-700/50 rounded-2xl shadow-lg">
              <Upload className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <span className="text-amber-700 dark:text-amber-300 font-medium">
                Upload a file or paste your resume content to get started
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
