
/**
 * Utility functions for resume formatting and scoring
 */

// Format resume content based on type
export const formatResumeContent = (resumeContent: string | any): string => {
  if (typeof resumeContent === 'string') {
    return resumeContent;
  }
  
  // If it's an object, convert it to a formatted string
  try {
    if (typeof resumeContent === 'object' && resumeContent !== null) {
      return JSON.stringify(resumeContent, null, 2);
    }
    return String(resumeContent);
  } catch (error) {
    console.error("Error formatting resume content:", error);
    return "Error formatting resume content";
  }
};

// Format resume content for ATS compatibility
export const formatResumeForATS = (resumeContent: string | any): string => {
  let content = formatResumeContent(resumeContent);
  
  // Handle JSON objects by trying to extract the raw resume content
  if (content.startsWith('{') && content.endsWith('}')) {
    try {
      const parsedContent = JSON.parse(content);
      if (parsedContent.resumeContent || parsedContent.content || parsedContent.text) {
        content = parsedContent.resumeContent || parsedContent.content || parsedContent.text;
      }
    } catch (e) {
      // Not valid JSON or couldn't extract content, continue with original
    }
  }
  
  // Remove confusing special characters that might confuse ATS
  content = content.replace(/[•⋅◦◘○◙♦★☆✦]/g, '-');
  content = content.replace(/[*]/g, '');  // Remove asterisks
  content = content.replace(/[#]/g, '');  // Remove hash symbols
  content = content.replace(/\s{2,}/g, ' ');  // Normalize multiple spaces to single space
  
  // Fix common formatting issues
  content = content.replace(/\n{3,}/g, '\n\n');  // Normalize multiple newlines
  content = content.replace(/- -/g, '-');        // Fix double bullet points
  content = content.replace(/\*\*/g, '');        // Remove markdown bold markers
  content = content.replace(/\*/g, '');          // Remove markdown italic markers
  
  // Standardize section headers to be uppercase and ensure they stand out
  const standardSections = [
    'SUMMARY', 'PROFESSIONAL SUMMARY', 'OBJECTIVE', 'CAREER OBJECTIVE', 'PROFILE',
    'EXPERIENCE', 'WORK EXPERIENCE', 'PROFESSIONAL EXPERIENCE', 'EMPLOYMENT HISTORY', 'WORK HISTORY',
    'EDUCATION', 'ACADEMIC BACKGROUND', 'ACADEMIC HISTORY', 'EDUCATIONAL BACKGROUND',
    'SKILLS', 'TECHNICAL SKILLS', 'CORE COMPETENCIES', 'KEY SKILLS', 'COMPETENCIES', 'EXPERTISE',
    'CERTIFICATIONS', 'LICENSES', 'CREDENTIALS', 'PROFESSIONAL CERTIFICATIONS',
    'PROJECTS', 'PROJECT EXPERIENCE', 'RELEVANT PROJECTS', 'KEY PROJECTS',
    'ACHIEVEMENTS', 'ACCOMPLISHMENTS', 'HONORS', 'AWARDS', 'RECOGNITION',
    'VOLUNTEER', 'VOLUNTEER EXPERIENCE', 'COMMUNITY SERVICE',
    'LANGUAGES', 'LANGUAGE PROFICIENCY', 'LANGUAGE SKILLS',
    'PUBLICATIONS', 'RESEARCH', 'PRESENTATIONS',
    'REFERENCES', 'PROFESSIONAL REFERENCES',
    'AFFILIATIONS', 'PROFESSIONAL AFFILIATIONS', 'MEMBERSHIPS',
    'PERSONAL INFORMATION', 'CONTACT INFORMATION', 'PERSONAL DETAILS'
  ];
  
  // Standardize section headers
  standardSections.forEach(section => {
    // Case-insensitive replacement of section headers
    const regex = new RegExp(`(?<![a-zA-Z])${section}(?![a-zA-Z])`, 'i');
    content = content.replace(regex, section);
  });
  
  // Attempt to extract and format contact information at the top
  const contactInfoRegex = /([A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,})|(\+?[\d\s\(\)-]{10,})|((https?:\/\/)?(www\.)?linkedin\.com\/in\/[\w-]+)/g;
  const contactMatches = content.match(contactInfoRegex);
  
  // Enhance formatting of dates
  const dateRanges = content.match(/(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{1,2}-\d{1,2}-\d{2,4}|\d{4}\s*-\s*\d{4}|\d{4}\s*-\s*(Present|Current|Now))/gi);
  if (dateRanges) {
    dateRanges.forEach(dateRange => {
      // Standardize date format
      const formattedDate = dateRange.replace(/(\d{4})\s*-\s*(\d{4}|Present|Current|Now)/i, '$1 - $2');
      content = content.replace(dateRange, formattedDate);
    });
  }
  
  // Format company and job titles for better recognition
  const jobTitleRegex = /(senior|lead|principal|junior|associate)?\s*(software|web|frontend|backend|fullstack|ui|ux|product|project|program|data|marketing|sales|business|finance|human resources|hr)?\s*(developer|engineer|designer|manager|analyst|specialist|coordinator|assistant|director|vp|president|ceo|cto|cfo)/gi;
  const jobMatches = content.match(jobTitleRegex);
  
  if (jobMatches) {
    jobMatches.forEach(jobTitle => {
      // Capitalize job titles properly
      const capitalizedTitle = jobTitle.replace(/\b\w+\b/g, (word) => {
        return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
      });
      content = content.replace(jobTitle, capitalizedTitle);
    });
  }
  
  // Clean up excessive whitespace between sections to save space
  content = content.replace(/^\s+/gm, '');
  content = content.replace(/\s+$/gm, '');
  
  return content;
};

// Identify resume sections in content
export const identifyResumeSections = (content: string): { [key: string]: string } => {
  const sections: { [key: string]: string } = {};
  const lines = content.split('\n');
  
  let currentSection = 'HEADER';
  sections[currentSection] = '';
  
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
    /^(AFFILIATIONS|PROFESSIONAL\s+AFFILIATIONS|MEMBERSHIPS)/i,
    /^(PERSONAL\s+INFORMATION|CONTACT\s+INFORMATION|PERSONAL\s+DETAILS)/i
  ];
  
  // Process each line to identify sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip empty lines
    if (line === '') continue;
    
    // Check if this is a section header
    const isSectionHeader = sectionHeaderPatterns.some(pattern => pattern.test(line));
    
    if (isSectionHeader) {
      currentSection = line.toUpperCase();
      sections[currentSection] = '';
    } else {
      // Append content to current section
      sections[currentSection] += line + '\n';
    }
  }
  
  return sections;
};

// Extract candidate name from resume content
export const extractCandidateName = (content: string): string => {
  const lines = content.split('\n');
  
  // Simple heuristic: first non-empty line is often the name
  // This works in many cases but can be improved
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed && 
        !trimmed.includes('@') && // Not an email
        !trimmed.match(/^\d/) &&  // Doesn't start with a number
        !trimmed.includes('http') && // Not a URL
        !trimmed.match(/^\+?\d{10,}/) && // Not a phone number
        trimmed.length < 40) {     // Not too long
      return trimmed;
    }
  }
  
  return '';
};

// Calculate keyword score by matching resume content against job description
export const calculateKeywordScore = (resume: string, jobDescription: string): number => {
  // For now, using a placeholder scoring mechanism 
  // In a real implementation, this would analyze keyword matches
  return Math.floor(Math.random() * 41) + 60; // Returns a number between 60 and 100
};

// Calculate structure score based on resume format
export const calculateStructureScore = (resume: string): number => {
  // For now, using a placeholder scoring mechanism
  // In a real implementation, this would analyze resume structure
  return Math.floor(Math.random() * 41) + 60; // Returns a number between 60 and 100
};

// Calculate ATS compatibility score
export const calculateATSScore = (resume: string): number => {
  // For now, using a placeholder scoring mechanism
  // In a real implementation, this would analyze ATS compatibility
  return Math.floor(Math.random() * 41) + 60; // Returns a number between 60 and 100
};

// Generate improvement suggestions based on scores and content
export const generateSuggestions = (
  keywordScore: number, 
  structureScore: number, 
  atsScore: number, 
  resume: string, 
  jobDescription: string
): string[] => {
  return [
    "Consider adding more relevant keywords from the job description",
    "Try to quantify your achievements with specific metrics",
    "Make sure your resume sections are clearly labeled",
    "Use action verbs to start your bullet points"
  ];
};
