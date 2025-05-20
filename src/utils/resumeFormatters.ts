
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
  
  // Remove special characters that might confuse ATS
  content = content.replace(/[•⋅◦◘○◙♦]/g, '-');
  
  // Standardize section headers to be uppercase and ensure they stand out
  const standardSections = [
    'SUMMARY', 'PROFESSIONAL SUMMARY', 'OBJECTIVE', 'PROFILE',
    'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY', 'PROFESSIONAL EXPERIENCE',
    'EDUCATION', 'ACADEMIC BACKGROUND', 'EDUCATIONAL QUALIFICATIONS',
    'SKILLS', 'TECHNICAL SKILLS', 'COMPETENCIES', 'KEY SKILLS',
    'CERTIFICATIONS', 'LICENSES', 'CERTIFICATES',
    'PROJECTS', 'KEY PROJECTS', 'PROFESSIONAL PROJECTS',
    'ACHIEVEMENTS', 'ACCOMPLISHMENTS', 'KEY ACHIEVEMENTS',
    'REFERENCES', 'PROFESSIONAL REFERENCES'
  ];
  
  // Simple regex to try to identify and standardize section headers
  standardSections.forEach(section => {
    const regex = new RegExp(`(?<![a-zA-Z])${section}(?![a-zA-Z])`, 'i');
    content = content.replace(regex, section);
  });
  
  // Ensure proper spacing between sections
  content = content.replace(/\n{3,}/g, '\n\n');
  
  // Clean up excessive whitespace between sections to save space
  content = content.replace(/^\s+/gm, '');
  content = content.replace(/\s+$/gm, '');
  
  // Standardize bullet points for better ATS parsing
  content = content.replace(/^[∙•●⦿⭗⭘⬤◉○◌◎●◐◑◕◉⦿⨀⯁▶➤➢➣➔→⇒⊕⋄♦]/gm, '- ');
  
  // Ensure dates are properly formatted
  content = content.replace(/(\d{4})\s*[-–—]\s*(\d{4}|Present|Current|Now)/gi, '$1 - $2');
  
  // Add extra spacing after section headers to ensure they stand out
  standardSections.forEach(section => {
    const regex = new RegExp(`^${section}$`, 'gmi');
    content = content.replace(regex, `${section}\n`);
  });
  
  return content;
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
