
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
    if (this.currentY + (lines.length * lineHeight) > this.settings.pageHeight - this.settings.margin) {
      // Try to fit on current page with tighter spacing
      const tightLineHeight = fontSize * this.settings.lineHeight.tight;
      if (this.currentY + (lines.length * tightLineHeight) <= this.settings.pageHeight - this.settings.margin) {
        // Use tight spacing
        for (const line of lines) {
          this.pdf.text(line, this.settings.margin + indent, this.currentY);
          this.currentY += tightLineHeight;
        }
      } else {
        // Truncate content to fit on one page
        const availableSpace = this.settings.pageHeight - this.settings.margin - this.currentY;
        const maxLines = Math.floor(availableSpace / tightLineHeight);
        const truncatedLines = lines.slice(0, Math.max(1, maxLines));
        
        for (const line of truncatedLines) {
          this.pdf.text(line, this.settings.margin + indent, this.currentY);
          this.currentY += tightLineHeight;
        }
      }
    } else {
      for (const line of lines) {
        this.pdf.text(line, this.settings.margin + indent, this.currentY);
        this.currentY += lineHeight;
      }
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
    this.addSpace(8);
  }

  private addSectionHeader(title: string): void {
    this.addSpace(6);
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
    this.addSpace(4);
  }

  private addWorkExperience(experiences: any[]): void {
    if (!experiences || experiences.length === 0) return;
    this.addSectionHeader('Professional Experience');

    experiences.forEach((exp, index) => {
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
        exp.responsibilities.slice(0, 4).forEach((resp: string) => {
          const bulletText = `• ${resp}`;
          this.addText(bulletText, this.settings.fontSize.body, 'normal', this.settings.colors.text, 10);
        });
      }

      if (index < experiences.length - 1) {
        this.addSpace(6);
      }
    });
    this.addSpace(4);
  }

  private addSkills(skills: string[]): void {
    if (!skills || skills.length === 0) return;
    this.addSectionHeader('Technical Skills');
    
    const skillsText = skills.slice(0, 25).join(' • ');
    this.addText(skillsText, this.settings.fontSize.body);
    this.addSpace(4);
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
      
      this.addSpace(3);
    });
    this.addSpace(4);
  }

  private addProjects(projects: any[]): void {
    if (!projects || projects.length === 0) return;
    this.addSectionHeader('Projects');

    projects.slice(0, 3).forEach((project) => {
      this.addText(project.name || 'Project', this.settings.fontSize.subheader, 'bold');
      
      if (project.description) {
        const truncatedDesc = project.description.length > 120 ? 
          project.description.substring(0, 120) + '...' : 
          project.description;
        this.addText(truncatedDesc, this.settings.fontSize.body);
      }
      
      if (project.technologies && project.technologies.length > 0) {
        this.addText(`Technologies: ${project.technologies.join(', ')}`, this.settings.fontSize.small, 'normal', this.settings.colors.secondary);
      }
      
      this.addSpace(4);
    });
  }

  private addCertifications(certifications: any[]): void {
    if (!certifications || certifications.length === 0) return;
    this.addSectionHeader('Certifications');

    certifications.slice(0, 4).forEach((cert) => {
      const certLine = [];
      if (cert.name) certLine.push(cert.name);
      if (cert.issuer && cert.issuer !== 'Unknown') certLine.push(`- ${cert.issuer}`);
      if (cert.date) certLine.push(`(${cert.date})`);
      
      this.addText(certLine.join(' '), this.settings.fontSize.body);
      this.addSpace(2);
    });
    this.addSpace(4);
  }

  private addAchievements(achievements: string[]): void {
    if (!achievements || achievements.length === 0) return;
    this.addSectionHeader('Achievements');

    achievements.slice(0, 4).forEach((achievement) => {
      this.addText(`• ${achievement}`, this.settings.fontSize.body, 'normal', this.settings.colors.text, 10);
    });
    this.addSpace(4);
  }

  public generateResumePDF(resume: ParsedResume, filename: string = 'optimized-resume.pdf'): void {
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

    // Add any additional sections
    if (resume.additionalSections) {
      Object.entries(resume.additionalSections).forEach(([sectionName, content]) => {
        if (Array.isArray(content) && content.length > 0) {
          this.addSectionHeader(sectionName);
          content.slice(0, 3).forEach((item) => {
            this.addText(`• ${item}`, this.settings.fontSize.body, 'normal', this.settings.colors.text, 10);
          });
          this.addSpace(4);
        }
      });
    }

    // Save the PDF
    this.pdf.save(filename);
  }
}

export async function generateATSResumePDF(
  element: HTMLElement,
  filename: string = 'optimized-resume.pdf'
): Promise<boolean> {
  // This function is kept for backward compatibility but not used for the new text-based PDF
  console.warn('generateATSResumePDF with element is deprecated. Use generateResumePDFFromContent instead.');
  return false;
}

export function generateResumePDFFromContent(
  resumeContent: string,
  filename: string = 'optimized-resume.pdf'
): boolean {
  try {
    // Import the parser
    const { parseResumeContent } = require('./resumeParser');
    
    // Parse the resume content
    const parsedResume = parseResumeContent(resumeContent);
    
    // Generate PDF
    const generator = new ResumePDFGenerator();
    generator.generateResumePDF(parsedResume, filename);
    
    console.log('Text-based ATS Resume PDF generated successfully');
    return true;
    
  } catch (error) {
    console.error('Error generating text-based resume PDF:', error);
    return false;
  }
}

export function generateDirectResumePDF(resume: ParsedResume, filename: string = 'optimized-resume.pdf'): void {
  const generator = new ResumePDFGenerator();
  generator.generateResumePDF(resume, filename);
}
