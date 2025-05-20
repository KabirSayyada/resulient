
import React from 'react';

interface ATSFriendlyResumePdfTemplateProps {
  content: string;
  jobTitle?: string;
}

export const ATSFriendlyResumePdfTemplate = ({ content, jobTitle }: ATSFriendlyResumePdfTemplateProps) => {
  // Parse the resume content into sections for better formatting
  const processResumeContent = (content: string) => {
    const lines = content.split('\n');
    const sections: { type: string; content: string; level?: number }[] = [];
    
    // Common section headers in resumes for detection
    const sectionHeaders = [
      'CONTACT', 'PROFILE', 'SUMMARY', 'PROFESSIONAL SUMMARY', 'OBJECTIVE',
      'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY', 'PROFESSIONAL EXPERIENCE',
      'EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS',
      'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'KEY SKILLS',
      'CERTIFICATIONS', 'LICENSES', 'CREDENTIALS',
      'PROJECTS', 'ACHIEVEMENTS', 'ACCOMPLISHMENTS',
      'LANGUAGES', 'REFERENCES', 'PUBLICATIONS', 'INTERESTS'
    ];

    let currentSection = '';
    let companyOrRole = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines
      if (line === '') {
        if (i > 0 && lines[i-1].trim() !== '') {
          sections.push({ type: 'spacer', content: '' });
        }
        continue;
      }
      
      // Check if this line is a section header
      const isHeader = sectionHeaders.some(header => 
        line.toUpperCase() === header || 
        line.toUpperCase().includes(header)
      );
      
      if (isHeader) {
        currentSection = line.toUpperCase();
        sections.push({ type: 'header', content: line });
        companyOrRole = currentSection.includes('EXPERIENCE');
        continue;
      }
      
      // Date ranges are typically formatted like 2018-2020 or May 2018 - Present
      const isDateRange = /(\b\d{4}\b.*\b(to|[-–—])\b.*(\b\d{4}\b|present|current|now))/i.test(line) ||
                          /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec).*\d{4}.*\b(to|[-–—])\b/i.test(line);
      
      if (isDateRange) {
        sections.push({ type: 'date', content: line });
        continue;
      }
      
      // Likely company name or job title after a section header or date range
      if (companyOrRole && (sections[sections.length-1]?.type === 'header' || sections[sections.length-1]?.type === 'date')) {
        sections.push({ type: 'role', content: line });
        continue;
      }
      
      // Check for bullet points
      if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        sections.push({ type: 'bullet', content: line });
        continue;
      }
      
      // Default to paragraph text
      sections.push({ type: 'text', content: line });
    }
    
    return sections;
  };
  
  const sections = processResumeContent(content);
  
  return (
    <div className="ats-resume-template p-8 bg-white text-black" style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.5',
      maxWidth: '100%',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Optional Job Title */}
      {jobTitle && (
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Resume for: {jobTitle}</h2>
        </div>
      )}

      {/* Contact Information Section */}
      <div className="contact-section mb-6">
        {sections.slice(0, 5).some(section => 
          section.content.includes('@') || 
          /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(section.content) || 
          /linkedin\.com/.test(section.content)
        ) && (
          <h2 className="text-lg font-bold uppercase text-gray-800 border-b-2 border-gray-300 pb-1 mb-3">
            CONTACT INFORMATION
          </h2>
        )}
        
        {sections.slice(0, 5).map((section, index) => {
          // Only render contact-like information at the top
          if (index < 5 && (
            section.content.includes('@') || 
            /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(section.content) ||
            /linkedin\.com/.test(section.content) ||
            // Name is typically at the very top
            (index === 0 && section.type === 'text' && !section.content.includes(':'))
          )) {
            return (
              <div key={`contact-${index}`} className="mb-1">
                {index === 0 && section.type === 'text' ? (
                  // This is likely the name
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">{section.content}</h1>
                ) : (
                  <p className="text-gray-700">{section.content}</p>
                )}
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Main Resume Content */}
      <div className="resume-content">
        {sections.map((section, index) => {
          switch (section.type) {
            case 'header':
              return (
                <h2 
                  key={`section-${index}`} 
                  className="text-lg font-bold uppercase text-gray-800 border-b-2 border-gray-300 pb-1 mt-6 mb-3"
                >
                  {section.content}
                </h2>
              );
              
            case 'role':
              return (
                <h3 
                  key={`role-${index}`} 
                  className="text-base font-bold text-gray-800 mt-4 mb-1"
                >
                  {section.content}
                </h3>
              );
              
            case 'date':
              return (
                <p 
                  key={`date-${index}`} 
                  className="text-sm text-gray-600 font-italic mb-2"
                  style={{ fontStyle: 'italic' }}
                >
                  {section.content}
                </p>
              );
              
            case 'bullet':
              return (
                <p 
                  key={`bullet-${index}`} 
                  className="ml-5 mb-1 text-gray-700"
                  style={{ textIndent: '-1em', paddingLeft: '1em' }}
                >
                  {section.content}
                </p>
              );
              
            case 'text':
              // Skip contact info that we already displayed at the top
              if (index < 5 && (
                section.content.includes('@') || 
                /\d{3}[-.]?\d{3}[-.]?\d{4}/.test(section.content) ||
                /linkedin\.com/.test(section.content) ||
                (index === 0 && !section.content.includes(':'))
              )) {
                return null;
              }
              
              return (
                <p key={`text-${index}`} className="mb-2 text-gray-700">
                  {section.content}
                </p>
              );
              
            case 'spacer':
              return <div key={`spacer-${index}`} className="my-2"></div>;
              
            default:
              return null;
          }
        })}
      </div>

      {/* ATS Optimization Note */}
      <div className="ats-note text-xs text-gray-500 mt-8 pt-2 border-t border-gray-200">
        This resume has been formatted for optimal ATS compatibility
      </div>
    </div>
  );
};
