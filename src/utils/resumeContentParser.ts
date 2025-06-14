
import { ParsedResume } from '@/types/resumeStructure';
import { EMAIL_REGEX, PHONE_REGEX, LINKEDIN_REGEX } from './resume/constants';

export function parseOptimizedResumeContent(content: string): ParsedResume {
  console.log('=== PARSING OPTIMIZED RESUME CONTENT ===');
  console.log('Content length:', content.length);
  console.log('Full content:', content);
  
  const resume: ParsedResume = {
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

  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  console.log('Total lines to process:', lines.length);
  
  let currentSection = '';
  let currentExperience: any = null;
  let currentEducation: any = null;
  let currentProject: any = null;
  let currentCertification: any = null;
  let headerProcessed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();
    console.log(`Processing line ${i}: "${line}"`);

    // Enhanced section header detection with more patterns
    if (isSectionHeader(upperLine, line)) {
      console.log(`Found section header: "${line}"`);
      
      // Save any current items before switching sections
      if (currentExperience && currentSection === 'experience') {
        resume.workExperience.push(currentExperience);
        currentExperience = null;
      }
      if (currentEducation && currentSection === 'education') {
        resume.education.push(currentEducation);
        currentEducation = null;
      }
      if (currentProject && currentSection === 'projects') {
        resume.projects.push(currentProject);
        currentProject = null;
      }
      if (currentCertification && currentSection === 'certifications') {
        resume.certifications.push(currentCertification);
        currentCertification = null;
      }
      
      currentSection = getSectionType(upperLine);
      console.log(`Set current section to: ${currentSection}`);
      headerProcessed = true;
      continue;
    }

    // Extract contact info from header (first few lines)
    if (!headerProcessed && i < 10) {
      console.log(`Processing header line ${i}: "${line}"`);
      
      // Check if this is the name (first non-contact line)
      if (!resume.contact.name && !isContactLine(line) && line.length > 2 && line.length < 100) {
        resume.contact.name = line;
        console.log('Found name:', line);
        continue;
      }
      
      // Extract contact information
      extractContactFromLine(line, resume.contact);
      continue;
    }

    // Process content based on current section
    switch (currentSection) {
      case 'summary':
        if (line && !isSectionHeader(upperLine, line)) {
          resume.professionalSummary += (resume.professionalSummary ? ' ' : '') + line;
          console.log('Added to summary:', line);
        }
        break;

      case 'experience':
        processExperienceContent(line, resume, currentExperience);
        break;

      case 'skills':
        processSkillsContent(line, resume);
        break;

      case 'education':
        processEducationContent(line, resume, currentEducation);
        break;

      case 'projects':
        processProjectsContent(line, resume, currentProject);
        break;

      case 'certifications':
        processCertificationsContent(line, resume, currentCertification);
        break;

      case 'achievements':
        if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
          const achievement = line.replace(/^[•\-*]\s*/, '').trim();
          if (achievement) {
            resume.achievements.push(achievement);
            console.log('Added achievement:', achievement);
          }
        } else if (line && !isSectionHeader(upperLine, line)) {
          resume.achievements.push(line);
          console.log('Added achievement:', line);
        }
        break;

      case 'languages':
        if (line && !isSectionHeader(upperLine, line)) {
          const languages = line.split(/[,;|•]/).map(lang => lang.trim()).filter(lang => lang);
          resume.languages = resume.languages || [];
          resume.languages.push(...languages);
          console.log('Added languages:', languages);
        }
        break;

      default:
        // Handle additional sections
        if (currentSection && line && !isSectionHeader(upperLine, line)) {
          if (!resume.additionalSections[currentSection]) {
            resume.additionalSections[currentSection] = [];
          }
          
          if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
            resume.additionalSections[currentSection].push(line.replace(/^[•\-*]\s*/, '').trim());
          } else {
            resume.additionalSections[currentSection].push(line);
          }
          console.log(`Added to additional section ${currentSection}:`, line);
        }
        break;
    }
  }

  // Add final items
  if (currentExperience && currentSection === 'experience') {
    resume.workExperience.push(currentExperience);
  }
  if (currentEducation && currentSection === 'education') {
    resume.education.push(currentEducation);
  }
  if (currentProject && currentSection === 'projects') {
    resume.projects.push(currentProject);
  }
  if (currentCertification && currentSection === 'certifications') {
    resume.certifications.push(currentCertification);
  }

  console.log('=== FINAL PARSED RESUME ===');
  console.log('Contact:', resume.contact);
  console.log('Professional Summary:', resume.professionalSummary);
  console.log('Work Experience:', resume.workExperience.length, 'items');
  console.log('Skills:', resume.skills.length, 'items');
  console.log('Education:', resume.education.length, 'items');
  console.log('Projects:', resume.projects.length, 'items');
  console.log('Certifications:', resume.certifications.length, 'items');
  console.log('Achievements:', resume.achievements.length, 'items');
  console.log('Languages:', resume.languages?.length || 0, 'items');
  console.log('Additional Sections:', Object.keys(resume.additionalSections));

  return resume;
}

function isSectionHeader(upperLine: string, originalLine: string): boolean {
  const sectionPatterns = [
    'PROFESSIONAL SUMMARY', 'SUMMARY', 'OBJECTIVE', 'PROFILE', 'ABOUT',
    'PROFESSIONAL EXPERIENCE', 'WORK EXPERIENCE', 'EXPERIENCE', 'EMPLOYMENT', 'WORK HISTORY',
    'TECHNICAL SKILLS', 'SKILLS', 'CORE COMPETENCIES', 'COMPETENCIES', 'EXPERTISE',
    'EDUCATION', 'ACADEMIC BACKGROUND', 'QUALIFICATIONS', 'ACADEMIC',
    'PROJECTS', 'KEY PROJECTS', 'NOTABLE PROJECTS', 'PERSONAL PROJECTS',
    'CERTIFICATIONS', 'CERTIFICATES', 'CREDENTIALS', 'PROFESSIONAL CERTIFICATIONS',
    'ACHIEVEMENTS', 'ACCOMPLISHMENTS', 'AWARDS', 'HONORS', 'RECOGNITION',
    'LANGUAGES', 'LANGUAGE SKILLS', 'LINGUISTIC SKILLS'
  ];

  // Check for exact matches or section headers with separators
  const isExactMatch = sectionPatterns.some(pattern => upperLine.includes(pattern));
  const isHeaderWithSeparators = originalLine.match(/^[=\-]{3,}/) || originalLine.match(/[=\-]{3,}$/);
  const isShortAllCaps = upperLine === originalLine && originalLine.length < 50 && originalLine.length > 3;

  return isExactMatch || (isHeaderWithSeparators && isShortAllCaps);
}

function getSectionType(upperLine: string): string {
  if (upperLine.includes('SUMMARY') || upperLine.includes('OBJECTIVE') || upperLine.includes('PROFILE') || upperLine.includes('ABOUT')) return 'summary';
  if (upperLine.includes('EXPERIENCE') || upperLine.includes('EMPLOYMENT') || upperLine.includes('WORK')) return 'experience';
  if (upperLine.includes('SKILLS') || upperLine.includes('COMPETENCIES') || upperLine.includes('EXPERTISE')) return 'skills';
  if (upperLine.includes('EDUCATION') || upperLine.includes('ACADEMIC') || upperLine.includes('QUALIFICATIONS')) return 'education';
  if (upperLine.includes('PROJECTS')) return 'projects';
  if (upperLine.includes('CERTIFICATIONS') || upperLine.includes('CERTIFICATES') || upperLine.includes('CREDENTIALS')) return 'certifications';
  if (upperLine.includes('ACHIEVEMENTS') || upperLine.includes('ACCOMPLISHMENTS') || upperLine.includes('AWARDS')) return 'achievements';
  if (upperLine.includes('LANGUAGES') || upperLine.includes('LANGUAGE')) return 'languages';
  
  // Return the cleaned section name for additional sections
  return upperLine.toLowerCase().replace(/[^a-z\s]/g, '').trim();
}

function isContactLine(line: string): boolean {
  return EMAIL_REGEX.test(line) || PHONE_REGEX.test(line) || LINKEDIN_REGEX.test(line) || 
         line.includes('linkedin.com') || line.includes('http') || line.includes('www.');
}

function extractContactFromLine(line: string, contact: any): void {
  // Handle multi-part contact lines
  const parts = line.split(/\s*\|\s*|\s*•\s*|\s{3,}/).filter(p => p.trim());
  
  for (const part of parts) {
    const trimmedPart = part.trim();
    
    if (EMAIL_REGEX.test(trimmedPart) && !contact.email) {
      contact.email = trimmedPart.match(EMAIL_REGEX)?.[0];
      console.log('Found email:', contact.email);
    }
    
    if (PHONE_REGEX.test(trimmedPart) && !contact.phone) {
      contact.phone = trimmedPart.match(PHONE_REGEX)?.[0];
      console.log('Found phone:', contact.phone);
    }
    
    if (LINKEDIN_REGEX.test(trimmedPart) && !contact.linkedin) {
      contact.linkedin = trimmedPart.match(LINKEDIN_REGEX)?.[0];
      console.log('Found LinkedIn:', contact.linkedin);
    }
    
    if ((trimmedPart.includes('http') || trimmedPart.includes('www.')) && !contact.website && !trimmedPart.includes('linkedin')) {
      contact.website = trimmedPart;
      console.log('Found website:', contact.website);
    }
    
    if ((trimmedPart.includes(',') || trimmedPart.match(/\b[A-Z]{2}\s+\d{5}/)) && !contact.address) {
      contact.address = trimmedPart;
      console.log('Found address:', contact.address);
    }
  }
}

function processExperienceContent(line: string, resume: ParsedResume, currentExperience: any): any {
  if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
    // This is a responsibility
    if (currentExperience) {
      const responsibility = line.replace(/^[•\-*]\s*/, '').trim();
      if (responsibility) {
        currentExperience.responsibilities.push(responsibility);
        console.log('Added responsibility:', responsibility);
      }
    }
  } else if (line.includes(' - ') && !line.startsWith('•')) {
    // This looks like a new job entry
    if (currentExperience) {
      resume.workExperience.push(currentExperience);
    }
    
    const parts = line.split(' - ');
    currentExperience = {
      position: parts[0]?.trim() || '',
      company: parts[1]?.trim() || '',
      startDate: '',
      endDate: '',
      location: '',
      responsibilities: []
    };
    console.log('Started new experience:', currentExperience.position, 'at', currentExperience.company);
  } else if (currentExperience && line.match(/\d{4}/)) {
    // This looks like a date/location line
    const dateParts = line.split('|').map(p => p.trim());
    const dateRange = dateParts[0] || line;
    
    if (dateRange.includes(' - ')) {
      const dates = dateRange.split(' - ').map(d => d.trim());
      currentExperience.startDate = dates[0] || '';
      currentExperience.endDate = dates[1] || '';
    } else {
      currentExperience.startDate = dateRange;
    }
    
    if (dateParts.length > 1) {
      currentExperience.location = dateParts[1];
    }
    console.log('Added dates/location:', currentExperience.startDate, currentExperience.endDate, currentExperience.location);
  }
  
  return currentExperience;
}

function processSkillsContent(line: string, resume: ParsedResume): void {
  if (line && !isSectionHeader(line.toUpperCase(), line)) {
    const skills = line.split(/[,;|•]/).map(skill => skill.trim()).filter(skill => skill);
    resume.skills.push(...skills);
    console.log('Added skills:', skills);
  }
}

function processEducationContent(line: string, resume: ParsedResume, currentEducation: any): any {
  if (line.includes(' - ') || line.toLowerCase().includes('university') || line.toLowerCase().includes('college') || line.includes(' in ')) {
    // This looks like a new education entry
    if (currentEducation) {
      resume.education.push(currentEducation);
    }
    
    if (line.includes(' - ')) {
      const parts = line.split(' - ');
      currentEducation = {
        degree: parts[0]?.trim() || '',
        institution: parts[1]?.trim() || '',
        field: '',
        graduationDate: '',
        gpa: ''
      };
    } else {
      currentEducation = {
        degree: line,
        institution: '',
        field: '',
        graduationDate: '',
        gpa: ''
      };
    }
    console.log('Started new education:', currentEducation.degree);
  } else if (currentEducation && line.match(/\d{4}/)) {
    currentEducation.graduationDate = line;
    console.log('Added graduation date:', line);
  } else if (currentEducation && !currentEducation.institution && line.length > 3) {
    currentEducation.institution = line;
    console.log('Added institution:', line);
  }
  
  return currentEducation;
}

function processProjectsContent(line: string, resume: ParsedResume, currentProject: any): any {
  if (!line.startsWith('•') && !line.startsWith('-') && !line.startsWith('*') && line.length > 3) {
    // This looks like a new project
    if (currentProject) {
      resume.projects.push(currentProject);
    }
    
    currentProject = {
      name: line,
      description: '',
      technologies: []
    };
    console.log('Started new project:', currentProject.name);
  } else if (currentProject && (line.startsWith('•') || line.startsWith('-') || line.startsWith('*'))) {
    const content = line.replace(/^[•\-*]\s*/, '').trim();
    if (content.toLowerCase().includes('tech') || content.toLowerCase().includes('using')) {
      // This might be technologies
      const techMatch = content.match(/(?:technologies?|tech|using):\s*(.+)/i);
      if (techMatch) {
        const techs = techMatch[1].split(/[,;]/).map(t => t.trim()).filter(t => t);
        currentProject.technologies.push(...techs);
        console.log('Added technologies:', techs);
      } else {
        currentProject.description += (currentProject.description ? ' ' : '') + content;
      }
    } else {
      currentProject.description += (currentProject.description ? ' ' : '') + content;
      console.log('Added to project description:', content);
    }
  }
  
  return currentProject;
}

function processCertificationsContent(line: string, resume: ParsedResume, currentCertification: any): any {
  if (line && !isSectionHeader(line.toUpperCase(), line)) {
    const cert = {
      name: line,
      issuer: 'Unknown',
      date: ''
    };
    
    // Try to extract issuer and date
    if (line.includes(' - ')) {
      const parts = line.split(' - ');
      cert.name = parts[0]?.trim() || line;
      cert.issuer = parts[1]?.trim() || 'Unknown';
    }
    
    if (line.includes('(') && line.includes(')')) {
      const dateMatch = line.match(/\(([^)]+)\)/);
      if (dateMatch) {
        cert.date = dateMatch[1];
        cert.name = line.replace(dateMatch[0], '').trim();
      }
    }
    
    resume.certifications.push(cert);
    console.log('Added certification:', cert);
  }
  
  return currentCertification;
}
