
import { ParsedResume } from '@/types/resumeStructure';
import { extractContactInfo } from './resume/contactExtractor';
import { identifySectionHeader } from './resume/sectionParser';
import { parseWorkExperience } from './resume/experienceParser';
import { parseEducation } from './resume/educationParser';
import { parseSkills } from './resume/skillsParser';
import { parseProjects } from './resume/projectsParser';
import { parseCertifications } from './resume/certificationsParser';

export function parseResumeContent(content: string): ParsedResume {
  console.log('=== STARTING RESUME PARSING ===');
  console.log('Raw content length:', content.length);
  console.log('First 300 characters:', content.substring(0, 300));
  
  const lines = content.split('\n')
    .map(line => line.trim())
    .filter(line => line.length > 0);

  console.log('Total non-empty lines:', lines.length);
  console.log('All lines:', lines);

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

  // Enhanced contact extraction - look at first 20 lines for contact info
  const headerLines = lines.slice(0, Math.min(20, lines.length));
  console.log('=== HEADER LINES FOR CONTACT ===');
  console.log(headerLines);
  
  const extractedContact = extractContactInfo(headerLines);
  resume.contact = extractedContact;
  console.log('=== EXTRACTED CONTACT RESULT ===');
  console.log(extractedContact);

  let currentSection = '';
  let sectionContent: string[] = [];
  let contactProcessed = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    console.log(`Processing line ${i}: "${line}"`);
    
    // Skip empty lines and dividers - but don't reset section for dividers
    if (!line) continue;
    
    // Check if this is just a divider line (but don't treat it as section header)
    if (line.match(/^[=\-_]{3,}$/)) {
      console.log(`Skipping divider line: "${line}"`);
      continue;
    }

    // Check if this is a section header
    const sectionType = identifySectionHeader(line);
    
    if (sectionType) {
      console.log(`Found section header: "${line}" -> ${sectionType}`);
      
      // Process previous section if we have one
      if (currentSection && sectionContent.length > 0) {
        console.log(`Processing previous section: ${currentSection} with ${sectionContent.length} lines`);
        processSectionContent(resume, currentSection, sectionContent);
      }
      
      currentSection = sectionType;
      sectionContent = [];
      contactProcessed = true; // Mark that we've moved past the header
      console.log(`Set current section to: ${currentSection}`);
      continue;
    }

    // If we haven't identified a section yet and haven't processed contact info fully
    if (!currentSection && !contactProcessed && i < 20) {
      console.log(`Still in contact area, skipping line: "${line}"`);
      continue;
    }

    // If we have a current section, add content to it
    if (currentSection) {
      console.log(`Adding to ${currentSection}: "${line}"`);
      sectionContent.push(line);
    } else if (!contactProcessed) {
      // Try to identify what this line might be
      if (line.toLowerCase().includes('summary') || line.toLowerCase().includes('objective')) {
        currentSection = 'summary';
        sectionContent = [];
        console.log(`Detected summary section from: "${line}"`);
      } else if (line.toLowerCase().includes('experience') || line.toLowerCase().includes('work')) {
        currentSection = 'experience';
        sectionContent = [];
        console.log(`Detected experience section from: "${line}"`);
      } else {
        // This might be professional summary content without a header
        if (line.length > 20 && !line.includes('@') && !line.match(/\d{3}/)) {
          resume.professionalSummary += (resume.professionalSummary ? ' ' : '') + line;
          console.log(`Added to professional summary: "${line}"`);
        }
      }
    }
  }

  // Process the last section
  if (currentSection && sectionContent.length > 0) {
    console.log(`Processing final section: ${currentSection} with ${sectionContent.length} lines`);
    processSectionContent(resume, currentSection, sectionContent);
  }

  // Enhanced fallback: if no name was extracted, try aggressive extraction
  if (!resume.contact.name) {
    console.log('=== NO NAME FOUND - TRYING AGGRESSIVE FALLBACK ===');
    
    // Try even more lines and be more permissive
    const moreHeaderLines = lines.slice(0, Math.min(25, lines.length));
    
    for (let i = 0; i < moreHeaderLines.length; i++) {
      const line = moreHeaderLines[i];
      console.log(`Fallback check line ${i}: "${line}"`);
      
      // Very permissive name check for fallback
      if (line.length > 1 && 
          line.length < 100 && 
          !line.includes('@') && 
          !line.includes('http') &&
          !line.match(/^\d+/) &&
          !line.match(/^[A-Z\s]{10,}$/) &&
          !line.match(/^(RESUME|CV|CURRICULUM|VITAE|PROFILE|SUMMARY|OBJECTIVE|EXPERIENCE|EDUCATION|SKILLS|PROJECTS|CERTIFICATIONS|CONTACT|PERSONAL|INFORMATION)$/i)) {
        
        console.log(`Aggressive fallback: Using "${line}" as name`);
        resume.contact.name = line;
        break;
      }
    }
  }

  console.log('=== FINAL PARSED RESUME ===');
  console.log('Contact:', resume.contact);
  console.log('Work Experience count:', resume.workExperience.length);
  console.log('Education count:', resume.education.length);
  console.log('Skills count:', resume.skills.length);
  console.log('Professional Summary:', resume.professionalSummary);
  
  return resume;
}

function processSectionContent(resume: ParsedResume, sectionType: string, content: string[]): void {
  console.log(`Processing section: ${sectionType} with ${content.length} lines`);
  console.log(`Section content:`, content);
  
  switch (sectionType) {
    case 'summary':
      resume.professionalSummary = content.join(' ').trim();
      console.log(`Set professional summary to: "${resume.professionalSummary}"`);
      break;
    case 'experience':
      resume.workExperience = parseWorkExperience(content);
      console.log(`Parsed ${resume.workExperience.length} work experiences`);
      break;
    case 'education':
      resume.education = parseEducation(content);
      console.log(`Parsed ${resume.education.length} education entries`);
      break;
    case 'skills':
      resume.skills = parseSkills(content);
      console.log(`Parsed ${resume.skills.length} skills`);
      break;
    case 'projects':
      resume.projects = parseProjects(content);
      console.log(`Parsed ${resume.projects.length} projects`);
      break;
    case 'certifications':
      resume.certifications = parseCertifications(content);
      console.log(`Parsed ${resume.certifications.length} certifications`);
      break;
    case 'achievements':
      resume.achievements = content.map(line => line.replace(/^[•\-*]\s*/, ''));
      console.log(`Parsed ${resume.achievements.length} achievements`);
      break;
    case 'languages':
      resume.additionalSections.languages = content;
      console.log(`Added ${content.length} language entries`);
      break;
    default:
      // Store unknown sections
      resume.additionalSections[sectionType] = content;
      console.log(`Added to additional section ${sectionType}: ${content.length} entries`);
      break;
  }
}
