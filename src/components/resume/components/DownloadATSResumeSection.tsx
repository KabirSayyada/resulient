
import React, { useState } from 'react';
import { DownloadATSResumeButton } from './DownloadATSResumeButton';
import { generatePDFFromElement } from '@/utils/reportGenerationUtils';
import { toast } from 'sonner';

interface DownloadATSResumeSectionProps {
  atsResumeRef: React.RefObject<HTMLDivElement>;
}

export const DownloadATSResumeSection = ({ atsResumeRef }: DownloadATSResumeSectionProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleATSResumeDownload = async () => {
    if (!atsResumeRef.current) {
      toast.error("Unable to generate resume", {
        description: "The resume template is not ready. Please try again."
      });
      return;
    }
    
    setIsDownloading(true);
    toast.loading("Preparing your ATS-friendly resume...", {
      duration: 5000,
    });
    
    try {
      // Give a short delay to ensure the template is fully rendered
      setTimeout(async () => {
        // Make sure the element is visible for rendering
        const originalDisplay = atsResumeRef.current?.style.display || '';
        const originalVisibility = atsResumeRef.current?.style.visibility || '';
        const originalPosition = atsResumeRef.current?.style.position || '';
        const originalLeft = atsResumeRef.current?.style.left || '';
        
        if (atsResumeRef.current) {
          // Make sure element is visible for PDF generation
          atsResumeRef.current.style.display = 'block';
          atsResumeRef.current.style.visibility = 'visible';
          atsResumeRef.current.style.position = 'absolute';
          atsResumeRef.current.style.left = '0';
          
          // Add a class for better PDF rendering
          atsResumeRef.current.classList.add('generating-pdf');
        }
        
        // Generate PDF
        const success = await generatePDFFromElement(
          atsResumeRef.current!,
          `ats-optimized-resume-${new Date().toISOString().split("T")[0]}.pdf`,
          true, // Single-page PDF for ATS resume
          true  // Use text mode for selectable text
        );
        
        // Restore original styles
        if (atsResumeRef.current) {
          atsResumeRef.current.style.display = originalDisplay;
          atsResumeRef.current.style.visibility = originalVisibility;
          atsResumeRef.current.style.position = originalPosition;
          atsResumeRef.current.style.left = originalLeft;
          atsResumeRef.current.classList.remove('generating-pdf');
        }
        
        if (success) {
          toast.success("ATS Resume Downloaded", {
            description: "Your ATS-optimized resume has been downloaded as a PDF with selectable text."
          });
        } else {
          toast.error("PDF Export Failed", {
            description: "There was an error downloading your ATS resume as PDF. Please try again."
          });
        }
        
        setIsDownloading(false);
      }, 300); // Short delay to ensure rendering
    } catch (error) {
      console.error("ATS Resume download error:", error);
      toast.error("PDF Export Failed", {
        description: "There was an error downloading your ATS resume. Please try again."
      });
      setIsDownloading(false);
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
            disabled={isDownloading}
          />
        </div>
      </div>
    </div>
  );
};
