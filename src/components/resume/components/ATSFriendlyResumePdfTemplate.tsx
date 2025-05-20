
import React from 'react';

interface ATSFriendlyResumePdfTemplateProps {
  content: string;
  jobTitle?: string;
}

export const ATSFriendlyResumePdfTemplate = ({ content, jobTitle }: ATSFriendlyResumePdfTemplateProps) => {
  const currentDate = new Date();
  const formattedDate = currentDate.toLocaleDateString();
  
  // Parse and structure the resume content
  const resumeStructure = parseResumeContent(content);
  
  return (
    <div className="ats-resume-template p-8 bg-white text-black font-sans" style={{ 
      fontFamily: 'Arial, sans-serif', 
      lineHeight: '1.5',
      fontSize: '11pt',
      maxWidth: '100%',
      overflowX: 'hidden',
      pageBreakInside: 'avoid'
    }}>
      {/* Contact Info Section */}
      <div className="contact-info text-center mb-6">
        {resumeStructure.name && (
          <h1 className="text-xl font-bold text-slate-800 mb-2" style={{ 
            borderBottom: '0px', 
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {resumeStructure.name}
          </h1>
        )}
        
        <div className="contact-details flex flex-wrap justify-center gap-3 text-sm text-slate-600">
          {resumeStructure.contactInfo.map((item, index) => (
            <span key={index} className="inline-flex items-center">
              {index > 0 && <span className="mx-1">•</span>}
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* Resume Body */}
      <div className="resume-body" style={{ fontSize: '10pt' }}>
        {/* Professional Summary Section */}
        {resumeStructure.sections.summary && (
          <div className="section mb-5">
            <h2 className="section-heading text-md font-bold text-slate-800 mb-2 pb-1" style={{ 
              borderBottom: '1px solid #CBD5E1', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Professional Summary
            </h2>
            <div className="section-content text-slate-700">
              {resumeStructure.sections.summary.map((paragraph, index) => (
                <p key={index} className="mb-1" style={{ lineHeight: '1.4' }}>
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Experience Section */}
        {resumeStructure.sections.experience && (
          <div className="section mb-5">
            <h2 className="section-heading text-md font-bold text-slate-800 mb-2 pb-1" style={{ 
              borderBottom: '1px solid #CBD5E1', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Professional Experience
            </h2>
            <div className="section-content">
              {resumeStructure.sections.experience.map((job, jobIndex) => (
                <div key={jobIndex} className="job-entry mb-4">
                  {/* Job Title & Company */}
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      {job.title && (
                        <h3 className="job-title font-bold text-slate-800" style={{ lineHeight: '1.3' }}>
                          {job.title}
                        </h3>
                      )}
                      {job.company && (
                        <div className="company text-slate-700 font-medium">
                          {job.company}
                          {job.location && <span className="location ml-1 font-normal">• {job.location}</span>}
                        </div>
                      )}
                    </div>
                    {job.dates && (
                      <div className="dates text-slate-600 text-xs font-normal italic whitespace-nowrap ml-2">
                        {job.dates}
                      </div>
                    )}
                  </div>
                  
                  {/* Job Description & Responsibilities */}
                  <div className="responsibilities mt-1">
                    {job.responsibilities.map((item, index) => (
                      <div key={index} className="responsibility ml-4 pl-2 mb-1 text-slate-700" style={{ 
                        position: 'relative',
                        lineHeight: '1.4',
                        textIndent: '-0.75rem'
                      }}>
                        <span className="mr-1">•</span>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Education Section */}
        {resumeStructure.sections.education && (
          <div className="section mb-5">
            <h2 className="section-heading text-md font-bold text-slate-800 mb-2 pb-1" style={{ 
              borderBottom: '1px solid #CBD5E1', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Education
            </h2>
            <div className="section-content">
              {resumeStructure.sections.education.map((edu, eduIndex) => (
                <div key={eduIndex} className="education-entry mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      {edu.degree && (
                        <h3 className="degree font-bold text-slate-800" style={{ lineHeight: '1.3' }}>
                          {edu.degree}
                        </h3>
                      )}
                      {edu.institution && (
                        <div className="institution text-slate-700">
                          {edu.institution}
                          {edu.location && <span className="location ml-1 font-normal">• {edu.location}</span>}
                        </div>
                      )}
                    </div>
                    {edu.dates && (
                      <div className="dates text-slate-600 text-xs font-normal italic whitespace-nowrap ml-2">
                        {edu.dates}
                      </div>
                    )}
                  </div>
                  
                  {/* Additional Education Details */}
                  {edu.details && edu.details.length > 0 && (
                    <div className="education-details mt-1">
                      {edu.details.map((detail, index) => (
                        <div key={index} className="ml-4 pl-2 mb-1 text-slate-700" style={{ 
                          lineHeight: '1.4',
                          textIndent: '-0.75rem'
                        }}>
                          <span className="mr-1">•</span>
                          {detail}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Skills Section */}
        {resumeStructure.sections.skills && (
          <div className="section mb-5">
            <h2 className="section-heading text-md font-bold text-slate-800 mb-2 pb-1" style={{ 
              borderBottom: '1px solid #CBD5E1', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Skills
            </h2>
            <div className="section-content skills-list">
              <div className="flex flex-wrap gap-1">
                {resumeStructure.sections.skills.map((skill, index) => (
                  <span key={index} className="skill-item bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md mb-1 mr-1">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Certifications Section */}
        {resumeStructure.sections.certifications && (
          <div className="section mb-5">
            <h2 className="section-heading text-md font-bold text-slate-800 mb-2 pb-1" style={{ 
              borderBottom: '1px solid #CBD5E1', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Certifications
            </h2>
            <div className="section-content">
              {resumeStructure.sections.certifications.map((cert, certIndex) => (
                <div key={certIndex} className="certification-entry mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      {cert.name && (
                        <h3 className="cert-name font-bold text-slate-800" style={{ lineHeight: '1.3' }}>
                          {cert.name}
                        </h3>
                      )}
                      {cert.issuer && (
                        <div className="issuer text-slate-700">
                          {cert.issuer}
                        </div>
                      )}
                    </div>
                    {cert.date && (
                      <div className="date text-slate-600 text-xs font-normal italic whitespace-nowrap ml-2">
                        {cert.date}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Sections */}
        {resumeStructure.additionalSections.map((section, sectionIndex) => (
          <div key={sectionIndex} className="section mb-5">
            <h2 className="section-heading text-md font-bold text-slate-800 mb-2 pb-1" style={{ 
              borderBottom: '1px solid #CBD5E1', 
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {section.title}
            </h2>
            <div className="section-content">
              {section.content.map((item, itemIndex) => (
                <div key={itemIndex} className={`mb-1 ${item.startsWith('•') || item.startsWith('-') ? 'ml-4 pl-2' : ''} text-slate-700`} style={{ 
                  lineHeight: '1.4',
                  textIndent: item.startsWith('•') || item.startsWith('-') ? '-0.75rem' : '0'
                }}>
                  {item}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="pdf-footer mt-6 pt-2 text-center text-xs text-slate-500">
        <p>This resume has been optimized for Applicant Tracking Systems (ATS)</p>
        {jobTitle && (
          <p className="mt-1">Tailored for: {jobTitle}</p>
        )}
      </div>
    </div>
  );
};

// Helper function to parse and structure resume content
function parseResumeContent(content: string) {
  // Initialize resume structure with defaults
  const resumeStructure = {
    name: '',
    contactInfo: [] as string[],
    sections: {
      summary: [] as string[],
      experience: [] as {
        title: string;
        company: string;
        location: string;
        dates: string;
        responsibilities: string[];
      }[],
      education: [] as {
        degree: string;
        institution: string;
        location: string;
        dates: string;
        details: string[];
      }[],
      skills: [] as string[],
      certifications: [] as {
        name: string;
        issuer: string;
        date: string;
      }[]
    },
    additionalSections: [] as {
      title: string;
      content: string[];
    }[]
  };

  // First, split content into lines and clean them up
  const lines = content.split('\n').map(line => line.trim()).filter(line => line !== '');
  
  // Identify potential contact information from the first few lines
  extractContactInfo(lines.slice(0, 10), resumeStructure);
  
  // Identify and extract sections from the resume
  let currentSection = '';
  let currentSectionContent: string[] = [];
  let experienceObject: any = null;
  let educationObject: any = null;
  let certificationObject: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Check if this is a section header
    if (isSectionHeader(line)) {
      // Process previous section before moving to new one
      if (currentSection && currentSectionContent.length > 0) {
        processSection(currentSection, currentSectionContent, resumeStructure);
      }
      
      // Start new section
      currentSection = normalizeSectionHeader(line);
      currentSectionContent = [];
      
      // Reset section objects
      if (currentSection === 'EXPERIENCE' || currentSection === 'PROFESSIONAL EXPERIENCE' || currentSection === 'WORK EXPERIENCE') {
        experienceObject = null;
      } else if (currentSection === 'EDUCATION') {
        educationObject = null;
      } else if (currentSection === 'CERTIFICATIONS') {
        certificationObject = null;
      }
    } 
    // Check if this is likely the start of a new job or education entry
    else if (currentSection === 'EXPERIENCE' || currentSection === 'PROFESSIONAL EXPERIENCE' || currentSection === 'WORK EXPERIENCE') {
      if (isJobTitleOrCompany(line, lines[i+1] || '')) {
        // Save current experience object if it exists
        if (experienceObject && experienceObject.title) {
          resumeStructure.sections.experience.push({...experienceObject});
        }
        
        // Start new experience entry
        experienceObject = {
          title: line,
          company: '',
          location: '',
          dates: '',
          responsibilities: []
        };
        
        // Check next line for company and/or date
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          
          // Extract company, location, dates
          const companyDateInfo = extractCompanyAndDates(nextLine);
          if (companyDateInfo.company) {
            experienceObject.company = companyDateInfo.company;
            i++; // Skip the next line since we've processed it
            
            if (companyDateInfo.location) {
              experienceObject.location = companyDateInfo.location;
            }
            
            if (companyDateInfo.dates) {
              experienceObject.dates = companyDateInfo.dates;
            } else if (i + 1 < lines.length && isDateRange(lines[i + 1])) {
              // If next line is just a date range
              experienceObject.dates = lines[i + 1];
              i++;
            }
          }
        }
      } 
      else if (experienceObject && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))) {
        // This is a responsibility bullet point
        experienceObject.responsibilities.push(line.replace(/^[•\-*]\s*|\d+\.\s*/, '').trim());
      }
      else if (experienceObject && isDateRange(line)) {
        // This is just a date line
        experienceObject.dates = line;
      }
      else if (experienceObject && !experienceObject.company && !line.startsWith('•')) {
        // This might be a company name
        const companyDateInfo = extractCompanyAndDates(line);
        if (companyDateInfo.company) {
          experienceObject.company = companyDateInfo.company;
          
          if (companyDateInfo.location) {
            experienceObject.location = companyDateInfo.location;
          }
          
          if (companyDateInfo.dates) {
            experienceObject.dates = companyDateInfo.dates;
          }
        }
      }
      else if (experienceObject) {
        // This must be part of the job description or another responsibility
        if (line.length > 10 && !experienceObject.responsibilities.includes(line)) {
          experienceObject.responsibilities.push(line);
        }
      }
    }
    else if (currentSection === 'EDUCATION') {
      if (isEducationDegree(line)) {
        // Save current education object if it exists
        if (educationObject && educationObject.degree) {
          resumeStructure.sections.education.push({...educationObject});
        }
        
        // Start new education entry
        educationObject = {
          degree: line,
          institution: '',
          location: '',
          dates: '',
          details: []
        };
        
        // Check next line for institution and/or date
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          
          // Extract institution, location, dates
          const institutionInfo = extractInstitutionAndDates(nextLine);
          if (institutionInfo.institution) {
            educationObject.institution = institutionInfo.institution;
            i++; // Skip the next line since we've processed it
            
            if (institutionInfo.location) {
              educationObject.location = institutionInfo.location;
            }
            
            if (institutionInfo.dates) {
              educationObject.dates = institutionInfo.dates;
            } else if (i + 1 < lines.length && isDateRange(lines[i + 1])) {
              // If next line is just a date range
              educationObject.dates = lines[i + 1];
              i++;
            }
          }
        }
      }
      else if (educationObject && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*') || /^\d+\./.test(line))) {
        // This is an education detail bullet point
        educationObject.details.push(line.replace(/^[•\-*]\s*|\d+\.\s*/, '').trim());
      }
      else if (educationObject && isDateRange(line)) {
        // This is just a date line
        educationObject.dates = line;
      }
      else if (educationObject && !educationObject.institution) {
        // This might be an institution name
        const institutionInfo = extractInstitutionAndDates(line);
        if (institutionInfo.institution) {
          educationObject.institution = institutionInfo.institution;
          
          if (institutionInfo.location) {
            educationObject.location = institutionInfo.location;
          }
          
          if (institutionInfo.dates) {
            educationObject.dates = institutionInfo.dates;
          }
        }
      }
    }
    else if (currentSection === 'CERTIFICATIONS' || currentSection === 'LICENSES' || currentSection === 'CREDENTIALS') {
      if (isCertification(line)) {
        // Save current certification object if it exists
        if (certificationObject && certificationObject.name) {
          resumeStructure.sections.certifications.push({...certificationObject});
        }
        
        // Start new certification entry
        certificationObject = {
          name: line,
          issuer: '',
          date: ''
        };
        
        // Check next line for issuer and/or date
        if (i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          
          // Extract issuer and date
          const certInfo = extractCertificationInfo(nextLine);
          if (certInfo.issuer) {
            certificationObject.issuer = certInfo.issuer;
            i++; // Skip the next line since we've processed it
            
            if (certInfo.date) {
              certificationObject.date = certInfo.date;
            } else if (i + 1 < lines.length && isDateRange(lines[i + 1])) {
              // If next line is just a date
              certificationObject.date = lines[i + 1];
              i++;
            }
          }
        }
      }
      else if (certificationObject && isDateRange(line)) {
        // This is just a date line
        certificationObject.date = line;
      }
      else if (certificationObject && !certificationObject.issuer) {
        // This might be an issuer
        const certInfo = extractCertificationInfo(line);
        if (certInfo.issuer) {
          certificationObject.issuer = certInfo.issuer;
          
          if (certInfo.date) {
            certificationObject.date = certInfo.date;
          }
        }
      }
    }
    else if (currentSection === 'SKILLS' || currentSection === 'TECHNICAL SKILLS') {
      // For skills, we'll look for comma-separated or bullet lists
      if (line.includes(',')) {
        // Comma-separated skills
        const skillItems = line.split(',').map(skill => skill.trim()).filter(skill => skill);
        resumeStructure.sections.skills.push(...skillItems);
      } 
      else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
        // Bullet point skills
        const skill = line.replace(/^[•\-*]\s*/, '').trim();
        if (skill) resumeStructure.sections.skills.push(skill);
      }
      else if (line.length > 0 && line.length < 50) {
        // Might be a single skill or category
        resumeStructure.sections.skills.push(line);
      }
    }
    else if (currentSection === 'SUMMARY' || currentSection === 'PROFESSIONAL SUMMARY' || currentSection === 'PROFILE') {
      // Add to summary
      currentSectionContent.push(line);
    }
    else {
      // For other sections, just collect content
      currentSectionContent.push(line);
    }
  }
  
  // Process final section
  if (currentSection && currentSectionContent.length > 0) {
    processSection(currentSection, currentSectionContent, resumeStructure);
  }
  
  // Add final job experience if exists
  if (experienceObject && experienceObject.title) {
    resumeStructure.sections.experience.push({...experienceObject});
  }
  
  // Add final education if exists
  if (educationObject && educationObject.degree) {
    resumeStructure.sections.education.push({...educationObject});
  }
  
  // Add final certification if exists
  if (certificationObject && certificationObject.name) {
    resumeStructure.sections.certifications.push({...certificationObject});
  }
  
  // If we couldn't extract a name, try to get it from the first line
  if (!resumeStructure.name && lines.length > 0) {
    const potentialName = lines[0];
    if (potentialName.length < 60 && !/[,@]/.test(potentialName)) {
      resumeStructure.name = potentialName;
    }
  }
  
  return resumeStructure;
}

// Function to check if a line is likely a section header
function isSectionHeader(line: string): boolean {
  const normalizedLine = line.toUpperCase();
  
  // Common section headers
  const sectionHeaders = [
    'SUMMARY', 'PROFESSIONAL SUMMARY', 'PROFILE', 'OBJECTIVE', 
    'EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY',
    'EDUCATION', 'ACADEMIC BACKGROUND',
    'SKILLS', 'TECHNICAL SKILLS', 'COMPETENCIES', 'CORE COMPETENCIES',
    'CERTIFICATIONS', 'LICENSES', 'CREDENTIALS',
    'PROJECTS', 'ACHIEVEMENTS', 'AWARDS', 'HONORS',
    'VOLUNTEER EXPERIENCE', 'COMMUNITY SERVICE',
    'PROFESSIONAL AFFILIATIONS', 'MEMBERSHIPS',
    'PUBLICATIONS', 'PRESENTATIONS', 'RESEARCH',
    'LANGUAGES', 'ADDITIONAL INFORMATION', 'REFERENCES'
  ];

  // Check if the line matches any of the section headers
  return (
    sectionHeaders.includes(normalizedLine) ||
    sectionHeaders.some(header => normalizedLine === header) ||
    // Check for lines that are all caps and relatively short
    (normalizedLine === line && line.length < 30 && line.length > 3 && !/[,.:]/.test(line))
  );
}

// Function to normalize section headers
function normalizeSectionHeader(header: string): string {
  const normalizedHeader = header.toUpperCase().trim();
  
  // Map variations to standard headers
  const headerMappings: {[key: string]: string} = {
    'PROFESSIONAL SUMMARY': 'SUMMARY',
    'PROFILE': 'SUMMARY',
    'OBJECTIVE': 'SUMMARY',
    'PROFESSIONAL EXPERIENCE': 'EXPERIENCE',
    'WORK EXPERIENCE': 'EXPERIENCE',
    'EMPLOYMENT HISTORY': 'EXPERIENCE',
    'WORK HISTORY': 'EXPERIENCE',
    'ACADEMIC BACKGROUND': 'EDUCATION',
    'TECHNICAL SKILLS': 'SKILLS',
    'COMPETENCIES': 'SKILLS',
    'CORE COMPETENCIES': 'SKILLS',
    'LICENSES': 'CERTIFICATIONS',
    'CREDENTIALS': 'CERTIFICATIONS',
    'HONORS': 'AWARDS',
    'VOLUNTEER EXPERIENCE': 'VOLUNTEER',
    'COMMUNITY SERVICE': 'VOLUNTEER',
    'PROFESSIONAL AFFILIATIONS': 'AFFILIATIONS',
    'MEMBERSHIPS': 'AFFILIATIONS'
  };
  
  return headerMappings[normalizedHeader] || normalizedHeader;
}

// Process each section's content
function processSection(sectionName: string, content: string[], resumeStructure: any) {
  switch (sectionName) {
    case 'SUMMARY':
      resumeStructure.sections.summary = content;
      break;
      
    case 'SKILLS':
      // Process skills that might be in paragraph form
      content.forEach(line => {
        if (line.includes(',')) {
          // Split comma-separated skills
          const skills = line.split(',').map(s => s.trim()).filter(s => s);
          resumeStructure.sections.skills.push(...skills);
        } else if (line.startsWith('•') || line.startsWith('-')) {
          // Bullet point skill
          resumeStructure.sections.skills.push(line.replace(/^[•\-]\s*/, '').trim());
        } else if (line.length > 0) {
          // Single skill
          resumeStructure.sections.skills.push(line);
        }
      });
      break;
      
    default:
      // For any other sections, add them as additional sections
      if (!['EXPERIENCE', 'EDUCATION', 'CERTIFICATIONS'].includes(sectionName)) {
        resumeStructure.additionalSections.push({
          title: sectionName.charAt(0) + sectionName.slice(1).toLowerCase(),
          content: content
        });
      }
      break;
  }
}

// Extract contact information
function extractContactInfo(lines: string[], resumeStructure: any) {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
  const phoneRegex = /\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/;
  const linkedinRegex = /linkedin\.com\/in\/[A-Za-z0-9_-]+/;
  const websiteRegex = /https?:\/\/[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}/;
  const locationRegex = /[A-Z][a-z]+(?:[\s,]+[A-Z][a-z]+)*,\s*[A-Z]{2}/;

  const contactInfo: string[] = [];
  
  // If the first line is likely a name
  if (lines.length > 0 && lines[0].length < 50 && !emailRegex.test(lines[0]) && !phoneRegex.test(lines[0])) {
    resumeStructure.name = lines[0];
  }
  
  // Extract contact details from the first few lines
  for (const line of lines) {
    // Email
    const emailMatch = line.match(emailRegex);
    if (emailMatch && !contactInfo.includes(emailMatch[0])) {
      contactInfo.push(emailMatch[0]);
    }
    
    // Phone
    const phoneMatch = line.match(phoneRegex);
    if (phoneMatch && !contactInfo.includes(phoneMatch[0])) {
      contactInfo.push(phoneMatch[0]);
    }
    
    // LinkedIn
    const linkedinMatch = line.match(linkedinRegex);
    if (linkedinMatch && !contactInfo.includes(linkedinMatch[0])) {
      contactInfo.push(linkedinMatch[0]);
    }
    
    // Website
    const websiteMatch = line.match(websiteRegex);
    if (websiteMatch && !contactInfo.includes(websiteMatch[0]) && !line.includes('linkedin.com')) {
      contactInfo.push(websiteMatch[0]);
    }
    
    // Location
    const locationMatch = line.match(locationRegex);
    if (locationMatch && !contactInfo.includes(locationMatch[0])) {
      contactInfo.push(locationMatch[0]);
    }
  }
  
  resumeStructure.contactInfo = contactInfo;
}

// Check if a line is likely a job title or company
function isJobTitleOrCompany(line: string, nextLine: string): boolean {
  // Job titles are typically short, with specific keywords, and don't contain dates
  if (line.length > 60 || /\d{4}\s*[-–]\s*\d{4}|present/i.test(line)) {
    return false;
  }
  
  // Look for job title keywords
  const jobTitleKeywords = ['manager', 'director', 'associate', 'specialist', 'coordinator', 'analyst', 'engineer', 'developer', 'assistant', 'consultant', 'supervisor', 'lead', 'head', 'chief', 'senior', 'junior', 'intern', 'officer', 'administrator'];
  
  const containsJobKeyword = jobTitleKeywords.some(keyword => 
    line.toLowerCase().includes(keyword)
  );
  
  // Check if next line looks like a company or contains dates (common pattern)
  const nextLineHasCompanyPattern = /inc\.|corp\.|llc|ltd\.|\bco\.|\bat\b/i.test(nextLine);
  const nextLineHasDates = /\d{4}\s*[-–]\s*\d{4}|present/i.test(nextLine);
  
  return containsJobKeyword || nextLineHasCompanyPattern || nextLineHasDates;
}

// Extract company and dates from a line
function extractCompanyAndDates(line: string) {
  const result = {
    company: '',
    location: '',
    dates: ''
  };
  
  // Check for dates at the end or beginning of the line
  const dateRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4}\s*[-–]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*(\d{4}|Present|Current|Now)/i;
  
  const dateMatch = line.match(dateRegex);
  
  if (dateMatch) {
    // There's a date in this line
    result.dates = dateMatch[0].trim();
    
    // The company is likely the part before the date
    const companyPart = line.replace(dateMatch[0], '').trim();
    
    // Check if there's a location indicated by a comma or parentheses
    if (companyPart.includes(',')) {
      const parts = companyPart.split(',');
      result.company = parts[0].trim();
      result.location = parts.slice(1).join(',').trim();
    } else if (/\(.*\)/.test(companyPart)) {
      const locationMatch = companyPart.match(/\((.*)\)/);
      if (locationMatch) {
        result.location = locationMatch[1].trim();
        result.company = companyPart.replace(/\(.*\)/, '').trim();
      } else {
        result.company = companyPart;
      }
    } else {
      result.company = companyPart;
    }
  } else {
    // No date in this line, assume it's just the company
    // Check for location
    if (line.includes(',')) {
      const parts = line.split(',');
      result.company = parts[0].trim();
      result.location = parts.slice(1).join(',').trim();
    } else if (/\(.*\)/.test(line)) {
      const locationMatch = line.match(/\((.*)\)/);
      if (locationMatch) {
        result.location = locationMatch[1].trim();
        result.company = line.replace(/\(.*\)/, '').trim();
      } else {
        result.company = line;
      }
    } else {
      result.company = line;
    }
  }
  
  return result;
}

// Check if a line is a date range
function isDateRange(line: string): boolean {
  // Check for common date range formats
  const dateRangeRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4}\s*[-–]\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*(\d{4}|Present|Current|Now)/i;
  
  return dateRangeRegex.test(line) && line.length < 30;
}

// Check if a line is likely an education degree
function isEducationDegree(line: string): boolean {
  const degreeKeywords = ['bachelor', 'master', 'doctorate', 'phd', 'mba', 'bs', 'ba', 'ms', 'ma', 'associate', 'certificate', 'diploma', 'degree'];
  
  return degreeKeywords.some(keyword => line.toLowerCase().includes(keyword)) && line.length < 60;
}

// Extract institution and dates from a line
function extractInstitutionAndDates(line: string) {
  const result = {
    institution: '',
    location: '',
    dates: ''
  };
  
  // Check for dates at the end of the line
  const dateRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4}\s*[-–]?\s*(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December|Present|Current|Now)?/i;
  
  const dateMatch = line.match(dateRegex);
  
  if (dateMatch) {
    // There's a date in this line
    result.dates = dateMatch[0].trim();
    
    // The institution is likely the part before the date
    const institutionPart = line.replace(dateMatch[0], '').trim();
    
    // Check if there's a location indicated by a comma
    if (institutionPart.includes(',')) {
      const parts = institutionPart.split(',');
      result.institution = parts[0].trim();
      result.location = parts.slice(1).join(',').trim();
    } else {
      result.institution = institutionPart;
    }
  } else {
    // No date in this line, assume it's just the institution
    if (line.includes(',')) {
      const parts = line.split(',');
      result.institution = parts[0].trim();
      result.location = parts.slice(1).join(',').trim();
    } else {
      result.institution = line;
    }
  }
  
  return result;
}

// Check if a line is likely a certification
function isCertification(line: string): boolean {
  const certKeywords = ['certification', 'certificate', 'certified', 'license', 'credential'];
  
  return certKeywords.some(keyword => line.toLowerCase().includes(keyword)) || line.length < 60;
}

// Extract certification issuer and date
function extractCertificationInfo(line: string) {
  const result = {
    issuer: '',
    date: ''
  };
  
  // Check for dates
  const dateRegex = /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|January|February|March|April|May|June|July|August|September|October|November|December)?\s*\d{4}\b/i;
  
  const dateMatch = line.match(dateRegex);
  
  if (dateMatch) {
    // There's a date in this line
    result.date = dateMatch[0].trim();
    
    // The issuer is likely the part before the date
    result.issuer = line.replace(dateMatch[0], '').trim();
  } else {
    // No date, assume it's just the issuer
    result.issuer = line;
  }
  
  return result;
}
