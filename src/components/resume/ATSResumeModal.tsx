
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Download, Sparkles, X } from "lucide-react";

interface ATSResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeData: string;
  onDownloadTXT: () => void;
  onDownloadPDF: () => void;
}

export const ATSResumeModal = ({ 
  isOpen, 
  onClose, 
  resumeData, 
  onDownloadTXT, 
  onDownloadPDF 
}: ATSResumeModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 justify-between text-2xl font-bold">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Your ATS-Optimized Resume
              </span>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={onDownloadTXT}
                size="sm"
                variant="outline"
                className="text-emerald-600 border-2 border-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 font-semibold transition-all duration-300 hover:scale-105"
              >
                <Download className="h-4 w-4 mr-2" />
                TXT
              </Button>
              <Button 
                onClick={onDownloadPDF}
                size="sm"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-semibold"
              >
                <Download className="h-4 w-4 mr-2" />
                PDF
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[70vh]">
          {/* Status indicator */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/50 dark:to-teal-950/50 border border-emerald-200 dark:border-emerald-800/50 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg shadow-lg">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h4 className="font-semibold text-emerald-800 dark:text-emerald-200">Resume Generated Successfully</h4>
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
                <div className="whitespace-pre-wrap font-mono text-sm leading-relaxed text-slate-800 dark:text-slate-200 max-h-[400px] overflow-y-auto custom-scrollbar">
                  {resumeData}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
