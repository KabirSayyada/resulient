
import { SECTION_MAPPINGS } from './constants';

export function identifySectionHeader(line: string): string | null {
  // Clean the line for comparison
  const cleanLine = line.replace(/[^\w\s]/g, '').trim();
  
  // Check each section mapping
  for (const [sectionType, regex] of Object.entries(SECTION_MAPPINGS)) {
    if (regex.test(cleanLine)) {
      return sectionType;
    }
  }
  
  // Additional heuristics for section detection
  if (line.length < 50 && /^[A-Z\s]+$/.test(line.replace(/[^\w\s]/g, '')) && line.length > 3) {
    return 'unknown';
  }
  
  return null;
}
