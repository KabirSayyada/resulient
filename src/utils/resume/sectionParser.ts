
import { SECTION_MAPPINGS, IGNORE_PATTERNS, SECTION_CONTENT_VALIDATORS, sanitizeSectionName } from './constants';
import { normalizeForSectionIdentification } from './textCleaner';

export function identifySectionHeader(line: string): string | null {
  // Check if this line should be ignored entirely
  const normalizedLine = normalizeForSectionIdentification(line);
  
  for (const ignorePattern of IGNORE_PATTERNS) {
    if (ignorePattern.test(normalizedLine)) {
      console.log(`Ignoring line due to ignore pattern: "${line}"`);
      return null;
    }
  }
  
  // Check each section mapping
  for (const [sectionType, regex] of Object.entries(SECTION_MAPPINGS)) {
    if (regex.test(normalizedLine)) {
      console.log(`Matched section "${sectionType}" for line: "${line}"`);
      return sectionType;
    }
  }
  
  // Additional heuristics for section detection with cleaned text
  const cleanedForHeuristics = normalizedLine.replace(/[^\w\s]/g, '').trim();
  
  // Only consider as potential section if it meets basic criteria
  if (line.length < 50 && 
      line.length > 3 &&
      /^[A-Z\s]+$/.test(cleanedForHeuristics) && 
      cleanedForHeuristics.length > 3 &&
      !cleanedForHeuristics.includes('  ')) { // No double spaces (usually indicates data)
    
    // Create a sanitized section name for unknown sections
    const sanitizedName = sanitizeSectionName(cleanedForHeuristics);
    console.log(`Potential unknown section: "${line}" -> "${sanitizedName}"`);
    return sanitizedName;
  }
  
  return null;
}

export function shouldIncludeInSection(sectionType: string, content: string[]): boolean {
  // Always include known sections that have validators
  if (SECTION_CONTENT_VALIDATORS[sectionType]) {
    const isValid = SECTION_CONTENT_VALIDATORS[sectionType](content);
    console.log(`Section validation for ${sectionType}: ${isValid}`);
    return isValid;
  }
  
  // For unknown sections, apply general validation
  if (content.length === 0) {
    console.log(`Skipping empty section: ${sectionType}`);
    return false;
  }
  
  // Skip if all content looks like noise
  const meaningfulContent = content.filter(line => {
    const cleaned = line.trim();
    return cleaned.length > 2 && 
           !/^[\d\s\-\/]+$/.test(cleaned) && // Not just dates/numbers
           !/^[^\w\s]*$/.test(cleaned) && // Not just special chars
           !IGNORE_PATTERNS.some(pattern => pattern.test(cleaned));
  });
  
  if (meaningfulContent.length === 0) {
    console.log(`Skipping section with no meaningful content: ${sectionType}`);
    return false;
  }
  
  // Skip if content looks like it doesn't belong to any section
  const hasStructuredContent = meaningfulContent.some(line => 
    line.includes('•') || 
    line.includes('-') || 
    line.includes(':') ||
    line.split(/\s+/).length > 3 // Has multiple words
  );
  
  if (!hasStructuredContent) {
    console.log(`Skipping section without structured content: ${sectionType}`);
    return false;
  }
  
  console.log(`Including unknown section: ${sectionType} with ${meaningfulContent.length} meaningful lines`);
  return true;
}
