
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface ATSResumePreviewProps {
  resumeData?: string;
}

export const ATSResumePreview = ({ resumeData }: ATSResumePreviewProps) => {
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
    <Card className="bg-white border shadow-sm">
      <CardContent className="p-6">
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {resumeData}
        </div>
      </CardContent>
    </Card>
  );
};
