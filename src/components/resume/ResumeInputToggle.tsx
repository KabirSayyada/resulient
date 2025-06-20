
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploadSection } from "./FileUploadSection";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { Upload, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
    <div className="space-y-4">
      <Card className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 border-gray-200 dark:border-gray-700 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button
              variant="default"
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              <Upload className="h-4 w-4" />
              Upload Existing Resume
            </Button>
            <Button
              variant="outline"
              onClick={handleBuildResumeClick}
              className="flex items-center gap-2 border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-700 dark:text-blue-400 dark:hover:bg-blue-950 w-full sm:w-auto"
            >
              <Edit className="h-4 w-4" />
              Build New Resume
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Upload your existing resume or use our AI-powered resume builder to create a new one
            </p>
            
            <FileUploadSection 
              resumeContent={resumeContent} 
              setResumeContent={setResumeContent} 
            />

            {resumeData && (
              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-blue-900 dark:text-blue-100">
                      Previously Built Resume Available
                    </h4>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      You have a resume created with our builder
                    </p>
                  </div>
                  <Button
                    onClick={handleUseBuiltResume}
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
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
