import jsPDF from 'jspdf';
import { ParsedResume, ParsedWorkExperience } from '@/types/resumeStructure';

export interface ResumeTemplate {
  id: string;
  name: string;
  description: string;
  category: 'modern' | 'classic' | 'creative' | 'minimal';
  generator: (resume: ParsedResume, filename?: string) => void;
}

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
  pageWidth: 595.28,
  pageHeight: 841.89,
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

class BaseTemplatePDFGenerator {
  protected pdf: jsPDF;
  protected currentY: number;
  protected settings: PDFSettings;
  protected contentWidth: number;

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

  protected checkPageBreak(neededHeight: number): void {
    if (this.currentY + neededHeight > this.settings.pageHeight - this.settings.margin) {
      this.pdf.addPage();
      this.currentY = this.settings.margin;
    }
  }

  protected addText(
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

    this.checkPageBreak(lines.length * lineHeight);

    for (const line of lines) {
      this.pdf.text(line, this.settings.margin + indent, this.currentY);
      this.currentY += lineHeight;
    }
  }

  protected addSpace(points: number): void {
    this.currentY += points;
  }

  protected addLine(): void {
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

  protected addSectionHeader(title: string): void {
    this.addSpace(8);
    this.addText(title.toUpperCase(), this.settings.fontSize.header, 'bold', this.settings.colors.primary);
    this.addLine();
  }

  protected addContactInfo(contact: any): void {
    if (contact.name) {
      const nameX = this.settings.pageWidth / 2;
      this.pdf.setFontSize(this.settings.fontSize.name);
      this.pdf.setFont('helvetica', 'bold');
      this.pdf.setTextColor(this.settings.colors.primary);
      this.pdf.text(contact.name, nameX, this.currentY, { align: 'center' });
      this.currentY += this.settings.fontSize.name * this.settings.lineHeight.normal;
      this.addSpace(4);
    }

    const contactDetails = [];
    if (contact.email) contactDetails.push(contact.email);
    if (contact.phone) contactDetails.push(contact.phone);
    if (contact.linkedin) contactDetails.push(contact.linkedin);
    if (contact.website) contactDetails.push(contact.website);
    if (contact.address) contactDetails.push(contact.address);

    if (contactDetails.length > 0) {
      this.pdf.setFontSize(this.settings.fontSize.small);
      this.pdf.setFont('helvetica', 'normal');
      this.pdf.setTextColor(this.settings.colors.secondary);
      
      const contactLine = contactDetails.join(' | ');
      const contactX = this.settings.pageWidth / 2;
      this.pdf.text(contactLine, contactX, this.currentY, { align: 'center' });
      this.currentY += this.settings.fontSize.small * this.settings.lineHeight.normal;
      this.addSpace(8);
    }
  }

  protected addWorkExperience(experiences: ParsedWorkExperience[]): void {
    if (!experiences || experiences.length === 0) return;
    
    this.addSectionHeader('Professional Experience');

    experiences.forEach((exp, index) => {
      const titleLine = exp.position && exp.company ? 
        `${exp.position} - ${exp.company}` : 
        exp.position || exp.company || 'Position';
      
      this.addText(titleLine, this.settings.fontSize.subheader, 'bold');

      if (exp.startDate || exp.endDate || exp.location) {
        const dateLocation = [];
        if (exp.startDate) dateLocation.push(exp.startDate);
        if (exp.endDate) dateLocation.push(`- ${exp.endDate}`);
        if (exp.location) dateLocation.push(`| ${exp.location}`);
        
        this.addText(dateLocation.join(' '), this.settings.fontSize.small, 'normal', this.settings.colors.secondary);
      }

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

  protected addVolunteerExperience(experiences: ParsedWorkExperience[]): void {
    if (!experiences || experiences.length === 0) return;
    
    this.addSectionHeader('Volunteer Experience');

    experiences.forEach((exp, index) => {
      const titleLine = exp.position && exp.company ? 
        `${exp.position} - ${exp.company}` : 
        exp.position || exp.company || 'Volunteer';
      
      this.addText(titleLine, this.settings.fontSize.subheader, 'bold');

      if (exp.startDate || exp.endDate || exp.location) {
        const dateLocation = [];
        if (exp.startDate) dateLocation.push(exp.startDate);
        if (exp.endDate) dateLocation.push(`- ${exp.endDate}`);
        if (exp.location) dateLocation.push(`| ${exp.location}`);
        
        this.addText(dateLocation.join(' '), this.settings.fontSize.small, 'normal', this.settings.colors.secondary);
      }

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

  public generatePDF(resume: ParsedResume, filename: string = 'resume.pdf'): void {
    this.currentY = this.settings.margin;

    this.addContactInfo(resume.contact);
    
    if (resume.professionalSummary) {
      this.addSectionHeader('Professional Summary');
      this.addText(resume.professionalSummary, this.settings.fontSize.body);
      this.addSpace(6);
    }

    this.addWorkExperience(resume.workExperience);
    this.addVolunteerExperience(resume.volunteerExperience);

    if (resume.skills && resume.skills.length > 0) {
      this.addSectionHeader('Skills');
      const skillsText = resume.skills.join(' • ');
      this.addText(skillsText, this.settings.fontSize.body);
      this.addSpace(6);
    }

    if (resume.education && resume.education.length > 0) {
      this.addSectionHeader('Education');
      resume.education.forEach((edu) => {
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

    if (resume.projects && resume.projects.length > 0) {
      this.addSectionHeader('Projects');
      resume.projects.forEach((project) => {
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

    if (resume.certifications && resume.certifications.length > 0) {
      this.addSectionHeader('Certifications');
      resume.certifications.forEach((cert) => {
        const certLine = [];
        if (cert.name) certLine.push(cert.name);
        if (cert.issuer && cert.issuer !== 'Unknown') certLine.push(`- ${cert.issuer}`);
        if (cert.date) certLine.push(`(${cert.date})`);
        
        this.addText(certLine.join(' '), this.settings.fontSize.body);
        this.addSpace(2);
      });
      this.addSpace(6);
    }

    if (resume.achievements && resume.achievements.length > 0) {
      this.addSectionHeader('Achievements');
      resume.achievements.forEach((achievement) => {
        this.addText(`• ${achievement}`, this.settings.fontSize.body, 'normal', this.settings.colors.text, 10);
      });
      this.addSpace(6);
    }

    if (resume.languages && resume.languages.length > 0) {
      this.addSectionHeader('Languages');
      const languagesText = resume.languages.join(' • ');
      this.addText(languagesText, this.settings.fontSize.body);
      this.addSpace(6);
    }

    this.pdf.save(filename);
  }
}

export const resumeTemplates: ResumeTemplate[] = [
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional format with clear sections',
    category: 'classic',
    generator: (resume: ParsedResume, filename = 'classic-resume.pdf') => {
      const generator = new BaseTemplatePDFGenerator();
      generator.generatePDF(resume, filename);
    }
  }
];

export function generateTemplatePDF(templateId: string, resume: ParsedResume, filename?: string): void {
  const template = resumeTemplates.find(t => t.id === templateId);
  if (!template) {
    throw new Error(`Template ${templateId} not found`);
  }
  
  template.generator(resume, filename);
}
