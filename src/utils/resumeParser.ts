
import { ParsedResume, ParsedContact, ParsedWorkExperience, ParsedEducation, ParsedProject, ParsedCertification } from "@/types/resumeStructure";

// Common section header variations
const SECTION_MAPPINGS = {
  contact: /^(contact|personal|info|information|details)$/i,
  summary: /^(summary|profile|objective|about|overview|professional\s*summary|career\s*summary)$/i,
  experience: /^(experience|work|employment|professional\s*experience|work\s*experience|career|history|professional\s*history)$/i,
  education: /^(education|academic|qualifications|degrees|schooling)$/i,
  skills: /^(skills|technical\s*skills|core\s*competencies|competencies|expertise|technologies|proficiencies|abilities)$/i,
  projects: /^(projects|portfolio|work\s*samples|personal\s*projects)$/i,
  certifications: /^(certifications|certificates|credentials|licenses|professional\s*development)$/i,
  achievements: /^(achievements|accomplishments|awards|honors|recognition)$/i,
  languages: /^(languages|linguistic\s*skills)$/i
};

// Email regex pattern
const EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;

// Phone regex pattern (supports various formats)
const PHONE_REGEX = /(\+?1?[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/;

// LinkedIn URL pattern
const LINKEDIN_REGEX = /(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\/[\w-]+/i;

// Date patterns for experience
const DATE_PATTERNS = [
  /\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b/gi,
  /\b\d{1,2}\/\d{4}\b/g,
  /\b\d{4}\b/g,
  /\b(?:Present|Current|Now)\b/gi
];

export function parseResumeContent(resumeText: string): ParsedResume {
  const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const parsedResume: ParsedResume = {
    contact: {},
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    additionalSections: {}
  };

  let currentSection = '';
  let currentSectionContent: string[] = [];
  
  // Extract contact information from the first few lines
  parsedResume.contact = extractContactInfo(lines.slice(0, 10));
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sectionType = identifySectionHeader(line);
    
    if (sectionType) {
      // Process previous section
      if (currentSection && currentSectionContent.length > 0) {
        processSectionContent(parsedResume, currentSection, currentSectionContent);
      }
      
      currentSection = sectionType;
      currentSectionContent = [];
    } else if (currentSection) {
      currentSectionContent.push(line);
    }
  }
  
  // Process the last section
  if (currentSection && currentSectionContent.length > 0) {
    processSectionContent(parsedResume, currentSection, currentSectionContent);
  }
  
  return parsedResume;
}

function extractContactInfo(lines: string[]): ParsedContact {
  const contact: ParsedContact = {};
  
  for (const line of lines) {
    // Extract name (usually the first substantial line)
    if (!contact.name && line.length > 2 && !EMAIL_REGEX.test(line) && !PHONE_REGEX.test(line)) {
      // Check if it looks like a name (not all caps, reasonable length)
      if (line.length < 50 && !/^[A-Z\s]+$/.test(line)) {
        contact.name = line;
      }
    }
    
    // Extract email
    const emailMatch = line.match(EMAIL_REGEX);
    if (emailMatch && !contact.email) {
      contact.email = emailMatch[0];
    }
    
    // Extract phone
    const phoneMatch = line.match(PHONE_REGEX);
    if (phoneMatch && !contact.phone) {
      contact.phone = phoneMatch[0];
    }
    
    // Extract LinkedIn
    const linkedinMatch = line.match(LINKEDIN_REGEX);
    if (linkedinMatch && !contact.linkedin) {
      contact.linkedin = linkedinMatch[0];
    }
    
    // Extract address (lines with state abbreviations or zip codes)
    if (!contact.address && (/\b[A-Z]{2}\s+\d{5}/.test(line) || /\d{5}/.test(line))) {
      contact.address = line;
    }
  }
  
  return contact;
}

function identifySectionHeader(line: string): string | null {
  // Clean the line for comparison
  const cleanLine = line.replace(/[^\w\s]/g, '').trim();
  
  // Check each section mapping
  for (const [sectionType, regex] of Object.entries(SECTION_MAPPINGS)) {
    if (regex.test(cleanLine)) {
      return sectionType;
    }
  }
  
  // Additional heuristics for section detection
  if (line.length < 50 && /^[A-Z\s]+$/.test(line.replace(/[^\w\s]/g, ''))) {
    return 'unknown';
  }
  
  return null;
}

function processSectionContent(resume: ParsedResume, sectionType: string, content: string[]): void {
  switch (sectionType) {
    case 'summary':
      resume.professionalSummary = content.join(' ');
      break;
    case 'experience':
      resume.workExperience = parseWorkExperience(content);
      break;
    case 'education':
      resume.education = parseEducation(content);
      break;
    case 'skills':
      resume.skills = parseSkills(content);
      break;
    case 'projects':
      resume.projects = parseProjects(content);
      break;
    case 'certifications':
      resume.certifications = parseCertifications(content);
      break;
    case 'achievements':
      resume.achievements = content.filter(line => line.trim().length > 0);
      break;
    case 'languages':
      resume.languages = parseSkills(content);
      break;
    default:
      resume.additionalSections[sectionType] = content;
      break;
  }
}

function parseWorkExperience(content: string[]): ParsedWorkExperience[] {
  const experiences: ParsedWorkExperience[] = [];
  let currentExperience: Partial<ParsedWorkExperience> | null = null;
  
  for (const line of content) {
    // Check if this looks like a job title/company line
    if (isJobTitleLine(line)) {
      // Save previous experience if exists
      if (currentExperience && currentExperience.position && currentExperience.company) {
        experiences.push(currentExperience as ParsedWorkExperience);
      }
      
      currentExperience = parseJobTitleLine(line);
    } else if (currentExperience && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
      // This is a bullet point responsibility
      if (!currentExperience.responsibilities) {
        currentExperience.responsibilities = [];
      }
      currentExperience.responsibilities.push(line.replace(/^[•\-*]\s*/, ''));
    } else if (currentExperience && line.trim().length > 10) {
      // This might be a responsibility without bullet
      if (!currentExperience.responsibilities) {
        currentExperience.responsibilities = [];
      }
      currentExperience.responsibilities.push(line);
    }
  }
  
  // Add the last experience
  if (currentExperience && currentExperience.position && currentExperience.company) {
    experiences.push(currentExperience as ParsedWorkExperience);
  }
  
  return experiences;
}

function isJobTitleLine(line: string): boolean {
  // Heuristics for job title lines
  return (
    line.length > 5 && 
    line.length < 200 &&
    !line.startsWith('•') &&
    !line.startsWith('-') &&
    !line.startsWith('*') &&
    (line.includes(' at ') || line.includes(' | ') || line.includes(' - ') || /\d{4}/.test(line))
  );
}

function parseJobTitleLine(line: string): Partial<ParsedWorkExperience> {
  const experience: Partial<ParsedWorkExperience> = {
    responsibilities: []
  };
  
  // Try to extract dates first
  const dates = extractDates(line);
  if (dates.length >= 1) {
    experience.startDate = dates[0];
    if (dates.length >= 2) {
      experience.endDate = dates[1];
    }
  }
  
  // Remove dates from line for easier parsing
  let cleanLine = line;
  DATE_PATTERNS.forEach(pattern => {
    cleanLine = cleanLine.replace(pattern, '').trim();
  });
  
  // Try different separation patterns
  const separators = [' at ', ' | ', ' - ', ' – ', ' — '];
  
  for (const separator of separators) {
    if (cleanLine.includes(separator)) {
      const parts = cleanLine.split(separator);
      if (parts.length >= 2) {
        experience.position = parts[0].trim();
        experience.company = parts[1].trim();
        break;
      }
    }
  }
  
  // If no separator found, try to guess based on line structure
  if (!experience.position || !experience.company) {
    const words = cleanLine.split(' ');
    if (words.length >= 2) {
      // Assume first half is position, second half is company
      const midPoint = Math.floor(words.length / 2);
      experience.position = words.slice(0, midPoint).join(' ');
      experience.company = words.slice(midPoint).join(' ');
    }
  }
  
  return experience;
}

function extractDates(text: string): string[] {
  const dates: string[] = [];
  
  DATE_PATTERNS.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) {
      dates.push(...matches);
    }
  });
  
  return dates;
}

function parseEducation(content: string[]): ParsedEducation[] {
  const education: ParsedEducation[] = [];
  
  for (const line of content) {
    if (line.length > 10) {
      const edu: ParsedEducation = {
        institution: '',
        degree: ''
      };
      
      // Try to parse education line
      const dates = extractDates(line);
      if (dates.length > 0) {
        edu.graduationDate = dates[dates.length - 1];
      }
      
      // Remove dates for easier parsing
      let cleanLine = line;
      DATE_PATTERNS.forEach(pattern => {
        cleanLine = cleanLine.replace(pattern, '').trim();
      });
      
      // Look for degree indicators
      const degreePatterns = /\b(B\.?S\.?|M\.?S\.?|PhD|Bachelor|Master|Associate|Doctor|Diploma|Certificate)\b/i;
      const degreeMatch = cleanLine.match(degreePatterns);
      
      if (degreeMatch) {
        const parts = cleanLine.split(/\s+(?:at|from|,|\||-)\s+/i);
        if (parts.length >= 2) {
          edu.degree = parts[0].trim();
          edu.institution = parts[1].trim();
        } else {
          edu.degree = cleanLine;
          edu.institution = 'Unknown';
        }
      } else {
        edu.institution = cleanLine;
        edu.degree = 'Degree';
      }
      
      education.push(edu);
    }
  }
  
  return education;
}

function parseSkills(content: string[]): string[] {
  const skills: string[] = [];
  
  for (const line of content) {
    // Split by common delimiters
    const delimiters = /[,;|•\-*]/;
    const lineSkills = line.split(delimiters)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0 && skill.length < 50);
    
    skills.push(...lineSkills);
  }
  
  return skills.filter((skill, index, arr) => arr.indexOf(skill) === index); // Remove duplicates
}

function parseProjects(content: string[]): ParsedProject[] {
  const projects: ParsedProject[] = [];
  let currentProject: Partial<ParsedProject> | null = null;
  
  for (const line of content) {
    if (line.length > 5 && !line.startsWith('•') && !line.startsWith('-')) {
      // This might be a project title
      if (currentProject && currentProject.name) {
        projects.push(currentProject as ParsedProject);
      }
      
      currentProject = {
        name: line,
        description: '',
        technologies: []
      };
    } else if (currentProject && line.trim().length > 0) {
      // This is project description
      if (!currentProject.description) {
        currentProject.description = line;
      } else {
        currentProject.description += ' ' + line;
      }
    }
  }
  
  if (currentProject && currentProject.name) {
    projects.push(currentProject as ParsedProject);
  }
  
  return projects;
}

function parseCertifications(content: string[]): ParsedCertification[] {
  const certifications: ParsedCertification[] = [];
  
  for (const line of content) {
    if (line.length > 5) {
      const cert: ParsedCertification = {
        name: line,
        issuer: 'Unknown'
      };
      
      // Try to extract issuer and date
      const dates = extractDates(line);
      if (dates.length > 0) {
        cert.date = dates[0];
      }
      
      // Look for issuer patterns
      const issuerPatterns = /\b(?:by|from|issued by)\s+(.+)/i;
      const issuerMatch = line.match(issuerPatterns);
      if (issuerMatch) {
        cert.issuer = issuerMatch[1].trim();
        cert.name = line.replace(issuerMatch[0], '').trim();
      }
      
      certifications.push(cert);
    }
  }
  
  return certifications;
}
