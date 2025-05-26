
import React, { useRef } from 'react';
import { ParsedResume } from '@/types/resumeStructure';
import { ATSFriendlyResumePdfTemplate } from './ATSFriendlyResumePdfTemplate';
import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { generateDirectResumePDF } from '@/utils/resumePdfGenerator';
import { useToast } from '@/hooks/use-toast';

interface ResumePreviewProps {
  resume: ParsedResume;
  className?: string;
}

export const ResumePreview = ({ resume, className = '' }: ResumePreviewProps) => {
  const resumeRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleDownloadPDF = async () => {
    toast({
      title: "Generating PDF",
      description: "Creating your ATS-optimized resume PDF with selectable text...",
    });

    try {
      generateDirectResumePDF(
        resume,
        `optimized-resume-${new Date().toISOString().split('T')[0]}.pdf`
      );

      toast({
        title: "Resume Downloaded",
        description: "Your ATS-optimized resume has been downloaded successfully! The PDF contains selectable text.",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Failed",
        description: "There was an error generating your resume PDF. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ATS-Optimized Resume Preview
        </h3>
        <Button 
          onClick={handleDownloadPDF}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <FileDown className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
      
      <div className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm overflow-hidden">
        <div ref={resumeRef} className="ats-resume-template">
          <ATSFriendlyResumePdfTemplate resume={resume} />
        </div>
      </div>
      
      <div className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
        <p className="font-medium mb-1">ATS-Optimized Features:</p>
        <ul className="list-disc list-inside space-y-1 text-xs">
          <li>Clean, single-page layout optimized for Applicant Tracking Systems</li>
          <li>Professional formatting with clear section headers</li>
          <li>Selectable text content for easy copying and ATS parsing</li>
          <li>Keyword-optimized content based on job requirements</li>
          <li>Consistent typography and spacing for better readability</li>
        </ul>
      </div>
    </div>
  );
};
