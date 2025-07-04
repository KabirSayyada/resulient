
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Eye, Sparkles, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ATSResumePreviewProps {
  resumeData?: string;
}

export const ATSResumePreview = ({ resumeData }: ATSResumePreviewProps) => {
  if (!resumeData) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-6">
        <div className="relative">
          <div className="p-8 bg-gradient-to-br from-slate-100 to-gray-200 dark:from-slate-800 dark:to-gray-700 rounded-3xl shadow-2xl">
            <FileText className="h-20 w-20 text-slate-400 dark:text-slate-500" />
          </div>
          <div className="absolute -top-2 -right-2 p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full shadow-lg">
            <Eye className="h-5 w-5 text-white" />
          </div>
          <div className="absolute -bottom-2 -left-2 p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full shadow-lg">
            <Sparkles className="h-4 w-4 text-white animate-pulse" />
          </div>
        </div>

        <div className="space-y-4 max-w-md">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-slate-700 to-gray-700 dark:from-slate-200 dark:to-gray-200 bg-clip-text text-transparent">
            Resume Preview
          </h3>
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
            Fill out the form sections and click "Generate ATS-Optimized Resume" to see your professional resume preview here.
          </p>
          <div className="flex justify-center gap-2">
            <Badge variant="outline" className="border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-400 px-3 py-1">
              <Clock className="h-3 w-3 mr-1" />
              Waiting for content...
            </Badge>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Status indicator */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div>
            <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Resume Generated</h4>
            <p className="text-sm text-emerald-600 dark:text-emerald-400">ATS-optimized and ready to download</p>
          </div>
        </div>
        <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 shadow-lg px-3 py-1">
          <FileText className="h-3 w-3 mr-1" />
          Ready
        </Badge>
      </div>

      {/* Resume content */}
      <Card className="bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 shadow-xl">
        <CardContent className="p-8">
          <div className="space-y-2 mb-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-emerald-600 dark:text-emerald-400">ATS-Optimized Format</span>
            </div>
            <div className="h-px bg-gradient-to-r from-emerald-200 to-transparent dark:from-emerald-800"></div>
          </div>
          
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200 max-h-[600px] overflow-y-auto custom-scrollbar">
              {resumeData}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
