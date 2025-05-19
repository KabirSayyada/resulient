
import React from 'react';

interface ATSFriendlyResumePdfTemplateProps {
  content: string;
  jobTitle?: string;
}

export const ATSFriendlyResumePdfTemplate = ({ content, jobTitle }: ATSFriendlyResumePdfTemplateProps) => {
  // Process the content to remove confusing characters
  const cleanedContent = content
    .replace(/\*/g, '') // Remove asterisks 
    .replace(/\*\*/g, '') // Remove double asterisks
    .replace(/[^\w\s.,():;'"-]/g, ' ') // Replace other special characters with spaces
    .replace(/\s+/g, ' '); // Normalize spaces
  
  const lines = cleanedContent.split('\n');
  
  // Try to identify the name at the top of the resume
  const potentialName = lines.length > 0 ? lines[0].trim() : '';
  const hasNameAtTop = potentialName.length > 0 && 
                      potentialName.length < 50 && 
                      !potentialName.includes('@') &&
                      !/^\d+/.test(potentialName);
  
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

  // Function to determine if line is likely a job title or company
  const isJobTitleOrCompany = (line: string, index: number): boolean => {
    const trimmed = line.trim();
    return (
      trimmed.length > 0 &&
      trimmed.length < 80 &&
      index > 0 && 
      (lines[index-1].trim() === '' || isSectionHeader(lines[index-1], index-1)) &&
      !trimmed.startsWith('•') &&
      !trimmed.startsWith('-') &&
      !/^\d{1,2}\/\d{1,2}\/\d{2,4}/.test(trimmed) && // Not a date like 5/19/2025
      !/^\d{1,2}-\d{1,2}-\d{2,4}/.test(trimmed) // Not a date like 5-19-2025
    );
  };

  // Function to determine if line contains a date range
  const isDateRange = (line: string): boolean => {
    return /\d{4}[\s-]+.*?(\d{4}|present|current|now)/i.test(line);
  };
  
  // Skip the name line if it appears in both places (top and within content)
  const displayLines = hasNameAtTop ? lines.filter((line, index) => 
    index === 0 || line.trim() !== potentialName) : lines;

  return (
    <div className="ats-resume-template p-8 bg-white text-black font-sans" style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.5',
      fontSize: '11pt',
      maxWidth: '100%',
      overflowX: 'hidden',
      pageBreakInside: 'avoid'
    }}>
      {/* Only show job title if provided */}
      {jobTitle && (
        <h2 className="text-lg text-center text-slate-700 mb-4">For: {jobTitle}</h2>
      )}
      
      {/* If we identified a name at the top, show it prominently */}
      {hasNameAtTop && (
        <h1 className="text-xl font-bold text-center text-slate-900 mb-6">
          {potentialName}
        </h1>
      )}

      <div className="pdf-content" style={{ fontSize: '10pt' }}>
        {displayLines.map((line, index) => {
          if (isSectionHeader(line, index)) {
            // Add more space before section headers (except the first one)
            const topMargin = index > 0 ? 'mt-6' : '';
            return (
              <h2 key={index} className={`text-lg font-bold text-slate-800 ${topMargin} mb-3 border-b border-slate-300 pb-2 uppercase`}>
                {line.trim()}
              </h2>
            );
          } else if (line.trim().length === 0) {
            // Add appropriate spacing for blank lines
            return <div key={index} style={{ height: '0.75em' }}></div>;
          } else {
            // Check if this might be a bullet point
            if (line.trim().startsWith('•') || line.trim().startsWith('-')) {
              return (
                <p key={index} className="my-1 ml-4 text-slate-700" style={{ lineHeight: '1.4', textIndent: '-1em', paddingLeft: '1em' }}>
                  {line.trim()}
                </p>
              );
            } else if (isDateRange(line)) {
              // This looks like a date range, make it stand out
              return (
                <p key={index} className="my-1 font-semibold text-slate-700" style={{ lineHeight: '1.4' }}>
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
                <p key={index} className="my-1 text-slate-700" style={{ lineHeight: '1.4' }}>
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
