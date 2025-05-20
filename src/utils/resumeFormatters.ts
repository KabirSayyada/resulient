
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
    'SUMMARY', 'PROFESSIONAL SUMMARY', 'OBJECTIVE', 
    'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY',
    'EDUCATION', 'ACADEMIC BACKGROUND',
    'SKILLS', 'TECHNICAL SKILLS', 'COMPETENCIES',
    'CERTIFICATIONS', 'LICENSES', 
    'PROJECTS', 'ACHIEVEMENTS', 'REFERENCES'
  ];
  
  // Improve section header formatting
  standardSections.forEach(section => {
    const regex = new RegExp(`(?<![a-zA-Z])${section}(?![a-zA-Z])`, 'i');
    content = content.replace(regex, section);
  });
  
  // Standardize bullet points
  content = content.replace(/[•⋅◦◘○◙♦★☆➤➢➣➸]/g, '-');
  content = content.replace(/^\s*[*]\s/gm, '- '); // Convert asterisks to dashes
  
  // Standardize date formats
  content = content.replace(/(\d{1,2})\/(\d{1,2})\/(\d{4})/g, '$1-$2-$3');
  
  // Fix spacing issues
  content = content.replace(/\n{3,}/g, '\n\n'); // Reduce excessive line breaks
  content = content.replace(/^\s+/gm, ''); // Remove leading whitespace
  content = content.replace(/\s+$/gm, ''); // Remove trailing whitespace
  
  // Add space before section headers if missing
  standardSections.forEach(section => {
    const headerPattern = new RegExp(`([^\n])\n${section}`, 'gi');
    content = content.replace(headerPattern, '$1\n\n' + section);
  });
  
  // Ensure proper spacing between bullet points
  content = content.replace(/(\n\s*-[^\n]+)(\n\s*-)/g, '$1\n$2');
  
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
