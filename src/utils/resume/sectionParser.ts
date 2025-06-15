
import { SECTION_MAPPINGS, IGNORE_PATTERNS, SECTION_VALIDATION } from './constants';
import { normalizeForSectionIdentification } from './textCleaner';

/**
 * Validates if a line could potentially be a section header
 */
function isValidSectionHeader(line: string): boolean {
  const trimmed = line.trim();
  
  // Check basic length requirements
  if (trimmed.length < SECTION_VALIDATION.MIN_LENGTH || 
      trimmed.length > SECTION_VALIDATION.MAX_LENGTH) {
    return false;
  }
  
  // Must contain at least one letter
  if (!SECTION_VALIDATION.MUST_CONTAIN_LETTER.test(trimmed)) {
    return false;
  }
  
  // Should not be mostly numbers
  if (!SECTION_VALIDATION.NOT_MOSTLY_NUMBERS.test(trimmed)) {
    return false;
  }
  
  // Check special character ratio
  const specialChars = (trimmed.match(/[^a-zA-Z0-9\s]/g) || []).length;
  const specialRatio = specialChars / trimmed.length;
  if (specialRatio > SECTION_VALIDATION.MAX_SPECIAL_CHARS) {
    return false;
  }
  
  return true;
}

/**
 * Checks if a line should be ignored completely
 */
function shouldIgnoreLine(line: string): boolean {
  const normalizedLine = normalizeForSectionIdentification(line);
  
  return IGNORE_PATTERNS.some(pattern => pattern.test(normalizedLine));
}

/**
 * Enhanced section identification with better validation
 */
export function identifySectionHeader(line: string): string | null {
  // First check if we should ignore this line completely
  if (shouldIgnoreLine(line)) {
    return null;
  }
  
  // Validate if this could be a section header
  if (!isValidSectionHeader(line)) {
    return null;
  }
  
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
  
  // More strict criteria for unknown sections
  if (line.length < 80 && // Reasonable length for a header
      cleanedForHeuristics.length > 3 && // Not too short
      cleanedForHeuristics.length < 50 && // Not too long
      /^[A-Z\s]+$/.test(cleanedForHeuristics) && // All caps (typical for headers)
      !cleanedForHeuristics.includes('@') && // Not an email
      !/\d{3}/.test(cleanedForHeuristics) && // Not a phone number
      !cleanedForHeuristics.toLowerCase().includes('http') && // Not a URL
      !cleanedForHeuristics.toLowerCase().includes('www') && // Not a URL
      !/\b(JANUARY|FEBRUARY|MARCH|APRIL|MAY|JUNE|JULY|AUGUST|SEPTEMBER|OCTOBER|NOVEMBER|DECEMBER)\b/i.test(cleanedForHeuristics) // Not a date
  ) {
    // This looks like it could be a section header, but we don't recognize it
    // Return a sanitized version as an unknown section
    const sanitizedSection = cleanedForHeuristics.toLowerCase().replace(/\s+/g, '_');
    return sanitizedSection.length > 0 ? sanitizedSection : null;
  }
  
  return null;
}

/**
 * Determines if content should be included in a section or skipped
 */
export function shouldIncludeInSection(sectionType: string, content: string[]): boolean {
  // Always include known sections
  if (Object.keys(SECTION_MAPPINGS).includes(sectionType)) {
    return true;
  }
  
  // For unknown sections, apply additional validation
  if (content.length === 0) {
    return false;
  }
  
  // Skip if all content lines are too short or look like noise
  const validContentLines = content.filter(line => {
    const trimmed = line.trim();
    return trimmed.length > 2 && 
           !/^[^a-zA-Z]*$/.test(trimmed) && // Contains some letters
           !shouldIgnoreLine(trimmed);
  });
  
  // Only include if we have at least one valid content line
  return validContentLines.length > 0;
}
