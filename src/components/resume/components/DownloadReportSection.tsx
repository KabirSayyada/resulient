
import React from 'react';
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { generatePDFFromElement } from "@/utils/reportGenerationUtils";

interface DownloadReportSectionProps {
  completeReportRef: React.RefObject<HTMLDivElement>;
}

export const DownloadReportSection = ({ completeReportRef }: DownloadReportSectionProps) => {
  const handleFullReportDownload = async () => {
    if (!completeReportRef.current) return;
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
      <div className="flex justify-center mt-4 w-full">
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-4 rounded-lg border border-indigo-100 w-full sm:w-auto">
          <div className="text-center mb-2">
            <p className="text-sm text-gray-600">Save this report for your records or to share with others</p>
          </div>
          <Button 
            size="lg"
            onClick={handleFullReportDownload}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition hover:scale-105 flex items-center gap-3 w-full sm:w-auto justify-center"
          >
            <Download className="h-5 w-5" />
            Download Full Report (PDF)
          </Button>
        </div>
      </div>
    </div>
  );
};
