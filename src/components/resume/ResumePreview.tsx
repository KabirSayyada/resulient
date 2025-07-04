
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download, Sparkles, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ResumePreviewProps {
  resumeData?: any;
  onDownloadPDF?: () => void;
}

export const ResumePreview = ({ resumeData, onDownloadPDF }: ResumePreviewProps) => {
  if (!resumeData) {
    return (
      <Card className="bg-gradient-to-br from-slate-50/80 via-white to-gray-50/80 dark:from-slate-950/30 dark:via-background dark:to-gray-950/30 border-2 border-slate-200/60 dark:border-slate-800/60 shadow-xl">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative mb-6">
            <div className="p-6 bg-gradient-to-r from-slate-200 to-gray-300 dark:from-slate-800 dark:to-gray-700 rounded-full shadow-lg">
              <FileText className="h-16 w-16 text-slate-500 dark:text-slate-400" />
            </div>
            <div className="absolute -top-2 -right-2 p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full">
              <Eye className="h-4 w-4 text-white" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-foreground mb-3 bg-gradient-to-r from-slate-600 to-gray-600 dark:from-slate-300 dark:to-gray-300 bg-clip-text text-transparent">
            Resume Preview
          </h3>
          <p className="text-muted-foreground max-w-md text-base leading-relaxed">
            Fill out the form sections and click "Generate Resume" to see your professional resume preview here.
          </p>
          <Badge variant="outline" className="mt-4 border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400">
            Waiting for content...
          </Badge>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-emerald-50/80 via-white to-green-50/80 dark:from-emerald-950/30 dark:via-background dark:to-green-950/30 border-2 border-emerald-200/60 dark:border-emerald-800/60 shadow-xl">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-emerald-500 to-green-600 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                Resume Preview
              </CardTitle>
              <Badge variant="secondary" className="mt-1 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                <Sparkles className="h-3 w-3 mr-1" />
                Generated
              </Badge>
            </div>
          </div>
          {onDownloadPDF && (
            <Button 
              onClick={onDownloadPDF} 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="bg-white dark:bg-background/60 rounded-xl border-2 border-emerald-200/60 dark:border-emerald-800/60 p-6 shadow-inner">
          <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-foreground max-h-[600px] overflow-y-auto custom-scrollbar">
            {typeof resumeData === 'string' ? resumeData : JSON.stringify(resumeData, null, 2)}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
