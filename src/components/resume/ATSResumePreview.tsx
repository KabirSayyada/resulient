
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ATSTemplateSelector } from "./ATSTemplateSelector";
import { parseATSResumeText } from "@/utils/parseATSResumeText";

interface ATSResumePreviewProps {
  resumeData?: string;
}

export const ATSResumePreview = ({ resumeData }: ATSResumePreviewProps) => {
  const [viewMode, setViewMode] = useState<'text' | 'template'>('text');

  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">Resume Preview</h3>
        <p className="text-gray-400 max-w-md">
          Fill out the form sections and click "Generate ATS-Optimized Resume" to see your professional resume preview here.
        </p>
      </div>
    );
  }

  const parsedResume = parseATSResumeText(resumeData);

  return (
    <div className="space-y-4">
      <div className="flex gap-2 mb-4">
        <Button
          variant={viewMode === 'text' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('text')}
        >
          Text Format
        </Button>
        <Button
          variant={viewMode === 'template' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('template')}
        >
          Template Format
        </Button>
      </div>

      {viewMode === 'text' ? (
        <Card className="bg-white border shadow-sm">
          <CardContent className="p-6">
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {resumeData}
            </div>
          </CardContent>
        </Card>
      ) : (
        <ATSTemplateSelector resume={parsedResume} />
      )}
    </div>
  );
};
