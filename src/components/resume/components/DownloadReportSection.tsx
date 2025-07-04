
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download, FileText, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { generatePDFFromElement } from "@/utils/reportGenerationUtils";
import { Card, CardContent } from "@/components/ui/card";

interface DownloadReportSectionProps {
  completeReportRef: React.RefObject<HTMLDivElement>;
}

export const DownloadReportSection = ({ completeReportRef }: DownloadReportSectionProps) => {
  const handleFullReportDownload = async () => {
    if (!completeReportRef.current) return;
    
    toast("Preparing PDF", {
      description: "Exporting your complete resume analysis as a PDF. Hang tight!",
    });
    
    const success = await generatePDFFromElement(
      completeReportRef.current,
      `resume-full-report-${new Date().toISOString().split("T")[0]}.pdf`,
      false
    );
    
    if (success) {
      toast.success("Full Report PDF Downloaded", {
        description: "Your full analysis has been downloaded as PDF."
      });
    } else {
      toast.error("PDF Export Failed", {
        description: "There was an error downloading your full analysis as PDF."
      });
    }
  };

  return (
    <div className="px-3 sm:px-6 pb-6">
      <Card className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-emerald-950/50 dark:via-teal-950/50 dark:to-cyan-950/50 border-2 border-emerald-200/60 dark:border-emerald-800/60 shadow-xl">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-emerald-200/30 to-teal-200/30 dark:from-emerald-800/20 dark:to-teal-800/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-gradient-to-tr from-cyan-200/30 to-emerald-200/30 dark:from-cyan-800/20 dark:to-emerald-800/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
        </div>
        
        <CardContent className="p-6 relative z-10">
          <div className="text-center space-y-4">
            {/* Enhanced Header */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl shadow-xl">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Complete Analysis
                </h3>
                <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">
                  Get your detailed PDF report
                </p>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-w-md mx-auto">
              Download your comprehensive resume analysis with detailed insights, 
              improvement suggestions, and growth opportunities.
            </p>
            
            {/* Enhanced Download Button */}
            <Button
              onClick={handleFullReportDownload}
              className="group relative overflow-hidden w-full sm:w-auto bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-700 hover:via-teal-700 hover:to-cyan-700 text-white font-bold py-4 px-8 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-white/10 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center justify-center gap-3">
                <div className="p-1 bg-white/20 rounded-lg">
                  <FileText className="h-5 w-5" />
                </div>
                <span className="text-lg">Download Full Report (PDF)</span>
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
