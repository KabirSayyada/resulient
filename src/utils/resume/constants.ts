
// Common section header variations
export const SECTION_MAPPINGS = {
  contact: /^(contact|personal|info|information|details)$/i,
  summary: /^(summary|profile|objective|about|overview|professional\s*summary|career\s*summary|executive\s*summary)$/i,
  experience: /^(experience|work|employment|professional\s*experience|work\s*experience|career|history|professional\s*history)$/i,
  education: /^(education|academic|qualifications|degrees|schooling)$/i,
  skills: /^(skills|technical\s*skills|core\s*competencies|competencies|expertise|technologies|proficiencies|abilities|tech\s*stack)$/i,
  projects: /^(projects|portfolio|work\s*samples|personal\s*projects|key\s*projects)$/i,
  certifications: /^(certifications|certificates|credentials|licenses|professional\s*development|professional\s*certifications)$/i,
  achievements: /^(achievements|accomplishments|awards|honors|recognition)$/i,
  languages: /^(languages|linguistic\s*skills)$/i
};

// Email regex pattern
export const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

// Phone regex pattern (supports various formats)
export const PHONE_REGEX = /(\+?1?[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;

// LinkedIn URL pattern
export const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i;

// Date patterns for experience
export const DATE_PATTERNS = [
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b/gi,
  /\b\d{1,2}\/\d{4}\b/g,
  /\b\d{4}\b/g,
  /\b(?:Present|Current|Now)\b/gi
];

// Patterns to ignore - these are likely not real sections
export const IGNORE_PATTERNS = [
  /^(page\s*\d+|confidential|draft|version|updated|last\s*modified|created|document|file|resume|cv)$/i,
  /^[=\-_]{3,}$/,
  /^\s*$/,
  /^(thank\s*you|sincerely|regards|best\s*regards|signature)$/i,
  /^(references\s*available|upon\s*request)$/i,
  /^[\d\s\-\/]+$/, // Just dates or numbers
  /^[^\w\s]*$/, // Just special characters
];

// Valid section content patterns
export const SECTION_CONTENT_VALIDATORS = {
  experience: (content: string[]) => {
    return content.some(line => 
      line.length > 10 && 
      (line.includes('responsibilities') || 
       line.includes('developed') || 
       line.includes('managed') ||
       line.includes('led') ||
       /\d{4}/.test(line) || // Contains year
       line.includes('-') || line.includes('•'))
    );
  },
  education: (content: string[]) => {
    return content.some(line => 
      line.includes('university') || 
      line.includes('college') || 
      line.includes('degree') ||
      line.includes('bachelor') ||
      line.includes('master') ||
      line.includes('phd') ||
      /\d{4}/.test(line)
    );
  },
  skills: (content: string[]) => {
    return content.length > 0 && content.some(line => 
      line.length < 100 && // Skills are usually short
      (line.includes(',') || line.includes('•') || line.split(/\s+/).length < 10)
    );
  },
  projects: (content: string[]) => {
    return content.some(line => 
      line.length > 5 && 
      (line.includes('project') || 
       line.includes('developed') || 
       line.includes('built') ||
       line.includes('created') ||
       line.includes('technologies'))
    );
  },
  certifications: (content: string[]) => {
    return content.some(line => 
      line.includes('certified') || 
      line.includes('certification') ||
      line.includes('license') ||
      /\d{4}/.test(line)
    );
  }
};

// Sanitize section names for unknown sections
export const sanitizeSectionName = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 30) // Limit length
    .trim();
};
