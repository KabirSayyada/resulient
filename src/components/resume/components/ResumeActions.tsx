
import { Button } from "@/components/ui/button";
import { FileDown, FileText, FileType } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import html2canvas from "html2canvas";
import { generatePDFFromElement, handleDownloadTextReport } from "@/utils/reportGenerationUtils";
import { ScoreData } from "@/types/resume";
import { exportElementAsImage } from "@/utils/imageExportUtils";
import React, { useState } from "react";
import { DownloadReportButton } from "./DownloadReportButton"; 
import { DownloadATSResumeButton } from "./DownloadATSResumeButton";

interface ResumeActionsProps {
  scoreCardRef: React.RefObject<HTMLDivElement>;
  completeReportRef: React.RefObject<HTMLDivElement>;
  atsResumeRef?: React.RefObject<HTMLDivElement>;
  scoreData?: ScoreData;
  optimizedResume?: string;
}

export const ResumeActions = ({ 
  scoreCardRef, 
  completeReportRef, 
  atsResumeRef,
  scoreData,
  optimizedResume
}: ResumeActionsProps) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const [showShareMessage, setShowShareMessage] = useState(true);

  // Download Scorecard as Image (PNG)
  const handleImageDownload = async () => {
    if (!scoreCardRef.current) return;

    toast({
      title: "Preparing Image",
      description: "Rendering a high-quality image of your scorecard...",
    });

    const success = await exportElementAsImage(
      scoreCardRef.current,
      `resume-scorecard-${new Date().toISOString().split("T")[0]}.png`
    );

    if (success) {
      toast({
        title: "Scorecard Image Downloaded",
        description: "Your scorecard has been downloaded as an image (PNG).",
      });
    } else {
      toast({
        title: "Image Download Failed",
        description: "There was an error downloading your scorecard as an image.",
        variant: "destructive",
      });
    }
  };

  // Download Text Report
  const handleTextReportDownload = () => {
    if (scoreData) {
      handleDownloadTextReport(scoreData);
      toast({
        title: "Text Report Downloaded",
        description: "Your text report has been downloaded for better compatibility",
      });
    }
  };

  // Download FULL REPORT as PDF
  const handleFullReportDownload = async () => {
    if (!completeReportRef.current) return;
    toast({
      title: "Preparing PDF",
      description: "Exporting your complete resume analysis as a PDF. Hang tight!",
    });

    const success = await generatePDFFromElement(
      completeReportRef.current,
      `resume-full-report-${new Date().toISOString().split("T")[0]}.pdf`,
      false // Multi-page PDF for full report
    );

    if (success) {
      toast({
        title: "Full Report PDF Downloaded",
        description: "Your full analysis has been downloaded as PDF.",
      });
    } else {
      toast({
        title: "PDF Export Failed",
        description: "There was an error downloading your full analysis as PDF.",
        variant: "destructive",
      });
    }
  };

  // Download ATS-friendly resume as PDF
  const handleATSResumeDownload = async () => {
    if (!atsResumeRef?.current) return;
    toast({
      title: "Preparing ATS Resume",
      description: "Exporting your properly formatted ATS resume with selectable text. Hang tight!",
    });

    const success = await generatePDFFromElement(
      atsResumeRef.current,
      `ats-optimized-resume-${new Date().toISOString().split("T")[0]}.pdf`,
      true, // Single-page PDF for ATS resume
      true  // Use text mode for selectable text
    );

    if (success) {
      toast({
        title: "ATS Resume Downloaded",
        description: "Your ATS-optimized resume has been downloaded as a well-formatted PDF with selectable text.",
      });
    } else {
      toast({
        title: "PDF Export Failed",
        description: "There was an error downloading your ATS resume as PDF.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 shadow-sm">
      {/* Encouragement message for sharing, always visible above export/share buttons */}
      <div className="mb-4 bg-fuchsia-100 border border-fuchsia-200 px-3 py-2 rounded text-sm text-fuchsia-800 flex flex-col gap-1 sm:flex-row sm:items-center justify-between">
        <span>
          <span className="font-medium">Why download your scorecard?</span> Downloading and saving your scorecard allows you to track your progress over time as you improve your resume. Share your progress with mentors or career coaches to get personalized advice on your journey.
        </span>
      </div>
      <h3 className="text-sm font-medium text-indigo-800 mb-3">Export Options</h3>
      <div className={`flex ${isMobile ? 'flex-wrap' : ''} gap-2 items-center`}>
        <Button
          variant="secondary"
          size={isMobile ? "sm" : "default"}
          onClick={handleImageDownload}
          className="font-semibold text-fuchsia-700 bg-fuchsia-50 hover:bg-fuchsia-100"
        >
          <FileDown className="mr-2 h-4 w-4" /> Scorecard (Image)
        </Button>
        {scoreData && (
          <Button 
            variant="outline" 
            size={isMobile ? "sm" : "default"}
            onClick={handleTextReportDownload}
            className="font-semibold text-gray-700"
          >
            <FileType className="mr-2 h-4 w-4" /> Text Report
          </Button>
        )}
      </div>
      {/* Button for exporting full report PDF */}
      <DownloadReportButton 
        title="Download Full Report (PDF)"
        onClick={handleFullReportDownload} 
      />
      
      {/* New button for ATS-friendly resume */}
      {optimizedResume && atsResumeRef && (
        <DownloadATSResumeButton
          onClick={handleATSResumeDownload}
        />
      )}
    </div>
  );
};
