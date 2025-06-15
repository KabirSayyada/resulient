// Common section header variations
export const SECTION_MAPPINGS = {
  contact: /^(contact|personal|info|information|details)$/i,
  summary: /^(summary|profile|objective|about|overview|professional\s*summary|career\s*summary|executive\s*summary)$/i,
  experience: /^(experience|work|employment|professional\s*experience|work\s*experience|career|history|professional\s*history)$/i,
  education: /^(education|academic|qualifications|degrees|schooling)$/i,
  skills: /^(skills|technical\s*skills|core\s*competencies|competencies|expertise|technologies|proficiencies|abilities|tech\s*stack)$/i,
  projects: /^(projects|portfolio|work\s*samples|personal\s*projects|key\s*projects)$/i,
  certifications: /^(certifications|certificates|credentials|licenses|professional\s*development|professional\s*certifications)$/i,
  achievements: /^(achievements|accomplishments|awards|honors|recognition|awards\s*and\s*honors)$/i,
  volunteer: /^(volunteer|volunteer\s*experience|volunteer\s*work|volunteer\s*activities|volunteering|community\s*service|community\s*involvement)$/i,
  interests: /^(interests|hobbies|personal\s*interests|hobbies\s*and\s*interests|activities|extracurricular)$/i,
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
