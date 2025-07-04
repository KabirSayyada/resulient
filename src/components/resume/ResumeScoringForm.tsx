
import { FileUploadSection } from "./FileUploadSection";
import { Button } from "@/components/ui/button";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, Target, TrendingUp, Zap, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

interface ResumeScoringFormProps {
  scoringMode: "resumeOnly";
  setScoringMode: (mode: "resumeOnly") => void;
  resumeContent: string;
  setResumeContent: (content: string) => void;
  isScoring: boolean;
  onScore: () => void;
  disableButton?: boolean;
}

export const ResumeScoringForm = ({
  resumeContent,
  setResumeContent,
  isScoring,
  onScore,
  disableButton
}: ResumeScoringFormProps) => {
  const [animateFeatures, setAnimateFeatures] = useState(false);
  const wordCount = resumeContent.trim().split(/\s+/).length;
  const isResumeTooLong = wordCount > 800;

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateFeatures(prev => !prev);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const analysisFeatures = [
    { icon: Target, text: "Industry Benchmarking", color: "text-blue-500" },
    { icon: TrendingUp, text: "Skill Analysis", color: "text-green-500" },
    { icon: Award, text: "Elite Indicators", color: "text-purple-500" },
    { icon: Sparkles, text: "AI Insights", color: "text-yellow-500" }
  ];

  return (
    <div className="space-y-8">
      <Card className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 dark:from-indigo-950 dark:via-blue-950 dark:to-purple-950 border-2 border-indigo-200 dark:border-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Animated background elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-200/20 to-purple-200/20 rounded-full -translate-y-20 translate-x-20 animate-pulse delay-500"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-indigo-200/20 to-blue-200/20 rounded-full translate-y-16 -translate-x-16 animate-pulse delay-1000"></div>
        
        <CardHeader className="pb-4 relative z-10">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className={`p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl shadow-lg transition-transform duration-300 ${
              animateFeatures ? 'rotate-6 scale-110' : 'rotate-0 scale-100'
            }`}>
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Resume Analysis Engine
              </span>
              <div className="flex items-center gap-2 mt-1">
                <Zap className="h-4 w-4 text-yellow-500 animate-pulse" />
                <span className="text-sm font-normal text-indigo-600 dark:text-indigo-400">
                  AI-Powered Industry Benchmarking
                </span>
              </div>
            </div>
          </CardTitle>
          
          {/* Analysis features preview */}
          <div className="flex flex-wrap gap-2 mt-3">
            {analysisFeatures.map((feature, index) => (
              <Badge 
                key={index}
                variant="secondary" 
                className={`flex items-center gap-1 px-3 py-1 bg-white/80 dark:bg-gray-800/80 border transition-all duration-300 delay-${index * 200} ${
                  resumeContent ? 'animate-pulse' : ''
                }`}
              >
                <feature.icon className={`h-3 w-3 ${feature.color}`} />
                <span className="text-xs font-medium">{feature.text}</span>
              </Badge>
            ))}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6 relative z-10">
          <FileUploadSection
            resumeContent={resumeContent}
            setResumeContent={setResumeContent}
          />
          
          {/* Enhanced word count with validation */}
          {wordCount > 0 && (
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border border-blue-200 dark:border-blue-800 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-500 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-blue-900 dark:text-blue-100">
                    Resume Analysis Ready
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {wordCount} words • {isResumeTooLong ? 'Too long' : 'Perfect length'}
                  </p>
                </div>
              </div>
              {wordCount > 50 && !isResumeTooLong && (
                <div className="bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-bounce">
                  ✓ Ready
                </div>
              )}
            </div>
          )}
          
          {isResumeTooLong && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-950/50 dark:to-orange-950/50 border-l-4 border-red-400 dark:border-red-500 rounded-lg animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-500 rounded-lg">
                  <Target className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-red-900 dark:text-red-100">
                    Resume Too Long
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Your resume is {wordCount} words. Please shorten it to 800 words or less for optimal scoring.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-center">
        <Button
          onClick={onScore}
          disabled={isScoring || !resumeContent || isResumeTooLong || disableButton}
          className={`px-12 py-4 text-lg font-bold rounded-full shadow-xl transition-all duration-300 transform ${
            isScoring || !resumeContent || isResumeTooLong || disableButton
              ? 'opacity-50 cursor-not-allowed scale-95'
              : 'hover:scale-105 hover:shadow-2xl'
          } bg-gradient-to-r from-fuchsia-500 to-indigo-400 hover:from-fuchsia-600 hover:to-indigo-500`}
        >
          {isScoring ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Analyzing Your Resume...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              🚀 Score My Resume
            </div>
          )}
        </Button>
      </div>
      
      {/* Enhanced info sections */}
      <div className="space-y-4">
        <div className="p-4 bg-gradient-to-r from-fuchsia-50 to-indigo-50 dark:from-fuchsia-950/50 dark:to-indigo-950/50 border-l-4 border-fuchsia-400 dark:border-fuchsia-500 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fuchsia-500 rounded-lg">
              <Award className="h-4 w-4 text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-fuchsia-900 dark:text-fuchsia-100 mb-1">
                🎯 Industry Benchmarking
              </h4>
              <p className="text-sm text-fuchsia-700 dark:text-fuchsia-300">
                Your resume will be analyzed against estimated industry standards. You'll see where you stand versus your competition and get skills to pursue.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div className="flex gap-3">
            <InfoCircledIcon className="h-5 w-5 text-blue-500 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-blue-700 dark:text-blue-300">
              <p className="font-semibold mb-1">📊 Dynamic Scoring System</p>
              <p className="text-sm">
                Scoring the same resume multiple times may produce slightly different scores. This is because your resume is being compared against dynamic industry standards that reflect the overall quality of resumes scored at that time.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
