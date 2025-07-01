
import { ParsedResume } from '@/types/resumeStructure';
import { generateExecutiveATSTemplate } from './executiveATSTemplate';
import { generateTechnicalATSTemplate } from './technicalATSTemplate';

export type ResumeTemplateType = 'executive' | 'technical' | 'standard';

export interface ResumeTemplate {
  id: ResumeTemplateType;
  name: string;
  description: string;
  generator: (resume: ParsedResume) => string;
  suitableFor: string[];
}

export const RESUME_TEMPLATES: Record<ResumeTemplateType, ResumeTemplate> = {
  executive: {
    id: 'executive',
    name: 'Executive ATS Template',
    description: 'Clean, professional format emphasizing leadership and achievements',
    generator: generateExecutiveATSTemplate,
    suitableFor: ['Management', 'Executive', 'Director', 'VP', 'C-Suite', 'Leadership']
  },
  technical: {
    id: 'technical',
    name: 'Technical ATS Template',
    description: 'Skills-first layout optimized for technical roles',
    generator: generateTechnicalATSTemplate,
    suitableFor: ['Software Engineer', 'Developer', 'Data Scientist', 'DevOps', 'IT', 'Technology']
  },
  standard: {
    id: 'standard',
    name: 'Standard ATS Template',
    description: 'Traditional format suitable for most industries',
    generator: (resume: ParsedResume) => {
      // This will use the existing logic - we'll implement this as a fallback
      return generateStandardATSTemplate(resume);
    },
    suitableFor: ['General', 'Sales', 'Marketing', 'Finance', 'Operations', 'HR']
  }
};

// Standard template generator (existing logic)
const generateStandardATSTemplate = (resume: ParsedResume): string => {
  const sections: string[] = [];

  // Header
  if (resume.contact.name) {
    sections.push(resume.contact.name);
    sections.push('='.repeat(resume.contact.name.length));
    sections.push('');
  }

  // Contact
  const contactInfo = [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.linkedin,
    resume.contact.address
  ].filter(Boolean).join(' | ');
  
  if (contactInfo) {
    sections.push(contactInfo);
    sections.push('');
  }

  // Professional Summary
  if (resume.professionalSummary) {
    sections.push('PROFESSIONAL SUMMARY');
    sections.push('====================');
    sections.push('');
    sections.push(resume.professionalSummary);
    sections.push('');
  }

  // Skills
  if (resume.skills.length > 0) {
    sections.push('SKILLS');
    sections.push('======');
    sections.push('');
    resume.skills.forEach(skill => {
      sections.push(`• ${skill}`);
    });
    sections.push('');
  }

  // Experience
  if (resume.workExperience.length > 0) {
    sections.push('WORK EXPERIENCE');
    sections.push('===============');
    sections.push('');

    resume.workExperience.forEach((exp, index) => {
      if (exp.position && exp.company) {
        sections.push(`${exp.position} - ${exp.company}`);
      }
      
      if (exp.startDate || exp.endDate) {
        sections.push(`${exp.startDate || ''} - ${exp.endDate || 'Present'}`);
      }
      sections.push('');

      if (exp.responsibilities && exp.responsibilities.length > 0) {
        exp.responsibilities.forEach(responsibility => {
          sections.push(`• ${responsibility}`);
        });
      }
      
      if (index < resume.workExperience.length - 1) {
        sections.push('');
      }
    });
    sections.push('');
  }

  // Education
  if (resume.education.length > 0) {
    sections.push('EDUCATION');
    sections.push('=========');
    sections.push('');

    resume.education.forEach(edu => {
      let educationLine = '';
      if (edu.degree) {
        educationLine += edu.degree;
      }
      if (edu.field) {
        educationLine += edu.degree ? ` in ${edu.field}` : edu.field;
      }
      if (educationLine) {
        sections.push(educationLine);
      }
      
      if (edu.institution) {
        sections.push(edu.institution);
      }
      
      if (edu.graduationDate) {
        sections.push(edu.graduationDate);
      }
      sections.push('');
    });
  }

  return sections.join('\n');
};

export const generateResumeWithTemplate = (
  resume: ParsedResume, 
  templateType: ResumeTemplateType = 'standard'
): string => {
  const template = RESUME_TEMPLATES[templateType];
  if (!template) {
    console.warn(`Template ${templateType} not found, using standard template`);
    return RESUME_TEMPLATES.standard.generator(resume);
  }
  
  return template.generator(resume);
};

export const getRecommendedTemplate = (resume: ParsedResume): ResumeTemplateType => {
  // Simple logic to recommend template based on resume content
  const allText = [
    resume.professionalSummary || '',
    ...resume.skills,
    ...resume.workExperience.map(exp => `${exp.position} ${exp.company} ${exp.responsibilities?.join(' ') || ''}`)
  ].join(' ').toLowerCase();

  // Check for technical keywords
  const techKeywords = ['developer', 'engineer', 'software', 'programming', 'javascript', 'python', 'react', 'node', 'aws', 'docker', 'kubernetes', 'api', 'database', 'git', 'agile', 'scrum'];
  const techMatches = techKeywords.filter(keyword => allText.includes(keyword)).length;

  // Check for executive keywords
  const execKeywords = ['director', 'manager', 'executive', 'vp', 'ceo', 'cto', 'lead', 'leadership', 'strategy', 'budget', 'team', 'growth', 'revenue'];
  const execMatches = execKeywords.filter(keyword => allText.includes(keyword)).length;

  if (techMatches >= 3) {
    return 'technical';
  } else if (execMatches >= 3) {
    return 'executive';
  }
  
  return 'standard';
};
