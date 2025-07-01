
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, FileText } from "lucide-react";
import { RESUME_TEMPLATES, ResumeTemplateType } from "@/utils/resumeTemplates/templateSelector";

interface TemplateSelectorProps {
  selectedTemplate: ResumeTemplateType;
  onTemplateChange: (template: ResumeTemplateType) => void;
  disabled?: boolean;
}

export const TemplateSelector = ({ 
  selectedTemplate, 
  onTemplateChange, 
  disabled = false 
}: TemplateSelectorProps) => {
  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-purple-700">
          <Palette className="h-5 w-5" />
          Resume Templates
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 gap-2">
          {Object.entries(RESUME_TEMPLATES).map(([key, template]) => (
            <Button
              key={key}
              variant={selectedTemplate === key ? "default" : "outline"}
              onClick={() => onTemplateChange(key as ResumeTemplateType)}
              disabled={disabled}
              className={`justify-start h-auto p-3 ${
                selectedTemplate === key 
                  ? "bg-purple-600 hover:bg-purple-700 text-white" 
                  : "border-purple-200 hover:bg-purple-50"
              }`}
            >
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <div className="text-left">
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs opacity-80">{template.description}</div>
                  <div className="text-xs mt-1 opacity-70">
                    Best for: {template.suitableFor.slice(0, 3).join(', ')}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
        
        {selectedTemplate && (
          <div className="mt-3 p-3 bg-white rounded-md border border-purple-200">
            <div className="text-sm">
              <span className="font-medium text-purple-700">Current Template: </span>
              <span className="text-gray-700">{RESUME_TEMPLATES[selectedTemplate]?.name}</span>
            </div>
            <div className="text-xs text-gray-600 mt-1">
              {RESUME_TEMPLATES[selectedTemplate]?.description}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
