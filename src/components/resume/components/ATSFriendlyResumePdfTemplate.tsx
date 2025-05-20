
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

  // Function to determine if a line likely contains contact information
  const extractContactInfo = (lines: string[]): { name: string, contactInfo: string[] } => {
    const contactInfo: string[] = [];
    let name = '';
    
    // Scan first 10 lines for candidate info
    const scanLines = Math.min(10, lines.length);
    
    for (let i = 0; i < scanLines; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (!line) continue;
      
      // First non-empty line is likely the name
      if (!name && line && !/^(summary|objective|profile)/i.test(line)) {
        name = line;
        continue;
      }
      
      // Check for contact information patterns
      const isContactInfo =
        /^[^@]+@[^.]+\.[^.]+/.test(line) || // Email
        /^\+?[\d\s()\-]{7,}$/.test(line) || // Phone number
        /^https?:\/\//.test(line) || // Website or social media
        /^(linkedin|github|twitter|facebook|instagram)\.com/.test(line) || // Social media without http
        /^[\d\s]+[A-Za-z\s,]+,\s*[A-Za-z\s]+,\s*[A-Za-z]{2}/.test(line) || // Address pattern
        /^[A-Za-z\s]+,\s*[A-Za-z\s]+,\s*[A-Za-z]{2}/.test(line); // Address without number
        
      if (isContactInfo) {
        contactInfo.push(line);
      } else if (contactInfo.length > 0) {
        // If we've already found contact info but this line isn't contact info,
        // we're probably done with the header section
        break;
      }
    }
    
    return { name, contactInfo };
  };
  
  const { name, contactInfo } = extractContactInfo(lines);

  return (
    <div className="ats-resume-template p-6 bg-white text-black font-sans" style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.2',  // Reduced line height
      fontSize: '9pt',    // Smaller font size overall
      maxWidth: '100%',
      overflowX: 'hidden',
      pageBreakInside: 'avoid'
    }}>
      <div className="pdf-header mb-3 pb-1 border-b border-gray-300 text-center">
        {name && <h1 className="text-lg font-bold text-slate-800 mb-0.5">{name}</h1>}
        
        {contactInfo.length > 0 && (
          <div className="text-xs text-slate-700 mb-1">
            {contactInfo.map((info, idx) => (
              <div key={idx}>{info}</div>
            ))}
          </div>
        )}
        
        {jobTitle && (
          <h2 className="text-sm text-slate-700 mt-1 mb-0.5">For: {jobTitle}</h2>
        )}
        <div className="text-xs text-slate-500 mt-0.5">Generated on {formattedDate} by Resulient</div>
      </div>

      <div className="pdf-content" style={{ fontSize: '8.5pt', lineHeight: '1.2' }}>
        {lines.map((line, index) => {
          // Skip first few lines if they're part of the header we've already displayed
          if (index < contactInfo.length + 1 && (line.trim() === name || contactInfo.includes(line.trim()) || !line.trim())) {
            return null;
          }
          
          if (isSectionHeader(line)) {
            // Add minimal space before section headers
            const topMargin = index > 0 ? 'mt-2' : '';
            return (
              <h2 key={index} className={`text-sm font-bold text-slate-800 ${topMargin} mb-1 border-b border-slate-200 pb-0.5`}>
                {line.trim()}
              </h2>
            );
          } else if (line.trim().length === 0) {
            // Minimal spacing for blank lines
            return <div key={index} style={{ height: '0.2em' }}></div>;
          } else {
            // Check if this might be a bullet point or job title/date
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
              return (
                <p key={index} className="my-0.5 ml-3 text-slate-700" style={{ lineHeight: '1.2', textIndent: '-0.7em', paddingLeft: '0.7em', marginBottom: '0.2em' }}>
                  {line.trim()}
                </p>
              );
            } else if (/\d{4}\s*(-|–|to)\s*(\d{4}|present)/i.test(line)) {
              // This looks like a date range, make it stand out
              return (
                <p key={index} className="my-0.5 font-semibold text-slate-700" style={{ lineHeight: '1.2', marginBottom: '0.2em' }}>
                  {line.trim()}
                </p>
              );
            } else if (line.trim().length > 0 && line.trim().length < 60 && index > 0 && lines[index-1].trim() === '') {
              // This could be a job title or company name
              return (
                <p key={index} className="mt-1 mb-0.5 font-semibold text-slate-800" style={{ lineHeight: '1.2' }}>
                  {line.trim()}
                </p>
              );
            } else {
              // Regular paragraph
              return (
                <p key={index} className="my-0.5 text-slate-700" style={{ lineHeight: '1.2', marginBottom: '0.2em' }}>
                  {line.trim()}
                </p>
              );
            }
          }
        })}
      </div>
      
      <div className="pdf-footer mt-1 pt-0.5 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>This resume has been optimized for Applicant Tracking Systems (ATS)</p>
      </div>
    </div>
  );
};
