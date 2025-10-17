import { useWizard } from "./WizardContainer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Eye } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export const LivePreviewPanel = () => {
  const { formData, selectedTemplate, currentStep } = useWizard();

  const hasContent = formData.personalInfo || formData.workExperience.length > 0 || formData.education.length > 0;

  if (currentStep === "path") return null;

  return (
    <div className="hidden lg:block sticky top-24 h-[calc(100vh-120px)]">
      <Card className="h-full">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Live Preview
            </CardTitle>
            <Badge variant="secondary">{selectedTemplate}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0 h-[calc(100%-80px)]">
          {!hasContent ? (
            <div className="flex items-center justify-center h-full text-center p-8">
              <div className="space-y-3">
                <FileText className="h-16 w-16 mx-auto text-muted-foreground opacity-50" />
                <div>
                  <p className="font-medium">Preview will appear here</p>
                  <p className="text-sm text-muted-foreground">
                    As you fill out your information, you'll see a live preview of your resume
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-full">
              <div className="p-6 space-y-6 bg-white text-black">
                {/* Personal Info */}
                {formData.personalInfo && (
                  <div className="space-y-2 animate-in fade-in">
                    <div className="border-b-2 border-primary pb-2">
                      <div className="font-bold text-2xl text-primary">
                        {formData.personalInfo.split('\n')[0] || "Your Name"}
                      </div>
                      <p className="text-sm text-muted-foreground whitespace-pre-line">
                        {formData.personalInfo.split('\n').slice(1).join('\n')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Work Experience */}
                {formData.workExperience.length > 0 && (
                  <div className="space-y-3 animate-in fade-in">
                    <h3 className="font-bold text-lg border-b border-primary/30 pb-1">
                      WORK EXPERIENCE
                    </h3>
                    {formData.workExperience.map((exp, index) => (
                      <div key={index} className="text-sm space-y-1">
                        <p className="whitespace-pre-line">{exp}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Education */}
                {formData.education.length > 0 && (
                  <div className="space-y-3 animate-in fade-in">
                    <h3 className="font-bold text-lg border-b border-primary/30 pb-1">
                      EDUCATION
                    </h3>
                    {formData.education.map((edu, index) => (
                      <div key={index} className="text-sm space-y-1">
                        <p className="whitespace-pre-line">{edu}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* Skills */}
                {formData.skills && (
                  <div className="space-y-2 animate-in fade-in">
                    <h3 className="font-bold text-lg border-b border-primary/30 pb-1">
                      SKILLS
                    </h3>
                    <p className="text-sm whitespace-pre-line">{formData.skills}</p>
                  </div>
                )}

                {/* Achievements */}
                {formData.achievements && (
                  <div className="space-y-2 animate-in fade-in">
                    <h3 className="font-bold text-lg border-b border-primary/30 pb-1">
                      ACHIEVEMENTS
                    </h3>
                    <p className="text-sm whitespace-pre-line">{formData.achievements}</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
