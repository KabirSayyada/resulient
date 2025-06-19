
import { ParsedResume } from '@/types/resumeStructure';
import { parseATSResumeText } from './parseATSResumeText';

export function parseOptimizedResumeContent(content: string | any): ParsedResume {
  // If content is an object (JSON response), convert it to text format first
  if (typeof content === 'object' && content !== null) {
    const textContent = convertObjectToResumeText(content);
    return parseATSResumeText(textContent);
  }
  
  // If content is already a string, parse it directly
  if (typeof content === 'string') {
    return parseATSResumeText(content);
  }
  
  // Fallback for unexpected types
  console.warn('Unexpected content type for parseOptimizedResumeContent:', typeof content);
  return parseATSResumeText(String(content));
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
    }
  }
  
  return resumeText.trim();
}
