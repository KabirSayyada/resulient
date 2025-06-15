
import { SECTION_MAPPINGS } from './constants';
import { normalizeForSectionIdentification } from './textCleaner';

export function identifySectionHeader(line: string): string | null {
  // Use the enhanced text cleaning for section identification
  const normalizedLine = normalizeForSectionIdentification(line);
  
  // Check each section mapping
  for (const [sectionType, regex] of Object.entries(SECTION_MAPPINGS)) {
    if (regex.test(normalizedLine)) {
      return sectionType;
    }
  }
  
  // Additional heuristics for section detection with cleaned text
  const cleanedForHeuristics = normalizedLine.replace(/[^\w\s]/g, '').trim();
  
  // Check for awards-related keywords
  if (cleanedForHeuristics.match(/\b(awards?|honors?|recognition|accomplishments?|achievements?)\b/i)) {
    return 'achievements';
  }
  
  // Check for volunteer-related keywords
  if (cleanedForHeuristics.match(/\b(volunteer|volunteering|community\s*service|civic|nonprofit)\b/i)) {
    return 'volunteer';
  }
  
  // Check for interests/hobbies keywords
  if (cleanedForHeuristics.match(/\b(hobbies|interests|activities|personal|extracurricular)\b/i)) {
    return 'interests';
  }
  
  // Generic section header detection
  if (line.length < 50 && 
      /^[A-Z\s]+$/.test(cleanedForHeuristics) && 
      cleanedForHeuristics.length > 3) {
    return 'unknown';
  }
  
  return null;
}
