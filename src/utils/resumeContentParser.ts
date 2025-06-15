import { ParsedResume } from '@/types/resumeStructure';

export const parseOptimizedResumeContent = (content: string): ParsedResume => {
  console.log('=== PARSING OPTIMIZED RESUME CONTENT ===');
  console.log('Content length:', content.length);
  console.log('First 500 chars:', content.substring(0, 500));
  
  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  console.log('Total lines after filtering:', lines.length);
  
  const resume: ParsedResume = {
    contact: {
      name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: ''
    },
    professionalSummary: '',
    workExperience: [],
    skills: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
    additionalSections: {}
  };

  let currentSection = '';
  let sectionContent: string[] = [];
  let isInContactArea = true;

  // First pass: extract contact info from the beginning
  for (let i = 0; i < Math.min(15, lines.length); i++) {
    const line = lines[i];
    console.log(`Contact extraction line ${i}: "${line}"`);
    
    // Email detection - improved regex
    if (line.includes('@') && !resume.contact.email) {
      const emailMatch = line.match(/[\w\.-]+@[\w\.-]+\.\w+/);
      if (emailMatch) {
        resume.contact.email = emailMatch[0];
        console.log('Found email:', resume.contact.email);
      }
    }
    
    // Phone detection - improved to handle various formats and emojis
    const phoneMatch = line.match(/(\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
    if (phoneMatch && !resume.contact.phone) {
      resume.contact.phone = phoneMatch[0];
      console.log('Found phone:', resume.contact.phone);
    }
    
    // LinkedIn detection - improved
    if ((line.toLowerCase().includes('linkedin') || line.includes('linkedin.com')) && !resume.contact.linkedin) {
      const linkedinMatch = line.match(/linkedin\.com\/in\/[\w-]+/) || line.match(/linkedin\.com\/[\w-]+/);
      if (linkedinMatch) {
        resume.contact.linkedin = linkedinMatch[0];
      } else if (line.toLowerCase().includes('linkedin')) {
        resume.contact.linkedin = line.trim();
      }
      console.log('Found LinkedIn:', resume.contact.linkedin);
    }
    
    // Address detection - look for location indicators
    if ((line.includes('📍') || line.match(/^[A-Za-z\s]+,\s*[A-Z]{2}$/)) && !resume.contact.address) {
      resume.contact.address = line.replace('📍', '').trim();
      console.log('Found address:', resume.contact.address);
    }
    
    // Name detection (first clean line that looks like a name)
    if (!resume.contact.name && 
        !line.includes('@') && 
        !phoneMatch &&
        !line.toLowerCase().includes('linkedin') &&
        !line.match(/^[A-Z\s]{8,}$/) && // Not section headers
        !line.includes('|') &&
        !line.includes('📍') &&
        !line.includes('📞') &&
        !line.includes('✉️') &&
        !line.includes('🔗') &&
        !line.includes('💼') &&
        !line.match(/^[=\-_]{3,}$/) && // Not divider lines
        line.length > 2 && line.length < 60 &&
        line.match(/^[A-Za-z\s]+$/)) { // Only letters and spaces
      resume.contact.name = line;
      console.log('Found name:', resume.contact.name);
    }
  }

  // Second pass: process sections
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    console.log(`Processing line ${i}: "${line}"`);
    
    // Skip divider lines
    if (line.match(/^[=\-_]{3,}$/)) {
      console.log('Skipping divider line');
      continue;
    }

    // Detect section headers (all caps, common section names)
    const sectionType = identifySection(line);
    
    if (sectionType) {
      console.log(`Found section: ${line} -> ${sectionType}`);
      
      // Process previous section
      if (currentSection && sectionContent.length > 0) {
        console.log(`Processing previous section: ${currentSection} with ${sectionContent.length} lines`);
        processSectionContent(resume, currentSection, sectionContent);
      }
      
      currentSection = sectionType;
      sectionContent = [];
      isInContactArea = false;
      continue;
    }

    // Add content to current section if we have one
    if (currentSection && !isInContactArea) {
      sectionContent.push(line);
      console.log(`Added to ${currentSection}: "${line}"`);
    } else if (isInContactArea && i > 15) {
      // If we're still in contact area after 15 lines, this might be summary content
      if (line.length > 20 && !line.includes('@') && !line.match(/\d{3}/)) {
        resume.professionalSummary += (resume.professionalSummary ? ' ' : '') + line;
        console.log('Added to professional summary:', line);
      }
    }
  }

  // Process final section
  if (currentSection && sectionContent.length > 0) {
    console.log(`Processing final section: ${currentSection} with ${sectionContent.length} lines`);
    processSectionContent(resume, currentSection, sectionContent);
  }

  console.log('=== FINAL PARSED RESUME ===');
  console.log('Contact:', resume.contact);
  console.log('Professional Summary:', resume.professionalSummary);
  console.log('Work Experience count:', resume.workExperience.length);
  console.log('Education count:', resume.education.length);
  console.log('Skills count:', resume.skills.length);
  console.log('Projects count:', resume.projects.length);
  console.log('Certifications count:', resume.certifications.length);
  console.log('Achievements count:', resume.achievements.length);
  console.log('Additional sections:', Object.keys(resume.additionalSections));

  return resume;
};

function identifySection(line: string): string | null {
  const upperLine = line.toUpperCase().trim();
  
  // Common section headers - expanded list
  const sections = {
    'PROFESSIONAL SUMMARY': 'summary',
    'SUMMARY': 'summary',
    'EXECUTIVE SUMMARY': 'summary',
    'OBJECTIVE': 'summary',
    'CAREER OBJECTIVE': 'summary',
    'PROFESSIONAL EXPERIENCE': 'experience',
    'WORK EXPERIENCE': 'experience',
    'EXPERIENCE': 'experience',
    'EMPLOYMENT HISTORY': 'experience',
    'CAREER HISTORY': 'experience',
    'EMPLOYMENT': 'experience',
    'TECHNICAL SKILLS': 'skills',
    'SKILLS': 'skills',
    'CORE COMPETENCIES': 'skills',
    'COMPETENCIES': 'skills',
    'TECHNOLOGIES': 'skills',
    'KEY SKILLS': 'skills',
    'PROFESSIONAL SKILLS': 'skills',
    'EDUCATION': 'education',
    'ACADEMIC BACKGROUND': 'education',
    'QUALIFICATIONS': 'education',
    'ACADEMIC QUALIFICATIONS': 'education',
    'PROJECTS': 'projects',
    'KEY PROJECTS': 'projects',
    'NOTABLE PROJECTS': 'projects',
    'SELECTED PROJECTS': 'projects',
    'CERTIFICATIONS': 'certifications',
    'CERTIFICATES': 'certifications',
    'LICENSES': 'certifications',
    'PROFESSIONAL CERTIFICATIONS': 'certifications',
    'ACHIEVEMENTS': 'achievements',
    'ACCOMPLISHMENTS': 'achievements',
    'AWARDS': 'achievements',
    'HONORS': 'achievements',
    'KEY ACHIEVEMENTS': 'achievements',
    'LANGUAGES': 'languages',
    'ADDITIONAL INFORMATION': 'additional',
    'VOLUNTEER EXPERIENCE': 'volunteer',
    'VOLUNTEER WORK': 'volunteer',
    'PUBLICATIONS': 'publications',
    'REFERENCES': 'references',
    'PROFESSIONAL REFERENCES': 'references',
    'INTERESTS': 'interests',
    'HOBBIES': 'interests',
    'PERSONAL INTERESTS': 'interests',
    'TRAINING': 'training',
    'PROFESSIONAL DEVELOPMENT': 'training',
    'WORKSHOPS': 'training'
  };

  // Exact match first
  if (sections[upperLine]) {
    return sections[upperLine];
  }

  // Partial matches for flexibility
  for (const [key, value] of Object.entries(sections)) {
    if (upperLine.includes(key)) {
      return value;
    }
  }

  return null;
}

function processSectionContent(resume: ParsedResume, sectionType: string, content: string[]): void {
  console.log(`Processing section content for: ${sectionType}`);
  console.log('Content:', content);
  
  switch (sectionType) {
    case 'summary':
      resume.professionalSummary = content.join(' ').trim();
      break;
      
    case 'experience':
      resume.workExperience = parseWorkExperience(content);
      break;
      
    case 'skills':
      resume.skills = parseSkills(content);
      break;
      
    case 'education':
      resume.education = parseEducation(content);
      break;
      
    case 'projects':
      resume.projects = parseProjects(content);
      break;
      
    case 'certifications':
      resume.certifications = parseCertifications(content);
      break;
      
    case 'achievements':
      resume.achievements = content.map(line => line.replace(/^[•\-*]\s*/, '').trim()).filter(item => item);
      break;
      
    case 'references':
      resume.additionalSections.references = content;
      break;
      
    case 'languages':
      resume.additionalSections.languages = content;
      break;
      
    case 'volunteer':
      resume.additionalSections.volunteer = content;
      break;
      
    case 'publications':
      resume.additionalSections.publications = content;
      break;
      
    case 'interests':
      resume.additionalSections.interests = content;
      break;
      
    case 'training':
      resume.additionalSections.training = content;
      break;
      
    default:
      // Store unknown sections in additionalSections
      resume.additionalSections[sectionType] = content;
      break;
  }
}

function parseWorkExperience(content: string[]) {
  const experiences = [];
  let currentExp = null;

  for (const line of content) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      // This is a responsibility/bullet point
      if (currentExp) {
        currentExp.responsibilities.push(line.replace(/^[•\-*]\s*/, '').trim());
      }
    } else if (line.includes('|') || line.includes('–') || line.includes(' - ')) {
      // This looks like a job title/company/date line
      if (currentExp) {
        experiences.push(currentExp);
      }
      
      const parts = line.split(/[|–-]/).map(p => p.trim());
      currentExp = {
        position: parts[0] || '',
        company: parts[1] || '',
        startDate: parts[2] || '',
        endDate: parts[3] || parts[2] || '',
        responsibilities: []
      };
    } else if (line.trim() && !currentExp) {
      // First line might be just the position
      currentExp = {
        position: line.trim(),
        company: '',
        startDate: '',
        endDate: '',
        responsibilities: []
      };
    } else if (currentExp && !currentExp.company && line.trim()) {
      // This might be the company name
      currentExp.company = line.trim();
    }
  }

  if (currentExp) {
    experiences.push(currentExp);
  }

  return experiences;
}

function parseSkills(content: string[]) {
  const skills = [];
  
  for (const line of content) {
    // Split by common delimiters
    const lineSkills = line
      .replace(/^[•\-*]\s*/, '')
      .split(/[,|•·]/)
      .map(s => s.trim())
      .filter(s => s && s.length > 1);
    
    skills.push(...lineSkills);
  }
  
  return [...new Set(skills)]; // Remove duplicates
}

function parseEducation(content: string[]) {
  const education = [];
  let currentEdu = null;

  for (const line of content) {
    if (line.includes('|') || line.includes('–') || line.includes(' - ')) {
      if (currentEdu) {
        education.push(currentEdu);
      }
      
      const parts = line.split(/[|–-]/).map(p => p.trim());
      currentEdu = {
        degree: parts[0] || '',
        field: '',
        institution: parts[1] || '',
        graduationDate: parts[2] || ''
      };
    } else if (line.trim() && !currentEdu) {
      currentEdu = {
        degree: line.trim(),
        field: '',
        institution: '',
        graduationDate: ''
      };
    } else if (currentEdu && !currentEdu.institution && line.trim()) {
      currentEdu.institution = line.trim();
    }
  }

  if (currentEdu) {
    education.push(currentEdu);
  }

  return education;
}

function parseProjects(content: string[]) {
  const projects = [];
  let currentProject = null;

  for (const line of content) {
    if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      if (currentProject) {
        currentProject.description += (currentProject.description ? ' ' : '') + 
          line.replace(/^[•\-*]\s*/, '').trim();
      }
    } else if (line.trim()) {
      if (currentProject) {
        projects.push(currentProject);
      }
      
      currentProject = {
        name: line.trim(),
        description: '',
        technologies: []
      };
    }
  }

  if (currentProject) {
    projects.push(currentProject);
  }

  return projects;
}

function parseCertifications(content: string[]) {
  const certifications = [];

  for (const line of content) {
    if (line.includes('|') || line.includes('–') || line.includes(' - ')) {
      const parts = line.split(/[|–-]/).map(p => p.trim());
      certifications.push({
        name: parts[0] || '',
        issuer: parts[1] || 'Unknown',
        date: parts[2] || ''
      });
    } else if (line.trim()) {
      certifications.push({
        name: line.replace(/^[•\-*]\s*/, '').trim(),
        issuer: 'Unknown',
        date: ''
      });
    }
  }

  return certifications;
}
