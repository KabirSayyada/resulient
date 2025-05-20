
import React from 'react';
import { extractCandidateName, identifyResumeSections } from '@/utils/resumeFormatters';

interface ATSFriendlyResumePdfTemplateProps {
  content: string;
  jobTitle?: string;
}

export const ATSFriendlyResumePdfTemplate = ({ content, jobTitle }: ATSFriendlyResumePdfTemplateProps) => {
  // Extract candidate name if possible
  const candidateName = extractCandidateName(content);
  
  // Split content into lines
  const lines = content.split('\n');
  
  // Extract contact information (email, phone, LinkedIn)
  const contactInfoRegex = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(\+?[\d\s\(\)-]{10,})|((https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+)/g;
  const contactInfo = content.match(contactInfoRegex) || [];
  
  // Process sections for better organization in PDF
  const sections = identifyResumeSections(content);
  
  return (
    <div className="ats-resume-template p-8 bg-white text-black font-sans" style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.5',
      fontSize: '11pt',
      maxWidth: '100%',
      overflowX: 'hidden',
      pageBreakInside: 'avoid'
    }}>
      {/* Header section with name and contact info */}
      <div className="header-section text-center mb-6">
        {candidateName && (
          <h1 className="text-2xl font-bold text-slate-800 mb-2">{candidateName}</h1>
        )}
        {contactInfo.length > 0 && (
          <div className="contact-info text-sm text-slate-600 mb-2">
            {contactInfo.map((contact, idx) => (
              <span key={idx} className="mx-1">{contact} {idx < contactInfo.length - 1 ? '|' : ''}</span>
            ))}
          </div>
        )}
        {jobTitle && (
          <div className="text-md text-slate-700 mt-2">For: {jobTitle}</div>
        )}
      </div>

      {/* Main content section */}
      <div className="pdf-content">
        {/* Render each section */}
        {Object.entries(sections).map(([sectionName, sectionContent], sectionIndex) => {
          // Skip the header section as we've already rendered it above
          if (sectionName === 'HEADER') return null;
          
          return (
            <div key={sectionIndex} className="resume-section mb-4">
              <h2 className="text-lg font-bold text-slate-800 mb-2 border-b border-slate-300 pb-1 uppercase">
                {sectionName}
              </h2>
              <div className="section-content">
                {sectionContent.split('\n').map((line, lineIndex) => {
                  const trimmedLine = line.trim();
                  if (!trimmedLine) return null;
                  
                  // Detect if this is a bullet point
                  if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-') || trimmedLine.startsWith('*')) {
                    return (
                      <p 
                        key={lineIndex} 
                        className="my-1 ml-4 text-slate-700" 
                        style={{ lineHeight: '1.4', textIndent: '-1em', paddingLeft: '1em' }} 
                        data-bullet-point="true"
                      >
                        {trimmedLine}
                      </p>
                    );
                  }
                  
                  // Detect if this is a date range
                  if (/\d{4}[\s-]+.*?(\d{4}|present|current|now)/i.test(trimmedLine)) {
                    return (
                      <p 
                        key={lineIndex} 
                        className="my-1 italic text-slate-600" 
                        style={{ lineHeight: '1.4' }} 
                        data-date-range="true"
                      >
                        {trimmedLine}
                      </p>
                    );
                  }
                  
                  // Detect if this looks like a job title or company
                  if (trimmedLine.length > 0 && 
                      trimmedLine.length < 80 && 
                      !trimmedLine.startsWith('•') && 
                      !trimmedLine.startsWith('-')) {
                    return (
                      <p 
                        key={lineIndex} 
                        className="mt-3 mb-1 font-bold text-slate-800" 
                        style={{ lineHeight: '1.4' }} 
                        data-job-title="true"
                      >
                        {trimmedLine}
                      </p>
                    );
                  }
                  
                  // Regular paragraph
                  return (
                    <p 
                      key={lineIndex} 
                      className="my-1 text-slate-700" 
                      style={{ lineHeight: '1.4' }} 
                      data-regular-text="true"
                    >
                      {trimmedLine}
                    </p>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
