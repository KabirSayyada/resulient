
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ATSResumePreviewProps {
  resumeData?: string;
}

export const ATSResumePreview = ({ resumeData }: ATSResumePreviewProps) => {
  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">Resume Preview</h3>
        <p className="text-muted-foreground max-w-md">
          Fill out the form sections and click "Generate ATS-Optimized Resume" to see your professional resume preview here.
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-card border shadow-sm">
      <CardContent className="p-6">
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground">
          {resumeData}
        </div>
      </CardContent>
    </Card>
  );
};
