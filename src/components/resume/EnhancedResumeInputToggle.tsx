
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploadSection } from "./FileUploadSection";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { Edit, Sparkles, Upload, FileText, Zap, Target } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface EnhancedResumeInputToggleProps {
  resumeContent: string;
  setResumeContent: (content: string) => void;
  userId?: string;
  onResumeSelected?: () => void;
}

export const EnhancedResumeInputToggle = ({ 
  resumeContent, 
  setResumeContent, 
  userId, 
  onResumeSelected 
}: EnhancedResumeInputToggleProps) => {
  const navigate = useNavigate();
  const { resumeData, generateResumeFromData } = useResumeBuilder(userId);
  const [animateFeatures, setAnimateFeatures] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimateFeatures(prev => !prev);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleBuildResumeClick = () => {
    navigate('/resume-builder');
  };

  const handleUseBuiltResume = () => {
    if (resumeData) {
      const generatedResume = generateResumeFromData(resumeData);
      setResumeContent(generatedResume);
      
      if (onResumeSelected) {
        onResumeSelected();
      }
    }
  };

  const features = [
    { icon: Zap, text: "ATS-Friendly", color: "text-yellow-500" },
    { icon: Target, text: "Keyword Rich", color: "text-green-500" },
    { icon: Sparkles, text: "AI-Enhanced", color: "text-purple-500" }
  ];

  return (
    <div className="space-y-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 dark:from-emerald-950 dark:via-green-950 dark:to-teal-950 border-2 border-green-200 dark:border-green-800 shadow-lg hover:shadow-xl transition-all duration-300">
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full -translate-y-20 -translate-x-20 animate-pulse delay-500"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-teal-200/20 to-green-200/20 rounded-full translate-y-16 translate-x-16 animate-pulse delay-1500"></div>
        
        <CardContent className="p-8 relative z-10">
          {/* Header with animated title */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className={`p-3 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-lg transition-transform duration-500 ${
                animateFeatures ? 'rotate-12 scale-110' : 'rotate-0 scale-100'
              }`}>
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Your Resume
              </h3>
            </div>
            
            {/* Feature badges */}
            <div className="flex flex-wrap justify-center gap-2 mb-6">
              {features.map((feature, index) => (
                <Badge 
                  key={index}
                  variant="secondary" 
                  className={`flex items-center gap-1 px-3 py-1 bg-white/90 dark:bg-gray-800/90 border transition-all duration-300 delay-${index * 300} ${
                    resumeContent ? 'animate-pulse' : ''
                  }`}
                >
                  <feature.icon className={`h-3 w-3 ${feature.color}`} />
                  <span className="text-xs font-medium">{feature.text}</span>
                </Badge>
              ))}
            </div>
          </div>

          {/* Action buttons with enhanced styling */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <Button
              variant="outline"
              onClick={handleBuildResumeClick}
              className="flex-1 h-12 border-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950 transition-all duration-300 hover:scale-105 group"
            >
              <Edit className="h-5 w-5 mr-2 group-hover:rotate-12 transition-transform duration-300" />
              <span className="font-semibold">Build New Resume</span>
            </Button>
            
            {resumeData && (
              <Button
                onClick={handleUseBuiltResume}
                className="flex-1 h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group"
              >
                <Sparkles className="h-5 w-5 mr-2 group-hover:animate-spin transition-transform duration-300" />
                <span className="font-semibold">Use Built Resume</span>
              </Button>
            )}
          </div>

          {/* Enhanced upload section */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-100/50 to-emerald-100/50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg blur-sm"></div>
            <div className="relative">
              <FileUploadSection 
                resumeContent={resumeContent} 
                setResumeContent={setResumeContent} 
              />
            </div>
          </div>

          {/* Previously built resume notification */}
          {resumeData && (
            <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-2 border-blue-200 dark:border-blue-800 rounded-xl animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <FileText className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                      ✨ Previously Built Resume Available
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      Ready to use your professionally crafted resume
                    </p>
                  </div>
                </div>
                <Button
                  onClick={handleUseBuiltResume}
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Zap className="h-4 w-4 mr-1" />
                  Load Resume
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
