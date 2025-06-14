
import { ParsedResume } from '@/types/resumeStructure';
import { extractContactInfo } from './resume/contactExtractor';
import { identifySectionHeader } from './resume/sectionParser';
import { parseExperience } from './resume/experienceParser';
import { parseEducation } from './resume/educationParser';
import { parseSkills } from './resume/skillsParser';
import { parseProjects } from './resume/projectsParser';
import { parseCertifications } from './resume/certificationsParser';

export function parseResumeContent(content: string): ParsedResume {
  console.log('Starting resume parsing with content:', content.substring(0, 200));
  
  const lines = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  const resume: ParsedResume = {
    contact: {},
    professionalSummary: '',
    workExperience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    achievements: [],
    additionalSections: {}
  };

  // Enhanced contact extraction - look at first 10 lines for contact info
  const headerLines = lines.slice(0, Math.min(10, lines.length));
  console.log('Header lines for contact extraction:', headerLines);
  
  const extractedContact = extractContactInfo(headerLines);
  resume.contact = extractedContact;
  console.log('Extracted contact info:', extractedContact);

  let currentSection = '';
  let sectionContent: string[] = [];
  let contactProcessed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Skip empty lines and dividers
    if (!line || line.match(/^[=\-_]{3,}$/)) continue;

    // Check if this is a section header
    const sectionType = identifySectionHeader(line);
    
    if (sectionType) {
      // Process previous section if we have one
      if (currentSection && sectionContent.length > 0) {
        processSectionContent(resume, currentSection, sectionContent);
      }
      
      currentSection = sectionType;
      sectionContent = [];
      contactProcessed = true; // Mark that we've moved past the header
      continue;
    }

    // If we haven't identified a section yet and haven't processed contact info fully
    if (!currentSection && !contactProcessed && i < 10) {
      // This might be additional contact info - skip for now as it's handled above
      continue;
    }

    // If we have a current section, add content to it
    if (currentSection) {
      sectionContent.push(line);
    } else if (!contactProcessed) {
      // Try to identify what this line might be
      if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('objective')) {
        currentSection = 'summary';
        sectionContent = [];
      } else if (line.toLowerCase().includes('experience') || line.toLowerCase().includes('work')) {
        currentSection = 'experience';
        sectionContent = [];
      } else {
        // This might be professional summary content without a header
        if (line.length > 20 && !line.includes('@') && !line.match(/\d{3}/)) {
          resume.professionalSummary += (resume.professionalSummary ? ' ' : '') + line;
        }
      }
    }
  }

  // Process the last section
  if (currentSection && sectionContent.length > 0) {
    processSectionContent(resume, currentSection, sectionContent);
  }

  // Fallback: if no name was extracted, try to find it in the first few lines
  if (!resume.contact.name) {
    for (const line of headerLines) {
      if (couldBeName(line) && !line.includes('@') && !line.match(/\d{3}/)) {
        resume.contact.name = line;
        console.log('Fallback name extraction:', line);
        break;
      }
    }
  }

  console.log('Final parsed resume:', resume);
  return resume;
}

function couldBeName(line: string): boolean {
  return (
    line.length > 2 && 
    line.length < 80 && 
    !line.includes('http') &&
    !line.includes('@') &&
    !line.match(/^\d/) && 
    line.split(' ').length >= 1 &&
    line.split(' ').length <= 5 &&
    !line.match(/^[A-Z\s]{10,}$/) // Not a long all-caps header
  );
}

function processSectionContent(resume: ParsedResume, sectionType: string, content: string[]): void {
  console.log(`Processing section: ${sectionType} with ${content.length} lines`);
  
  switch (sectionType) {
    case 'summary':
      resume.professionalSummary = content.join(' ').trim();
      break;
    case 'experience':
      resume.workExperience = parseExperience(content);
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
      resume.achievements = content.map(line => line.replace(/^[•\-*]\s*/, ''));
      break;
    case 'languages':
      resume.additionalSections.languages = content;
      break;
    default:
      // Store unknown sections
      resume.additionalSections[sectionType] = content;
      break;
  }
}
