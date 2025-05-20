
import React, { useState } from 'react';
import { DownloadATSResumeButton } from './DownloadATSResumeButton';
import { generatePDFFromElement } from '@/utils/reportGenerationUtils';
import { toast } from 'sonner';

interface DownloadATSResumeSectionProps {
  atsResumeRef: React.RefObject<HTMLDivElement>;
}

export const DownloadATSResumeSection = ({ atsResumeRef }: DownloadATSResumeSectionProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleATSResumeDownload = async () => {
    if (!atsResumeRef.current) {
      toast.error("Could not find resume content", {
        description: "There was an error accessing the resume content for download."
      });
      return;
    }
    
    setIsGenerating(true);
    toast.loading("Preparing your ATS-friendly resume...");
    
    try {
      // Ensure the element is visible and properly rendered before generating PDF
      const originalDisplay = atsResumeRef.current.style.display;
      const originalVisibility = atsResumeRef.current.style.visibility;
      
      // Make sure the element is visible for capturing
      atsResumeRef.current.style.display = "block";
      atsResumeRef.current.style.visibility = "visible";
      
      // Small delay to ensure DOM rendering is complete
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate PDF with text mode for selectable text
      const success = await generatePDFFromElement(
        atsResumeRef.current,
        `ats-optimized-resume-${new Date().toISOString().split("T")[0]}.pdf`,
        true, // Single-page PDF for ATS resume
        true  // Use text mode for selectable text
      );
      
      // Restore original visibility
      atsResumeRef.current.style.display = originalDisplay;
      atsResumeRef.current.style.visibility = originalVisibility;
      
      if (success) {
        toast.success("ATS Resume Downloaded", {
          description: "Your ATS-optimized resume has been downloaded as a PDF with properly formatted, selectable text."
        });
      } else {
        toast.error("PDF Export Failed", {
          description: "There was an error downloading your ATS resume as PDF. Please try again."
        });
      }
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error("PDF Export Failed", {
        description: "There was an unexpected error generating your PDF. Please try again."
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="px-3 sm:px-6 pb-6">
      <div className="flex justify-center mt-4 w-full">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100 w-full sm:w-auto">
          <div className="text-center mb-2">
            <p className="text-sm text-gray-600">Download your perfectly formatted, ATS-friendly resume with selectable text</p>
          </div>
          <DownloadATSResumeButton
            onClick={handleATSResumeDownload}
            disabled={isGenerating}
          />
        </div>
      </div>
    </div>
  );
};
