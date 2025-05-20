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
  
  // Enhanced function to determine if a line is likely a section header
  const isSectionHeader = (line: string, index: number, lines: string[]): boolean => {
    const trimmed = line.trim();
    if (!trimmed) return false;
    
    // Check for common section header patterns
    const isCommonHeader = /^(SUMMARY|PROFESSIONAL SUMMARY|OBJECTIVE|EXPERIENCE|WORK EXPERIENCE|EMPLOYMENT HISTORY|EDUCATION|ACADEMIC BACKGROUND|SKILLS|TECHNICAL SKILLS|COMPETENCIES|CERTIFICATIONS|LICENSES|PROJECTS|ACHIEVEMENTS|REFERENCES|ADDITIONAL INFORMATION|PUBLICATIONS|LANGUAGES|INTERESTS|VOLUNTEER|AWARDS|HONORS|AFFILIATIONS|PROFESSIONAL AFFILIATIONS|ACTIVITIES|EXTRACURRICULAR ACTIVITIES)/i.test(trimmed);
    
    if (isCommonHeader) return true;
    
    // Enhanced pattern detection for unconventional headers
    // Section headers are typically:
    // 1. Short (less than 60 chars)
    // 2. Often all caps or title case
    // 3. Often followed by a blank line or different formatting
    // 4. Often preceded by a blank line
    // 5. Don't start with bullet points, dates, or common non-header patterns
    
    const isShort = trimmed.length > 0 && trimmed.length < 60;
    const isAllCapsOrTitleCase = trimmed === trimmed.toUpperCase() || 
                                 /^[A-Z][a-z]*([ ][A-Z][a-z]*)*$/.test(trimmed);
    const hasLeadingSpace = index > 0 && !lines[index-1].trim();
    const hasTrailingSpace = index < lines.length - 1 && !lines[index+1].trim();
    const notBulletOrDate = !trimmed.startsWith('•') && 
                           !trimmed.startsWith('-') && 
                           !trimmed.startsWith('*') &&
                           !/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(trimmed) &&
                           !/^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/.test(trimmed);
    
    // Likely a standalone line that's meant to be a header
    const isStandaloneFormatting = (hasLeadingSpace || hasTrailingSpace) && 
                                  isShort && 
                                  notBulletOrDate;
    
    // Check if it has any formatting that suggests it's a header (like ending with a colon)
    const hasHeaderFormatting = trimmed.endsWith(':') || 
                               (isAllCapsOrTitleCase && isShort);
    
    return isStandaloneFormatting || hasHeaderFormatting;
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

  // Function to identify job experience entries - improved for better detection
  const isJobTitle = (line: string, index: number, lines: string[]): boolean => {
    const trimmed = line.trim();
    
    // Skip empty lines or section headers
    if (!trimmed || isSectionHeader(line, index, lines)) return false;
    
    // Check previous lines to see if we're in the experience section - now more flexible
    let inExperienceSection = false;
    for (let i = index - 1; i >= 0 && i >= index - 15; i--) { // Look back more lines
      if (isSectionHeader(lines[i], i, lines) && 
          (/experience|employment|work|career|position|job|role|history/i.test(lines[i].trim()))) {
        inExperienceSection = true;
        break;
      }
    }
    
    if (!inExperienceSection) return false;
    
    // Job titles are typically short, not bullet points, and might contain common job title words
    return (trimmed.length > 0 && 
            trimmed.length < 70 && 
            !trimmed.startsWith('•') && 
            !trimmed.startsWith('-') &&
            (
              /\b(senior|junior|lead|director|manager|engineer|developer|analyst|specialist|coordinator|assistant|associate|consultant|advisor|officer|representative|administrator|supervisor|head|chief|president|ceo|cto|cfo|vp|vice president)\b/i.test(trimmed) ||
              index > 0 && lines[index-1].trim() === '' // A line after an empty line in the experience section is likely a job title
            )
           );
  };
  
  // Function to identify company names - made more robust
  const isCompanyName = (line: string, index: number, lines: string[]): boolean => {
    const trimmed = line.trim();
    
    // Check if this line follows what appears to be a job title
    if (index > 0 && isJobTitle(lines[index-1], index-1, lines)) {
      // Company names are typically short and might contain "Inc", "LLC", etc.
      return (trimmed.length > 0 && 
              trimmed.length < 70 && 
              !trimmed.startsWith('•') && 
              !trimmed.startsWith('-') &&
              !isDateRange(trimmed)); // Make sure it's not a date
    }
    
    return false;
  };
  
  // Function to identify date ranges/durations - enhanced to catch more formats
  const isDateRange = (line: string): boolean => {
    const trimmed = line.trim();
    // Date ranges typically contain years or "present"
    return /\b(19|20)\d{2}\b.*(\b(19|20)\d{2}\b|present|current|now|ongoing)/i.test(trimmed) ||
           /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b.*\b(19|20)\d{2}\b/i.test(trimmed) ||
           /\b\d{1,2}\/\d{4}\b.*(\b\d{1,2}\/\d{4}\b|present|current|now|ongoing)/i.test(trimmed) ||
           /\b(January|February|March|April|May|June|July|August|September|October|November|December)\b.*\b(19|20)\d{2}\b/i.test(trimmed) ||
           /\b(19|20)\d{2}\b.*to.*\b(19|20)\d{2}\b/i.test(trimmed) ||
           /\b(19|20)\d{2}\b.*-.*\b(19|20)\d{2}\b/i.test(trimmed);
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
          
          if (isSectionHeader(line, index, lines)) {
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
          } else if (isJobTitle(line, index, lines)) {
            // Job title formatting
            return (
              <h3 key={index} className="mt-1.5 font-bold text-slate-800" style={{ fontSize: '9pt', marginBottom: '0.1em' }}>
                {line.trim()}
              </h3>
            );
          } else if (isCompanyName(line, index, lines)) {
            // Company name formatting
            return (
              <p key={index} className="font-semibold text-slate-700" style={{ fontSize: '8.5pt', marginTop: '0.1em', marginBottom: '0.1em' }}>
                {line.trim()}
              </p>
            );
          } else if (isDateRange(line)) {
            // Date range formatting
            return (
              <p key={index} className="text-slate-600 italic" style={{ fontSize: '8.5pt', marginTop: '0.1em', marginBottom: '0.3em' }}>
                {line.trim()}
              </p>
            );
          } else if (line.trim().startsWith('•') || line.trim().startsWith('-') || line.trim().startsWith('*')) {
            // Bullet point formatting - expanded to handle different bullet styles
            return (
              <p key={index} className="my-0.5 ml-3 text-slate-700" style={{ lineHeight: '1.2', textIndent: '-0.7em', paddingLeft: '0.7em', marginBottom: '0.2em' }}>
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
        })}
      </div>
      
      <div className="pdf-footer mt-1 pt-0.5 border-t border-slate-200 text-center text-xs text-slate-500">
        <p>This resume has been optimized for Applicant Tracking Systems (ATS)</p>
      </div>
    </div>
  );
};
