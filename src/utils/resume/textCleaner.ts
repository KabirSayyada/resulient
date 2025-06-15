
/**
 * Utility functions for cleaning and normalizing text in resume parsing
 */

// Common emojis used in resumes and their meanings
const SECTION_EMOJIS_MAP: { [key: string]: string } = {
  '👨‍💼': 'experience',
  '👩‍💼': 'experience', 
  '💼': 'experience',
  '🏢': 'experience',
  '📊': 'experience',
  '🎓': 'education',
  '📚': 'education',
  '🏫': 'education',
  '🔧': 'skills',
  '💻': 'skills',
  '⚙️': 'skills',
  '🛠️': 'skills',
  '🚀': 'projects',
  '📱': 'projects',
  '🌐': 'projects',
  '💡': 'projects',
  '🏆': 'achievements',
  '🥇': 'achievements',
  '⭐': 'achievements',
  '🎖️': 'achievements',
  '📜': 'certifications',
  '🏅': 'certifications',
  '✅': 'certifications',
  '🌍': 'languages',
  '🗣️': 'languages',
  '💬': 'languages',
  '📞': 'contact',
  '📧': 'contact',
  '📍': 'contact',
  '🔗': 'contact',
  '💖': 'volunteer',
  '🤝': 'volunteer',
  '❤️': 'volunteer',
  '🎯': 'summary',
  '📝': 'summary',
  '👤': 'summary'
};

/**
 * Remove emojis from text while preserving meaning
 */
export function removeEmojis(text: string): string {
  // Remove all emojis using Unicode ranges
  return text.replace(/[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
}

/**
 * Clean special characters that might interfere with parsing
 */
export function cleanSpecialCharacters(text: string): string {
  return text
    // Remove or replace problematic characters
    .replace(/[""'']/g, '"') // Normalize quotes
    .replace(/[–—]/g, '-') // Normalize dashes
    .replace(/[…]/g, '...') // Normalize ellipsis
    .replace(/[•·]/g, '•') // Normalize bullet points
    .replace(/[\u00A0]/g, ' ') // Replace non-breaking spaces
    .replace(/[\r\n\t]/g, ' ') // Normalize whitespace
    .replace(/\s+/g, ' ') // Remove multiple spaces
    .trim();
}

/**
 * Extract potential section hints from emojis
 */
export function extractSectionHintFromEmojis(text: string): string | null {
  for (const [emoji, sectionType] of Object.entries(SECTION_EMOJIS_MAP)) {
    if (text.includes(emoji)) {
      return sectionType;
    }
  }
  return null;
}

/**
 * Normalize text for section identification
 */
export function normalizeForSectionIdentification(text: string): string {
  // First extract any section hints from emojis
  const sectionHint = extractSectionHintFromEmojis(text);
  
  // Clean the text
  let cleaned = removeEmojis(text);
  cleaned = cleanSpecialCharacters(cleaned);
  
  // If we found a section hint from emojis, prioritize it
  if (sectionHint) {
    cleaned = `${cleaned} ${sectionHint}`.trim();
  }
  
  return cleaned.toUpperCase();
}

/**
 * Clean resume content lines for better parsing
 */
export function cleanResumeContent(content: string): string {
  const lines = content.split('\n');
  const cleanedLines = lines.map(line => {
    // Keep emojis in contact info but clean them elsewhere
    if (isContactLine(line)) {
      return cleanSpecialCharacters(line);
    }
    
    // For section headers, normalize but don't completely remove context
    if (isPotentialSectionHeader(line)) {
      const cleaned = cleanSpecialCharacters(line);
      const emojiHint = extractSectionHintFromEmojis(line);
      return emojiHint ? `${cleaned} [${emojiHint}]` : cleaned;
    }
    
    // For regular content, clean special characters but preserve structure
    return cleanSpecialCharacters(line);
  });
  
  return cleanedLines.join('\n');
}

/**
 * Legacy function for backward compatibility
 */
export function cleanText(content: string): string {
  return cleanResumeContent(content);
}

/**
 * Check if a line contains contact information
 */
function isContactLine(line: string): boolean {
  return (
    line.includes('@') || 
    /\d{3}/.test(line) || 
    line.toLowerCase().includes('linkedin') ||
    line.includes('📞') ||
    line.includes('📧') ||
    line.includes('📍') ||
    line.includes('🔗')
  );
}

/**
 * Check if a line might be a section header
 */
function isPotentialSectionHeader(line: string): boolean {
  const cleanLine = removeEmojis(line).trim().replace(/[^\w\s]/g, '');
  return (
    line.length < 50 && 
    cleanLine.length > 2 &&
    /^[A-Z\s]+$/.test(cleanLine) &&
    !line.includes('@') &&
    !/\d{3}/.test(line)
  );
}

/**
 * Enhanced bullet point detection that handles various formats
 */
export function isBulletPoint(line: string): boolean {
  const trimmed = line.trim();
  return (
    trimmed.startsWith('•') ||
    trimmed.startsWith('-') ||
    trimmed.startsWith('*') ||
    trimmed.startsWith('→') ||
    trimmed.startsWith('▪') ||
    trimmed.startsWith('▫') ||
    trimmed.startsWith('◦') ||
    trimmed.startsWith('‣') ||
    /^\d+\./.test(trimmed) ||
    /^[a-zA-Z]\)/.test(trimmed)
  );
}

/**
 * Clean bullet point prefixes
 */
export function cleanBulletPoint(line: string): string {
  return line
    .replace(/^[•\-*→▪▫◦‣]\s*/, '')
    .replace(/^\d+\.\s*/, '')
    .replace(/^[a-zA-Z]\)\s*/, '')
    .trim();
}
