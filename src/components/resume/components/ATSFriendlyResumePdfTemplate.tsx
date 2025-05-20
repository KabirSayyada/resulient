
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
      trimmed.length < 50 && // Allow longer section headers
      (trimmed === trimmed.toUpperCase() ||
      /^(SUMMARY|PROFESSIONAL SUMMARY|OBJECTIVE|EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY|EDUCATION|ACADEMIC BACKGROUND|SKILLS|TECHNICAL SKILLS|COMPETENCIES|CERTIFICATIONS|LICENSES|PROJECTS|ACHIEVEMENTS|REFERENCES)/i.test(trimmed))
    );
  };

  return (
    <div className="ats-resume-template p-8 bg-white text-black font-sans" style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.5',
      fontSize: '11pt',
      maxWidth: '100%',
      overflowX: 'hidden',
      pageBreakInside: 'avoid'
    }}>
      <div className="pdf-header mb-6 pb-4 border-b border-gray-300">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-2">ATS-Optimized Resume</h1>
        {jobTitle && (
          <h2 className="text-lg text-center text-slate-700 mt-2 mb-1">For: {jobTitle}</h2>
        )}
        <div className="text-sm text-center text-slate-600 mt-2">Generated on {formattedDate} by Resulient</div>
      </div>

      <div className="pdf-content" style={{ fontSize: '10pt' }}>
        {lines.map((line, index) => {
          if (isSectionHeader(line)) {
            // Add more space before section headers (except the first one)
            const topMargin = index > 0 ? 'mt-6' : '';
            return (
              <h2 key={index} className={`text-lg font-bold text-slate-800 ${topMargin} mb-3 border-b border-slate-300 pb-2`}>
                {line.trim()}
              </h2>
            );
          } else if (line.trim().length === 0) {
            // Add appropriate spacing for blank lines
            return <div key={index} style={{ height: '0.75em' }}></div>;
          } else {
            // Check if this might be a bullet point or job title/date
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
              return (
                <p key={index} className="my-1 ml-4 text-slate-700" style={{ lineHeight: '1.4', textIndent: '-1em', paddingLeft: '1em' }}>
                  {line.trim()}
                </p>
              );
            } else if (/\d{4}\s*(-|–|to)\s*(\d{4}|present)/i.test(line)) {
              // This looks like a date range, make it stand out
              return (
                <p key={index} className="my-1 font-semibold text-slate-700" style={{ lineHeight: '1.4' }}>
                  {line.trim()}
                </p>
              );
            } else if (line.trim().length > 0 && line.trim().length < 60 && index > 0 && lines[index-1].trim() === '') {
              // This could be a job title or company name
              return (
                <p key={index} className="mt-3 mb-1 font-semibold text-slate-800" style={{ lineHeight: '1.4' }}>
                  {line.trim()}
                </p>
              );
            } else {
              // Regular paragraph
              return (
                <p key={index} className="my-1 text-slate-700" style={{ lineHeight: '1.4' }}>
                  {line.trim()}
                </p>
              );
            }
          }
        })}
      </div>
      
      <div className="pdf-footer mt-6 pt-3 border-t border-slate-300 text-center text-xs text-slate-500">
        <p>This resume has been optimized for Applicant Tracking Systems (ATS)</p>
      </div>
    </div>
  );
};
