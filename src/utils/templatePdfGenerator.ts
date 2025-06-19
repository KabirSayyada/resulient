
import jsPDF from 'jspdf';
import { ParsedResume } from '@/types/resumeStructure';

interface TemplateConfig {
  fontSize: {
    name: number;
    section: number;
    body: number;
    small: number;
  };
  spacing: {
    line: number;
    section: number;
    item: number;
  };
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

// Optimized config for single-page layout
const singlePageConfig: TemplateConfig = {
  fontSize: {
    name: 16,      // Reduced from 18-22
    section: 10,   // Reduced from 12
    body: 9,       // Reduced from 10
    small: 8       // Reduced from 9
  },
  spacing: {
    line: 10,      // Reduced from 12
    section: 8,    // Reduced from 12
    item: 4        // Reduced from 6
  },
  margins: {
    top: 30,       // Reduced from 50
    bottom: 30,    // Reduced from 50
    left: 30,      // Reduced from 50
    right: 30      // Reduced from 50
  }
};

class TemplatePDFGenerator {
  private pdf: jsPDF;
  private currentY: number;
  private pageWidth: number;
  private pageHeight: number;
  private config: TemplateConfig;
  private contentWidth: number;

  constructor(config: TemplateConfig = singlePageConfig) {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    
    this.pageWidth = 595.28;
    this.pageHeight = 841.89;
    this.config = config;
    this.contentWidth = this.pageWidth - (this.config.margins.left + this.config.margins.right);
    this.currentY = this.config.margins.top;
  }

  private checkPageBreak(neededHeight: number): boolean {
    const availableHeight = this.pageHeight - this.config.margins.bottom;
    if (this.currentY + neededHeight > availableHeight) {
      // Only add page if absolutely necessary
      this.pdf.addPage();
      this.currentY = this.config.margins.top;
      return true;
    }
    return false;
  }

  private addText(
    text: string,
    fontSize: number,
    fontWeight: 'normal' | 'bold' = 'normal',
    color: string = '#000000',
    indent: number = 0,
    spacingAfter: number = 0
  ): void {
    if (!text || !text.trim()) return;

    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontWeight);
    this.pdf.setTextColor(color);

    const effectiveWidth = this.contentWidth - indent;
    const lines = this.pdf.splitTextToSize(text.trim(), effectiveWidth);
    const totalHeight = lines.length * this.config.spacing.line + spacingAfter;

    this.checkPageBreak(totalHeight);

    lines.forEach((line: string) => {
      this.pdf.text(line, this.config.margins.left + indent, this.currentY);
      this.currentY += this.config.spacing.line;
    });
    
    if (spacingAfter > 0) {
      this.currentY += spacingAfter;
    }
  }

  private addSection(title: string): void {
    this.currentY += this.config.spacing.section * 0.5;
    this.checkPageBreak(this.config.spacing.section * 2);
    
    this.pdf.setFontSize(this.config.fontSize.section);
    this.pdf.setFont('helvetica', 'bold');
    this.pdf.setTextColor('#1f2937');
    this.pdf.text(title.toUpperCase(), this.config.margins.left, this.currentY);
    this.currentY += this.config.spacing.section;
    
    // Thin underline
    this.pdf.setDrawColor(200, 200, 200);
    this.pdf.setLineWidth(0.5);
    this.pdf.line(
      this.config.margins.left, 
      this.currentY - 2, 
      this.pageWidth - this.config.margins.right, 
      this.currentY - 2
    );
    this.currentY += this.config.spacing.section * 0.5;
  }

  public generateClassicTemplate(resume: ParsedResume): void {
    // Header
    if (resume.contact.name) {
      this.addText(resume.contact.name, this.config.fontSize.name, 'bold', '#1f2937', 0, this.config.spacing.section);
    }

    // Contact info in a compact line
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    if (contactInfo) {
      this.addText(contactInfo, this.config.fontSize.small, 'normal', '#6b7280', 0, this.config.spacing.section);
    }

    // Professional Summary
    if (resume.professionalSummary) {
      this.addSection('Professional Summary');
      this.addText(resume.professionalSummary, this.config.fontSize.body, 'normal', '#374151', 0, this.config.spacing.section);
    }

    // Experience
    if (resume.workExperience.length > 0) {
      this.addSection('Professional Experience');
      
      resume.workExperience.forEach((exp, index) => {
        // Job title and company on same line
        const titleLine = `${exp.position || 'Position'} - ${exp.company || 'Company'}`;
        this.addText(titleLine, this.config.fontSize.body, 'normal', '#1f2937', 0, 2);
        
        // Dates and location
        if (exp.startDate || exp.endDate) {
          const dateLocation = [
            exp.startDate && exp.endDate ? `${exp.startDate} - ${exp.endDate}` : exp.startDate || exp.endDate,
            exp.location
          ].filter(Boolean).join(' | ');
          this.addText(dateLocation, this.config.fontSize.small, 'normal', '#6b7280', 0, this.config.spacing.item);
        }
        
        // Responsibilities (limit to top 3 for space)
        if (exp.responsibilities && exp.responsibilities.length > 0) {
          exp.responsibilities.slice(0, 3).forEach((resp) => {
            this.addText(`• ${resp}`, this.config.fontSize.body, 'normal', '#374151', 15, 1);
          });
        }
        
        if (index < resume.workExperience.length - 1) {
          this.currentY += this.config.spacing.item;
        }
      });
    }

    // Skills
    if (resume.skills.length > 0) {
      this.addSection('Technical Skills');
      const skillsText = resume.skills.slice(0, 15).join(', '); // Limit skills for space
      this.addText(skillsText, this.config.fontSize.body, 'normal', '#374151', 0, this.config.spacing.section);
    }

    // Education
    if (resume.education.length > 0) {
      this.addSection('Education');
      
      resume.education.forEach((edu, index) => {
        const degreeLine = `${edu.degree}${edu.field ? ` in ${edu.field}` : ''}`;
        this.addText(degreeLine, this.config.fontSize.body, 'normal', '#1f2937', 0, 1);
        this.addText(edu.institution, this.config.fontSize.body, 'normal', '#6b7280', 0, 1);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, this.config.fontSize.small, 'normal', '#6b7280', 0, this.config.spacing.item);
        }
      });
    }

    // Projects (limit to 2 for space)
    if (resume.projects.length > 0) {
      this.addSection('Key Projects');
      
      resume.projects.slice(0, 2).forEach((project) => {
        this.addText(project.name, this.config.fontSize.body, 'normal', '#1f2937', 0, 1);
        if (project.description) {
          const shortDesc = project.description.length > 100 ? 
            project.description.substring(0, 100) + '...' : project.description;
          this.addText(shortDesc, this.config.fontSize.body, 'normal', '#374151', 0, 1);
        }
        if (project.technologies && project.technologies.length > 0) {
          this.addText(`Technologies: ${project.technologies.slice(0, 5).join(', ')}`, 
            this.config.fontSize.small, 'normal', '#6b7280', 0, this.config.spacing.item);
        }
      });
    }

    // Certifications (limit to 3)
    if (resume.certifications.length > 0) {
      this.addSection('Certifications');
      
      resume.certifications.slice(0, 3).forEach((cert) => {
        const certLine = cert.issuer && cert.issuer !== 'Unknown' ? 
          `${cert.name} - ${cert.issuer}` : cert.name;
        this.addText(certLine, this.config.fontSize.body, 'normal', '#374151', 0, 1);
      });
    }
  }

  public generateModernTemplate(resume: ParsedResume): void {
    // Similar structure but with modern styling
    this.generateClassicTemplate(resume);
  }

  public generateMinimalTemplate(resume: ParsedResume): void {
    // Even more compact version
    const compactConfig = {
      ...this.config,
      fontSize: {
        name: 14,
        section: 9,
        body: 8,
        small: 7
      },
      spacing: {
        line: 9,
        section: 6,
        item: 3
      }
    };
    
    // Apply compact config and generate
    const originalConfig = this.config;
    this.config = compactConfig;
    this.generateClassicTemplate(resume);
    this.config = originalConfig;
  }

  public save(filename: string): void {
    this.pdf.save(filename);
  }
}

export async function generateTemplatePDF(
  resume: ParsedResume,
  templateType: string,
  filename: string
): Promise<boolean> {
  try {
    const generator = new TemplatePDFGenerator();
    
    switch (templateType) {
      case 'modern':
      case 'executive':
      case 'creative':
      case 'tech':
      case 'professional':
      case 'compact':
      case 'clean':
      case 'border':
        generator.generateModernTemplate(resume);
        break;
      case 'minimal':
        generator.generateMinimalTemplate(resume);
        break;
      default:
        generator.generateClassicTemplate(resume);
        break;
    }
    
    generator.save(filename);
    return true;
  } catch (error) {
    console.error('Error generating template PDF:', error);
    return false;
  }
}
