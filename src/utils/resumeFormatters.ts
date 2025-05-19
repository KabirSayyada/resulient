
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
  
  // Remove special characters that might confuse ATS
  content = content.replace(/[•⋅◦◘○◙♦]/g, '-');
  
  // Standardize section headers to be uppercase
  const standardSections = [
    'SUMMARY', 'PROFESSIONAL SUMMARY', 'OBJECTIVE', 
    'EXPERIENCE', 'WORK EXPERIENCE', 'EMPLOYMENT HISTORY',
    'EDUCATION', 'ACADEMIC BACKGROUND',
    'SKILLS', 'TECHNICAL SKILLS', 'COMPETENCIES',
    'CERTIFICATIONS', 'LICENSES', 
    'PROJECTS', 'ACHIEVEMENTS', 'REFERENCES'
  ];
  
  // Simple regex to try to identify and standardize section headers
  standardSections.forEach(section => {
    const regex = new RegExp(`(?<![a-zA-Z])${section}(?![a-zA-Z])`, 'i');
    content = content.replace(regex, section);
  });
  
  // Ensure proper spacing between sections
  content = content.replace(/\n{3,}/g, '\n\n');
  
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
