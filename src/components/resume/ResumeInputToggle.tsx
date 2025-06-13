
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
}

export const ResumeInputToggle = ({ resumeContent, setResumeContent, userId }: ResumeInputToggleProps) => {
  const [inputMode, setInputMode] = useState<'upload' | 'build'>('upload');
  const { resumeData, saving, saveResumeData, generateResumeFromData, loading } = useResumeBuilder(userId);

  const handleResumeBuilderSubmit = async (data: ResumeData) => {
    // Save the data
    await saveResumeData(data);
    
    // Generate resume content
    const generatedResume = generateResumeFromData(data);
    setResumeContent(generatedResume);
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
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-600 mb-4">
                {resumeData 
                  ? "Update your information or use your saved data"
                  : "Don't have a resume? No problem! Tell us about yourself and we'll create one for you."
                }
              </p>
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
