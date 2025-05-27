
import jsPDF from 'jspdf';
import { ParsedResume } from '@/types/resumeStructure';

interface PDFSettings {
  pageWidth: number;
  pageHeight: number;
  margin: number;
  fontSize: {
    name: number;
    header: number;
    subheader: number;
    body: number;
    small: number;
  };
  lineHeight: {
    normal: number;
    tight: number;
  };
  colors: {
    primary: string;
    secondary: string;
    text: string;
  };
}

const PDF_SETTINGS: PDFSettings = {
  pageWidth: 595.28, // A4 width in points
  pageHeight: 841.89, // A4 height in points
  margin: 40,
  fontSize: {
    name: 18,
    header: 12,
    subheader: 10,
    body: 9,
    small: 8
  },
  lineHeight: {
    normal: 1.4,
    tight: 1.2
  },
  colors: {
    primary: '#1f2937',
    secondary: '#374151',
    text: '#111827'
  }
};

class ResumePDFGenerator {
  private pdf: jsPDF;
  private currentY: number;
  private settings: PDFSettings;
  private contentWidth: number;

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    this.settings = PDF_SETTINGS;
    this.currentY = this.settings.margin;
    this.contentWidth = this.settings.pageWidth - (this.settings.margin * 2);
  }

  private checkPageBreak(neededHeight: number): void {
    if (this.currentY + neededHeight > this.settings.pageHeight - this.settings.margin) {
      this.pdf.addPage();
      this.currentY = this.settings.margin;
    }
  }

  private addText(
    text: string, 
    fontSize: number, 
    fontStyle: 'normal' | 'bold' = 'normal',
    color: string = this.settings.colors.text,
    indent: number = 0,
    maxWidth?: number
  ): void {
    if (!text || text.trim() === '') return;

    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontStyle);
    this.pdf.setTextColor(color);

    const effectiveWidth = maxWidth || (this.contentWidth - indent);
    const lines = this.pdf.splitTextToSize(text, effectiveWidth);
    const lineHeight = fontSize * this.settings.lineHeight.normal;

    // Check if we need a new page
    this.checkPageBreak(lines.length * lineHeight);

    for (const line of lines) {
      this.pdf.text(line, this.settings.margin + indent, this.currentY);
      this.currentY += lineHeight;
    }
  }

  private addSpace(points: number): void {
    this.currentY += points;
  }

  private addLine(): void {
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(
      this.settings.margin, 
      this.currentY, 
      this.settings.pageWidth - this.settings.margin, 
      this.currentY
    );
    this.addSpace(6);
  }

  private addSectionHeader(title: string): void {
    this.addSpace(8);
    this.addText(title.toUpperCase(), this.settings.fontSize.header, 'bold', this.settings.colors.primary);
    this.addLine();
  }

  private addContactInfo(contact: any): void {
    // Name
    if (contact.name) {
      this.addText(contact.name, this.settings.fontSize.name, 'bold', this.settings.colors.primary);
      this.addSpace(4);
    }

    // Contact details in a compact format
    const contactDetails = [];
    if (contact.email) contactDetails.push(contact.email);
    if (contact.phone) contactDetails.push(contact.phone);
    if (contact.linkedin) contactDetails.push(contact.linkedin);
    if (contact.address) contactDetails.push(contact.address);

    if (contactDetails.length > 0) {
      this.addText(contactDetails.join(' | '), this.settings.fontSize.small, 'normal', this.settings.colors.secondary);
      this.addSpace(8);
    }
  }

  private addProfessionalSummary(summary: string): void {
    if (!summary) return;
    this.addSectionHeader('Professional Summary');
    this.addText(summary, this.settings.fontSize.body);
    this.addSpace(6);
  }

  private addWorkExperience(experiences: any[]): void {
    if (!experiences || experiences.length === 0) return;
    
    console.log('Adding work experience section with', experiences.length, 'experiences');
    this.addSectionHeader('Professional Experience');

    experiences.forEach((exp, index) => {
      console.log('Processing experience:', exp);
      
      // Job title and company
      const titleLine = exp.position && exp.company ? 
        `${exp.position} - ${exp.company}` : 
        exp.position || exp.company || 'Position';
      
      this.addText(titleLine, this.settings.fontSize.subheader, 'bold');

      // Dates and location
      if (exp.startDate || exp.endDate || exp.location) {
        const dateLocation = [];
        if (exp.startDate) dateLocation.push(exp.startDate);
        if (exp.endDate) dateLocation.push(`- ${exp.endDate}`);
        if (exp.location) dateLocation.push(`| ${exp.location}`);
        
        this.addText(dateLocation.join(' '), this.settings.fontSize.small, 'normal', this.settings.colors.secondary);
      }

      // Responsibilities
      if (exp.responsibilities && exp.responsibilities.length > 0) {
        this.addSpace(2);
        exp.responsibilities.forEach((resp: string) => {
          const bulletText = `• ${resp}`;
          this.addText(bulletText, this.settings.fontSize.body, 'normal', this.settings.colors.text, 10);
        });
      }

      if (index < experiences.length - 1) {
        this.addSpace(6);
      }
    });
    this.addSpace(6);
  }

  private addSkills(skills: string[]): void {
    if (!skills || skills.length === 0) return;
    this.addSectionHeader('Technical Skills');
    
    const skillsText = skills.join(' • ');
    this.addText(skillsText, this.settings.fontSize.body);
    this.addSpace(6);
  }

  private addEducation(education: any[]): void {
    if (!education || education.length === 0) return;
    this.addSectionHeader('Education');

    education.forEach((edu) => {
      const degreeLine = edu.degree && edu.field ? 
        `${edu.degree} in ${edu.field}` : 
        edu.degree || 'Degree';
      
      this.addText(degreeLine, this.settings.fontSize.subheader, 'bold');
      
      const schoolLine = [];
      if (edu.institution) schoolLine.push(edu.institution);
      if (edu.graduationDate) schoolLine.push(edu.graduationDate);
      if (edu.gpa) schoolLine.push(`GPA: ${edu.gpa}`);
      
      if (schoolLine.length > 0) {
        this.addText(schoolLine.join(' | '), this.settings.fontSize.body, 'normal', this.settings.colors.secondary);
      }
      
      this.addSpace(4);
    });
    this.addSpace(6);
  }

  private addProjects(projects: any[]): void {
    if (!projects || projects.length === 0) return;
    this.addSectionHeader('Projects');

    projects.forEach((project) => {
      this.addText(project.name || 'Project', this.settings.fontSize.subheader, 'bold');
      
      if (project.description) {
        this.addText(project.description, this.settings.fontSize.body);
      }
      
      if (project.technologies && project.technologies.length > 0) {
        this.addText(`Technologies: ${project.technologies.join(', ')}`, this.settings.fontSize.small, 'normal', this.settings.colors.secondary);
      }
      
      this.addSpace(4);
    });
    this.addSpace(6);
  }

  private addCertifications(certifications: any[]): void {
    if (!certifications || certifications.length === 0) return;
    this.addSectionHeader('Certifications');

    certifications.forEach((cert) => {
      const certLine = [];
      if (cert.name) certLine.push(cert.name);
      if (cert.issuer && cert.issuer !== 'Unknown') certLine.push(`- ${cert.issuer}`);
      if (cert.date) certLine.push(`(${cert.date})`);
      
      this.addText(certLine.join(' '), this.settings.fontSize.body);
      this.addSpace(2);
    });
    this.addSpace(6);
  }

  private addAchievements(achievements: string[]): void {
    if (!achievements || achievements.length === 0) return;
    this.addSectionHeader('Achievements');

    achievements.forEach((achievement) => {
      this.addText(`• ${achievement}`, this.settings.fontSize.body, 'normal', this.settings.colors.text, 10);
    });
    this.addSpace(6);
  }

  private addLanguages(languages: string[]): void {
    if (!languages || languages.length === 0) return;
    this.addSectionHeader('Languages');
    
    const languagesText = languages.join(' • ');
    this.addText(languagesText, this.settings.fontSize.body);
    this.addSpace(6);
  }

  public generateResumePDF(resume: ParsedResume, filename: string = 'optimized-resume.pdf'): void {
    console.log('Starting PDF generation with resume:', resume);
    
    // Reset position
    this.currentY = this.settings.margin;

    // Add content in priority order
    this.addContactInfo(resume.contact);
    this.addProfessionalSummary(resume.professionalSummary);
    this.addWorkExperience(resume.workExperience);
    this.addSkills(resume.skills);
    this.addEducation(resume.education);
    this.addProjects(resume.projects);
    this.addCertifications(resume.certifications);
    this.addAchievements(resume.achievements);
    this.addLanguages(resume.languages);

    // Add any additional sections
    if (resume.additionalSections) {
      Object.entries(resume.additionalSections).forEach(([sectionName, content]) => {
        if (Array.isArray(content) && content.length > 0) {
          this.addSectionHeader(sectionName);
          content.forEach((item) => {
            this.addText(`• ${item}`, this.settings.fontSize.body, 'normal', this.settings.colors.text, 10);
          });
          this.addSpace(6);
        }
      });
    }

    console.log('PDF generation completed, saving file:', filename);
    this.pdf.save(filename);
  }
}

// Parse optimized resume content from string format
export function parseOptimizedResumeContent(content: string): ParsedResume {
  console.log('Parsing optimized resume content:', content);
  
  const resume: ParsedResume = {
    contact: {
      name: '',
      email: '',
      phone: '',
      linkedin: '',
      address: ''
    },
    professionalSummary: '',
    workExperience: [],
    skills: [],
    education: [],
    projects: [],
    certifications: [],
    achievements: [],
    languages: [],
    additionalSections: {}
  };

  const lines = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  let currentSection = '';
  let currentExperience: any = null;
  let currentEducation: any = null;
  let currentProject: any = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const upperLine = line.toUpperCase();

    // Detect section headers
    if (upperLine.includes('PROFESSIONAL SUMMARY') || upperLine.includes('SUMMARY')) {
      currentSection = 'summary';
      continue;
    } else if (upperLine.includes('PROFESSIONAL EXPERIENCE') || upperLine.includes('WORK EXPERIENCE') || upperLine.includes('EXPERIENCE')) {
      currentSection = 'experience';
      continue;
    } else if (upperLine.includes('TECHNICAL SKILLS') || upperLine.includes('SKILLS')) {
      currentSection = 'skills';
      continue;
    } else if (upperLine.includes('EDUCATION')) {
      currentSection = 'education';
      continue;
    } else if (upperLine.includes('PROJECTS')) {
      currentSection = 'projects';
      continue;
    } else if (upperLine.includes('CERTIFICATIONS')) {
      currentSection = 'certifications';
      continue;
    } else if (upperLine.includes('ACHIEVEMENTS')) {
      currentSection = 'achievements';
      continue;
    } else if (upperLine.includes('LANGUAGES')) {
      currentSection = 'languages';
      continue;
    }

    // Extract contact info from header
    if (i < 5 && !currentSection) {
      if (line.includes('@')) {
        const parts = line.split('|').map(p => p.trim());
        parts.forEach(part => {
          if (part.includes('@')) resume.contact.email = part;
          else if (part.match(/\d{3}-\d{3}-\d{4}|\(\d{3}\)\s*\d{3}-\d{4}/)) resume.contact.phone = part;
          else if (part.includes('linkedin')) resume.contact.linkedin = part;
          else if (!resume.contact.name) resume.contact.name = part;
        });
      } else if (!resume.contact.name && !line.includes('PROFESSIONAL') && !line.includes('SUMMARY')) {
        resume.contact.name = line;
      }
    }

    // Process content based on current section
    switch (currentSection) {
      case 'summary':
        if (line && !upperLine.includes('SUMMARY')) {
          resume.professionalSummary += (resume.professionalSummary ? ' ' : '') + line;
        }
        break;

      case 'experience':
        if (line.startsWith('•')) {
          if (currentExperience) {
            currentExperience.responsibilities.push(line.substring(1).trim());
          }
        } else if (line.includes('-') && !line.startsWith('•')) {
          // Save previous experience
          if (currentExperience) {
            resume.workExperience.push(currentExperience);
          }
          // Start new experience
          const parts = line.split('-');
          currentExperience = {
            position: parts[0]?.trim() || '',
            company: parts[1]?.trim() || '',
            startDate: '',
            endDate: '',
            location: '',
            responsibilities: []
          };
        } else if (currentExperience && line.match(/\d{4}/)) {
          // Date line
          const dateParts = line.split('|');
          if (dateParts.length > 1) {
            currentExperience.location = dateParts[1].trim();
          }
          const dateRange = dateParts[0].trim();
          const dates = dateRange.split('-').map(d => d.trim());
          currentExperience.startDate = dates[0] || '';
          currentExperience.endDate = dates[1] || '';
        }
        break;

      case 'skills':
        if (line && !upperLine.includes('SKILLS')) {
          const skills = line.split(/[•,]/).map(s => s.trim()).filter(s => s);
          resume.skills.push(...skills);
        }
        break;

      case 'education':
        if (line.includes(' in ') || line.includes('Bachelor') || line.includes('Master') || line.includes('PhD')) {
          if (currentEducation) {
            resume.education.push(currentEducation);
          }
          currentEducation = {
            degree: line,
            field: '',
            institution: '',
            graduationDate: '',
            gpa: ''
          };
        } else if (currentEducation && line.match(/\d{4}/)) {
          currentEducation.graduationDate = line;
        } else if (currentEducation && !currentEducation.institution) {
          currentEducation.institution = line;
        }
        break;

      case 'projects':
        if (!line.startsWith('•') && line.length > 3) {
          if (currentProject) {
            resume.projects.push(currentProject);
          }
          currentProject = {
            name: line,
            description: '',
            technologies: []
          };
        } else if (currentProject && line.startsWith('•')) {
          currentProject.description += line.substring(1).trim() + ' ';
        } else if (currentProject && line.toLowerCase().includes('tech')) {
          const techPart = line.split(':')[1];
          if (techPart) {
            currentProject.technologies = techPart.split(',').map(t => t.trim());
          }
        }
        break;

      case 'certifications':
        if (line && !upperLine.includes('CERTIFICATIONS')) {
          const cert = {
            name: line,
            issuer: 'Unknown',
            date: ''
          };
          if (line.includes('(') && line.includes(')')) {
            const match = line.match(/^(.+?)\s*\((.+?)\)$/);
            if (match) {
              cert.name = match[1].trim();
              cert.date = match[2].trim();
            }
          }
          resume.certifications.push(cert);
        }
        break;

      case 'achievements':
        if (line.startsWith('•')) {
          resume.achievements.push(line.substring(1).trim());
        }
        break;

      case 'languages':
        if (line && !upperLine.includes('LANGUAGES')) {
          const languages = line.split(/[•,]/).map(l => l.trim()).filter(l => l);
          resume.languages.push(...languages);
        }
        break;
    }
  }

  // Add final items
  if (currentExperience) {
    resume.workExperience.push(currentExperience);
  }
  if (currentEducation) {
    resume.education.push(currentEducation);
  }
  if (currentProject) {
    resume.projects.push(currentProject);
  }

  console.log('Parsed resume:', resume);
  return resume;
}

export async function generateATSResumePDF(
  element: HTMLElement,
  filename: string = 'optimized-resume.pdf'
): Promise<boolean> {
  console.warn('generateATSResumePDF with element is deprecated. Use generateResumePDFFromContent instead.');
  return false;
}

export function generateResumePDFFromContent(
  resumeContent: string,
  filename: string = 'optimized-resume.pdf'
): boolean {
  try {
    const parsedResume = parseOptimizedResumeContent(resumeContent);
    const generator = new ResumePDFGenerator();
    generator.generateResumePDF(parsedResume, filename);
    
    console.log('Optimized Resume PDF generated successfully');
    return true;
    
  } catch (error) {
    console.error('Error generating optimized resume PDF:', error);
    return false;
  }
}

export function generateDirectResumePDF(resume: ParsedResume, filename: string = 'optimized-resume.pdf'): void {
  console.log('generateDirectResumePDF called with:', resume);
  const generator = new ResumePDFGenerator();
  generator.generateResumePDF(resume, filename);
}
