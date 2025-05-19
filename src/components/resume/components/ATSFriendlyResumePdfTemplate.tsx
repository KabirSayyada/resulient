
import React from 'react';

interface ATSFriendlyResumePdfTemplateProps {
  content: string;
  jobTitle?: string;
}

export const ATSFriendlyResumePdfTemplate = ({ content, jobTitle }: ATSFriendlyResumePdfTemplateProps) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  
  // Try to extract sections from the resume content
  const lines = content.split('\n');
  
  // Simple function to determine if a line is likely a section header
  const isSectionHeader = (line: string): boolean => {
    const trimmed = line.trim();
    return (
      trimmed.length > 0 && 
      trimmed.length < 30 && 
      (trimmed === trimmed.toUpperCase() ||
      /^(SUMMARY|PROFESSIONAL SUMMARY|OBJECTIVE|EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY|EDUCATION|ACADEMIC BACKGROUND|SKILLS|TECHNICAL SKILLS|COMPETENCIES|CERTIFICATIONS|LICENSES|PROJECTS|ACHIEVEMENTS|REFERENCES)/i.test(trimmed))
    );
  };

  return (
    <div className="ats-resume-template p-6 bg-white text-black" style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.4',
      fontSize: '10pt',
      maxWidth: '100%',
      overflowX: 'hidden',
      pageBreakInside: 'avoid'
    }}>
      <div className="pdf-header mb-4">
        <h1 className="text-xl font-bold text-center text-slate-800">ATS-Optimized Resume</h1>
        {jobTitle && (
          <h2 className="text-lg text-center text-slate-700 mt-1">For: {jobTitle}</h2>
        )}
        <div className="text-xs text-center text-slate-600 mt-1">Generated on {formattedDate} by Resulient</div>
      </div>

      <div className="pdf-content" style={{ fontSize: '9pt' }}>
        {lines.map((line, index) => {
          if (isSectionHeader(line)) {
            return (
              <h2 key={index} className="text-lg font-bold text-slate-800 mt-4 mb-2 border-b border-slate-300 pb-1">
                {line.trim()}
              </h2>
            );
          } else if (line.trim().length === 0) {
            return <div key={index} style={{ height: '0.5em' }}></div>;
          } else {
            return (
              <p key={index} className="my-1 text-slate-700" style={{ lineHeight: '1.3' }}>
                {line.trim()}
              </p>
            );
          }
        })}
      </div>
      
      <div className="pdf-footer mt-4 pt-2 border-t border-slate-300 text-center text-xs text-slate-500">
        <p>This resume has been optimized for Applicant Tracking Systems (ATS)</p>
      </div>
    </div>
  );
};
