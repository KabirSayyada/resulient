
import { ParsedResume } from '@/types/resumeStructure';
import { parseATSResumeText } from './parseATSResumeText';

export function parseOptimizedResumeContent(content: string | any): ParsedResume {
  // Handle null or undefined content
  if (!content) {
    console.warn('No content provided to parseOptimizedResumeContent');
    return createEmptyParsedResume();
  }

  // If content is an object (JSON response), convert it to text format first
  if (typeof content === 'object' && content !== null) {
    const textContent = convertObjectToResumeText(content);
    return parseATSResumeText(textContent);
  }
  
  // If content is already a string, parse it directly
  if (typeof content === 'string') {
    return parseATSResumeText(content);
  }
  
  // Fallback for unexpected types - convert to string
  console.warn('Unexpected content type for parseOptimizedResumeContent:', typeof content);
  const fallbackContent = String(content);
  return parseATSResumeText(fallbackContent);
}

function createEmptyParsedResume(): ParsedResume {
  return {
    contact: {},
    professionalSummary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    additionalSections: {}
  };
}

function convertObjectToResumeText(obj: any): string {
  let resumeText = '';
  
  // Handle different object structures
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string' && value.trim()) {
      // Add section header
      resumeText += `${key}\n`;
      resumeText += '='.repeat(key.length) + '\n';
      
      // Add content
      resumeText += value + '\n\n';
    } else if (Array.isArray(value) && value.length > 0) {
      // Handle arrays
      resumeText += `${key}\n`;
      resumeText += '='.repeat(key.length) + '\n';
      
      value.forEach(item => {
        if (typeof item === 'string') {
          resumeText += `• ${item}\n`;
        } else if (typeof item === 'object' && item !== null) {
          resumeText += `• ${JSON.stringify(item)}\n`;
        }
      });
      resumeText += '\n';
    }
  }
  
  return resumeText.trim();
}
