
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Palette } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RESUME_TEMPLATES, ResumeTemplateType } from "@/utils/resumeTemplates/templateSelector";

interface ATSResumePreviewProps {
  resumeData?: string;
  selectedTemplate?: ResumeTemplateType;
  onTemplateChange?: (template: ResumeTemplateType) => void;
  canChangeTemplate?: boolean;
}

export const ATSResumePreview = ({ 
  resumeData, 
  selectedTemplate = 'standard',
  onTemplateChange,
  canChangeTemplate = false
}: ATSResumePreviewProps) => {
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

  return (
    <div className="space-y-4">
      {canChangeTemplate && onTemplateChange && (
        <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-purple-700 text-sm">
              <Palette className="h-4 w-4" />
              Choose Template Style
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <Select 
                value={selectedTemplate} 
                onValueChange={(value: ResumeTemplateType) => onTemplateChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a template" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(RESUME_TEMPLATES).map(([key, template]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{template.name}</span>
                        <span className="text-xs text-gray-500">{template.description}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-purple-600">
                Current: {RESUME_TEMPLATES[selectedTemplate]?.name} - {RESUME_TEMPLATES[selectedTemplate]?.description}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white border shadow-sm">
        <CardContent className="p-6">
          <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
            {resumeData}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
