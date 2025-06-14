
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FileUploadSection } from "./FileUploadSection";
import { ResumeBuilderForm, ResumeData } from "./ResumeBuilderForm";
import { useResumeBuilder } from "@/hooks/useResumeBuilder";
import { Upload, Edit } from "lucide-react";

interface ResumeInputToggleProps {
  resumeContent: string;
  setResumeContent: (content: string) => void;
  userId?: string;
  onResumeSelected?: () => void; // Add callback for when resume is selected
}

export const ResumeInputToggle = ({ 
  resumeContent, 
  setResumeContent, 
  userId, 
  onResumeSelected 
}: ResumeInputToggleProps) => {
  const [inputMode, setInputMode] = useState<'upload' | 'build'>('upload');
  const { resumeData, saving, saveResumeData, generateResumeFromData, loading } = useResumeBuilder(userId);

  const handleResumeBuilderSubmit = async (data: ResumeData) => {
    // Save the data
    await saveResumeData(data);
    
    // Generate resume content
    const generatedResume = generateResumeFromData(data);
    setResumeContent(generatedResume);
    
    // Call the callback to close the form
    if (onResumeSelected) {
      onResumeSelected();
    }
  };

  const handleUseBuiltResume = () => {
    if (resumeData) {
      const generatedResume = generateResumeFromData(resumeData);
      setResumeContent(generatedResume);
      
      // Call the callback to close the form
      if (onResumeSelected) {
        onResumeSelected();
      }
    }
  };

  const handleUseCurrentResume = () => {
    // If there's already resume content, just close the form
    if (resumeContent && onResumeSelected) {
      onResumeSelected();
    }
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={inputMode === 'upload' ? 'default' : 'outline'}
              onClick={() => setInputMode('upload')}
              className="flex items-center gap-2"
            >
              <Upload className="h-4 w-4" />
              Upload Resume
            </Button>
            <Button
              variant={inputMode === 'build' ? 'default' : 'outline'}
              onClick={() => setInputMode('build')}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Build Resume
            </Button>
          </div>

          {inputMode === 'upload' ? (
            <div>
              <p className="text-sm text-gray-600 mb-3">
                Upload your existing resume or paste it below
              </p>
              <FileUploadSection 
                resumeContent={resumeContent} 
                setResumeContent={setResumeContent} 
              />
              {resumeContent && (
                <div className="mt-4 flex justify-center">
                  <Button
                    onClick={handleUseCurrentResume}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    Use This Resume
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {resumeData 
                  ? "Update your information or use your saved data"
                  : "Don't have a resume? No problem! Tell us about yourself and we'll create one for you."
                }
              </p>
              {resumeData && (
                <div className="mb-4 flex justify-center">
                  <Button
                    onClick={handleUseBuiltResume}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Use Built Resume
                  </Button>
                </div>
              )}
              {loading ? (
                <div className="text-center py-8">
                  <p>Loading your saved information...</p>
                </div>
              ) : (
                <ResumeBuilderForm
                  onSubmit={handleResumeBuilderSubmit}
                  isLoading={saving}
                  existingData={resumeData}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
