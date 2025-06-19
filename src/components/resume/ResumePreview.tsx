
import { Card, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ResumePreviewProps {
  resumeData?: any;
  onDownloadPDF?: () => void;
}

export const ResumePreview = ({ resumeData, onDownloadPDF }: ResumePreviewProps) => {
  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <FileText className="h-16 w-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-medium text-gray-500 mb-2">Resume Preview</h3>
        <p className="text-gray-400 max-w-md">
          Fill out the form sections and click "Generate Resume" to see your professional resume preview here.
        </p>
      </div>
    );
  }

  return (
    <Card className="bg-white border shadow-sm">
      <CardContent className="p-6">
        <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Resume Preview</h3>
          {onDownloadPDF && (
            <Button onClick={onDownloadPDF} size="sm">
              Download PDF
            </Button>
          )}
        </div>
        <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed">
          {typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData, null, 2)}
        </div>
      </CardContent>
    </Card>
  );
};
