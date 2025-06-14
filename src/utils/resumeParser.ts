
import { ParsedResume, ParsedContact, ParsedWorkExperience, ParsedEducation, ParsedProject, ParsedCertification } from "@/types/resumeStructure";

// Common section header variations
const SECTION_MAPPINGS = {
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
  
  // Enhanced contact extraction - look at first 15 lines
  parsedResume.contact = extractContactInfo(lines.slice(0, 15));
  
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
    } else if (!parsedResume.professionalSummary && line.length > 50 && !isContactInfo(line)) {
      // If no section identified yet and it's a substantial line, treat as summary
      parsedResume.professionalSummary = line;
    }
  }
  
  // Process the last section
  if (currentSection && currentSectionContent.length > 0) {
    processSectionContent(parsedResume, currentSection, currentSectionContent);
  }
  
  // Post-processing to ensure data quality
  cleanupParsedResume(parsedResume);
  
  return parsedResume;
}

function isContactInfo(line: string): boolean {
  return EMAIL_REGEX.test(line) || PHONE_REGEX.test(line) || LINKEDIN_REGEX.test(line);
}

function extractContactInfo(lines: string[]): ParsedContact {
  const contact: ParsedContact = {};
  let foundName = false;
  
  for (const line of lines) {
    // Extract name (usually the first substantial line that's not contact info)
    if (!foundName && line.length > 2 && line.length < 80 && !EMAIL_REGEX.test(line) && 
        !PHONE_REGEX.test(line) && !LINKEDIN_REGEX.test(line) && 
        !line.match(/^\d+/) && !line.includes('|')) {
      // Check if it looks like a name (not all caps unless short, reasonable length)
      if (line.length < 50 && (!line.match(/^[A-Z\s]+$/) || line.length < 25)) {
        contact.name = line;
        foundName = true;
      }
    }
    
    // Extract email
    const emailMatch = line.match(EMAIL_REGEX);
    if (emailMatch && !contact.email) {
      contact.email = emailMatch[0];
    }
    
    // Extract phone
    const phoneMatch = line.match(PHONE_REGEX);
    if (phoneMatch && !contact.phone && line.length < 50) {
      contact.phone = phoneMatch[0];
    }
    
    // Extract LinkedIn
    const linkedinMatch = line.match(LINKEDIN_REGEX);
    if (linkedinMatch && !contact.linkedin) {
      contact.linkedin = linkedinMatch[0];
    }
    
    // Extract address (lines with state abbreviations, zip codes, or common address words)
    if (!contact.address && (
      /\b[A-Z]{2}\s+\d{5}/.test(line) || 
      /\d{5}/.test(line) ||
      /\b(Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Boulevard|Blvd)\b/i.test(line)
    )) {
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
  if (line.length < 50 && /^[A-Z\s]+$/.test(line.replace(/[^\w\s]/g, '')) && line.length > 3) {
    return 'unknown';
  }
  
  return null;
}

function processSectionContent(resume: ParsedResume, sectionType: string, content: string[]): void {
  switch (sectionType) {
    case 'summary':
      resume.professionalSummary = content.join(' ').replace(/\s+/g, ' ').trim();
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
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      // This is a bullet point responsibility
      if (currentExperience) {
        if (!currentExperience.responsibilities) {
          currentExperience.responsibilities = [];
        }
        currentExperience.responsibilities.push(line.replace(/^[•\-*]\s*/, ''));
      }
    } else if (isJobTitleLine(line)) {
      // Save previous experience
      if (currentExperience && (currentExperience.position || currentExperience.company)) {
        experiences.push(fillExperienceDefaults(currentExperience));
      }
      
      currentExperience = parseJobTitleLine(line);
    } else if (currentExperience && line.trim().length > 10 && !line.match(/^\d{4}/)) {
      // This might be a responsibility without bullet or additional company info
      if (!currentExperience.company && line.length < 100) {
        currentExperience.company = line;
      } else {
        if (!currentExperience.responsibilities) {
          currentExperience.responsibilities = [];
        }
        currentExperience.responsibilities.push(line);
      }
    }
  }
  
  // Add the last experience
  if (currentExperience && (currentExperience.position || currentExperience.company)) {
    experiences.push(fillExperienceDefaults(currentExperience));
  }
  
  return experiences;
}

function fillExperienceDefaults(exp: Partial<ParsedWorkExperience>): ParsedWorkExperience {
  return {
    position: exp.position || 'Position',
    company: exp.company || 'Company',
    startDate: exp.startDate || '',
    endDate: exp.endDate || '',
    responsibilities: exp.responsibilities || []
  };
}

function isJobTitleLine(line: string): boolean {
  return (
    line.length > 5 && 
    line.length < 200 &&
    !line.startsWith('•') &&
    !line.startsWith('-') &&
    !line.startsWith('*') &&
    (line.includes(' at ') || line.includes(' | ') || line.includes(' - ') || 
     line.includes(' – ') || /\d{4}/.test(line) || line.includes(','))
  );
}

function parseJobTitleLine(line: string): Partial<ParsedWorkExperience> {
  const experience: Partial<ParsedWorkExperience> = {
    responsibilities: []
  };
  
  // Extract dates first
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
  
  // Clean up extra separators
  cleanLine = cleanLine.replace(/\s*[|–-]\s*$/, '').replace(/^\s*[|–-]\s*/, '').trim();
  
  // Try different separation patterns
  const separators = [' at ', ' | ', ' – ', ' - ', ' — ', ','];
  
  for (const separator of separators) {
    if (cleanLine.includes(separator)) {
      const parts = cleanLine.split(separator).map(p => p.trim()).filter(p => p.length > 0);
      if (parts.length >= 2) {
        experience.position = parts[0];
        experience.company = parts[1];
        break;
      }
    }
  }
  
  // If no separator found, try to guess based on line structure
  if (!experience.position && !experience.company) {
    const words = cleanLine.split(/\s+/);
    if (words.length >= 2) {
      // Look for common position words
      const positionWords = ['manager', 'developer', 'engineer', 'analyst', 'director', 'specialist', 'coordinator'];
      const positionIndex = words.findIndex(word => 
        positionWords.some(posWord => word.toLowerCase().includes(posWord))
      );
      
      if (positionIndex >= 0) {
        experience.position = words.slice(0, positionIndex + 1).join(' ');
        experience.company = words.slice(positionIndex + 1).join(' ');
      } else {
        // Default split
        const midPoint = Math.ceil(words.length / 2);
        experience.position = words.slice(0, midPoint).join(' ');
        experience.company = words.slice(midPoint).join(' ');
      }
    } else {
      experience.position = cleanLine;
      experience.company = 'Company';
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
    if (line.length > 5) {
      const edu: ParsedEducation = {
        institution: '',
        degree: ''
      };
      
      // Extract dates
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
      const degreePatterns = /\b(B\.?A\.?|B\.?S\.?|M\.?A\.?|M\.?S\.?|PhD|Ph\.D\.?|Bachelor|Master|Associate|Doctor|Diploma|Certificate)\b/i;
      const degreeMatch = cleanLine.match(degreePatterns);
      
      if (degreeMatch) {
        const separators = [' at ', ' from ', ' - ', ' – ', ' | ', ','];
        let parsed = false;
        
        for (const separator of separators) {
          if (cleanLine.includes(separator)) {
            const parts = cleanLine.split(separator).map(p => p.trim());
            if (parts.length >= 2) {
              edu.degree = parts[0];
              edu.institution = parts[1];
              parsed = true;
              break;
            }
          }
        }
        
        if (!parsed) {
          edu.degree = cleanLine;
          edu.institution = 'Institution';
        }
      } else {
        // Assume the whole line is institution if no degree pattern found
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
  
  return [...new Set(skills)]; // Remove duplicates
}

function parseProjects(content: string[]): ParsedProject[] {
  const projects: ParsedProject[] = [];
  let currentProject: Partial<ParsedProject> | null = null;
  
  for (const line of content) {
    if (line.length > 3 && !line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*')) {
      // This might be a project title
      if (currentProject && currentProject.name) {
        projects.push({
          name: currentProject.name,
          description: currentProject.description || '',
          technologies: currentProject.technologies || []
        });
      }
      
      currentProject = {
        name: line,
        description: '',
        technologies: []
      };
    } else if (currentProject && line.trim().length > 0) {
      // This is project description or details
      const cleanLine = line.replace(/^[•\-*]\s*/, '');
      if (!currentProject.description) {
        currentProject.description = cleanLine;
      } else {
        currentProject.description += ' ' + cleanLine;
      }
      
      // Look for technology mentions
      const techKeywords = ['JavaScript', 'Python', 'React', 'Node.js', 'SQL', 'HTML', 'CSS', 'Java', 'C++'];
      const foundTech = techKeywords.filter(tech => 
        cleanLine.toLowerCase().includes(tech.toLowerCase())
      );
      if (foundTech.length > 0 && currentProject.technologies) {
        currentProject.technologies.push(...foundTech);
      }
    }
  }
  
  if (currentProject && currentProject.name) {
    projects.push({
      name: currentProject.name,
      description: currentProject.description || '',
      technologies: currentProject.technologies || []
    });
  }
  
  return projects;
}

function parseCertifications(content: string[]): ParsedCertification[] {
  const certifications: ParsedCertification[] = [];
  
  for (const line of content) {
    if (line.length > 3) {
      const cert: ParsedCertification = {
        name: line,
        issuer: 'Unknown'
      };
      
      // Extract dates
      const dates = extractDates(line);
      if (dates.length > 0) {
        cert.date = dates[0];
      }
      
      // Look for issuer patterns
      const issuerPatterns = [
        /\b(?:by|from|issued by)\s+(.+)/i,
        /\b(?:-|–|—)\s*(.+)$/,
        /\|\s*(.+)$/
      ];
      
      for (const pattern of issuerPatterns) {
        const issuerMatch = line.match(pattern);
        if (issuerMatch) {
          cert.issuer = issuerMatch[1].trim();
          cert.name = line.replace(issuerMatch[0], '').trim();
          break;
        }
      }
      
      certifications.push(cert);
    }
  }
  
  return certifications;
}

function cleanupParsedResume(resume: ParsedResume): void {
  // Clean up contact info
  if (resume.contact.name) {
    resume.contact.name = resume.contact.name.replace(/[^\w\s.-]/g, '').trim();
  }
  
  // Ensure we have at least basic structure
  if (!resume.contact.name) {
    resume.contact.name = 'Your Name';
  }
  
  // Clean up empty arrays and ensure minimum content
  if (resume.workExperience.length === 0) {
    resume.workExperience = [{
      position: 'Position',
      company: 'Company',
      startDate: '',
      endDate: '',
      responsibilities: []
    }];
  }
  
  if (resume.skills.length === 0) {
    resume.skills = ['Professional Skills'];
  }
  
  if (resume.education.length === 0) {
    resume.education = [{
      institution: 'Institution',
      degree: 'Degree'
    }];
  }
  
  // Limit array sizes for better formatting
  resume.skills = resume.skills.slice(0, 25);
  resume.workExperience = resume.workExperience.slice(0, 5);
  resume.education = resume.education.slice(0, 3);
  resume.projects = resume.projects.slice(0, 4);
  resume.certifications = resume.certifications.slice(0, 5);
}
