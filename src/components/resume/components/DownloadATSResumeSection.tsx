
import React from 'react';
import { DownloadATSResumeButton } from './DownloadATSResumeButton';
import { generatePDFFromElement } from '@/utils/reportGenerationUtils';
import { toast } from 'sonner';

interface DownloadATSResumeSectionProps {
  atsResumeRef: React.RefObject<HTMLDivElement>;
}

export const DownloadATSResumeSection = ({ atsResumeRef }: DownloadATSResumeSectionProps) => {
  const handleATSResumeDownload = async () => {
    if (!atsResumeRef.current) return;
    
    toast.loading("Preparing your ATS-friendly resume...");
    
    // Get approximate content length to determine if we need multi-page support
    const contentElement = atsResumeRef.current.querySelector('.pdf-content');
    const contentLength = contentElement?.textContent?.length || 0;
    
    // Use multi-page mode for longer content (approximately > 3000 characters)
    const forceSinglePage = contentLength <= 3000;
    
    const success = await generatePDFFromElement(
      atsResumeRef.current,
      `ats-optimized-resume-${new Date().toISOString().split("T")[0]}.pdf`,
      forceSinglePage, // Dynamic single-page decision based on content length
      true  // Use text mode for selectable text
    );
    
    if (success) {
      toast.success("ATS Resume Downloaded", {
        description: `Your ATS-optimized resume has been downloaded as a PDF with selectable text${forceSinglePage ? '' : ' (multi-page format due to content length)'}.`
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
