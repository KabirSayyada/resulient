
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
  const isSectionHeader = (line: string): boolean => {
    const trimmed = line.trim();
    
    // Skip empty lines
    if (!trimmed) return false;
    
    // Check common section header patterns
    return (
      // Is all caps or title case with reasonable length
      (trimmed.length > 0 && trimmed.length < 60 && 
       (trimmed === trimmed.toUpperCase() || 
        trimmed.split(' ').every(word => word.length > 0 && word[0] === word[0].toUpperCase()))) ||
       
      // Contains common section header keywords
      /^(SUMMARY|PROFESSIONAL|PROFILE|OBJECTIVE|EXPERIENCE|WORK|EMPLOYMENT|EDUCATION|ACADEMIC|SKILLS|TECHNICAL|COMPETENCIES|CERTIFICATIONS|LICENSES|PROJECTS|ACHIEVEMENTS|ACCOMPLISHMENTS|REFERENCES|INTERESTS|ACTIVITIES|PUBLICATIONS|AWARDS|HONORS|LANGUAGES|VOLUNTEER|ADDITIONAL)/i.test(trimmed) ||
      
      // Is followed by a separator character
      /[:：]{1}$/.test(trimmed) ||
      
      // Is underlined or has other markers
      /^[_\-=]{3,}$/.test(trimmed) ||
      
      // Standalone header with surrounding blank lines (contextual check)
      (trimmed.length < 30 && !trimmed.startsWith('•') && !trimmed.startsWith('-') && 
       (lines.indexOf(line) === 0 || !lines[lines.indexOf(line) - 1].trim()) &&
       (lines.indexOf(line) === lines.length - 1 || !lines[lines.indexOf(line) + 1].trim()))
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

  // Improved function to identify job titles with broader pattern matching
  const isJobTitle = (line: string, index: number, lines: string[]): boolean => {
    const trimmed = line.trim();
    
    // Skip empty lines or section headers
    if (!trimmed || isSectionHeader(trimmed)) return false;
    
    // Check previous lines to see if we're in the experience section
    let inExperienceSection = false;
    for (let i = index - 1; i >= 0 && i >= index - 15; i--) {
      if (isSectionHeader(lines[i]) && 
          /^(EXPERIENCE|WORK|EMPLOYMENT|PROFESSIONAL|CAREER)/i.test(lines[i].trim())) {
        inExperienceSection = true;
        break;
      }
    }
    
    if (!inExperienceSection) return false;
    
    // Job titles are typically short, not bullet points, and often appear after blank lines
    // or after section headers in the experience section
    return (trimmed.length > 0 && 
            trimmed.length < 80 && 
            !trimmed.startsWith('•') && 
            !trimmed.startsWith('-') &&
            (
              /\b(senior|junior|lead|director|manager|engineer|developer|analyst|specialist|coordinator|assistant|associate|officer|consultant|advisor|intern|head|chief|executive|president|vice|ceo|cto|cfo|supervisor|administrator|architect|faculty|instructor|teacher|professor)\b/i.test(trimmed) ||
              index > 0 && (lines[index-1].trim() === '' || isSectionHeader(lines[index-1])) || // A line after an empty line or section header
              (index < lines.length - 1 && isCompanyName(lines[index+1], index+1, lines)) // A line before what looks like a company name
            )
           );
  };
  
  // Improved function to identify company names with better context awareness
  const isCompanyName = (line: string, index: number, lines: string[]): boolean => {
    const trimmed = line.trim();
    
    // Check contextual clues
    if (trimmed.length > 0 && trimmed.length < 80 && !trimmed.startsWith('•') && !trimmed.startsWith('-')) {
      // Check if this line follows what appears to be a job title
      if (index > 0 && isJobTitle(lines[index-1], index-1, lines)) {
        return true;
      }
      
      // Check if this line contains company name indicators
      if (/\b(Inc\.|LLC|Ltd\.|Corp\.|Corporation|Company|Co\.|Group|Enterprises|Industries|International)\b/i.test(trimmed)) {
        return true;
      }
      
      // Check if next line is likely a date range (indicating this might be a company)
      if (index < lines.length - 1 && isDateRange(lines[index+1])) {
        return true;
      }
    }
    
    return false;
  };
  
  // Improved function to identify date ranges with more patterns
  const isDateRange = (line: string): boolean => {
    const trimmed = line.trim();
    // Date ranges typically contain years or "present"
    return /\b(19|20)\d{2}\b.*(\b(19|20)\d{2}\b|present|current|now|ongoing)/i.test(trimmed) ||
           /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(19|20)\d{2}\b/i.test(trimmed) ||
           /\b\d{1,2}\/\d{4}\b.*(\b\d{1,2}\/\d{4}\b|present|current|now)/i.test(trimmed) ||
           /\b\d{4}\b.*to.*\b(present|current|now)\b/i.test(trimmed) ||
           /\b(present|current|now)\b/i.test(trimmed);
  };
  
  const { name, contactInfo } = extractContactInfo(lines);

  return (
    <div className="ats-resume-template p-4 bg-white text-black font-sans" style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.1',     // Even more reduced line height
      fontSize: '8.5pt',      // Smaller font size
      maxWidth: '100%',
      overflowX: 'hidden',
      pageBreakInside: 'avoid'
    }}>
      <div className="pdf-header mb-2 pb-1 border-b border-gray-300 text-center">
        {name && <h1 className="text-base font-bold text-slate-800 mb-0">{name}</h1>}
        
        {contactInfo.length > 0 && (
          <div className="text-xs text-slate-700 flex flex-wrap justify-center gap-x-3">
            {contactInfo.map((info, idx) => (
              <span key={idx} className="whitespace-nowrap">{info}</span>
            ))}
          </div>
        )}
        
        {jobTitle && (
          <h2 className="text-xs text-slate-700 mt-0.5 mb-0">For: {jobTitle}</h2>
        )}
        <div className="text-xs text-slate-500 mt-0">Generated by Resulient</div>
      </div>

      <div className="pdf-content" style={{ fontSize: '8pt', lineHeight: '1.1' }}>
        {lines.map((line, index) => {
          // Skip first few lines if they're part of the header we've already displayed
          if (index < contactInfo.length + 1 && (line.trim() === name || contactInfo.includes(line.trim()) || !line.trim())) {
            return null;
          }
          
          if (isSectionHeader(line)) {
            // Add minimal space before section headers
            const topMargin = index > 0 ? 'mt-1' : '';
            return (
              <h2 key={index} className={`text-xs font-bold text-slate-800 ${topMargin} mb-0.5 border-b border-slate-200 pb-0`}>
                {line.trim()}
              </h2>
            );
          } else if (line.trim().length === 0) {
            // Minimal spacing for blank lines
            return <div key={index} style={{ height: '0.15em' }}></div>;
          } else if (isJobTitle(line, index, lines)) {
            // Job title formatting - bold with slightly larger font
            return (
              <h3 key={index} className="mt-1 mb-0 font-bold text-slate-800" style={{ fontSize: '8.5pt' }}>
                {line.trim()}
              </h3>
            );
          } else if (isCompanyName(line, index, lines)) {
            // Company name formatting - semibold
            return (
              <p key={index} className="font-semibold text-slate-700 mt-0 mb-0" style={{ fontSize: '8pt' }}>
                {line.trim()}
              </p>
            );
          } else if (isDateRange(line)) {
            // Date range formatting - italic and slightly smaller
            return (
              <p key={index} className="text-slate-600 italic mt-0 mb-0.5" style={{ fontSize: '7.5pt' }}>
                {line.trim()}
              </p>
            );
          } else if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
            // Bullet point formatting - compact
            return (
              <p key={index} className="my-0 ml-2 text-slate-700" style={{ 
                lineHeight: '1.1', 
                textIndent: '-0.7em', 
                paddingLeft: '0.7em', 
                marginBottom: '0.1em',
                fontSize: '8pt' 
              }}>
                {line.trim()}
              </p>
            );
          } else {
            // Regular paragraph - minimal margins
            return (
              <p key={index} className="my-0 text-slate-700" style={{ 
                lineHeight: '1.1', 
                marginBottom: '0.1em',
                fontSize: '8pt'
              }}>
                {line.trim()}
              </p>
            );
          }
        })}
      </div>
      
      <div className="pdf-footer mt-0.5 pt-0 border-t border-slate-200 text-center text-2xs text-slate-500" style={{ fontSize: '6pt' }}>
        <p className="m-0">This resume has been optimized for Applicant Tracking Systems (ATS)</p>
      </div>
    </div>
  );
};
