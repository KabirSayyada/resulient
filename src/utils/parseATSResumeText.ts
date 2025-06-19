
import { ParsedResume } from '@/types/resumeStructure';

export function parseATSResumeText(resumeText: string): ParsedResume {
  const lines = resumeText.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const parsedResume: ParsedResume = {
    contact: {},
    professionalSummary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    additionalSections: {}
  };

  let currentSection = '';
  let currentContent: string[] = [];
  let currentExperience: any = null;
  let currentEducation: any = null;
  let currentProject: any = null;
  let currentCertification: any = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const nextLine = i + 1 < lines.length ? lines[i + 1] : '';
    
    // Check if this is a section header (next line is underline)
    if (nextLine.match(/^=+$/)) {
      // Save previous section content
      if (currentSection && currentContent.length > 0) {
        saveCurrentSection(parsedResume, currentSection, currentContent);
      }
      
      currentSection = line.toUpperCase();
      currentContent = [];
      i++; // Skip the underline
      continue;
    }
    
    // Skip underline patterns
    if (line.match(/^=+$/)) {
      continue;
    }
    
    // If we're in the name/contact section (first content)
    if (!currentSection && line.length > 0) {
      if (!parsedResume.contact.name && !line.includes('@') && !line.includes('|')) {
        parsedResume.contact.name = line;
      } else if (line.includes('@') || line.includes('|') || line.match(/\d{3}/)) {
        // Parse contact information
        parseContactInfo(parsedResume, line);
      }
      continue;
    }
    
    currentContent.push(line);
  }
  
  // Save the last section
  if (currentSection && currentContent.length > 0) {
    saveCurrentSection(parsedResume, currentSection, currentContent);
  }
  
  return parsedResume;
}

function parseContactInfo(resume: ParsedResume, line: string) {
  const parts = line.split('|').map(part => part.trim());
  
  for (const part of parts) {
    if (part.includes('@')) {
      resume.contact.email = part;
    } else if (part.match(/\(\d{3}\)|\d{3}-\d{3}-\d{4}|\+\d/)) {
      resume.contact.phone = part;
    } else if (part.toLowerCase().includes('linkedin')) {
      resume.contact.linkedin = part;
    } else if (part.match(/\d+\s+\w+/) || part.includes(',')) {
      resume.contact.address = part;
    }
  }
}

function saveCurrentSection(resume: ParsedResume, section: string, content: string[]) {
  switch (section) {
    case 'PROFESSIONAL SUMMARY':
    case 'SUMMARY':
      resume.professionalSummary = content.join(' ');
      break;
      
    case 'PROFESSIONAL EXPERIENCE':
    case 'EXPERIENCE':
    case 'WORK EXPERIENCE':
      parseWorkExperience(resume, content);
      break;
      
    case 'EDUCATION':
      parseEducation(resume, content);
      break;
      
    case 'SKILLS':
    case 'TECHNICAL SKILLS':
    case 'CORE COMPETENCIES':
      parseSkills(resume, content);
      break;
      
    case 'PROJECTS':
    case 'KEY PROJECTS':
      parseProjects(resume, content);
      break;
      
    case 'CERTIFICATIONS':
    case 'PROFESSIONAL CERTIFICATIONS':
      parseCertifications(resume, content);
      break;
      
    case 'ACHIEVEMENTS':
    case 'ACHIEVEMENTS & HONORS':
    case 'AWARDS':
      parseAchievements(resume, content);
      break;
      
    case 'LANGUAGES':
      parseLanguages(resume, content);
      break;
      
    default:
      // Handle additional sections
      const sectionName = section.toLowerCase().replace(/[^a-z0-9]/g, '');
      resume.additionalSections[sectionName] = content.filter(line => line.startsWith('•')).map(line => line.replace(/^•\s*/, ''));
      break;
  }
}

function parseWorkExperience(resume: ParsedResume, content: string[]) {
  let currentExp: any = null;
  
  for (const line of content) {
    if (line.startsWith('•')) {
      // This is a responsibility
      if (currentExp) {
        if (!currentExp.responsibilities) currentExp.responsibilities = [];
        currentExp.responsibilities.push(line.replace(/^•\s*/, ''));
      }
    } else {
      // This might be a new job entry
      if (currentExp) {
        resume.workExperience.push(currentExp);
      }
      
      // Parse job title and company
      const parts = line.split(' - ');
      if (parts.length >= 2) {
        currentExp = {
          position: parts[0].trim(),
          company: parts[1].trim(),
          responsibilities: []
        };
        
        // Look for dates in the line
        const dateMatch = line.match(/(\d{4})\s*-\s*(\d{4}|Present)/);
        if (dateMatch) {
          currentExp.startDate = dateMatch[1];
          currentExp.endDate = dateMatch[2];
        }
      } else {
        currentExp = {
          position: line,
          company: '',
          responsibilities: []
        };
      }
    }
  }
  
  if (currentExp) {
    resume.workExperience.push(currentExp);
  }
}

function parseEducation(resume: ParsedResume, content: string[]) {
  let currentEdu: any = null;
  
  for (const line of content) {
    if (!line.startsWith('•')) {
      if (currentEdu) {
        resume.education.push(currentEdu);
      }
      
      currentEdu = {
        degree: '',
        field: '',
        institution: '',
        graduationDate: ''
      };
      
      // Parse degree and institution
      if (line.includes(' in ')) {
        const parts = line.split(' in ');
        currentEdu.degree = parts[0].trim();
        currentEdu.field = parts[1].trim();
      } else {
        currentEdu.degree = line;
      }
      
      // Look for dates
      const dateMatch = line.match(/\d{4}/);
      if (dateMatch) {
        currentEdu.graduationDate = dateMatch[0];
      }
    } else {
      // Institution or additional info
      const cleanLine = line.replace(/^•\s*/, '');
      if (currentEdu && !currentEdu.institution) {
        currentEdu.institution = cleanLine;
      }
    }
  }
  
  if (currentEdu) {
    resume.education.push(currentEdu);
  }
}

function parseSkills(resume: ParsedResume, content: string[]) {
  for (const line of content) {
    if (line.startsWith('•')) {
      resume.skills.push(line.replace(/^•\s*/, ''));
    } else {
      // Handle comma-separated skills
      const skills = line.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0);
      resume.skills.push(...skills);
    }
  }
}

function parseProjects(resume: ParsedResume, content: string[]) {
  let currentProject: any = null;
  
  for (const line of content) {
    if (line.startsWith('•')) {
      if (!currentProject) {
        currentProject = {
          name: line.replace(/^•\s*/, ''),
          description: '',
          technologies: []
        };
      } else {
        // This is description or additional info
        if (!currentProject.description) {
          currentProject.description = line.replace(/^•\s*/, '');
        }
      }
    } else {
      if (currentProject) {
        resume.projects.push(currentProject);
      }
      currentProject = {
        name: line,
        description: '',
        technologies: []
      };
    }
  }
  
  if (currentProject) {
    resume.projects.push(currentProject);
  }
}

function parseCertifications(resume: ParsedResume, content: string[]) {
  for (const line of content) {
    if (line.startsWith('•')) {
      const cleanLine = line.replace(/^•\s*/, '');
      const parts = cleanLine.split(' - ');
      
      const cert = {
        name: parts[0].trim(),
        issuer: parts.length > 1 ? parts[1].trim() : 'Unknown',
        date: '',
        expirationDate: ''
      };
      
      // Look for dates
      const dateMatch = cleanLine.match(/\d{4}/);
      if (dateMatch) {
        cert.date = dateMatch[0];
      }
      
      resume.certifications.push(cert);
    }
  }
}

function parseAchievements(resume: ParsedResume, content: string[]) {
  for (const line of content) {
    if (line.startsWith('•')) {
      resume.achievements.push(line.replace(/^•\s*/, ''));
    } else if (line.trim().length > 0) {
      resume.achievements.push(line);
    }
  }
}

function parseLanguages(resume: ParsedResume, content: string[]) {
  for (const line of content) {
    if (line.startsWith('•')) {
      resume.languages?.push(line.replace(/^•\s*/, ''));
    } else {
      // Handle comma-separated languages
      const languages = line.split(',').map(lang => lang.trim()).filter(lang => lang.length > 0);
      if (!resume.languages) resume.languages = [];
      resume.languages.push(...languages);
    }
  }
}
