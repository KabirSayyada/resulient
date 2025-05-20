
import React from 'react';
import { DownloadATSResumeButton } from './DownloadATSResumeButton';
import { generatePDFFromElement } from '@/utils/reportGenerationUtils';
import { toast } from 'sonner';

interface DownloadATSResumeSectionProps {
  atsResumeRef: React.RefObject<HTMLDivElement>;
}

export const DownloadATSResumeSection = ({ atsResumeRef }: DownloadATSResumeSectionProps) => {
  const handleATSResumeDownload = async () => {
    if (!atsResumeRef.current) {
      toast.error("Could not generate resume", {
        description: "The resume template could not be found."
      });
      return;
    }
    
    toast.loading("Preparing your ATS-friendly resume...");
    
    // Ensure the element is visible before generating the PDF
    const originalVisibility = atsResumeRef.current.style.visibility;
    const originalPosition = atsResumeRef.current.style.position;
    const originalLeft = atsResumeRef.current.style.left;
    
    atsResumeRef.current.style.visibility = 'visible';
    atsResumeRef.current.style.position = 'fixed';
    atsResumeRef.current.style.left = '0';
    
    // Add a short delay to ensure the element is properly rendered
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = await generatePDFFromElement(
      atsResumeRef.current,
      `ats-optimized-resume-${new Date().toISOString().split("T")[0]}.pdf`,
      true, // Single-page PDF for ATS resume
      true  // Use text mode for selectable text
    );
    
    // Restore original element properties
    atsResumeRef.current.style.visibility = originalVisibility;
    atsResumeRef.current.style.position = originalPosition;
    atsResumeRef.current.style.left = originalLeft;
    
    if (success) {
      toast.success("ATS Resume Downloaded", {
        description: "Your ATS-optimized resume has been downloaded as a PDF with selectable text."
      });
    } else {
      toast.error("PDF Export Failed", {
        description: "There was an error downloading your ATS resume as PDF."
      });
    }
  };

  return (
    <div className="px-3 sm:px-6 pb-6">
      <div className="flex justify-center mt-4 w-full">
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-100 w-full sm:w-auto">
          <div className="text-center mb-2">
            <p className="text-sm text-gray-600">Download your ATS-friendly resume with selectable text</p>
          </div>
          <DownloadATSResumeButton
            onClick={handleATSResumeDownload}
          />
        </div>
      </div>
    </div>
  );
};
