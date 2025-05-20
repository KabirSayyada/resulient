
import React from 'react';

interface ATSFriendlyResumePdfTemplateProps {
  content: string;
  jobTitle?: string;
}

export const ATSFriendlyResumePdfTemplate = ({ content }: ATSFriendlyResumePdfTemplateProps) => {
  // Split the content into lines
  const lines = content.split('\n');
  
  // More comprehensive function to identify section headers
  const isSectionHeader = (line: string, index: number): boolean => {
    const trimmed = line.trim();
    
    // Common section header patterns
    const sectionHeaderPatterns = [
      /^(SUMMARY|PROFESSIONAL\s+SUMMARY|CAREER\s+SUMMARY|PROFILE|OBJECTIVE|CAREER\s+OBJECTIVE)/i,
      /^(EXPERIENCE|WORK\s+EXPERIENCE|PROFESSIONAL\s+EXPERIENCE|EMPLOYMENT|EMPLOYMENT\s+HISTORY|WORK\s+HISTORY)/i,
      /^(EDUCATION|ACADEMIC\s+BACKGROUND|ACADEMIC\s+HISTORY|EDUCATIONAL\s+BACKGROUND|TRAINING)/i,
      /^(SKILLS|TECHNICAL\s+SKILLS|CORE\s+SKILLS|KEY\s+SKILLS|COMPETENCIES|QUALIFICATIONS|EXPERTISE)/i,
      /^(CERTIFICATIONS|LICENSES|CREDENTIALS|PROFESSIONAL\s+CERTIFICATIONS)/i,
      /^(PROJECTS|PROJECT\s+EXPERIENCE|RELEVANT\s+PROJECTS|KEY\s+PROJECTS)/i,
      /^(ACHIEVEMENTS|ACCOMPLISHMENTS|HONORS|AWARDS|RECOGNITION)/i,
      /^(VOLUNTEER|VOLUNTEER\s+EXPERIENCE|COMMUNITY\s+SERVICE|VOLUNTEER\s+WORK)/i,
      /^(LANGUAGES|LANGUAGE\s+PROFICIENCY|LANGUAGE\s+SKILLS)/i,
      /^(INTERESTS|HOBBIES|ACTIVITIES|PERSONAL\s+INTERESTS)/i,
      /^(PUBLICATIONS|RESEARCH|PAPERS|PRESENTATIONS)/i,
      /^(REFERENCES|PROFESSIONAL\s+REFERENCES)/i,
      /^(AFFILIATIONS|PROFESSIONAL\s+AFFILIATIONS|MEMBERSHIPS)/i
    ];
    
    // Check if line matches common section header patterns
    const isCommonHeader = sectionHeaderPatterns.some(pattern => pattern.test(trimmed));
    
    // Check if line has the characteristics of a section header
    const hasHeaderCharacteristics = (
      trimmed.length > 0 && 
      trimmed.length < 60 && 
      (trimmed === trimmed.toUpperCase() || 
       /^[A-Z][a-z]*([\s&]+[A-Z][a-z]*)*$/.test(trimmed)) && // Proper Case like "Professional Experience"
      (index === 0 || lines[index-1].trim() === '') && // Usually preceded by blank line except at start
      (index < lines.length - 1 && lines[index+1].trim() !== '') // Usually followed by content
    );
    
    return isCommonHeader || hasHeaderCharacteristics;
  };

  // Enhanced function to determine if line is likely a job title or company
  const isJobTitleOrCompany = (line: string, index: number): boolean => {
    const trimmed = line.trim();
    
    // Check for job title/company characteristics
    const hasJobTitleCharacteristics = (
      trimmed.length > 0 &&
      trimmed.length < 80 &&
      index > 0 && 
      (lines[index-1].trim() === '' || isSectionHeader(lines[index-1], index-1)) &&
      !trimmed.startsWith('•') &&
      !trimmed.startsWith('-') &&
      !/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(trimmed) && // Not a date like 5/19/2025
      !/^\d{1,2}-\d{1,2}-\d{2,4}/.test(trimmed) // Not a date like 5-19-2025
    );
    
    // Additional check for common job title patterns
    const jobTitlePatterns = [
      /engineer|developer|architect|manager|director|specialist|analyst|consultant|designer/i,
      /lead|senior|junior|principal|chief|head of|vp|president|coordinator/i
    ];
    
    const containsJobTitleKeyword = jobTitlePatterns.some(pattern => pattern.test(trimmed));
    
    return hasJobTitleCharacteristics || (containsJobTitleKeyword && !isDateRange(trimmed));
  };

  // Function to determine if line contains a date range
  const isDateRange = (line: string): boolean => {
    // Common date range patterns
    return (
      /\d{4}[\s-]+.*?(\d{4}|present|current|now)/i.test(line) || 
      /(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*[\s\.,]+\d{4}\s+[-–—]\s+(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Present|Current|Now)/i.test(line)
    );
  };

  // Enhanced function to extract name and contact info
  const extractContactInfo = (): { name: string; contactInfo: string[] } => {
    let name = "";
    const contactInfo: string[] = [];
    let nameFound = false;
    
    // Look at the first several lines to find name and contact info
    for (let i = 0; i < Math.min(15, lines.length); i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (line === "") continue;
      
      // If we haven't found a name yet and this doesn't look like contact info, it's probably the name
      if (!nameFound && 
          !line.includes('@') && 
          !line.match(/^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/) && // Phone number pattern
          !line.match(/^https?:\/\//) && // URL pattern
          !line.match(/^www\./) && // URL pattern
          !line.match(/^\d+\s+[\w\s]+,/) && // Address pattern
          !line.match(/^\(.+\)$/) && // Text in parentheses (likely not name)
          !line.match(/\d{1,2}\/\d{1,2}\/\d{2,4}/) && // Not a date
          !isSectionHeader(line, i)) {
        name = line;
        nameFound = true;
        continue;
      }
      
      // If it looks like contact info, add it
      if ((line.includes('@') || // Email
           line.match(/^\d{3}[-.\s]?\d{3}[-.\s]?\d{4}$/) || // Phone number
           line.match(/^[\d\-+().\s]{10,}$/) || // Another phone pattern
           line.match(/^https?:\/\//) || // URL
           line.match(/^www\./) || // URL
           line.includes('linkedin.com') || // LinkedIn
           line.includes('github.com') || // GitHub
           line.match(/^\d+\s+[\w\s]+,/)) && // Address pattern
          !isSectionHeader(line, i)) { 
        contactInfo.push(line);
      }
      
      // If we've found a section header and we have some contact info, stop looking
      if (isSectionHeader(line, i) && nameFound && contactInfo.length > 0) {
        break;
      }
    }
    
    return { name, contactInfo };
  };

  const { name, contactInfo } = extractContactInfo();

  // Check for summary content parsing
  console.log("Extracted name:", name);
  console.log("Extracted contact info:", contactInfo);

  // Function to determine if a line is a bullet point
  const isBulletPoint = (line: string): boolean => {
    const trimmed = line.trim();
    return trimmed.startsWith('•') || 
           trimmed.startsWith('-') || 
           trimmed.startsWith('*') || 
           trimmed.startsWith('○') ||
           trimmed.startsWith('◦') ||
           /^\d+\.\s/.test(trimmed);  // Numbered bullets like "1. "
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
      {/* Display name and contact info at the top */}
      <div className="contact-header mb-6 text-center">
        {name && (
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{name}</h1>
        )}
        {contactInfo.length > 0 && (
          <div className="contact-details text-sm text-gray-600">
            {contactInfo.map((info, index) => (
              <span key={index} className="mx-1">
                {info}
                {index < contactInfo.length - 1 && " • "}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="pdf-content" style={{ fontSize: '10pt' }}>
        {lines.map((line, index) => {
          // Skip lines already used for name and contact info
          if (index < 15 && (line.trim() === name || contactInfo.includes(line.trim()) || line.trim() === "")) {
            return null;
          }
          
          if (isSectionHeader(line, index)) {
            // Add more space before section headers (except the first one)
            const topMargin = index > 0 ? 'mt-6' : '';
            return (
              <h2 key={index} className={`text-lg font-bold text-slate-800 ${topMargin} mb-3 border-b border-slate-300 pb-1 uppercase`}>
                {line.trim()}
              </h2>
            );
          } else if (line.trim().length === 0) {
            // Add appropriate spacing for blank lines
            return <div key={index} style={{ height: '0.5em' }}></div>;
          } else {
            // Check if this might be a bullet point
            if (isBulletPoint(line)) {
              return (
                <p key={index} className="my-1 ml-4 text-slate-700" style={{ 
                  lineHeight: '1.4', 
                  textIndent: '-1em', 
                  paddingLeft: '1em',
                  marginBottom: '0.25em'
                }}>
                  {line.trim()}
                </p>
              );
            } else if (isDateRange(line)) {
              // This looks like a date range, make it stand out
              return (
                <p key={index} className="my-1 font-semibold text-slate-600 italic" style={{ lineHeight: '1.4' }}>
                  {line.trim()}
                </p>
              );
            } else if (isJobTitleOrCompany(line, index)) {
              // This could be a job title or company name
              return (
                <p key={index} className="mt-3 mb-1 font-semibold text-slate-800" style={{ lineHeight: '1.4' }}>
                  {line.trim()}
                </p>
              );
            } else {
              // Regular paragraph
              return (
                <p key={index} className="my-1 text-slate-700" style={{ 
                  lineHeight: '1.4',
                  marginBottom: '0.25em' 
                }}>
                  {line.trim()}
                </p>
              );
            }
          }
        })}
      </div>
    </div>
  );
};
