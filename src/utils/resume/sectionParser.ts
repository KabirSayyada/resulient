
import { parseWorkExperience } from './experienceParser';
import { parseEducation } from './educationParser';
import { parseProjects } from './projectsParser';
import { parseCertifications } from './certificationsParser';
import { parseVolunteerExperience } from './volunteerParser';
import { parseSkills } from './skillsParser';

export interface ParsedSections {
  [key: string]: string[];
}

export function parseSections(text: string): ParsedSections {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const sections: ParsedSections = {};
  
  let currentSection = '';
  let currentContent: string[] = [];
  
  for (const line of lines) {
    if (isSectionHeader(line)) {
      // Save previous section
      if (currentSection && currentContent.length > 0) {
        sections[currentSection] = currentContent;
      }
      
      currentSection = normalizeSectionName(line);
      currentContent = [];
    } else if (currentSection) {
      currentContent.push(line);
    }
  }
  
  // Save last section
  if (currentSection && currentContent.length > 0) {
    sections[currentSection] = currentContent;
  }
  
  return sections;
}

function isSectionHeader(line: string): boolean {
  const normalizedLine = line.toLowerCase().trim();
  
  // Common section headers
  const sectionKeywords = [
    'experience', 'work experience', 'professional experience', 'employment',
    'education', 'academic background', 'qualifications',
    'skills', 'technical skills', 'core competencies', 'expertise',
    'projects', 'personal projects', 'notable projects',
    'certifications', 'certificates', 'licenses',
    'achievements', 'accomplishments', 'honors', 'awards',
    'summary', 'profile', 'objective', 'about',
    'languages', 'language skills',
    'volunteer', 'volunteer experience', 'community service', 'volunteering',
    'hobbies', 'interests', 'personal interests',
    'references', 'contact', 'publications'
  ];
  
  // Check if line matches section patterns
  return (
    // All caps with potential separators
    (line === line.toUpperCase() && line.length > 2) ||
    // Contains section keywords
    sectionKeywords.some(keyword => normalizedLine.includes(keyword)) ||
    // Has section-like formatting
    /^[A-Z][A-Z\s]+:?\s*$/.test(line) ||
    // Underlined or emphasized
    /^[=\-_]{3,}/.test(line) ||
    // Numbered sections
    /^\d+\.\s*[A-Z]/.test(line)
  );
}

function normalizeSectionName(line: string): string {
  let normalized = line.toLowerCase()
    .replace(/[:\-_=]/g, '')
    .replace(/^\d+\.\s*/, '')
    .trim();
  
  // Map common variations to standard names
  const mappings: { [key: string]: string } = {
    'work experience': 'experience',
    'professional experience': 'experience',
    'employment history': 'experience',
    'employment': 'experience',
    'work history': 'experience',
    'career history': 'experience',
    
    'technical skills': 'skills',
    'core competencies': 'skills',
    'expertise': 'skills',
    'competencies': 'skills',
    
    'academic background': 'education',
    'educational background': 'education',
    'qualifications': 'education',
    
    'personal projects': 'projects',
    'notable projects': 'projects',
    'key projects': 'projects',
    
    'certificates': 'certifications',
    'licenses': 'certifications',
    'professional certifications': 'certifications',
    
    'accomplishments': 'achievements',
    'honors': 'achievements',
    'awards': 'achievements',
    'recognition': 'achievements',
    
    'profile': 'summary',
    'objective': 'summary',
    'about me': 'summary',
    'about': 'summary',
    'professional summary': 'summary',
    
    'language skills': 'languages',
    'foreign languages': 'languages',
    
    'volunteer experience': 'volunteer',
    'volunteering': 'volunteer',
    'community service': 'volunteer',
    'community involvement': 'volunteer',
    
    'personal interests': 'hobbies',
    'interests': 'hobbies',
    'hobbies and interests': 'hobbies'
  };
  
  return mappings[normalized] || normalized;
}

export function parseStructuredSections(sections: ParsedSections) {
  return {
    workExperience: sections.experience ? parseWorkExperience(sections.experience) : [],
    education: sections.education ? parseEducation(sections.education) : [],
    projects: sections.projects ? parseProjects(sections.projects) : [],
    certifications: sections.certifications ? parseCertifications(sections.certifications) : [],
    volunteerExperience: sections.volunteer ? parseVolunteerExperience(sections.volunteer) : [],
    skills: sections.skills ? parseSkills(sections.skills) : [],
    achievements: sections.achievements || [],
    languages: sections.languages || [],
    hobbies: sections.hobbies || []
  };
}
