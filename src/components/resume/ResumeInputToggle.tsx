
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadSection } from "./FileUploadSection";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { Edit, Sparkles, FileText, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface ResumeInputToggleProps {
  resumeContent: string;
  setResumeContent: (content: string) => void;
  userId?: string;
  onResumeSelected?: () => void;
}

export const ResumeInputToggle = ({ 
  resumeContent, 
  setResumeContent, 
  userId, 
  onResumeSelected 
}: ResumeInputToggleProps) => {
  const navigate = useNavigate();
  const { resumeData, generateResumeFromData } = useResumeBuilder(userId);

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

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 dark:from-blue-950/30 dark:via-background dark:to-indigo-950/30 border-2 border-blue-200/60 dark:border-blue-800/60 shadow-xl hover:shadow-2xl transition-all duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-xl font-bold">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Resume Builder
            </span>
            <Badge variant="secondary" className="ml-auto bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300">
              <Zap className="h-3 w-3 mr-1" />
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleBuildResumeClick}
              className="flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl h-12 font-semibold"
            >
              <Edit className="h-5 w-5" />
              Build New Resume
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-muted-foreground text-base leading-relaxed">
              Upload your existing resume or use our AI-powered resume builder to create a professional one from scratch
            </p>
            
            <FileUploadSection 
              resumeContent={resumeContent} 
              setResumeContent={setResumeContent} 
            />

            {resumeData && (
              <div className="mt-6 p-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/50 dark:to-green-950/50 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-emerald-500 to-green-600 rounded-lg">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">
                        Previously Built Resume Available
                      </h4>
                      <p className="text-emerald-700 dark:text-emerald-300 text-sm">
                        You have a resume created with our builder
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleUseBuiltResume}
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Use Built Resume
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
