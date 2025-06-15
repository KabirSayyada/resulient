
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
  if (line.length < 50 && 
      /^[A-Z\s]+$/.test(cleanedForHeuristics) && 
      cleanedForHeuristics.length > 3) {
    return 'unknown';
  }
  
  return null;
}
