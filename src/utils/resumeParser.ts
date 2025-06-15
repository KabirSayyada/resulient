
import { ParsedResume } from '@/types/resumeStructure';
import { parseSections, parseStructuredSections } from './resume/sectionParser';
import { extractContactInfo } from './resume/contactExtractor';
import { cleanResumeContent } from './resume/textCleaner';

export function parseResumeContent(content: string): ParsedResume {
  console.log('Starting resume parsing...');
  
  // Clean the content
  const cleanedContent = cleanResumeContent(content);
  console.log('Content cleaned');
  
  // Parse sections
  const sections = parseSections(cleanedContent);
  console.log('Sections identified:', Object.keys(sections));
  
  // Parse structured content
  const structuredData = parseStructuredSections(sections);
  console.log('Structured data parsed');
  
  // Extract contact information - get first 10 lines for contact extraction
  const lines = cleanedContent.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  const contactLines = lines.slice(0, 10);
  const contact = extractContactInfo(contactLines);
  console.log('Contact extracted:', contact);
  
  // Build the parsed resume
  const parsedResume: ParsedResume = {
    contact,
    professionalSummary: sections.summary ? sections.summary.join(' ') : undefined,
    workExperience: structuredData.workExperience,
    education: structuredData.education,
    skills: structuredData.skills,
    projects: structuredData.projects,
    certifications: structuredData.certifications,
    achievements: structuredData.achievements,
    languages: structuredData.languages,
    volunteerExperience: structuredData.volunteerExperience, // Now properly structured
    additionalSections: {}
  };
  
  // Add remaining sections to additionalSections
  const handledSections = new Set([
    'summary', 'experience', 'education', 'skills', 'projects', 
    'certifications', 'achievements', 'languages', 'volunteer', 'hobbies'
  ]);
  
  Object.entries(sections).forEach(([sectionName, content]) => {
    if (!handledSections.has(sectionName)) {
      parsedResume.additionalSections[sectionName] = content;
    }
  });
  
  // Add hobbies to additional sections if they exist
  if (structuredData.hobbies && structuredData.hobbies.length > 0) {
    parsedResume.additionalSections['hobbies'] = structuredData.hobbies;
  }
  
  console.log('Resume parsing completed');
  return parsedResume;
}
