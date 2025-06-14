
import jsPDF from 'jspdf';
import { ParsedResume } from '@/types/resumeStructure';

type TemplateType = 'classic' | 'modern' | 'minimal' | 'executive';

// Enhanced PDF generator that creates text-based PDFs with proper formatting
class TemplatePDFGenerator {
  private pdf: jsPDF;
  private currentY: number;
  private pageWidth: number;
  private pageHeight: number;
  private margin: number;
  private contentWidth: number;

  constructor() {
    this.pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });
    this.pageWidth = 595.28;
    this.pageHeight = 841.89;
    this.margin = 40;
    this.contentWidth = this.pageWidth - (this.margin * 2);
    this.currentY = this.margin;
  }

  private checkPageBreak(neededHeight: number): void {
    if (this.currentY + neededHeight > this.pageHeight - this.margin) {
      this.pdf.addPage();
      this.currentY = this.margin;
    }
  }

  private addSpace(points: number): void {
    this.currentY += points;
  }

  private addText(
    text: string,
    fontSize: number,
    fontStyle: 'normal' | 'bold' = 'normal',
    color: string = '#000000',
    align: 'left' | 'center' | 'right' = 'left',
    indent: number = 0
  ): void {
    if (!text || text.trim() === '') return;

    this.pdf.setFontSize(fontSize);
    this.pdf.setFont('helvetica', fontStyle);
    this.pdf.setTextColor(color);

    const effectiveWidth = this.contentWidth - indent;
    const lines = this.pdf.splitTextToSize(text, effectiveWidth);
    const lineHeight = fontSize * 1.4; // Reduced from 1.5 for better spacing

    this.checkPageBreak(lines.length * lineHeight);

    for (const line of lines) {
      let xPosition = this.margin + indent;
      if (align === 'center') {
        xPosition = this.pageWidth / 2;
      } else if (align === 'right') {
        xPosition = this.pageWidth - this.margin;
      }

      this.pdf.text(line, xPosition, this.currentY, { align });
      this.currentY += lineHeight;
    }
  }

  private addLine(color: string = '#cccccc', width: number = 0.5): void {
    this.addSpace(6); // Increased space before line
    this.pdf.setDrawColor(color);
    this.pdf.setLineWidth(width);
    this.pdf.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.addSpace(12); // Increased space after line to prevent text overlap
  }

  // Classic template formatting - Fixed spacing issues
  private generateClassicTemplate(resume: ParsedResume): void {
    // Header
    this.addText(resume.contact.name || '', 18, 'bold', '#000000', 'center');
    this.addSpace(12);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    this.addText(contactInfo, 10, 'normal', '#666666', 'center');
    this.addSpace(24);

    // Professional Summary
    if (resume.professionalSummary) {
      this.addText('PROFESSIONAL SUMMARY', 12, 'bold', '#333333');
      this.addLine();
      this.addText(resume.professionalSummary, 10);
      this.addSpace(20);
    }

    // Work Experience
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 12, 'bold', '#333333');
      this.addLine();
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 11, 'bold');
        this.addSpace(3);
        this.addText(`${exp.company || ''} | ${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'normal', '#666666');
        this.addSpace(8);
        
        if (exp.responsibilities) {
          exp.responsibilities.forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#000000', 'left', 15);
            this.addSpace(3); // Reduced from excessive spacing
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(16);
      });
      this.addSpace(20);
    }

    // Skills
    if (resume.skills.length > 0) {
      this.addText('TECHNICAL SKILLS', 12, 'bold', '#333333');
      this.addLine();
      this.addText(resume.skills.join(' • '), 10);
      this.addSpace(20);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 12, 'bold', '#333333');
      this.addLine();
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold');
        this.addSpace(3);
        this.addText(`${edu.institution || ''} | ${edu.graduationDate || ''}`, 10, 'normal', '#666666');
        this.addSpace(12);
      });
    }
  }

  // Modern template formatting
  private generateModernTemplate(resume: ParsedResume): void {
    // Header with blue accent
    this.addText(resume.contact.name || '', 20, 'bold', '#1e40af');
    this.addSpace(12);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    this.addText(contactInfo, 10, 'normal', '#374151');
    this.addLine('#3b82f6', 2);
    this.addSpace(20);

    // Professional Summary with background effect (simulated with spacing)
    if (resume.professionalSummary) {
      this.addText('PROFESSIONAL SUMMARY', 12, 'bold', '#1e40af');
      this.addSpace(12);
      this.addText(resume.professionalSummary, 10, 'normal', '#111827');
      this.addSpace(20);
    }

    // Work Experience with left border effect
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 12, 'bold', '#1e40af');
      this.addSpace(12);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(exp.company || '', 10, 'bold', '#3b82f6');
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} - ${exp.endDate || ''}`, 10, 'normal', '#6b7280');
        }
        this.addSpace(8);
        
        if (exp.responsibilities) {
          exp.responsibilities.slice(0, 4).forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(16);
      });
      this.addSpace(20);
    }

    // Skills in tag-like format
    if (resume.skills.length > 0) {
      this.addText('TECHNICAL SKILLS', 12, 'bold', '#1e40af');
      this.addSpace(12);
      
      let skillsLine = '';
      resume.skills.slice(0, 15).forEach((skill, index) => {
        skillsLine += skill;
        if (index < resume.skills.slice(0, 15).length - 1) skillsLine += ' | ';
      });
      this.addText(skillsLine, 10, 'normal', '#374151');
      this.addSpace(20);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 12, 'bold', '#1e40af');
      this.addSpace(12);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'normal', '#374151');
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'normal', '#6b7280');
        }
        this.addSpace(12);
      });
    }
  }

  // Minimal template formatting
  private generateMinimalTemplate(resume: ParsedResume): void {
    // Clean header
    this.addText(resume.contact.name || '', 22, 'normal', '#111827', 'center');
    this.addSpace(16);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean);
    
    contactInfo.forEach(info => {
      this.addText(info, 10, 'normal', '#6b7280', 'center');
      this.addSpace(2);
    });
    
    // Small decorative line
    this.addSpace(12);
    this.pdf.setDrawColor('#d1d5db');
    this.pdf.setLineWidth(0.5);
    const lineStart = this.pageWidth / 2 - 30;
    const lineEnd = this.pageWidth / 2 + 30;
    this.pdf.line(lineStart, this.currentY, lineEnd, this.currentY);
    this.addSpace(24);

    // Summary
    if (resume.professionalSummary) {
      this.addText('SUMMARY', 11, 'normal', '#374151');
      this.addSpace(12);
      this.addText(resume.professionalSummary, 10, 'normal', '#4b5563');
      this.addSpace(20);
    }

    // Experience
    if (resume.workExperience.length > 0) {
      this.addText('EXPERIENCE', 11, 'normal', '#374151');
      this.addSpace(12);
      
      resume.workExperience.forEach((exp, index) => {
        this.addText(exp.position || '', 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(exp.company || '', 10, 'normal', '#6b7280');
        this.addSpace(3);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} – ${exp.endDate || ''}`, 9, 'normal', '#9ca3af');
        }
        this.addSpace(8);
        
        if (exp.responsibilities) {
          exp.responsibilities.slice(0, 3).forEach(resp => {
            this.addText(`• ${resp}`, 10, 'normal', '#4b5563', 'left', 15);
            this.addSpace(3);
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(16);
      });
      this.addSpace(20);
    }

    // Skills
    if (resume.skills.length > 0) {
      this.addText('SKILLS', 11, 'normal', '#374151');
      this.addSpace(12);
      this.addText(resume.skills.slice(0, 20).join(' • '), 10, 'normal', '#4b5563');
      this.addSpace(20);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 11, 'normal', '#374151');
      this.addSpace(12);
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827');
        this.addSpace(3);
        this.addText(edu.institution || '', 10, 'normal', '#6b7280');
        this.addSpace(3);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 9, 'normal', '#9ca3af');
        }
        this.addSpace(12);
      });
    }
  }

  // Executive template formatting - Fixed bullet points and spacing
  private generateExecutiveTemplate(resume: ParsedResume): void {
    // Executive header
    this.addText(resume.contact.name?.toUpperCase() || '', 20, 'bold', '#111827');
    this.addSpace(8);
    this.addLine('#1f2937', 1);
    
    const contactInfo = [
      resume.contact.email,
      resume.contact.phone,
      resume.contact.linkedin,
      resume.contact.address
    ].filter(Boolean).join(' | ');
    
    this.addText(contactInfo, 10, 'bold', '#4b5563');
    this.addSpace(24);

    // Executive Summary
    if (resume.professionalSummary) {
      this.addText('EXECUTIVE SUMMARY', 12, 'bold', '#111827');
      this.addLine('#6b7280');
      this.addText(resume.professionalSummary, 10, 'bold', '#374151');
      this.addSpace(20);
    }

    // Core Competencies
    if (resume.skills.length > 0) {
      this.addText('CORE COMPETENCIES', 12, 'bold', '#111827');
      this.addLine('#6b7280');
      
      const skillsPerRow = 3;
      const skillsRows = [];
      for (let i = 0; i < resume.skills.slice(0, 18).length; i += skillsPerRow) {
        skillsRows.push(resume.skills.slice(i, i + skillsPerRow));
      }
      
      skillsRows.forEach(row => {
        const rowText = row.map(skill => `• ${skill}`).join('   ');
        this.addText(rowText, 10, 'bold', '#4b5563');
        this.addSpace(5);
      });
      this.addSpace(16);
    }

    // Professional Experience
    if (resume.workExperience.length > 0) {
      this.addText('PROFESSIONAL EXPERIENCE', 12, 'bold', '#111827');
      this.addLine('#6b7280');
      
      resume.workExperience.forEach((exp, index) => {
        this.addText((exp.position || '').toUpperCase(), 11, 'bold', '#111827');
        this.addSpace(4);
        this.addText(exp.company || '', 10, 'bold', '#4b5563');
        this.addSpace(4);
        if (exp.startDate || exp.endDate) {
          this.addText(`${exp.startDate || ''} – ${exp.endDate || ''}`, 10, 'bold', '#6b7280');
        }
        this.addSpace(8);
        
        if (exp.responsibilities) {
          exp.responsibilities.slice(0, 4).forEach(resp => {
            // Fixed bullet point rendering - using standard bullet character
            this.addText(`• ${resp}`, 10, 'normal', '#374151', 'left', 10);
            this.addSpace(4); // Reduced spacing after bullet points
          });
        }
        
        if (index < resume.workExperience.length - 1) this.addSpace(16);
      });
      this.addSpace(20);
    }

    // Education
    if (resume.education.length > 0) {
      this.addText('EDUCATION', 12, 'bold', '#111827');
      this.addLine('#6b7280');
      
      resume.education.forEach(edu => {
        const degreeLine = `${edu.degree || ''} ${edu.field ? `in ${edu.field}` : ''}`;
        this.addText(degreeLine, 11, 'bold', '#111827');
        this.addSpace(4);
        this.addText(edu.institution || '', 10, 'bold', '#4b5563');
        this.addSpace(4);
        if (edu.graduationDate) {
          this.addText(edu.graduationDate, 10, 'bold', '#6b7280');
        }
        this.addSpace(12);
      });
    }
  }

  public generate(resume: ParsedResume, templateType: TemplateType): void {
    this.currentY = this.margin;
    
    switch (templateType) {
      case 'classic':
        this.generateClassicTemplate(resume);
        break;
      case 'modern':
        this.generateModernTemplate(resume);
        break;
      case 'minimal':
        this.generateMinimalTemplate(resume);
        break;
      case 'executive':
        this.generateExecutiveTemplate(resume);
        break;
      default:
        this.generateClassicTemplate(resume);
    }
  }

  public save(filename: string): void {
    this.pdf.save(filename);
  }
}

export const generateTemplatePDF = async (
  resume: ParsedResume,
  templateType: TemplateType,
  filename: string
): Promise<boolean> => {
  try {
    console.log('Generating text-based PDF for template:', templateType);
    
    const generator = new TemplatePDFGenerator();
    generator.generate(resume, templateType);
    generator.save(filename);
    
    console.log('Text-based PDF generated successfully');
    return true;
  } catch (error) {
    console.error('Error generating text-based template PDF:', error);
    return false;
  }
};
