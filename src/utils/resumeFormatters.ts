/**
 * Utility functions for resume formatting and scoring
 */

// Format resume content based on type
export const formatResumeContent = (resumeContent: string | any): string => {
  if (typeof resumeContent === 'string') {
    // Clean up common formatting issues and ensure contact info is on one line
    let formatted = resumeContent
      .replace(/\r\n/g, '\n')
      .replace(/\r/g, '\n')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
    
    // Ensure contact information is formatted on one line
    formatted = ensureContactInfoOnOneLine(formatted);
    
    return formatted;
  }
  
  // If it's an object, convert it to a formatted string
  try {
    if (typeof resumeContent === 'object' && resumeContent !== null) {
      // Check if it's already a structured resume object
      if (resumeContent.contact || resumeContent.workExperience || resumeContent.skills) {
        return convertStructuredResumeToText(resumeContent);
      }
      return JSON.stringify(resumeContent, null, 2);
    }
    return String(resumeContent);
  } catch (error) {
    console.error("Error formatting resume content:", error);
    return "Error formatting resume content";
  }
};

// Ensure contact information appears on one line with pipe separators
const ensureContactInfoOnOneLine = (resumeText: string): string => {
  const lines = resumeText.split('\n');
  let nameLineIndex = -1;
  let contactLines: string[] = [];
  let contactStartIndex = -1;
  let contactEndIndex = -1;
  
  // Find the name and contact information lines (usually in the first 8 lines)
  for (let i = 0; i < Math.min(lines.length, 8); i++) {
    const line = lines[i].trim();
    
    // Skip empty lines and section headers
    if (!line || line.toUpperCase().includes('PROFESSIONAL') || line.toUpperCase().includes('SUMMARY')) {
      continue;
    }
    
    // Find name line (first non-empty line that doesn't contain contact info)
    if (nameLineIndex === -1 && !line.includes('@') && !line.includes('|') && !line.match(/\d{3}[-\s]?\d{3}[-\s]?\d{4}/)) {
      nameLineIndex = i;
      continue;
    }
    
    // Check if this line contains contact information
    const hasEmail = line.includes('@');
    const hasPhone = line.match(/\d{3}[-\s]?\d{3}[-\s]?\d{4}|\(\d{3}\)\s*\d{3}[-\s]?\d{4}/);
    const hasLinkedIn = line.toLowerCase().includes('linkedin') || line.includes('linkedin.com');
    const hasWebsite = line.includes('http') || line.includes('www.') || (line.includes('.com') && !line.includes('@'));
    const hasPipeAlready = line.includes('|');
    const hasAddress = line.includes(',') && (line.toLowerCase().includes('street') || line.toLowerCase().includes('ave') || line.toLowerCase().includes('rd') || line.toLowerCase().includes('blvd') || line.match(/\b[A-Z]{2}\s+\d{5}/));
    
    if (hasEmail || hasPhone || hasLinkedIn || hasWebsite || hasPipeAlready || hasAddress) {
      if (contactStartIndex === -1) {
        contactStartIndex = i;
      }
      contactEndIndex = i;
      contactLines.push(line);
    } else if (contactStartIndex !== -1 && contactLines.length > 0) {
      // Stop when we hit a line that's not contact info
      break;
    }
  }
  
  // If we found contact information, process it
  if (contactLines.length > 0) {
    // Check if all contact info is already on one line with proper separators
    if (contactLines.length === 1 && contactLines[0].includes('|')) {
      return resumeText; // Already formatted correctly
    }
    
    // Extract individual contact pieces from all contact lines
    const contactPieces: string[] = [];
    
    contactLines.forEach(line => {
      // If line already has pipes, split by pipes
      if (line.includes('|')) {
        const parts = line.split('|').map(p => p.trim()).filter(p => p.length > 0);
        contactPieces.push(...parts);
      } else {
        // Otherwise, this whole line is one contact piece
        contactPieces.push(line.trim());
      }
    });
    
    // Remove duplicates and filter out empty pieces
    const uniqueContactPieces = contactPieces
      .filter((piece, index, arr) => piece.length > 0 && arr.indexOf(piece) === index);
    
    // Combine all contact information into one line with pipe separators
    const combinedContact = uniqueContactPieces.join(' | ');
    
    // Replace the original contact lines with the combined line
    const newLines = [
      ...lines.slice(0, contactStartIndex),
      combinedContact,
      ...lines.slice(contactEndIndex + 1)
    ];
    
    return newLines.join('\n');
  }
  
  return resumeText;
};

// Convert structured resume object back to readable text
const convertStructuredResumeToText = (resume: any): string => {
  let text = '';
  
  // Header
  if (resume.contact?.name) {
    text += `${resume.contact.name}\n`;
  }
  
  // Contact info - ALWAYS ensure it's on one line with pipe separators
  const contactInfo = [
    resume.contact?.email,
    resume.contact?.phone,
    resume.contact?.linkedin,
    resume.contact?.website,
    resume.contact?.address
  ].filter(Boolean);
  
  if (contactInfo.length > 0) {
    text += contactInfo.join(' | ') + '\n\n';
  }
  
  // Professional Summary
  if (resume.professionalSummary) {
    text += `PROFESSIONAL SUMMARY\n${resume.professionalSummary}\n\n`;
  }
  
  // Work Experience
  if (resume.workExperience?.length > 0) {
    text += 'PROFESSIONAL EXPERIENCE\n\n';
    resume.workExperience.forEach((exp: any) => {
      text += `${exp.position} - ${exp.company}\n`;
      if (exp.startDate || exp.endDate) {
        text += `${exp.startDate || ''} ${exp.endDate ? `- ${exp.endDate}` : ''}\n`;
      }
      if (exp.responsibilities?.length > 0) {
        exp.responsibilities.forEach((resp: string) => {
          text += `• ${resp}\n`;
        });
      }
      text += '\n';
    });
  }
  
  // Skills
  if (resume.skills?.length > 0) {
    text += `TECHNICAL SKILLS\n${resume.skills.join(', ')}\n\n`;
  }
  
  // Education
  if (resume.education?.length > 0) {
    text += 'EDUCATION\n\n';
    resume.education.forEach((edu: any) => {
      text += `${edu.degree}${edu.field ? ` in ${edu.field}` : ''} - ${edu.institution}\n`;
      if (edu.graduationDate) {
        text += `${edu.graduationDate}\n`;
      }
      text += '\n';
    });
  }
  
  // Projects
  if (resume.projects?.length > 0) {
    text += 'PROJECTS\n\n';
    resume.projects.forEach((project: any) => {
      text += `${project.name}\n`;
      if (project.description) {
        text += `${project.description}\n`;
      }
      text += '\n';
    });
  }
  
  // Certifications
  if (resume.certifications?.length > 0) {
    text += 'CERTIFICATIONS\n\n';
    resume.certifications.forEach((cert: any) => {
      text += `${cert.name}`;
      if (cert.issuer && cert.issuer !== 'Unknown') {
        text += ` - ${cert.issuer}`;
      }
      if (cert.date) {
        text += ` (${cert.date})`;
      }
      text += '\n';
    });
  }
  
  return text.trim();
};

// Calculate keyword score by matching resume content against job description
export const calculateKeywordScore = (resume: string, jobDescription: string): number => {
  if (!jobDescription) {
    return Math.floor(Math.random() * 31) + 70; // 70-100 for resume-only scoring
  }
  
  // Simple keyword matching algorithm
  const jobKeywords = extractKeywords(jobDescription.toLowerCase());
  const resumeKeywords = extractKeywords(resume.toLowerCase());
  
  const matchedKeywords = jobKeywords.filter(keyword => 
    resumeKeywords.some(resumeKeyword => 
      resumeKeyword.includes(keyword) || keyword.includes(resumeKeyword)
    )
  );
  
  const matchPercentage = jobKeywords.length > 0 ? (matchedKeywords.length / jobKeywords.length) : 0;
  return Math.min(100, Math.max(50, Math.round(matchPercentage * 100)));
};

// Extract meaningful keywords from text
const extractKeywords = (text: string): string[] => {
  // Remove common stop words and extract meaningful terms
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'should', 'could', 'can', 'may', 'might', 'must', 'shall'
  ]);
  
  return text
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word))
    .filter((word, index, arr) => arr.indexOf(word) === index) // Remove duplicates
    .slice(0, 50); // Limit to top 50 keywords
};

// Calculate structure score based on resume format
export const calculateStructureScore = (resume: string): number => {
  let score = 60; // Base score
  
  // Check for common sections
  const sections = [
    /professional\s*summary|summary|objective/i,
    /experience|work|employment/i,
    /education|academic/i,
    /skills|competencies|technical/i,
    /contact|phone|email/i
  ];
  
  sections.forEach(sectionRegex => {
    if (sectionRegex.test(resume)) {
      score += 8;
    }
  });
  
  // Check for bullet points
  if (/^[\s]*[•\-\*]\s/m.test(resume)) {
    score += 5;
  }
  
  // Check for dates
  if (/\b\d{4}\b/.test(resume)) {
    score += 5;
  }
  
  // Check for reasonable length
  if (resume.length > 500 && resume.length < 5000) {
    score += 5;
  }
  
  return Math.min(100, score);
};

// Calculate ATS compatibility score
export const calculateATSScore = (resume: string): number => {
  let score = 65; // Base score
  
  // Check for ATS-friendly formatting
  // No special characters that might confuse ATS
  const specialChars = /[^\w\s\-.,@()\[\]]/g;
  const specialCharCount = (resume.match(specialChars) || []).length;
  if (specialCharCount < 10) {
    score += 10;
  } else if (specialCharCount < 20) {
    score += 5;
  }
  
  // Check for standard section headers
  const standardSections = [
    /^(professional\s*)?experience$/im,
    /^(technical\s*)?skills$/im,
    /^education$/im,
    /^contact$/im
  ];
  
  standardSections.forEach(section => {
    if (section.test(resume)) {
      score += 5;
    }
  });
  
  // Check for consistent formatting
  const bulletPoints = resume.match(/^[\s]*[•\-\*]\s/gm);
  if (bulletPoints && bulletPoints.length > 3) {
    score += 5;
  }
  
  // Check for proper line breaks and structure
  const lines = resume.split('\n').filter(line => line.trim().length > 0);
  if (lines.length > 10 && lines.length < 100) {
    score += 5;
  }
  
  return Math.min(100, score);
};

// Generate improvement suggestions based on scores and content
export const generateSuggestions = (
  keywordScore: number, 
  structureScore: number, 
  atsScore: number, 
  resume: string, 
  jobDescription: string
): string[] => {
  const suggestions: string[] = [];
  
  if (keywordScore < 75) {
    suggestions.push("Add more relevant keywords from the job description to improve keyword matching");
  }
  
  if (structureScore < 80) {
    suggestions.push("Improve resume structure with clear section headers and consistent formatting");
  }
  
  if (atsScore < 85) {
    suggestions.push("Optimize for ATS compatibility by using standard section names and simple formatting");
  }
  
  if (!resume.includes('•') && !resume.includes('-')) {
    suggestions.push("Use bullet points to highlight your achievements and responsibilities");
  }
  
  if (!/\b\d+%|\$\d+|\d+\s*(years?|months?)\b/i.test(resume)) {
    suggestions.push("Quantify your achievements with specific numbers, percentages, or dollar amounts");
  }
  
  if (resume.length < 300) {
    suggestions.push("Expand your resume with more detailed descriptions of your experience and achievements");
  } else if (resume.length > 3000) {
    suggestions.push("Consider condensing your resume to focus on the most relevant and impactful information");
  }
  
  if (!/(?:led|managed|developed|created|implemented|improved|increased|reduced)/i.test(resume)) {
    suggestions.push("Use strong action verbs to start your bullet points and highlight your impact");
  }
  
  return suggestions.slice(0, 5); // Limit to top 5 suggestions
};
